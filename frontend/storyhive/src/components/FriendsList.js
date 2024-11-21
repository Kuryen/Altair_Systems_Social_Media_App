import React, { useState } from "react";
import "../css/hexagon.css";
import "../css/friendsList.css";

export default function FriendsList({ friends, onProfileClick }) {
  // State to track which images have failed to load
  const [imageErrors, setImageErrors] = useState(Array(friends.length).fill(false));

  // Handler to mark an image as having an error
  const handleImageError = (index) => {
    setImageErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = true; // Mark this index as having an error
      return newErrors;
    });
  };

  return (
    <div className="friendsContainer">
      <h3>Follower List</h3>
      <div className="container">
        <div className="hexagonArea">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={friend.username}
                className="hexagon"
                onClick={() => onProfileClick(friend.username)} // Ensure this updates to the clicked friend's profile
              >
                {/* Conditionally render profile picture or username */}
                {!imageErrors[index] && friend.profilePicture ? (
                  <div className="hexagon-image-wrapper">
                    <img
                      src={friend.profilePicture}
                      alt={`${friend.username}'s profile`}
                      className="friendProfilePicture"
                      onError={() => handleImageError(index)}
                    />
                  </div>
                ) : (
                  <div className="friend-username-wrapper">
                    <h6 className="friend-username">{friend.username}</h6>
                  </div>
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
