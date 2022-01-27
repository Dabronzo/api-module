//Storing the API key and url

const API_KEY = "Lj4HghZ-cPwsTRa_isgRy5Tq5P0";
const API_URL = "https://ci-jshint.herokuapp.com/api";

//Bootstrap Modal
const resultModal = new bootstrap.Modal(document.getElementById("resultsModal"));


//listener for the button thata has the id of status
//will call a function getStatus()
//is always a good idea pass the event in these type of functions "getStatus()"
document.getElementById("status").addEventListener("click", e => getStatus(e))


//using the async to work with promises

async function getStatus(e){
    //defining a string concatenating api_key and api_url
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    //using the fetch with awayit instead of .then
    const response = await fetch(queryString);

    //using the await for the promise in fetch
    const data = await response.json();

    //check if the response from fetch happens
    if (response.ok){
        console.log(data);
    }

}