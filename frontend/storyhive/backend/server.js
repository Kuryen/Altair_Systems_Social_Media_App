//adding all of our dependencies
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const {NodeSSH} = require('node-ssh');
var cors = require('cors');
const path = require('path');

const buildPath = path.join(__dirname, '../build');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
//create ssh object that will log into our ec2
const ssh = new NodeSSH();

//COPY PASTE LINES 20-40 TO MAKE A NEW ENDPOINT FOR EACH BUTTON TO CALL
//JUST MAKE SURE IT IS NAMED SOMETHING DIFFERENT THAN /CLICKED
app.get('/clicked', async (req, res) => {
    console.log("hi!!!")
    try{
        ssh.connect({
            //credentials stored in .env 
            host: process.env.SECRET_IP,
            username: process.env.SECRET_USER,
            privateKeyPath: process.env.SECRET_KEY,
        }).then((status) => {
            //now that we're logged in, we can run mongo commands
            //db.user.find({}) will display table from a collection called user
            ssh.execCommand("mongo --quiet --eval 'EJSON.stringify(db.user.find({})')").then(function (result) {
                //store the output in a const called data and send it back to the frontend
                const data = result.stdout
                res.send(data);
            });
        });
    }catch(err){
        res.send("Database not found")
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);