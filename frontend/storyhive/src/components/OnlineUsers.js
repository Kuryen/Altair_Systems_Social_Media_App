import React from "react";

function OnlineUsers({ onlineUsers, onSelectUser }) {
  return (
    <div className="w-[200px] h-full bg-[#f4f4f4] p-4">
      <h2 className="text-lg font-bold">Online Users</h2>
      <ul>
        {onlineUsers.length > 0 ? (
          onlineUsers.map((username, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-[#eec33d]"
              onClick={() => onSelectUser(username)} // Pass the username directly
            >
              {username}
            </li>
          ))
        ) : (
          <li className="p-2">No users online</li> // Message when no users are online
        )}
      </ul>
    </div>
  );
}

export default OnlineUsers;