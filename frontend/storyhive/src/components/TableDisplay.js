import React from "react";

function TableDisplay({collection_name}){
    return(
        <div>
            <p id={collection_name}>{collection_name} contents: </p>
            <button
                onClick={() => {
                    // Stores the text from the <p> element for posts
                    let placeholder = collection_name;
                    var text = document.querySelector("#" + placeholder);

                    // Change the text in the <p> when the button is pressed
                    text.textContent = "waiting...";

                    // Make a GET request to the '/posts' endpoint
                    fetch(
                    "http://localhost:10000/fetch-data?collection=" + placeholder,
                    { method: "GET" }
                    )
                    .then((response) => response.text())
                    .then((data) => {
                        //pretty printing the data
                        console.log(data === "");
                        var output = pretty_print(data);
                        //change the text in the <p> when we get a response from the backend
                        text.textContent = output;
                        let str = text.innerHTML;
                        str = str.split("\n").join("<br />");
                        text.innerHTML = str;
                        
                    });
                }}
            >
                {collection_name}
            </button>
        </div>
    )
}

function pretty_print(input){
    let output = input.replaceAll("{", "");
    output = output.replaceAll("}", "-----------------");
    output = output.replaceAll("[", "");
    output = output.replaceAll("]", "");
    output = output.replaceAll(",", "\n");
    output = output.trim();
    return output;
}

export default TableDisplay;

//USE THIS FOR DEPLOYMENT
//'https://storyhive-app.onrender.com/fetch-data?collection=[COLLECTION NAME]'

//USE THIS TO TEST CHANGES LOCALLY
//http://localhost:10000/fetch-data?collection=[COLLECTION NAME]