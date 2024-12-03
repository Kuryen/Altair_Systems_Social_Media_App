import React, { useEffect, useState } from "react";
import OnlineUsers from "./OnlineUsers";
import "../css/chat.css";
import socket from "../socket";
import beeLogo from "./pics/bee.png";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const chatUsername =
    localStorage.getItem("profileUsername") || "No content found!"; // Retrieve username from profile
  const [messages, setMessages] = useState([]); // State to manage chat messages
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(""); // New state for current chat user

  // Handle new message submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = document.getElementById("input");
    if (input.value !== "" && selectedUser !== null) {
      const message = `${chatUsername}: ${input.value}`;
      const roomName = [chatUsername, selectedUser].sort().join("_");
      socket.emit("chat message", { message, room: roomName }); // Send message to WebSocket server
      input.value = ""; // Clear input field
    } else {
      alert("You must select a user to chat with and you cannot send an empty message!");
    }
  };

  // Listen for new chat messages from the WebSocket
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("registerUser", chatUsername);

    socket.on("chat message", (msg) => {
      console.log("Received message:", msg);
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

    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      socket.off("chat message");
      socket.off("updateOnlineUsers");
    };
  }, [chatUsername]);

  // Handle user selection
  const handleUserSelect = (user) => {
    if (user === chatUsername) {
      alert("You cannot chat with yourself. Please select a different user!");
    } else {
      console.log("Selected user:", user);
      setSelectedUser(user);
      setCurrentChatUser(user); // Set the current chat user
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="chatContainer">
      <div className="chatBg">
        {/* Online Users Component */}
        <OnlineUsers
          className="onlineUsers"
          onlineUsers={onlineUsers}
          onSelectUser={handleUserSelect}
        />

        {/* Chat Space */}
        <div className="chatSpace">
          {/* Chat Header */}
          <div className="chatHeaderSpace">
            <img src={beeLogo} alt="Logo" />
            <div className="username">@{chatUsername}</div>
            <button className="exitButton" onClick={handleNavigateToProfile}>
              Exit Chatroom
            </button>
          </div>

          {/* Current Chat User Confirmation */}
          {currentChatUser && (
            <div className="chatUserConfirmation">
              @{chatUsername} is now chatting with @{currentChatUser}
            </div>
          )}

          {/* Chat Messages */}
          <div className="chatMessageSpace">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatBubble ${
                  message.type === "outgoing" ? "sent" : "recieved"
                }`}
              >
                <p className="break-all">{message.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          {selectedUser && selectedUser !== chatUsername ? (
            <div className="chatInputContainer">
              <form className="chatSendBar" id="form" onSubmit={handleSubmit}>
                <input
                  className="chatInputField"
                  id="input"
                  autoComplete="off"
                  placeholder="Type your message..."
                />
                <button className="chatSendButton" type="submit">
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="chatInputContainer">
              <p className="noChatSelectedMessage">
                Select a user to start a conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
