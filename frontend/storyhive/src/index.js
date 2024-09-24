import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <p id="user">User contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        var text = document.querySelector("#user");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/fetch-data' endpoint
        fetch("https://storyhive-app.onrender.com/fetch-data?collection=user", {
          method: "GET",
        })
          .then((response) => response.json()) // Expect JSON data
          .then((data) => {
            // Clear waiting text
            text.textContent = "";

            // Convert JSON data to table format
            const table = document.createElement("table");
            table.id = "dataTable"; // Add an id for the table to print later
            const headers = Object.keys(data[0]); // Use the keys of the first object for table headers

            // Create table header
            const headerRow = document.createElement("tr");
            headers.forEach((header) => {
              const th = document.createElement("th");
              th.textContent = header;
              headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // Populate rows
            data.forEach((item) => {
              const row = document.createElement("tr");
              headers.forEach((key) => {
                const td = document.createElement("td");
                td.textContent = item[key];
                row.appendChild(td);
              });
              table.appendChild(row);
            });

            // Append the table to the #user element
            text.appendChild(table);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            text.textContent = "Error fetching data";
          });
      }}
    >
      User
    </button>

    {/*
    <p id="posts">Posts contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#posts");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=posts",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      Posts
    </button>

    <p id="post-stats">PostStats contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#post-stats");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=shares",
          {
            method: "GET",
          }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      Post Stats
    </button>

    <p id="post-comments">PostComments contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#post-comments");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=comments",
          {
            method: "GET",
          }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      Post Comments
    </button>

    <p id="user-profile">UserProfile contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#user-profile");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=userProfile",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            console.log(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      UserProfile
    </button>

    <p id="user-settings">UserSettings contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#user-settings");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=userSettings",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      UserSettings
    </button>

    <p id="user-status">UserStatus contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#user-status");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=user-status",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      UserStatus
    </button>

    <p id="following-status">FollowingStatus contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#following-status");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=following-status",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      FollowingStatus
    </button>

    <p id="friend-status">FriendStatus contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#friend-status");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=friends",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      FriendStatus
    </button>

    <p id="block-status">BlockStatus contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#block-status");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=block-status",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      BlockStatus
    </button>

    <p id="user-stats">UserStats contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#user-stats");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=user-stats",
          { method: "GET" }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      UserStats
    </button>

    <p id="post-comment-stats">PostCommentStats contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#post-comment-stats");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=likes",
          {
            method: "GET",
          }
        )
          .then((response) => response.text())
          .then((data) => {
            //pretty printing the data
            var output = pretty_print(data);
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
            let str = text.innerHTML;
            str = str.split("\n").join("<br />");
            text.innerHTML = str;
          });
      }}
    >
      Post Comment Stats
    </button>
*/}
  </React.StrictMode>
);

//USE THIS FOR DEPLOYMENT
//'https://storyhive-app.onrender.com/fetch-data?collection=[COLLECTION NAME]'

//USE THIS TO TEST CHANGES LOCALLY
//http://localhost:10000/fetch-data?collection=[COLLECTION NAME]
