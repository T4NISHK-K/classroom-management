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
            $result = $conn->query("SELECT * FROM departments ORDER BY id DESC");
            $departments = [];
            while ($row = $result->fetch_assoc()) {
                $departments[] = $row;
            }
            sendResponse(true, $departments);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM departments WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                sendResponse(false, null, 'Department not found');
            }
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $name = trim($data['name'] ?? '');
        
        if ($name !== '') {
            $stmt = $conn->prepare("INSERT INTO departments (name) VALUES (?)");
            $stmt->bind_param("s", $name);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $stmt->insert_id, 'name' => $name]);
            } else {
                sendResponse(false, null, 'Failed to create department');
            }
        } else {
            sendResponse(false, null, 'Name required');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        
        if ($id > 0 && $name !== '') {
            $stmt = $conn->prepare("UPDATE departments SET name=? WHERE id=?");
            $stmt->bind_param("si", $name, $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id, 'name' => $name]);
            } else {
                sendResponse(false, null, 'Failed to update department');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $stmt = $conn->prepare("DELETE FROM departments WHERE id=?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id]);
            } else {
                sendResponse(false, null, 'Failed to delete department');
            }
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

