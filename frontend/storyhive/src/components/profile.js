import React, { useState, useEffect } from "react";
import beeLogo from "./bee.png"; // Replace with your actual logo path
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

export default function Profile() {
  const navigate = useNavigate();
  const profileUsername = localStorage.getItem("elementData") || "No content found!"; // Retrieve the username from localStorage

  const [friends, setFriends] = useState([]);

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
      {/*stuff*/}
    </div>
  );
}


{/* Bottom Logo 
      <div className="absolute bottom-10">
        <img className="w-[178px] h-[90px]" src={beeLogo} alt="Logo" />
      </div>*/}
