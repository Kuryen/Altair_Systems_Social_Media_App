import React, { useState, useEffect } from "react";
import beeLogo from "./pics/bee.png"; // Replace with your actual logo path
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import SearchBar from "./searchbar";
import SearchResultsList from "./searchresultlist";
import "../css/profile.css";
import socket from "../socket";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import axios from "axios";
import ProfilePictureUploader from "./ProfilePictureUP"; // Import the uploader component

export default function Profile() {
  const navigate = useNavigate();
  const loggedInUser =
    localStorage.getItem("elementData") || "No content found!"; // Retrieve the loggedInUser from localStorage
  const [profileUsername, setProfileUsername] = useState(loggedInUser);
  const [currentUser, setCurrentUser] = useState(true); //condition to change the profile view for users depending on if it is their profile or not
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [newFriendAdded, setNewFriendAdded] = useState(false); // Track when a friend is added
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePic") || "https://via.placeholder.com/150"
  );
  const [profilePictureCache, setProfilePictureCache] = useState({});
  const [missingProfilePictures, setMissingProfilePictures] = useState(new Set());

  useEffect(() => {
    setCurrentUser(profileUsername === loggedInUser);
  }, [profileUsername, loggedInUser]);

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
  }, [loggedInUser, newFriendAdded]); //refresh when a new friend is added


  //NOTE: MAKE SURE TO KEEP "/${profileUsername}" AT THE END OF GET REQUEST
  //*********************************************************************
  //http://localhost:10000/profilepicture/get-profile-picture for testing
  //https://storyhive-app.onrender.com/profilepicture/get-profile-picture for deployment
  
  // Fetch profile picture for profileUsername, with caching
  useEffect(() => {
    const fetchProfilePicture = async () => {
      // Check if profile picture is in cache
      if (profilePictureCache[profileUsername]) {
        setProfilePicture(profilePictureCache[profileUsername]);
        return;
      }

      try {
        const response = await axios.get(`https://storyhive-app.onrender.com/profilepicture/get-profile-picture/${profileUsername}`);
        const fetchedProfilePicture = response.data?.profilePicture || "https://via.placeholder.com/150";
        
        // Update the profile picture state and add to cache
        setProfilePicture(fetchedProfilePicture);
        setProfilePictureCache((prevCache) => ({
          ...prevCache,
          [profileUsername]: fetchedProfilePicture,
        }));
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicture("https://via.placeholder.com/150"); // Fallback on error
      }
    };

    fetchProfilePicture();
  }, [profileUsername, profilePictureCache]); // Re-fetch profile picture when profileUsername changes

  //SAME HERE
  //********************************************************************
  useEffect(() => {
    const fetchFriendsProfilePictures = async () => {
      const updatedFriends = await Promise.all(
        friends.map(async (friend) => {
          const username = typeof friend === "string" ? friend : friend?.username;
  
          // Check if the username is in the missing profile pictures cache
          if (missingProfilePictures.has(username)) {
            return { username, profilePicture: null };
          }
  
          // Check if profile picture is in cache
          if (profilePictureCache[username]) {
            return {
              username,
              profilePicture: profilePictureCache[username],
            };
          }
  
          try {
            const profileResponse = await axios.get(`https://storyhive-app.onrender.com/profilepicture/get-profile-picture/${username}`);
            const profilePicture = profileResponse.data?.profilePicture || null;
  
            // Cache the profile picture if it exists
            if (profilePicture) {
              setProfilePictureCache((prevCache) => ({
                ...prevCache,
                [username]: profilePicture,
              }));
            } else {
              // Add username to the missing profile pictures cache
              setMissingProfilePictures((prevSet) => new Set(prevSet).add(username));
            }
  
            return { username, profilePicture };
          } catch (error) {
            console.error(`Error fetching profile picture for ${username}:`, error);
            // Add username to the missing profile pictures cache on error
            setMissingProfilePictures((prevSet) => new Set(prevSet).add(username));
            return { username }; // Return the username without a profile picture if there's an error
          }
        })
      );
      setFriends(updatedFriends);
    };
  
    if (friends.length > 0) {
      fetchFriendsProfilePictures();
    }
  }, [friends, profilePictureCache, missingProfilePictures]);

  const handleAddFriend = () => {
    setNewFriendAdded(!newFriendAdded); //toggle to refresh friend list
  };

  // Update the profileUsername to the friend's username when clicking on a friend's profile
  const handleProfileClick = (friendUsername) => {
    setProfileUsername(friendUsername);
  };

  // Return to the logged-in user's profile
  const handleBackToOwnProfile = () => {
    setProfileUsername(loggedInUser);
  };

  const handleUploadSuccess = (newProfilePictureUrl) => {
    setProfilePicture(newProfilePictureUrl);
    localStorage.setItem("profilePic", newProfilePictureUrl); // Update localStorage
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
          <div className="profileInfo">
            <div className="profilePic relative">
              <img src={profilePicture} alt="User Avatar" />
              {currentUser && (
                <div className="relative">
                  {/* ProfilePictureUploader component for uploading profile picture */}
                  <ProfilePictureUploader
                    username={profileUsername}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </div>
              )}
            </div>
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
                : `Welcome to ${profileUsername}'s profile!`}
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
              {currentUser && (
                <div className="statDisplay">
                  <button
                    className="chatButton"
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
