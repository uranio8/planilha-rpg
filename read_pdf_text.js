const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function inspectContents() {
  const bytes = fs.readFileSync('test_print_arkhalis.pdf');
  const doc = await PDFDocument.load(bytes);
  console.log('Pages count:', doc.getPageCount());
  
  // Imprime os streams de cada página
  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { Contents } = page.node.normalizedEntries();
    console.log(`Page ${i+1} has Contents:`, !!Contents);
    // Extrai strings do stream de conteúdo
    const rawStreams = page.node.getContentStreams();
    let text = '';
    for (const stream of rawStreams) {
      const decoded = stream.decode();
      const str = Buffer.from(decoded).toString('latin1');
      // Procura textos entre parênteses Tj ou TJ
      const matches = str.match(/\(([^)]+)\)\s*Tj/g) || [];
      text += matches.map(m => m.replace(/[()]/g, '').replace(/\s*Tj/, '')).join(' ');
    }
    console.log(`Page ${i+1} sample text (first 200 chars):`, text.slice(0, 200));
    console.log(`Page ${i+1} text length:`, text.length);
  }
}
inspectContents();
