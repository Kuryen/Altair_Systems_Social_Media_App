import React from "react";

function LoginForm(){
    return(
        <div>
            <form id="login-form">
                <label for="uname">Username:</label>
                <input type="text" id="uname" name="uname" placeholder="Enter username" required/>
                <br/>
                <label for="pword">Password:</label>
                <input type="password" id="pword" name="pword" placeholder="Enter password" required/>
                <br/>
                <button type="submit" onClick={ async(event) => {
                    event.preventDefault();
                    const data = {
                        //store the contents of the html form
                        name: document.querySelector("#login-form").elements.uname.value,
                        pass: document.querySelector("#login-form").elements.pword.value
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
                }}>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default LoginForm;

//USE THIS FOR DEPLOYMENT
//https://storyhive-app.onrender.com/check-form

//USE THIS TO TEST CHANGES LOCALLY
//http://localhost:10000/check-form