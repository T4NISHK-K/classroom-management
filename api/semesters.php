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
            $result = $conn->query("SELECT s.*, d.name AS dept_name 
                                   FROM semesters s 
                                   JOIN departments d ON s.dept_id=d.id 
                                   ORDER BY d.name, s.id");
            $semesters = [];
            while ($row = $result->fetch_assoc()) {
                $semesters[] = $row;
            }
            sendResponse(true, $semesters);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT s.*, d.name AS dept_name 
                                   FROM semesters s 
                                   JOIN departments d ON s.dept_id=d.id 
                                   WHERE s.id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                sendResponse(false, null, 'Semester not found');
            }
        } elseif ($action === 'by_dept' && isset($_GET['dept_id'])) {
            $dept_id = intval($_GET['dept_id']);
            $stmt = $conn->prepare("SELECT * FROM semesters WHERE dept_id=? ORDER BY id ASC");
            $stmt->bind_param("i", $dept_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $semesters = [];
            while ($row = $result->fetch_assoc()) {
                $semesters[] = $row;
            }
            sendResponse(true, $semesters);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $dept_id = intval($data['dept_id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $type = $data['type'] ?? '';
        
        if ($dept_id > 0 && $name !== '' && ($type === 'Odd' || $type === 'Even')) {
            $stmt = $conn->prepare("INSERT INTO semesters (dept_id, name, type) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $dept_id, $name, $type);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $stmt->insert_id, 'dept_id' => $dept_id, 'name' => $name, 'type' => $type]);
            } else {
                sendResponse(false, null, 'Failed to create semester');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $dept_id = intval($data['dept_id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $type = $data['type'] ?? '';
        
        if ($id > 0 && $dept_id > 0 && $name !== '' && ($type === 'Odd' || $type === 'Even')) {
            $stmt = $conn->prepare("UPDATE semesters SET dept_id=?, name=?, type=? WHERE id=?");
            $stmt->bind_param("issi", $dept_id, $name, $type, $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id, 'dept_id' => $dept_id, 'name' => $name, 'type' => $type]);
            } else {
                sendResponse(false, null, 'Failed to update semester');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM semesters WHERE id=$id");
            sendResponse(true, ['id' => $id]);
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

