const { type } = require("@testing-library/user-event/dist/type");
const { text } = require("body-parser");

//testing the path that successfully sends the message
function run_post_tests(){
    availablePost_test();
}

// //----------------postsUser_test----------------
// const testPost_userNotObject = {
//     userID: "matt",
// }

// const testPost_userNotObject_wrongID = {
//     userIdentification: "matt",
// }

// const testPost_userObject = {
//     userID: { name: 'matthew' },
// }

// const testPost_userObject_wrongProperty = {
//     userID: { id: 'matthew' },
// }

// postsUser_test(testPost_userObject_wrongProperty);
// //----------------postsUser_test----------------

// //----------------PostDate_test----------------
// const testPost = {
//     createdAt:'2024-11-08T02:21:19.391Z'
// }

// const testPostNoCreatedAt = {

// }

// const testPostCreatedAtNaN = {
//     createdAt: 'date'
// }

// postDate_test(testPostNoCreatedAt);
// //^^^^^^^^^^^^^^postDate_test^^^^^^^^^^^^^^

// //----------------userPosts_test----------------
// const user = "matt";
// const emptyUser = "";
// const nullUser = null;
// let userEmpty;
// userPosts_test(user);
// //^^^^^^^^^^^^^^userPosts_test^^^^^^^^^^^^^^

// //----------------availablePost_test----------------
// //database
// const arrayTest = {
//     a: 'somestring',
//     b: 42,
//     c: false,
//   };
// const arrayTestEmpty = {};
// //user
// const userPostsEmpty = [];
// const userPosts = ["hello", "world", "!"];

// //test when the database has posts but the user does not
// availablePost_test(arrayTest, userPostsEmpty);
// //test when the database has posts and the user has posts
// availablePost_test(arrayTest, userPosts);
// //test when the database does not have posts but the user does
// availablePost_test(arrayTestEmpty, userPosts);
// //test when the database does not have posts and the user does not
// availablePost_test(arrayTestEmpty, userPostsEmpty);
// //----------------availablePost_test----------------

// //----------------postContent_test----------------
// const post = {
//     textContent: "hello"
// }

// //
// const postNoContent = {
// }

// postContent_test(postNoContent);
// //----------------postContent_test----------------

// //----------------postMediaTrim_test----------------
// const post = {
//     media: "hello"
// }

// const postEmpty = {
//     media: "           "
// }

// const postNoMedia = {
//     notMedia: "hello"
// }

// postMediaTrim_test(postNoMedia);
// //----------------postMediaTrim_test----------------

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
function postsUser_test(post)
{
                // User information
                const userName =
                  typeof post.userID === "object"
                    ? post.userID.name
                    : post.userID || "Unknown User";

                console.log(userName);
}

function postDate_test(post){
    let createdAt = "Date Unavailable";
                if (post.createdAt) {
                  const date = new Date(post.createdAt);
                  if (!isNaN(date.getTime())) {
                    createdAt = date.toLocaleString();
                  }
                }
                console.log(createdAt);
}
//////////////////////////////////////////////////////////////////////
function postContent_test(post){
        if (post.textContent)
        {
            console.log(post.textContent);
        }
}
//////////////////////////////////////////////////////////////////////
function postMediaTrim_test(post){
        if (post.media && post.media.trim() !== "")
        {
            console.log(post.media);
        }
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