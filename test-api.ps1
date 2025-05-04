# Base URL
$BASE_URL = "http://localhost:5000/api"

# Test server connection first
Write-Host "Testing server connection..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method Get
    Write-Host "✅ Server is running!"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "❌ Server connection failed!"
    Write-Host "Error: $_"
    exit
}

# Test register endpoint
Write-Host "`nTesting register endpoint..."
$registerBody = @{
    userName = "testuser"
    realUserName = "Test User"
    password = "password123"
    isAgent = $false
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody

    Write-Host "✅ Register successful!"
    Write-Host "Register Response:"
    $registerResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Register failed!"
    Write-Host "Error: $_"
}

Write-Host "`n"

# Test login endpoint
Write-Host "Testing login endpoint..."
$loginBody = @{
    userName = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    Write-Host "✅ Login successful!"
    Write-Host "Login Response:"
    $loginResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Login failed!"
    Write-Host "Error: $_"
}

Write-Host "`n"

# Test get current user endpoint
Write-Host "Testing get current user endpoint..."
try {
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $meResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/me" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get current user successful!"
    Write-Host "Current User Response:"
    $meResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get current user failed!"
    Write-Host "Error: $_"
} 