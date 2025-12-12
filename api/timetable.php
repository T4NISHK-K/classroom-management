<?php
require_once 'config.php';

// Check authentication
if (!isset($_SESSION['username'])) {
    sendResponse(false, null, 'Unauthorized');
}

// Helper functions (same as dashboard.php)
function load_constraints($conn) {
    $defaults = ['num_daily_slots' => 6, 'num_weekdays' => 5, 'lab_slot_length' => 2];
    $res = $conn->query("SELECT * FROM constraints ORDER BY id DESC LIMIT 1");
    if ($res && $res->num_rows > 0) {
        $c = $res->fetch_assoc();
        return [
            'num_daily_slots' => intval($c['num_daily_slots']),
            'num_weekdays' => intval($c['num_weekdays']),
            'lab_slot_length' => intval($c['lab_slot_length'])
        ];
    }
    return $defaults;
}

function is_lab_subject($name, $code) {
    $s = strtolower($name . ' ' . $code);
    return (strpos($s, 'lab') !== false);
}

function is_faculty_free($conn, $fid, $day, $slot) {
    $q = $conn->query("SELECT 1 FROM timetable WHERE faculty_id=$fid AND day='$day' AND slot=$slot LIMIT 1");
    return ($q->num_rows == 0);
}

function is_room_free($conn, $rid, $day, $slot) {
    $q = $conn->query("SELECT 1 FROM timetable WHERE classroom_id=$rid AND day='$day' AND slot=$slot LIMIT 1");
    return ($q->num_rows == 0);
}

