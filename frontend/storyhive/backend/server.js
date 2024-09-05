//adding all of our dependencies
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const {NodeSSH} = require('node-ssh')
var cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
app.use(cors())

//create ssh object that will log into our ec2
const ssh = new NodeSSH()
app.get('/clicked', (req, res) => {
    ssh.connect({
        //credentials stored in .env 
        host: process.env.SECRET_IP,
        username: process.env.SECRET_USER,
        privateKeyPath: process.env.SECRET_KEY,
      }).then((status) => {
        //now that we're logged in, we can run mongo commands
        //db.user.find({}) will display table from a collection called user
        ssh.execCommand("mongo --quiet --eval 'db.user.find({})'").then(function (result) {
            //store the output in a const called data and send it back to the frontend
            const data = result.stdout;
            res.send(data)
          });
      });
  });

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);