const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function inspect() {
  const bytes = fs.readFileSync('test_rendered_print.pdf');
  const doc = await PDFDocument.load(bytes);
  console.log('Total de páginas no PDF:', doc.getPageCount());
  
  // Vamos buscar por texto no arquivo latin1
  const raw = fs.readFileSync('test_rendered_print.pdf', 'latin1');
  console.log('Contém "Dica de Impressão"?', raw.includes('Dica de Impressão'));
  console.log('Contém "Mago 8 8"?', raw.includes('Mago 8 8'));
  console.log('Contém "Mago 8"?', raw.includes('Mago 8'));
  console.log('Contém "Arkhalis"?', raw.includes('Arkhalis'));
}
inspect();
