import React, { useState, useEffect } from "react";
import "../css/posts.css";

const UsersFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(Array(posts.length).fill(false));

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

  const handleLike = async (postId, index) => {
    try {
      const response = await fetch("posting/setLikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        // Update the like count locally
        const updatedPosts = [...posts];
        if (likedPosts[index]) {
          updatedPosts[index].likeCount =
            parseInt(updatedPosts[index].likeCount) - 1;
        } else {
          updatedPosts[index].likeCount =
          parseInt(updatedPosts[index].likeCount) + 1; 
        }
        setPosts(updatedPosts);
        const updatedLikedPosts = [...likedPosts];
        updatedLikedPosts[index] = !updatedLikedPosts[index]; // Toggle the like status for the specific post
        setLikedPosts(updatedLikedPosts);
      } else {
        console.error("Failed to like the post");
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="feedContainer">
      <div className="feed">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="postContentContainer"
            >
              {/* User Information */}
              <div className="userInfoContainer">
                <span className="font-bold text-gray-800">
                  {post.userID.name || post.userID || "Unknown User"}
                </span>
              </div>

              {/* Post Content */}
              <div className="postContent">
                {post.textContent && (
                  <p className="text-gray-800 text-lg mt-2">
                    {post.textContent}
                  </p>
                )}
                {post.media && post.media.trim() !== "" && (
                  <img
                    src={post.media}
                    alt="Post Media"
                    className="media"
                  />
                )}
              </div>

              {/* Stats and Action Buttons */}
              <div className="postStatsContainer">
                <div className="text-gray-500">
                  <span className="mr-2">{post.likeCount || 0} Likes</span>
                  <span className="mr-2">
                    {post.commentCount || 0} Comments
                  </span>
                  <span>{post.sharesCount || 0} Shares</span>
                </div>
                <div>
                  <button
                    className={`${
                      likedPosts[index]
                        ? "postUnlikeButton"
                        : "postLikeButton"
                    } `}
                    onClick={() => handleLike(post._id, index)}
                  >
                    {likedPosts[index] ? "Unlike" : "Like"}
                  </button>
                  <button className="postStatButtons">Comment</button>
                  <button className="postStatButtons">Share</button>
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
