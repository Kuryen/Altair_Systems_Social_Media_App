import React from "react";


export default function Post(){

    /*
    //WIP : returning the posts from current user
    //fetch the posts from the current user
    fetch("http://localhost:10000/posts")
    .then((response) => response.json())
    .then((json) => {
    for(var key in json){
      //key refers to the index of each post in the db's posts collection. Each post has a field called textContent
      console.log(key + ": " + json[key].textContent)
    }
  });
  */

    return (
    <div>
    
        {/*form input bubble */}
       <form id = "post-form">
        <div> 
            <input type = "test" id = "postC" name = "postC" placeholder = "What do you want to share?" required/>
        </div>
       

        {/*submit form button*/}
        <button type = "submit" onClick = { async (event) => {
            event.preventDefault();
            const data = {
                textContent: document.querySelector("#post-form").elements.postC.value
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type' : 'application/json'
                }
            };
            
            //send json to api and return the result
            const response = await fetch ('https://storyhive-app.onrender.com/make-post', options);
                const json = await response.json();
                alert(json.status);
        }}
        >
            Post
        </button>
        </form>
       </div>
    )
}



// for deployment https://storyhive-app.onrender.com/make-post
//for testing http://localhost:10000/make-post