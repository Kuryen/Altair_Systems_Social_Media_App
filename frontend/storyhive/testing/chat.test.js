import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
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
    expect(screen.getByText("Online Users")).toBeInTheDocument();
    expect(screen.getByText("Exit Chatroom")).toBeInTheDocument();
  });

  test("chat input is hidden until a user is selected", async () => {
    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Select a user to start a conversation.")
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Type your message...")
    ).not.toBeInTheDocument();

    act(() => {
      socket.on.mock.calls.forEach(([event, callback]) => {
        if (event === "updateOnlineUsers") callback(["User2"]);
      });
    });

    const user2 = await screen.findByText("User2");
    fireEvent.click(user2);

    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Select a user to start a conversation.")
    ).not.toBeInTheDocument();
  });

  test("displays an alert if no message or recipient is selected", async () => {
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Ensure initial state message is displayed
    expect(
      screen.getByText("Select a user to start a conversation.")
    ).toBeInTheDocument();

    // Verify "Send" button is not visible initially
    const sendButton = screen.queryByText("Send");
    expect(sendButton).toBeNull();

    // Simulate selecting a user to make "Send" button appear
    const mockUser = "User2";
    const mockCallback = jest.fn();
    const mockOnlineUsers = [mockUser];

    // Mock the `updateOnlineUsers` event to include a user
    socket.on.mockImplementation((event, callback) => {
      if (event === "updateOnlineUsers") {
        callback(mockOnlineUsers);
      }
    });

    // Trigger the updateOnlineUsers event
    socket.on.mock.calls.forEach(([event, callback]) => {
      if (event === "updateOnlineUsers") callback(mockOnlineUsers);
    });

    // Wait for the user to appear in the online users list
    const onlineUser = await screen.findByText(mockUser);
    expect(onlineUser).toBeInTheDocument();

    // Simulate selecting the user
    fireEvent.click(onlineUser);

    // Check that the "Send" button is now visible
    const sendButtonAfterSelection = screen.getByText("Send");
    expect(sendButtonAfterSelection).toBeInTheDocument();

    // Click the "Send" button without entering a message
    fireEvent.click(sendButtonAfterSelection);

    // Assert the alert is called with the correct message
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

    act(() => {
      socket.on.mock.calls.forEach(([event, callback]) => {
        if (event === "updateOnlineUsers") callback(["User2"]);
      });
    });

    const user2 = await screen.findByText("User2");
    fireEvent.click(user2);

    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByText("Send"));

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

    act(() => {
      socket.on.mock.calls.forEach(([event, callback]) => {
        if (event === "updateOnlineUsers") callback(["User1"]);
      });
    });

    const user1 = await screen.findByText("User1");
    fireEvent.click(user1);

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

    act(() => {
      socket.on.mock.calls.forEach(([event, callback]) => {
        if (event === "chat message") callback("User2: Hello!");
      });
    });

    const message = await screen.findByText("User2: Hello!");
    expect(message).toBeInTheDocument();
  });
});
