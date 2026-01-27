FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema necessárias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
# Tenta npm ci primeiro (mais rápido e confiável), senão usa npm install
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps || npm install; else npm install; fi

# Copiar o resto dos arquivos
COPY . .

EXPOSE 3000

# Para desenvolvimento - aguarda a variável DATABASE_URL estar definida
CMD ["sh", "-c", "npx prisma generate && sleep 5 && (npx prisma migrate deploy || npx prisma migrate dev --name init) && npm run start:dev"]
