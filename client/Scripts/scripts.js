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

document.getElementById('myFile').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    fileContent = e.target.result;
  };

  reader.onerror = function(e) {
    console.error("Error reading file:", e);
  };

  reader.readAsText(file); // Reads the file as plain text
});


function processFile(id, fileContent){
    // All the processing steps combined
    console.log(fileContent);
    try{
        const file = grabFileFromElement(id);
        const fileName = extractFileName(file);
        console.log(fileContent)
        // const jsonString = convertTextToJSON(fileName, fileContent);
        // console.log(jsonString)
        // sendJsonToAPI(jsonString);
    }catch{
        console.log("oops, error!")
    }
}

// Grab the uploaded file
function grabFileFromElement(id){
    const element = document.getElementById(id);
    const selectedFile = element.files[0]; // Get the first selected file
    return selectedFile;
}


// Extract the name of the uploaded file
function extractFileName(file){
    const fileName = file.name;
    return fileName;
}


// Extract the content of the uploaded file
// Not working
function extractFileContent(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result;
        console.log("File content:", fileContent);
        console.log(typeof fileContent);
        // You can now process the content (e.g., parse JSON, display text, etc.)
    };

    reader.onerror = function(event) {
        console.error("Error reading file:", event.target.error);
    };

    reader.readAsText(file);

    // const content = reader.result;
    // return content;
} 


function convertTextToJSON(fileName, fileContent){
    const obj = {file:fileName, code:fileContent};
    const jsonString = JSON.stringify(obj);
    return jsonString;
}


// Send the JSON data to API (to be then sent to OpenAI)
async function sendJsonToAPI(jsonString){
    try{
        const url = BASE_URL + "client/review.php";
        const response = await axios.post(url,jsonString);

        console.log(response);
        return response;

    } catch {
        console.log("Error!");
    }
}