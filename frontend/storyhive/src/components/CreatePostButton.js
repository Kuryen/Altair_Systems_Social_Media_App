import React, { useState } from "react";

export default function CreatePostButton({ onPostCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  // Function to handle post submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      textContent: postContent,
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
      const response = await fetch("http://localhost:10000/make-post", options);
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
      <div className="fixed bottom-3 right-3">
        <button
          className="sticky rounded-full text bg-black py-3 px-5 text-white"
          onClick={() => setShowForm(!showForm)}
        >
          +
        </button>
      </div>

      {showForm && (
        <div className="fixed bottom-16 right-3 bg-white p-5 rounded shadow-md">
          <form onSubmit={handleSubmit}>
            <div>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to share?"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
