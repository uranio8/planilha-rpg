const https = require('https');
const fs = require('fs');
const path = require('path');

const pdfParse = require('C:/Users/wesle/.gemini/antigravity/brain/af6c428c-52d4-4f6e-be21-9a3c1ce8922a/scratch/node_modules/pdf-parse');
const { PDFDocument } = require('../node_modules/pdf-lib');

const BOOKS_DIR = __dirname;
const PDFS_DIR = path.join(BOOKS_DIR, 'pdfs');
const INDEX_DIR = path.join(BOOKS_DIR, 'index');

fs.mkdirSync(PDFS_DIR, { recursive: true });
fs.mkdirSync(INDEX_DIR, { recursive: true });

const DRIVE_FILES = [
  { id: '1ClwtX9lURMfO62rurBkdRsC6UZTAGUyn', fallbackSlug: 'livro_01_guia_do_mestre' },
  { id: '11V7wNfJKqmKh6BNeZ66WaH8lNZknah3u', fallbackSlug: 'livro_02' },
  { id: '1E89LGtMXptIhG3SXdMwTvwUH8gO9B--a', fallbackSlug: 'livro_03' },
  { id: '1jbN6PGOXsp0gTlttLV784GbYfDWJGScx', fallbackSlug: 'livro_04' },
  { id: '1fSbAPLOlZZ7qAZawHyWikoF54NFp5lRA', fallbackSlug: 'livro_05' },
  { id: '1W2or33HEmuYX8p81y5sYUA2_g_TDVMFu', fallbackSlug: 'livro_06' },
  { id: '14_cGPhpkrDTXfr_6Yh1IW6oru2GaDt1k', fallbackSlug: 'livro_07' },
  { id: '1bib-CCd9b5qyVEQBaos6T92VowqWXtnS', fallbackSlug: 'livro_08' }
];

function sanitizeFilename(name) {
  return String(name || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\.pdf$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function parseContentDispositionFilename(header) {
  if (!header) return null;
  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try { return decodeURIComponent(utf8Match[1]); } catch (e) {}
  }
  const stdMatch = header.match(/filename="([^"]+)"/i) || header.match(/filename=([^;]+)/i);
  if (stdMatch) return stdMatch[1].trim();
  return null;
}

function downloadDriveFile(fileId, tempDest, redirects = 0, discoveredName = null) {
  return new Promise((resolve, reject) => {
    if (redirects > 10) return reject(new Error('Too many redirects for ' + fileId));
    const url = redirects === 0
      ? `https://drive.google.com/uc?export=download&id=${fileId}`
      : fileId;

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Connection': 'close' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(downloadDriveFile(res.headers.location, tempDest, redirects + 1, discoveredName));
      }
      const contentType = res.headers['content-type'] || '';
      const cdName = parseContentDispositionFilename(res.headers['content-disposition']);
      const finalName = cdName || discoveredName;

      if (contentType.includes('text/html')) {
        let html = '';
        res.on('data', d => html += d.toString());
        res.on('end', () => {
          const matchConfirm = html.match(/name="confirm" value="([^"]+)"/);
          const matchUuid = html.match(/name="uuid" value="([^"]+)"/);
          const matchId = html.match(/name="id" value="([^"]+)"/);
          const matchTitle = html.match(/<span class="uc-name-size"><a [^>]*>([^<]+)<\/a>/i);
          const htmlFileName = matchTitle ? matchTitle[1].trim() : finalName;

          if (matchConfirm && matchUuid) {
            const realId = matchId ? matchId[1] : fileId;
            const dlUrl = `https://drive.usercontent.google.com/download?id=${realId}&export=download&confirm=${matchConfirm[1]}&uuid=${matchUuid[1]}`;
            return resolve(downloadDriveFile(dlUrl, tempDest, redirects + 1, htmlFileName));
          } else {
            return reject(new Error(`Unexpected HTML response for ${fileId}: ${html.slice(0, 300)}`));
          }
        });
        return;
      }

      const file = fs.createWriteStream(tempDest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          resolve({ path: tempDest, originalName: finalName, size: fs.statSync(tempDest).size });
        });
      });
    }).on('error', reject);
  });
}

