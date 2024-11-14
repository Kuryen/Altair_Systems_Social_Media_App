import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SearchBar from "../src/components/searchbar";
import SearchResult from "../src/components/searchresult";
import SearchResultList from "../src/components/searchresultlist";

const setResultsMock = jest.fn();

beforeEach(() => {
  setResultsMock.mockClear();
  window.alert = jest.fn(); // Mock the alert function and reset it before each test
});

describe("SearchResult Component", () => {
  test("renders as a clickable result when user is not a friend", () => {
    const mockAddFriend = jest.fn();
    render(
      <SearchResult
        result="testUser"
        currentUserID="currentUser"
        onFriendAdded={mockAddFriend}
        existingFriends={[]}
      />
    );
    fireEvent.click(screen.getByText("testUser"));
    expect(mockAddFriend).toHaveBeenCalled();
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
    expect(screen.getByText("friendUser")).toHaveClass("cursor-not-allowed");
  });

  test("shows alert when attempting to add an existing friend", () => {
    render(
      <SearchResult
        result="friendUser"
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={["friendUser"]}
      />
    );
    fireEvent.click(screen.getByText("friendUser"));
    expect(window.alert).toHaveBeenCalledWith(
      "You're already following this user!"
    );
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
    const results = ["user1", "user2", "user3"];
    render(
      <SearchResultList
        results={results}
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={["user2"]}
      />
    );
    results.forEach((result) => {
      expect(screen.getByText(result)).toBeInTheDocument();
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
    const results = ["user1", "user2"];
    render(
      <SearchResultList
        results={results}
        currentUserID="currentUser"
        onFriendAdded={() => {}}
        existingFriends={["user2"]}
      />
    );

    expect(screen.getByText("user1")).not.toHaveClass("cursor-not-allowed");
    expect(screen.getByText("user2")).toHaveClass("cursor-not-allowed");
  });
});

describe("SearchBar Component", () => {
  test("fetches data and filters results based on input", async () => {
    await act(async () => {
      render(<SearchBar setResults={setResultsMock} />);
      fireEvent.change(screen.getByPlaceholderText("Follow a user..."), {
        target: { value: "rivers" },
      });
      await waitFor(() => {
        expect(setResultsMock).toHaveBeenLastCalledWith([
          { _id: "rivers" },
          { _id: "riv" },
          { _id: "river" },
        ]);
      });
    });
  });

  test("handles empty input without calling setResults", async () => {
    render(<SearchBar setResults={setResultsMock} />);
    fireEvent.change(screen.getByPlaceholderText("Follow a user..."), {
      target: { value: "" },
    });
    expect(setResultsMock).not.toHaveBeenCalled();
  });
});
