// component FriendsList
import React, { useState } from "react";
import "./hexagon.css";

export default function FriendsList({ friends }) {

  const handleClick = () => {
    console.log("clicked");
}
  
  return (
    <div className="bg-black p-4 text-white w-full h-full">
      <h3 className="text-xl font-bold mb-4">Friends List</h3>
      <div className="container">
        <div className="hexagonArea">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <button key={index} className="hexagon" onClick={() => handleClick()}>
                <h6>{friend}</h6> {/* Display each friend's name in hexagon */}
              </button>
            ))
          ) : (
            <div className="text-gray-400">No friends to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
