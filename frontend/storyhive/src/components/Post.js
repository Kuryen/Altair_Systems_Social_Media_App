import React, { useEffect, useState } from "react";
import CreatePostButton from "./CreatePostButton";

export default function Post() {
  // State to store posts
  const [posts, setPosts] = useState([]);

  //function to get posts from the database and display them
  //just needs styling work
  function getPosts() {
    fetch("http://localhost:10000/posts", { method: "GET" })
      .then((response) => response.json()) // Parse JSON response
      .then((json) => {
        setPosts(json); // Store posts in state
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
      {/* Render CreatePostButton and pass getPosts as a callback */}
      <CreatePostButton onPostCreated={getPosts} />

      {/*display fetched posts*/}
      <div id="posts-container">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="post">
              <p>{post.textContent}</p>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
}

// for deployment https://storyhive-app.onrender.com/make-post
//for testing http://localhost:10000/make-post
