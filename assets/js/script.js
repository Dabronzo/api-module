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
        displayExceptions(data);
        throw new Error(data.error);
    }

}

//since that all the options are being sent not in the format that the api expect we will process in this function
//this function will take use of some methods of the "FormData" object of javascript
function processOption(form){
    //iterate the options
    //push the options to an temporary empty array
    //convert to string

    let optArr = []
    for (let entry of form.entries()){
        //each enty es an array with a key and a value, so the first is always the key
        if (entry[0] === 'options'){
            optArr.push(entry[1]);

        }
    }
    //now we will delete the current "options" of the form and append our processed one
    //with the specifications of the api
    form.delete("options");
    //at the apend we use the "join()" method to conver the array in a string
    //that by default is separated with a come
    form.append("options", optArr.join());

    return form;

}

function displayExceptions(err){
    let errorHeading = "An Exception Occured";
    let errorResults = `<p>The API returned status code: <strong>${err.status_code}</strong></p>
                        <p>Error number: <strong>${err.error_no}</strong></p>
                        <p>Error text: <strong>${err.error}</strong></p>`;

    document.getElementById("resultsModalTitle").innerText = errorHeading;
    document.getElementById("results-content").innerHTML = errorResults;

    resultModal.show();
}

async function postForm(e){
    //then we create a form varible as a javascript object FormData
    //we use the "processOption" function passing the new formData instatiated with the html
    //form gottem by id
    const form = processOption(new FormData(document.getElementById("checksform")));

    //test to check the form entries

    //for (let entry of form.entries()){
    //    console.log(entry);
    //}

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
        displayExceptions(data);
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