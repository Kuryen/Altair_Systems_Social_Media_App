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
                onClick={() => onProfileClick(friend.username)}
                
              >
                {/* Conditionally render profile picture or username */} 
                  {friend.profilePicture ? (
                  <img
                    src={friend.profilePicture}
                    alt={`${friend.username}'s profile`}
                    className="friendProfilePicture"
                  />
                ) : ( 
                  <h6>{friend.username}</h6> // Display username if no profile picture
                )} 
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