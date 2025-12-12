<?php
session_start();
if(!isset($_SESSION['username']) || !isset($_SESSION['role'])){
    header("Location: index.php");
    exit();
}
include "db.php";

$username = $_SESSION['username'];
$role = $_SESSION['role'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SmartClass Dashboard</title>
<style>
  /* General Reset */
* {margin:0;padding:0;box-sizing:border-box;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;}

/* Body Background */
body {
    background: #f4f6f8;
    color: #333;
}

/* Top Navbar */
.top-nav {
    background: linear-gradient(90deg, #764ba2, #667eea);
    color: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.top-nav .logo {
    font-weight: bold;
    font-size: 22px;
    margin-right: 30px;
}
.top-nav a {
    color: white;
    text-decoration: none;
    margin-right: 20px;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 5px;
    transition: background 0.3s;
}
.top-nav a:hover {
    background: rgba(255,255,255,0.2);
}
.top-nav .user-info {
    margin-left: auto;
    font-weight: 500;
}

/* Main Content */
.main-content {
    padding: 30px 20px;
}

/* Cards in Dashboard */
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.card {
    background: white;
    padding: 20px;
    flex: 1 1 180px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.2s;
}
.card:hover {
    transform: translateY(-5px);
}
.card h3 {
    margin-bottom: 10px;
    color: #764ba2;
}

/* Sections */
.content-section {
    margin-top: 30px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

/* Forms */
.add-department input, 
.add-department button,
.login-container input, 
.login-container button {
    padding: 10px 12px;
    margin: 5px 0;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
}
.add-department button,
.login-container button {
    background: #764ba2;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
}
.add-department button:hover,
.login-container button:hover {
    background: #667eea;
}

/* Tables */
.department-list table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}
.department-list th, 
.department-list td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
}
.department-list th {
    background: #f0f0f0;
    color: #333;
}
.department-list tr:hover {
    background: #f9f9f9;
}
.department-list a {
    color: #764ba2;
    text-decoration: none;
    font-weight: 600;
}
.department-list a:hover {
    text-decoration: underline;
}

/* Login Page */
.login-container {
    width: 350px;
    margin: 100px auto;
    padding: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    text-align: center;
}
.login-container h2 {
    margin-bottom: 20px;
    color: #764ba2;
}
.login-container input {
    width: 100%;
    font-size: 14px;
}
.login-container .role-selection {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.login-container .role-selection label {
    font-size: 14px;
}
.error {
    color: red;
    margin-bottom: 10px;
}
/* General Reset */
* {margin:0;padding:0;box-sizing:border-box;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;}
body {background:#f4f6f8;color:#333;}
.content-section {margin-top:30px;background:white;padding:20px;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,0.05);}
h1,h3{margin-bottom:15px;color:#764ba2;}
form input,form select,form button {padding:10px 12px;margin:5px 0;border-radius:8px;border:1px solid #ccc;font-size:14px;}
form button {background:#764ba2;color:white;border:none;cursor:pointer;font-weight:bold;transition:background 0.3s;}
form button:hover{background:#667eea;}
table {width:100%;border-collapse:collapse;margin-top:15px;}
th,td {text-align:left;padding:12px;border-bottom:1px solid #ddd;}
th {background:#f0f0f0;color:#333;}
tr:hover {background:#f9f9f9;}
a {color:#764ba2;text-decoration:none;font-weight:600;}
a:hover{text-decoration:underline;}

.select-subjects {
    width: 100%;
    height: 150px;       /* fixed height */
    overflow-y: scroll;  /* vertical scroll */
    padding: 5px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
}
/* === Constraints Section === */
#constraints {
    padding: 20px;
    margin: 20px 0;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

#constraints h2 {
    margin-bottom: 15px;
    color: #333;
    font-size: 22px;
    border-bottom: 2px solid #eee;
    padding-bottom: 8px;
}

#constraints h3 {
    font-size: 18px;
    margin: 15px 0 10px;
    color: #444;
}

/* Forms */
#constraints form {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;
}

#constraints form label {
    flex: 1 1 100%;
    font-weight: 500;
    color: #555;
}

#constraints form input,
#constraints form select {
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 200px;
}

#constraints form button {
    background: #007bff;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
}

#constraints form button:hover {
    background: #0056b3;
}

#constraints form a {
    margin-left: 10px;
    color: #888;
    text-decoration: none;
    font-size: 14px;
}

#constraints form a:hover {
    text-decoration: underline;
}

/* Table */
#constraints table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 14px;
}

#constraints table th {
    background: #f5f5f5;
    font-weight: bold;
    color: #333;
}
/* === Constraints Section === */
#constraints {
    padding: 20px;
    margin: 20px 0;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

#constraints h2 {
    margin-bottom: 15px;
    color: #333;
    font-size: 22px;
    border-bottom: 2px solid #eee;
    padding-bottom: 8px;
}

#constraints h3 {
    font-size: 18px;
    margin: 15px 0 10px;
    color: #444;
}

/* Forms */
#constraints form {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;
}

#constraints form label {
    flex: 1 1 100%;
    font-weight: 500;
    color: #555;
}

#constraints form input,
#constraints form select {
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 200px;
}

#constraints form button {
    background: #007bff;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
}

#constraints form button:hover {
    background: #0056b3;
}

#constraints form a {
    margin-left: 10px;
    color: #888;
    text-decoration: none;
    font-size: 14px;
}

#constraints form a:hover {
    text-decoration: underline;
}

/* Table */
#constraints table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 14px;
    border:none;
    background:white;
}

#constraints table td {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

#constraints table a {
    color: #007bff;
    text-decoration: none;
    font-size: 13px;
}

#constraints table a:hover {
    text-decoration: underline;
}

#constraints table tr:nth-child(even) {
    background: #fafafa;
}

#constraints table a {
    color: #007bff;
    text-decoration: none;
    font-size: 13px;
}

#constraints table a:hover {
    text-decoration: underline;
}

/* Responsive */
@media(max-width:768px){
    .cards {flex-direction: column;}
    .top-nav a {margin: 5px 0;}
    .top-nav .user-info {margin-left:0; margin-top:5px;}
}

</style>
</head>
<body>

<!-- Top Navbar -->
<nav class="top-nav">
    <span class="logo">SmartClass</span>
    <a href="dashboard.php">Dashboard</a>
    <?php if($role=='admin'): ?>
        <a href="#departments">Departments</a>
        <a href="#semester">Semesters & Divisions</a>
        <a href="#classrooms">Classrooms</a>
        <a href="#faculty">Faculty</a>
        <a href="#subjects">Subjects</a>
        <a href="#constraints">Constraints</a>
        <a href="#timetable">Time Table</a>
    <?php endif; ?>
    <a href="logout.php" style="float:right;">Logout</a>
    <span class="user-info">👤 <?php echo htmlspecialchars($username); ?> (<?php echo htmlspecialchars($role); ?>)</span>
</nav>

<div class="main-content">

<!-- Dashboard Stats
<section id="dashboard" class="content-section">
    <h1>Dashboard</h1>
    <div class="cards">
        <div class="card"><h3>Total Students</h3><p>245</p></div>
        <div class="card"><h3>Total Faculty</h3><p>38</p></div>
        <div class="card"><h3>Total Courses</h3><p>72</p></div>
        <div class="card"><h3>Scheduled Today</h3><p>15</p></div>
        <div class="card"><h3>Free Classrooms</h3><p>5</p></div>
    </div>
