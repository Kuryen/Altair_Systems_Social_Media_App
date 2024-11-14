import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../src/components/profile";
import "@testing-library/jest-dom/extend-expect";

// Mock fetch API globally for Jest
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Empty array simulating no friends
  })
);

// Utility functions to test
function determineUsername_test(friend) {
  return typeof friend === "string" ? friend : friend?.username;
}

function validUsername_test(username) {
  if (typeof username === "string" && username) {
    return true;
  } else {
    console.error("Invalid friend format or missing username:", username);
    return false;
  }
}

// Mocked Components
jest.mock("../src/components/UserTabs", () => () => (
  <div>UserTabs Component</div>
));
jest.mock(
  "../src/components/FriendsList",
  () =>
    ({ friends, onProfileClick }) =>
      (
        <div>
          <h3>Follower List</h3>
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <button
                key={index}
                onClick={() => onProfileClick(friend.username)}
              >
                {friend.username}
              </button>
            ))
          ) : (
            <p>No friends to display.</p>
          )}
        </div>
      )
);
jest.mock("../src/components/ProfilePictureUP", () => () => (
  <div>ProfilePictureUploader</div>
));

describe("Profile Utility Functions", () => {
  test("determineUsername_test should return username if friend is an object with username property", () => {
    const friendObject = { username: "objectName" };
    expect(determineUsername_test(friendObject)).toBe("objectName");
  });

  test("determineUsername_test should return friend if it is a string", () => {
    const friend = "testname";
    expect(determineUsername_test(friend)).toBe("testname");
  });

  test("determineUsername_test should handle objects without username property", () => {
    const friendObjectNoUsername = { name: "noName" };
    expect(determineUsername_test(friendObjectNoUsername)).toBeUndefined();
  });

  test("validUsername_test should return true for valid usernames", () => {
    const validUsername = "testname";
    expect(validUsername_test(validUsername)).toBe(true);
  });

  test("validUsername_test should return false for empty string", () => {
    const emptyUsername = "";
    expect(validUsername_test(emptyUsername)).toBe(false);
  });

  test("validUsername_test should return false for non-string types", () => {
    const nonStringUsername = { username: "objectName" };
    expect(validUsername_test(nonStringUsername)).toBe(false);
  });
});

describe("Profile Component", () => {
  beforeEach(() => {
    localStorage.setItem("elementData", "loggedUser");
    fetch.mockClear();
  });

  test("renders logged-in user's profile correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Hello, loggedUser")).toBeInTheDocument();
    expect(screen.getByText("Follower List")).toBeInTheDocument();
  });

  test("renders friends list and handles profile click", async () => {
    const mockFriends = [{ username: "friend1" }, { username: "friend2" }];
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFriends),
      })
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    // Verify friends are displayed
    mockFriends.forEach((friend) => {
      expect(screen.getByText(friend.username)).toBeInTheDocument();
    });

    // Simulate clicking on a friend's profile
    const friendButton = screen.getByText("friend1");
    fireEvent.click(friendButton);

    expect(screen.getByText("Hello, friend1")).toBeInTheDocument();
  });

  test("displays no friends message when friends list is empty", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("No friends to display.")).toBeInTheDocument();
  });
});
