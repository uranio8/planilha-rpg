const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'raw_classes/barbaro.html'), 'utf8');

const entryMatch = html.match(/<div class=['"]entry['"]>([\s\S]*?)<div class=['"]post-footer/i) || html.match(/<div class=['"]entry['"]>([\s\S]*?)<div style=['"]clear:\s*both;/i);

if (entryMatch) {
  const content = entryMatch[1];
  console.log('Entry content found! Length:', content.length);

  // Search for tables
  const tables = content.match(/<table[\s\S]*?<\/table>/gi) || [];
  console.log('Tables found in entry:', tables.length);
  if (tables.length > 0) {
    console.log('\n--- TABLE 1 PREVIEW ---\n', tables[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 400));
  }

  // Search for h2, h3, h4, or strong/b tags
  const headers = [...content.matchAll(/<(h[1-6]|b|strong)[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => m[2].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('\nHeaders / Bold elements found (first 25):', headers.slice(0, 25));
} else {
  console.log('No entry match');
}
