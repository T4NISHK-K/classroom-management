<?php
$host = "localhost";
$db = "timetable_scheduler";
$user = "root";       // your DB username
$pass = "";           // your DB password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
