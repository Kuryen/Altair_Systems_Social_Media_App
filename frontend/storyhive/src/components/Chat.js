import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import beeLogo from "./pics/bee.png";
import "../chat.css";

function Chat() {
  const chatUsername =
    localStorage.getItem("profileUsername") || "No content found!"; // Retrieve username from profile
  const [messages, setMessages] = useState([]); // State to manage chat messages
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
        msg.split(":")[0] === localStorage.getItem("profileUsername")
          ? "outgoing"
          : "incoming";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, type: messageType },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  return (
    <div className="chatContainer">
      <div className="chatBg">
        {/* Chat info space */}
        <div className="chatHeaderSpace">
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
        <div className="chatMessageSpace">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chatBubble ${
                message.type === "outgoing"
                  ? "sent"
                  : "recieved"
              }`}
            >
              <p className="break-all">{message.text}</p>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div className="chatInputContainer">
          <form
            className="chatSendBar"
            id="form"
            onSubmit={handleSubmit}
          >
            <input
              className="chatInputField"
              id="input"
              autoComplete="off"
            />
            <button
              className="chatSendButton"
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
