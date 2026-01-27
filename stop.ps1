# Script PowerShell para parar o projeto
# Execute: .\stop.ps1

Write-Host "🛑 Parando serviços..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Serviços parados com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao parar os serviços" -ForegroundColor Red
}
