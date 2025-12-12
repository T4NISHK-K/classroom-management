# Backend-Frontend Integration Guide

## Overview
This guide explains how the PHP backend has been connected to the React (shadcn-ui) frontend while preserving all backend functionality.

## Architecture

### Backend (PHP)
- **Location**: `/api/` folder
- **Technology**: PHP with MySQLi
- **Authentication**: Session-based
- **Endpoints**: RESTful API endpoints for all CRUD operations

### Frontend (React)
- **Location**: `/shadcn-ui/` folder
- **Technology**: React + TypeScript + shadcn-ui components
- **State Management**: Zustand + React Query
- **API Client**: Custom API service layer (`src/lib/api.ts`)

## API Endpoints Created

### Authentication
- `POST /api/auth.php` - Login
- `GET /api/auth.php?check=1` - Check authentication status
- `DELETE /api/auth.php` - Logout

### Departments
- `GET /api/departments.php?action=list` - List all departments
- `GET /api/departments.php?action=get&id={id}` - Get single department
- `POST /api/departments.php` - Create department
- `PUT /api/departments.php` - Update department
- `DELETE /api/departments.php?id={id}` - Delete department

### Semesters
- `GET /api/semesters.php?action=list` - List all semesters
- `GET /api/semesters.php?action=by_dept&dept_id={id}` - Get semesters by department
- `POST /api/semesters.php` - Create semester
- `PUT /api/semesters.php` - Update semester
- `DELETE /api/semesters.php?id={id}` - Delete semester

### Divisions
- `GET /api/divisions.php?action=list` - List all divisions
- `GET /api/divisions.php?action=by_semester&semester_id={id}` - Get divisions by semester
- `POST /api/divisions.php` - Create division
- `PUT /api/divisions.php` - Update division
- `DELETE /api/divisions.php?id={id}` - Delete division

### Classrooms
- `GET /api/classrooms.php?action=list` - List all classrooms
- `GET /api/classrooms.php?action=by_dept&dept_id={id}&type={type}` - Get classrooms by department/type
- `POST /api/classrooms.php` - Create classroom
- `PUT /api/classrooms.php` - Update classroom
- `DELETE /api/classrooms.php?id={id}` - Delete classroom

### Faculty
- `GET /api/faculty.php?action=list` - List all faculty (with optional filters)
- `GET /api/faculty.php?action=get&id={id}` - Get single faculty
- `POST /api/faculty.php` - Create faculty
- `PUT /api/faculty.php` - Update faculty
- `DELETE /api/faculty.php?id={id}` - Delete faculty

### Subjects
- `GET /api/subjects.php?action=list` - List all subjects
- `GET /api/subjects.php?action=by_semester&semester_id={id}` - Get subjects by semester
- `POST /api/subjects.php` - Create subject
- `PUT /api/subjects.php` - Update subject
- `DELETE /api/subjects.php?id={id}` - Delete subject

### Constraints
- `GET /api/constraints.php?action=list` - List all constraints
- `GET /api/constraints.php?action=latest` - Get latest constraint
- `POST /api/constraints.php` - Create constraint
- `PUT /api/constraints.php` - Update constraint
- `DELETE /api/constraints.php?id={id}` - Delete constraint

### Timetable
- `GET /api/timetable.php?action=list` - List all timetable entries
- `GET /api/timetable.php?action=by_division&division_id={id}` - Get timetable by division
- `GET /api/timetable.php?action=by_faculty&faculty_id={id}` - Get timetable by faculty
- `POST /api/timetable.php?action=generate` - Generate timetable
- `DELETE /api/timetable.php?action=reset` - Reset timetable

## Setup Instructions

### 1. Backend Setup
1. Ensure XAMPP is running
2. Database should be accessible at `localhost` with database `timetable_scheduler`
3. All API files are in `/api/` folder
4. Update `db.php` if your database credentials differ

### 2. Frontend Setup
1. Navigate to `shadcn-ui` folder:
   ```bash
   cd shadcn-ui
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Update API base URL in `src/lib/api.ts` if needed:
   ```typescript
   const API_BASE_URL = 'http://localhost/classroom/api';
   ```

4. Start development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

### 3. CORS Configuration
The API is configured to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Alternative)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

To add more origins, edit `api/config.php`.

## Usage

### 1. Login
- Navigate to `http://localhost:5173/login`
- Use admin or faculty credentials
- Default admin credentials should be set in your database

### 2. Admin Features
After logging in as admin, you'll see:
- **Dashboard**: Overview with statistics
- **Departments**: Manage academic departments
- **Semesters**: Manage semesters and divisions
- **Classrooms**: Manage classrooms and labs
- **Data Management**: (Original component - can be migrated)
- **Constraints**: Configure timetable constraints
- **Timetable**: Generate and view timetables

### 3. Faculty Features
Faculty users can:
- View their assigned subjects
- View their timetable
- (Additional features can be added)

## Components Created

### Backend-Connected Components
1. **Departments.tsx** - Full CRUD for departments
2. **SemestersDivisions.tsx** - Manage semesters and divisions
3. **Classrooms.tsx** - Manage classrooms and labs
4. **Login.tsx** - Authentication component

### Supporting Files
1. **api.ts** - API service layer with all endpoints
2. **auth-store.ts** - Authentication state management
3. **Updated Index.tsx** - Main page with integrated components
4. **Updated NavigationTabs.tsx** - Navigation with new tabs
5. **Updated DashboardHeader.tsx** - Header with user info and logout

## Migration Status

### ✅ Completed
- API endpoints for all entities
- Authentication system
- Departments management
- Semesters & Divisions management
- Classrooms management
- Navigation integration
- User authentication flow

### ⏳ Pending (Can be done incrementally)
- Faculty management component
- Subjects management component
- Constraints management component (update to use backend)
- Timetable generation component (update to use backend)
- Timetable viewer component (update to use backend)

## Important Notes

1. **Session Management**: The backend uses PHP sessions. Make sure cookies are enabled in your browser.

2. **Database**: All backend functionality is preserved. The original `dashboard.php` still works independently.

3. **CORS**: If you encounter CORS errors, check:
   - Your frontend URL is in the allowed origins list
   - PHP sessions are working correctly
   - Database connection is successful

4. **Error Handling**: All API calls include error handling. Check browser console for detailed error messages.

5. **Data Persistence**: Authentication state is stored in localStorage for persistence across page refreshes.

## Testing

1. **Test API Endpoints Directly**:
   ```
   http://localhost/classroom/api/departments.php?action=list
   ```

2. **Test Frontend**:
   - Start React dev server
   - Navigate to login page
   - Login with valid credentials
   - Test CRUD operations

3. **Check Browser Console**: For any API errors or warnings

## Troubleshooting

### CORS Errors
- Ensure your frontend URL matches one in `api/config.php`
- Check that PHP is sending correct headers

### Authentication Issues
- Clear browser cookies
- Check PHP session configuration
- Verify database user table has correct data

### API Errors
- Check PHP error logs
- Verify database connection in `db.php`
- Ensure all required tables exist

## Next Steps

1. Complete remaining components (Faculty, Subjects, Constraints, Timetable)
2. Add form validation
3. Add loading states and better error messages
4. Add data export/import features
5. Add advanced filtering and search
6. Migrate remaining components from localStorage to backend

## Support

For issues or questions:
1. Check browser console for errors
2. Check PHP error logs
3. Verify database connectivity
4. Ensure all dependencies are installed


