import { Button } from 'bootstrap';
import beeLogo from './bee.png';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

export default function LoginPage({onSwitchLoginClick}) {

  const navigate = useNavigate();  // Initialize useNavigate
  
  return (
  <div class="w-[1920px] h-[1239px] relative bg-[#bf6a02] border border-white">
  <div class="w-[1920px] h-[1239px] left-0 top-0 absolute border border-black">

  <button onClick = {onSwitchLoginClick} class="w-[350px] h-[95px] left-[1366px] top-[100px] absolute">
      <div class="w-[350px] h-[95px] left-0 top-[1px] absolute bg-[#a2845e] rounded-[100px]"></div>
      <div class="left-[215px] top-[33px] absolute text-[#111111] text-xl font-bold font-['Poppins'] lowercase">SIGNUP</div>
      <div class="w-[198px] h-[95px] left-0 top-0 absolute bg-[#fff1c2] rounded-[100px]"></div>
      <div class="left-[60px] top-[25px] absolute text-[#222222] text-3xl font-bold font-['Poppins'] lowercase">LOGIN</div>
    </button>
    
    <div class="w-[771px] h-[820px] left-[575px] top-[244px] absolute rounded-[100px] bg-white shadow-xl"></div>
    <div class="w-[607px] h-[60px] left-[701px] top-[409px] relative pl-7 text-black text-[40px] font-bold font-['Poppins']">Welcome back to Storyhive<br/></div>

    <form id = "login-form1">
      {/* username bubble and input */}
      <div class="w-[584px] h-[126px] left-[669px] top-[420px] relative">
        <label class="w-full h-full" for="uname">
          <input class="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic" type="text" id="uname" name = "uname" placeholder="Enter Username" required/>
        </label>
      </div>

        {/* password bubble and input */}
      <div class="w-[584px] h-[126px] left-[668px] top-[440px] relative">
        <label class="w-full h-full" for="pword">
          <input class="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic" type="password" id="pword" name = "pword" placeholder="Enter Password" required/>
        </label>
      </div>
    </form>


    {/* Next button */}
    <div class="w-[237px] h-[102px] left-[701px] top-[455px] relative">
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
                    const response = await fetch('https://storyhive-app.onrender.com/check-form', options);
                    const json = await response.json();
                    alert(json.status);

                    if (json.status === "Login successful!") {
                      navigate('/profile');  // Redirect to profile page on successful login
                    } else {
                      alert(json.status);  // Display error message
                    }
                    
                }} class="w-[186px] h-[80px] top-[12px] relative bg-[#e5a000] text-black text-3xl font-semibold font-['Arial'] rounded-[100px] hover:text-white">
                    Submit
      </button>
    </div>

    {/* forgot password link */}
    <a href="#" class="w-[269px] h-[59px] left-[1005px] top-[385px] relative text-black text-[25px] font-normal font-['Poppins'] underline lowercase">FORGOT PASSWORD</a>

    {/* bee image */}
    <img class="w-[126px] h-[138px] left-[898px] top-[271px] absolute" src={beeLogo} alt="site bee logo"/>

  </div>
</div>
    );
}

//testing http://localhost:10000/check-form
//deployment https://storyhive-app.onrender.com/register


