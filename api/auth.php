<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = getJsonInput();
        $username_email = trim($data['username_email'] ?? '');
        $password = trim($data['password'] ?? '');
        $role = $data['role'] ?? '';

        if ($role === 'faculty') {
            $stmt = $conn->prepare(
                "SELECT f.id AS faculty_id, f.name AS faculty_name, u.username, u.role, u.email
                 FROM faculties f
                 JOIN users u ON f.user_id = u.id
                 WHERE (u.username=? OR u.email=?) AND u.password=? AND u.role='faculty' LIMIT 1"
            );
            $stmt->bind_param("sss", $username_email, $username_email, $password);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result && $result->num_rows === 1) {
                $user = $result->fetch_assoc();
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = 'faculty';
                $_SESSION['faculty_id'] = $user['faculty_id'];
                $_SESSION['faculty_name'] = $user['faculty_name'];
                sendResponse(true, [
                    'username' => $user['username'],
                    'role' => 'faculty',
                    'faculty_id' => $user['faculty_id'],
                    'faculty_name' => $user['faculty_name']
                ]);
            } else {
                sendResponse(false, null, 'Invalid faculty credentials');
            }
        } else {
            $stmt = $conn->prepare(
                "SELECT id, username, role FROM users
                 WHERE (username=? OR email=?) AND password=? AND role=? LIMIT 1"
            );
            $stmt->bind_param("ssss", $username_email, $username_email, $password, $role);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result && $result->num_rows === 1) {
                $user = $result->fetch_assoc();
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = 'admin';
                sendResponse(true, [
                    'username' => $user['username'],
                    'role' => 'admin'
                ]);
            } else {
                sendResponse(false, null, 'Invalid credentials or role');
            }
        }
        break;

    case 'GET':
        if (isset($_GET['check'])) {
            if (isset($_SESSION['username']) && isset($_SESSION['role'])) {
                $response = [
                    'authenticated' => true,
                    'username' => $_SESSION['username'],
                    'role' => $_SESSION['role']
                ];
                if (isset($_SESSION['faculty_id'])) {
                    $response['faculty_id'] = $_SESSION['faculty_id'];
                    $response['faculty_name'] = $_SESSION['faculty_name'];
                }
                sendResponse(true, $response);
            } else {
                sendResponse(false, ['authenticated' => false]);
            }
        }
        break;

    case 'DELETE':
        session_destroy();
        sendResponse(true, ['message' => 'Logged out']);
        break;
}

