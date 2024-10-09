import React, { useEffect } from "react";
import { io } from "socket.io-client";

function Chat(){
    const chatUsername = localStorage.getItem("profileUsername") || "No content found!"; //const to retrieve username from profile
    var socket = io("https://storyhive-app.onrender.com/");

    const handleSubmit = async (event) => {
        event.preventDefault();
        var input = document.getElementById('input');
        console.log(input.value);
        if (input.value) {
            console.log(input.value);

            //sends input.value from the client to the server whenever the event called chat message is fired.
            socket.emit("chat message", input.value);
            input.value = "";
        }
    }

    //when the chat messaeg event is fired, render the msg to the screen
    socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        
        //display chatUsername from chatUsername const via profile
        item.textContent = `${chatUsername}: ` + msg ;
        var messages = document.getElementById('messages');
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    return(
        <div>
            <ul id="messages"></ul>
            <form id="form" onSubmit={handleSubmit}>
                <input id="input" autocomplete="off" />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}


export default Chat;
