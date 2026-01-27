# Changelog

## [1.0.0] - MVP Inicial

### Funcionalidades Implementadas

#### Backend
- ✅ API REST completa com NestJS
- ✅ Integração com PostgreSQL via Prisma ORM
- ✅ CRUD completo de contatos
- ✅ Busca global por qualquer campo (nome, empresa, email, telefone, cidade)
- ✅ Suporte a endereços comerciais e residenciais
- ✅ Validação de dados com class-validator
- ✅ CORS configurado para desenvolvimento

#### Frontend
- ✅ Interface React com Vite + TypeScript
- ✅ UI moderna com Material UI
- ✅ Lista de contatos com busca em tempo real
- ✅ Formulário de cadastro/edição com abas:
  - Dados Gerais
  - Endereço Comercial
  - Endereço Residencial
  - Observações
- ✅ Máscaras automáticas para telefone e CEP
- ✅ Auto-complete de UF
- ✅ Botões para copiar telefone/e-mail com 1 clique
- ✅ Dialog de visualização de detalhes
- ✅ Confirmação de exclusão
- ✅ Validação de formulários com React Hook Form + Yup

#### Infraestrutura
- ✅ Docker Compose para orquestração
- ✅ Dockerfiles para frontend e backend
- ✅ Configuração de Nginx para frontend
- ✅ Healthcheck para PostgreSQL
- ✅ Volumes persistentes para banco de dados

### Melhorias de UX em relação ao Fluig
- ✅ Busca sem reload da página
- ✅ Máscaras automáticas de telefone e CEP
- ✅ Auto-complete de UF
- ✅ Copiar telefone/e-mail com 1 clique
- ✅ Interface mais limpa e organizada
- ✅ Menos campos visíveis ao mesmo tempo (abas)

### Próximas Funcionalidades (Fora do MVP)
- [ ] Autenticação com JWT
- [ ] Workflow de aprovação
- [ ] Integrações externas
- [ ] Importação de dados do Fluig
- [ ] Exportação de contatos
- [ ] Histórico de alterações
