// Starting message to confirm the script is running
console.log("Starting test cases...");

function friendsArray(friends) {
    if (friends.length > 0) {
        friends.map((friend, index) => {
            console.log(`\nRendering friend # ${index}: ${friend}`);
        });
    } else {
        console.log("No friends to display.");
    }
}

const testCases = [
    [],                         
];

['ana'],             
    ['ana', 'sate', 'ray'],      
    ['ana', 'sate', 'ray', 'ture', 'mia'] 

testCases.forEach((friends, index) => {
    console.log(`\nTest Case ${index + 1}:`, friends);
    friendsArray(friends);
});

// Ending message to confirm the script completed
console.log("Test cases completed.");