import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <p id="db-text">table 1 contents: </p>
    {/*WHEN COPYING BUTTON CODE, MAKE SURE TO CHANGE THE ENDPOINT FROM /CLICKED TO THE ENDPOINT YOU CREATED*/}
    <button
      onClick={() => {
        //stores the text from our <p> element
        const text = document.querySelector("#db-text");

        //change the text in the <p> when button is pressed
        text.textContent = "waiting...";

        //make a GET request to /clicked endpoint
        //when fetching data from the frontend, you just need to pass the collection name as a query parameter like this:
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=clicked",
          { method: "GET" }
        )
          .then((response) => response.json())
          .then((data) => {
            //creating a JSON from the data sent from the api
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            //pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + (key, value) + " | ";
              }
            }
            //change the text in the <p> when we get a response from the backend
            text.textContent = output;
          });
      }}
    >
      Table 1
    </button>

    <p id="user">User contents: </p>

    <p id="user-profile">UserProfile contents: </p>

    <p id="user-settings">UserSettings contents: </p>

    <p id="location">Location contents: </p>

    <p id="user-status">UserStatus contents: </p>

    <p id="following-status">FollowingStatus contents: </p>

    <p id="friend-status">FriendStatus contents: </p>

    <p id="block-status">BlockStatus contents: </p>

    <p id="user-stats">UserStats contents: </p>

    <p id="admin">Admin contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#admin");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=admin",
          { method: "GET" }
        )
          .then((response) => response.json())
          .then((data) => {
            // Process the response from the API
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            // Pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + value + " | ";
              }
            }
            // Change the text in the <p> element to display the data
            text.textContent = output;
          });
      }}
    >
      Admin
    </button>

    <p id="employee">Employee contents: </p>
    <button
      onClick={() => {
        // Stores the text from the <p> element for posts
        const text = document.querySelector("#employee");

        // Change the text in the <p> when the button is pressed
        text.textContent = "waiting...";

        // Make a GET request to the '/posts' endpoint
        fetch(
          "https://storyhive-app.onrender.com/fetch-data?collection=employee",
          { method: "GET" }
        )
          .then((response) => response.json())
          .then((data) => {
            // Process the response from the API
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            // Pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + value + " | ";
              }
            }
            // Change the text in the <p> element to display the data
            text.textContent = output;
          });
      }}
    >
      Employee
    </button>

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
          .then((response) => response.json())
          .then((data) => {
            // Process the response from the API
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            // Pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + value + " | ";
              }
            }
            // Change the text in the <p> element to display the data
            text.textContent = output;
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
          "https://storyhive-app.onrender.com/fetch-data?collection=post-stats",
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            // Process the response from the API
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            // Pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + value + " | ";
              }
            }
            // Change the text in the <p> element to display the data
            text.textContent = output;
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
          "https://storyhive-app.onrender.com/fetch-data?collection=post-comments",
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            // Process the response from the API
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            // Pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + value + " | ";
              }
            }
            // Change the text in the <p> element to display the data
            text.textContent = output;
          });
      }}
    >
      Post Comments
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
          "https://storyhive-app.onrender.com/fetch-data?collection=post-comment-stats",
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            // Process the response from the API
            var data_obj = JSON.stringify(data);
            data_obj = JSON.parse(data_obj);

            // Pretty printing the data
            var output = "| ";
            for (let key in data_obj[0]) {
              if (data_obj[0].hasOwnProperty(key)) {
                let value = data_obj[0][key];
                output += key + " : " + value + " | ";
              }
            }
            // Change the text in the <p> element to display the data
            text.textContent = output;
          });
      }}
    >
      Post Comment Stats
    </button>
  </React.StrictMode>
);

//USE THIS FOR DEPLOYMENT
//'https://storyhive-app.onrender.com/clicked'

//USE THIS TO TEST CHANGES LOCALLY
//http://localhost:10000/clicked
