const XLSX = require('xlsx');

const workbook = XLSX.readFile('/app/Contatos.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('=== ESTRUTURA DO ARQUIVO ===');
console.log('Colunas:', Object.keys(data[0] || {}));
console.log('\nTotal de registros:', data.length);
console.log('\n=== PRIMEIROS 2 REGISTROS ===');
console.log(JSON.stringify(data.slice(0, 2), null, 2));
