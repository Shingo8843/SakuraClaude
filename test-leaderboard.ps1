# Base URL
$BASE_URL = "http://localhost:5000/api"

# First, login to get a token
Write-Host "Logging in..."
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
        "Content-Type" = "application/json"
    }
} catch {
    Write-Host "❌ Login failed!"
    Write-Host "Error: $_"
    exit
}

# Test getting global leaderboard
Write-Host "`nTesting get global leaderboard..."
try {
    $globalLeaderboardResponse = Invoke-RestMethod -Uri "$BASE_URL/leaderboard/global" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get global leaderboard successful!"
    Write-Host "Global Leaderboard Response:"
    $globalLeaderboardResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get global leaderboard failed!"
    Write-Host "Error: $_"
}

# Test getting user's leaderboard position
Write-Host "`nTesting get user leaderboard position..."
try {
    $userLeaderboardResponse = Invoke-RestMethod -Uri "$BASE_URL/leaderboard/user" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get user leaderboard position successful!"
    Write-Host "User Leaderboard Position Response:"
    $userLeaderboardResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get user leaderboard position failed!"
    Write-Host "Error: $_"
}

# Test getting streak leaderboard
Write-Host "`nTesting get streak leaderboard..."
try {
    $streakLeaderboardResponse = Invoke-RestMethod -Uri "$BASE_URL/leaderboard/streak" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get streak leaderboard successful!"
    Write-Host "Streak Leaderboard Response:"
    $streakLeaderboardResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get streak leaderboard failed!"
    Write-Host "Error: $_"
}

# Test getting accuracy leaderboard
Write-Host "`nTesting get accuracy leaderboard..."
try {
    $accuracyLeaderboardResponse = Invoke-RestMethod -Uri "$BASE_URL/leaderboard/accuracy" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get accuracy leaderboard successful!"
    Write-Host "Accuracy Leaderboard Response:"
    $accuracyLeaderboardResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get accuracy leaderboard failed!"
    Write-Host "Error: $_"
} 