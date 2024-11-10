//testing the path that successfully sends the message
function run_post_tests(){
    availablePost_test();
}


userPosts_test("matt");

//VVVVVVVVVVVVVVuserPosts_testVVVVVVVVVVVVVV
// const user = "matt";
// const emptyUser = "";
// const nullUser = null;
// let userEmpty;
// userPosts_test(user);
//^^^^^^^^^^^^^^userPosts_test^^^^^^^^^^^^^^

//VVVVVVVVVVVVVVVVVVVVVavailablePost_testVVVVVVVVVVVVVVVVVVVVVV
// const userPostsEmpty = [];
// const userPosts = ["hello", "world", "!"];
// const arrayTest = {
//     a: 'somestring',
//     b: 42,
//     c: false,
//   };

// const arrayTestEmpty = {};

// availablePost_test(arrayTest, userPostsEmpty);
// availablePost_test(arrayTest, userPosts);
// availablePost_test(arrayTestEmpty, userPosts);
// availablePost_test(arrayTestEmpty, userPostsEmpty);
//^^^^^^^^^^^^^^^^^^availablePost_test^^^^^^^^^^^^^^^^^^^^^^^^^^


function userPosts_test(currentUser)
{
    fetch(`https://storyhive-app.onrender.com/posting/posts?user=${currentUser}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
            // Filter posts by current user's username
            const userPosts = Object.values(json).filter((post) => {
                const userName =
                  typeof post.userID === "object" ? post.userID.name : post.userID;
                return console.log("current user: " + userName + "|" + "posts user:" + currentUser + "|" + (userName === currentUser));
              });
        })
}
//////////////////////////////////////////////////////////////////////
function postDate_test(currentUser)
{
    fetch(`https://storyhive-app.onrender.com/posting/posts?user=${currentUser}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
            // Filter posts by current user's username
            const userPosts = Object.values(json).filter((post) => {
                const userName =
                  typeof post.userID === "object" ? post.userID.name : post.userID;
                return (userName === currentUser);
              });
        })
            userPosts.forEach((post) => {
                console.log(post);
                // // User information
                // const userName =
                //   typeof post.userID === "object"
                //     ? post.userID.name
                //     : post.userID || "Unknown User";
                // let createdAt = "Date Unavailable";
                // if (post.createdAt) {
                //   const date = new Date(post.createdAt);
                //   if (!isNaN(date.getTime())) {
                //     createdAt = date.toLocaleString();
                //   }
                // }
              });
}
//////////////////////////////////////////////////////////////////////
function postContent_test(userPosts){
    userPosts.forEach((post) => {
        if (post.textContent)
        {
            console.log("post: " + post);
        }
    });
}
//////////////////////////////////////////////////////////////////////
function postTrim_test(userPosts){
    userPosts.forEach((post) => {
        if (post.media && post.media.trim() !== "")
        {
            console.log("post: " + post.textContent.trim());
        }
    });
}
        

//////////////////////////////////////////////////////////////////////
function availablePost_test(arrTest, posts){
    console.log("-------------post test start-----------");

    if (Object.keys(arrTest).length === 0) {
        console.log("no posts available");
        return; // Stop further execution if there are no posts
    }

    console.log("has posts")

    if (posts.length === 0) {
        console.log("User has no posts to display.");
        return;
    }

    console.log("user has posts")

    posts.forEach((post) => {
        if (post.textContent)
        {
            console.log("post: " + post);
        }
    });

}

module.exports = { run_post_tests };