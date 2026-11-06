const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function checkPages() {
  const bytes = fs.readFileSync('test_print_arkhalis.pdf');
  const doc = await PDFDocument.load(bytes);
  console.log('Número de páginas:', doc.getPageCount());
  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    console.log(`Página ${i+1}: size = ${page.getWidth()} x ${page.getHeight()}`);
  }
}
checkPages();
