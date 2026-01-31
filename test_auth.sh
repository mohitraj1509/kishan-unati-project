#!/bin/bash

# Creating demo user for Backend - will make API call

echo "Testing Login/Register endpoints..."

# First register a test user
echo "1. Registering test user..."
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Farmer",
    "email": "test@kisan.com",
    "password": "Test@123",
    "phone": "9876543210",
    "location": {
      "district": "Maharashtra",
      "state": "MH",
      "address": "Village",
      "pincode": "440001"
    },
    "role": "farmer"
  }'

echo -e "\n\n2. Now trying to login with same credentials..."
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kisan.com",
    "password": "Test@123"
  }'
