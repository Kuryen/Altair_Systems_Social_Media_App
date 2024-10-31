import React from "react";
import "../css/hexagon.css";

export default function FriendsList({ friends, onProfileClick }) {
  return (
    <div className="bg-black p-4 text-white w-full h-full">
      <h3 className="text-xl font-bold mb-4">Follower List</h3>
      <div className="container">
        <div className="hexagonArea">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={index}
                className="hexagon"
                onClick={() => onProfileClick(friend)}
              >
                <h6>{friend}</h6> {/* Display friend name */}
              </div>
            ))
          ) : (
            <div className="text-gray-400">No friends to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
