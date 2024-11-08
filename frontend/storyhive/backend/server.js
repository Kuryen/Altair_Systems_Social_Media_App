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

const { run_login_tests } = require("../testing/authentication_tests");
const { run_register_tests } = require("../testing/authentication_tests");
const { run_chat_tests } = require("../testing/chat_tests");

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

const pfpRoutes = require("./profilepicture");
app.use("/profilepicture", pfpRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//launches the frontend from server.js
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

//starting our web socket server
//web sockets allow two way connection between client and server. this is helpful for sending and displaying messages in real time
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { run_post_tests } = require("../testing/post_tests");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:10000",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("registerUser", (username) => {
    if (username && !onlineUsers.includes(username)) {
      onlineUsers.push(username);
      socket.username = username;
      io.emit("updateOnlineUsers", onlineUsers);
    } else {
      console.log(`Username ${username} is already taken.`);
      socket.emit("usernameError", "Username is already taken.");
    }
    console.log("Online Users: ", onlineUsers);
  });

  socket.on("chat message", ({ message, room }) => {
    io.to(room).emit("chat message", message); // Send message within the room
  });

  socket.on("startChat", ({ from, to }) => {
    const roomName = [from, to].sort().join("_");
    socket.join(roomName);
    io.to(roomName).emit(
      "system message",
      `${from} has joined the chat with ${to}`
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const username = socket.username;
    if (username) {
      onlineUsers = onlineUsers.filter((user) => user !== username);
      io.emit("updateOnlineUsers", onlineUsers);
    }
  });
});

//launches the frontend from server.js
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//run_chat_tests();
//run_login_tests();
//run_register_tests();
//run_post_tests();