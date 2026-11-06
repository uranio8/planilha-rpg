const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function checkMetadata() {
  const bytes = fs.readFileSync('test_print_arkhalis.pdf');
  const doc = await PDFDocument.load(bytes);
  console.log('Title:', doc.getTitle());
  console.log('Producer:', doc.getProducer());
  console.log('Creator:', doc.getCreator());
}
checkMetadata();
