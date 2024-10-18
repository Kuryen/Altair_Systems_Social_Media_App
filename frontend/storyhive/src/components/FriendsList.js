//component FriendsList
import React from "react";
import "./hexagon.css";
import beeLogo from "./pics/bee.png";
import flower from"./pics/flower.png";
import guy from "./pics/guystockphoto.jpg";
import pic from "./pics/profilepic.png";


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
                  {/* <img src={guy} alt="" class="w-full h-full"/> */}
                  <h6>Username</h6>
                </div>
                
                <div class="hexagon">
                  <img src={guy} alt="" class="w-full h-full"/>
                </div>
                
                <div class="hexagon">
                  <img src={pic} alt="" class="w-full h-full"/>
                </div>

                <div class="hexagon">
                  <img src={flower} alt="" class="w-full h-full"/>
                </div>

                <div class="hexagon">
                  <img src={beeLogo} alt="" class="w-full h-full"/>
                </div>

                <div class="hexagon">
                  <img src={flower} alt="" class="w-full h-full"/>
                </div>

                <div class="hexagon">
                  <img src={beeLogo} alt="" class="w-full h-full"/>
                </div>

              </div>
            </div>
        </ul>
          
        )}
      </ul>
    </div>
  );
}