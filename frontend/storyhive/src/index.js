import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <p id="db-text">database contents: </p>

    <button onClick={() =>{
      //stores the text from our <p> element
      const text = document.querySelector("#db-text");

      //change the text in the <p> when button is pressed
      text.textContent = "waiting...";

      //make a GET request to /clicked endpoint
      fetch('http://localhost:10000/clicked', {method: 'GET'})
      .then(response => response.text())
      .then(data => {
        //change the text in the <p> when we get a response from the backend
        text.textContent = data;
      });
    }}>
      Press Me
    </button>
  </React.StrictMode>
);

//'https://storyhive-app.onrender.com/backend/clicked'
//http://localhost:10000/clicked
