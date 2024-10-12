import React, { useEffect, useState } from "react";
import OnlineUsers from "./OnlineUsers";
import beeLogo from "./bee.png";

function Chat() {
    const chatUsername = localStorage.getItem("profileUsername") || "No content found!";
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [recipient, setRecipient] = useState("");

    useEffect(() => {
        // Fetch online users
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
    }, []);

    const handleSelectUser = async (selectedRecipient) => {
        setRecipient(selectedRecipient); // Update the recipient state
        setMessages([]); // Clear previous messages when a new user is selected

        // Fetch chat history between the current user and the selected recipient
        try {
            const response = await fetch(`/getChat?sender=${chatUsername}&receiver=${selectedRecipient}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const chatHistory = await response.json();

            // Process chat history to match the expected message format
            const formattedMessages = chatHistory.map(message => ({
                text: message.textContent, // Adjust this if your API returns different field names
                type: "incoming" // Assuming all fetched messages are incoming for display
            }));

            // Add the fetched chat history to messages state
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const input = document.getElementById("input"); // Get the input element
        const contents = input.value.trim(); // Get the message content

        if (!recipient) {
            console.error("Please select a recipient.");
            return; // Exit if no recipient is selected
        }
    
        // Ensure the contents are not empty
        if (!contents) {
            console.error("Message cannot be empty.");
            return; // Exit if message is empty
        }
        // Call the API to send the message
        try {
            const response = await fetch("/postChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderID: chatUsername,
                    receiverID: recipient,
                    contents: contents,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const result = await response.json();

            const newMessage = { text: contents, type: "incoming" };

            // Add the sent message to your messages state immediately
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage]; // Add the sent message
                return updatedMessages; // Return the updated state
            });

            // Clear the input field
            input.value = "";
            input.focus(); // Optionally, focus back on the input field for convenience
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="w-screen h-screen flex">
            <OnlineUsers onlineUsers={onlineUsers} onSelectUser={handleSelectUser} />
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
