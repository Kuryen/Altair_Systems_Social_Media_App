import "../loginRegister.css";
import beeLogo from './pics/bee.png';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

export default function LoginPage({onSwitchLoginClick}) {

  const navigate = useNavigate();  // Initialize useNavigate
  
  return (
  <div class="LRContainer">

  <button onClick = {onSwitchLoginClick} class="switchTab">
      <div class="unselectedTab"></div>
      <div class="left-[215px] top-[33px] textOfUnselectedTab">SIGNUP</div>
      <div class="selectedTab left-0 top-0"></div>
      <div class="left-[60px] top-[25px] textOfSelectedTab">LOGIN</div>
    </button>
    
    <div class="whiteBack left-[575px] top-[244px]"></div>
    <div class="welcomeText left-[701px] top-[409px]">Welcome back to Storyhive<br/></div>

    <form id = "login-form1">
      {/* username bubble and input */}
      <div class="inputContainer left-[669px] top-[420px]">
        <label class="w-full h-full" for="uname">
          <input class="inputBubble" type="text" id="uname" name = "uname" placeholder="Enter Username" required/>
        </label>
      </div>

        {/* password bubble and input */}
      <div class="inputContainer left-[668px] top-[440px]">
        <label class="w-full h-full" for="pword">
          <input class="inputBubble" type="password" id="pword" name = "pword" placeholder="Enter Password" required/>
        </label>
      </div>
    </form>


    {/* Next button */}
    <div class="submitButtonContainer left-[701px] top-[455px]">
    <button type="submit" onClick={ async(event) => {
                    event.preventDefault();
                    const data = {
                        //store the contents of the html form
                        name: document.querySelector("#login-form1").elements.uname.value,
                        pass: document.querySelector("#login-form1").elements.pword.value
                    };
                    const options = {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    //send the json to the api and return the result!
                    const response = await fetch('http://localhost:10000/authenticate/check-form', options);
                    const json = await response.json();
                    alert(json.status);

                    if (json.status === "Login successful!") {
                      navigate('/profile');  // Redirect to profile page on successful login
                      const passUsername = document.querySelector("#uname").value; //create constant to pass the username via local storage
                      localStorage.setItem("elementData", passUsername);
                    } else {
                      alert(json.status);  // Display error message
                    }
                    
                }} class="submitButton">
                    Submit
      </button>
    </div>

    {/* forgot password link */}
    <a href="#" class="forgotPassword">FORGOT PASSWORD</a>

    {/* bee image */}
    <img src={beeLogo} alt="site bee logo"/>

</div>
    );
}

//testing http://localhost:10000/check-form
//deployment https://storyhive-app.onrender.com/check-form


