import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegisterPage from "./LoginRegisterPage";
import Profile from "./profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the login/register page */}
          <Route path="/" element={<LoginRegisterPage />} />

          {/* Route for the profile page */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;