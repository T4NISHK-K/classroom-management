<?php
$host = 'localhost';
$db = 'timetable_scheduler';
$user = 'root';
$pass = 'root';
$conn = new mysqli($host, $user, $pass, $db);

if(isset($_GET['dept_id'])){
    $dept_id = intval($_GET['dept_id']);
    $result = $conn->query("SELECT * FROM semesters WHERE dept_id=$dept_id ORDER BY id ASC");
    if($result->num_rows > 0){
        echo "<option value=''>Select Semester</option>";
        while($row = $result->fetch_assoc()){
            echo "<option value='".$row['id']."'>".$row['name']." (".$row['type'].")</option>";
        }
    } else {
        echo "<option value=''>No semesters found</option>";
    }
}
?>
