import React from "react";


export default function Post(){

    
    //function to get posts from the database and display them 
    //just needs styling work
    function getPosts() {
        fetch("http://localhost:10000/posts", { method: "GET" })
          .then((response) => response.json()) // Parse JSON response
          .then((json) => {
            const postsContainer = document.getElementById("posts-container"); // Get container to display posts
            
            // Clear container if needed 
            postsContainer.innerHTML = '';
      
            // Loop through the json and create DOM elements for each post
            Object.keys(json).map((key) => {
              const post = json[key]; // Access each post
      
              // Create a new div for each post
              const postElement = document.createElement("div");
              postElement.className = "post"; // You can style this class
      
              // Add the text content of the post
              const postContent = document.createElement("p");
              postContent.textContent = post.textContent;
      
              // Append the content to the post div
              postElement.appendChild(postContent);
      
              // Append each post div to the main container
              postsContainer.appendChild(postElement);
            });
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
      }

      getPosts();
    
    
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

        {/*display fetched posts*/}
        <div id = "posts-container" onload = "getPosts()">
        </div>
       </div>
    )
}



// for deployment https://storyhive-app.onrender.com/make-post
//for testing http://localhost:10000/make-post