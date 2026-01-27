-- CreateEnum
CREATE TYPE "TipoEndereco" AS ENUM ('COMERCIAL', 'RESIDENCIAL');

-- CreateTable
CREATE TABLE "contatos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cargo" VARCHAR(100),
    "empresa" VARCHAR(150),
    "website" VARCHAR(150),
    "email" VARCHAR(150),
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "contato_id" INTEGER NOT NULL,
    "tipo" "TipoEndereco" NOT NULL,
    "endereco" VARCHAR(200),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "cep" VARCHAR(15),
    "uf" VARCHAR(2),
    "pais" VARCHAR(50),
    "telefone1" VARCHAR(20),
    "telefone2" VARCHAR(20),
    "celular1" VARCHAR(20),
    "celular2" VARCHAR(20),

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_contato_id_fkey" FOREIGN KEY ("contato_id") REFERENCES "contatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
