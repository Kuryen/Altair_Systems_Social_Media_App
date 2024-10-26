import React, { useEffect, useState } from "react";
import beeLogo from "./bee.png";
import OnlineUsers from './OnlineUsers'; // Import the OnlineUsers component
import socket from './socket';

function Chat() {
  const chatUsername =
    localStorage.getItem("profileUsername") || "No content found!"; // Retrieve username from profile
  const [messages, setMessages] = useState([]); // State to manage chat messages
  const [onlineUsers, setOnlineUsers] = useState([]); // State for online users

  // Handle new message submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    var input = document.getElementById("input");
    if (input.value) {
      const message = `${chatUsername}: ${input.value}`;
      socket.emit("chat message", message); // Send message to WebSocket server
      input.value = ""; // Clear input field
    }
  };

  //this code works!!!
  useEffect(() => {
      // Ensure socket is connected
  if (!socket.connected) {
    socket.connect();
  }


    socket.emit("registerUser", chatUsername);
  
    socket.on("chat message", (msg) => {
      console.log("Received message:", msg); // Log received messages
      const messageType =
        msg.split(":")[0] === localStorage.getItem("profileUsername")
          ? "outgoing"
          : "incoming";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, type: messageType },
      ]);
    });
  
      // Listen for online users updates
    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  
    return () => {
      socket.off("chat message");
      socket.off("updateOnlineUsers");
    };
  }, [chatUsername]);
  

  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="relative w-[500px] h-full bg-[#eec33d] flex">
        {/* Online Users Component */}
        <OnlineUsers onlineUsers={onlineUsers} onSelectUser={(user) => console.log('Selected user:', user)} />

        {/* Chat message space */}
        <div className="bg-white w-full h-full flex-grow overflow-y-auto space-y-1">
          {/* Chat info space */}
          <div className="flex justify-items-start relative w-full h-[100px] items-center">
            <div>
              <img
                className="w-[100px] h-[100px] object-contain"
                src={beeLogo}
                alt="Logo"
              />
            </div>
            <div className="text-[#e1dcdc] text-2xl ml-4">@{chatUsername}</div>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-full p-3 rounded-lg text-wrap ${
                message.type === "outgoing"
                  ? "bg-[#E5AC3F] text-black text-right"
                  : "bg-black text-white text-left"
              }`}
            >
              <p className="break-all">{message.text}</p>
            </div>
          ))}

          {/* Chat input */}
          <div className="absolute bottom-0 w-full h-[120px]">
            <form
              className="flex justify-between absolute w-full pb-10 bottom-0 right-0"
              id="form"
              onSubmit={handleSubmit}
            >
              <input
                className="rounded-md w-[460px] border-2 border-black outline-none"
                id="input"
                autoComplete="off"
              />
              <button
                className="bg-blue-600 px-4 text-black hover:text-white rounded-md"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;