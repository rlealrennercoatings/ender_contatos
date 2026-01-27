# Script PowerShell para iniciar o projeto com Docker
# Execute: .\start.ps1

Write-Host "🐳 Iniciando aplicação com Docker..." -ForegroundColor Cyan

# Verificar se Docker está rodando
Write-Host "`n📋 Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker não está rodando!" -ForegroundColor Red
    Write-Host "Por favor, inicie o Docker Desktop e tente novamente." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker está rodando" -ForegroundColor Green

# Subir os serviços
Write-Host "`n🚀 Subindo serviços..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Serviços iniciados com sucesso!" -ForegroundColor Green
    Write-Host "`n📊 Status dos containers:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n🌐 Acesse a aplicação em:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:8080" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
    
    Write-Host "`n📝 Para ver os logs, execute:" -ForegroundColor Yellow
    Write-Host "   docker-compose logs -f" -ForegroundColor White
} else {
    Write-Host "`n❌ Erro ao iniciar os serviços" -ForegroundColor Red
    Write-Host "Verifique os logs com: docker-compose logs" -ForegroundColor Yellow
}
