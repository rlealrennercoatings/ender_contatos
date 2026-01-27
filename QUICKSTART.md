# ⚡ Início Rápido - Docker no Cursor

## 🎯 3 Passos Simples

### 1️⃣ Abrir Terminal no Cursor
- Pressione `Ctrl + `` (backtick)
- Ou: **Terminal > New Terminal**

### 2️⃣ Executar Docker Compose
```powershell
docker-compose up -d
```

### 3️⃣ Acessar a Aplicação
Abra no navegador: **http://localhost:8080**

---

## ✅ Verificar se está funcionando

```powershell
docker-compose ps
```

Deve mostrar 3 containers com status "Up":
- ✅ contatos_db
- ✅ contatos_api  
- ✅ contatos_web

---

## 🛑 Parar os serviços

```powershell
docker-compose down
```

---

## 📝 Scripts Úteis (PowerShell)

```powershell
.\start.ps1    # Iniciar tudo
.\stop.ps1     # Parar tudo
.\logs.ps1     # Ver logs
.\restart.ps1  # Reiniciar
```

---

## ❌ Problemas?

### Docker não está rodando?
- Abra o **Docker Desktop**
- Aguarde ele inicializar completamente
- Tente novamente

### Porta já em uso?
- Pare outros serviços usando as portas 3000, 5432 ou 8080
- Ou altere as portas no `docker-compose.yml`

### Ver logs de erro:
```powershell
docker-compose logs
```

---

📖 **Mais detalhes:** Veja [DOCKER.md](DOCKER.md)
