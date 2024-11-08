//testing the path that successfully sends the message
function run_post_tests(){
    post_test();
}

const userPostsEmpty = [];
const userPosts = ["hello"];
const arrayTest = {
    a: 'somestring',
    b: 42,
    c: false,
  };

const arrayTestEmpty = {};

post_test(arrayTest, userPostsEmpty);

post_test(arrayTest, userPosts);

post_test(arrayTestEmpty, userPosts);

post_test(arrayTestEmpty, userPostsEmpty);

function post_test(arrTest, posts){
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

}

module.exports = { run_post_tests };