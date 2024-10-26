import React, { useState, useEffect } from "react";
import beeLogo from "./bee.png"; // Replace with your actual logo path
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import socket from './socket';

export default function Profile() {
  const navigate = useNavigate();
  const profileUsername = localStorage.getItem("elementData") || "No content found!"; // Retrieve the username from localStorage
  const [onlineUsers, setOnlineUsers] = useState([])
  const [friends, setFriends] = useState([]);


  /*/SOMETHING IS WRONG WITH THIS CODE 
  // First useEffect for socket connection
  useEffect(() => {
    socket.connect();
    // Emit username when the component mounts
    socket.emit("registerUser", profileUsername); // Use actual username passed as prop

    // Listen for online users update
    socket.on("updateOnlineUsers", (users) => {
    setOnlineUsers(users);
    });

 // Cleanup on unmount
  return () => {
   socket.off("updateOnlineUsers");
    // Do not disconnect here unless you want to close the socket when leaving this component
  };
}, []); // Empty dependency array ensures this runs only once on mount */

  useEffect(() => {
    // Fetch friends using your API
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/users-friends?user=${profileUsername}`);
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [profileUsername]);

  return (
    <div className="w-screen h-screen flex">
      {/* Friends List - Left Side */}
      <div className="w-[250px] h-full bg-gray-200 overflow-y-auto ">
        <FriendsList friends={friends} />
      </div>

      {/* Main Profile Section */}
      <div className="relative w-full h-screen bg-[#eec33d] flex flex-col items-center p-10">
        {/* Top Navbar */}
        <div className="relative flex items-center justify-between w-full h-[65px] bg-black rounded-lg mb-10">
          <div className="text-white text-2xl font-['Catamaran'] pl-5">
            Storyhive
          </div>
          <div className="flex items-center pr-5 space-x-8">
            <div className="text-[#e1dcdc] text-sm font-light">
              Hello, {profileUsername}
            </div>
            <div className="text-white text-[11px] font-light">HIVE</div>
            <div className="text-white text-[11px] font-light">BUZZ</div>
            <div className="text-white text-[11px] font-light">BLOOM</div>
            <div className="text-white text-[11px] font-light">Settings</div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start space-x-10">
          {/* Avatar & Info */}
          <div className="flex flex-col items-center w-[250px]">
            <div className="relative">
              <img
                className="w-[150px] h-[150px] rounded-full"
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              <div className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-gradient-to-b from-[#6c49f8] via-[#ff0064] to-[#ff6c02] rounded-full flex items-center justify-center text-white text-[24px] font-bold">
                +
              </div>
            </div>
            <div className="mt-4 text-white text-4xl font-semibold">
              {profileUsername}
            </div>{" "}
            {/* Display username */}
            <div className="text-[#e1dcdc] text-sm">@username</div>
            <div className="flex space-x-4 mt-4">
              <button className="text-white text-[10px] bg-black px-4 py-2 rounded">
                Edit Profile
              </button>
              <button className="text-white text-[10px] bg-black px-4 py-2 rounded">
                Share Profile
              </button>
            </div>
          </div>

          {/* Bio & Stats */}
          <div className="flex flex-col justify-between w-full h-full">
            <div>
              <p className="text-white text-lg">
                Hello everyone! Welcome to my profile. Excited to connect with you all.
              </p>
            </div>
            <div className="flex justify-between mt-6">
              <div className="text-white text-base">
                <div className="font-bold">210</div>
                <div className="text-sm">Followers</div>
              </div>
              <div className="text-white text-base">
                <div className="font-bold">200</div>
                <div className="text-sm">Following</div>
              </div>
              <div className="text-white text-base">
                <button
                  type="button"
                  onClick={(event) => {
                    localStorage.setItem("profileUsername", profileUsername); // When chat is clicked, store profileUsername in localStorage for reference in chat.js
                    navigate("/Chat");
                  }}
                >
                  Chat with me!
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Tabs */}
        <div className="pt-4 w-full">
          <UserTabs />
        </div>
      </div>

      {/* Right Side Component */}
      <div className="w-[250px] h-full bg-gray-200 overflow-y-auto">
        {/* Placeholder for right side component */}
        {/* Add the component you want here */}
        <div className="p-4">you can add additional component here</div>
      </div>
    </div>
  );
}
