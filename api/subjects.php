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
            $result = $conn->query("
                SELECT s.*, d.name AS dept_name, sem.name AS sem_name, sem.type 
                FROM subjects s
                JOIN departments d ON s.dept_id=d.id
                JOIN semesters sem ON s.semester_id=sem.id
                ORDER BY d.name, sem.id, s.subject_name
            ");
            $subjects = [];
            while ($row = $result->fetch_assoc()) {
                $subjects[] = $row;
            }
            sendResponse(true, $subjects);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT s.*, d.name AS dept_name, sem.name AS sem_name, sem.type 
                                   FROM subjects s 
                                   JOIN departments d ON s.dept_id=d.id
                                   JOIN semesters sem ON s.semester_id=sem.id
                                   WHERE s.id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                sendResponse(false, null, 'Subject not found');
            }
        } elseif ($action === 'by_semester' && isset($_GET['semester_id'])) {
            $semester_id = intval($_GET['semester_id']);
            $stmt = $conn->prepare("SELECT * FROM subjects WHERE semester_id=? ORDER BY subject_name");
            $stmt->bind_param("i", $semester_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $subjects = [];
            while ($row = $result->fetch_assoc()) {
                $subjects[] = $row;
            }
            sendResponse(true, $subjects);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $subject_name = trim($data['subject_name'] ?? '');
        $subject_code = trim($data['subject_code'] ?? '');
        $credits = intval($data['credits'] ?? 0);
        $dept_id = intval($data['dept_id'] ?? 0);
        $semester_id = intval($data['semester_id'] ?? 0);
        
        if ($subject_name !== '' && $subject_code !== '' && $dept_id > 0 && $semester_id > 0) {
            // Check duplicate subject_code
            $check = $conn->prepare("SELECT id FROM subjects WHERE subject_code=?");
            $check->bind_param("s", $subject_code);
            $check->execute();
            $check->store_result();
            
            if ($check->num_rows > 0) {
                sendResponse(false, null, 'Subject code already exists');
            } else {
                $stmt = $conn->prepare("INSERT INTO subjects (dept_id, subject_name, subject_code, credits, semester_id) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("issii", $dept_id, $subject_name, $subject_code, $credits, $semester_id);
                if ($stmt->execute()) {
                    sendResponse(true, ['id' => $stmt->insert_id, 'subject_name' => $subject_name, 'subject_code' => $subject_code, 'credits' => $credits, 'dept_id' => $dept_id, 'semester_id' => $semester_id]);
                } else {
                    sendResponse(false, null, 'Failed to create subject');
                }
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $subject_name = trim($data['subject_name'] ?? '');
        $subject_code = trim($data['subject_code'] ?? '');
        $credits = intval($data['credits'] ?? 0);
        $dept_id = intval($data['dept_id'] ?? 0);
        $semester_id = intval($data['semester_id'] ?? 0);
        
        if ($id > 0 && $subject_name !== '' && $subject_code !== '' && $dept_id > 0 && $semester_id > 0) {
            $stmt = $conn->prepare("UPDATE subjects SET subject_name=?, subject_code=?, credits=?, dept_id=?, semester_id=? WHERE id=?");
            $stmt->bind_param("ssiiii", $subject_name, $subject_code, $credits, $dept_id, $semester_id, $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id, 'subject_name' => $subject_name, 'subject_code' => $subject_code, 'credits' => $credits, 'dept_id' => $dept_id, 'semester_id' => $semester_id]);
            } else {
                sendResponse(false, null, 'Failed to update subject');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM faculty_subjects WHERE subject_id=$id");
            $conn->query("DELETE FROM subjects WHERE id=$id");
            sendResponse(true, ['id' => $id]);
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

