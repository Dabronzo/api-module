//Storing the API key and url

const API_KEY = "Lj4HghZ-cPwsTRa_isgRy5Tq5P0";
const API_URL = "https://ci-jshint.herokuapp.com/api";

//Bootstrap Modal
const resultModal = new bootstrap.Modal(document.getElementById("resultsModal"));


//listener for the button thata has the id of status
//will call a function getStatus()
//is always a good idea pass the event in these type of functions "getStatus()"
document.getElementById("status").addEventListener("click", e => getStatus(e));

//getting the listener for the post method.
document.getElementById("submit").addEventListener("click", e => postForm(e));


//using the async to work with promises on the get method

async function getStatus(e){
    //defining a string concatenating api_key and api_url
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    //using the fetch with awayit instead of .then
    const response = await fetch(queryString);

    //using the await for the promise in fetch
    const data = await response.json();

    //check if the response from fetch happens
    if (response.ok){
        displayStatus(data);
    } else{
        throw new Error(data.error);
    }

}


async function postForm(e){
    //then we create a form varible as a javascript object FormData
    const form = new FormData(document.getElementById("checksform"));

    //here we take the response from the fetch, used as exeple on the api documentation
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });
    //now we use await for the json convertion
    const data = await response.json();

    if (response.ok){
        displayResusts(data);

    } else{
        throw new Error(data.error);
    }


}

function displayResusts(data){
    let results = "";
    let resultHeading = "JSHint Results";

    document.getElementById("resultsModalTitle").innerText = resultHeading;
    if(data.total_errors === 0){
        results = `<div class="no-errors">No errors were found</div>`;
    } else{
        results = `<p>Total errors found: <span class"total-errors">${data.total_errors}</span></p>`;
        for(let error of data.error_list){
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById("results-content").innerHTML = results;
    resultModal.show();



}

function displayStatus(data){
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = `<p>Your key is valid until: ${data.expiry}</p>`;

    resultModal.show();

}