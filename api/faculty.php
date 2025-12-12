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
            $filter_dept = isset($_GET['filter_dept']) ? intval($_GET['filter_dept']) : 0;
            $filter_sem = isset($_GET['filter_sem']) ? intval($_GET['filter_sem']) : 0;
            $filter_subject = isset($_GET['filter_subject']) ? intval($_GET['filter_subject']) : 0;
            
            $where = [];
            if ($filter_dept > 0) $where[] = "f.dept_id=$filter_dept";
            if ($filter_sem > 0) $where[] = "s.semester_id=$filter_sem";
            if ($filter_subject > 0) $where[] = "fs.subject_id=$filter_subject";
            $where_sql = (count($where) > 0) ? "WHERE " . implode(" AND ", $where) : "";
            
            $result = $conn->query("
                SELECT f.*, d.name AS dept_name, GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subjects
                FROM faculties f
                JOIN departments d ON f.dept_id=d.id
                LEFT JOIN faculty_subjects fs ON f.id=fs.faculty_id
                LEFT JOIN subjects s ON fs.subject_id=s.id
                $where_sql
                GROUP BY f.id
                ORDER BY d.name, f.name
            ");
            
            $faculties = [];
            while ($row = $result->fetch_assoc()) {
                $faculties[] = $row;
            }
            sendResponse(true, $faculties);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT f.*, d.name AS dept_name 
                                   FROM faculties f 
                                   JOIN departments d ON f.dept_id=d.id 
                                   WHERE f.id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $faculty = $result->fetch_assoc();
                // Get assigned subjects
                $subjects_result = $conn->query("SELECT subject_id FROM faculty_subjects WHERE faculty_id=$id");
                $faculty['subject_ids'] = [];
                while ($sub = $subjects_result->fetch_assoc()) {
                    $faculty['subject_ids'][] = $sub['subject_id'];
                }
                sendResponse(true, $faculty);
            } else {
                sendResponse(false, null, 'Faculty not found');
            }
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $dept_id = intval($data['dept_id'] ?? 0);
        $subject_ids = $data['subject_ids'] ?? [];
        
        if ($name !== '' && $dept_id > 0) {
            // Insert faculty
            $stmt = $conn->prepare("INSERT INTO faculties (name, email, phone, dept_id) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("sssi", $name, $email, $phone, $dept_id);
            if ($stmt->execute()) {
                $faculty_id = $stmt->insert_id;
                
                // Assign subjects
                foreach ($subject_ids as $sub_id) {
                    $sub_id = intval($sub_id);
                    $conn->query("INSERT IGNORE INTO faculty_subjects (faculty_id, subject_id) VALUES ($faculty_id, $sub_id)");
                }
                
                // Create login user if email provided
                if ($email !== '') {
                    $username = explode('@', $email)[0];
                    $default_password = 'faculty123';
                    $role = "faculty";
                    $stmt2 = $conn->prepare("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)");
                    $stmt2->bind_param("ssss", $username, $default_password, $role, $email);
                    $stmt2->execute();
                }
                
                sendResponse(true, ['id' => $faculty_id, 'name' => $name, 'email' => $email, 'phone' => $phone, 'dept_id' => $dept_id]);
            } else {
                sendResponse(false, null, 'Failed to create faculty');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $dept_id = intval($data['dept_id'] ?? 0);
        $subject_ids = $data['subject_ids'] ?? [];
        
        if ($id > 0 && $name !== '' && $dept_id > 0) {
            $stmt = $conn->prepare("UPDATE faculties SET name=?, email=?, phone=?, dept_id=? WHERE id=?");
            $stmt->bind_param("sssii", $name, $email, $phone, $dept_id, $id);
            if ($stmt->execute()) {
                // Update subjects
                $conn->query("DELETE FROM faculty_subjects WHERE faculty_id=$id");
                foreach ($subject_ids as $sub_id) {
                    $sub_id = intval($sub_id);
                    $conn->query("INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES ($id, $sub_id)");
                }
                sendResponse(true, ['id' => $id, 'name' => $name, 'email' => $email, 'phone' => $phone, 'dept_id' => $dept_id]);
            } else {
                sendResponse(false, null, 'Failed to update faculty');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM faculty_subjects WHERE faculty_id=$id");
            $conn->query("DELETE FROM faculties WHERE id=$id");
            sendResponse(true, ['id' => $id]);
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

