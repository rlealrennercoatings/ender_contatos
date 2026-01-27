#!/bin/sh

echo "⏳ Aguardando banco de dados..."
sleep 5

echo "🔄 Gerando cliente Prisma..."
npx prisma generate

echo "🔄 Executando migrações..."
npx prisma migrate deploy || npx prisma migrate dev --name init

echo "✅ Iniciando servidor..."
npm run start:dev
