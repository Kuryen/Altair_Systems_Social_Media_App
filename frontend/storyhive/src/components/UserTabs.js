import { useState } from "react";
import Postv3 from "./Postv3.js";
import CreatePostButton from "./CreatePostButton";
import "../css/userTabs.css";

export default function UserTabs() {
  const [activeSection, setActiveSection] = useState("posts");

  // Function to refresh posts (can be passed as a prop to CreatePostButton and Post)
  const refreshPosts = () => {
    // You can call the getPosts function from here if necessary.
    console.log("Refreshing posts...");
  };

  return (
    <div className="userTabsContainer">
      {/* Buttons tab */}
      <div className="userTabs">
        {/* Likes button */}
        <button onClick={() => setActiveSection("likes")}>Likes</button>

        {/* Posts button */}
        <button onClick={() => setActiveSection("posts")}>Posts</button>

        {/* Replies button */}
        <button onClick={() => setActiveSection("replies")}>Replies</button>
      </div>

      {/* Content that shows up when you click on "Likes" */}
      {activeSection === "likes" && (
        <div className="content">
          <h2 className="text-2xl">Likes</h2>
          <p>This is the content for Likes.</p>
        </div>
      )}

      {/* Content that shows up when you click on "Posts" */}
      {activeSection === "posts" && (
        <div className="content">
          <CreatePostButton onPostCreated={refreshPosts} />
          <Postv3 />
        </div>
      )}

      {/* Content that shows up when you click on "Replies" */}
      {activeSection === "replies" && (
        <div className="content">
          <h2 className="text-2xl">Replies</h2>
          <p>This is the content for Replies.</p>
        </div>
      )}
    </div>
  );
}
