import React from "react";
import { Button } from "bootstrap";
import beeLogo from "./pics/bee.png";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../css/loginRegister.css";

export default function LoginPage({ onSwitchLoginClick }) {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="LRContainer">
        <button
          onClick={onSwitchLoginClick}
          className="switchTab"
        >
          <div className="left-0 top-[1px] unselectedTab"></div>
          <div className="left-[215px] top-[33px] textOfUnselectedTab">
            SIGNUP
          </div>
          <div className="left-0 top-0 selectedTab"></div>
          <div className="left-[60px] top-[25px] textOfSelectedTab">
            LOGIN
          </div>
        </button>

        <div className="left-[575px] top-[244px] whiteBack"></div>
        <div className="left-[701px] top-[409px] welcomeText">
          Welcome back to Storyhive
          <br />
        </div>

        <form id="login-form1">
          {/* username bubble and input */}
          <div className="left-[669px] top-[420px] inputContainer">
            <label className="w-full h-full" htmlFor="uname">
              <input
                className="inputBubble"
                type="text"
                id="uname"
                name="uname"
                placeholder="Enter Username"
                required
              />
            </label>
          </div>

          {/* password bubble and input */}
          <div className="left-[668px] top-[440px] inputContainer">
            <label className="w-full h-full" htmlFor="pword">
              <input
                className="inputBubble"
                type="password"
                id="pword"
                name="pword"
                placeholder="Enter Password"
                required
              />
            </label>
          </div>
        </form>

        {/* Next button */}
        <div className="left-[701px] top-[455px] submitButtonContainer">
          <button
            type="submit"
            onClick={async (event) => {
              event.preventDefault();
              const data = {
                //store the contents of the html form
                name: document.querySelector("#login-form1").elements.uname
                  .value,
                pass: document.querySelector("#login-form1").elements.pword
                  .value,
              };
              const options = {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                  "Content-Type": "application/json",
                },
              };
              //send the json to the api and return the result!
              const response = await fetch(
                "https://storyhive-app.onrender.com/authenticate/check-form",
                options
              );
              const json = await response.json();
              alert(json.status);

              if (json.status === "Login successful!") {
                navigate("/profile"); // Redirect to profile page on successful login
                const passUsername = document.querySelector("#uname").value; //create constant to pass the username via local storage
                localStorage.setItem("elementData", passUsername);
                if (json.profilePic) {
                  localStorage.setItem("profilePic", json.profilePic); // Save profile picture
                }
              } else {
                alert(json.status); // Display error message
              }
            }}
            className="top-[12px] submitButton"
          >
            Submit
          </button>
        </div>

        {/* forgot password link */}
        <a
          href="#"
          className="left-[1005px] top-[385px] forgotPassword"
        >
          FORGOT PASSWORD
        </a>

        {/* bee image */}
        <img
          src={beeLogo}
          alt="site bee logo"
        />
      </div>
  );
}

//testing http://localhost:10000/check-form
//deployment https://storyhive-app.onrender.com/check-form
