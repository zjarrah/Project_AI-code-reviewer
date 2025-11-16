const BASE_URL = "http://localhost/Project_AI-code-reviewer/server/APIs/";


/////////////////////////////////////////////// For inserting db table into html element  ///////////////////////////////////////////////

insertReviewsHtmlTable("db_table")

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

document.getElementById("submitBtn").addEventListener("click", async function() {
    // All the processing steps combined

    // Grab selected schema (minimal vs extended)
    const schema = document.getElementById("myDropdown").value;
    if (!schema) {
        alert("Please select a schema first.");
        return;
    }

    // Grab if strict schema mode is selected (true or false)
    const strictSchema = document.getElementById("strict-schema-toggle").checked;

    // Grab the inputted Human Review text
    const humanReview = document.getElementById("inputted-human-review").value;
    if (!humanReview) {
        alert("Please input human review first.");
        return;
    }

    // Grab the uploaded file
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a Python file first.");
        return;
    }

    // Extract the name of the uploaded file
    const fileName = file.name;

    // Extract the content of the uploaded file
    const reader = new FileReader();

    reader.onerror = function() {
    alert("Error reading file.");
    };

    reader.readAsText(file);

    reader.onload = async function(e) {
        const fileContent = e.target.result;

        // Display file content
        document.getElementById("inputted-code").textContent = fileContent;

        const jsonString = convertToJSON(fileName, fileContent, schema, strictSchema, humanReview);

        const response = await sendJsonToAPI(jsonString);

        // Display AI review
        document.getElementById("ai-review").textContent = response.data.data;
    };

});


function convertToJSON(fileName, fileCont, schema, strictSchema, humanReview){
    const obj = {input:{file:fileName, code:fileCont}, schema:schema, strictSchema:strictSchema, humanReview:humanReview};
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