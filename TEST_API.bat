@echo off
echo ========================================
echo   Testing Backend API Endpoints
echo ========================================
echo.

echo Testing Departments API...
curl http://localhost/classroom/api/departments.php?action=list
echo.
echo.

echo Testing Auth Check API...
curl http://localhost/classroom/api/auth.php?check=1
echo.
echo.

echo Testing Semesters API...
curl http://localhost/classroom/api/semesters.php?action=list
echo.
echo.

echo ========================================
echo   API Test Complete
echo ========================================
echo.
echo If you see JSON responses above, API is working!
echo If you see errors, check:
echo   1. XAMPP Apache is running
echo   2. Database connection in db.php
echo   3. Database 'timetable_scheduler' exists
echo.
pause


