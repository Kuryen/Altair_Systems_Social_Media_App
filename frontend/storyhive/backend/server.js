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

let current_user = "";

//created an endpoint `/fetch-data` that we can use to fetch data from any MongoDB collection by passing the collection name as a query parameter
//the frontend will call this endpoint and specify the collection name in the request (e.g., `collection=posts` or `collection=clicked`)
app.get("/fetch-data", async (req, res) => {
  const { collection } = req.query;
  const query = `JSON.stringify(db.${collection}.find({}, { _id: 1, name: 1 }).toArray())`;

  if (!collection) {
    return res.status(400).send("Collection not specified");
  }

  ssh
    .connect({
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then(() => {
      ssh
        .execCommand("mongosh testDB --quiet --eval '" + query + "'")
        .then((result) => {
          try {
            const data = JSON.parse(result.stdout);
            res.json(data);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            res.status(500).json({ error: "Error parsing data from database" });
          }
        });
    })
    .catch((error) => {
      console.error("SSH connection error:", error);
      res.status(500).json({ error: "Failed to connect to the database" });
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

//USED TO GET POSTS RELATED TO A USER
app.get("/posts", (req, res) => {
  try {
    ssh
      .connect({
        //credentials stored in .env
        host: process.env.SECRET_IP,
        username: process.env.SECRET_USER,
        privateKeyPath: process.env.SECRET_KEY,
      })
      .then((status) => {
        ssh
          .execCommand(
            "mongosh testDB --quiet --eval 'EJSON.stringify(db.posts.find({},{_userID: " +
              `"${current_user}"` +
              ", textContent: 1, userID: 1, createdAt: 1, likeCount: 1, commentCount: 1, sharesCount: 1}).toArray())'"
          )
          .then(function (result) {
            const data = result.stdout;
            res.send(data);
          });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//USED TO INSERT POSTS INTO THE DATABASE
app.post("/make-post", (req, res) => {
  //parsing the json we received
  let userID = current_user;
  let input = req.body;
  let contents = input.textContent;
  let media = "";
  let likeCount = 0;
  let commentCount = 0;
  let sharesCount = 0;
  ssh
    .connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    })
    .then((status) => {
      //searches the user collection to see if the given username and password match an entity in the collection
      const postQuery = `db.posts.insertOne({
            userID: "${userID}",
            textContent: "${contents}",
            media: "${media}",
            likeCount: "${likeCount}",
            commentCount: "${commentCount}",
            sharesCount: "${sharesCount}",
            createdAt: new Date()
          })`;
      ssh
        .execCommand(
          "mongosh testDB --quiet --eval 'EJSON.stringify(" +
            postQuery +
            ".toArray())'"
        )
        .then(function (result) {
          const data = result.stdout;
          let output = data.acknowledged;
          output = "Post created successfully!";
          res.json({
            status: output,
          });
        });
    });
});

// POST ROUTE WILL ADD A FRIEND TO THE DATABASE
app.post("/add-friend", (req, res) => {
  // Parsing information received
  let input = req.body;
  let user = input.user;
  let friend = input.friend;

  ssh.connect({
    // Credentials stored in .env
    host: process.env.SECRET_IP,
    username: process.env.SECRET_USER,
    privateKeyPath: process.env.SECRET_KEY,
  })
  .then(() => {
    // Check if the friend relationship already exists
    const checkFriendExistsQuery = `db.friends.findOne({ userID: "${user}", friendID: "${friend}" })`;
    
    ssh.execCommand(`mongosh testDB --quiet --eval 'EJSON.stringify(${checkFriendExistsQuery})'`)
      .then((result) => {
        if (result.stdout && result.stdout !== "null") {
          // If the friend relationship already exists, respond with a message and skip the rest of the code
          return res.json({ status: "Friend already added!" });
        }

        // If the friend relationship does not exist, proceed with the original code
        ssh.execCommand(
          "mongosh testDB --quiet --eval 'EJSON.stringify(db.user.find({ _id: {$exists: true, $eq: \"" + friend + "\"}}).toArray())'"
        )
        .then(function (result) {
          const data = result.stdout;
          let output = "";
          // If data is empty, friend does not exist
          if (data === "") {
            output = "Friend not found";
            res.json({
              status: output,
            });
          } else {
            const insertFriend = `
              db.friends.insertOne({
                userID: "${user}",
                friendID: "${friend}",
                status: "friends",
                createdAt: new Date()
              })
            `;
            ssh.execCommand(
              "mongosh testDB --quiet --eval 'EJSON.stringify(" + insertFriend + ")'"
            )
            .then(function (result) {
              const data = result.stdout;
              let output = data.acknowledged;
              output = "Friend added successfully!";
              res.json({
                status: output,
              });
            });
          }
        })
        .catch((error) => {
          res.json({
            status: "Failed to query friend: " + error.message,
          });
        });
      })
      .catch((error) => {
        res.json({ status: "Failed to check if friend exists: " + error.message });
      });
  })
  .catch((error) => {
    res.json({
      status: "SSH connection failed: " + error.message,
    });
  });
});



//server gets all of followers user is following. 
app.get("/users-friends", (req, res) => {
  let user = req.query.user;  
  console.log("Fetching friends for user:", user);

  try {
    ssh
      .connect({
        host: process.env.SECRET_IP,
        username: process.env.SECRET_USER,
        privateKeyPath: process.env.SECRET_KEY,
      })
      .then(() => {
        ssh.execCommand(
          `mongosh testDB --quiet --eval 'EJSON.stringify(db.friends.find({ userID: "${user}", status: "friends" }).toArray())'`
        ).then(function (result) {
          const data = JSON.parse(result.stdout);
          const userFriends = data.map(friend => friend.friendID);
          console.log(userFriends);
          res.json(userFriends);
        });
      });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: error.message });
  }
});

/*
//TESTING THE ADD-FRIEND ROUTE
const friend_data = {
  user: "matt",
  friend: "sasha"
};

const friend_options = {
  method: "POST",
  body: JSON.stringify(friend_data),
  headers: {
    "Content-Type": "application/json",
  },
};

try {
  // Send the post data to the backend API
  const response = await fetch("http:/localhost:10000/add-friend", friend_options);
  const json = await response.json();
  console.log(json.status);
} catch (error) {
  console.error("Error adding friend:", error);
}*/

//launches the frontend from server.js
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const httpServer = app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});


//starting our web socket server
//web sockets allow two way connection between client and server. this is helpful for sending and displaying messages in real time
const { Server } = require("socket.io");

const io = new Server(httpServer);

//whenever the connection event is fired, print that a user has connected
io.on("connection", (socket) => {
  console.log("User connected");

  //print that a user has disconnected whenever the disconnect event is fired
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
})

//when a connected user fires the chat message event, send the msg from the server to all connected clients.
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});




