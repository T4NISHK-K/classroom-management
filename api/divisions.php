<?php
require_once 'config.php';

// Check authentication for admin
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
    sendResponse(false, null, 'Unauthorized');
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'list') {
            $result = $conn->query("SELECT divs.*, s.name AS sem_name, s.type, d.name AS dept_name 
                                   FROM divisions divs 
                                   JOIN semesters s ON divs.semester_id=s.id 
                                   JOIN departments d ON s.dept_id=d.id 
                                   ORDER BY d.name, s.id, divs.id");
            $divisions = [];
            while ($row = $result->fetch_assoc()) {
                $divisions[] = $row;
            }
            sendResponse(true, $divisions);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT divs.*, s.name AS sem_name, s.type, d.name AS dept_name 
                                   FROM divisions divs 
                                   JOIN semesters s ON divs.semester_id=s.id 
                                   JOIN departments d ON s.dept_id=d.id 
                                   WHERE divs.id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                sendResponse(false, null, 'Division not found');
            }
        } elseif ($action === 'by_semester' && isset($_GET['semester_id'])) {
            $semester_id = intval($_GET['semester_id']);
            $stmt = $conn->prepare("SELECT * FROM divisions WHERE semester_id=? ORDER BY id ASC");
            $stmt->bind_param("i", $semester_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $divisions = [];
            while ($row = $result->fetch_assoc()) {
                $divisions[] = $row;
            }
            sendResponse(true, $divisions);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $semester_id = intval($data['semester_id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $num_students = intval($data['num_students'] ?? 0);
        
        if ($semester_id > 0 && $name !== '' && $num_students > 0) {
            $stmt = $conn->prepare("INSERT INTO divisions (semester_id, name, num_students) VALUES (?, ?, ?)");
            $stmt->bind_param("isi", $semester_id, $name, $num_students);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $stmt->insert_id, 'semester_id' => $semester_id, 'name' => $name, 'num_students' => $num_students]);
            } else {
                sendResponse(false, null, 'Failed to create division');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $semester_id = intval($data['semester_id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $num_students = intval($data['num_students'] ?? 0);
        
        if ($id > 0 && $semester_id > 0 && $name !== '' && $num_students > 0) {
            $stmt = $conn->prepare("UPDATE divisions SET name=?, num_students=?, semester_id=? WHERE id=?");
            $stmt->bind_param("siii", $name, $num_students, $semester_id, $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id, 'semester_id' => $semester_id, 'name' => $name, 'num_students' => $num_students]);
            } else {
                sendResponse(false, null, 'Failed to update division');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM divisions WHERE id=$id");
            sendResponse(true, ['id' => $id]);
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

