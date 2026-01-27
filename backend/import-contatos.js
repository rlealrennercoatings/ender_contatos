const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importarContatos() {
  try {
    console.log('📖 Lendo arquivo Excel...');
    const workbook = XLSX.readFile('/app/Contatos.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 Total de registros encontrados: ${dados.length}`);
    console.log('');

    let contatosImportados = 0;
    let contatosSkipped = 0;
    const erros = [];

    for (const row of dados) {
      try {
        // Validar se tem nome
        if (!row.Nome || !row.Nome.trim()) {
          contatosSkipped++;
          continue;
        }

        // Extrair informações do contato
        let nome = (row.Nome && row.Nome.trim() ? row.Nome.trim() : '');
        if (nome.length > 150) {
          nome = nome.substring(0, 140) + '...';
        }
        
        const cargo = (row.Cargo && row.Cargo.trim() ? row.Cargo.trim() : null)?.substring(0, 100) || null;
        const empresa = (row.Empresa && row.Empresa.trim() ? row.Empresa.trim() : null)?.substring(0, 150) || null;
        const website = (row.Website && row.Website.trim() ? row.Website.trim() : null)?.substring(0, 150) || null;
        const email = (row['E-mail'] && row['E-mail'].trim() ? row['E-mail'].trim() : null)?.substring(0, 150) || null;
        const observacoes = (row['Informações Gerais'] && row['Informações Gerais'].trim() ? row['Informações Gerais'].trim() : null)?.substring(0, 1000) || null;

        // Criar contato
        const contato = await prisma.contato.create({
          data: {
            nome,
            cargo,
            empresa,
            website,
            email,
            observacoes,
            enderecos: {
              create: [
                // Endereço Comercial
                ...(row['Endereço Comercial'] && row['Endereço Comercial'].trim()
                  ? [
                      {
                        apelido: 'Comercial',
                        tipo: 'COMERCIAL',
                        endereco: row['Endereço Comercial'].trim().substring(0, 200),
                        cep: (row['Cep Comercial'] && row['Cep Comercial'].trim() ? row['Cep Comercial'].trim() : null)?.substring(0, 15),
                        pais: (row['Pais Comercial'] && row['Pais Comercial'].trim() ? row['Pais Comercial'].trim() : 'Brasil')?.substring(0, 50),
                        telefones: {
                          create: extrairTelefones(row['Telefone Comercial 1'], 'FIXO'),
                        },
                      },
                    ]
                  : []),

                // Endereço Residencial
                ...(row['Endereço Residencial'] && row['Endereço Residencial'].trim()
                  ? [
                      {
                        apelido: 'Residencial',
                        tipo: 'RESIDENCIAL',
                        endereco: row['Endereço Residencial'].trim().substring(0, 200),
                        cep: (row['Cep Residencial'] && row['Cep Residencial'].trim() ? row['Cep Residencial'].trim() : null)?.substring(0, 15),
                        pais: (row['Pais Residencial'] && row['Pais Residencial'].trim() ? row['Pais Residencial'].trim() : 'Brasil')?.substring(0, 50),
                        telefones: {
                          create: [
                            ...extrairTelefones(row['Telefone Residencial 1'], 'FIXO'),
                            ...extrairTelefones(row['Celular Residencial 1'], 'CELULAR'),
                          ],
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        });

        contatosImportados++;

        if (contatosImportados % 100 === 0) {
          console.log(`✅ ${contatosImportados} contatos importados...`);
        }
      } catch (erro) {
        // Tentar identificar qual campo causou o erro
        let campoProblematico = 'desconhecido';
        if (erro.message.includes('nome')) campoProblematico = 'nome';
        else if (erro.message.includes('cargo')) campoProblematico = 'cargo';
        else if (erro.message.includes('empresa')) campoProblematico = 'empresa';
        else if (erro.message.includes('email')) campoProblematico = 'email';
        
        // Se for erro de tamanho de campo, silenciar
        if (erro.message.includes('too long')) {
          contatosSkipped++;
        } else {
          erros.push({
            nome: row.Nome,
            erro: erro.message,
          });
        }
      }
    }

    console.log('');
    console.log('=== RESULTADO DA IMPORTAÇÃO ===');
    console.log(`✅ Contatos importados: ${contatosImportados}`);
    console.log(`⏭️  Contatos pulados (sem nome): ${contatosSkipped}`);
    console.log(`❌ Erros: ${erros.length}`);

    if (erros.length > 0) {
      console.log('\n=== PRIMEIROS 5 ERROS ===');
      erros.slice(0, 5).forEach((e) => {
        console.log(`- ${e.nome}: ${e.erro}`);
      });
    }
  } catch (erro) {
    console.error('❌ Erro na importação:', erro.message);
  } finally {
    await prisma.$disconnect();
  }
}

function extrairTelefones(telefoneCampo, tipo) {
  if (!telefoneCampo || !telefoneCampo.trim()) {
    return [];
  }

  // Limpar o campo de telefone
  const telefoneStr = telefoneCampo.trim();

  // Extrair números (procura por padrões como "51 3225 9466" ou "51 9 8888 8888")
  const numeros = telefoneStr.match(/\d+/g);

  if (!numeros || numeros.length === 0) {
    return [];
  }

  // Juntar números encontrados e validar
  const telefoneLimpo = numeros.join('');

  // Se tem pelo menos 10 dígitos (padrão brasileiro)
  if (telefoneLimpo.length >= 10) {
    return [
      {
        numero: telefoneLimpo,
        tipo: tipo,
      },
    ];
  }

  return [];
}

importarContatos();
