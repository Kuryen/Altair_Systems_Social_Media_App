import React, { useState } from "react";
import "../css/createPost.css";

export default function CreatePostButton({ onPostCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  // Function to handle post submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      textContent: postContent,
      current_user: localStorage.getItem("elementData"),
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      // Send the post data to the backend API
      const response = await fetch(
        "https://storyhive-app.onrender.com/posting/make-post",
        options
      );
      const json = await response.json();
      alert(json.status);

      // Clear the form and hide it after submission
      setPostContent("");
      setShowForm(false);
      // Call the callback to refresh posts
      if (typeof onPostCreated === "function") {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <div className="postButtonContainer">
        <button onClick={() => setShowForm(!showForm)}>+</button>
      </div>

      {showForm && (
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <div class="textFieldContainer">
              <textarea
                className="textField"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to share?"
                required
              />
            </div>
            <div className="submitPostButton">
              <button type="submit">Post</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
