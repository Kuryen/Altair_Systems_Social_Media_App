import React from "react";
import socket from "../socket"; // Ensure socket is imported here

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
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-2">Online Users</h2>
      <ul>
        {onlineUsers.map((user, index) => (
          <li
            key={index}
            onClick={() => handleSelectUser(user)}
            className="cursor-pointer hover:bg-blue-200 p-2 rounded"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsers;
