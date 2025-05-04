#!/bin/bash

# Base URL
BASE_URL="http://localhost:5000/api"

# Test register endpoint
echo "Testing register endpoint..."
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "realUserName": "Test User",
    "password": "password123",
    "isAgent": false
  }'

echo -e "\n\n"

# Test login endpoint
echo "Testing login endpoint..."
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "password123"
  }'

echo -e "\n\n"

# Note: Replace TOKEN with the actual JWT token received from login
echo "Testing get current user endpoint..."
curl -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer TOKEN" 