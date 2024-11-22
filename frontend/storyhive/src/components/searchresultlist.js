import SearchResult from "./searchresult";
import "../css/searchbar.css";

export default function SearchResultsList({ results, currentUserID, onFriendAdded, existingFriends }) {
    return (
      <div className="searchResultContainer">
        {results.length > 0 ? (
          results.map((result, id) => (
            <SearchResult 
              key={id} 
              result={result._id || "No Username"} 
              currentUserID={currentUserID} 
              onFriendAdded={onFriendAdded} 
              existingFriends={existingFriends} 
            />
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    );
}