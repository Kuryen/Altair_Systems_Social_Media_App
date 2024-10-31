import { io } from "socket.io-client";

const socket = io("http://localhost:10000", {
  autoConnect: false,
}); // Replace with your actual server URL
export default socket;
