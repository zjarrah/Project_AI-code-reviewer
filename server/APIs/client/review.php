<?php 
include("../../Database/connection-db.php");

// Get the JSON from Client side and decode it
$data = json_decode(file_get_contents("php://input"), true);


// Send data to OpenAI, then wait and get response



// Check that there is no error
if(isset($data["name"]) && $data["name"] != ""){
    $name = $data["name"];
}else{
    $response = [];
    $response["success"] = false;
    $response["error"] = "Name field is missing";
    echo json_encode($response);
    return;
}

// Insert new entry into db
$query = $mysql->prepare("INSERT INTO reviews(input_code, human_review, ai_review, ai_prompt) VALUES (?,?,?,?)");
$query->bind_param("ssss", $input_code, $human_review, $ai_review, $ai_prompt);
$query->execute();


// Return JSON response
$response = [];
$response["success"] = true;
echo json_encode($response);

?>
