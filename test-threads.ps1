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

# Test updating a reply
Write-Host "`nTesting update reply..."
$updateReplyBody = @{
    content = "This is an updated test reply"
} | ConvertTo-Json

try {
    $updateReplyResponse = Invoke-RestMethod -Uri "$BASE_URL/replies/$replyId" `
        -Method Put `
        -Headers $headers `
        -Body $updateReplyBody

    Write-Host "✅ Update reply successful!"
    Write-Host "Update Reply Response:"
    $updateReplyResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Update reply failed!"
    Write-Host "Error: $_"
}

# Test deleting a reply
Write-Host "`nTesting delete reply..."
try {
    $deleteReplyResponse = Invoke-RestMethod -Uri "$BASE_URL/replies/$replyId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete reply successful!"
    Write-Host "Delete Reply Response:"
    $deleteReplyResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Delete reply failed!"
    Write-Host "Error: $_"
}

# Test deleting a thread
Write-Host "`nTesting delete thread..."
try {
    $deleteThreadResponse = Invoke-RestMethod -Uri "$BASE_URL/threads/$threadId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete thread successful!"
    Write-Host "Delete Thread Response:"
    $deleteThreadResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Delete thread failed!"
    Write-Host "Error: $_"
} 