</section> -->

<?php if($role=='admin'): ?>
<!-- Departments Section -->
<section id="departments" class="content-section">
   <h1>Departments</h1>

    <!-- Add Department Form -->
    <div class="add-department">
        <h3>Add New Department</h3>
        <form method="post" action="">
            <input type="text" name="dept_name" placeholder="Department Name" required>
            <button type="submit" name="add_department">Add Department</button>
        </form>
    </div>

    <hr>

    <!-- Departments Table -->
    <div class="department-list">
        <h3>Existing Departments</h3>
        <table border="1" cellpadding="10" cellspacing="0">
            <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php
            // Add Department
            if(isset($_POST['add_department'])){
                $name = trim($_POST['dept_name']);
                
                $stmt = $conn->prepare("INSERT INTO departments (name) VALUES (?)");
                $stmt->bind_param("s",$name);
                $stmt->execute();
                echo "<script>location.href='dashboard.php#departments';</script>";
            }

            // Delete Department
            if(isset($_GET['delete_id'])){
                $del_id = intval($_GET['delete_id']);
                $stmt = $conn->prepare("DELETE FROM departments WHERE id=?");
                $stmt->bind_param("i",$del_id);
                $stmt->execute();
                echo "<script>location.href='dashboard.php#departments';</script>";
            }

            // Fetch Departments
            $result = $conn->query("SELECT * FROM departments ORDER BY id DESC");
            if($result->num_rows>0){
                while($row=$result->fetch_assoc()){
                    if(isset($_GET['edit_id']) && $_GET['edit_id']==$row['id']){
                        // Edit form
                        echo "<tr>
                        <form method='post'>
                        <td>".$row['id']."</td>
                        <td><input type='text' name='edit_name' value='".htmlspecialchars($row['name'])."'></td>
                        
                        <td>
                        <input type='hidden' name='edit_id' value='".$row['id']."'>
                        <button type='submit' name='update_department'>Update</button>
                        <a href='dashboard.php#departments'>Cancel</a>
                        </td>
                        </form>
                        </tr>";
                    } else {
                        echo "<tr>
                        <td>".$row['id']."</td>
                        <td>".$row['name']."</td>
                        <td>
                        <a href='dashboard.php?edit_id=".$row['id']."#departments'>Edit</a> |
                        <a href='dashboard.php?delete_id=".$row['id']."' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                        </td>
                        </tr>";
                    }
                }
            } else {
                echo "<tr><td colspan='4'>No departments found.</td></tr>";
            }

            // Update Department
            if(isset($_POST['update_department'])){
                $update_id = intval($_POST['edit_id']);
                $update_name = trim($_POST['edit_name']);
                
                $stmt = $conn->prepare("UPDATE departments SET name=? WHERE id=?");
                $stmt->bind_param("si",$update_name,$update_id);
                $stmt->execute();
                echo "<script>location.href='dashboard.php#departments';</script>";
            }
            ?>
            </tbody>
        </table>
    </div>
</section>
<?php endif; ?>

<?php if($role=='admin'): ?>

<?php
// ------------------ HANDLE ALL ACTIONS ------------------

// // ---- ADD DEPARTMENT ----
// if(isset($_POST['add_department'])){
//     $name = trim($_POST['dept_name']);
//     if($name != ''){
//         $stmt = $conn->prepare("INSERT INTO departments (name) VALUES (?)");
//         $stmt->bind_param("s",$name);
//         $stmt->execute();
//         echo "<script>window.location.href='dashboard.php';</script>";
//         exit();

//     }
// }

// // ---- EDIT DEPARTMENT ----
// if(isset($_POST['update_department'])){
//     $id = intval($_POST['edit_id']);
//     $name = trim($_POST['edit_name']);
//     if($name != ''){
//         $stmt = $conn->prepare("UPDATE departments SET name=? WHERE id=?");
//         $stmt->bind_param("si",$name,$id);
//         $stmt->execute();
//         echo "<script>window.location.href='dashboard.php';</script>";
//         exit();

//     }
// }

// // ---- DELETE DEPARTMENT ----
// if(isset($_GET['delete_id'])){
//     $id = intval($_GET['delete_id']);
//     $conn->query("DELETE FROM departments WHERE id=$id");
//     echo "<script>window.location.href='dashboard.php';</script>";
//         exit();
// }

// ---- ADD SEMESTER ----
if(isset($_POST['add_semester'])){
    $dept_id = intval($_POST['dept_id']);
    $name = trim($_POST['sem_name']);
    $type = $_POST['type'];
    if($dept_id>0 && $name!='' && ($type=='Odd' || $type=='Even')){
        $stmt = $conn->prepare("INSERT INTO semesters (dept_id,name,type) VALUES (?,?,?)");
        $stmt->bind_param("iss",$dept_id,$name,$type);
        $stmt->execute();
        echo "<script>window.location.href='dashboard.php';</script>";
        exit();
    }
}

// ---- EDIT SEMESTER ----
if(isset($_POST['update_semester'])){
    $id = intval($_POST['edit_sem_id']);
    $dept_id = intval($_POST['edit_sem_dept']);
    $name = trim($_POST['edit_sem_name']);
    $type = $_POST['edit_sem_type'];
    if($dept_id>0 && $name!='' && ($type=='Odd'||$type=='Even')){
        $stmt = $conn->prepare("UPDATE semesters SET dept_id=?, name=?, type=? WHERE id=?");
        $stmt->bind_param("issi",$dept_id,$name,$type,$id);
        $stmt->execute();
        echo "<script>window.location.href='dashboard.php';</script>";
        exit();
    }
}

// ---- DELETE SEMESTER ----
if(isset($_GET['delete_sem_id'])){
    $id = intval($_GET['delete_sem_id']);
    $conn->query("DELETE FROM semesters WHERE id=$id");
    echo "<script>window.location.href='dashboard.php';</script>";
        exit();
}

// ---- ADD DIVISION ----
if(isset($_POST['add_division'])){
    $sem_id = intval($_POST['semester_id']);
    $name = trim($_POST['div_name']);
    $num = intval($_POST['num_students']);
    if($sem_id>0 && $name!='' && $num>0){
        $stmt = $conn->prepare("INSERT INTO divisions (semester_id,name,num_students) VALUES (?,?,?)");
        $stmt->bind_param("isi",$sem_id,$name,$num);
        $stmt->execute();
        echo "<script>window.location.href='dashboard.php';</script>";
        exit();
    }
}

// ---- EDIT DIVISION ----
if(isset($_POST['update_division'])){
    $id = intval($_POST['edit_div_id']);
    $name = trim($_POST['edit_div_name']);
    $num = intval($_POST['edit_div_students']);
    $sem_id = intval($_POST['edit_div_sem']);
    if($sem_id>0 && $name!='' && $num>0){
        $stmt = $conn->prepare("UPDATE divisions SET name=?, num_students=?, semester_id=? WHERE id=?");
        $stmt->bind_param("siii",$name,$num,$sem_id,$id);
        $stmt->execute();
        echo "<script>window.location.href='dashboard.php';</script>";
        exit();
    }
}

