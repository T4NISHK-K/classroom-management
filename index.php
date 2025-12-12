


<?php
session_start();
include "db.php";

$message = "";

// --- Helper: get constraints (slots/days) ---
$cons_res = $conn->query("SELECT num_weekdays, num_daily_slots FROM constraints ORDER BY id DESC LIMIT 1");
if($cons_res && $cons_res->num_rows){
    $cons = $cons_res->fetch_assoc();
    $NUM_DAYS = intval($cons['num_weekdays']);
    $NUM_SLOTS = intval($cons['num_daily_slots']);
} else {
    $NUM_DAYS = 5;
    $NUM_SLOTS = 6;
}
$WEEKDAYS_FULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
$WEEKDAYS = array_slice($WEEKDAYS_FULL, 0, $NUM_DAYS);

// --- Handle reset (back link) ---
if(isset($_GET['reset'])){
    header("Location: index.php");
    exit();
}

// --- Handle login submission (admin/faculty) and student flow ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --------- LOGIN (admin / faculty) ----------
    if (isset($_POST['login_submit'])) {
        $username_email = trim($_POST['username_email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $role = $_POST['role'] ?? '';

        if ($role === 'faculty') {
            $stmt = $conn->prepare(
                "SELECT f.id AS faculty_id, f.name AS faculty_name, u.username, u.role
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
                header("Location: dashboard.php");
                exit();
            } else {
                $message = "Invalid faculty credentials!";
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
                header("Location: dashboard.php");
                exit();
            } else {
                $message = "Invalid credentials or role!";
            }
        }
    }

    // --------- STUDENT FLOW ----------
    if (isset($_POST['student_dept_next'])) {
        $selected_dept = intval($_POST['department']);
    }
    if (isset($_POST['student_sem_next'])) {
        $selected_dept = intval($_POST['department']);
        $selected_sem = intval($_POST['semester']);
    }
    if (isset($_POST['student_show_tt'])) {
        $selected_dept = intval($_POST['department']);
        $selected_sem = intval($_POST['semester']);
        $selected_div = intval($_POST['division']);

        $div_info_q = $conn->query("SELECT d.name AS div_name, s.name AS sem_name, dep.name AS dept_name
                                    FROM divisions d
                                    JOIN semesters s ON d.semester_id = s.id
                                    JOIN departments dep ON s.dept_id = dep.id
                                    WHERE d.id = ".intval($selected_div)." LIMIT 1");
        $div_info = $div_info_q ? $div_info_q->fetch_assoc() : null;

        $q = $conn->query(
            "SELECT t.slot, t.day, s.subject_name, s.subject_code, f.name AS faculty_name, c.room_number
             FROM timetable t
             JOIN subjects s ON t.subject_id = s.id
             JOIN faculties f ON t.faculty_id = f.id
             JOIN classrooms c ON t.classroom_id = c.id
             WHERE t.division_id = ".intval($selected_div)."
             ORDER BY FIELD(t.day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.slot"
        );

        $tt = [];
        if($q){
            while($row = $q->fetch_assoc()){
                $slot = intval($row['slot']);
                $day = $row['day'];
                $tt[$slot][$day] = "<b>".htmlspecialchars($row['subject_code'])."</b><br>"
                                  .htmlspecialchars($row['subject_name'])."<br>"
                                  .htmlspecialchars($row['faculty_name'])."<br>"
                                  ."Rm ".htmlspecialchars($row['room_number']);
            }
        }
    }
}

// --- Fetch lists for selects ---
$departments = $conn->query("SELECT * FROM departments ORDER BY name ASC");
$semesters = [];
$divisions = [];
if(isset($selected_dept) && $selected_dept){
    $semesters = $conn->query("SELECT * FROM semesters WHERE dept_id=".intval($selected_dept)." ORDER BY id ASC");
}
if(isset($selected_sem) && $selected_sem){
    $divisions = $conn->query("SELECT * FROM divisions WHERE semester_id=".intval($selected_sem)." ORDER BY name ASC");
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Timetable Scheduler</title>
<link rel="stylesheet" href="index.css">
</head>

<body>
<div class="app">
  <div class="header-card">
    <h1>Timetable Scheduler</h1>
  </div>

  <div class="container">
    <div class="grid">

      <!-- Left: Login -->
      <div>
        <div class="box">
          <h3>Login (Admin / Faculty)</h3>
          <?php if($message): ?><div class="note" style="color:#c0392b;margin-bottom:10px;"><?php echo htmlspecialchars($message); ?></div><?php endif; ?>
          <form method="post" autocomplete="off">
            <div class="form-row">
              <label class="small">Username or Email</label>
              <input type="text" name="username_email" placeholder="username or email">
            </div>
            <div class="form-row">
              <label class="small">Password</label>
              <input type="password" name="password" placeholder="password">
            </div>
            <div class="form-row">
              <label class="small">Role</label>
              <div class="roles">
                <label><input type="radio" name="role" value="admin"> Admin</label>
                <label><input type="radio" name="role" value="faculty"> Faculty</label>
              </div>
            </div>
            <div class="form-row">
              <button type="submit" name="login_submit" class="primary">Login</button>
            </div>
            <div class="note center">Or, view timetable as student on the right.</div>
          </form>
        </div>
        <div class="box" style="margin-top:12px;">
          <a class="back" href="dashboard.php">Open Dashboard (if logged in)</a>
        </div>
      </div>

      <!-- Right: Student timetable -->
      <div>
        <div class="box">
          <?php if(isset($selected_div) && !empty($tt)): ?>
            <div class="summary">
              <?php if(!empty($div_info)): ?>
                <strong>Showing:</strong>
                <?= htmlspecialchars($div_info['dept_name'] ?? '') ?> —
                <?= htmlspecialchars($div_info['sem_name'] ?? '') ?> —
                Division <?= htmlspecialchars($div_info['div_name'] ?? '') ?>
              <?php endif; ?>
            </div>

            <div class="table-wrap">
              <table class="tt" aria-label="Timetable">
                <thead>
                  <tr>
                    <th>Slot</th>
                    <?php foreach($WEEKDAYS as $wd) echo "<th>".htmlspecialchars($wd)."</th>"; ?>
                  </tr>
                </thead>
                <tbody>
                  <?php
                  for($slot=1; $slot<=$NUM_SLOTS; $slot++){
                    echo "<tr><td><strong>Slot $slot</strong></td>";
                    foreach($WEEKDAYS as $wd){
                      echo "<td>";
                      echo $tt[$slot][$wd] ?? "<span class='empty'>—</span>";
                      echo "</td>";
                    }
                    echo "</tr>";
                  }
                  ?>
                </tbody>
              </table>
            </div>
            <a class="back" href="index.php?reset=1">&larr; Back / Change selection</a>

          <?php elseif(isset($selected_div) && empty($tt)): ?>
            <div class="note" style="margin-top:12px;color:#555;">No timetable entries found for this division.</div>
            <a class="back" href="index.php?reset=1">&larr; Back / Change selection</a>

          <?php else: ?>
            <!-- Show student selection form only if timetable not selected -->
            <h3>Select Department → Semester → Division</h3>
            <form method="post" id="studentForm">
              <input type="hidden" name="student_flow" value="1">
              <div class="form-row">
                <label class="small">Department</label>
                <select name="department" onchange="document.getElementById('deptBtn').click()">
                  <option value="">Select Department</option>
                  <?php if($departments) { $departments->data_seek(0); while($d = $departments->fetch_assoc()){ 
                      $sel = (isset($selected_dept) && $selected_dept == $d['id']) ? 'selected' : '';
                      echo "<option value=\"".intval($d['id'])."\" $sel>".htmlspecialchars($d['name'])."</option>";
                  }} ?>
                </select>
                <button type="submit" name="student_dept_next" id="deptBtn" style="display:none;">Next</button>
              </div>

              <?php if(isset($selected_dept) && $selected_dept): ?>
              <div class="form-row">
                <label class="small">Semester</label>
                <select name="semester" onchange="document.getElementById('semBtn').click()">
                  <option value="">Select Semester</option>
                  <?php if($semesters){$semesters->data_seek(0);while($s = $semesters->fetch_assoc()){
                    $sel = (isset($selected_sem) && $selected_sem == $s['id']) ? 'selected' : '';
                    echo "<option value=\"".intval($s['id'])."\" $sel>".htmlspecialchars($s['name'].' ('.$s['type'].')')."</option>";
                  }} ?>
                </select>
                <button type="submit" name="student_sem_next" id="semBtn" style="display:none;">Next</button>
              </div>
              <?php endif; ?>

              <?php if(isset($selected_sem) && $selected_sem): ?>
              <div class="form-row">
                <label class="small">Division</label>
                <select name="division" required>
                  <option value="">Select Division</option>
                  <?php if($divisions){$divisions->data_seek(0);while($dv = $divisions->fetch_assoc()){
                    $sel = (isset($selected_div) && $selected_div == $dv['id']) ? 'selected' : '';
                    echo "<option value=\"".intval($dv['id'])."\" $sel>".htmlspecialchars($dv['name'])."</option>";
                  }} ?>
                </select>
              </div>
              <div class="form-row">
                <button type="submit" name="student_show_tt" class="primary">Show Timetable</button>
              </div>
              <?php endif; ?>
            </form>
          <?php endif; ?>
        </div>
      </div>

    </div>
  </div>
</div>
</body>
</html>
