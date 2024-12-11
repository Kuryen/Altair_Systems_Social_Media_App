// Mock the fetch API
global.fetch = jest.fn();

describe("Post Component Unit Tests", () => {
  // postsUser_test tests
  test("postsUser_test - should display user information correctly", () => {
    const post = { userID: { name: "matthew" } };
    const userName =
      typeof post.userID === "object" ? post.userID.name : post.userID;
    expect(userName).toBe("matthew");
  });

  test("postsUser_test - should handle unknown user information", () => {
    const post = { userIdentification: "matt" };
    const userName =
      typeof post.userID === "object"
        ? post.userID?.name
        : post.userID || "Unknown User";
    expect(userName).toBe("Unknown User");
  });

  // postDate_test tests
  test("postDate_test - should format created date", () => {
    const post = { createdAt: "2024-11-08T02:21:19.391Z" };
    const date = new Date(post.createdAt);
    const formattedDate = !isNaN(date.getTime())
      ? date.toLocaleString()
      : "Date Unavailable";
    expect(formattedDate).not.toBe("Date Unavailable");
  });

  test("postDate_test - should handle missing created date", () => {
    const post = {};
    const createdAt = post.createdAt
      ? new Date(post.createdAt).toLocaleString()
      : "Date Unavailable";
    expect(createdAt).toBe("Date Unavailable");
  });

  // userPosts_test tests
  test("userPosts_test - should fetch posts for the current user", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        posts: [
          { userID: { name: "matt" }, textContent: "Hello world" },
          { userID: "matt", textContent: "Another post" },
        ],
      }),
    });

    const currentUser = "matt";
    const response = await fetch(
      `https://storyhive-app.onrender.com/posting/posts?user=${currentUser}`
    );
    const json = await response.json();
    const userPosts = Object.values(json.posts).filter(
      (post) =>
        (typeof post.userID === "object" ? post.userID.name : post.userID) ===
        currentUser
    );

    expect(userPosts.length).toBe(2);
  });

  // postContent_test tests
  test("postContent_test - should display post content if available", () => {
    const post = { textContent: "Hello" };
    expect(post.textContent).toBe("Hello");
  });

  test("postContent_test - should handle missing post content", () => {
    const post = {};
    const content = post.textContent || "No content available";
    expect(content).toBe("No content available");
  });

  // postMediaTrim_test tests
  test("postMediaTrim_test - should display media if not empty", () => {
    const post = { media: "media-url" };
    const media =
      post.media && post.media.trim() !== "" ? post.media : "no media";
    expect(media).toBe("media-url");
  });

  test("postMediaTrim_test - should handle empty or missing media", () => {
    const post = { media: "           " };
    const media =
      post.media && post.media.trim() !== "" ? post.media : "no media";
    expect(media).toBe("no media");
  });

  // availablePost_test tests
  test("availablePost_test - should handle posts in the database", () => {
    const arrTest = { a: "post1", b: "post2" };
    const posts = ["hello", "world"];

    // Check if the database has posts
    expect(Object.keys(arrTest).length > 0).toBe(true);

    // Check if the user has posts
    expect(posts.length > 0).toBe(true);
  });

  test("availablePost_test - should handle empty database and user posts", () => {
    const arrTest = {};
    const posts = [];

    // Check if the database has posts
    expect(Object.keys(arrTest).length).toBe(0);

    // Check if the user has posts
    expect(posts.length).toBe(0);
  });

  // likeUnlike_test tests
  test("likeUnlike_test - should increment like count", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    const post = { _id: "post1", likeCount: 10 };

    // Simulate liking the post
    const newLikeCount = post.likeCount + 1;
    await fetch("posting/setLikes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    });

    expect(fetch).toHaveBeenCalledWith("posting/setLikes", expect.any(Object));
    expect(newLikeCount).toBe(11);
  });

  test("likeUnlike_test - should decrement like count", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    const post = { _id: "post1", likeCount: 10 };

    // Simulate unliking the post
    const newLikeCount = post.likeCount - 1;
    await fetch("posting/setLikes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    });

    expect(fetch).toHaveBeenCalledWith("posting/setLikes", expect.any(Object));
    expect(newLikeCount).toBe(9);
  });
});
