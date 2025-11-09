const BASE_URL = "http://localhost/Project_AI-Code-Reviewer/server/APIs/";


/////////////////////////////////////////////// For inserting db table into html element  ///////////////////////////////////////////////

async function insertReviewsHtmlTable(id){
    const arrayReviews = await getReviewsArray();
    const htmlTable = createTableFromArray(arrayReviews);
    insertHtmlIntoElement(htmlTable, id)
}


// Extract reviews from db as an Array of JSONs
async function getReviewsArray(){
    try{
        const url = BASE_URL + "client/get_reviews.php";
        const response = await axios.get(url);

        console.log(response);
        const dataArray = response.data.data;
        return dataArray

    } catch {
        console.log("Error!");
    }
}

// Convert Array to HTML table
function createTableFromArray(array) {

    if (!Array.isArray(array) || array.length === 0) return "<p>No data available</p>";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create header row
    const headers = Object.keys(array[0]);
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create data rows
    array.forEach(item => {
        const row = document.createElement("tr");
        headers.forEach(header => {
        const td = document.createElement("td");
        td.textContent = item[header];
        row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    return table.outerHTML;

}


// Insert HTML code into HTML element
function insertHtmlIntoElement(html, id){
    const container = document.getElementById(id);
    container.innerHTML = html;
}



/////////////////////////////////////////////// For processing the submitted input file  ///////////////////////////////////////////////

function processFile(file){
    // All the processing steps combined
}


// Extract the content of the uploaded file
function readFileContent(file) {

}


// Convert the content to JSON
function convertFileContentToJSON(){

}


// Send the JSON data to OpenAI
async function sendJsonToAPI(value_name){

}








