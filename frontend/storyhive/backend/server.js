//adding all of our dependencies
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const saltRounds = 10;
const PORT = process.env.PORT || 10000;
const { NodeSSH } = require("node-ssh");
var cors = require("cors");
const path = require("path");
const buildPath = path.join(__dirname, "../build");
const bodyParser = require("body-parser");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text());

//create ssh object that will log into our ec2
const ssh = new NodeSSH();

//created an endpoint `/fetch-data` that we can use to fetch data from any MongoDB collection by passing the collection name as a query parameter
//the frontend will call this endpoint and specify the collection name in the request (e.g., `collection=posts` or `collection=clicked`)
app.get("/fetch-data", async (req, res) => {
  const { collection } = req.query;
  const query = `db.${collection}.find({},{_id:0}).pretty()`;
  //const userQuery = `db.${collection}.find({ userName: {$exists: true, $eq: "flowerPower"}}).pretty()`;

  if (!collection) {
    return res.status(400).send("Collection not specified");
  }

  ssh
    .connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then((status) => {
      //`mongo --quiet --eval '${query}'`
      ssh
        .execCommand("mongosh testDB --quiet --eval '" + query + "'")
        .then(function (result) {
          const data = result.stdout;
          console.log("hi");
          res.send(data);
        });
    });
});

/*app.post('/check-form', (req, res) => {
  let input = req.body;
  let user = input.name;
  let pass = input.pass;
  ssh.connect({
    //credentials stored in .env
    host: process.env.SECRET_IP,
    username: process.env.SECRET_USER,
    privateKeyPath: process.env.SECRET_KEY,
  }).then((status) => {
    //`mongo --quiet --eval '${query}'`
      const userQuery = `db.user.find({ userName: {$exists: true, $eq: "${user}"}, password: {$exists: true, $eq: "${pass}"}}).pretty()`;
      ssh.execCommand("mongosh testDB --quiet --eval '" + userQuery + "'").then(function(result){
        const data = result.stdout;
        console.log(data);
        console.log("request received");
        return res.send("login successful!");
      });
  });
})*/

app.post("/check-form", (req, res) => {
  //parsing the json we received
  let input = req.body;
  let user = input.name;
  let pass = input.pass;
  ssh
    .connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then((status) => {
      //searches the user collection to see if the given username and password match an entity in the collection
      const userQuery = `db.user.find({ userName: {$exists: true, $eq: "${user}"}, password: {$exists: true, $eq: "${pass}"}}).pretty()`;
      ssh
        .execCommand("mongosh testDB --quiet --eval '" + userQuery + "'")
        .then(function (result) {
          const data = result.stdout;
          let output = "";
          //mongodb returns an empty string if there are no matches. if data is empty, the wrong credentials were entered
          if (data === "") {
            output = "Username or password do not match an existing user!";
          } else {
            output = "Login successful!";
          }
          res.json({
            status: output,
          });
        });
    });
});

//created endpoint for our register function '/register' that will input a user's registration data into our MongoDB collection
app.post("/register", (req, res) => {
  //parsing information received

  let input = req.body;
  let user = input.name;
  let pass = input.pass;
  let email = input.email;

  ssh
    .connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then((status) => {
      //searches the user collection to see if the given username and password match an entity in the collection
      const userQuery = `db.user.find({ userName: {$exists: true, $eq: "${user}"}, password: {$exists: true, $eq: "${pass}"}, email: {$exists: true, $eq: "${email}"}}).pretty()`;
      ssh
        .execCommand("mongosh testDB --quiet --eval '" + userQuery + "'")
        .then(function (result) {
          const data = result.stdout;
          let output = "";
          //if data empty, allow user to create account
          if (data === "") {
            const insertUserQuery = `
          db.user.insertOne({
            userID: ObjectId(),
            userName: "${user}",
            password: "${pass}",
            email: "${email}",
            createdAt: new Date()
          })
        `;
            // Insert the user if the query returns no results (meaning no existing user with that data)
            ssh
              .execCommand(
                "mongosh testDB --quiet --eval '" + insertUserQuery + "'"
              )
              .then(function (insertResult) {
                output = "Registration successful!";
                res.json({
                  status: output,
                });
              })
              .catch((error) => {
                output = "Failed to insert user: " + error.message;
                res.json({
                  status: output,
                });
              });
          } else {
            // User already exists
            output = "Registration not successful, user already exists.";
            res.json({
              status: output,
            });
          }
        })
        .catch((error) => {
          output = "Failed to query user: " + error.message;
          res.json({
            status: output,
          });
        });
    })
    .catch((error) => {
      res.json({
        status: "SSH connection failed: " + error.message,
      });
    });
});

// Route to handle sign-up
app.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Auto-generate a salt and hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store the user in the database
    const newUser = {
      userName,
      email,
      password: hashedPassword, // Store the hashed password
    };

    // Insert the new user into the collection
    db.collection("users").insertOne(newUser, (err, result) => {
      if (err) {
        return res.status(500).send("Error saving user to the database");
      }
      res.status(201).send("User created successfully");
    });
  } catch (error) {
    res.status(500).send("Error hashing password");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Fetch the user from the database (replace with your database code)
  db.collection("users").findOne({ email }, async (err, user) => {
    if (err || !user) {
      return res.status(400).send("User not found");
    }

    try {
      // Compare the password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.status(200).send("Login successful");
      } else {
        res.status(400).send("Invalid password");
      }
    } catch (error) {
      res.status(500).send("Error comparing passwords");
    }
  });
});

//launches the frontend from server.js
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
