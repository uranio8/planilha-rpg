// scratch/find_tabs.js
const fs = require('fs');
const path = require('path');
const uiHtml = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'ui.html'), 'utf8');

const lines = uiHtml.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('tab-pane') || line.includes('switchTab(')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
  }
});
