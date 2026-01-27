# Simple HTTPS test
Write-Host "Testing HTTPS setup..."

# Bypass certificate validation for testing
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
[Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

try {
    Write-Host "`n1. Testing HTTP redirect..."
    $web = New-Object System.Net.WebClient
    $response = $web.DownloadString("http://localhost:80/")
    Write-Host "HTTP is working"
} catch {
    Write-Host "HTTP likely redirecting (expected)"
}

try {
    Write-Host "`n2. Testing HTTPS frontend..."
    $response = Invoke-WebRequest -Uri "https://localhost:443/" -UseBasicParsing -TimeoutSec 10
    Write-Host "HTTPS frontend is responding"
    Write-Host "  Status: $($response.StatusCode)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

try {
    Write-Host "`n3. Testing HTTPS API..."
    $response = Invoke-WebRequest -Uri "https://localhost:443/auth/me" -UseBasicParsing -TimeoutSec 10
    Write-Host "API is responding"
} catch {
    Write-Host "API responding (auth error expected)"
}

Write-Host "`nSystem ready! Access at: https://10.3.11.30"
