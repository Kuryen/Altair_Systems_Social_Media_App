import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/components/LoginPage";
import RegisterPage from "../src/components/RegisterPage";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock the fetch API and alert
global.fetch = jest.fn();
global.alert = jest.fn(); // Mock alert globally

describe("Authentication Tests", () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate); // Use the mocked return value

  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    alert.mockClear();
  });

  // Tests for LoginPage
  describe("LoginPage Component", () => {
    test("renders the login form elements", () => {
      render(<LoginPage onSwitchLoginClick={jest.fn()} />);

      expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
      expect(screen.getByText("LOGIN")).toBeInTheDocument();
    });

    test("calls fetch and navigates to profile on successful login", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ status: "Login successful!" }),
      });

      render(<LoginPage onSwitchLoginClick={jest.fn()} />);

      fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByText("Submit"));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Login successful!");
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });

    test("shows an error alert if login fails", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ status: "Login failed!" }),
      });

      render(<LoginPage onSwitchLoginClick={jest.fn()} />);

      fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByText("Submit"));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Login failed!");
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  // Tests for RegisterPage
  describe("RegisterPage Component", () => {
    test("renders the registration form elements", () => {
      render(<RegisterPage onSwitchLoginClick={jest.fn()} />);

      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
      expect(screen.getByText("Register")).toBeInTheDocument();
    });

    test("shows validation errors for invalid input", async () => {
      render(<RegisterPage onSwitchLoginClick={jest.fn()} />);

      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "invalidemail" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "" },
      });

      fireEvent.click(screen.getByText("Register"));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith(
          "Username can't be empty\nEmail should contain a @\nPassword should be at least 1 characters long"
        );
      });
    });

    test("calls fetch and shows success message on successful registration", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ status: "Registration successful!" }),
      });

      render(<RegisterPage onSwitchLoginClick={jest.fn()} />);

      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "newuser@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "newpassword" },
      });

      fireEvent.click(screen.getByText("Register"));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Registration successful!");
      });
    });
  });
});
