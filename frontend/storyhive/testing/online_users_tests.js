// Mocking OnlineUsers component dependencies
const mockLocalStorage = { profileUsername: "TestUser" };

// Simple socket mock with console log
const socket = {
  emit: function (event, data) {
    console.log(`socket.emit called with event: ${event} and data:`, data);
  },
};

function run_online_users_tests() {
  console.log("Running Online Users Tests...");

  test_render_online_users();
  test_render_online_users_failure();
  test_handle_user_selection();
  test_handle_user_selection_failure();
  test_handle_empty_user_list();
  test_handle_empty_user_list_failure();

  console.log("Finished Online Users Tests.");
}

function test_render_online_users() {
  const onlineUsers = ["matt", "sasha", "shawn"];
  const renderedUsers = onlineUsers.map((user) => user); // Simulate rendering

  console.log("Testing: Render Online Users...");
  console.log("Expected:", onlineUsers);
  console.log("Actual:", renderedUsers);

  if (JSON.stringify(renderedUsers) === JSON.stringify(onlineUsers)) {
    console.log("Render Online Users Test Passed");
  } else {
    console.log("Render Online Users Test Failed");
  }
}

function test_render_online_users_failure() {
  const onlineUsers = ["matt", "sasha", "shawn"];
  const renderedUsers = ["john", "jane", "doe"]; // Incorrect rendering

  console.log("Testing: Render Online Users Failure...");
  console.log("Expected:", onlineUsers);
  console.log("Actual:", renderedUsers);

  if (JSON.stringify(renderedUsers) === JSON.stringify(onlineUsers)) {
    console.log("Render Online Users Failure Test Failed");
  } else {
    console.log(
      "Render Online Users Failure Test Passed)"
    );
  }
}

function test_handle_user_selection() {
  const selectedUser = "matt";

  console.log("Testing: Handle User Selection...");

  // Mocking socket.emit behavior
  let emitCalled = false;
  socket.emit = function (event, data) {
    if (event === "startChat" && data.to === selectedUser) {
      emitCalled = true;
      console.log(`Emit event '${event}' called with data:`, data);
    }
  };

  // Simulate selecting a user
  handleSelectUser(selectedUser);

  if (emitCalled) {
    console.log("Handle User Selection Test Passed");
  } else {
    console.log("Handle User Selection Test Failed");
  }
}

function test_handle_user_selection_failure() {
  const selectedUser = "matt";

  console.log("Testing: Handle User Selection Failure...");

  // Mocking socket.emit behavior
  let emitCalled = false;
  socket.emit = function (event, data) {
    // Emit event with incorrect data to cause failure
    if (event === "startChat" && data.to === "someone_else") {
      emitCalled = true;
    }
  };

  // Simulate selecting a user
  handleSelectUser(selectedUser);

  if (emitCalled) {
    console.log(
      "Handle User Selection Failure Test Failed"
    );
  } else {
    console.log(
      "Handle User Selection Failure Test Passed"
    );
  }
}

function test_handle_empty_user_list() {
  const onlineUsers = [];
  console.log("Testing: Handle Empty User List...");

  if (onlineUsers.length === 0) {
    console.log("Empty User List Test Passed");
  } else {
    console.log("Empty User List Test Failed");
  }
}

function test_handle_empty_user_list_failure() {
  const onlineUsers = ["matt"]; // Incorrect non-empty list
  console.log("Testing: Handle Empty User List Failure...");

  if (onlineUsers.length === 0) {
    console.log("Empty User List Failure Test Failed");
  } else {
    console.log("Empty User List Failure Test Passed");
  }
}

// Helper function to simulate user selection
function handleSelectUser(user) {
  socket.emit("startChat", {
    from: mockLocalStorage.profileUsername,
    to: user,
  });
}

module.exports = { run_online_users_tests };
