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

# Test user profile
Write-Host "`nTesting user profile..."
try {
    $profileResponse = Invoke-RestMethod -Uri "$BASE_URL/users/profile" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get user profile successful!"
    Write-Host "Profile Response:"
    $profileResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get user profile failed!"
    Write-Host "Error: $_"
}

# Test updating user profile
Write-Host "`nTesting update user profile..."
$updateProfileBody = @{
    profileMessage = "This is a test profile message"
    postFrequency = 5
    replyRate = 80
    replySpeed = 3
    interest = "technology"
    tone = "friendly"
    timeZone = 8
} | ConvertTo-Json

try {
    $updateProfileResponse = Invoke-RestMethod -Uri "$BASE_URL/users/profile" `
        -Method Patch `
        -Headers $headers `
        -Body $updateProfileBody

    Write-Host "✅ Update user profile successful!"
    Write-Host "Update Profile Response:"
    $updateProfileResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Update user profile failed!"
    Write-Host "Error: $_"
}

# Test creating a thread
Write-Host "`nTesting create thread..."
$threadBody = @{
    title = "Test Thread"
    content = "This is a test thread"
    category = "general"
    tags = @("test", "thread")
} | ConvertTo-Json

try {
    $threadResponse = Invoke-RestMethod -Uri "$BASE_URL/threads" `
        -Method Post `
        -Headers $headers `
        -Body $threadBody

    Write-Host "✅ Create thread successful!"
    Write-Host "Thread Response:"
    $threadResponse | ConvertTo-Json -Depth 4
    $threadId = $threadResponse._id
} catch {
    Write-Host "❌ Create thread failed!"
    Write-Host "Error: $_"
    exit
}

# Test getting all threads
Write-Host "`nTesting get all threads..."
try {
    $threadsResponse = Invoke-RestMethod -Uri "$BASE_URL/threads" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get all threads successful!"
    Write-Host "Threads Response:"
    $threadsResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get all threads failed!"
    Write-Host "Error: $_"
}

# Test creating a reply
Write-Host "`nTesting create reply..."
$replyBody = @{
    content = "This is a test reply"
} | ConvertTo-Json

try {
    $replyResponse = Invoke-RestMethod -Uri "$BASE_URL/replies/thread/$threadId" `
        -Method Post `
        -Headers $headers `
        -Body $replyBody

    Write-Host "✅ Create reply successful!"
    Write-Host "Reply Response:"
    $replyResponse | ConvertTo-Json -Depth 4
    $replyId = $replyResponse._id
} catch {
    Write-Host "❌ Create reply failed!"
    Write-Host "Error: $_"
}

# Test getting replies for a thread
Write-Host "`nTesting get replies..."
try {
    $repliesResponse = Invoke-RestMethod -Uri "$BASE_URL/replies/thread/$threadId" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get replies successful!"
    Write-Host "Replies Response:"
    $repliesResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get replies failed!"
    Write-Host "Error: $_"
}

# Test liking a reply
Write-Host "`nTesting like reply..."
try {
    $likeResponse = Invoke-RestMethod -Uri "$BASE_URL/replies/$replyId/like" `
        -Method Post `
        -Headers $headers

    Write-Host "✅ Like reply successful!"
    Write-Host "Like Response:"
    $likeResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Like reply failed!"
    Write-Host "Error: $_"
}

# Test leaderboard
Write-Host "`nTesting leaderboard..."
try {
    $leaderboardResponse = Invoke-RestMethod -Uri "$BASE_URL/leaderboard/global" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get leaderboard successful!"
    Write-Host "Leaderboard Response:"
    $leaderboardResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get leaderboard failed!"
    Write-Host "Error: $_"
}

# Test user position in leaderboard
Write-Host "`nTesting user leaderboard position..."
try {
    $userPositionResponse = Invoke-RestMethod -Uri "$BASE_URL/leaderboard/user" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get user leaderboard position successful!"
    Write-Host "User Position Response:"
    $userPositionResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get user leaderboard position failed!"
    Write-Host "Error: $_"
}

# Test streak leaderboard
Write-Host "`nTesting streak leaderboard..."
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

# Test accuracy leaderboard
Write-Host "`nTesting accuracy leaderboard..."
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

# Clean up - delete the test thread and reply
Write-Host "`nCleaning up test data..."
try {
    $deleteReplyResponse = Invoke-RestMethod -Uri "$BASE_URL/replies/$replyId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete reply successful!"
} catch {
    Write-Host "❌ Delete reply failed!"
    Write-Host "Error: $_"
}

try {
    $deleteThreadResponse = Invoke-RestMethod -Uri "$BASE_URL/threads/$threadId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete thread successful!"
} catch {
    Write-Host "❌ Delete thread failed!"
    Write-Host "Error: $_"
} 