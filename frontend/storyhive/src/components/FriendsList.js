//component FriendsList
import React from "react";

export default function FriendsList({ friends }) {
  return (
    <div className="bg-black p-4 text-white w-full h-full">
      <h3 className="text-xl font-bold mb-4">Friends List</h3>
      <ul className="space-y-2">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <li key={index} className="bg-[#eec33d] p-2 rounded-md">
              {friend} {/* Display each friend's username or friendID */}
            </li>
          ))
        ) : (
          <li className="text-gray-400">No friends to display.</li>
        )}
      </ul>
    </div>
  );
}