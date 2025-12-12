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
            $result = $conn->query("SELECT * FROM constraints ORDER BY id DESC");
            $constraints = [];
            while ($row = $result->fetch_assoc()) {
                $constraints[] = $row;
            }
            sendResponse(true, $constraints);
        } elseif ($action === 'get' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM constraints WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                sendResponse(false, null, 'Constraint not found');
            }
        } elseif ($action === 'latest') {
            // Get latest constraint (most commonly used)
            $result = $conn->query("SELECT * FROM constraints ORDER BY id DESC LIMIT 1");
            if ($result->num_rows > 0) {
                sendResponse(true, $result->fetch_assoc());
            } else {
                // Return defaults if no constraints exist
                sendResponse(true, [
                    'num_weekdays' => 5,
                    'num_daily_slots' => 6,
                    'lab_slot_length' => 2
                ]);
            }
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        $num_weekdays = intval($data['num_weekdays'] ?? 5);
        $num_daily_slots = intval($data['num_daily_slots'] ?? 6);
        $lab_slot_length = intval($data['lab_slot_length'] ?? 2);
        
        if ($num_weekdays >= 5 && $num_weekdays <= 6 && $num_daily_slots > 0 && $lab_slot_length > 0) {
            $stmt = $conn->prepare("INSERT INTO constraints (num_weekdays, num_daily_slots, lab_slot_length) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $num_weekdays, $num_daily_slots, $lab_slot_length);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $stmt->insert_id, 'num_weekdays' => $num_weekdays, 'num_daily_slots' => $num_daily_slots, 'lab_slot_length' => $lab_slot_length]);
            } else {
                sendResponse(false, null, 'Failed to create constraint');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'PUT':
        $data = getJsonInput();
        $id = intval($data['id'] ?? 0);
        $num_weekdays = intval($data['num_weekdays'] ?? 5);
        $num_daily_slots = intval($data['num_daily_slots'] ?? 6);
        $lab_slot_length = intval($data['lab_slot_length'] ?? 2);
        
        if ($id > 0 && $num_weekdays >= 5 && $num_weekdays <= 6 && $num_daily_slots > 0 && $lab_slot_length > 0) {
            $stmt = $conn->prepare("UPDATE constraints SET num_weekdays=?, num_daily_slots=?, lab_slot_length=? WHERE id=?");
            $stmt->bind_param("iiii", $num_weekdays, $num_daily_slots, $lab_slot_length, $id);
            if ($stmt->execute()) {
                sendResponse(true, ['id' => $id, 'num_weekdays' => $num_weekdays, 'num_daily_slots' => $num_daily_slots, 'lab_slot_length' => $lab_slot_length]);
            } else {
                sendResponse(false, null, 'Failed to update constraint');
            }
        } else {
            sendResponse(false, null, 'Invalid data');
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id > 0) {
            $conn->query("DELETE FROM constraints WHERE id=$id");
            sendResponse(true, ['id' => $id]);
        } else {
            sendResponse(false, null, 'Invalid ID');
        }
        break;
}

