function run_login_tests(){
  //In order to achieve C0 coverage, we must visit each statement once.
  //Testing for one user/password combo that exists and one that does not exist will cover both paths inside our api.
  login("matt", "123");
  login("matt", "122");
}
function run_register_tests(){
  //testing the email validation function that is part of the register module
  console.log("validation result: " + validateEmail("unittestuser@gmail.c"));
  //Testing all execution paths of our register API + API call: invalid email, valid credentials, and existing credentials
  register("unittestuser", "123", "UnitTestUser@gmail.co");
  register("unittestuser", "123", "unittestuser@gmail.com");
  register("unittestuser", "123", "unittestuser@gmail.com");
}

function login(uname, pword){
    const data = {
      //store the contents of the html form
      name: uname,
      pass: pword
    };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("http://localhost:10000/authenticate/check-form", options)
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
    })
    //const json = response.json();
    //console.log(json.status);
}

function validateEmail(email){
  if(String(email).match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/) != null){
    return true;
  }else{
    return false;
  }
}

function register(uname, pword, email){
  const data = {
    //store content of html form
    namer: uname,
    passr: pword,
    emailr: email,
  };

  if(validateEmail(data.emailr)){
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    //send the json to the api and return the result
    fetch("http://localhost:10000/authenticate/register", options)
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
    })
  }else{
    console.log("This is not a valid email address!");
  }
}

module.exports = { run_login_tests, run_register_tests };