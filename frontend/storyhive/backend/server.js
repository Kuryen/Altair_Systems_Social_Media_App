//adding all of our dependencies
const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;
const { NodeSSH } = require("node-ssh");
var cors = require("cors");
const path = require("path");

const buildPath = path.join(__dirname, "../build");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
//create ssh object that will log into our ec2
const ssh = new NodeSSH();
//added a reusable function called `executeMongoQuery(query)` to handle MongoDB queries over SSH
//this function takes a MongoDB query as a parameter, connects to our EC2 instance via SSH using the credentials from `.env`, executes the query, and returns the result
//avoid having redundant SSH calls for each MongoDB collection.

/*async function executeMongoQuery(query) {
  try {
    ssh.connect({
      //credentials stored in .env
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    }).then((status) => {
        const result = ssh.execCommand(`mongo --quiet --eval '${query}'`);
        console.log(result.stdout);
        return result.stdout;
    });
  } catch (err) {
    console.error("Error executing Mongo query", err);
    return null;
  }
}*/

//created an endpoint `/fetch-data` that we can use to fetch data from any MongoDB collection by passing the collection name as a query parameter
//the frontend will call this endpoint and specify the collection name in the request (e.g., `collection=posts` or `collection=clicked`)
app.get("/fetch-data", async (req, res) => {
  const { collection } = req.query;
  const query = `db.${collection}.find({},{_id:0}).lean()`;

  if (!collection) {
    return res.status(400).send("Collection not specified");
  }


  ssh.connect({
    //credentials stored in .env
    host: process.env.SECRET_IP,
    username: process.env.SECRET_USER,
    privateKeyPath: process.env.SECRET_KEY,
  }).then((status) => {
    //`mongo --quiet --eval '${query}'`
      ssh.execCommand("mongosh testDB --quiet --eval '" + query + "'").then(function(result){
        const data = result.stdout;
        console.log("hi");
        res.send(data);
      })
  });
});

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
