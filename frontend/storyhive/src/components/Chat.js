import React, { useEffect,useState } from "react";
import { io } from "socket.io-client";
import beeLogo from './bee.png';

function Chat(){
    const chatUsername = localStorage.getItem("profileUsername") || "No content found!"; //const to retrieve username from profile
    var socket = io("http://localhost:10000");
    const handleSubmit = async (event) => {
        event.preventDefault();
        var input = document.getElementById('input');
        console.log(input.value);
        if (input.value) {
            console.log(input.value);
            //sends input.value from the client to the server whenever the event called chat message is fired.
            socket.emit("chat message", chatUsername + ": " + input.value);
            input.value = "";
        }
    }
    //when the chat messaeg event is fired, render the msg to the screen
    socket.on('chat message', function(msg) {
        var item = document.createElement('li');

        //FIGURE OUT A WAY TO PASS THE USERNAME TO CHAT.JS. REPLACE "USER: " WITH THE ACTUAL USERNAME!
        item.textContent = msg;
        var messages = document.getElementById('messages');
        //if item before the : matches chatUsername, make it yellow. if it doesn't make it black
        //messages.appendChild(item);
        if(msg.split(":")[0] === localStorage.getItem("profileUsername"))
            {
                messages.appendChild(item).style.color = 'red';
            } else {
                messages.appendChild(item).style.color = 'black';
            }
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