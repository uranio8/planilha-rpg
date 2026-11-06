const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function inspect() {
  const bytes = fs.readFileSync('test_print_arkhalis.pdf');
  const doc = await PDFDocument.load(bytes);
  console.log('Total de páginas no PDF gerado pelo Chrome:', doc.getPageCount());
  const page1 = doc.getPage(0);
  console.log('Dimensões da Página 1:', page1.getWidth(), 'x', page1.getHeight());
}
inspect();
