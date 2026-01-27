# 🗄️ Guia de Migrações do Banco de Dados

## Problema: "The table does not exist"

Se você receber o erro **"The table `public.contatos` does not exist"**, significa que as migrações do Prisma não foram executadas.

## ✅ Solução Rápida

Execute as migrações manualmente:

```powershell
docker-compose exec api npx prisma migrate dev --name init
```

## 🔄 Executar Migrações

### Primeira vez (criar tabelas)

```powershell
docker-compose exec api npx prisma migrate dev --name init
```

### Migrações futuras (após mudanças no schema)

```powershell
docker-compose exec api npx prisma migrate dev
```

### Aplicar migrações pendentes (produção)

```powershell
docker-compose exec api npx prisma migrate deploy
```

## 🔍 Verificar Status

### Ver migrações aplicadas

```powershell
docker-compose exec api npx prisma migrate status
```

### Ver estrutura do banco

```powershell
docker-compose exec api npx prisma db pull
```

## 🛠️ Comandos Úteis

### Resetar banco (CUIDADO: apaga todos os dados!)

```powershell
docker-compose exec api npx prisma migrate reset
```

### Abrir Prisma Studio (interface visual)

```powershell
docker-compose exec api npx prisma studio
```

Acesse: http://localhost:5555

### Gerar cliente Prisma

```powershell
docker-compose exec api npx prisma generate
```

## 📝 Notas

- As migrações são executadas automaticamente no Dockerfile na inicialização
- Se o container for recriado, as migrações serão executadas novamente
- Os dados persistem no volume `postgres_data` do Docker

## ⚠️ Problemas Comuns

### Erro: "Migration already applied"

Isso é normal se a migração já foi executada. Ignore ou use `migrate deploy`.

### Erro: "Database connection failed"

Verifique se o container do banco está rodando:
```powershell
docker-compose ps db
```

### Erro: "Migration failed"

Verifique os logs:
```powershell
docker-compose logs api
```
