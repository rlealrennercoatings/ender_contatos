# 🐳 Como Rodar com Docker no Cursor

## Pré-requisitos

1. **Docker Desktop instalado e rodando**
   - Baixe em: https://www.docker.com/products/docker-desktop
   - Certifique-se de que o Docker Desktop está **rodando** (ícone na bandeja do sistema)

2. **Verificar se Docker está funcionando**
   - Abra o terminal no Cursor (Ctrl + ` ou Terminal > New Terminal)
   - Execute: `docker --version`
   - Execute: `docker-compose --version`

## 🚀 Passo a Passo

### 1. Abrir o Terminal no Cursor

- Pressione `Ctrl + `` (backtick) ou
- Menu: **Terminal > New Terminal**
- Ou use o atalho: **View > Terminal**

### 2. Navegar até a pasta do projeto (se necessário)

```powershell
cd C:\Users\rleal\Ender
```

### 3. Subir os serviços com Docker Compose

```powershell
docker-compose up -d
```

**O que acontece:**
- ✅ Baixa as imagens necessárias (PostgreSQL, Node.js, Nginx)
- ✅ Cria e inicia 3 containers:
  - `contatos_db` - Banco PostgreSQL
  - `contatos_api` - API NestJS
  - `contatos_web` - Frontend React
- ✅ Executa as migrações do banco automaticamente
- ✅ Inicia todos os serviços

**Primeira execução pode demorar 2-3 minutos** (download de imagens)

### 4. Verificar se está tudo rodando

```powershell
docker-compose ps
```

Você deve ver os 3 containers com status "Up"

### 5. Ver os logs (opcional)

```powershell
# Ver todos os logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

### 6. Acessar a aplicação

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432

## 📋 Comandos Úteis

### Parar os serviços
```powershell
docker-compose down
```

### Parar e remover volumes (limpar tudo)
```powershell
docker-compose down -v
```

### Reiniciar um serviço específico
```powershell
docker-compose restart api
docker-compose restart web
```

### Reconstruir as imagens (após mudanças no código)
```powershell
docker-compose up -d --build
```

### Entrar no container da API (para debug)
```powershell
docker-compose exec api sh
```

### Ver logs em tempo real
```powershell
docker-compose logs -f
```

### Verificar status dos containers
```powershell
docker-compose ps
```

## 🔧 Solução de Problemas

### Erro: "Cannot connect to Docker daemon"
- **Solução:** Abra o Docker Desktop e aguarde ele inicializar completamente

### Erro: "Port already in use"
- **Solução:** Pare o serviço que está usando a porta ou mude a porta no `docker-compose.yml`

### Erro: "Failed to execute migrations"
- **Solução:** Execute manualmente:
```powershell
docker-compose exec api npx prisma migrate dev
```

### Container não inicia
- **Solução:** Verifique os logs:
```powershell
docker-compose logs api
```

### Limpar tudo e começar do zero
```powershell
docker-compose down -v
docker-compose up -d --build
```

## 🎯 Workflow de Desenvolvimento

### Modo Desenvolvimento (com hot-reload)

Os containers estão configurados para desenvolvimento:
- **Backend:** Mudanças no código são refletidas automaticamente
- **Frontend:** Precisa reconstruir a imagem após mudanças

### Reconstruir após mudanças no código

```powershell
# Reconstruir e reiniciar
docker-compose up -d --build

# Ou apenas reiniciar (se não mudou dependências)
docker-compose restart
```

## 📝 Notas Importantes

1. **Primeira execução:** As migrações do Prisma são executadas automaticamente
2. **Dados persistem:** Os dados do banco ficam salvos no volume `postgres_data`
3. **Portas:** Certifique-se de que as portas 3000, 5432 e 8080 estão livres
4. **Performance:** No Windows, pode ser mais lento que Linux/Mac devido ao WSL2

## ✅ Checklist Rápido

- [ ] Docker Desktop instalado e rodando
- [ ] Terminal aberto no Cursor
- [ ] Navegou até a pasta do projeto
- [ ] Executou `docker-compose up -d`
- [ ] Verificou com `docker-compose ps`
- [ ] Acessou http://localhost:8080

## 🆘 Precisa de Ajuda?

Se algo não funcionar:
1. Verifique os logs: `docker-compose logs`
2. Verifique se Docker está rodando: `docker ps`
3. Tente reconstruir: `docker-compose up -d --build`
