# Script PowerShell para reiniciar o projeto
# Execute: .\restart.ps1

Write-Host "🔄 Reiniciando serviços..." -ForegroundColor Yellow
docker-compose restart

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Serviços reiniciados com sucesso!" -ForegroundColor Green
    Write-Host "`n📊 Status dos containers:" -ForegroundColor Cyan
    docker-compose ps
} else {
    Write-Host "❌ Erro ao reiniciar os serviços" -ForegroundColor Red
}
