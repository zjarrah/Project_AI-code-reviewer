<?php 
include("../../Database/connection-db.php");
include("config.php");

///////////////////////////////// Send data to OpenAI and get response //////////////////////////////////////////////

// Get the JSON from Client side
$data = json_decode(file_get_contents("php://input"), true);

$json_input = json_encode($data["input"]);
$schema = $data["schema"];
$strict_schema = $data["strictSchema"];
$human_review = $data["humanReview"];

if($schema=="minimal"){
    $string1='';
    $string2='';
}else{
    $string1=',
        "line": "on which line the issue is",
        "rule_id": "rule id",
        "category": "a category"';
    $string2=',
        "line": "2",
        "rule_id": "1",
        "category": "Validation"';
}

// OpenAI API key
$apiKey = "";

// The prompt
$ai_prompt = sprintf('Given a JSON containing a file name and a code, generate a JSON array containing multiple structured review items for the code with the following structure:

[
    {
        "severity": "%s",
        "file": "string",
        "issue": "short identifier of the problem",
        "suggestion": "concrete remediation step"%s
    }
]
    
As an example, the following input:

{"file": "user_service.py", "code": "def create_user(data): save_to_db(data)"}

could result in the following output:
[
    {
        "severity": "high",
        "file": "user_service.py",
        "issue": "No input validation",
        "suggestion": "Validate payload before saving"%s
    }
]

Your output should only be the JSON array. Use the following JSON as input: 

%s', $severities, $string1, $string2, $json_input)
;

// Initialize cURL
$ch = curl_init("https://api.openai.com/v1/chat/completions");

// Set request headers
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $apiKey
]);

// Prepare request body
$data = [
    "model" => "gpt-4o-mini", // OpenAI model 
    "messages" => [
        ["role" => "user", "content" => $ai_prompt]
    ],
    "max_tokens" => 200
];

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute request
$response = curl_exec($ch);

// Handle errors
if (curl_errno($ch)) {
    echo "cURL error: " . curl_error($ch);
} else {
    $result = json_decode($response, true);
    $ai_review = $result['choices'][0]['message']['content'];
}

// Close cURL
curl_close($ch);



//////////////////////////////////////////// Validate schema of the AI response///////////////////////////////////////

$ai_review = trim($ai_review, "` \n");
$ai_review = json_decode($ai_review, true);

if($strict_schema){
    if($schema=='minimal'){
        $keys = ["severity", "file", "issue", "suggestion"];
    }else{
        $keys = ["severity", "file", "issue", "suggestion", "line", "rule_id", "category"];
    }

    foreach($ai_review as $review_item){
        foreach ($keys as $key){
            if(!isset($review_item[$key])){
                echo "Error: Missing key " . $key;
                return;
            }
        }
    }
}


$ai_review = json_encode($ai_review);


///////////////////////////////////////////////////// Insert new entry into db////////////////////////////////////////////

$query = $mysql->prepare("INSERT INTO reviews(input, human_review, ai_review) VALUES (?,?,?)");
$query->bind_param("sss", $json_input, $human_review, $ai_review);
$query->execute();



///////////////////////////////////////////////////// Return JSON response ///////////////////////////////////////////////
$response = [];
$response["success"] = true;
$response["data"] = $ai_review;
echo json_encode($response);

?>
