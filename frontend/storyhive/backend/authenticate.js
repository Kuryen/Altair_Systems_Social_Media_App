const express = require("express");
const router = express.Router();
const { NodeSSH } = require("node-ssh");
var cors = require("cors");

router.use(cors());
const ssh = new NodeSSH();
let current_user = "";

//login endpoint
router.post("/check-form", (req, res) => {
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
router.post("/register", (req, res) => {
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
  

module.exports = router;