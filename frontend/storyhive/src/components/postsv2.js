import React, { useEffect, useState } from "react";
import CreatePostButton from "./CreatePostButton";

export default function Post() {
  const [posts, setPosts] = useState([]);

  // Function to fetch posts from the backend
  const getPosts = () => {
    fetch("http://localhost:10000/posts", { method: "GET" })
      .then((response) => response.json())
      .then((json) => {
        setPosts(json); // Set the fetched posts in state
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="w-full mt-6">
      {/* Render the CreatePostButton and pass the getPosts function as a callback */}
      <CreatePostButton onPostCreated={getPosts} />

      {/* Display fetched posts */}
      <div id="posts-container" className="mt-4 max-h-80 overflow-auto bg-orange-100 p-4 rounded-lg"> {/* Adjusted for scroll */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id} // Use unique post ID for keys
              className="bg-gray-100 shadow-md rounded-lg mb-4" // Tailwind styling for each post
            >
              {/* User information */}
              <div className="flex items-center border-b border-gray-300 p-4">
                <span className="font-bold text-gray-800">{post.userID || "Unknown User"}</span>
                <span className="text-gray-500 text-sm ml-2">{post.createdAt || "Date Unavailable"}</span>
              </div>

              {/* Post content */}
              <div className="p-4 border-b border-gray-300">
                {post.textContent && (
                  <p className="text-gray-800 text-lg mt-2">{post.textContent}</p>
                )}
                {post.media && post.media.trim() !== "" && (
                  <img
                    src={post.media}
                    alt="Post Media"
                    className="mt-2 rounded-md w-full h-auto" // Ensuring the image is responsive
                  />
                )}
              </div>

              {/* Stats and action buttons */}
              <div className="p-4 flex justify-between items-center">
                <div className="text-gray-500">
                  <span className="mr-2">{post.likeCount} Likes</span>
                  <span className="mr-2">{post.commentCount} Comments</span>
                  <span>{post.sharesCount} Shares</span>
                </div>
                <div>
                  <button className="text-blue-500 hover:underline">Like</button>
                  <button className="text-blue-500 hover:underline ml-4">Comment</button>
                  <button className="text-blue-500 hover:underline ml-4">Share</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts available.</p>
        )}
      </div>
    </div>
  );
}

// for deployment https://storyhive-app.onrender.com/make-post
//for testing http://localhost:10000/make-post