function is_division_free($conn, $divid, $day, $slot) {
    $q = $conn->query("SELECT 1 FROM timetable WHERE division_id=$divid AND day='$day' AND slot=$slot LIMIT 1");
    return ($q->num_rows == 0);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'list') {
            $division_id = isset($_GET['division_id']) ? intval($_GET['division_id']) : 0;
            
            if ($division_id > 0) {
                $result = $conn->query("
                    SELECT t.*, 
                           sub.subject_code, sub.subject_name,
                           f.name AS faculty_name,
                           c.room_number,
                           d.name AS division_name,
                           s.name AS sem_name,
                           dept.name AS dept_name
                    FROM timetable t
                    JOIN subjects sub ON t.subject_id=sub.id
                    JOIN faculties f ON t.faculty_id=f.id
                    JOIN classrooms c ON t.classroom_id=c.id
                    JOIN divisions d ON t.division_id=d.id
                    JOIN semesters s ON d.semester_id=s.id
                    JOIN departments dept ON s.dept_id=dept.id
                    WHERE t.division_id=$division_id
                    ORDER BY t.day, t.slot
                ");
            } else {
                $result = $conn->query("
                    SELECT t.*, 
                           sub.subject_code, sub.subject_name,
                           f.name AS faculty_name,
                           c.room_number,
                           d.name AS division_name,
                           s.name AS sem_name,
                           dept.name AS dept_name
                    FROM timetable t
                    JOIN subjects sub ON t.subject_id=sub.id
                    JOIN faculties f ON t.faculty_id=f.id
                    JOIN classrooms c ON t.classroom_id=c.id
                    JOIN divisions d ON t.division_id=d.id
                    JOIN semesters s ON d.semester_id=s.id
                    JOIN departments dept ON s.dept_id=dept.id
                    ORDER BY dept.name, s.id, d.name, t.day, t.slot
                ");
            }
            
            $timetable = [];
            while ($row = $result->fetch_assoc()) {
                $timetable[] = $row;
            }
            sendResponse(true, $timetable);
        } elseif ($action === 'by_division' && isset($_GET['division_id'])) {
            $division_id = intval($_GET['division_id']);
            $cons = load_constraints($conn);
            $maxSlots = $cons['num_daily_slots'];
            $days = array_slice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 0, $cons['num_weekdays']);
            
            $result = $conn->query("
                SELECT t.day, t.slot, 
                       sub.subject_code, sub.subject_name,
                       f.name AS faculty_name,
                       c.room_number
                FROM timetable t
                JOIN subjects sub ON t.subject_id=sub.id
                JOIN faculties f ON t.faculty_id=f.id
                JOIN classrooms c ON t.classroom_id=c.id
                WHERE t.division_id=$division_id
                ORDER BY t.day, t.slot
            ");
            
            $schedule = [];
            while ($row = $result->fetch_assoc()) {
                $schedule[$row['slot']][$row['day']] = $row;
            }
            
            sendResponse(true, [
                'schedule' => $schedule,
                'days' => $days,
                'maxSlots' => $maxSlots
            ]);
        } elseif ($action === 'by_faculty' && isset($_GET['faculty_id'])) {
            $faculty_id = intval($_GET['faculty_id']);
            $result = $conn->query("
                SELECT t.*, 
                       sub.subject_code, sub.subject_name,
                       c.room_number,
                       d.name AS division_name
                FROM timetable t
                JOIN subjects sub ON t.subject_id=sub.id
                JOIN classrooms c ON t.classroom_id=c.id
                JOIN divisions d ON t.division_id=d.id
                WHERE t.faculty_id=$faculty_id
                ORDER BY t.day, t.slot
            ");
            
            $timetable = [];
            while ($row = $result->fetch_assoc()) {
                $timetable[] = $row;
            }
            sendResponse(true, $timetable);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'POST':
        if ($action === 'generate') {
            // Only admin can generate
            if ($_SESSION['role'] !== 'admin') {
                sendResponse(false, null, 'Unauthorized');
            }
            
            $conn->query("DELETE FROM timetable");
            $cons = load_constraints($conn);
            $maxSlots = $cons['num_daily_slots'];
            $numDays = $cons['num_weekdays'];
            $labLen = $cons['lab_slot_length'];
            
            $dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $days = array_slice($dayNames, 0, $numDays);
            
            $divs = $conn->query("SELECT d.*, s.dept_id, s.name AS sem_name 
                                 FROM divisions d 
                                 JOIN semesters s ON d.semester_id=s.id
                                 ORDER BY s.dept_id, s.semester_no, d.name");
            
            $generated = 0;
            $errors = [];
            
            while ($dv = $divs->fetch_assoc()) {
                $divId = intval($dv['id']);
                $semId = intval($dv['semester_id']);
                $deptId = intval($dv['dept_id']);
                $size = intval($dv['num_students']);
                
                // subjects for this semester
                $subs = $conn->query("SELECT * FROM subjects WHERE semester_id=$semId");
                $reqs = [];
                $totalCredits = 0;
                
                while ($s = $subs->fetch_assoc()) {
                    $sid = intval($s['id']);
                    $credits = max(1, intval($s['credits']));
                    $totalCredits += $credits;
                    
                    if (is_lab_subject($s['subject_name'], $s['subject_code'])) {
                        $blocks = ceil($credits / $labLen);
                        for ($i = 0; $i < $blocks; $i++) {
                            $reqs[] = ['sub' => $sid, 'len' => $labLen, 'lab' => true];
                        }
                    } else {
                        for ($i = 0; $i < $credits; $i++) {
                            $reqs[] = ['sub' => $sid, 'len' => 1, 'lab' => false];
                        }
                    }
                }
                
                shuffle($reqs);
                
                // calculate daily load target
                $avgPerDay = ceil($totalCredits / $numDays);
                $dayLoad = array_fill_keys($days, 0);
                
                // place subjects
                foreach ($reqs as $r) {
                    $sid = $r['sub'];
                    $len = $r['len'];
                    $isLab = $r['lab'];
                    
                    // faculties
                    $facRes = $conn->query("SELECT f.id, f.name FROM faculty_subjects fs 
                                           JOIN faculties f ON fs.faculty_id=f.id
                                           WHERE fs.subject_id=$sid");
                    $faculties = [];
                    while ($f = $facRes->fetch_assoc()) $faculties[] = $f;
                    if (empty($faculties)) continue;
                    
                    // classrooms
                    $type = $isLab ? 'Lab' : 'Classroom';
                    $roomRes = $conn->query("SELECT * FROM classrooms 
                                            WHERE dept_id=$deptId AND type='$type' AND capacity>=$size
                                            ORDER BY capacity ASC");
                    $rooms = [];
                    while ($rm = $roomRes->fetch_assoc()) $rooms[] = $rm;
                    if (empty($rooms)) continue;
                    
                    // try to place
                    $placed = false;
                    $dayTry = $days;
                    shuffle($dayTry);
                    foreach ($dayTry as $day) {
                        if ($dayLoad[$day] + $len > $avgPerDay + 1) continue;
                        
                        $startSlots = range(1, $maxSlots - $len + 1);
                        shuffle($startSlots);
                        foreach ($startSlots as $st) {
                            $block = range($st, $st + $len - 1);
                            
                            // check division free
                            $ok = true;
                            foreach ($block as $sl) {
                                if (!is_division_free($conn, $divId, $day, $sl)) {
                                    $ok = false;
                                    break;
                                }
                            }
                            if (!$ok) continue;
                            
                            // faculty with least load
                            $bestF = null;
                            $minLoad = 9999;
                            foreach ($faculties as $fc) {
                                $fid = $fc['id'];
                                $wk = $conn->query("SELECT COUNT(*) c FROM timetable WHERE faculty_id=$fid")->fetch_assoc()['c'];
                                if ($wk < $minLoad) {
                                    $free = true;
                                    foreach ($block as $sl) {
                                        if (!is_faculty_free($conn, $fid, $day, $sl)) {
                                            $free = false;
                                            break;
                                        }
                                    }
                                    if ($free) {
                                        $minLoad = $wk;
                                        $bestF = $fid;
                                    }
                                }
                            }
                            if (!$bestF) continue;
                            
                            // room
                            $chosenRoom = null;
                            foreach ($rooms as $rm) {
                                $rid = $rm['id'];
                                $free = true;
                                foreach ($block as $sl) {
                                    if (!is_room_free($conn, $rid, $day, $sl)) {
                                        $free = false;
                                        break;
                                    }
                                }
                                if ($free) {
                                    $chosenRoom = $rid;
                                    break;
                                }
                            }
                            if (!$chosenRoom) continue;
                            
                            // assign
                            foreach ($block as $sl) {
                                $conn->query("INSERT INTO timetable(division_id,day,slot,subject_id,faculty_id,classroom_id)
                                            VALUES($divId,'$day',$sl,$sid,$bestF,$chosenRoom)");
                            }
                            $dayLoad[$day] += $len;
                            $placed = true;
                            $generated++;
                            break;
                        }
                        if ($placed) break;
                    }
                }
            }
            
            sendResponse(true, ['generated' => $generated, 'message' => 'Timetable generated successfully']);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
        
    case 'DELETE':
        if ($_SESSION['role'] !== 'admin') {
            sendResponse(false, null, 'Unauthorized');
        }
        
        if ($action === 'reset') {
            $conn->query("DELETE FROM timetable");
            sendResponse(true, ['message' => 'Timetable reset successfully']);
        } else {
            sendResponse(false, null, 'Invalid action');
        }
        break;
}

