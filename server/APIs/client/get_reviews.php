<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include("../../Database/connection-db.php");

$sql = "SELECT * FROM reviews";

$query = $mysql->prepare($sql);
$query->execute();

$array = $query->get_result();

$response = [];
$response["success"] = true;
$response["data"] = [];
while($article = $array->fetch_assoc()){
    $response["data"][] = $article;
}

echo json_encode($response);

?>