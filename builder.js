// builder.js - Compiles the complete RPG Sheet application from modular sources in src/
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');

const headCss = fs.readFileSync(path.join(srcDir, 'styles', 'head_css.html'), 'utf8');
const ui = fs.readFileSync(path.join(srcDir, 'ui', 'ui.html'), 'utf8');

// Datasets
const dataMonsters = fs.readFileSync(path.join(srcDir, 'data', 'monsters.js'), 'utf8');
const dataSpells = fs.readFileSync(path.join(srcDir, 'data', 'spells.js'), 'utf8');
const dataEquip = fs.readFileSync(path.join(srcDir, 'data', 'equipment.js'), 'utf8');
const dataClasses = fs.readFileSync(path.join(srcDir, 'data', 'classes.js'), 'utf8');
const dataSpecies = fs.readFileSync(path.join(srcDir, 'data', 'species.js'), 'utf8');
const dataCampaigns = fs.readFileSync(path.join(srcDir, 'data', 'campaigns.js'), 'utf8');
const dataRulesXp = fs.readFileSync(path.join(srcDir, 'data', 'rules_xp.js'), 'utf8');

// Modular App Logic
const jsQrCode = fs.readFileSync(path.join(srcDir, 'js', 'qrcode_lib.js'), 'utf8');
const jsCore = fs.readFileSync(path.join(srcDir, 'js', 'core.js'), 'utf8');
const jsCombat = fs.readFileSync(path.join(srcDir, 'js', 'combat.js'), 'utf8');
const jsPlayers = fs.readFileSync(path.join(srcDir, 'js', 'players.js'), 'utf8');
const jsCompendium = fs.readFileSync(path.join(srcDir, 'js', 'compendium.js'), 'utf8');
const jsClasses = fs.readFileSync(path.join(srcDir, 'js', 'classes.js'), 'utf8');
const jsSpecies = fs.readFileSync(path.join(srcDir, 'js', 'species.js'), 'utf8');
const jsCampaigns = fs.readFileSync(path.join(srcDir, 'js', 'campaigns.js'), 'utf8');
const jsAudioSynth = fs.readFileSync(path.join(srcDir, 'js', 'audio_synth.js'), 'utf8');
const jsDice = fs.readFileSync(path.join(srcDir, 'js', 'dice_roller.js'), 'utf8');
const jsGrid = fs.readFileSync(path.join(srcDir, 'js', 'vtt_grid.js'), 'utf8');
const jsScreen = fs.readFileSync(path.join(srcDir, 'js', 'screen_sync.js'), 'utf8');
const jsFirebase = fs.readFileSync(path.join(srcDir, 'js', 'firebase_sync.js'), 'utf8');

const finalHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
${headCss}
  <!-- Google Firebase SDK Compat (Nuvem em Tempo Real) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
</head>
<body>
${ui}
<script>
${dataMonsters}
${dataSpells}
${dataEquip}
${dataClasses}
${dataSpecies}
${dataCampaigns}
${dataRulesXp}
${jsAudioSynth}
${jsQrCode}
${jsCore}
${jsFirebase}
${jsCombat}
${jsPlayers}
${jsCompendium}
${jsClasses}
${jsSpecies}
${jsCampaigns}
${jsDice}
${jsGrid}
${jsScreen}

// Inicialização automática do Firebase se configurado
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initFirebaseSync === 'function') {
    initFirebaseSync();
  }
});
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(rootDir, 'planilha do rpg.html'), finalHtml, 'utf8');
fs.writeFileSync(path.join(rootDir, 'index.html'), finalHtml, 'utf8');
console.log('✅ planilha do rpg.html e index.html geradas com sucesso! Tamanho:', (fs.statSync(path.join(rootDir, 'index.html')).size / 1024).toFixed(1) + ' KB');
