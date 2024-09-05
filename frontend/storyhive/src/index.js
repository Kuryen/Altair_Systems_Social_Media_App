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
      try{
        fetch('http://localhost:5000/clicked', {method: 'GET'})
        .then(response => response.text())
        .then(data => {
          //change the text in the <p> when we get a response from the backend
          text.textContent = data;
        });
      }catch(err){
        fetch('https://storyhive.onrender.com/backend/clicked', {method: 'GET'})
        .then(response => response.text())
        .then(data => {
          //change the text in the <p> when we get a response from the backend
          text.textContent = data;
        });
      }
    }}>
      Press Me
    </button>
  </React.StrictMode>
);

//'https://storyhive.onrender.com/backend/clicked'
