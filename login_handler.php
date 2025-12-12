<?php
session_start();
include "db.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $role = $_POST['role'];

    if($role == "student"){
        $dept_id = intval($_POST['dept_id']);
        $sem_id = intval($_POST['sem_id']);
        $div_id = intval($_POST['div_id']);

        $_SESSION['role'] = 'student';
        $_SESSION['dept_id'] = $dept_id;
        $_SESSION['sem_id'] = $sem_id;
        $_SESSION['div_id'] = $div_id;

        header("Location: student_timetable.php");
        exit();
    } else {
        // Keep your existing admin/faculty login handling here
        header("Location: index.php"); // fallback
        exit();
    }
}
?>
