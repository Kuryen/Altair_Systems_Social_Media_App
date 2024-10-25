export default function SearchResult({ result, currentUserID, onFriendAdded, existingFriends }) {
    // Check if this friend is already in the user's friend list
    const isAlreadyFriend = existingFriends.map(String).includes(String(result));
  
    const addFriend = () => {
      if (isAlreadyFriend) {
        alert("You're already following this user!");
        return; // Exit if friend already exists
      }
  
      // Proceed with adding friend if not already in list
      fetch("http://localhost:10000/friending/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: currentUserID,
          friend: result,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.status);
          onFriendAdded(); // Call to refresh friends list
        })
        .catch((error) => {
          console.error("Error following!:", error);
          alert("Failed to follow!");
        });
    };
  
    return (
      <div
        className={`px-5 py-2.5 ${isAlreadyFriend ? "cursor-not-allowed text-gray-400" : "hover:bg-gray-200 cursor-pointer"}`}
        onClick={!isAlreadyFriend ? addFriend : undefined}
      >
        {result}
      </div>
    );
  }


  //for testing: http://localhost:10000/add-friend
//for deployment: https://storyhive-app.onrender.com/add-friend