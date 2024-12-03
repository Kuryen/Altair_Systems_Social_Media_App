import React, { useEffect } from "react";
import CreatePostButton from "./CreatePostButton";
import "../css/posts.css";

export default function Post() {
  // Function to get posts from the database and manually update the DOM
  function getPosts() {
    const currentUser = localStorage.getItem("elementData"); // Get username from localStorage

    fetch(`https://storyhive-app.onrender.com/posting/posts?user=${currentUser}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        const postsContainer = document.getElementById("posts-container"); // Get container to display posts

        // Clear container if needed
        postsContainer.innerHTML = "";

        // Check if there are any posts to display
        if (Object.keys(json).length === 0) {
          const noPostsMessage = document.createElement("p");
          noPostsMessage.className = "text-gray-500";
          noPostsMessage.textContent = "No posts available.";
          postsContainer.appendChild(noPostsMessage);
          return; // Stop further execution if there are no posts
        }

        // Filter posts by current user's username
        const userPosts = Object.values(json).filter((post) => {
          const userName =
            typeof post.userID === "object" ? post.userID.name : post.userID;
          return userName === currentUser;
        });

        // Display a message if no posts are found for the current user
        if (userPosts.length === 0) {
          const noUserPostsMessage = document.createElement("p");
          noUserPostsMessage.className = "text-gray-500";
          noUserPostsMessage.textContent =
            "No posts available for this user. Begin creating by clicking the plus button in the bottom right!";
          postsContainer.appendChild(noUserPostsMessage);
          return;
        }

        // Loop through filtered userPosts and create DOM elements for each
        //note : switch from mapping to forEach to complement username checking logic
        userPosts.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.className = "postContentContainer";

          // User information
          const userInfo = document.createElement("div");
          userInfo.className = "userInfoContainer";
          const userName =
            typeof post.userID === "object"
              ? post.userID.name
              : post.userID || "Unknown User";
          let createdAt = "Date Unavailable";
          if (post.createdAt) {
            const date = new Date(post.createdAt);
            if (!isNaN(date.getTime())) {
              createdAt = date.toLocaleString();
            }
          }
          userInfo.innerHTML = `<span class="font-bold text-gray-800">${userName}</span>`;
          postElement.appendChild(userInfo);

          // Post content
          const postContent = document.createElement("div");
          postContent.className = "postContent";
          if (post.textContent) {
            const postText = document.createElement("p");
            postText.className = "text-gray-800 text-lg mt-2";
            postText.textContent = post.textContent;
            postContent.appendChild(postText);
          }
          if (post.media && post.media.trim() !== "") {
            const postImage = document.createElement("img");
            postImage.src = post.media;
            postImage.alt = "Post Media";
            postImage.className = "media";
            postContent.appendChild(postImage);
          }
          postElement.appendChild(postContent);

          // Stats and action buttons
          const postActions = document.createElement("div");
          postActions.className = "postStatsContainer";
          postActions.innerHTML = `
            <div class="text-gray-500">
              <span class="mr-2">${post.likeCount || 0} Likes</span>
              <span class="mr-2">${post.commentCount || 0} Comments</span>
              <span>${post.sharesCount || 0} Shares</span>
            </div>
            <div>
              <button class="postStatButtons">Comment</button>
              <button class="postStatButtons">Share</button>
            </div>`;
          postElement.appendChild(postActions);

          // Append each post div to the main container
          postsContainer.appendChild(postElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  // useEffect to run getPosts when the component mounts
  useEffect(() => {
    getPosts();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="postContainer">
      <CreatePostButton onPostCreated={getPosts} />
      <div
        id="posts-container"
        className="post"
      ></div>
    </div>
  );
}
