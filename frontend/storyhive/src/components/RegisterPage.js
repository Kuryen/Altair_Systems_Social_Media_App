import React, { useState } from "react";
import beeLogo from "./pics/bee.png";

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
    <div className="w-[1920px] h-[1239px] relative bg-[#bf6a02] border border-white">
      <div className="w-[1920px] h-[1239px] left-0 top-0 absolute border border-black">
        <button
          onClick={onSwitchLoginClick}
          className="w-[350px] h-[95px] left-[1366px] top-[100px] absolute"
        >
          <div className="w-[350px] h-[95px] left-0 top-[1px] absolute bg-[#a2845e] rounded-[100px]"></div>

          <div className="w-[198px] h-[95px] left-40 top-0 absolute bg-[#fff1c2] rounded-[100px]"></div>
          <div className="left-[215px] top-[29px] absolute text-[#111111] text-3xl font-bold font-['Poppins'] lowercase">
            SIGNUP
          </div>
          <div className="left-[60px] top-[35px] absolute text-[#222222] text-xl font-bold font-['Poppins'] lowercase">
            LOGIN
          </div>
        </button>

        <div className="w-[771px] h-[820px] left-[575px] top-[244px] absolute rounded-[100px] bg-white shadow-xl"></div>
        <div className="w-[607px] h-[60px] left-[760px] top-[409px] relative pl-7 text-black text-[40px] font-bold font-['Poppins']">
          Welcome to Storyhive!
        </div>

        <form id="reg-form">
          {/* username bubble and input */}
          <div className="w-[584px] h-[126px] left-[669px] top-[420px] relative">
            <label className="w-full h-full" htmlFor="unamer">
              <input
                className="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic"
                type="text"
                id="unamer"
                name="unamer"
                placeholder="Username"
                required
              />
            </label>
          </div>

          {/* email bubble and input */}
          <div className="w-[584px] h-[126px] left-[668px] top-[437px] relative">
            <label className="w-full h-full" htmlFor="emlr">
              <input
                className="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic"
                type="email"
                id="emlr"
                name="emlr"
                placeholder="Email"
                required
              />
            </label>
          </div>

          {/* password bubble and input */}
          <div className="w-[584px] h-[126px] left-[668px] top-[455px] relative">
            <label className="w-full h-full" htmlFor="pwordr">
              <input
                className="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic"
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
            className="w-[126px] h-[138px] left-[898px] top-[271px] absolute"
            src={beeLogo}
            alt="site bee logo"
          />

          {/* Submit button */}
          <div className="w-[237px] h-[102px] left-[860px] top-[455px] relative">
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
                  "http://localhost:10000/authenticate/register",
                  options
                );
                const json = await response.json();
                alert(json.status);
              }}
              className="w-[186px] h-[80px] top-[12px] relative bg-[#e5a000] text-black text-3xl font-semibold font-['Arial'] rounded-[100px] hover:text-white"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

//testing http://localhost:10000/register
//deployment https://storyhive-app.onrender.com/register
