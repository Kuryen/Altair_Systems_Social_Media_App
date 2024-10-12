import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import OnlineUsers from "./OnlineUsers";
import beeLogo from "./bee.png";

function Chat() {
    const chatUsername = localStorage.getItem("profileUsername") || "No content found!";
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [recipient, setRecipient] = useState("");
    const socket = io("http://localhost:10000");

    useEffect(() => {
        // Fetch online users and setup socket listeners
        const fetchOnlineUsers = async () => {
            try {
                const response = await fetch("/online-users");
                const users = await response.json();
                setOnlineUsers(users);
            } catch (error) {
                console.error("Error fetching online users:", error);
            }
        };

        fetchOnlineUsers();

        socket.on("userConnected", (newUser) => {
            setOnlineUsers((prev) => [...prev, newUser]);
        });

        socket.on("userDisconnected", (disconnectedUser) => {
            setOnlineUsers((prev) => prev.filter((user) => user !== disconnectedUser));
        });

        socket.on("receiveMessage", (msg) => {
            const messageType = msg.sender === chatUsername ? "outgoing" : "incoming";
            setMessages((prevMessages) => [...prevMessages, { ...msg, type: messageType }]);
        });

        return () => {
            socket.off("userConnected");
            socket.off("userDisconnected");
            socket.off("receiveMessage");
        };
    }, [socket]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      const input = document.getElementById("input");
      if (input.value && recipient) {
          const message = {
              senderID: chatUsername, // Update key to match your API
              receiverID: recipient,   // Update key to match your API
              contents: input.value,   // Update key to match your API
              media: "",               // Add media if needed
          };
  
          try {
              // Send the message to your API
              const response = await fetch("/postChat", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(message),
              });
  
              const result = await response.json();
              console.log(result.status); // Log the API response status
  
              // Emit the message to the socket after it has been sent to the server
              socket.emit("sendMessage", message);
              
              // Clear the input field after sending
              input.value = ""; 
          } catch (error) {
              console.error("Error sending message:", error);
          }
      }
  };
  

    return (
        <div className="w-screen h-screen flex">
            <OnlineUsers onlineUsers={onlineUsers} onSelectUser={setRecipient} />
            <div className="relative w-[500px] h-full bg-[#eec33d] flex-grow">
                <div className="flex justify-items-start relative w-full h-[100px] items-center">
                    <div>
                        <img className="w-[100px] h-[100px] object-contain" src={beeLogo} alt="Logo" />
                    </div>
                    <div className="text-[#e1dcdc] text-2xl ml-4">@{chatUsername}</div>
                    {recipient && <div className="ml-4 text-lg">Chatting with @{recipient}</div>}
                </div>

                <div className="bg-white w-full h-[700px] flex-grow overflow-y-auto space-y-1">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`w-full p-3 rounded-lg text-wrap ${
                                message.type === "outgoing"
                                    ? "bg-[#E5AC3F] text-black text-right"
                                    : "bg-black text-white text-left"
                            }`}
                        >
                            <p className="break-all">{message.text}</p>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 w-full h-[120px]">
                    <form
                        className="flex justify-between absolute w-full pb-10 bottom-0 right-0"
                        id="form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            className="rounded-md w-[460px] border-2 border-black outline-none"
                            id="input"
                            autoComplete="off"
                        />
                        <button
                            className="bg-blue-600 px-4 text-black hover:text-white rounded-md"
                            type="submit"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;
