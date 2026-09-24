// ==========================================
// 🧬 D&D 5E 2024 - MÓDULO DE RAÇAS E ESPÉCIES
// ==========================================

let activeSpeciesId = 'anao';
let activeLineageIdx = 0;
let speciesSearchQuery = '';
let speciesFilterSize = 'all';

function escapeSpeciesHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSpecies() {
  const container = document.getElementById('species-container');
  if (!container) return;

  const filteredSpecies = SPECIES_DATA.filter(sp => {
    const matchesSearch = !speciesSearchQuery || 
      sp.name.toLowerCase().includes(speciesSearchQuery.toLowerCase()) ||
      sp.description.toLowerCase().includes(speciesSearchQuery.toLowerCase()) ||
      (sp.traits && sp.traits.some(t => t.name.toLowerCase().includes(speciesSearchQuery.toLowerCase()) || t.description.toLowerCase().includes(speciesSearchQuery.toLowerCase()))) ||
      (sp.lineages && sp.lineages.some(l => l.name.toLowerCase().includes(speciesSearchQuery.toLowerCase()) || l.description.toLowerCase().includes(speciesSearchQuery.toLowerCase())));

    const matchesSize = speciesFilterSize === 'all' || 
      (speciesFilterSize === 'medio' && sp.size.toLowerCase().includes('médio')) ||
      (speciesFilterSize === 'pequeno' && sp.size.toLowerCase().includes('pequeno'));

    return matchesSearch && matchesSize;
  });

  const activeSpecies = SPECIES_DATA.find(s => s.id === activeSpeciesId) || SPECIES_DATA[0];

  let html = `
    <div class="species-header-panel">
      <div class="species-title-area">
        <h2 style="margin:0; display:flex; align-items:center; gap:8px; color:var(--text-bright);">
          <span style="font-size:1.6rem;">🧬</span> Compêndio de Raças & Sub-raças (D&D 5ª Edição)
        </h2>
        <p style="margin:4px 0 0 0; color:var(--text-muted); font-size:0.88rem;">
          Guia oficial de D&D 5E com as raças clássicas do Livro do Jogador, bônus de habilidade, características inatas e sub-raças.
        </p>
      </div>
      <div class="species-controls-bar">
        <div class="search-box-wrapper" style="flex:1; min-width:220px;">
          <input type="text" id="species-search-input" placeholder="🔍 Buscar raça, característica, magia ou sub-raça..." 
                 value="${escapeSpeciesHtml(speciesSearchQuery)}" 
                 oninput="handleSpeciesSearch(this.value)" 
                 class="search-input" style="width:100%;">
        </div>
        <select class="filter-select" onchange="handleSpeciesFilterSize(this.value)" style="min-width:140px;">
          <option value="all" ${speciesFilterSize === 'all' ? 'selected' : ''}>Todos os Tamanhos</option>
          <option value="medio" ${speciesFilterSize === 'medio' ? 'selected' : ''}>Médio</option>
          <option value="pequeno" ${speciesFilterSize === 'pequeno' ? 'selected' : ''}>Pequeno</option>
        </select>
      </div>
    </div>

    <div class="species-layout-grid">
      <!-- Barra lateral com lista de espécies -->
      <div class="species-sidebar">
        <div class="species-list">
          ${filteredSpecies.map(sp => `
            <button class="species-nav-item ${sp.id === activeSpecies.id ? 'active' : ''}" onclick="selectSpecies('${sp.id}')">
              <span class="species-nav-icon">${sp.icon}</span>
              <div class="species-nav-info">
                <div class="species-nav-name">${sp.name}</div>
                <div class="species-nav-meta">${sp.size.split('(')[0].trim()} • ${sp.speed.split('(')[0].trim()}</div>
              </div>
            </button>
          `).join('')}
          ${filteredSpecies.length === 0 ? `<div style="padding:15px; text-align:center; color:var(--text-muted); font-size:0.85rem;">Nenhuma raça encontrada.</div>` : ''}
        </div>
      </div>

      <!-- Painel principal de detalhes da espécie -->
      <div class="species-main-detail">
        ${renderSpeciesDetailCard(activeSpecies)}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderSpeciesDetailCard(species) {
  if (!species) return '<div class="empty-state">Selecione uma raça para ver os detalhes.</div>';

  return `
    <div class="species-card-content">
      <!-- Header do Card -->
      <div class="species-banner">
        <div class="species-banner-left">
          <span class="species-huge-icon">${species.icon}</span>
          <div>
            <h1 class="species-banner-title">${species.name}</h1>
            <div class="species-tags-row">
              ${species.abilityScoreSummary ? `<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--accent-gold); border: 1px solid rgba(245, 158, 11, 0.4);">⭐ ${species.abilityScoreSummary}</span>` : ''}
              <span class="badge badge-type">🏷️ ${species.type}</span>
              <span class="badge badge-size">📏 ${species.size.split('(')[0].trim()}</span>
              <span class="badge badge-speed">⚡ ${species.speed.split('(')[0].trim()}</span>
            </div>
          </div>
        </div>
        <div class="species-banner-actions">
          <button class="btn btn-secondary btn-sm" onclick="copySpeciesInfo('${species.id}')" title="Copiar resumo para ficha">
            📋 Copiar Resumo
          </button>
        </div>
      </div>

      <!-- Lore & Descrição -->
      <div class="species-lore-box">
        <p style="margin:0; line-height:1.55; color:var(--text-bright); font-style:italic;">
          "${species.description}"
        </p>
      </div>

      <!-- Lista de Características Inatas -->
      <div class="species-section-block">
        <h3 class="species-section-title">
          <span>🛡️</span> Características Raciais Inatas
        </h3>
        <div class="species-traits-grid">
          ${species.traits.map((trait, idx) => `
            <div class="species-trait-card" onclick="openSpeciesTraitModal('${species.id}', ${idx})">
              <div class="trait-header">
                <span class="trait-name">${trait.name}</span>
                <span class="trait-badge">${trait.type}</span>
              </div>
              <p class="trait-desc">${trait.description}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Linhagens / Sub-raças / Escolhas -->
      ${species.lineages && species.lineages.length > 0 ? `
        <div class="species-section-block" style="margin-top:24px;">
          <h3 class="species-section-title">
            <span>✨</span> ${species.lineagesTitle || 'Linhagens & Sub-raças'}
          </h3>
          <div class="lineage-tabs-bar">
            ${species.lineages.map((lineage, idx) => `
              <button class="lineage-tab-btn ${idx === activeLineageIdx ? 'active' : ''}" onclick="selectLineage(${idx})">
                <span>${lineage.icon || '🔸'}</span> ${lineage.name}
              </button>
            `).join('')}
          </div>
          <div class="lineage-display-box">
            ${renderActiveLineageContent(species.lineages[activeLineageIdx] || species.lineages[0])}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderActiveLineageContent(lineage) {
  if (!lineage) return '';
  return `
    <div class="active-lineage-card">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <span style="font-size:1.4rem;">${lineage.icon || '✨'}</span>
        <h4 style="margin:0; font-size:1.15rem; color:var(--gold);">${lineage.name}</h4>
      </div>
      <p style="margin:0; line-height:1.6; color:var(--text-main); font-size:0.92rem;">
        ${lineage.description}
      </p>
    </div>
  `;
}

function selectSpecies(id) {
  activeSpeciesId = id;
  activeLineageIdx = 0;
  renderSpecies();
}

function selectLineage(idx) {
  activeLineageIdx = idx;
  renderSpecies();
}

function handleSpeciesSearch(query) {
  speciesSearchQuery = query;
  renderSpecies();
}

function handleSpeciesFilterSize(size) {
  speciesFilterSize = size;
  renderSpecies();
}

function openSpeciesTraitModal(speciesId, traitIdx) {
  const species = SPECIES_DATA.find(s => s.id === speciesId);
  if (!species || !species.traits[traitIdx]) return;
  const trait = species.traits[traitIdx];

  const modal = document.getElementById('modal-species-detail');
  const modalContent = document.getElementById('modal-species-detail-content');
  if (!modal || !modalContent) return;

  const topicsHtml = typeof formatFeatureToTopics === 'function' 
    ? formatFeatureToTopics(trait.description || '') 
    : `<div class="skill-concept-box">${(trait.description || '').replace(/\n/g, '<br>')}</div>`;

  modalContent.innerHTML = `
    <div class="skill-modal-hero">
      <div class="skill-modal-hero-left">
        <div class="skill-modal-icon-badge">${species.icon || '🧬'}</div>
        <div>
          <div class="skill-modal-title">${trait.name}</div>
          <div class="skill-modal-meta">
            <span>${species.icon} ${species.name}</span>
            <span>•</span>
            <span>${trait.type || 'Característica Racial'}</span>
          </div>
        </div>
      </div>
      <button class="btn-secondary" onclick="closeSpeciesTraitModal()" style="border-radius: 50%; width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 14px;">✕</button>
    </div>

    <div class="skill-modal-tags-bar">
      <span class="skill-tag-pill gold">🧬 ${trait.type || 'Inata'}</span>
      <span class="skill-tag-pill">${species.size ? species.size.split('(')[0].trim() : 'Médio'}</span>
    </div>

    <div style="padding-top: 4px;">
      ${topicsHtml}
    </div>

    <div style="display: flex; justify-content: flex-end; border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 20px; background: rgba(0,0,0,0.2);">
      <button class="btn-action" onclick="closeSpeciesTraitModal()" style="padding: 6px 18px; font-weight: 700;">Fechar</button>
    </div>
  `;
  modal.classList.add('open');
  modal.style.display = 'flex';
}

function closeSpeciesTraitModal() {
  const modal = document.getElementById('modal-species-detail');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
}

function copySpeciesInfo(speciesId) {
  const sp = SPECIES_DATA.find(s => s.id === speciesId);
  if (!sp) return;

  let text = `=== ${sp.name.toUpperCase()} (D&D 5E 2024) ===\n`;
  text += `Tipo: ${sp.type} | Tamanho: ${sp.size} | Deslocamento: ${sp.speed}\n\n`;
  text += `[CARACTERÍSTICAS RACIAIS]:\n`;
  sp.traits.forEach(t => {
    text += `• ${t.name} (${t.type}): ${t.description}\n`;
  });
  if (sp.lineages && sp.lineages.length > 0) {
    text += `\n[${sp.lineagesTitle.toUpperCase()}]:\n`;
    sp.lineages.forEach(l => {
      text += `• ${l.name}: ${l.description}\n`;
    });
  }

  navigator.clipboard.writeText(text).then(() => {
    alert(`Informações da espécie "${sp.name}" copiadas para a área de transferência!`);
  }).catch(() => {
    prompt('Copie o texto abaixo:', text);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SPECIES_DATA,
    renderSpecies,
    selectSpecies,
    selectLineage,
    handleSpeciesSearch,
    handleSpeciesFilterSize,
    openSpeciesTraitModal,
    closeSpeciesTraitModal,
    copySpeciesInfo
  };
}
