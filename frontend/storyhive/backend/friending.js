const express = require("express");
const router = express.Router();
const { NodeSSH } = require("node-ssh");
var cors = require("cors");

router.use(cors());
const ssh = new NodeSSH();

// POST ROUTE WILL ADD A FRIEND TO THE DATABASE
router.post("/add-friend", (req, res) => {
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
router.get("/users-friends", (req, res) => {
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

module.exports = router;
