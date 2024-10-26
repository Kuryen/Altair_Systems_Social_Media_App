// component FriendsList
import React, { useState } from "react";
import "../friendsList.css";
import "../hexagon.css";

export default function FriendsList({ friends }, {changeProfile}) {
  
  return (
    <div className="friendsContainer">
      <h3>Friends List</h3>
      <div className="hexagonContainer">
        <div className="hexagonArea">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <button key={index} className="hexagon" onClick={changeProfile}>
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
