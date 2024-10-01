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

let current_user = "flowerPower";

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

//login endpoint
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
      const userQuery = `db.user.find({ _id: {$exists: true, $eq: "${user}"}, password: {$exists: true, $eq: "${pass}"}}).pretty()`;
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
            current_user = input.name;
            console.log("After login, the current user is: " + current_user);
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
  let userr = input.namer;
  let passr = input.passr;
  let email = input.emailr;

  ssh
    .connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then((status) => {
      //searches the user collection to see if the given username and password match an entity in the collection
      const userQuery = `db.user.find({ _id: {$exists: true, $eq: "${userr}"}, password: {$exists: true, $eq: "${passr}"}, email: {$exists: true, $eq: "${email}"}}).pretty()`;
      ssh
        .execCommand("mongosh testDB --quiet --eval '" + userQuery + "'")
        .then(function (result) {
          const data = result.stdout;
          let output = "";
          //if data empty, allow user to create account
          if (data === "") {
            const insertUserQuery = `
          db.user.insertOne({
            _id: "${userr}",
            password: "${passr}",
            email: "${email}",
            createdAt: new Date()
          })`;
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

app.get("/posts", (req, res) => {
  try{
    ssh.connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then((status) => {
      //EJSON.stringify() is NECESSARY for converting to proper JSON format!!!
      //TO-DO LIST:
      // - adjust database to include username as a primary key so that we can search for posts by users through their username and not their id.
      //   the Object id in the below query is for the user called flowerPower
      // - COMPLETE: we need to pass the username of the currently logged in user to this /posts route
      // - COMPLETE: modify the query below to search for posts from the current user. it should return a JSON containing the text for each post a user has made
      // - create a Post component in React. When users make a post, it should go to the database
      // - on login, we must run a for loop(INSIDE THE POST COMPONENT AND NOT THIS SERVER.JS FILE) to render a post component for each post text returned by this /posts route

      // ONCE WE HAVE MADE USERNAME A PRIMARY KEY, USE THE FOLLOWING QUERY INSTEAD:
      // "mongosh testDB --quiet --eval 'EJSON.stringify(db.posts.find({},{userName: {$eq: "${current_user}"}, textContent: 1}).toArray())'"
      //ObjectId('66ec6fdc702d84b845964034')
      //db.user.find({ userName: {$exists: true, $eq: "${user}"}, password: {$exists: true, $eq: "${pass}"}})
      ssh
        .execCommand("mongosh testDB --quiet --eval 'EJSON.stringify(db.posts.find({},{_useID: " + `"${current_user}"` + ", textContent: 1}).toArray())'")
        .then(function (result) {
          const data = result.stdout;
          console.log("The current user is: " + current_user);
          res.send(data);
        });
    });
  }catch(error){
    res.status(500).json({message: error.message});
  }
})


//USED TO TEST THE /POSTS ROUTE. DELETE ONCE WE CAN SUCCESSFULLY CREATE POSTS
fetch("http://localhost:10000/posts")
  .then((response) => response.json())
  .then((json) => {
    for(var key in json){
      //key refers to the index of each post in the db's posts collection. Each post has a field called textContent
      console.log(key + ": " + json[key].textContent)
    }
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
