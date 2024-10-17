import SearchResult from "./searchresult";

export default function SearchResultsList({ results, currentUserID, onFriendAdded, existingFriends }) {
    return (
      <div className="w-full bg-white flex flex-col shadow-md rounded-lg mt-4 max-h-[300px] overflow-y-auto">
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
          <p className="p-2 text-gray-500">No results found</p>
        )}
      </div>
    );
}