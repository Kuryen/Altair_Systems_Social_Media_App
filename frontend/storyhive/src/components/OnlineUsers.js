import React from "react";

function OnlineUsers({ onlineUsers, onSelectUser }) {
  return (
    <div className="w-[200px] h-full bg-[#f4f4f4] p-4">
      <h2 className="text-lg font-bold">Online Users</h2>
      <ul>
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-[#eec33d]"
              onClick={() => onSelectUser(user)}
            >
              @{user.username} {/* Use user.username */}
            </li>
          ))
        ) : (
          <li className="p-2">No users online</li>
        )}
      </ul>
    </div>
  );
}

export default OnlineUsers;

