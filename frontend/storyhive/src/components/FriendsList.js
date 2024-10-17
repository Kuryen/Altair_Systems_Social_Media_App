//component FriendsList
import React from "react";
import "./hexagon.css";
import beeLogo from "./bee.png";
import "./flower.png";


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
          <ul>
            <li className="text-gray-400">No friends to display.</li>
            <div class="container">
              <div class="hexagonArea">
                <div class="hexagon">
                  <img src="bee.png" alt=""/>
                  <h3>hexagon1</h3>
                </div>
                
                <div class="hexagon">
                  <img src="flower.png" alt=""/>
                  <h3>hexagon2</h3>
                </div>
                
                <div class="hexagon">
                  <img src="bee.png" alt=""/>
                  <h3>hexagon3</h3>
                </div>

                <div class="hexagon">
                  <img src="flower.png" alt=""/>
                  <h3>hexagon4</h3>
                </div>

              </div>
              <div class="hexagonArea">
                <div class="hexagon">
                  <img src="bee.png" alt=""/>
                  <h3>hexagon5</h3>
                </div>

                <div class="hexagon">
                  <img src="flower.png" alt=""/>
                  <h3>hexagon6</h3>
                </div>

                <div class="hexagon">
                  <img src="bee.png" alt=""/>
                  <h3>hexagon7</h3>
                </div>

              </div>
            </div>
        </ul>
          
        )}
      </ul>
    </div>
  );
}