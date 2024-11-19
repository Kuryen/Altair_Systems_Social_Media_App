import React, { useState, useEffect } from "react";

const UsersFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("posting/get-all-posts"); // Ensure this path is correct
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mt-6">
      <div className="mt-4 max-h-80 overflow-auto bg-orange-100 p-4 rounded-lg">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-100 shadow-md rounded-lg mb-4"
            >
              {/* User Information */}
              <div className="flex items-center border-b border-gray-300 p-4">
                <span className="font-bold text-gray-800">
                  {post.userID.name || post.userID || "Unknown User"}
                </span>
              </div>

              {/* Post Content */}
              <div className="p-4 border-b border-gray-300">
                {post.textContent && (
                  <p className="text-gray-800 text-lg mt-2">{post.textContent}</p>
                )}
                {post.media && post.media.trim() !== "" && (
                  <img
                    src={post.media}
                    alt="Post Media"
                    className="mt-2 rounded-md w-full h-auto"
                  />
                )}
              </div>

              {/* Stats and Action Buttons */}
              <div className="p-4 flex justify-between items-center">
                <div className="text-gray-500">
                  <span className="mr-2">{post.likeCount || 0} Likes</span>
                  <span className="mr-2">{post.commentCount || 0} Comments</span>
                  <span>{post.sharesCount || 0} Shares</span>
                </div>
                <div>
                  <button className="text-blue-500 hover:underline">Like</button>
                  <button className="text-blue-500 hover:underline ml-4">Comment</button>
                  <button className="text-blue-500 hover:underline ml-4">Share</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersFeed;
