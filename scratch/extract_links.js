const fs = require('fs');

const raw = fs.readFileSync('scratch/monstros_page.html', 'utf8');

// Find all <a href="/monstros/..." or similar
const re = /<a[^>]+href="(\/monstros\/[^"#\?]+)"[^>]*>([\s\S]*?)<\/a>/g;
let m;
const links = [];
while ((m = re.exec(raw)) !== null) {
  if (m[1].startsWith('/monstros/tipo') || m[1].startsWith('/monstros/nd') || m[1].startsWith('/monstros/tamanho')) continue;
  links.push({
    href: m[1],
    html: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  });
}

console.log('Monster links extracted:', links.length);
console.log('Sample links:', links.slice(0, 15));
