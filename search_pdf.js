const fs = require('fs');

const str = fs.readFileSync('test_print_arkhalis.pdf', 'latin1');
// Procura por blocos de texto
const matches = str.match(/\/Type\s*\/Page[^]*?\/Contents/g);
console.log('Page objects count:', matches ? matches.length : 0);

// Vamos procurar por trechos específicos de texto no PDF inteiro
const keywords = [
  'Dica de Impressão',
  'Arkhalis',
  'Mago',
  'INVENTÁRIO',
  'CARACTERÍSTICAS',
  'ESPAÇOS DE MAGIA',
  'DIÁRIO DE MISSÕES'
];

keywords.forEach(k => {
  console.log(`Keyword "${k}":`, str.includes(k) ? 'FOUND' : 'NOT FOUND');
});
