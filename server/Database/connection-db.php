<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$db_host = "localhost";
$db_user = "root";
$db_pass = null;
$db_name = "ai_code_review_db"; 
$port = 3307;

$mysql = new mysqli($db_host, $db_user, $db_pass, $db_name, $port);

?>