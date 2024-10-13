import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import beeLogo from "./bee.png";

function Chat(props) {
  const chatUsername =
    localStorage.getItem("profileUsername") || "No content found!"; // Retrieve username from profile
  const [messages, setMessages] = useState([]); // State to manage chat messages
  const [messageContent, setMessageContent] = useState(""); // For input field value
  const socket = io("https://localhost:10000");

  let selectedUser = {
    ...props.selectedUser,
    messages: [],
  };

  // Get message content from input field
  const getContent = (e) => {
    setMessageContent(e.target.value);
  };

  // Handle new message submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const message = `${chatUsername}: ${messageContent}`;
    if (messageContent) {
      socket.emit("private message", {
        content: messageContent,
        to: props.selectedUser.userID,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          toUser: props.selectedUser.username,
          content: messageContent,
          fromSelf: true,
        },
      ]);
      setMessageContent(""); // Clear input field
    }
  };

  // Listen for new chat messages from the WebSocket
  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      const fromUser = props.connectedUsers.find(
        (user) => user.userID === from
      )?.username;
      setMessages((prevMessages) => [
        ...prevMessages,
        { fromUser, content, fromSelf: false },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("private message");
    };
  }, [socket, props.connectedUsers]);

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
                message.fromSelf
                  ? "bg-[#E5AC3F] text-black text-right"
                  : "bg-black text-white text-left"
              }`}
            >
              <p className="break-all">{message.content}</p>
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
              value={messageContent}
              onChange={getContent}
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
