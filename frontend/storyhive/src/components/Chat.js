import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import beeLogo from "./pics/bee.png";

function Chat() {
  const chatUsername = localStorage.getItem("chatWith") || "No user selected";
  const [messages, setMessages] = useState([]);
  const socket = io("http://localhost:10000");

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

  // Listen for new chat messages from the WebSocket
  useEffect(() => {
    socket.on("chat message", (msg) => {
      // Determine if the message is incoming or outgoing
      const messageType =
        msg.split(":")[0] === chatUsername ? "outgoing" : "incoming";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, type: messageType },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("chat message");
    };
  }, [socket, chatUsername]);

  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="relative w-[500px] h-full bg-[#eec33d]">
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

        {/* Chat message space */}
        <div className="bg-white w-full h-[700px] flex-grow overflow-y-auto space-y-1">
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
        </div>

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
  );
}

export default Chat;
