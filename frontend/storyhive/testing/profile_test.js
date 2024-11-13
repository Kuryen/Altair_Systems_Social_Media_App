function profile_test(){

}

const friend = "testname";
const friendObject = { username: "objectName" };
const friendObjectNoUsername = { name: "noName" };

//determineUsername_test(friendObjectNoUsername);

function determineUsername_test(friend){
  user = typeof friend === "string" ? friend : friend?.username;
  console.log("user: " + user);
}

const username = "testname";
const usernameObject = { username: "objectName" };
const emptyUsername = "";

validUsername_test(usernameObject);

function validUsername_test(username)
{
  if (typeof username === "string" && username) {
    console.error("Valid username: " + username);
  } else {
    // Log an error if username is invalid and skip the API call
    console.error("Invalid friend format or missing username:", username);
    return { username: "unknown" }; // Fallback to a default structure
  }
}

module.exports = { profile_test };