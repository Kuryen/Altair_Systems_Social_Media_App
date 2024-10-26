import React, { useEffect, useState } from "react";
import beeLogo from "./bee.png";
import OnlineUsers from './OnlineUsers';
import socket from './socket';

function Chat() {
  const chatUsername =
    localStorage.getItem("profileUsername") || "No content found!";
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(""); // New state for current chat user

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = document.getElementById("input");
    if (input.value && selectedUser) {
      const message = `${chatUsername}: ${input.value}`;
      const roomName = [chatUsername, selectedUser].sort().join("_");
      socket.emit("chat message", { message, room: roomName });
      input.value = "";
    }
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("registerUser", chatUsername);

    socket.on("chat message", (msg) => {
      console.log("Received message:", msg);
      const messageType =
        msg.split(":")[0] === localStorage.getItem("profileUsername")
          ? "outgoing"
          : "incoming";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, type: messageType },
      ]);
    });

    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("chat message");
      socket.off("updateOnlineUsers");
    };
  }, [chatUsername]);

  // New function to handle user selection
  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    setCurrentChatUser(user); // Set the current chat user
  };

  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="relative w-[500px] h-full bg-[#eec33d] flex">
        {/* Online Users Component */}
        <OnlineUsers 
          onlineUsers={onlineUsers} 
          onSelectUser={handleUserSelect} // Updated to use new function
        />

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

          {/* Display current chat user confirmation */}
          {currentChatUser && (
            <div className="text-center text-xl font-bold">
              @{chatUsername} is now chatting with @{currentChatUser}
            </div>
          )}

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
