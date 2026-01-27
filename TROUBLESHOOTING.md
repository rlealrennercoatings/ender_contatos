# 🔧 Solução de Problemas - Docker

## Erro: "npm ci did not complete successfully"

### Problema
```
target api: failed to solve: process "/bin/sh -c npm ci" did not complete successfully: exit code: 1
```

### Solução

**Opção 1: Gerar package-lock.json (Recomendado)**
```powershell
cd backend
npm install
cd ..
docker-compose up -d --build
```

**Opção 2: Limpar cache do Docker e reconstruir**
```powershell
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

**Opção 3: Usar npm install ao invés de npm ci**
O Dockerfile já foi ajustado para tentar `npm ci` primeiro e usar `npm install` como fallback.

---

## Erro: "Port already in use"

### Problema
```
Error: bind: address already in use
```

### Solução

**Verificar o que está usando a porta:**
```powershell
# Porta 3000 (API)
netstat -ano | findstr :3000

# Porta 5432 (PostgreSQL)
netstat -ano | findstr :5432

# Porta 8080 (Frontend)
netstat -ano | findstr :8080
```

**Parar o processo ou alterar a porta no docker-compose.yml**

---

## Erro: "Cannot connect to Docker daemon"

### Problema
```
Cannot connect to the Docker daemon. Is the docker daemon running?
```

### Solução
1. Abra o **Docker Desktop**
2. Aguarde ele inicializar completamente (ícone na bandeja)
3. Verifique se está rodando: `docker ps`
4. Tente novamente

---

## Erro: "Prisma migrate failed"

### Problema
```
Error: P1001: Can't reach database server
```

### Solução

**Aguardar o banco inicializar:**
```powershell
# Verificar se o banco está pronto
docker-compose logs db

# Aguardar aparecer: "database system is ready to accept connections"
```

**Executar migrações manualmente:**
```powershell
docker-compose exec api npx prisma migrate dev
```

---

## Erro: "Module not found" no frontend

### Problema
```
Error: Cannot find module 'react-router-dom'
```

### Solução

**Gerar package-lock.json do frontend:**
```powershell
cd frontend
npm install
cd ..
docker-compose up -d --build web
```

---

## Container não inicia ou para imediatamente

### Solução

**Ver logs detalhados:**
```powershell
docker-compose logs api
docker-compose logs web
docker-compose logs db
```

**Reconstruir do zero:**
```powershell
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## Limpar tudo e começar do zero

```powershell
# Parar e remover tudo
docker-compose down -v

# Limpar imagens não usadas
docker system prune -a

# Reconstruir tudo
docker-compose build --no-cache
docker-compose up -d
```

---

## Verificar status dos containers

```powershell
docker-compose ps
```

Todos devem estar com status "Up" e health "healthy" (para o db).

---

## Comandos úteis de debug

```powershell
# Entrar no container da API
docker-compose exec api sh

# Entrar no container do banco
docker-compose exec db psql -U admin -d contatos

# Ver uso de recursos
docker stats

# Ver logs em tempo real
docker-compose logs -f

# Verificar variáveis de ambiente
docker-compose exec api env
```

---

## Problemas comuns no Windows

### WSL2 não está configurado
- Docker Desktop no Windows requer WSL2
- Instale o WSL2: `wsl --install`
- Reinicie o computador

### Permissões de arquivo
- Certifique-se de que o Docker Desktop tem acesso à pasta do projeto
- Settings > Resources > File Sharing

### Performance lenta
- Use WSL2 backend no Docker Desktop
- Settings > General > Use the WSL 2 based engine

---

## Ainda com problemas?

1. Verifique os logs: `docker-compose logs`
2. Verifique se Docker está rodando: `docker ps`
3. Tente reconstruir: `docker-compose up -d --build`
4. Limpe tudo e comece do zero (veja seção acima)
