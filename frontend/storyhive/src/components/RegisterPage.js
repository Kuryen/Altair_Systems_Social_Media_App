import React, { useState } from "react";
import beeLogo from "./pics/bee.png";
import "../css/loginRegister.css";

function RegisterPage({ onSwitchLoginClick }) {
  function validate(name, password, email) {
    console.log("Validating...");
    const errors = [];

    if (name.length === 0) {
      errors.push("Username can't be empty");
    }

    if (email.length < 5) {
      errors.push("Email should be at least 5 charcters long");
    }
    if (email.split("").filter((x) => x === "@").length !== 1) {
      errors.push("Email should contain a @");
    }

    if (password.length === 0) {
      errors.push("Password should be at least 1 characters long");
    }

    console.log("Validated!");
    return errors;
  }
  return (
    <div className="LRContainer">
        <button
          onClick={onSwitchLoginClick}
          className="switchTab"
        >
          <div className="left-0 top-[1px] unselectedTab"></div>

          <div className="left-40 top-0 selectedTab"></div>
          <div className="left-[215px] top-[29px] textOfSelectedTab">
            SIGNUP
          </div>
          <div className="left-[60px] top-[35px] textOfUnselectedTab">
            LOGIN
          </div>
        </button>

        <div className="left-[575px] top-[244px] whiteBack"></div>
        <div className="left-[760px] top-[409px] welcomeText">
          Welcome to Storyhive!
        </div>

        <form id="reg-form">
          {/* username bubble and input */}
          <div className="left-[669px] top-[420px] inputContainer">
            <label className="w-full h-full" htmlFor="unamer">
              <input
                className="inputBubble"
                type="text"
                id="unamer"
                name="unamer"
                placeholder="Username"
                required
              />
            </label>
          </div>

          {/* email bubble and input */}
          <div className="left-[668px] top-[437px] inputContainer">
            <label className="w-full h-full" htmlFor="emlr">
              <input
                className="inputBubble"
                type="email"
                id="emlr"
                name="emlr"
                placeholder="Email"
                required
              />
            </label>
          </div>

          {/* password bubble and input */}
          <div className="left-[668px] top-[455px] inputContainer">
            <label className="w-full h-full" htmlFor="pwordr">
              <input
                className="inputBubble"
                type="password"
                id="pwordr"
                name="pwordr"
                placeholder="Enter Password"
                required
              />
            </label>
          </div>

          {/* bee image */}
          <img
            src={beeLogo}
            alt="site bee logo"
          />

          {/* Submit button */}
          <div className="left-[860px] top-[455px] submitButtonContainer">
            <button
              type="submit"
              onClick={async (event) => {
                event.preventDefault();

                const data = {
                  //store content of html form
                  namer:
                    document.querySelector("#reg-form").elements.unamer.value,
                  passr:
                    document.querySelector("#reg-form").elements.pwordr.value,
                  emailr:
                    document.querySelector("#reg-form").elements.emlr.value,
                };

                const validationErrors = validate(
                  data.namer,
                  data.passr,
                  data.emailr
                );
                if (validationErrors.length > 0) {
                  alert(validationErrors.join("\n"));
                  console.log("Alerted");
                  return;
                }

                const options = {
                  method: "POST",
                  body: JSON.stringify(data),
                  headers: {
                    "Content-Type": "application/json",
                  },
                };

                //send the json to the api and return the result
                const response = await fetch(
                  "https://storyhive-app.onrender.com/authenticate/register",
                  options
                );
                const json = await response.json();
                alert(json.status);
              }}
              className="top-[12px] submitButton"
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
