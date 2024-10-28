import React, { useState, useEffect } from "react";
import beeLogo from "./pics/bee.png";
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import SearchBar from "./searchbar";
import SearchResultsList from "./searchresultlist";
import ProfilePictureUploader from "./ProfilePictureUP";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const profileUsername = localStorage.getItem("elementData") || "No content found!";
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [newFriendAdded, setNewFriendAdded] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePic") || "https://via.placeholder.com/150"
  );

  useEffect(() => {
    // Fetch friends
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/friending/users-friends?user=${profileUsername}`);
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [profileUsername, newFriendAdded]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(`http://localhost:10000/profilepicture/get-profile-picture/${profileUsername}`);
        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
          localStorage.setItem("profilePic", response.data.profilePicture); // Update localStorage
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, [profileUsername]);

  const handleAddFriend = () => {
    setNewFriendAdded(!newFriendAdded);
  };

  const handleUploadSuccess = (newProfilePictureUrl) => {
    setProfilePicture(newProfilePictureUrl);
  };

  const handleProfileClick = (friendUsername) => {
    localStorage.setItem("chatWith", friendUsername);
    navigate("/Chat");
  };

  return (
    <div className="w-screen h-screen relative flex">
      {/* Friends List - Left Side */}
      <div className="w-[350px] h-full bg-gray-200 overflow-y-auto ">
        <FriendsList friends={friends} onProfileClick={handleProfileClick} />
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
                src={profilePicture}
                alt="User Avatar"
              />
              <div className="relative">
                <ProfilePictureUploader username={profileUsername} onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
            <div className="mt-4 text-white text-4xl font-semibold">
              {profileUsername}
            </div>
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
                    localStorage.setItem("profileUsername", profileUsername);
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

      {/* Search bar */}
      <div className="w-[250px] h-full bg-gray-200 overflow-y-auto">
        <div className="search-bar-container">
          <SearchBar setResults={setResults} />
          {results && results.length > 0 && (
            <SearchResultsList 
              results={results} 
              currentUserID={profileUsername} 
              onFriendAdded={handleAddFriend}
              existingFriends={friends.map(friend => friend.friendID)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;