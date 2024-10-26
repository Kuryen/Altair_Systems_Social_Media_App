import React from "react";

function OnlineUsers({ onlineUsers, onSelectUser }) {
  console.log("Rendering online users:", onlineUsers); // Log the received online users
  return (
    <div className="w-[200px] h-full bg-gray-200 p-4 overflow-y-auto">
      <h2 className="font-bold text-lg">Online Users</h2>
      {onlineUsers.length === 0 ? (
        <p>No users online</p>
      ) : (
        onlineUsers.map((user, index) => (
          <div
            key={index}
            className="p-2 cursor-pointer hover:bg-gray-300"
            onClick={() => onSelectUser(user)}
          >
            @{user} {/* Display the username directly since onlineUsers is an array of strings */}
          </div>
        ))
      )}
    </div>
  );
}

export default OnlineUsers;