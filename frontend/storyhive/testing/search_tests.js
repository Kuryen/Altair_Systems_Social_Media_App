function run_search_tests(){
    search("rivers");
    search("riv");
    search("riverss");
}

function search(user){
    fetch("http://localhost:10000/tables/fetch-data?collection=user")
      .then((response) => response.json())
      .then((json) => {
        console.log(json.filter(result => (result._id.includes(user) || user.includes(result._id))));
      })
      .catch((error) => console.error("Error fetching data:", error));
}

module.exports = { run_search_tests };