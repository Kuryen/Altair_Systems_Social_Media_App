import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <p id="db-text">table 1 contents: </p>
    {/*WHEN COPYING BUTTON CODE, MAKE SURE TO CHANGE THE ENDPOINT FROM /CLICKED TO THE ENDPOINT YOU CREATED*/}
    <button onClick={() =>{
      //stores the text from our <p> element
      const text = document.querySelector("#db-text");

      //change the text in the <p> when button is pressed
      text.textContent = "waiting...";

      //make a GET request to /clicked endpoint
      fetch('https://storyhive-app.onrender.com/clicked', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        //creating a JSON from the data sent from the api
        var data_obj = JSON.stringify(data);
        data_obj = JSON.parse(data_obj);

        //pretty printing the data
        var output = "| ";
        for(let key in data_obj[0]){
          if(data_obj[0].hasOwnProperty(key)){
            let value = data_obj[0][key];
            output += (key + " : " + (key, value)) + " | ";
          }
        }
        //change the text in the <p> when we get a response from the backend
        text.textContent = output;
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


//USE THIS FOR DEPLOYMENT
//'https://storyhive-app.onrender.com/clicked'

//USE THIS TO TEST CHANGES LOCALLY
//http://localhost:10000/clicked
