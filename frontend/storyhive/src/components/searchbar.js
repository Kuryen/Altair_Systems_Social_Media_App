import React, { useState } from "react";
import "../css/searchbar.css";

export default function SearchBar({ setResults }) {
  const [input, setInput] = useState("");

  //call /fetch-data from backend to retrieve userid from user collection
  const fetchData = (value) => {
    fetch("https://storyhive-app.onrender.com/tables/fetch-data?collection=user")
      .then((response) => response.json())
      .then((json) => {
        console.log("Fetched data:", json); // Log the data to check structure
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user._id &&
            user._id.toLowerCase().includes(value.toLowerCase())
          );
        });
        setResults(results);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="searchbarContainer">
      <span className="text-royalblue"></span>
      <input
        type="search"
        placeholder="Follow a user..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="search"
      />
    </div>
  );
}

//testing : http://localhost:10000/fetch-data?collection=user
//deployment : https://storyhive-app.onrender.com/fetch-data?collection=user
