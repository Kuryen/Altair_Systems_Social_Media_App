import React, { useEffect, useState } from "react";
import CreatePostButton from "./CreatePostButton";

export default function Post() {
  //function to get posts from the database and display them
  //just needs styling work
  function getPosts() {
    fetch("http://localhost:10000/posts", { method: "GET" })
      .then((response) => response.json()) // Parse JSON response
      .then((json) => {
        const postsContainer = document.getElementById("posts-container"); // Get container to display posts

        // Clear container if needed
        postsContainer.innerHTML = "";

        // Loop through the json and create DOM elements for each post
        Object.keys(json).map((key) => {
          const post = json[key]; // Access each post

          // Create a new div for each post
          const postElement = document.createElement("div");
          postElement.className = "post"; // You can style this class

          // Add the text content of the post
          const postContent = document.createElement("p");
          postContent.textContent = post.textContent;

          // Append the content to the post div
          postElement.appendChild(postContent);

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
    <div>
      {/* Render the CreatePostButton and pass the getPosts function as a callback */}
      <CreatePostButton onPostCreated={getPosts} />

      {/* Display fetched posts */}
      <div id="posts-container"></div>
    </div>
  );
}

// for deployment https://storyhive-app.onrender.com/make-post
//for testing http://localhost:10000/make-post
