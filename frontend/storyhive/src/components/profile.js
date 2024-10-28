import React, { useState, useEffect } from "react";
import beeLogo from "./pics/bee.png"; // Replace with your actual logo path
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import SearchBar from "./searchbar";
import SearchResultsList from "./searchresultlist";
import "../css/profile.css";
import socket from "../socket";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

export default function Profile() {
  const navigate = useNavigate();
  const profileUsername =
    localStorage.getItem("elementData") || "No content found!"; // Retrieve the username from localStorage
  const [currentUser, setCurrentUser] = useState(true); //condition to change the profile view for users depending on if it is their profile or not
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [newFriendAdded, setNewFriendAdded] = useState(false); // Track when a friend is added

  useEffect(() => {
    const loggedInUser = localStorage.getItem("elementData");
    setCurrentUser(profileUsername === loggedInUser);
  }, [profileUsername]);

  // First useEffect for socket connection
  // useEffect(() => {
  //   socket.connect();
  //   // Emit username when the component mounts
  //   socket.emit("registerUser", profileUsername); // Use actual username passed as prop

  //   // Listen for online users update
  //   socket.on("updateOnlineUsers", (users) => {
  //     setOnlineUsers(users);
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.off("updateOnlineUsers");
  //     // Do not disconnect here unless you want to close the socket when leaving this component
  //   };
  // }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Fetch friends using your API
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `/friending/users-friends?user=${profileUsername}`
        );
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
  };

  const handleProfileClick = (friendUsername) => {
    localStorage.setItem("chatWith", friendUsername);
    navigate("/Chat");
  };

  return (
    <div className="profilePageContainer">
      {/* Friends List - Left Side */}
      <div className="friendTab">
        <FriendsList friends={friends} onProfileClick={handleProfileClick} />
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
          {/* User Info */}
          <div className="profileInfo">
            <div className="displayName">{profileUsername}</div>
            <div className="username">@{profileUsername}</div>

            {/* Conditional Profile Actions */}
            <div className="profileInteractContainer">
              {currentUser ? (
                <>
                  <button>Edit Profile</button>
                  <button>Share Profile</button>
                </>
              ) : (
                <button onClick={() => navigate("/Chat")}>Message</button>
              )}
            </div>
          </div>

          {/* Bio & Stats */}
          <div className="profileStatsContainer">
            <p>
              Hello everyone! Welcome to my profile. Excited to connect with you
              all.
            </p>
            <div className="stats">
              <div className="statDisplay">
                <p>210</p>
                <h1>Followers</h1>
              </div>
              <div className="statDisplay">
                <p>200</p>
                <h1>Following</h1>
              </div>
              {!currentUser && (
                <div className="statDisplay">
                  <button
                    onClick={() => {
                      localStorage.setItem("profileUsername", profileUsername);
                      navigate("/Chat");
                    }}
                  >
                    Chat with me!
                  </button>
                </div>
              )}
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
              existingFriends={friends.map((friend) => friend.friendID)} // Pass existing friends' IDs
            />
          )}
        </div>
      </div>
    </div>
  );
}

{
  /* Bottom Logo 
      <div className="absolute bottom-10">
        <img className="w-[178px] h-[90px]" src={beeLogo} alt="Logo" />
      </div>*/
}
