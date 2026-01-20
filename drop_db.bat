@echo off
echo Dropping kisan-unnati database...
mongosh --eval "use kisan-unnati; db.dropDatabase(); print('Database dropped successfully');"
echo.
echo Database cleanup complete. You can now restart your backend server.
pause