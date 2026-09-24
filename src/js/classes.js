// src/js/classes.js - D&D 5E Class Progression & Skill Tree Module
// Renderizador interativo das 12 classes, árvores de habilidades e especializações 2024

let selectedClassId = 'barbaro';
let selectedSubclassIdx = 0;
let classLevelTierFilter = 'all';
let classSearchQuery = '';
let showProgressionTable = false;

function selectClass(classId) {
  selectedClassId = classId;
  selectedSubclassIdx = 0;
  classLevelTierFilter = 'all';
  renderClasses();
}

function selectSubclass(idx) {
  selectedSubclassIdx = idx;
  renderClasses();
}

function setClassTierFilter(tier) {
  classLevelTierFilter = tier;
  renderClasses();
}

function toggleClassProgressionTable() {
  showProgressionTable = !showProgressionTable;
  const tblContainer = document.getElementById('class-table-container');
  const btn = document.getElementById('btn-toggle-class-table');
  if (tblContainer) {
    tblContainer.style.display = showProgressionTable ? 'block' : 'none';
  }
  if (btn) {
    btn.innerText = showProgressionTable ? '🔼 Ocultar Tabela de Progressão (1-20)' : '📊 Ver Tabela Completa de Níveis (1-20)';
  }
}

function openSkillDetail(classId, featureIdx, isSubclass = false) {
  const cls = (typeof CLASSES_DATA !== 'undefined' ? CLASSES_DATA : []).find(c => c.id === classId);
  if (!cls) return;

  let feature = null;
  let subName = '';
  if (isSubclass) {
    const sub = cls.subclasses[selectedSubclassIdx];
    if (sub && sub.features[featureIdx]) {
      feature = sub.features[featureIdx];
      subName = ` • Especialização: ${sub.name}`;
    }
  } else {
    feature = cls.features[featureIdx];
  }

  if (!feature) return;

  const modal = document.getElementById('modal-skill-detail');
  if (!modal) return;

  const iconEl = document.getElementById('skill-modal-icon');
  if (iconEl) iconEl.innerText = cls.icon || '✨';

  document.getElementById('skill-modal-title').innerText = feature.name;
  document.getElementById('skill-modal-meta').innerHTML = `
    <span>${cls.icon} ${cls.name}</span>
    <span>•</span>
    <span>Nível ${feature.level}</span>
    ${subName ? `<span>${subName}</span>` : ''}
  `;

  const typeEl = document.getElementById('skill-modal-type');
  if (typeEl) {
    typeEl.className = isSubclass ? 'skill-tag-pill gold' : 'skill-tag-pill';
    typeEl.innerText = feature.type || (isSubclass ? 'Especialização' : 'Habilidade de Classe');
  }

  const descContainer = document.getElementById('skill-modal-desc');
  if (descContainer) {
    if (typeof formatFeatureToTopics === 'function') {
      descContainer.innerHTML = formatFeatureToTopics(feature.desc || '');
    } else {
      descContainer.innerHTML = `<div class="skill-concept-box">${(feature.desc || '').replace(/\n/g, '<br>')}</div>`;
    }
  }

  modal.classList.add('open');
}

function closeSkillModal() {
  const modal = document.getElementById('modal-skill-detail');
  if (modal) modal.classList.remove('open');
}

