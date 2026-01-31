-- CreateEnum
CREATE TYPE "TipoTelefone" AS ENUM ('CELULAR', 'FIXO');

-- AlterTable
ALTER TABLE "enderecos" ADD COLUMN "apelido" VARCHAR(100);

-- CreateTable
CREATE TABLE "telefones" (
    "id" SERIAL NOT NULL,
    "endereco_id" INTEGER NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "tipo" "TipoTelefone" NOT NULL,

    CONSTRAINT "telefones_pkey" PRIMARY KEY ("id")
);

-- Migrate existing phone data from enderecos to telefones table
INSERT INTO "telefones" ("endereco_id", "numero", "tipo")
SELECT "id", "telefone1", 'FIXO' FROM "enderecos" WHERE "telefone1" IS NOT NULL;

INSERT INTO "telefones" ("endereco_id", "numero", "tipo")
SELECT "id", "telefone2", 'FIXO' FROM "enderecos" WHERE "telefone2" IS NOT NULL;

INSERT INTO "telefones" ("endereco_id", "numero", "tipo")
SELECT "id", "celular1", 'CELULAR' FROM "enderecos" WHERE "celular1" IS NOT NULL;

INSERT INTO "telefones" ("endereco_id", "numero", "tipo")
SELECT "id", "celular2", 'CELULAR' FROM "enderecos" WHERE "celular2" IS NOT NULL;

-- DropColumn (remove old phone columns)
ALTER TABLE "enderecos" DROP COLUMN "telefone1";
ALTER TABLE "enderecos" DROP COLUMN "telefone2";
ALTER TABLE "enderecos" DROP COLUMN "celular1";
ALTER TABLE "enderecos" DROP COLUMN "celular2";

-- AddForeignKey
ALTER TABLE "telefones" ADD CONSTRAINT "telefones_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "enderecos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

