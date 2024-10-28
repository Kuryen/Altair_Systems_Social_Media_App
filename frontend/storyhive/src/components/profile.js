import React, { useState, useEffect } from "react";
import beeLogo from "./pics/bee.png"; // Replace with your actual logo path
import Post from "./Postv3"; // Import the Post component
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import SearchBar from "./searchbar";
import SearchResultsList from "./searchresultlist";
import "../css/profile.css";
import socket from "../socket";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

export default function Profile() {
  const navigate = useNavigate();

  // Store which profile is currently being viewed (either the user's or a friend's)
  const [activeProfile, setActiveProfile] = useState(
    localStorage.getItem("elementData") || "No content found!"
  );

  const loggedInUser = localStorage.getItem("elementData"); // Logged-in user
  const [currentUser, setCurrentUser] = useState(true); // Track if it's the user's own profile

  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [newFriendAdded, setNewFriendAdded] = useState(false); // Track friend additions

  // Update the view to reflect if it is the current user's profile or not
  useEffect(() => {
    setCurrentUser(activeProfile === loggedInUser);
  }, [activeProfile, loggedInUser]);

  // First useEffect for socket connection (Optional: Uncomment if needed)
  /*
  useEffect(() => {
    socket.connect();
    // Emit username when the component mounts
    socket.emit("registerUser", activeProfile); // Use actual username passed as prop

    // Listen for online users update
    socket.on("updateOnlineUsers", (users) => {
      console.log("Online Users:", users);
    });

    // Cleanup on unmount
    return () => {
      socket.off("updateOnlineUsers");
      // Do not disconnect unless you want to close the socket when leaving this component
    };
  }, [activeProfile]);
  */

  // Fetch friends from the backend API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `/friending/users-friends?user=${loggedInUser}`
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
  }, [loggedInUser, newFriendAdded]);

  const handleAddFriend = () => {
    setNewFriendAdded((prev) => !prev); // Toggle to refresh friends list
  };

  // Handle clicking a friend's hexagon to view their profile
  const handleProfileClick = (friendUsername) => {
    setActiveProfile(friendUsername); // Switch to the friend's profile
  };

  // Handle navigating back to the logged-in user's profile
  const handleBackToOwnProfile = () => {
    setActiveProfile(loggedInUser); // Switch back to the user's own profile
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
            <p>Hello, {activeProfile}</p>
            <p>HIVE</p>
            <p>BUZZ</p>
            <p>BLOOM</p>
            <p>Settings</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profileInfoContainer">
          <div className="profileInfo">
            <div className="displayName">{activeProfile}</div>
            <div className="username">@{activeProfile}</div>

            {/* Profile Actions */}
            <div className="profileInteractContainer">
              {currentUser ? (
                <>
                  <button>Edit Profile</button>
                  <button>Share Profile</button>
                </>
              ) : (
                <button onClick={() => navigate("/Chat")}>Message</button>
              )}

              {/* Back to Own Profile Button */}
              {!currentUser && (
                <button onClick={handleBackToOwnProfile}>
                  Back to My Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio & Stats */}
          <div className="profileStatsContainer">
            <p>
              {currentUser
                ? "Hello everyone! Welcome to my profile. Excited to connect with you all."
                : `Welcome to ${activeProfile}'s profile!`}
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
                  <button onClick={() => navigate("/Chat")}>
                    Chat with me!
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div className="profilePostsContainer">
            <h3 className="text-xl font-bold mb-4">Posts</h3>
            <Post username={activeProfile} />{" "}
            {/* Display posts for active profile */}
          </div>
        </div>

        {/* User Tabs */}
        <div className="profileTabs">
          <UserTabs />
        </div>
      </div>

      {/* Search Bar */}
      <div className="searchBar">
        <div className="search-bar-container">
          <SearchBar setResults={setResults} />
          {results.length > 0 && (
            <SearchResultsList
              results={results}
              currentUserID={activeProfile}
              onFriendAdded={handleAddFriend}
              existingFriends={friends.map((friend) => friend.friendID)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
