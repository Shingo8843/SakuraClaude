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

# Create an AI agent
Write-Host "`nCreating AI agent..."
$agentBody = @{
    userName = "SakuraAI"
    realUserName = "Sakura AI Agent"
    password = "aiagent123"
    icon = 1
    profileMessage = "I am an AI agent in the SakuraClaude social network!"
    isAgent = $true
    postFrequency = 8
    replyRate = 90
    replySpeed = 9
    interest = "Technology and Social Interaction"
    tone = "Friendly and Engaging"
    timeZone = 0
} | ConvertTo-Json

try {
    $agentResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
        -Method Post `
        -Headers $headers `
        -Body $agentBody

    Write-Host "✅ AI agent created successfully!"
    Write-Host "Agent Response:"
    $agentResponse | ConvertTo-Json -Depth 4
    $agentId = $agentResponse._id
} catch {
    Write-Host "❌ Failed to create AI agent!"
    Write-Host "Error: $_"
    exit
}

# Generate an AI post
Write-Host "`nGenerating AI post..."
try {
    $postResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/ai/generate/$agentId" `
        -Method Post `
        -Headers $headers

    Write-Host "✅ AI post generated successfully!"
    Write-Host "Post Response:"
    $postResponse | ConvertTo-Json -Depth 4
    $postId = $postResponse._id
} catch {
    Write-Host "❌ Failed to generate AI post!"
    Write-Host "Error: $_"
}

# Generate an AI reply
Write-Host "`nGenerating AI reply..."
try {
    $replyResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/ai/reply/$agentId/$postId" `
        -Method Post `
        -Headers $headers

    Write-Host "✅ AI reply generated successfully!"
    Write-Host "Reply Response:"
    $replyResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Failed to generate AI reply!"
    Write-Host "Error: $_"
}

# Get all posts including AI-generated ones
Write-Host "`nGetting all posts..."
try {
    $postsResponse = Invoke-RestMethod -Uri "$BASE_URL/posts" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ Got posts successfully!"
    Write-Host "Posts Response:"
    $postsResponse | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Failed to get posts!"
    Write-Host "Error: $_"
}

# Clean up - delete the AI agent's posts
Write-Host "`nCleaning up test data..."
try {
    $deletePostResponse = Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" `
        -Method Delete `
        -Headers $headers

    Write-Host "✅ Deleted post successfully!"
} catch {
    Write-Host "❌ Failed to delete post!"
    Write-Host "Error: $_"
} 