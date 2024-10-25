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

const tableRoutes = require("./tables");
app.use("/tables", tableRoutes);

const authenticateRoutes = require("./authenticate");
app.use("/authenticate", authenticateRoutes);

const postRoutes = require("./posting");
app.use("/posting", postRoutes);

const friendRoutes = require("./friending");
app.use("/friending", friendRoutes);

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




