<?php
$host = 'localhost';
$db = 'timetable_scheduler';
$user = 'root';
$pass = 'root';
$conn = new mysqli($host, $user, $pass, $db);

if(isset($_GET['sem_id'])){
    $sem_id = intval($_GET['sem_id']);
    $result = $conn->query("SELECT * FROM divisions WHERE semester_id=$sem_id ORDER BY id ASC");

    if($result->num_rows > 0){
        echo "<option value=''>Select Division</option>";
        while($row = $result->fetch_assoc()){
            echo "<option value='".$row['id']."'>".$row['name']."</option>";
        }
    } else {
        echo "<option value=''>No divisions found</option>";
    }
}
?>
