const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('🗑️  Limpando banco de dados...');
    await prisma.contato.deleteMany({});
    console.log('✅ Banco limpo! Todos os contatos foram deletados.');
  } catch (erro) {
    console.error('❌ Erro ao limpar:', erro.message);
  } finally {
    await prisma.$disconnect();
  }
})();