function renderClasses() {
  if (typeof CLASSES_DATA === 'undefined') return;

  const currentClass = CLASSES_DATA.find(c => c.id === selectedClassId) || CLASSES_DATA[0];
  if (!currentClass) return;

  // 1. Render Class Selector Pills / Tabs
  const selectorContainer = document.getElementById('classes-selector-grid');
  if (selectorContainer) {
    selectorContainer.innerHTML = CLASSES_DATA.map(c => `
      <button class="class-pill-btn ${c.id === currentClass.id ? 'active' : ''}" onclick="selectClass('${c.id}')">
        <span class="class-pill-icon">${c.icon}</span>
        <span class="class-pill-name">${c.name}</span>
      </button>
    `).join('');
  }

  // 2. Render Class Header Card
  const headerContainer = document.getElementById('class-header-summary');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="class-hero-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div class="class-hero-avatar">${currentClass.icon}</div>
            <div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <h2 style="margin: 0; font-size: 24px; font-family: var(--font-title); color: #fff;">${currentClass.name}</h2>
                <span class="badge badge-cls">${currentClass.role}</span>
              </div>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1; max-width: 680px; line-height: 1.4;">
                ${currentClass.summary}
              </p>
            </div>
          </div>
          <button id="btn-toggle-class-table" class="btn-action" style="font-size: 11px; padding: 6px 12px;" onclick="toggleClassProgressionTable()">
            ${showProgressionTable ? '🔼 Ocultar Tabela de Progressão (1-20)' : '📊 Ver Tabela Completa de Níveis (1-20)'}
          </button>
        </div>

        <div class="class-meta-grid">
          <div class="class-meta-box">
            <span class="meta-lbl">🎲 Dado de Vida</span>
            <b class="meta-val">${currentClass.hitDie}</b>
          </div>
          <div class="class-meta-box">
            <span class="meta-lbl">⭐ Atributo Primário</span>
            <b class="meta-val">${currentClass.primaryAbility}</b>
          </div>
          <div class="class-meta-box">
            <span class="meta-lbl">🛡️ Salvaguardas</span>
            <b class="meta-val">${currentClass.savingThrows.join(', ')}</b>
          </div>
          <div class="class-meta-box">
            <span class="meta-lbl">⚔️ Armaduras & Armas</span>
            <b class="meta-val" style="font-size: 11px;">${currentClass.armorProficiencies} • ${currentClass.weaponProficiencies}</b>
          </div>
          ${currentClass.weaponMastery ? `
          <div class="class-meta-box">
            <span class="meta-lbl">🎯 Maestria em Armas</span>
            <b class="meta-val">${currentClass.weaponMastery}</b>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 3. Render Level 1-20 Progression Table (Collapsible)
  const tableContainer = document.getElementById('class-table-container');
  if (tableContainer) {
    tableContainer.style.display = showProgressionTable ? 'block' : 'none';
    tableContainer.innerHTML = `
      <div class="card-panel" style="margin-bottom: 16px; overflow-x: auto;">
        <div class="panel-header">
          <span>Tabela Oficial de Evolução de Níveis • ${currentClass.name} (Níveis 1 ao 20)</span>
        </div>
        <table class="dnd-table" style="width: 100%; font-size: 11px; border-collapse: collapse;">
          <thead>
            <tr style="background: rgba(30, 41, 59, 0.8); color: var(--primary-light); text-align: left;">
              <th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Nível</th>
              <th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Prof.</th>
              <th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Habilidades e Recursos Desbloqueados</th>
              ${currentClass.progression[0].rages ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Fúrias</th><th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Dano Fúria</th>' : ''}
              ${currentClass.progression[0].slots ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Espaços de Magia</th>' : ''}
              ${currentClass.progression[0].cantrips ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Truques</th>' : ''}
              ${currentClass.progression[0].sneak ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Ataque Furtivo</th>' : ''}
              ${(currentClass.progression[0].ki || currentClass.progression[0].focus) ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Pontos de Ki</th>' : ''}
              ${(currentClass.progression[0].martialArts || currentClass.progression[0].die) ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Artes Marciais</th>' : ''}
              ${currentClass.progression[0].sp ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Pontos Feitiçaria</th>' : ''}
              ${currentClass.progression[0].invocations ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Invocações</th>' : ''}
              ${currentClass.progression[0].pactSlots ? '<th style="padding: 8px 10px; border-bottom: 1px solid var(--border-color);">Slots de Pacto</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${currentClass.progression.map(row => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); ${row.level % 2 === 0 ? 'background: rgba(255,255,255,0.02);' : ''}">
                <td style="padding: 6px 10px; font-weight: 700; color: #fff;">Nv ${row.level}</td>
                <td style="padding: 6px 10px; color: var(--primary-light);">${row.prof}</td>
                <td style="padding: 6px 10px; color: #e2e8f0;">${row.features}</td>
                ${row.rages ? `<td style="padding: 6px 10px; color: #fca5a5;">${row.rages}</td><td style="padding: 6px 10px; color: #fca5a5;">${row.rageDmg}</td>` : ''}
                ${row.slots ? `<td style="padding: 6px 10px; color: #93c5fd;">${row.slots}</td>` : ''}
                ${row.cantrips ? `<td style="padding: 6px 10px; color: #c084fc;">${row.cantrips}</td>` : ''}
                ${row.sneak ? `<td style="padding: 6px 10px; color: #f59e0b;">${row.sneak}</td>` : ''}
                ${(row.ki || row.focus) ? `<td style="padding: 6px 10px; color: #38bdf8;">${row.ki || row.focus}</td>` : ''}
                ${(row.martialArts || row.die) ? `<td style="padding: 6px 10px; color: #fbbf24;">${row.martialArts || row.die}</td>` : ''}
                ${row.sp ? `<td style="padding: 6px 10px; color: #e879f9;">${row.sp}</td>` : ''}
                ${row.invocations ? `<td style="padding: 6px 10px; color: #ec4899;">${row.invocations}</td>` : ''}
                ${row.pactSlots ? `<td style="padding: 6px 10px; color: #a855f7;">${row.pactSlots}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 4. Render Subclasses Pills
  const subContainer = document.getElementById('class-subclasses-pills');
  if (subContainer) {
    subContainer.innerHTML = currentClass.subclasses.map((s, idx) => `
      <button class="subclass-pill-btn ${idx === selectedSubclassIdx ? 'active' : ''}" onclick="selectSubclass(${idx})">
        <span>${s.icon}</span>
        <span>${s.name}</span>
      </button>
    `).join('');
  }

  // 5. Render Skill Tree (Nodes & Timeline)
  const treeContainer = document.getElementById('class-skill-tree');
  if (!treeContainer) return;

  const rawQ = document.getElementById('filter-class-search')?.value || '';
  const q = typeof normalizeStr === 'function' ? normalizeStr(rawQ) : rawQ.toLowerCase().trim();

  const activeSub = currentClass.subclasses[selectedSubclassIdx] || currentClass.subclasses[0];

  // Group all features by Tier / Level bracket
  const tiers = [
    { id: '1-4', title: '🌱 Patamar 1: Aprendiz & Origens (Níveis 1 a 4)', min: 1, max: 4 },
    { id: '5-10', title: '⚔️ Patamar 2: Heróis do Reino (Níveis 5 a 10)', min: 5, max: 10 },
    { id: '11-16', title: '👑 Patamar 3: Mestres do Mundo (Níveis 11 a 16)', min: 11, max: 16 },
    { id: '17-20', title: '⚡ Patamar 4: Lendas Épicas do Multiverso (Níveis 17 a 20)', min: 17, max: 20 }
  ];

  const filteredTiers = tiers.filter(t => classLevelTierFilter === 'all' || classLevelTierFilter === t.id);

  treeContainer.innerHTML = filteredTiers.map(t => {
    // Base features in this tier
    const baseFeatures = currentClass.features.filter(f => f.level >= t.min && f.level <= t.max && (!q || normalizeStr(f.name).includes(q) || normalizeStr(f.desc).includes(q)));

    // Subclass features in this tier
    const subFeatures = activeSub.features.filter(f => f.level >= t.min && f.level <= t.max && (!q || normalizeStr(f.name).includes(q) || normalizeStr(f.desc).includes(q)));

    if (baseFeatures.length === 0 && subFeatures.length === 0 && q) {
      return '';
    }

    return `
      <div class="tree-tier-block">
        <div class="tree-tier-header">
          <span>${t.title}</span>
          <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 10px;">${baseFeatures.length + subFeatures.length} poderes</span>
        </div>

        <div class="tree-nodes-container">
          <!-- Habilidades Base da Classe -->
          <div class="tree-branch-column">
            <div class="branch-label">📚 Habilidades Essenciais de ${currentClass.name}</div>
            <div class="tree-nodes-grid">
              ${baseFeatures.length > 0 ? baseFeatures.map(f => {
                const fIdx = currentClass.features.findIndex(x => x.name === f.name);
                return `
                  <div class="skill-node-card base-skill" onclick="openSkillDetail('${currentClass.id}', ${fIdx}, false)">
                    <div class="node-header">
                      <span class="node-lvl">Nv ${f.level}</span>
                      <span class="node-type">${f.type || 'Classe'}</span>
                    </div>
                    <div class="node-title">${f.name}</div>
                    <div class="node-snippet">${(f.desc || '').replace(/<[^>]+>/g, '').substring(0, 110)}...</div>
                    <div class="node-footer">
                      <span>📖 Ver detalhes das regras</span>
                      <span>➔</span>
                    </div>
                  </div>
                `;
              }).join('') : '<div style="color: var(--text-dim); font-size: 12px; padding: 8px;">Nenhuma habilidade base neste patamar.</div>'}
            </div>
          </div>

          <!-- Ramo de Especialização / Subclasse -->
          <div class="tree-branch-column sub-branch">
            <div class="branch-label" style="color: var(--accent-gold);">
              ${activeSub.icon} Ramo de Especialização: ${activeSub.name}
            </div>
            <div class="tree-nodes-grid">
              ${subFeatures.length > 0 ? subFeatures.map(f => {
                const fIdx = activeSub.features.findIndex(x => x.name === f.name);
                return `
                  <div class="skill-node-card sub-skill" onclick="openSkillDetail('${currentClass.id}', ${fIdx}, true)">
                    <div class="node-header">
                      <span class="node-lvl sub-lvl">Nv ${f.level}</span>
                      <span class="node-type" style="color: var(--accent-gold); border-color: rgba(245,158,11,0.4);">Subclasse</span>
                    </div>
                    <div class="node-title" style="color: var(--accent-gold);">${f.name}</div>
                    <div class="node-snippet">${(f.desc || '').replace(/<[^>]+>/g, '').substring(0, 110)}...</div>
                    <div class="node-footer">
                      <span style="color: var(--accent-gold);">⚡ Regra da Especialização</span>
                      <span>➔</span>
                    </div>
                  </div>
                `;
              }).join('') : '<div style="color: var(--text-dim); font-size: 12px; padding: 8px;">Esta subclasse não possui poderes adicionais neste patamar.</div>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
