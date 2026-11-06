const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function checkMetadata() {
  const bytes = fs.readFileSync('C:\\Users\\wesle\\.gemini\\antigravity\\brain\\af6c428c-52d4-4f6e-be21-9a3c1ce8922a\\.user_uploaded\\media_1793969658640_26f3a59f.pdf');
  const doc = await PDFDocument.load(bytes);
  console.log('Title:', doc.getTitle());
  console.log('Author:', doc.getAuthor());
  console.log('Producer:', doc.getProducer());
  console.log('Creator:', doc.getCreator());
  console.log('CreationDate:', doc.getCreationDate());
  console.log('ModificationDate:', doc.getModificationDate());
}
checkMetadata();
