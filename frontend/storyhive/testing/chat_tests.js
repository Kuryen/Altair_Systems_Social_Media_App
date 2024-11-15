function run_chat_tests(){
    console.log("CHAT TESTS\n-------------------------------------------\n");
    //testing the path that successfully sends the message
    chat_test("hello world", "sasha", "matt");
    //testing the path that warns the user
    //we do not test with the sender field blank because to even get to the chat page, you must be logged in.
    chat_test("", "sasha", "matt");
    chat_test("hello world!", "", "matt");
    chat_test("", "", "matt");
    //user_select_test("matt", "sasha");
    //user_select_test("matt", "matt");
}

//socket is left out because we assume the socket is already functional
//we are unit testing the logic which validates a message before it is sent through the socket.
function chat_test(message, recipient, sender){
    if (message != "" && recipient != "") {
        const dm = sender + ": " +  message;
        console.log(recipient + " sees " + "'" + dm + "'"); // Send message to WebSocket server
    }else{
        console.log("You must select a user to chat with and your message must contain text!");
    }
}

function user_select_test(logged_in_user, input_user){
    if(input_user == logged_in_user){
        console.log("You cannot chat with yourself. Please select a different user!");
    }else{
        console.log("Selected user:", input_user);
    }
}

module.exports = { run_chat_tests };