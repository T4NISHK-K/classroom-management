-- --------------------------------------------------
-- Database: timetable_scheduler
-- --------------------------------------------------
CREATE DATABASE IF NOT EXISTS timetable_scheduler;
USE timetable_scheduler;

-- --------------------------------------------------
-- Table: users
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','faculty','student') NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample users
INSERT INTO users (username, password, role, email) VALUES
('admin','admin123','admin','admin@univ.com'),
('profA','prof123','faculty','profA@univ.com'),
('student1','stud123','student','student1@univ.com');

-- --------------------------------------------------
-- Table: departments
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --------------------------------------------------
-- Table: semesters
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_id INT NOT NULL,
    semester_no INT NOT NULL DEFAULT 0,
    name VARCHAR(50) NOT NULL,
    type ENUM('Odd','Even') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- --------------------------------------------------
-- Table: divisions
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS divisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    num_students INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
);

-- --------------------------------------------------
-- Table: classrooms
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS classrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    dept_id INT NOT NULL,
    type ENUM('Classroom','Lab') NOT NULL,
    capacity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- --------------------------------------------------
-- Table: subjects
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    credits INT DEFAULT 3,
    semester_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
);

-- --------------------------------------------------
-- Table: faculties
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS faculties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    dept_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------
-- Table: faculty_subjects (many-to-many relation)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY(faculty_id, subject_id)
);

-- --------------------------------------------------
-- Table: constraints
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS constraints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    num_weekdays INT NOT NULL DEFAULT 5,
    num_daily_slots INT NOT NULL DEFAULT 6,
    lab_slot_length INT NOT NULL DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --------------------------------------------------
-- Table: timetable
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    division_id INT NOT NULL,
    day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
    slot INT NOT NULL,
    subject_id INT NOT NULL,
    faculty_id INT NOT NULL,
    classroom_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_slot (division_id, day, slot)
);

-- --------------------------------------------------
-- DEMO DATA
-- --------------------------------------------------

-- Departments
INSERT INTO departments (name) VALUES
('CSE'),
('ECE');

-- Semesters
INSERT INTO semesters (dept_id, semester_no, name, type) VALUES
(1, 1, 'CSE Sem 1', 'Odd'),
(1, 3, 'CSE Sem 3', 'Odd'),
(2, 1, 'ECE Sem 1', 'Odd'),
(2, 3, 'ECE Sem 3', 'Odd');

-- Divisions
INSERT INTO divisions (semester_id, name, num_students) VALUES
(1, 'A', 40),
(2, 'A', 35),
(3, 'A', 30),
(4, 'A', 32);

-- Classrooms
INSERT INTO classrooms (room_number, dept_id, type, capacity) VALUES
('CSE-101', 1, 'Classroom', 50),
('CSE-LAB1', 1, 'Lab', 40),
('ECE-201', 2, 'Classroom', 40),
('ECE-LAB1', 2, 'Lab', 35);

-- Subjects
INSERT INTO subjects (dept_id, subject_name, subject_code, credits, semester_id) VALUES
-- CSE Sem 1
(1, 'Programming Basics', 'CSE101', 4, 1),
(1, 'Mathematics I', 'MTH101', 3, 1),
(1, 'Physics Lab', 'PHY1LAB', 2, 1),
-- CSE Sem 3
(1, 'Data Structures', 'CSE201', 4, 2),
(1, 'Digital Logic', 'CSE202', 3, 2),
(1, 'DS Lab', 'CSE2LAB', 2, 2),
-- ECE Sem 1
(2, 'Basic Electronics', 'ECE101', 3, 3),
(2, 'Maths I', 'MTH103', 3, 3),
(2, 'Electronics Lab', 'ECE1LAB', 2, 3),
-- ECE Sem 3
(2, 'Signals & Systems', 'ECE201', 4, 4),
(2, 'Circuits', 'ECE202', 3, 4),
(2, 'Circuits Lab', 'ECE2LAB', 2, 4);

-- Faculties with Users
-- First insert user accounts
INSERT INTO users (username, password, role, email) VALUES
('sharma', 'sharma123', 'faculty', 'sharma@univ.com'),
('mehta', 'mehta123', 'faculty', 'mehta@univ.com'),
('reddy', 'reddy123', 'faculty', 'reddy@univ.com'),
('rao', 'rao123', 'faculty', 'rao@univ.com');

-- Then link in faculties table
INSERT INTO faculties (name, email, phone, dept_id, user_id) VALUES
('Dr. Sharma', 'sharma@univ.com', '9991110001', 1, (SELECT id FROM users WHERE username='sharma')),
('Prof. Mehta', 'mehta@univ.com', '9991110002', 1, (SELECT id FROM users WHERE username='mehta')),
('Dr. Reddy', 'reddy@univ.com', '9991110003', 2, (SELECT id FROM users WHERE username='reddy')),
('Prof. Rao', 'rao@univ.com', '9991110004', 2, (SELECT id FROM users WHERE username='rao'));

-- Faculty to Subject Mapping
INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES
-- CSE
((SELECT id FROM faculties WHERE name='Dr. Sharma'), 1),
((SELECT id FROM faculties WHERE name='Prof. Mehta'), 2),
((SELECT id FROM faculties WHERE name='Dr. Sharma'), 3),
((SELECT id FROM faculties WHERE name='Dr. Sharma'), 4),
((SELECT id FROM faculties WHERE name='Prof. Mehta'), 5),
((SELECT id FROM faculties WHERE name='Prof. Mehta'), 6),
-- ECE
((SELECT id FROM faculties WHERE name='Dr. Reddy'), 7),
((SELECT id FROM faculties WHERE name='Prof. Rao'), 8),
((SELECT id FROM faculties WHERE name='Dr. Reddy'), 9),
((SELECT id FROM faculties WHERE name='Prof. Rao'), 10),
((SELECT id FROM faculties WHERE name='Dr. Reddy'), 11),
((SELECT id FROM faculties WHERE name='Prof. Rao'), 12);

-- Constraints
INSERT INTO constraints (num_weekdays, num_daily_slots, lab_slot_length) VALUES
(5, 6, 2);
