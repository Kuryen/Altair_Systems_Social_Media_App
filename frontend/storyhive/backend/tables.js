const express = require("express");

const router = express.Router();

//created an endpoint `/fetch-data` that we can use to fetch data from any MongoDB collection by passing the collection name as a query parameter
//the frontend will call this endpoint and specify the collection name in the request (e.g., `collection=posts` or `collection=clicked`)
router.get("/fetch-data", async (req, res) => {
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

module.exports = router;