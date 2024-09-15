import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <p id="db-text">table 1 contents: </p>
    <button onClick={() =>{
      //stores the text from our <p> element
      const text = document.querySelector("#db-text");

      //change the text in the <p> when button is pressed
      text.textContent = "waiting...";

      //make a GET request to /clicked endpoint
      fetch('https://storyhive-app.onrender.com/clicked', {method: 'GET'})
      .then(response => response.text())
      .then(data => {
        //change the text in the <p> when we get a response from the backend
        var text = "";
        for(var key in data){
          text += (key + " | " + data[key] + "\n");
        }
        text.textContent = text;
      });
    }}>
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

    <p id="employee">Employee contents: </p>

    <p id="posts">Posts contents: </p>

    <p id="post-stats">PostStats contents: </p>

    <p id="post-comments">PostComments contents: </p>

    <p id="post-comment-stats">PostCommentStats contents: </p>
  </React.StrictMode>
);



//'https://storyhive-app.onrender.com/clicked'
//http://localhost:10000/clicked
