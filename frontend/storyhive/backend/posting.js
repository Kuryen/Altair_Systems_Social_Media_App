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
        host: process.env.SECRET_IP,
        username: process.env.SECRET_USER,
        privateKeyPath: process.env.SECRET_KEY,
      })
      .then((status) => {
        ssh
          .execCommand(
            "mongosh testDB --quiet --eval 'EJSON.stringify(db.posts.find({userID: \"" +
            current_user +
            "\"}, { _id: 1, textContent: 1, userID: 1, createdAt: 1, likeCount: 1, commentCount: 1, sharesCount: 1 }).toArray())'"
          )
          .then(function (result) {
            const data = JSON.parse(result.stdout); // Parse the stringified JSON output

            // Format the _id and createdAt fields
            const formattedData = data.map(post => ({
              ...post,
              _id: post._id.$oid, // Ensure _id is converted properly
              createdAt: post.createdAt.$date // Extract the date from the MongoDB object
            }));

            res.json(formattedData); // Send the result as JSON to the client
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
        ssh
          .execCommand(
            "mongosh testDB --quiet --eval 'EJSON.stringify(db.posts.find({}, { _id: 1, textContent: 1, userID: 1, createdAt: 1, likeCount: 1, commentCount: 1, sharesCount: 1 }).toArray())'"
          )
          .then(function (result) {
            const data = JSON.parse(result.stdout); // Parse the stringified JSON output
            
            // Format the _id to be a string instead of an object
            const formattedData = data.map(post => ({
              ...post,
              _id: post._id.$oid, // Ensure _id is converted properly
              createdAt: post.createdAt.$date // Extract the date from the MongoDB object
            }));            

           // console.log("Formatted posts data:", formattedData); // Log the formatted data
            res.json(formattedData); // Send the result as JSON to the client
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
router.post("/setLikes", async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required." });
  }

  try {
    ssh
      .connect({
        host: process.env.SECRET_IP,
        username: process.env.SECRET_USER,
        privateKeyPath: process.env.SECRET_KEY,
      })
      .then(() => {
        const likeQuery = `
          db.posts.updateOne(
            { _id: ObjectId("${postId}") },
            { $inc: { likeCount: 1 } }
          )
        `;
        ssh
          .execCommand(`mongosh testDB --quiet --eval '${likeQuery}'`)
          .then((result) => {
            if (result.stderr) {
              console.error("Error updating likes:", result.stderr);
              return res.status(500).json({ message: "Failed to update likes." });
            }
            res.json({ message: "Like updated successfully!" });
          })
          .catch((err) => {
            console.error("Error executing query:", err);
            res.status(500).json({ message: "Failed to execute query." });
          });
      })
      .catch((err) => {
        console.error("SSH connection error:", err);
        res.status(500).json({ message: "Database connection error." });
      });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});



module.exports = router;