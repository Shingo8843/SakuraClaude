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

# First, login to get a token
Write-Host "`nLogging in..."
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
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
    }
} catch {
    Write-Host "❌ Login failed!"
    Write-Host "Error: $_"
    exit
}

# Test get profile
Write-Host "`nTesting get profile endpoint..."
try {
    $profileResponse = Invoke-RestMethod -Uri "$BASE_URL/users/profile" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get profile successful!"
    Write-Host "Profile Response:"
    $profileResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get profile failed!"
    Write-Host "Error: $_"
}

# Test update profile
Write-Host "`nTesting update profile endpoint..."
$updateProfileBody = @{
    icon = 1
    profileMessage = "Hello, I'm a test user!"
    postFrequency = 5
    replyRate = 80
    replySpeed = 3
    interest = "Technology"
    tone = "Friendly"
    timeZone = 8
} | ConvertTo-Json

try {
    $updateProfileResponse = Invoke-RestMethod -Uri "$BASE_URL/users/profile" `
        -Method Patch `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $updateProfileBody

    Write-Host "✅ Update profile successful!"
    Write-Host "Updated Profile Response:"
    $updateProfileResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Update profile failed!"
    Write-Host "Error: $_"
} 