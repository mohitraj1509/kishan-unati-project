use kisan-unnati;
print("Current indexes on users collection:");
printjson(db.users.getIndexes());
print("\nDropping geospatial index if it exists...");
try {
  db.users.dropIndex({ "location": "2dsphere" });
  print("Successfully dropped geospatial index on users.location");
} catch (e) {
  print("No geospatial index found on users.location or error:", e.message);
}
print("\nCurrent indexes after cleanup:");
printjson(db.users.getIndexes());