// ---- DELETE DIVISION ----
if(isset($_GET['delete_div_id'])){
    $id = intval($_GET['delete_div_id']);
    $conn->query("DELETE FROM divisions WHERE id=$id");
    echo "<script>window.location.href='dashboard.php';</script>";
        exit();
}
?>

<section id="semesters" class="content-section">
    <h1>Semesters & Divisions</h1>
    
    <!-- ADD SEMESTER -->
    <div class="add-semester">
        <h3>Add Semester</h3>
        <form method="post">
            <select name="dept_id" required>
                <option value="">Select Department</option>
                <?php
                $depts = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                while($d=$depts->fetch_assoc()){
                    echo "<option value='".$d['id']."'>".$d['name']."</option>";
                }
                ?>
            </select>
            <input type="text" name="sem_name" placeholder="Semester Name" required>
            <select name="type" required>
                <option value="">Select Type</option>
                <option value="Odd">Odd</option>
                <option value="Even">Even</option>
            </select>
            <button type="submit" name="add_semester">Add</button>
        </form>
    </div>

    <!-- SEMESTER TABLE -->
    <div class="semester-list">
        <h3>Existing Semesters</h3>
        <table>
            <thead>
                <tr><th>ID</th><th>Department</th><th>Name</th><th>Type</th><th>Actions</th></tr>
            </thead>
            <tbody>
                <?php
                $sems = $conn->query("SELECT s.*, d.name AS dept_name FROM semesters s JOIN departments d ON s.dept_id=d.id ORDER BY d.name,s.id");
                if($sems->num_rows>0){
                    while($s=$sems->fetch_assoc()){
                        if(isset($_GET['edit_sem_id']) && $_GET['edit_sem_id']==$s['id']){
                            echo "<tr><form method='post'>
                            <td>".$s['id']."</td>
                            <td><select name='edit_sem_dept'>";
                            $depts2 = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                            while($d2=$depts2->fetch_assoc()){
                                $sel = ($d2['id']==$s['dept_id'])?"selected":"";
                                echo "<option value='".$d2['id']."' $sel>".$d2['name']."</option>";
                            }
                            echo "</select></td>
                            <td><input type='text' name='edit_sem_name' value='".htmlspecialchars($s['name'])."'></td>
                            <td><select name='edit_sem_type'>
                                <option value='Odd' ".($s['type']=='Odd'?'selected':'').">Odd</option>
                                <option value='Even' ".($s['type']=='Even'?'selected':'').">Even</option>
                            </select></td>
                            <td>
                                <input type='hidden' name='edit_sem_id' value='".$s['id']."'>
                                <button type='submit' name='update_semester'>Update</button>
                                <a href='dashboard.php#semesters'>Cancel</a>
                            </td>
                            </form></tr>";
                        } else {
                            echo "<tr>
                            <td>".$s['id']."</td>
                            <td>".$s['dept_name']."</td>
                            <td>".$s['name']."</td>
                            <td>".$s['type']."</td>
                            <td>
                                <a href='dashboard.php?edit_sem_id=".$s['id']."#semesters'>Edit</a> |
                                <a href='dashboard.php?delete_sem_id=".$s['id']."' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                            </td>
                            </tr>";
                        }
                    }
                } else echo "<tr><td colspan='5'>No semesters found.</td></tr>";
                ?>
            </tbody>
        </table>
    </div>

    <hr>

    <!-- ADD DIVISION -->
    <div class="add-division">
        <h3>Add Division</h3>
        <form method="post">
            <select name="semester_id" required>
                <option value="">Select Semester</option>
                <?php
                $sems2 = $conn->query("SELECT s.id,s.name AS sem_name,s.type,d.name AS dept_name 
                                      FROM semesters s JOIN departments d ON s.dept_id=d.id 
                                      ORDER BY d.name,s.id");
                while($s2=$sems2->fetch_assoc()){
                    echo "<option value='".$s2['id']."'>".$s2['dept_name']." - ".$s2['sem_name']." (".$s2['type'].")</option>";
                }
                ?>
            </select>
            <input type="text" name="div_name" placeholder="Division Name" required>
            <input type="number" name="num_students" placeholder="Number of Students" required>
            <button type="submit" name="add_division">Add</button>
        </form>
    </div>

    <!-- DIVISION TABLE -->
    <div class="division-list">
        <h3>Existing Divisions</h3>
        <table>
            <thead>
                <tr><th>ID</th><th>Department</th><th>Semester</th><th>Name</th><th>No of Students</th><th>Actions</th></tr>
            </thead>
            <tbody>
                <?php
                $divs = $conn->query("SELECT divs.*, s.name AS sem_name, s.type, d.name AS dept_name 
                                      FROM divisions divs 
                                      JOIN semesters s ON divs.semester_id=s.id 
                                      JOIN departments d ON s.dept_id=d.id 
                                      ORDER BY d.name,s.id,divs.id");
                if($divs->num_rows>0){
                    while($div=$divs->fetch_assoc()){
                        if(isset($_GET['edit_div_id']) && $_GET['edit_div_id']==$div['id']){
                            echo "<tr><form method='post'>
                            <td>".$div['id']."</td>
                            <td>".$div['dept_name']."</td>
                            <td><select name='edit_div_sem'>";
                            $sems3 = $conn->query("SELECT s.id,s.name,s.type FROM semesters s WHERE s.dept_id=".$div['dept_id']);
                            while($s3=$sems3->fetch_assoc()){
                                $sel = ($s3['id']==$div['semester_id'])?"selected":"";
                                echo "<option value='".$s3['id']."' $sel>".$s3['name']." (".$s3['type'].")</option>";
                            }
                            echo "</select></td>
                            <td><input type='text' name='edit_div_name' value='".htmlspecialchars($div['name'])."'></td>
                            <td><input type='number' name='edit_div_students' value='".$div['num_students']."'></td>
                            <td>
                                <input type='hidden' name='edit_div_id' value='".$div['id']."'>
                                <button type='submit' name='update_division'>Update</button>
                                <a href='dashboard.php#semesters'>Cancel</a>
                            </td>
                            </form></tr>";
                        } else {
                            echo "<tr>
                            <td>".$div['id']."</td>
                            <td>".$div['dept_name']."</td>
                            <td>".$div['sem_name']." (".$div['type'].")</td>
                            <td>".$div['name']."</td>
                            <td>".$div['num_students']."</td>
                            <td>
                                <a href='dashboard.php?edit_div_id=".$div['id']."#semesters'>Edit</a> |
                                <a href='dashboard.php?delete_div_id=".$div['id']."' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                            </td>
                            </tr>";
                        }
                    }
                } else echo "<tr><td colspan='6'>No divisions found.</td></tr>";
                ?>
            </tbody>
        </table>
    </div>
</section>

<?php endif; ?>

<?php if($role=='admin'): ?>
<section id="classrooms" class="content-section">
    <h1>Classroom & Lab Management</h1>

    <!-- ADD CLASSROOM -->
    <div class="add-classroom">
        <h3>Add New Classroom / Lab</h3>
        <form method="post">
            <input type="text" name="room_number" placeholder="Room Number" required>

            <select name="dept_id" required>
                <option value="">Select Department</option>
                <?php
                $depts = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                while($d = $depts->fetch_assoc()){
                    echo "<option value='".$d['id']."'>".$d['name']."</option>";
                }
                ?>
            </select>

            <select name="type" required>
                <option value="">Select Type</option>
                <option value="Classroom">Classroom</option>
                <option value="Lab">Lab</option>
            </select>

            <input type="number" name="capacity" placeholder="Capacity" required>

            <button type="submit" name="add_classroom">Add Classroom</button>
        </form>
    </div>

    <hr>

    <!-- CLASSROOMS TABLE -->
    <div class="classroom-list">
        <h3>Existing Classrooms / Labs</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Room Number</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php
            // HANDLE ADD CLASSROOM
            if(isset($_POST['add_classroom'])){
                $room_number = trim($_POST['room_number']);
                $dept_id = intval($_POST['dept_id']);
                $type = $_POST['type'];
                $capacity = intval($_POST['capacity']);

                if($room_number!='' && $dept_id>0 && ($type=='Classroom'||$type=='Lab') && $capacity>0){
                    $stmt = $conn->prepare("INSERT INTO classrooms (room_number, dept_id, type, capacity) VALUES (?,?,?,?)");
                    $stmt->bind_param("sisi",$room_number,$dept_id,$type,$capacity);
                    $stmt->execute();
                    echo "<script>window.location.href='dashboard.php';</script>";
                    exit();
                }
            }

            // HANDLE DELETE CLASSROOM
            if(isset($_GET['delete_class_id'])){
                $id = intval($_GET['delete_class_id']);
                $conn->query("DELETE FROM classrooms WHERE id=$id");
                echo "<script>window.location.href='dashboard.php#classrooms';</script>";
                exit();
            }

            // HANDLE UPDATE CLASSROOM
            if(isset($_POST['update_classroom'])){
                $id = intval($_POST['edit_class_id']);
                $room_number = trim($_POST['edit_room_number']);
                $dept_id = intval($_POST['edit_dept_id']);
                $type = $_POST['edit_type'];
                $capacity = intval($_POST['edit_capacity']);

                if($room_number!='' && $dept_id>0 && ($type=='Classroom'||$type=='Lab') && $capacity>0){
                    $stmt = $conn->prepare("UPDATE classrooms SET room_number=?, dept_id=?, type=?, capacity=? WHERE id=?");
                    $stmt->bind_param("sisii",$room_number,$dept_id,$type,$capacity,$id);
                    $stmt->execute();
                    echo "<script>window.location.href='dashboard.php#classrooms';</script>";
                    exit();
                }
            }

            // FETCH CLASSROOMS
            $classes = $conn->query("SELECT c.*, d.name AS dept_name FROM classrooms c JOIN departments d ON c.dept_id=d.id ORDER BY d.name,c.room_number");
            if($classes->num_rows>0){
                while($c=$classes->fetch_assoc()){
                    if(isset($_GET['edit_class_id']) && $_GET['edit_class_id']==$c['id']){
                        // EDIT FORM
                        echo "<tr>
                        <form method='post'>
                            <td>".$c['id']."</td>
                            <td><input type='text' name='edit_room_number' value='".htmlspecialchars($c['room_number'])."'></td>
                            <td>
                                <select name='edit_dept_id'>";
                                $depts2 = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                                while($d2=$depts2->fetch_assoc()){
                                    $sel = ($d2['id']==$c['dept_id'])?"selected":"";
                                    echo "<option value='".$d2['id']."' $sel>".$d2['name']."</option>";
                                }
                        echo "</select>
                            </td>
                            <td>
                                <select name='edit_type'>
                                    <option value='Classroom' ".($c['type']=='Classroom'?'selected':'').">Classroom</option>
                                    <option value='Lab' ".($c['type']=='Lab'?'selected':'').">Lab</option>
                                </select>
                            </td>
                            <td><input type='number' name='edit_capacity' value='".$c['capacity']."'></td>
                            <td>
                                <input type='hidden' name='edit_class_id' value='".$c['id']."'>
                                <button type='submit' name='update_classroom'>Update</button>
                                <a href='dashboard.php#classrooms'>Cancel</a>
                            </td>
                        </form>
                        </tr>";
                    } else {
                        // DISPLAY ROW
                        echo "<tr>
                        <td>".$c['id']."</td>
                        <td>".$c['room_number']."</td>
                        <td>".$c['dept_name']."</td>
                        <td>".$c['type']."</td>
                        <td>".$c['capacity']."</td>
                        <td>
                            <a href='dashboard.php?edit_class_id=".$c['id']."#classrooms'>Edit</a> |
                            <a href='dashboard.php?delete_class_id=".$c['id']."' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                        </td>
                        </tr>";
                    }
                }
            } else {
                echo "<tr><td colspan='6'>No classrooms found.</td></tr>";
            }
            ?>
            </tbody>
        </table>
    </div>

</section>
<?php endif; ?>

<?php if($role=='admin'): ?>
<section id="faculty" class="content-section">
    <h1>Faculty & Subject Management</h1>

    <!-- ADD FACULTY -->
    <div class="add-faculty">
        <h3>Add New Faculty</h3>
        <form method="post">
            <input type="text" name="faculty_name" placeholder="Faculty Name" required>
            <input type="email" name="faculty_email" placeholder="Email">
            <input type="text" name="faculty_phone" placeholder="Phone">
            
            <select name="faculty_dept" required>
                <option value="">Select Department</option>
                <?php
                $depts = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                while($d=$depts->fetch_assoc()){
                    echo "<option value='".$d['id']."'>".$d['name']."</option>";
                }
                ?>
            </select>

            <!-- Multi-select Subjects -->
            <select name="faculty_subjects[]" multiple size="5">
                <?php
                $subjects = $conn->query("SELECT s.*, d.name AS dept_name, sem.name AS sem_name 
                                          FROM subjects s 
                                          JOIN departments d ON s.dept_id=d.id
                                          JOIN semesters sem ON s.semester_id=sem.id
                                          ORDER BY d.name, sem.id, s.subject_name");
                while($s=$subjects->fetch_assoc()){
                    echo "<option value='".$s['id']."'>".$s['subject_name']." (".$s['subject_code'].") - ".$s['dept_name']." - ".$s['sem_name']."</option>";
                }
                ?>
            </select>

            <button type="submit" name="add_faculty">Add Faculty</button>
        </form>
    </div>

    <hr>

    <!-- LIST FACULTIES WITH FILTER -->
    <div class="faculty-list">
        <h3>Existing Faculties</h3>

        <form method="get" style="margin-bottom:15px;">
            <select name="filter_dept">
                <option value="">Filter by Department</option>
                <?php
                $depts = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                while($d=$depts->fetch_assoc()){
                    $selected = (isset($_GET['filter_dept']) && $_GET['filter_dept']==$d['id'])?"selected":"";
                    echo "<option value='".$d['id']."' $selected>".$d['name']."</option>";
                }
                ?>
            </select>

            <select name="filter_sem">
                <option value="">Filter by Semester</option>
                <?php
                $sems = $conn->query("SELECT s.*, d.name AS dept_name FROM semesters s JOIN departments d ON s.dept_id=d.id ORDER BY d.name,s.id");
                while($s=$sems->fetch_assoc()){
                    $selected = (isset($_GET['filter_sem']) && $_GET['filter_sem']==$s['id'])?"selected":"";
                    echo "<option value='".$s['id']."' $selected>".$s['dept_name']." - ".$s['name']."</option>";
                }
                ?>
            </select>

            <select name="filter_subject">
                <option value="">Filter by Subject</option>
                <?php
                $subjects = $conn->query("SELECT * FROM subjects ORDER BY subject_name");
                while($s=$subjects->fetch_assoc()){
                    $selected = (isset($_GET['filter_subject']) && $_GET['filter_subject']==$s['id'])?"selected":"";
                    echo "<option value='".$s['id']."' $selected>".$s['subject_name']."</option>";
                }
                ?>
            </select>

            <button type="submit">Filter</button>
            <a href="dashboard.php#faculty" style="margin-left:10px;">Reset</a>
        </form>

        <table>
            <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Subjects</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // HANDLE ADD FACULTY
                if(isset($_POST['add_faculty'])){
                $name = trim($_POST['faculty_name']);
                $email = trim($_POST['faculty_email']);
                $phone = trim($_POST['faculty_phone']);
                $dept_id = intval($_POST['faculty_dept']);
                $subjects_arr = isset($_POST['faculty_subjects']) ? $_POST['faculty_subjects'] : [];

                if($name!='' && $dept_id>0){
                    // 1. Insert into faculties
                    $stmt = $conn->prepare("INSERT INTO faculties (name,email,phone,dept_id) VALUES (?,?,?,?)");
                    $stmt->bind_param("sssi",$name,$email,$phone,$dept_id);
                    $stmt->execute();
                    $faculty_id = $stmt->insert_id;

                    // 2. Assign subjects
                    foreach($subjects_arr as $sub_id){
                        $sub_id = intval($sub_id);
                        $conn->query("INSERT IGNORE INTO faculty_subjects (faculty_id,subject_id) VALUES ($faculty_id,$sub_id)");
                    }

                    // 3. Create login user for faculty (default password)
                    if($email != ''){
                        $username = explode('@',$email)[0]; // take email prefix as username
                        $default_password = 'faculty123';   // you can later hash with password_hash()
                        
                        $stmt2 = $conn->prepare("INSERT INTO users (username,password,role,email) VALUES (?,?,?,?)");
                        $role = "faculty";
                        $stmt2->bind_param("ssss",$username,$default_password,$role,$email);
                        $stmt2->execute();
                    }

                    echo "<script>window.location.href='dashboard.php#faculty';</script>";
                    exit();
                }
            }

                // HANDLE DELETE FACULTY
                if(isset($_GET['delete_fac_id'])){
                    $id = intval($_GET['delete_fac_id']);
                    $conn->query("DELETE FROM faculty_subjects WHERE faculty_id=$id");
                    $conn->query("DELETE FROM faculties WHERE id=$id");
                    echo "<script>window.location.href='dashboard.php#faculty';</script>";
                    exit();
                }

                // FILTER QUERY
                $where = [];
                if(isset($_GET['filter_dept']) && $_GET['filter_dept']!='') $where[] = "f.dept_id=".intval($_GET['filter_dept']);
                if(isset($_GET['filter_sem']) && $_GET['filter_sem']!='') $where[] = "s.semester_id=".intval($_GET['filter_sem']);
                if(isset($_GET['filter_subject']) && $_GET['filter_subject']!='') $where[] = "fs.subject_id=".intval($_GET['filter_subject']);
                $where_sql = (count($where)>0)?"WHERE ".implode(" AND ",$where):"";

                $faculties = $conn->query("
                    SELECT f.*, d.name AS dept_name, GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subjects
                    FROM faculties f
                    JOIN departments d ON f.dept_id=d.id
                    LEFT JOIN faculty_subjects fs ON f.id=fs.faculty_id
                    LEFT JOIN subjects s ON fs.subject_id=s.id
                    $where_sql
                    GROUP BY f.id
                    ORDER BY d.name,f.name
                ");

                if($faculties->num_rows>0){
                    while($f=$faculties->fetch_assoc()){
                        echo "<tr>
                            <td>".$f['id']."</td>
                            <td>".$f['name']."</td>
                            <td>".$f['email']."</td>
                            <td>".$f['phone']."</td>
                            <td>".$f['dept_name']."</td>
                            <td>".$f['subjects']."</td>
                            <td>
                                <a href='dashboard.php?edit_fac_id=".$f['id']."#faculty'>Edit</a> |
                                <a href='dashboard.php?delete_fac_id=".$f['id']."' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                            </td>
                        </tr>";
                    }
                } else echo "<tr><td colspan='7'>No faculty found.</td></tr>";
                ?>
            </tbody>
        </table>
    </div>

    <hr>

</section>
<?php endif; ?>

<?php if($role=='admin'): ?>
<section id="subjects" class="content-section">
    <h1>Subjects Management</h1>

    <!-- ADD SUBJECT -->
    <div class="add-subject">
        <h3>Add New Subject</h3>
        <form method="post">
            <input type="text" name="subject_name" placeholder="Subject Name" required>
            <input type="text" name="subject_code" placeholder="Subject Code" required>
            <input type="number" name="credits" placeholder="Credits" value="3" min="1" max="10" required>

            <select name="dept_id" required>
                <option value="">Select Department</option>
                <?php
                $depts = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                while($d=$depts->fetch_assoc()){
                    echo "<option value='".$d['id']."'>".$d['name']."</option>";
                }
                ?>
            </select>

            <select name="semester_id" required>
                <option value="">Select Semester</option>
                <?php
                $sems = $conn->query("SELECT s.*, d.name AS dept_name FROM semesters s JOIN departments d ON s.dept_id=d.id ORDER BY d.name,s.id");
                while($s=$sems->fetch_assoc()){
                    echo "<option value='".$s['id']."'>".$s['dept_name']." - ".$s['name']." (".$s['type'].")</option>";
                }
                ?>
            </select>

            <button type="submit" name="add_subject">Add Subject</button>
        </form>
    </div>

    <hr>

    <!-- SUBJECT LIST -->
    <div class="subject-list">
        <h3>Existing Subjects</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Credits</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php
            // DELETE SUBJECT
            if(isset($_GET['delete_sub_id'])){
                $del_id = intval($_GET['delete_sub_id']);
                $conn->query("DELETE FROM subjects WHERE id=$del_id");
                $conn->query("DELETE FROM faculty_subjects WHERE subject_id=$del_id"); // cleanup relation
                echo "<script>window.location.href='dashboard.php#subjects';</script>";
                exit();
            }

            // UPDATE SUBJECT
            if(isset($_POST['update_subject'])){
                $id = intval($_POST['edit_sub_id']);
                $name = trim($_POST['edit_sub_name']);
                $code = trim($_POST['edit_sub_code']);
                $credits = intval($_POST['edit_sub_credits']);
                $dept_id = intval($_POST['edit_sub_dept']);
                $sem_id = intval($_POST['edit_sub_sem']);
                $stmt = $conn->prepare("UPDATE subjects SET subject_name=?, subject_code=?, credits=?, dept_id=?, semester_id=? WHERE id=?");
                $stmt->bind_param("ssiiii",$name,$code,$credits,$dept_id,$sem_id,$id);
                $stmt->execute();
                echo "<script>window.location.href='dashboard.php#subjects';</script>";
                exit();
            }

            $subs = $conn->query("
                SELECT s.*, d.name AS dept_name, sem.name AS sem_name, sem.type 
                FROM subjects s
                JOIN departments d ON s.dept_id=d.id
                JOIN semesters sem ON s.semester_id=sem.id
                ORDER BY d.name, sem.id, s.subject_name
            ");
            if($subs->num_rows>0){
                while($sub=$subs->fetch_assoc()){
                    if(isset($_GET['edit_sub_id']) && $_GET['edit_sub_id']==$sub['id']){
                        echo "<tr>
                        <form method='post'>
                            <td>".$sub['id']."</td>
                            <td><input type='text' name='edit_sub_code' value='".htmlspecialchars($sub['subject_code'])."'></td>
                            <td><input type='text' name='edit_sub_name' value='".htmlspecialchars($sub['subject_name'])."'></td>
                            <td><input type='number' name='edit_sub_credits' value='".$sub['credits']."' min='1' max='10'></td>
                            <td>
                                <select name='edit_sub_dept' required>";
                                $depts2 = $conn->query("SELECT * FROM departments ORDER BY name ASC");
                                while($d2=$depts2->fetch_assoc()){
                                    $sel = ($d2['id']==$sub['dept_id'])?"selected":"";
                                    echo "<option value='".$d2['id']."' $sel>".$d2['name']."</option>";
                                }
                        echo "</select>
                            </td>
                            <td>
                                <select name='edit_sub_sem' required>";
                                $sems2 = $conn->query("SELECT * FROM semesters WHERE dept_id=".$sub['dept_id']." ORDER BY id");
                                while($s2=$sems2->fetch_assoc()){
                                    $sel = ($s2['id']==$sub['semester_id'])?"selected":"";
                                    echo "<option value='".$s2['id']."' $sel>".$s2['name']." (".$s2['type'].")</option>";
                                }
                        echo "</select>
                            </td>
                            <td>
                                <input type='hidden' name='edit_sub_id' value='".$sub['id']."'>
                                <button type='submit' name='update_subject'>Update</button>
                                <a href='dashboard.php#subjects'>Cancel</a>
                            </td>
                        </form>
                        </tr>";
                    } else {
                        echo "<tr>
                            <td>".$sub['id']."</td>
                            <td>".$sub['subject_code']."</td>
                            <td>".$sub['subject_name']."</td>
                            <td>".$sub['credits']."</td>
                            <td>".$sub['dept_name']."</td>
                            <td>".$sub['sem_name']." (".$sub['type'].")</td>
                            <td>
                                <a href='dashboard.php?edit_sub_id=".$sub['id']."#subjects'>Edit</a> | 
                                <a href='dashboard.php?delete_sub_id=".$sub['id']."#subjects' onclick=\"return confirm('Delete subject?')\">Delete</a>
                            </td>
                        </tr>";
                    }
                }
            } else {
                echo "<tr><td colspan='7'>No subjects found.</td></tr>";
            }
            ?>
            </tbody>
        </table>
    </div>
</section>

<?php
if(isset($_POST['add_subject'])){
    $sub_name = trim($_POST['subject_name']);
    $sub_code = trim($_POST['subject_code']);
    $credits = intval($_POST['credits']);
    $dept_id = intval($_POST['dept_id']);
    $sem_id = intval($_POST['semester_id']);

    if($sub_name!='' && $sub_code!='' && $dept_id>0 && $sem_id>0){
        // check duplicate subject_code
        $check = $conn->prepare("SELECT id FROM subjects WHERE subject_code=?");
        $check->bind_param("s",$sub_code);
        $check->execute();
        $check->store_result();

        if($check->num_rows > 0){
            echo "<script>alert('Subject code already exists! Please choose another.');</script>";
        } else {
            $stmt = $conn->prepare("INSERT INTO subjects (dept_id,subject_name,subject_code,credits,semester_id) VALUES (?,?,?,?,?)");
            $stmt->bind_param("issii",$dept_id,$sub_name,$sub_code,$credits,$sem_id);
            $stmt->execute();
            echo "<script>window.location.href='dashboard.php#subjects';</script>";
            exit();
        }
    }
}

?>
<?php endif; ?>


<?php if($role=='admin'): ?>
<section id="constraints">
    <h2>Constraints</h2>

    <!-- Add / Update Constraints -->
    <div class="add-constraints">
        <h3><?php echo isset($_GET['edit_constraint']) ? "Edit Constraint" : "Add Constraint"; ?></h3>
        <?php
        $editConstraint = null;
        if(isset($_GET['edit_constraint'])){
            $cid = intval($_GET['edit_constraint']);
            $editConstraint = $conn->query("SELECT * FROM constraints WHERE id=$cid")->fetch_assoc();
        }
        ?>
        <form method="post">
            <label>Number of Weekdays</label>
            <select name="num_weekdays" required>
                <option value="5" <?php if($editConstraint && $editConstraint['num_weekdays']==5) echo "selected"; ?>>5 (Mon–Fri)</option>
                <option value="6" <?php if($editConstraint && $editConstraint['num_weekdays']==6) echo "selected"; ?>>6 (Mon–Sat)</option>
            </select>

            <label>Daily Lecture Slots</label>
            <input type="number" name="num_daily_slots" min="1" max="10" 
                value="<?php echo $editConstraint ? $editConstraint['num_daily_slots'] : 6; ?>" required>

            <label>Lab Slot Length (consecutive hours)</label>
            <input type="number" name="lab_slot_length" min="1" max="4" 
                value="<?php echo $editConstraint ? $editConstraint['lab_slot_length'] : 2; ?>" required>

            <?php if($editConstraint): ?>
                <input type="hidden" name="constraint_id" value="<?php echo $editConstraint['id']; ?>">
                <button type="submit" name="update_constraint">Update Constraint</button>
                <a href="dashboard.php#constraints">Cancel</a>
            <?php else: ?>
                <button type="submit" name="add_constraint">Add Constraint</button>
            <?php endif; ?>
        </form>
    </div>

    <?php
    // ADD constraint
    if(isset($_POST['add_constraint'])){
        $weekdays = intval($_POST['num_weekdays']);
        $slots = intval($_POST['num_daily_slots']);
        $lab_len = intval($_POST['lab_slot_length']);
        $stmt = $conn->prepare("INSERT INTO constraints (num_weekdays,num_daily_slots,lab_slot_length) VALUES (?,?,?)");
        $stmt->bind_param("iii",$weekdays,$slots,$lab_len);
        $stmt->execute();
        echo "<script>window.location.href='dashboard.php#constraints';</script>";
        exit();
    }

    // UPDATE constraint
    if(isset($_POST['update_constraint'])){
        $cid = intval($_POST['constraint_id']);
        $weekdays = intval($_POST['num_weekdays']);
        $slots = intval($_POST['num_daily_slots']);
        $lab_len = intval($_POST['lab_slot_length']);
        $stmt = $conn->prepare("UPDATE constraints SET num_weekdays=?, num_daily_slots=?, lab_slot_length=? WHERE id=?");
        $stmt->bind_param("iiii",$weekdays,$slots,$lab_len,$cid);
        $stmt->execute();
        echo "<script>window.location.href='dashboard.php#constraints';</script>";
        exit();
    }

    // DELETE constraint
    if(isset($_GET['delete_constraint'])){
        $cid = intval($_GET['delete_constraint']);
        $conn->query("DELETE FROM constraints WHERE id=$cid");
        echo "<script>window.location.href='dashboard.php#constraints';</script>";
        exit();
    }
    ?>

    <!-- Display Constraints -->
    <div class="list-constraints">
        <h3>Existing Constraints</h3>
        <table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th>Weekdays</th>
                <th>Daily Slots</th>
                <th>Lab Slot Length</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
            </tr>
            <?php
            $rows = $conn->query("SELECT * FROM constraints ORDER BY id DESC");
            while($r = $rows->fetch_assoc()){
                echo "<tr>
                        <td>".$r['num_weekdays']."</td>
                        <td>".$r['num_daily_slots']."</td>
                        <td>".$r['lab_slot_length']."</td>
                        <td>".$r['created_at']."</td>
                        <td>".$r['updated_at']."</td>
                        <td>
                            <a href='dashboard.php?edit_constraint=".$r['id']."#constraints'>Edit</a> | 
                            <a href='dashboard.php?delete_constraint=".$r['id']."#constraints' onclick=\"return confirm('Delete this constraint?');\">Delete</a>
                        </td>
                      </tr>";
            }
            ?>
        </table>
    </div>
</section>
<?php endif; ?>


<?php if($role=='admin'): ?>
<section id="timetable" class="content-section">
    <h1>Timetable Management</h1>

    <?php
    // ---------------- Load constraints safely ----------------
    function load_constraints($conn){
        $defaults = ['num_daily_slots'=>6,'num_weekdays'=>5,'lab_slot_length'=>2];
        $res = $conn->query("SELECT * FROM constraints ORDER BY id DESC LIMIT 1");
        if($res && $res->num_rows>0){
            $c = $res->fetch_assoc();
            return [
                'num_daily_slots'=>intval($c['num_daily_slots']),
                'num_weekdays'=>intval($c['num_weekdays']),
                'lab_slot_length'=>intval($c['lab_slot_length'])
            ];
        }
        return $defaults;
    }

    function is_lab_subject($name,$code){
        $s=strtolower($name.' '.$code);
        return (strpos($s,'lab')!==false);
    }

    // check clash functions
    function is_faculty_free($conn,$fid,$day,$slot){
        $q=$conn->query("SELECT 1 FROM timetable WHERE faculty_id=$fid AND day='$day' AND slot=$slot LIMIT 1");
        return ($q->num_rows==0);
    }
    function is_room_free($conn,$rid,$day,$slot){
        $q=$conn->query("SELECT 1 FROM timetable WHERE classroom_id=$rid AND day='$day' AND slot=$slot LIMIT 1");
        return ($q->num_rows==0);
    }
    function is_division_free($conn,$divid,$day,$slot){
        $q=$conn->query("SELECT 1 FROM timetable WHERE division_id=$divid AND day='$day' AND slot=$slot LIMIT 1");
        return ($q->num_rows==0);
    }

    // --------------- Reset timetable ----------------
    if(isset($_POST['reset_timetable'])){
        $conn->query("DELETE FROM timetable");
        echo "<p style='color:green'>✅ Timetable cleared.</p>";
    }

    // --------------- Generate timetable ----------------
    if(isset($_POST['generate_timetable'])){
    $conn->query("DELETE FROM timetable");
    $cons = load_constraints($conn);
    $maxSlots = $cons['num_daily_slots'];
    $numDays  = $cons['num_weekdays'];
    $labLen   = $cons['lab_slot_length'];

    $dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    $days = array_slice($dayNames,0,$numDays);

    $divs=$conn->query("SELECT d.*, s.dept_id, s.name AS sem_name 
                        FROM divisions d 
                        JOIN semesters s ON d.semester_id=s.id
                        ORDER BY s.dept_id,s.semester_no,d.name");

    while($dv=$divs->fetch_assoc()){
        $divId=intval($dv['id']);
        $semId=intval($dv['semester_id']);
        $deptId=intval($dv['dept_id']);
        $size=intval($dv['num_students']);

        // subjects for this semester
        $subs=$conn->query("SELECT * FROM subjects WHERE semester_id=$semId");
        $reqs=[];
        $totalCredits=0;

        while($s=$subs->fetch_assoc()){
            $sid=intval($s['id']);
            $credits=max(1,intval($s['credits']));
            $totalCredits+=$credits;

            if(is_lab_subject($s['subject_name'],$s['subject_code'])){
                $blocks=ceil($credits/$labLen);
                for($i=0;$i<$blocks;$i++){
                    $reqs[]=['sub'=>$sid,'len'=>$labLen,'lab'=>true];
                }
            }else{
                for($i=0;$i<$credits;$i++){
                    $reqs[]=['sub'=>$sid,'len'=>1,'lab'=>false];
                }
            }
        }

        shuffle($reqs);

        // calculate daily load target
        $avgPerDay = ceil($totalCredits/$numDays);
        $dayLoad = array_fill_keys($days,0);

        // place subjects
        foreach($reqs as $r){
            $sid=$r['sub']; $len=$r['len']; $isLab=$r['lab'];

            // faculties
            $facRes=$conn->query("SELECT f.id,f.name FROM faculty_subjects fs 
                                   JOIN faculties f ON fs.faculty_id=f.id
                                   WHERE fs.subject_id=$sid");
            $faculties=[];
            while($f=$facRes->fetch_assoc()) $faculties[]=$f;
            if(empty($faculties)) continue;

            // classrooms
            $type=$isLab?'Lab':'Classroom';
            $roomRes=$conn->query("SELECT * FROM classrooms 
                                    WHERE dept_id=$deptId AND type='$type' AND capacity>=$size
                                    ORDER BY capacity ASC");
            $rooms=[];
            while($rm=$roomRes->fetch_assoc()) $rooms[]=$rm;
            if(empty($rooms)) continue;

            // try to place
            $placed=false;
            $dayTry=$days; shuffle($dayTry);
            foreach($dayTry as $day){
                if($dayLoad[$day] + $len > $avgPerDay+1) continue; // avoid overloading day

                $startSlots=range(1,$maxSlots-$len+1); shuffle($startSlots);
                foreach($startSlots as $st){
                    $block=range($st,$st+$len-1);

                    // check division free
                    $ok=true;
                    foreach($block as $sl){
                        if(!is_division_free($conn,$divId,$day,$sl)){ $ok=false; break; }
                    }
                    if(!$ok) continue;

                    // faculty with least load
                    $bestF=null; $minLoad=9999;
                    foreach($faculties as $fc){
                        $fid=$fc['id'];
                        $wk=$conn->query("SELECT COUNT(*) c FROM timetable WHERE faculty_id=$fid")->fetch_assoc()['c'];
                        if($wk<$minLoad){
                            $free=true;
                            foreach($block as $sl){
                                if(!is_faculty_free($conn,$fid,$day,$sl)){ $free=false; break; }
                            }
                            if($free){ $minLoad=$wk; $bestF=$fid; }
                        }
                    }
                    if(!$bestF) continue;

                    // room
                    $chosenRoom=null;
                    foreach($rooms as $rm){
                        $rid=$rm['id']; $free=true;
                        foreach($block as $sl){
                            if(!is_room_free($conn,$rid,$day,$sl)){ $free=false; break; }
                        }
                        if($free){ $chosenRoom=$rid; break; }
                    }
                    if(!$chosenRoom) continue;

                    // assign
                    foreach($block as $sl){
                        $conn->query("INSERT INTO timetable(division_id,day,slot,subject_id,faculty_id,classroom_id)
                                      VALUES($divId,'$day',$sl,$sid,$bestF,$chosenRoom)");
                    }
                    $dayLoad[$day]+=$len;
                    $placed=true; break;
                }
                if($placed) break;
            }
        }
    }

    echo "<p style='color:green'>✅ Real-world balanced timetable generated.</p>";
}

    ?>

    <!-- Actions -->
    <form method="post" style="margin:10px 0;">
        <button type="submit" name="generate_timetable">Generate Timetable</button>
        <button type="submit" name="reset_timetable" onclick="return confirm('Reset all timetable?')">Reset</button>
    </form>

    <?php
    // -------- Display --------
    $cons=load_constraints($conn);
    $maxSlots=$cons['num_daily_slots'];
    $days=array_slice(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],0,$cons['num_weekdays']);

    $divs=$conn->query("SELECT d.*,s.name AS sem_name,dep.name AS dept_name
                        FROM divisions d
                        JOIN semesters s ON d.semester_id=s.id
                        JOIN departments dep ON s.dept_id=dep.id
                        ORDER BY dep.name,s.semester_no,d.name");

    while($dv=$divs->fetch_assoc()){
        echo "<h3>".$dv['dept_name']." - ".$dv['sem_name']." - Division ".$dv['name']."</h3>";
        echo "<table border='1' cellpadding='6' style='border-collapse:collapse; margin-bottom:20px;'>
                <thead><tr><th>Slot</th>";
        foreach($days as $d) echo "<th>$d</th>";
        echo "</tr></thead><tbody>";

        for($s=1;$s<=$maxSlots;$s++){
            echo "<tr><td><strong>Slot $s</strong></td>";
            foreach($days as $d){
                $cell=$conn->query("SELECT sub.subject_code,sub.subject_name,f.name AS fname,c.room_number 
                                    FROM timetable t
                                    JOIN subjects sub ON t.subject_id=sub.id
                                    JOIN faculties f ON t.faculty_id=f.id
                                    JOIN classrooms c ON t.classroom_id=c.id
                                    WHERE t.division_id=".$dv['id']." AND t.day='$d' AND t.slot=$s LIMIT 1");
                if($cell && $cell->num_rows>0){
                    $x=$cell->fetch_assoc();
                    echo "<td><b>".$x['subject_code']."</b><br>".$x['subject_name']."<br><small>".$x['fname']." • Rm ".$x['room_number']."</small></td>";
                } else {
                    echo "<td style='color:#999'>—</td>";
                }
            }
            echo "</tr>";
        }
        echo "</tbody></table>";
    }
    ?>
</section>
<?php endif; ?>
<?php if($role=='faculty'): ?>
<section id="faculty-dashboard" class="content-section">
    <h1>Faculty Dashboard</h1>

    <?php
    // Get faculty details
    $res = $conn->prepare("SELECT * FROM faculties WHERE user_id=(SELECT id FROM users WHERE username=?)");
    $res->bind_param("s",$username);
    $res->execute();
    $faculty = $res->get_result()->fetch_assoc();

    if(!$faculty){
        echo "<p style='color:red'>Faculty record not found!</p>";
    } else {
        $faculty_id = $faculty['id'];
        echo "<h3>Welcome, ".htmlspecialchars($faculty['name'])."</h3>";
        echo "<p>Email: ".htmlspecialchars($faculty['email'])."</p>";
        echo "<p>Phone: ".htmlspecialchars($faculty['phone'])."</p>";

        // Get subjects assigned to this faculty
        $subjects = $conn->query("SELECT s.subject_name, s.subject_code, d.name AS dept_name 
                                  FROM faculty_subjects fs 
                                  JOIN subjects s ON fs.subject_id=s.id
                                  JOIN departments d ON s.dept_id=d.id
                                  WHERE fs.faculty_id=$faculty_id
                                  ORDER BY d.name, s.subject_name");

        echo "<div class='content-section'>";
        echo "<h3>Assigned Subjects</h3>";
        if($subjects->num_rows>0){
            echo "<table>
                    <thead><tr><th>Dept</th><th>Subject Code</th><th>Subject Name</th></tr></thead><tbody>";
            while($sub=$subjects->fetch_assoc()){
                echo "<tr>
                        <td>".htmlspecialchars($sub['dept_name'])."</td>
                        <td>".htmlspecialchars($sub['subject_code'])."</td>
                        <td>".htmlspecialchars($sub['subject_name'])."</td>
                      </tr>";
            }
            echo "</tbody></table>";
        } else {
            echo "<p>No subjects assigned yet.</p>";
        }
        echo "</div>";

        // Fetch constraints
        $cons = $conn->query("SELECT num_weekdays, num_daily_slots FROM constraints LIMIT 1")->fetch_assoc();
        $num_slots = $cons['num_daily_slots'];
        $days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        // Fetch timetable
        $timetable = $conn->query("SELECT t.day, t.slot, s.subject_name, s.subject_code, c.room_number, d.name AS division_name
                                   FROM timetable t
                                   JOIN subjects s ON t.subject_id=s.id
                                   JOIN classrooms c ON t.classroom_id=c.id
                                   JOIN divisions d ON t.division_id=d.id
                                   WHERE t.faculty_id=$faculty_id");

        // Create array for quick lookup
        $tt_arr = [];
        while($t=$timetable->fetch_assoc()){
            $tt_arr[$t['slot']][$t['day']] = $t;
        }

        // Display matrix timetable
        echo "<div class='content-section'>";
        echo "<h3>Your Timetable</h3>";
        echo "<table border='1' cellpadding='8' cellspacing='0' style='text-align:center;'>";
        echo "<thead><tr><th>Slot</th>";
        foreach($days as $day) echo "<th>$day</th>";
        echo "</tr></thead><tbody>";

        for($slot=1; $slot<=$num_slots; $slot++){
            echo "<tr>";
            echo "<td><strong>$slot</strong></td>";
            foreach($days as $day){
                if(isset($tt_arr[$slot][$day])){
                    $cell = $tt_arr[$slot][$day];
                    echo "<td>".htmlspecialchars($cell['subject_code'])."<br>"
                               .htmlspecialchars($cell['subject_name'])."<br>"
                               .htmlspecialchars($cell['division_name'])."<br>"
                               .htmlspecialchars($cell['room_number'])."</td>";
                } else {
                    echo "<td>-</td>";
                }
            }
            echo "</tr>";
        }

        echo "</tbody></table>";
        echo "</div>";
    }
    ?>
</section>
<?php endif; ?>

</div>
</body>
</html>
