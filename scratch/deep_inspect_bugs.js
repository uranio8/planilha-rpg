// scratch/deep_inspect_bugs.js - Deep inspection of ID mismatches and missing logic
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const uiHtml = fs.readFileSync(path.join(srcDir, 'ui', 'ui.html'), 'utf8');

const checks = [
  { name: 'DM Notes', search: 'dm-notes' },
  { name: 'Quick Init Modal', search: 'quick-init' },
  { name: 'Encounter Builder', search: 'encounter' },
  { name: 'Encounter Builder Modal', search: 'enc-' },
  { name: 'Timer Bar', search: 'timer' },
  { name: 'Class Table', search: 'table' },
  { name: 'FoW Opacity', search: 'opacity' }
];

checks.forEach(c => {
  console.log(`\n=== CHECK: ${c.name} (term: "${c.search}") ===`);
  const lines = uiHtml.split('\n');
  lines.forEach((l, idx) => {
    if (l.toLowerCase().includes(c.search.toLowerCase())) {
      console.log(`Line ${idx + 1}: ${l.trim()}`);
    }
  });
});
