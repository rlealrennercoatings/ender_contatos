# Script PowerShell para ver os logs
# Execute: .\logs.ps1

param(
    [string]$service = ""
)

if ($service) {
    Write-Host "📋 Logs do serviço: $service" -ForegroundColor Cyan
    docker-compose logs -f $service
} else {
    Write-Host "📋 Logs de todos os serviços" -ForegroundColor Cyan
    Write-Host "Pressione Ctrl+C para sair" -ForegroundColor Yellow
    docker-compose logs -f
}
