import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FriendsList from "../src/components/FriendsList";

// Mock friends data
const mockFriends = [
  { username: "ana", profilePicture: "http://example.com/ana.jpg" },
  { username: "sate", profilePicture: "http://example.com/sate.jpg" },
  { username: "ray", profilePicture: null }, // No profile picture
];

describe("FriendsList Component", () => {
  test("renders message when there are no friends", () => {
    render(<FriendsList friends={[]} onProfileClick={jest.fn()} />);
    expect(screen.getByText("No friends to display.")).toBeInTheDocument();
  });

  test("renders friends with usernames and profile pictures", () => {
    render(<FriendsList friends={mockFriends} onProfileClick={jest.fn()} />);

    // Check if friends with profile pictures are rendered using `alt` attribute
    expect(screen.getByAltText("ana's profile")).toBeInTheDocument();
    expect(screen.getByAltText("sate's profile")).toBeInTheDocument();

    // Check if friend without a profile picture displays the username
    expect(screen.getByText("ray")).toBeInTheDocument();
  });

  test("falls back to username if profile picture fails to load", () => {
    render(<FriendsList friends={mockFriends} onProfileClick={jest.fn()} />);

    const brokenImage = screen.getByAltText("ana's profile");
    fireEvent.error(brokenImage); // Simulate image load error

    // After the error, the username should still be displayed as fallback
    expect(screen.getByText("ana")).toBeInTheDocument();
  });

  test("calls onProfileClick with correct username when a friend is clicked", () => {
    const handleProfileClick = jest.fn();
    render(
      <FriendsList friends={mockFriends} onProfileClick={handleProfileClick} />
    );

    // Simulate clicking on the profile picture for a friend with an image
    const friendHexagonWithImage = screen
      .getByAltText("ana's profile")
      .closest(".hexagon");
    fireEvent.click(friendHexagonWithImage);

    // Check if onProfileClick was called with "ana"
    expect(handleProfileClick).toHaveBeenCalledWith("ana");

    // Simulate clicking on a friend without an image
    const friendHexagonWithoutImage = screen
      .getByText("ray")
      .closest(".hexagon");
    fireEvent.click(friendHexagonWithoutImage);

    // Check if onProfileClick was called with "ray"
    expect(handleProfileClick).toHaveBeenCalledWith("ray");
  });
});