async function extractPdfIndex(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  let meta = {};
  try {
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    meta = {
      title: doc.getTitle() || null,
      author: doc.getAuthor() || null,
      subject: doc.getSubject() || null,
      creator: doc.getCreator() || null,
      producer: doc.getProducer() || null,
      pageCount: doc.getPageCount()
    };
  } catch (e) {
    meta = { error: e.message };
  }

  const pages = [];
  const options = {
    pagerender: function(pageData) {
      return pageData.getTextContent().then(function(textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        pages.push({ page: pages.length + 1, text: text.trim() });
        return text;
      });
    }
  };

  try {
    await pdfParse(buf, options);
  } catch (err) {
    console.error('Warning during pdfParse on', pdfPath, err.message);
  }

  const nonEmptyPages = pages.filter(p => p.text.length > 20).length;
  const totalChars = pages.reduce((acc, p) => acc + p.text.length, 0);

  return { meta, pages, nonEmptyPages, totalChars };
}

(async () => {
  const catalogPath = path.join(INDEX_DIR, 'catalog.json');
  let existingCatalog = [];
  if (fs.existsSync(catalogPath)) {
    try { existingCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')); } catch (e) {}
  }

  const catalog = [];

  for (let i = 0; i < DRIVE_FILES.length; i++) {
    const item = DRIVE_FILES[i];
    const cached = existingCatalog.find(c => c.driveId === item.id);
    if (cached && fs.existsSync(path.join(BOOKS_DIR, '..', cached.pdfFile))) {
      console.log(`⚡ [${i + 1}/${DRIVE_FILES.length}] Já indexado: ${cached.originalName} (${cached.pageCount} págs, ${cached.sizeMB} MB)`);
      cached.index = i + 1;
      catalog.push(cached);
      continue;
    }

    console.log(`\n======================================================`);
    console.log(`📥 [${i + 1}/${DRIVE_FILES.length}] Baixando Drive ID: ${item.id}`);

    const tempPath = path.join(PDFS_DIR, `_temp_${item.id}.pdf`);
    let originalName = `${item.fallbackSlug}.pdf`;

    const dlInfo = await downloadDriveFile(item.id, tempPath);
    if (dlInfo.originalName) originalName = dlInfo.originalName;

    const slug = sanitizeFilename(originalName) || item.fallbackSlug;
    const finalPdfPath = path.join(PDFS_DIR, `${slug}.pdf`);
    if (fs.existsSync(finalPdfPath) && finalPdfPath !== tempPath) {
      fs.unlinkSync(finalPdfPath);
    }
    fs.renameSync(tempPath, finalPdfPath);
    const sizeBytes = fs.statSync(finalPdfPath).size;
    console.log(`✅ Salvo em: books/pdfs/${slug}.pdf (${(sizeBytes / 1024 / 1024).toFixed(2)} MB) | Nome Original: ${originalName}`);

    console.log(`🔍 Extraindo e indexando páginas de ${slug}.pdf...`);
    const { meta, pages, nonEmptyPages, totalChars } = await extractPdfIndex(finalPdfPath);

    const pagesJsonPath = path.join(INDEX_DIR, `${slug}_pages.json`);
    const fullTxtPath = path.join(INDEX_DIR, `${slug}_full.txt`);
    fs.writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 2), 'utf8');
    fs.writeFileSync(fullTxtPath, pages.map(p => `=== PÁGINA ${p.page} ===\n${p.text}`).join('\n\n'), 'utf8');

    const samplePages = pages.filter(p => p.text.length > 40).slice(0, 5).map(p => ({
      page: p.page,
      preview: p.text.slice(0, 1200)
    }));

    const entry = {
      index: i + 1,
      driveId: item.id,
      originalName,
      slug,
      pdfFile: `books/pdfs/${slug}.pdf`,
      pagesJsonFile: `books/index/${slug}_pages.json`,
      fullTxtFile: `books/index/${slug}_full.txt`,
      sizeMB: Number((sizeBytes / 1024 / 1024).toFixed(2)),
      pageCount: meta.pageCount || pages.length,
      extractedPages: pages.length,
      nonEmptyPages,
      totalChars,
      meta,
      samplePages
    };

    catalog.push(entry);
    console.log(`📚 Indexado: ${entry.pageCount} páginas (${nonEmptyPages} com texto extraível, ${totalChars} caracteres).`);
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`\n🎉 Catálogo de ${catalog.length} livros salvo em: ${catalogPath}`);
  process.exit(0);
})();
