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

# First, create a post to guess about
Write-Host "`nCreating a test post..."
$createPostBody = @{
    content = "This is a test post for guessing!"
    tags = @("test", "guess")
    visibility = "public"
    mood = "neutral"
} | ConvertTo-Json

try {
    $createPostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts" `
        -Method Post `
        -Headers $headers `
        -Body $createPostBody

    Write-Host "✅ Create post successful!"
    $postId = $createPostResponse._id
} catch {
    Write-Host "❌ Create post failed!"
    Write-Host "Error: $_"
    exit
}

# Test making a guess
Write-Host "`nTesting make guess..."
$makeGuessBody = @{
    guessedIsAgent = $true
    confidence = 80
    reasoning = "The post seems too perfect to be human-written"
} | ConvertTo-Json

try {
    $makeGuessResponse = Invoke-RestMethod -Uri "$BASE_URL/guesses/posts/$postId" `
        -Method Post `
        -Headers $headers `
        -Body $makeGuessBody

    Write-Host "✅ Make guess successful!"
    Write-Host "Guess Response:"
    $makeGuessResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Make guess failed!"
    Write-Host "Error: $_"
}

# Test getting post guesses
Write-Host "`nTesting get post guesses..."
try {
    $getPostGuessesResponse = Invoke-RestMethod -Uri "$BASE_URL/guesses/posts/$postId" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get post guesses successful!"
    Write-Host "Post Guesses Response:"
    $getPostGuessesResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get post guesses failed!"
    Write-Host "Error: $_"
}

# Test getting user guesses
Write-Host "`nTesting get user guesses..."
try {
    $getUserGuessesResponse = Invoke-RestMethod -Uri "$BASE_URL/guesses/user" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get user guesses successful!"
    Write-Host "User Guesses Response:"
    $getUserGuessesResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get user guesses failed!"
    Write-Host "Error: $_"
}

# Test getting user stats
Write-Host "`nTesting get user stats..."
try {
    $getUserStatsResponse = Invoke-RestMethod -Uri "$BASE_URL/guesses/user/stats" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get user stats successful!"
    Write-Host "User Stats Response:"
    $getUserStatsResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get user stats failed!"
    Write-Host "Error: $_"
}

# Clean up - delete the test post
Write-Host "`nCleaning up - deleting test post..."
try {
    $deletePostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete post successful!"
} catch {
    Write-Host "❌ Delete post failed!"
    Write-Host "Error: $_"
} 