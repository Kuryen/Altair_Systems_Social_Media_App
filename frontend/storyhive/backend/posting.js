const express = require("express");
const router = express.Router();
const { NodeSSH } = require("node-ssh");
var cors = require("cors");

router.use(cors());
const ssh = new NodeSSH();

//USED TO GET POSTS RELATED TO A USER
router.get("/posts", (req, res) => {
    let current_user = req.query.user;
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
router.post("/make-post", (req, res) => {
    //parsing the json we received
    let input = req.body;
    let contents = input.textContent;
    let userID = input.current_user;
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

// USED TO GET ALL POSTS FROM ALL USERS
router.get("/get-all-posts", (req, res) => {
  try {
      ssh
          .connect({
              // Credentials stored in .env
              host: process.env.SECRET_IP,
              username: process.env.SECRET_USER,
              privateKeyPath: process.env.SECRET_KEY,
          })
          .then(() => {
              // Fetch all posts from the collection
              ssh
                  .execCommand(
                      "mongosh testDB --quiet --eval 'EJSON.stringify(db.posts.find({}, { textContent: 1, userID: 1, createdAt: 1, likeCount: 1, commentCount: 1, sharesCount: 1 }).toArray())'"
                  )
                  .then(function (result) {
                      const data = JSON.parse(result.stdout); // Parse the stringified JSON output
                      res.json(data); // Send the result as JSON to the client
                  })
                  .catch((err) => {
                      console.error("Error executing command:", err);
                      res.status(500).json({ message: "Error fetching posts." });
                  });
          })
          .catch((err) => {
              console.error("SSH connection error:", err);
              res.status(500).json({ message: "Error connecting to the database." });
          });
  } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: error.message });
  }
});


module.exports = router;