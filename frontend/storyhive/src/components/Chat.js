import React, { useEffect,useState } from "react";
import { io } from "socket.io-client";
import beeLogo from './bee.png';

function Chat(){
    const chatUsername = localStorage.getItem("profileUsername") || "No content found!"; //const to retrieve username from profile
    var socket = io("https://storyhive-app.onrender.com");

    const handleSubmit = async (event) => {
        event.preventDefault();
        var input = document.getElementById('input');
        console.log(input.value);
        if (input.value) {
            console.log(input.value);

            //sends input.value from the client to the server whenever the event called chat message is fired.
            socket.emit("chat message", chatUsername + ": " + input.value);
            //socket.emit("chat message", input.value);
            input.value = "";
        }
    }

    //when the chat messaeg event is fired, render the msg to the screen
    socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        
        //display chatUsername from chatUsername const via profile
        //item.textContent = `${chatUsername}: ` + msg;
        item.textContent = msg;
        var messages = document.getElementById('messages');
        if(msg.split(":")[0] === localStorage.getItem("profileUsername"))
        {
            addMessage(item.textContent, 'outgoing');
        } else {
            addMessage(item.textContent, 'incoming');
            console.log("incoming!")
        }
        //console.log(msg + localStorage.getItem("profileUsername"));
        //messages.appendChild(item);
        //window.scrollTo(0, document.body.scrollHeight);
    });

    const [messages, setMessages] = useState([]);

  // Function to add a new message
        const addMessage = (message, type) => {
            setMessages([...messages, { text: message, type }]);
            console.log('outgoing');
        };

    return(
        <div class="w-screen h-screen flex justify-center">
                    <div class="relative w-[500px] h-full bg-[#eec33d]">

                        {/*chat info space*/}
                        <div class="flex justify-items-start relative w-full h-[100px]">
                            <div>
                        <img className="w-[178px] h-[90px]" src={beeLogo} alt="Logo" />
                        </div>
                        <div className="text-[#e1dcdc] text-2xl">@username</div>
                        </div>

                            {/*chat message space*/}
                        <div class="bg-white w-full h-[700px] flex-grow overflow-y-auto space-y-1">
                        {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`w-full p-3 rounded-lg text-wrap ${
                            message.type === 'outgoing'
                                ? 'bg-[#E5AC3F] text-black text-right'
                                : 'bg-black text-white text-left'
                            }`}
                        >
                            <p class="break-all">{message.text} </p>
                        </div>
                        ))}
                        </div>

                            {/*chat input*/}
                        <div class="absolute bottom-0 w-full h-[120px]">
                            <ul id="messages"></ul>
                            <form class="flex justify-between absolute w-full pb-10 bottom-0 right-0" id="form" onSubmit={handleSubmit}>
                                <input class="rounded-md w-[460px]" id="input" autocomplete="off" />
                                <button class="bg-blue-600 px-4 text-black hover:text-white rounded-md" type="submit">Send</button>
                            </form>
                        </div>

                    </div>
                </div>
    );
}


export default Chat;
