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
            $result = $conn->query("SELECT c.*, d.name AS dept_name 
                                   FROM classrooms c 
                                   JOIN departments d ON c.dept_id=d.id 
                                   ORDER BY d.name, c.room_number");
            $classrooms = [];
            while ($row = $result->fetch_assoc()) {
                $classrooms[] = $row;
            }
            sendResponse(true, $classrooms);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT c.*, d.name AS dept_name 
                                   FROM classrooms c 
                                   JOIN departments d ON c.dept_id=d.id 
                                   WHERE c.id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                sendResponse(false, null, 'Classroom not found');
            }
        } elseif ($action === 'by_dept' && isset($_GET['dept_id'])) {
            $dept_id = intval($_GET['dept_id']);
            $type = $_GET['type'] ?? '';
            if ($type) {
                $stmt = $conn->prepare("SELECT * FROM classrooms WHERE dept_id=? AND type=? ORDER BY room_number ASC");
                $stmt->bind_param("is", $dept_id, $type);
            } else {
                $stmt = $conn->prepare("SELECT * FROM classrooms WHERE dept_id=? ORDER BY room_number ASC");
                $stmt->bind_param("i", $dept_id);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            $classrooms = [];
            while ($row = $result->fetch_assoc()) {
                $classrooms[] = $row;
            }
            sendResponse(true, $classrooms);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $room_number = trim($data['room_number'] ?? '');
        $dept_id = intval($data['dept_id'] ?? 0);
        $type = $data['type'] ?? '';
        $capacity = intval($data['capacity'] ?? 0);
        
        if ($room_number !== '' && $dept_id > 0 && ($type === 'Classroom' || $type === 'Lab') && $capacity > 0) {
            $stmt = $conn->prepare("INSERT INTO classrooms (room_number, dept_id, type, capacity) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("sisi", $room_number, $dept_id, $type, $capacity);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $stmt->insert_id, 'room_number' => $room_number, 'dept_id' => $dept_id, 'type' => $type, 'capacity' => $capacity]);
            } else {
                sendResponse(false, null, 'Failed to create classroom');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $room_number = trim($data['room_number'] ?? '');
        $dept_id = intval($data['dept_id'] ?? 0);
        $type = $data['type'] ?? '';
        $capacity = intval($data['capacity'] ?? 0);
        
        if ($id > 0 && $room_number !== '' && $dept_id > 0 && ($type === 'Classroom' || $type === 'Lab') && $capacity > 0) {
            $stmt = $conn->prepare("UPDATE classrooms SET room_number=?, dept_id=?, type=?, capacity=? WHERE id=?");
            $stmt->bind_param("sisii", $room_number, $dept_id, $type, $capacity, $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id, 'room_number' => $room_number, 'dept_id' => $dept_id, 'type' => $type, 'capacity' => $capacity]);
            } else {
                sendResponse(false, null, 'Failed to update classroom');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM classrooms WHERE id=$id");
            sendResponse(true, ['id' => $id]);
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

