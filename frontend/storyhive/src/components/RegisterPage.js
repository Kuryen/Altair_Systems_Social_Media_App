import React, { useState } from "react"; 
import beeLogo from './pics/bee.png'

function RegisterPage({onSwitchLoginClick}) {
  
  return (
    <div className="LRContainer">

      <button onClick = {onSwitchLoginClick} class="switchTab">
        <div class="selectedTab"></div>
        <div class="unselectedTab"></div>
        <div class="textOfSelectedTab left-[215px] top-[29px]">SIGNUP</div>
        <div class="textOfUnselectedTab left-[60px] top-[35px]">LOGIN</div>
      </button>

        <div className="whiteBack left-[575px] top-[244px]"></div>
        <div className="welcomeText left-[760px] top-[409px]">
          Welcome to Storyhive!
        </div>

        <form id = "reg-form">
          {/* username bubble and input */}
          <div className="inputContainer left-[669px] top-[420px]">
            <label className="w-full h-full" htmlFor="unamer">
              <input
                className="inputBubble"
                type="text"
                id="unamer"
                name = "unamer"
                placeholder="Username" required
              />
            </label>
          </div>

          {/* email bubble and input */}
          <div className="inputContainer left-[668px] top-[437px]">
            <label className="w-full h-full" htmlFor="emlr">
              <input
                className="inputBubble"
                type="email"
                id="emlr"
                name = "emlr"
                placeholder="Email" required
              />
            </label>
          </div>

          {/* password bubble and input */}
          <div className="inputContainer left-[668px] top-[455px]">
            <label className="w-full h-full" htmlFor="pwordr">
              <input
                className="inputBubble"
                type="password"
                id="pwordr"
                name = "pwordr"
                placeholder="Enter Password" required
              />
            </label>
          </div>

           {/* bee image */}
    <img src={beeLogo} alt="site bee logo"/>


          {/* Submit button */}
          <div className="submitButtonContainer left-[860px] top-[455px]">
            <button type="submit" onClick={ async(event) => {
                event.preventDefault();
                const data = {
                  //store content of html form
                  namer: document.querySelector("#reg-form").elements.unamer.value,
                  passr: document.querySelector("#reg-form").elements.pwordr.value,
                  emailr: document.querySelector("#reg-form").elements.emlr.value
                };
                const options = {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers: {
                    'Content-Type' : 'application/json'
                  }
                };

                //send the json to the api and return the result
                const response = await fetch('http://localhost:10000/authenticate/register', options);
                    const json = await response.json();
                    alert(json.status);
                }}
              className="submitButton top-[12px]"
            >
              Register
            </button>
          </div>
        </form>

       
    </div>
  );
}

export default RegisterPage;


//testing http://localhost:10000/register
//deployment https://storyhive-app.onrender.com/register