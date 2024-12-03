import { io } from "socket.io-client";

const socket = io("https://storyhive-app.onrender.com", {
  autoConnect: false,
}); // Replace with your actual server URL
export default socket;


//https://storyhive-app.onrender.com
//localhost:10000