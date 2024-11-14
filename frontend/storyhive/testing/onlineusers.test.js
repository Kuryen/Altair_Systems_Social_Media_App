import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OnlineUsers from "../src/components/OnlineUsers";
import socket from "../src/socket";

// Mock socket.emit function
jest.mock("../src/socket", () => ({
  emit: jest.fn(),
}));

describe("OnlineUsers Component", () => {
  const onlineUsers = ["User1", "User2", "User3"];
  const onSelectUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("profileUsername", "TestUser"); // Set profileUsername for each test
  });

  test("renders the 'Online Users' heading", () => {
    render(<OnlineUsers onlineUsers={[]} onSelectUser={onSelectUser} />);
    expect(screen.getByText("Online Users")).toBeInTheDocument();
  });

  test("renders the list of online users", () => {
    render(
      <OnlineUsers onlineUsers={onlineUsers} onSelectUser={onSelectUser} />
    );

    onlineUsers.forEach((user) => {
      expect(screen.getByText(user)).toBeInTheDocument();
    });
  });

  test("calls handleSelectUser and socket.emit with the correct arguments when a user is clicked", () => {
    render(
      <OnlineUsers onlineUsers={onlineUsers} onSelectUser={onSelectUser} />
    );

    const userElement = screen.getByText("User1");
    fireEvent.click(userElement);

    expect(onSelectUser).toHaveBeenCalledWith("User1");
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith("startChat", {
      from: "TestUser", // Explicitly set expected profileUsername value
      to: "User1",
    });
  });

  test("does not throw an error when the onlineUsers list is empty", () => {
    render(<OnlineUsers onlineUsers={[]} onSelectUser={onSelectUser} />);
    expect(screen.getByText("Online Users")).toBeInTheDocument();
  });

  test("does not call socket.emit if localStorage profileUsername is missing", () => {
    localStorage.removeItem("profileUsername"); // Remove profileUsername

    render(
      <OnlineUsers onlineUsers={onlineUsers} onSelectUser={onSelectUser} />
    );

    const userElement = screen.getByText("User1");
    fireEvent.click(userElement);

    expect(socket.emit).not.toHaveBeenCalled();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <OnlineUsers onlineUsers={onlineUsers} onSelectUser={onSelectUser} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
