import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import beeLogo from "./pics/bee.png"; // Replace with your actual logo path
import UserTabs from "./UserTabs";
import FriendsList from "./FriendsList";
import SearchBar from "./searchbar";
import SearchResultsList from "./searchresultlist";
import "../css/profile.css";
import socket from "../socket";
import ProfilePictureUploader from "./ProfilePictureUP"; // Import the uploader component

export default function Profile() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("elementData") || "No content found!"; // Retrieve the loggedInUser from localStorage
  const [profileUsername, setProfileUsername] = useState(loggedInUser);
  const [currentUser, setCurrentUser] = useState(true); // Condition to change the profile view for users depending on if it is their profile or not
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [newFriendAdded, setNewFriendAdded] = useState(false); // Track when a friend is added
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureCache, setProfilePictureCache] = useState({});
  const [missingProfilePictures, setMissingProfilePictures] = useState(new Set());

  useEffect(() => {
    // Set whether this profile is the current logged-in user
    setCurrentUser(profileUsername === loggedInUser);
  }, [profileUsername, loggedInUser]);

  useEffect(() => {
    // Fetch friends using your API
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/friending/users-friends?user=${loggedInUser}`);
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
  }, [loggedInUser, newFriendAdded]); // Refresh when a new friend is added

  useEffect(() => {
    // Fetch user profile picture from localStorage for the current profile being viewed
    const profilePicturePath = localStorage.getItem(`${profileUsername}_profilePicture`);
    if (profilePicturePath) {
      // Add cache-busting parameter to force image refresh
      //http://localhost:10000${profilePicturePath}?t=${new Date().getTime()} testing
      //https://storyhive-app.onrender.com${profilePicturePath}?t=${new Date().getTime()} deployment
      const url = `http://localhost:10000${profilePicturePath}?t=${new Date().getTime()}`;
      setProfilePictureUrl(url);
    } else {
      setProfilePictureUrl(""); // Clear URL if no profile picture is found
    }
  }, [profileUsername]); // Run whenever the profile being viewed changes

      try {
        const response = await axios.get(`http://localhost:10000/profilepicture/get-profile-picture/${profileUsername}`);
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
  
          // Determine the username based on the structure of friend
          const username = typeof friend === "string" ? friend : friend?.username;
  
          // Ensure username is a valid string before proceeding
          if (typeof username === "string" && username) {
            try {
              const profileResponse = await axios.get(`http://localhost:10000/profilepicture/get-profile-picture/${username}`);
              console.log(`Profile picture for ${username}:`, profileResponse.data);
  
              // Return an object with username and profilePicture
              return {
                username,
                profilePicture: profileResponse.data?.profilePicture || null,
              };
            } catch (error) {
              console.error(`Error fetching profile picture for ${username}:`, error);
              return { username }; // Return the username without a profile picture if there's an error
            }
          } else {
            // Log an error if username is invalid and skip the API call
            console.error("Invalid friend format or missing username:", friend);
            return { username: "unknown" }; // Fallback to a default structure
          }
        })
      );
      setFriends(updatedFriends);
    };
    //comment out friends pfp load
    //if (friends.length > 0) {
      //fetchFriendsProfilePictures();
    //}
  }, [friends]);
  

  const handleAddFriend = () => {
    setNewFriendAdded(!newFriendAdded); // Toggle to refresh friend list
  };

  // Update the profileUsername to the friend's username when clicking on a friend's profile
  const handleProfileClick = (friendUsername) => {
    setProfileUsername(friendUsername); // Update state to show friend's profile
    setProfilePictureUrl(''); // Reset profile picture URL state to trigger a re-fetch
  };

  // Return to the logged-in user's profile
  const handleBackToOwnProfile = () => {
    setProfileUsername(loggedInUser);
  };


  //http://localhost:10000${newProfilePicturePath}?t=${new Date().getTime()} testing
  //https://storyhive-app.onrender.com${newProfilePicturePath}?t=${new Date().getTime()} deployment
  const handleUploadSuccess = (newProfilePicturePath) => {
    // Construct the new profile picture URL with cache-busting query parameter
    const newProfilePictureUrl = `http://localhost:10000${newProfilePicturePath}?t=${new Date().getTime()}`;

    // Update the state with the new profile picture URL
    setProfilePictureUrl(newProfilePictureUrl);

    // Update the cache with the new URL for the current profile username
    setProfilePictureCache((prevCache) => ({
      ...prevCache,
      [profileUsername]: newProfilePictureUrl,
    }));

    // Save the new profile picture URL path in local storage specific to the profile username
    localStorage.setItem(`${profileUsername}_profilePicture`, newProfilePicturePath);

    // If applicable, clear missing picture cache
    setMissingProfilePictures((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(profileUsername); // Remove from missing cache if present
      return newSet;
    });
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
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="User Avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = ""; // This triggers fallback to username
                    setProfilePictureUrl(null); // Set state to null on error to trigger fallback display
                  }}
                />
              ) : (
                <div className="usernameFallbackContainer">
                  <h6 className="username">{profileUsername}</h6>
                </div>
              )}
              {currentUser && (
                <div className="relative">
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
