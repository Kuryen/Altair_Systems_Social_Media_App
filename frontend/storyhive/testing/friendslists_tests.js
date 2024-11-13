// Starting message to confirm the script is running
console.log("Starting test cases...");

function friendsArray(friends) {
    if (friends.length > 0) {
        friends.map((friend, index) => {
            console.log(`\nRendering friend # ${index}: ${friend}`);
        });
    } else {
        console.log("No friends to display.");
    }
}

const testCases = [
    [],                         
];

['ana'],             
    ['ana', 'sate', 'ray'],      
    ['ana', 'sate', 'ray', 'ture', 'mia'] 

testCases.forEach((friends, index) => {
    console.log(`\nTest Case ${index + 1}:`, friends);
    friendsArray(friends);
});

// Ending message to confirm the script completed
console.log("Test cases completed.");


import React from "react";
import "../css/hexagon.css";


//conditional rendering, if no profile pic, render username on hex, if profile exists render image.
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
                {friend.profilePicture ? (
                  <img
                    src={friend.profilePicture}
                    alt={`${friend.username}'s profile`}
                    className="friendProfilePicture"
                  />
                ) : (
                  <h6>{friend.username}</h6>
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
