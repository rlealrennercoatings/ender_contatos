# Guia de Configuração - MVP Contatos

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)
- npm ou yarn

## Configuração Inicial

### 1. Usando Docker Compose (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

**Nota:** Na primeira execução, será necessário executar as migrações do Prisma:

```bash
# Entrar no container da API
docker-compose exec api sh

# Executar migrações
npm run prisma:migrate dev --name init
```

### 2. Desenvolvimento Local

#### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate dev

# Iniciar servidor de desenvolvimento
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env (opcional)
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar servidor de desenvolvimento
npm run dev
```

## Acessos

- **Frontend:** http://localhost:8080 (Docker) ou http://localhost:5173 (dev)
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432
  - Usuário: admin
  - Senha: admin
  - Database: contatos

## Estrutura de Dados

### Tabela: contatos
- id (PK)
- nome
- cargo
- empresa
- website
- email
- observacoes
- created_at
- updated_at

### Tabela: enderecos
- id (PK)
- contato_id (FK)
- tipo (COMERCIAL | RESIDENCIAL)
- endereco
- bairro
- cidade
- cep
- uf
- pais
- telefone1, telefone2
- celular1, celular2

## API Endpoints

- `GET /contatos?search=` - Lista contatos (com busca opcional)
- `GET /contatos/:id` - Detalhes de um contato
- `POST /contatos` - Criar novo contato
- `PATCH /contatos/:id` - Atualizar contato
- `DELETE /contatos/:id` - Excluir contato

## Próximos Passos

1. Executar migrações do banco de dados
2. Testar criação de contatos
3. Validar busca global
4. Configurar deploy em servidor interno
