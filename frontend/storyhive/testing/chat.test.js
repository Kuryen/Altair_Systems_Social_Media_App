import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Chat from "../src/components/Chat";
import socket from "../src/socket";

// Mock socket events
jest.mock("../src/socket", () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe("Chat Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("profileUsername", "User1"); // Set a default username in local storage
  });

  test("renders chat interface elements", () => {
    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Online Users")).toBeInTheDocument();
  });

  test("displays an alert if no message or recipient is selected", () => {
    window.alert = jest.fn();
    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Send")); // Click Send without entering a message or selecting a recipient
    expect(window.alert).toHaveBeenCalledWith(
      "You must select a user to chat with and you cannot send an empty message!"
    );
  });

  test("sends message when recipient is selected and message is entered", async () => {
    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Mock the `updateOnlineUsers` event to add User2
    socket.on.mockImplementation((event, callback) => {
      if (event === "updateOnlineUsers") {
        callback(["User2"]);
      }
    });

    // Manually trigger the updateOnlineUsers event
    socket.on.mock.calls.forEach(([event, callback]) => {
      if (event === "updateOnlineUsers") callback(["User2"]);
    });

    // Wait for "User2" to appear in the online users list
    const user2 = await screen.findByText("User2");
    expect(user2).toBeInTheDocument();

    // Simulate sending a message to User2
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(user2); // Select User2 as the recipient
    fireEvent.click(screen.getByText("Send")); // Click send button

    // Ensure message is emitted via socket with correct format
    expect(socket.emit).toHaveBeenCalledWith("chat message", {
      message: "User1: Hello",
      room: expect.any(String),
    });
  });

  test("prevents chatting with self", async () => {
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Mock the `updateOnlineUsers` event to include the user itself
    socket.on.mockImplementation((event, callback) => {
      if (event === "updateOnlineUsers") {
        callback(["User1"]);
      }
    });

    // Manually trigger the updateOnlineUsers event
    socket.on.mock.calls.forEach(([event, callback]) => {
      if (event === "updateOnlineUsers") callback(["User1"]);
    });

    // Wait for "User1" to appear in the online users list
    const user1 = await screen.findByText("User1");
    fireEvent.click(user1); // Attempt to select self

    expect(window.alert).toHaveBeenCalledWith(
      "You cannot chat with yourself. Please select a different user!"
    );
  });

  test("updates chat message list on receiving a message", async () => {
    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Mock the `chat message` event to receive a new message
    socket.on.mockImplementation((event, callback) => {
      if (event === "chat message") {
        callback("User2: Hello!");
      }
    });

    // Manually trigger the `chat message` event
    socket.on.mock.calls.forEach(([event, callback]) => {
      if (event === "chat message") callback("User2: Hello!");
    });

    // Wait for the new message to appear in the chat
    const message = await screen.findByText("User2: Hello!");
    expect(message).toBeInTheDocument();
  });
});
