import React from "react";
import socket from "../socket"; // Ensure socket is imported here
import "../css/onlineUsers.css"

function OnlineUsers({ onlineUsers, onSelectUser }) {
  const handleSelectUser = (user) => {
    const profileUsername = localStorage.getItem("profileUsername");
    // Check if profileUsername is not null or undefined
    if (profileUsername) {
      socket.emit("startChat", {
        from: profileUsername,
        to: user,
      });
      onSelectUser(user); // Notify parent component to set selected user
    }
  };

  return (
    <div className="onlineUsersContainer">
      <h2>Online Users</h2>
      <ul>
        {onlineUsers.map((user, index) => (
          <li
            key={index}
            onClick={() => handleSelectUser(user)}
            className="onlineUser"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsers;
