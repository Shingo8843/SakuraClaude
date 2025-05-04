# Test AI Agent Features
Write-Host "Testing AI Agent Features..."

# Generate a unique username with timestamp
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$uniqueUsername = "AI_Agent_$timestamp"

# Test 1: Create AI Agent
$agentData = @{
    userName = "AI_Agent_$(Get-Date -Format 'yyyyMMddHHmmss')"
    realUserName = "AI_Agent_$(Get-Date -Format 'yyyyMMddHHmmss')"
    password = "Test123!"
    isAgent = $true
    postFrequency = 7  # More active posting (0-10 scale)
    replyRate = 80     # High reply rate (0-100%)
    replySpeed = 8     # Fast replies (0-10 scale)
    interest = "Technology"
    tone = "Friendly"
    timeZone = -4  # Eastern Time (UTC-4)
}

Write-Host "Test 1: Creating AI Agent..."
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method Post -Body ($agentData | ConvertTo-Json) -ContentType "application/json"
$authResponse = $response.Content | ConvertFrom-Json
$token = $authResponse.token
$agent = $authResponse.user
$agentId = $agent._id
Write-Host "Created AI Agent: $($agent.userName)"

# Set up headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 2: Get Agent Behavior
Write-Host "Test 2: Getting Agent Behavior..."
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/agents/$agentId/behavior" -Headers $headers -Method Get
Write-Host "Agent Behavior:"
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Test 3: Schedule Agent Post
Write-Host "Test 3: Scheduling Agent Post..."
$scheduledTime = (Get-Date).AddMinutes(1).ToString("yyyy-MM-ddTHH:mm:ss.ffffffzzz")
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/agents/$agentId/schedule/$scheduledTime" -Headers $headers -Method Post
Write-Host "Scheduled Post:"
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Test 4: Create Post for Agent Reply
Write-Host "`nTest 4: Creating Post for Agent Reply..."
$postData = @{
    content = "What do you think about the future of AI in social media?"
    author = $agentId
    isAIGenerated = $false
    visibility = "public"
}
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/posts" -Method Post -Body ($postData | ConvertTo-Json) -Headers $headers
$post = $response.Content | ConvertFrom-Json
Write-Host "Created Post: $($post.content)"

# Test 5: Generate Agent Reply
Write-Host "Test 5: Generating Agent Reply..."
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/agents/$agentId/reply/$($post._id)" -Headers $headers -Method Post
Write-Host "Agent Reply:"
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Test 6: Process Scheduled Posts
Write-Host "`nTest 6: Processing Scheduled Posts..."
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/agents/process-scheduled" -Method Post -Headers $headers
$processResult = $response.Content | ConvertFrom-Json
Write-Host "Process Result:`n$($processResult | ConvertTo-Json -Depth 4)"

Write-Host "`nAll AI Agent tests completed!" 