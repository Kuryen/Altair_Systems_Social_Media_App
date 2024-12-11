import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react"; // Ensure you're using the latest React act
import SearchBar from "../src/components/searchbar";
import SearchResult from "../src/components/searchresult";
import SearchResultList from "../src/components/searchresultlist";

const setResultsMock = jest.fn();

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([{ _id: "rivers" }, { _id: "riv" }, { _id: "river" }]),
    })
  );
  jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert globally
});

afterEach(() => {
  global.fetch.mockClear();
  delete global.fetch;
  jest.restoreAllMocks(); // Restore mocks to their original state
  setResultsMock.mockClear();
});

describe("SearchResult Component", () => {
  test("renders as a clickable result when user is not a friend", async () => {
    const mockAddFriend = jest.fn(); // Mock friend-adding function
    render(
      <SearchResult
        result="testUser"
        currentUserID="currentUser"
        onFriendAdded={mockAddFriend}
        existingFriends={[]} // User is not already a friend
      />
    );
    const resultElement = screen.getByText("testUser");
    fireEvent.click(resultElement); // Simulate click

    await waitFor(() => {
      expect(mockAddFriend).toHaveBeenCalledTimes(1); // Check if mock function is called
    });
  });

  test("renders with disabled state when user is already a friend", () => {
    render(
      <SearchResult
        result="friendUser"
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={["friendUser"]}
      />
    );
    const element = screen.getByText("friendUser");
    expect(element).toHaveClass("searchResultContainerisAlreadyFriend");
  });

  test("does not call onFriendAdded if user is already a friend", () => {
    const mockAddFriend = jest.fn();
    render(
      <SearchResult
        result="friendUser"
        currentUserID="currentUser"
        onFriendAdded={mockAddFriend}
        existingFriends={["friendUser"]}
      />
    );
    fireEvent.click(screen.getByText("friendUser"));
    expect(mockAddFriend).not.toHaveBeenCalled();
  });
});

describe("SearchResultList Component", () => {
  test("displays multiple search results", () => {
    const results = [{ _id: "user1" }, { _id: "user2" }, { _id: "user3" }];
    render(
      <SearchResultList
        results={results}
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={["user2"]}
      />
    );
    results.forEach((result) => {
      expect(screen.getByText(result._id)).toBeInTheDocument();
    });
  });

  test("shows no results message when results are empty", () => {
    render(
      <SearchResultList
        results={[]}
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={[]}
      />
    );
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("renders with disabled state for existing friends only", () => {
    const results = [{ _id: "user1" }, { _id: "user2" }];
    render(
      <SearchResultList
        results={results}
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={["user2"]}
      />
    );

    const user1 = screen.getByText("user1");
    const user2 = screen.getByText("user2");
    expect(user1).not.toHaveClass("cursor-not-allowed");
    expect(user2).toHaveClass("searchResultContainerisAlreadyFriend");
  });
});

describe("SearchBar Component", () => {
  test("fetches data and filters results based on input", async () => {
    render(<SearchBar setResults={setResultsMock} />);
    const input = screen.getByPlaceholderText("Follow a user...");
    fireEvent.change(input, { target: { value: "riv" } });
    await waitFor(() => {
      expect(setResultsMock).toHaveBeenCalledWith([
        { _id: "rivers" },
        { _id: "riv" },
        { _id: "river" },
      ]);
    });
  });

  test("handles empty input without calling setResults", () => {
    render(<SearchBar setResults={setResultsMock} />);
    fireEvent.change(screen.getByPlaceholderText("Follow a user..."), {
      target: { value: "" },
    });
    expect(setResultsMock).not.toHaveBeenCalled();
  });
});
