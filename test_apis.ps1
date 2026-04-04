# Test API endpoints
$baseUrl = "http://localhost:5000"

# Test 1: States
Write-Host "1. Testing GET /api/states..."
$states = (Invoke-WebRequest -Uri "$baseUrl/api/states" -UseBasicParsing -TimeoutSec 10).Content | ConvertFrom-Json
Write-Host "✓ Found  states"

# Test 2: Districts
Write-Host "2. Testing GET /api/states/:state/districts..."
$districts = (Invoke-WebRequest -Uri "$baseUrl/api/states/MAHARASHTRA/districts" -UseBasicParsing -TimeoutSec 10).Content | ConvertFrom-Json
Write-Host "✓ Found  districts for MAHARASHTRA"

# Test 3: Taluks - using a simpler approach
Write-Host "3. Testing GET /api/states/:state/districts/:district/taluks..."
try {
  $taluks = (Invoke-WebRequest -Uri "$baseUrl/api/states/MAHARASHTRA/districts/Pune/taluks" -UseBasicParsing -TimeoutSec 15).Content | ConvertFrom-Json
  Write-Host "✓ Found  taluks"
} catch {
  Write-Host "✗ Error: $($_.Exception.Message)"
}
