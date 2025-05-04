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

# Test create post
Write-Host "`nTesting create post..."
$createPostBody = @{
    content = "This is a test post!"
    tags = @("test", "firstpost")
    visibility = "public"
    mood = "happy"
} | ConvertTo-Json

try {
    $createPostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts" `
        -Method Post `
        -Headers $headers `
        -Body $createPostBody

    Write-Host "✅ Create post successful!"
    Write-Host "Created Post:"
    $createPostResponse | ConvertTo-Json -Depth 4
    $postId = $createPostResponse._id
} catch {
    Write-Host "❌ Create post failed!"
    Write-Host "Error: $_"
    exit
}

# Test get posts
Write-Host "`nTesting get posts..."
try {
    $getPostsResponse = Invoke-RestMethod -Uri "$BASE_URL/posts" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get posts successful!"
    Write-Host "Posts Response:"
    $getPostsResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get posts failed!"
    Write-Host "Error: $_"
}

# Test get single post
Write-Host "`nTesting get single post..."
try {
    $getPostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Get post successful!"
    Write-Host "Post Response:"
    $getPostResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Get post failed!"
    Write-Host "Error: $_"
}

# Test update post
Write-Host "`nTesting update post..."
$updatePostBody = @{
    content = "This is an updated test post!"
    mood = "excited"
} | ConvertTo-Json

try {
    $updatePostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" `
        -Method Patch `
        -Headers $headers `
        -Body $updatePostBody

    Write-Host "✅ Update post successful!"
    Write-Host "Updated Post Response:"
    $updatePostResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Update post failed!"
    Write-Host "Error: $_"
}

# Test like post
Write-Host "`nTesting like post..."
try {
    $likePostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId/like" `
        -Method Post `
        -Headers $headers

    Write-Host "✅ Like post successful!"
    Write-Host "Liked Post Response:"
    $likePostResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Like post failed!"
    Write-Host "Error: $_"
}

# Test add comment
Write-Host "`nTesting add comment..."
$addCommentBody = @{
    content = "This is a test comment!"
} | ConvertTo-Json

try {
    $addCommentResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId/comments" `
        -Method Post `
        -Headers $headers `
        -Body $addCommentBody

    Write-Host "✅ Add comment successful!"
    Write-Host "Comment Response:"
    $addCommentResponse | ConvertTo-Json -Depth 4
    $commentId = $addCommentResponse._id
} catch {
    Write-Host "❌ Add comment failed!"
    Write-Host "Error: $_"
}

# Test delete comment
Write-Host "`nTesting delete comment..."
try {
    $deleteCommentResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId/comments/$commentId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete comment successful!"
    Write-Host "Delete Comment Response:"
    $deleteCommentResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Delete comment failed!"
    Write-Host "Error: $_"
}

# Test delete post
Write-Host "`nTesting delete post..."
try {
    $deletePostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Delete post successful!"
    Write-Host "Delete Post Response:"
    $deletePostResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Delete post failed!"
    Write-Host "Error: $_"
} 