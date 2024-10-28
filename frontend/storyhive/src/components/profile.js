import React, { useState, useEffect } from "react";
import beeLogo from "./pics/bee.png"; // Replace with your actual logo path
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import SearchBar from "./searchbar";
import SearchResultsList from "./searchresultlist";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../profile.css";

export default function Profile() {
  const navigate = useNavigate();
  //setCurrentUser(profileUsername === localStorage.getItem("elementData"));
  const [currentUser, setCurrentUser] = useState(true); //condition to change the profile view for users depending on if it is their profile or not
  const profileUsername = localStorage.getItem("elementData") || "No content found!"; // Retrieve the username from localStorage

  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [newFriendAdded, setNewFriendAdded] = useState(false); // Track when a friend is added

  useEffect(() => {
    // Fetch friends using your API
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/friending/users-friends?user=${profileUsername}`);
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
  }, [profileUsername, newFriendAdded]); //refresh when a new friend is added

  const handleAddFriend = () => {
    setNewFriendAdded(!newFriendAdded); //toggle to refresh friend list
  }

  const handleProfileClick = () => {
    console.log("clicked");
  };

  return (
    <div className="profilePageContainer">
      {/* Friends List - Left Side */}
      <div className="friendTab">
        <FriendsList friends={friends} changeProfile={() => handleProfileClick} />
      </div>

      {/* Main Profile Section */}
      <div className="profile">
        {/* Top Navbar */}
        <div className="navBarContainer">
          <h3>Storyhive</h3>
          <div className="navBar">
            <p>Hello, {profileUsername}</p>
            <p>HIVE</p>
            <p>BUZZ</p>
            <p>BLOOM</p>
            <p>Settings</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profileInfoContainer">
          {/* Avatar & Info */}
          <div className="profileInfo">
            <div className="profilePic">
              <img
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              {currentUser && <div className="addProfilePic">+</div>}
            </div>
            <div className="displayName">
              {profileUsername}
            </div>{" "}
            {/* Display username */}
            <div className="username">@username</div>
            <div className="profileInteractContainer">
            {currentUser && <button>Edit Profile</button>}
            {currentUser && <button>Share Profile</button>}
            </div>
          </div>

          {/* Bio & Stats */}
          <div className="profileStatsContainer">
            <div>
              <p>
                Hello everyone! Welcome to my profile. Excited to connect with you all.
              </p>
            </div>
            <div className="stats">
              <div className="statDisplay">
                <p>210</p>
                <h1>Followers</h1>
              </div>
              <div className="statDisplay">
                <p>200</p>
                <h1>Following</h1>
              </div>
              <div className="statDisplay">
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
        <div className="profileTabs">
          <UserTabs />
        </div>
      </div>
                    
      {/* Search bar */}
      <div className="searchBar">
        {/* Placeholder for right side component */}
        {/* Add the component you want here */}
        <div className="search-bar-container">
        <SearchBar setResults={setResults} />
      
        {results && results.length > 0 && (
            <SearchResultsList 
            results={results} 
            currentUserID={profileUsername} 
            onFriendAdded={handleAddFriend} // Call handleAddFriend when a friend is added
            existingFriends={friends.map(friend => friend.friendID)} // Pass existing friends' IDs
          />
          )}
        </div>
      </div>
    </div>
  );
}


{/* Bottom Logo 
      <div className="absolute bottom-10">
        <img className="w-[178px] h-[90px]" src={beeLogo} alt="Logo" />
      </div>*/}
