# Test Report Issue API Endpoints

Write-Host "`n=== Testing Report Issue API ===" -ForegroundColor Green

# Test 1: Submit issue without file
Write-Host "`n[Test 1] Submitting issue without file..." -ForegroundColor Yellow
$response1 = curl.exe -X POST http://localhost:5174/api/issues `
  -F "category=Portal Bug" `
  -F "issueTitle=Test Issue from PowerShell" `
  -F "description=This is a test description with more than thirty characters to meet the minimum requirement for testing." `
  -F "addedBy=Test User"
Write-Host $response1

# Test 2: Get all issues
Write-Host "`n[Test 2] Getting all issues..." -ForegroundColor Yellow
$response2 = curl.exe http://localhost:5174/api/issues
Write-Host $response2

Write-Host "`n=== Tests Complete ===" -ForegroundColor Green
