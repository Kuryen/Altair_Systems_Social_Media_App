import { useState } from "react";
import Post from "./Post";
import CreatePostButton from "./CreatePostButton";

export default function UserTabs() {
  const [activeSection, setActiveSection] = useState("posts");

  // Function to refresh posts (can be passed as a prop to CreatePostButton and Post)
  const refreshPosts = () => {
    // You can call the getPosts function from here if necessary.
    console.log("Refreshing posts...");
  };

  return (
    <div className="bg-[#bf6a02] rounded-lg h-[300px]">
      {/* Buttons tab */}
      <div className="grid grid-flow-col justify-stretch w-full py-4 bg-[#e5a000]">
        {/* Likes button */}
        <button
          className={`text-white focus:underline`}
          onClick={() => setActiveSection("likes")}
        >
          Likes
        </button>

        {/* Posts button */}
        <button
          className={`text-white focus:underline`}
          onClick={() => setActiveSection("posts")}
        >
          Posts
        </button>

        {/* Replies button */}
        <button
          className={`text-white focus:underline`}
          onClick={() => setActiveSection("replies")}
        >
          Replies
        </button>
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
          <Post />
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
