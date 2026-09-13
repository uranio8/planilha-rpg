const fs = require('fs');

const html = fs.readFileSync('scratch/aboleth.html', 'utf8');

// Look for meta og:description or description
const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
console.log('Meta Description:', descMatch ? descMatch[1] : 'none');

// Look for JSON-LD schema
const jsonLdMatch = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
if (jsonLdMatch) {
  jsonLdMatch.forEach((j, idx) => {
    console.log(`JSON-LD ${idx}:`, j.replace(/<[^>]+>/g, '').trim());
  });
}

// Let's check the stat block structure in HTML
const speedMatch = html.match(/Movimento\s*([^<]+)/i);
console.log('Movimento match:', speedMatch ? speedMatch[1].trim() : 'none');

// Check traits & actions
const actionsMatch = html.match(/<h2[^>]*>Ações<\/h2>([\s\S]*?)(<h2|<\/section|<footer)/i);
if (actionsMatch) {
  const clean = actionsMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Clean Actions:', clean);
}
