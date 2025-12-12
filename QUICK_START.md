# Quick Start Guide - Running the Integrated System

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ XAMPP installed and running
- ✅ MySQL database `timetable_scheduler` exists
- ✅ Node.js and npm/pnpm installed
- ✅ All project files in place

---

## Step-by-Step Instructions

### Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
2. **Start Apache** (click "Start" button)
3. **Start MySQL** (click "Start" button)
4. **Verify both are running** (should show green "Running" status)

### Step 2: Verify Database Connection

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Check if database `timetable_scheduler` exists
3. If not, create it or import from `schema.sql`
4. Verify you have at least one admin user in the `users` table:
   ```sql
   SELECT * FROM users WHERE role='admin';
   ```
   If no admin exists, create one:
   ```sql
   INSERT INTO users (username, password, role, email) 
   VALUES ('admin', 'admin123', 'admin', 'admin@example.com');
   ```

### Step 3: Test Backend API (Optional but Recommended)

Open your browser and test an API endpoint:
```
http://localhost/classroom/api/departments.php?action=list
```

**Expected Response:**
```json
{"success":true,"data":[]}
```
or
```json
{"success":true,"data":[{"id":1,"name":"CSE"},{"id":2,"name":"ECE"}]}
```

If you see an error, check:
- Apache is running
- Database connection in `db.php` is correct
- Database exists

### Step 4: Start React Frontend

1. **Open a new terminal/command prompt**
2. **Navigate to shadcn-ui folder:**
   ```bash
   cd C:\xampp\htdocs\classroom\shadcn-ui
   ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```
   OR if using pnpm:
   ```bash
   pnpm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   OR:
   ```bash
   pnpm dev
   ```

5. **Wait for the server to start** - You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

### Step 5: Access the Application

1. **Open your browser** and go to:
   ```
   http://localhost:5173/login
   ```

2. **Login with admin credentials:**
   - Username: `admin` (or your admin username)
   - Password: `admin123` (or your admin password)
   - Role: Select **Admin**

3. **After successful login**, you'll be redirected to the dashboard

---

## Testing the Functionality

### Test 1: Departments Management

1. Click on **"Departments"** tab in the navigation
2. Click **"Add Department"** button
3. Enter a department name (e.g., "Computer Science")
4. Click **"Add Department"**
5. Verify the department appears in the table
6. Test **Edit** functionality (click edit icon)
7. Test **Delete** functionality (click delete icon)

### Test 2: Semesters Management

1. Click on **"Semesters"** tab
2. Click **"Add Semester"** button
3. Fill in:
   - Select a Department (must have at least one department)
   - Enter Semester Name (e.g., "Semester 1")
   - Select Type (Odd or Even)
4. Click **"Add Semester"**
5. Verify it appears in the table

### Test 3: Divisions Management

1. In the **"Semesters"** tab, switch to **"Divisions"** sub-tab
2. Click **"Add Division"** button
3. Fill in:
   - Select a Semester
   - Enter Division Name (e.g., "A")
   - Enter Number of Students (e.g., 60)
4. Click **"Add Division"**
5. Verify it appears in the table

### Test 4: Classrooms Management

1. Click on **"Classrooms"** tab
2. Click **"Add Classroom/Lab"** button
3. Fill in:
   - Room Number (e.g., "101")
   - Select Department
   - Select Type (Classroom or Lab)
   - Enter Capacity (e.g., 60)
4. Click **"Add Classroom"**
5. Verify it appears in the table
6. Test **Edit** and **Delete** functionality

### Test 5: Authentication

1. Click **"Logout"** button in the header
2. You should be redirected to login page
3. Try logging in again
4. Verify session persists after page refresh

---

## Troubleshooting

### Issue: "Cannot connect to API" or CORS errors

**Solution:**
1. Check if Apache is running in XAMPP
2. Verify API URL in `shadcn-ui/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost/classroom/api';
   ```
3. Test API directly: `http://localhost/classroom/api/departments.php?action=list`
4. Check browser console for specific error messages

### Issue: "Login fails" or "Unauthorized"

**Solution:**
1. Verify admin user exists in database:
   ```sql
   SELECT * FROM users WHERE role='admin';
   ```
2. Check password matches (currently plain text in database)
3. Clear browser cookies and try again
4. Check PHP error logs in XAMPP

### Issue: "Database connection failed"

**Solution:**
1. Verify MySQL is running in XAMPP
2. Check `db.php` credentials:
   ```php
   $host = "localhost";
   $db = "timetable_scheduler";
   $user = "root";
   $pass = "";
   ```
3. Verify database exists in phpMyAdmin
4. Check MySQL port (default: 3306)

### Issue: "React dev server won't start"

**Solution:**
1. Check Node.js is installed: `node --version`
2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Check if port 5173 is already in use
4. Try a different port: `npm run dev -- --port 3000`

### Issue: "Page shows blank or errors"

**Solution:**
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed API calls
4. Verify all API endpoints are accessible
5. Check React Query cache - try hard refresh (Ctrl+Shift+R)

---

## Expected File Structure

```
classroom/
├── api/
│   ├── config.php
│   ├── auth.php
│   ├── departments.php
│   ├── semesters.php
│   ├── divisions.php
│   ├── classrooms.php
│   ├── faculty.php
│   ├── subjects.php
│   ├── constraints.php
│   └── timetable.php
├── shadcn-ui/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── auth-store.ts
│   │   ├── components/
│   │   │   ├── Departments.tsx
│   │   │   ├── SemestersDivisions.tsx
│   │   │   ├── Classrooms.tsx
│   │   │   └── Login.tsx
│   │   └── pages/
│   │       └── Index.tsx
│   └── package.json
├── db.php
└── dashboard.php (original - still works)
```

---

## Quick Test Commands

### Test Backend API:
```bash
# Test departments endpoint
curl http://localhost/classroom/api/departments.php?action=list

# Test auth check
curl http://localhost/classroom/api/auth.php?check=1
```

### Test Frontend:
```bash
# Start dev server
cd shadcn-ui
npm run dev

# Build for production (optional)
npm run build
```

---

## Success Indicators

✅ **Backend Working:**
- API endpoints return JSON responses
- No PHP errors in browser/console
- Database queries execute successfully

✅ **Frontend Working:**
- React dev server starts without errors
- Login page loads correctly
- Can login and see dashboard
- API calls succeed (check Network tab)
- Data appears in tables after creation

✅ **Integration Working:**
- Can create/edit/delete departments
- Can create semesters and divisions
- Can create classrooms
- Authentication persists across page refreshes
- Logout works correctly

---

## Next Steps After Testing

Once everything is working:

1. **Add more data** through the UI
2. **Test all CRUD operations** for each entity
3. **Verify data persists** in database (check phpMyAdmin)
4. **Test with multiple users** (if you have faculty accounts)
5. **Explore remaining features** (Faculty, Subjects, Constraints, Timetable)

---

## Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check XAMPP error logs
3. Verify database connection
4. Test API endpoints directly
5. Review `INTEGRATION_GUIDE.md` for detailed documentation

---

## Summary

**To run the system:**
1. Start XAMPP (Apache + MySQL) ✅
2. Start React dev server (`npm run dev` in shadcn-ui folder) ✅
3. Open `http://localhost:5173/login` ✅
4. Login and test features ✅

**That's it!** The system should be fully functional now. 🎉


