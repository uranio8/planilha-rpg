// src/js/atlas.js - Atlas e Guia de Viagem da Costa da Espada (ISSUE-186)

var activeAtlasTravelMode = 'foot'; // 'foot' | 'horse' | 'ship'
var activeAtlasRegionFilter = 'all';
var activeAtlasFactionFilter = 'all';
var activeAtlasSearchQuery = '';
var activeAtlasModalCityId = null;

function getAtlasActiveCampaign() {
  if (typeof getSelectedBastionCampaign === 'function') {
    const c = getSelectedBastionCampaign();
    if (c) return c;
  }
  if (typeof getActiveCampaign === 'function') return getActiveCampaign();
  return null;
}

function getCurrentPartyAtlasCityId() {
  const camp = getAtlasActiveCampaign();
  if (camp && camp.currentLocationId && typeof ATLAS_CITIES !== 'undefined') {
    if (ATLAS_CITIES.some(c => c.id === camp.currentLocationId)) {
      return camp.currentLocationId;
    }
  }
  return 'portoreal_bastiao';
}

function setCurrentPartyAtlasLocation(cityId) {
  const camp = getAtlasActiveCampaign();
  if (!camp) {
    renderAtlasTab();
    return;
  }
  camp.currentLocationId = cityId;
  if (typeof touchCampaign === 'function') touchCampaign(camp);
  if (typeof saveCampaignsState === 'function') saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderAtlasTab();
}

function computeAtlasDistanceKm(originCity, destCity) {
  if (!originCity || !destCity) return 0;
  if (originCity.id === destCity.id) return 0;
  if (originCity.id === 'portoreal_bastiao' && typeof destCity.bastionDistanceKm === 'number') {
    return destCity.bastionDistanceKm;
  }
  if (destCity.id === 'portoreal_bastiao' && typeof originCity.bastionDistanceKm === 'number') {
    return originCity.bastionDistanceKm;
  }
  const dx = (destCity.coords?.x || 0) - (originCity.coords?.x || 0);
  const dy = (destCity.coords?.y || 0) - (originCity.coords?.y || 0);
  return Math.round(Math.hypot(dx, dy));
}

function computeAtlasTravelDays(distanceKm, modeKey, originCity, destCity) {
  if (distanceKm <= 0) return { days: 0, modeUsed: modeKey, seaUnavailable: false };
  const modes = (typeof ATLAS_TRAVEL_MODES !== 'undefined') ? ATLAS_TRAVEL_MODES : {
    foot: { kmPerDay: 38 },
    horse: { kmPerDay: 55 },
    ship: { kmPerDay: 75 }
  };
  let effectiveMode = modeKey || 'foot';
  let seaUnavailable = false;
  if (effectiveMode === 'ship' && (!originCity?.hasSeaRoute || !destCity?.hasSeaRoute)) {
    effectiveMode = 'horse';
    seaUnavailable = true;
  }
  const speed = (modes[effectiveMode] && modes[effectiveMode].kmPerDay) || 38;
  return {
    days: Math.max(1, Math.ceil(distanceKm / speed)),
    modeUsed: effectiveMode,
    seaUnavailable
  };
}

function setAtlasTravelMode(modeKey) {
  activeAtlasTravelMode = modeKey || 'foot';
  renderAtlasTab();
}

function setAtlasRegionFilter(regionId) {
  activeAtlasRegionFilter = regionId || 'all';
  renderAtlasTab();
}

function setAtlasFactionFilter(factionName) {
  activeAtlasFactionFilter = factionName || 'all';
  renderAtlasTab();
}

function handleAtlasSearch(query) {
  activeAtlasSearchQuery = String(query || '');
  renderAtlasTab();
}

function getFilteredAtlasCities() {
  const cities = (typeof ATLAS_CITIES !== 'undefined' && Array.isArray(ATLAS_CITIES)) ? ATLAS_CITIES : [];
  const q = activeAtlasSearchQuery.trim().toLowerCase();

  return cities.filter(c => {
    if (activeAtlasRegionFilter !== 'all' && c.regionId !== activeAtlasRegionFilter) return false;
    if (activeAtlasFactionFilter !== 'all' && !(c.factions || []).includes(activeAtlasFactionFilter)) return false;
    if (q) {
      const att = c.attractions || {};
      const blob = [
        c.name,
        c.regionName,
        c.description,
        ...(c.factions || []),
        att.forjas,
        att.magia,
        att.livros,
        att.cultura
      ].join(' ').toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

function renderAtlasTab() {
  const container = document.getElementById('atlas-main-container');
  if (!container) return;

  const cities = (typeof ATLAS_CITIES !== 'undefined') ? ATLAS_CITIES : [];
  const regions = (typeof ATLAS_REGIONS !== 'undefined') ? ATLAS_REGIONS : [];
  const modes = (typeof ATLAS_TRAVEL_MODES !== 'undefined') ? ATLAS_TRAVEL_MODES : {};
  const originId = getCurrentPartyAtlasCityId();
  const originCity = cities.find(c => c.id === originId) || cities[0];
  const camp = getAtlasActiveCampaign();
  const calDay = camp?.calendar?.currentDay || 1;

  // Coletar todas as facções únicas
  const allFactions = Array.from(new Set(cities.flatMap(c => c.factions || []))).sort();
  const filteredCities = getFilteredAtlasCities();

  // Garantir que PortoReal Bastião ou a Localização Atual apareça no topo
  const sortedCities = filteredCities.slice().sort((a, b) => {
    if (a.id === 'portoreal_bastiao' && b.id !== 'portoreal_bastiao') return -1;
    if (b.id === 'portoreal_bastiao' && a.id !== 'portoreal_bastiao') return 1;
    return computeAtlasDistanceKm(originCity, a) - computeAtlasDistanceKm(originCity, b);
  });

  const selectedRegionObj = activeAtlasRegionFilter !== 'all'
    ? regions.find(r => r.id === activeAtlasRegionFilter)
    : regions.find(r => r.id === originCity?.regionId);

  const isPortal = (typeof document !== 'undefined' && document.body && document.body.classList.contains('mode-player-portal')) ||
    (typeof activePortalPlayerId !== 'undefined' && !!activePortalPlayerId);

  let html = `
    <div class="atlas-header-panel">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-family: var(--font-title); font-size: 20px; font-weight: 800; color: #fef08a; display: flex; align-items: center; gap: 8px;">
            <span>🧭</span>
            <span>Atlas e Guia de Viagem da Costa da Espada</span>
          </div>
          <div style="font-size: 12px; color: #cbd5e1; margin-top: 2px;">
            Partindo de <b style="color: #6ee7b7;">${originCity ? originCity.name : 'PortoReal Bastião'}</b> • Dia ${calDay} de Campanha
          </div>
        </div>
        ${!isPortal ? `
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <label style="font-size: 11px; font-weight: 700; color: #7dd3fc;">📍 Onde o Grupo Está:</label>
            <select id="sel-atlas-current-location" onchange="setCurrentPartyAtlasLocation(this.value)" style="font-size: 12px; font-weight: 700; min-width: 210px;">
              ${cities.map(c => `<option value="${c.id}" ${c.id === originId ? 'selected' : ''}>${c.isStartingPoint ? '🏰 ' : ''}${c.name}</option>`).join('')}
            </select>
          </div>
        ` : ''}
      </div>

      <!-- Controles de Transporte, Filtros e Busca -->
      <div class="atlas-controls-bar">
        <div class="atlas-transport-group">
          ${Object.values(modes).map(m => `
            <button type="button" class="atlas-mode-btn ${activeAtlasTravelMode === m.key ? 'active' : ''}" onclick="setAtlasTravelMode('${m.key}')" title="${m.desc}">
              ${m.icon} ${m.label} (${m.kmPerDay} km/d)
            </button>
          `).join('')}
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; flex: 1; justify-content: flex-end;">
          <select id="sel-atlas-region-filter" onchange="setAtlasRegionFilter(this.value)" style="font-size: 12px;">
            <option value="all" ${activeAtlasRegionFilter === 'all' ? 'selected' : ''}>🗺️ Todas as Regiões</option>
            ${regions.map(r => `<option value="${r.id}" ${activeAtlasRegionFilter === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
          </select>
          <select id="sel-atlas-faction-filter" onchange="setAtlasFactionFilter(this.value)" style="font-size: 12px;">
            <option value="all" ${activeAtlasFactionFilter === 'all' ? 'selected' : ''}>🛡️ Todas as Facções</option>
            ${allFactions.map(f => `<option value="${f}" ${activeAtlasFactionFilter === f ? 'selected' : ''}>${f}</option>`).join('')}
          </select>
          <input type="text" id="inp-atlas-search" value="${activeAtlasSearchQuery.replace(/"/g, '&quot;')}" oninput="handleAtlasSearch(this.value)" placeholder="🔍 Buscar cidade, forja, livros..." style="font-size: 12px; min-width: 210px;">
        </div>
      </div>

      ${selectedRegionObj ? `
        <div class="atlas-region-banner">
          <div style="font-weight: 800; color: #7dd3fc; font-size: 12.5px;">🏔️ Região em Foco: ${selectedRegionObj.name}</div>
          <div style="font-size: 11.5px; color: #cbd5e1; margin-top: 2px;">${selectedRegionObj.summary}</div>
          <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 4px; font-size: 11px; color: #fde68a;">
            <span><b>🌦️ Clima:</b> ${selectedRegionObj.climate}</span>
            <span><b>⚠️ Perigo nas Estradas:</b> ${selectedRegionObj.dangerLevel}</span>
          </div>
        </div>
      ` : ''}
    </div>

    <div class="atlas-cities-grid">
  `;

  if (sortedCities.length === 0) {
    html += `
      <div style="grid-column: 1 / -1; text-align: center; padding: 32px; color: #94a3b8; background: rgba(15,23,42,0.6); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.15);">
        Nenhuma cidade encontrada para os filtros selecionados.
      </div>
    `;
  } else {
    sortedCities.forEach(c => {
      const distKm = computeAtlasDistanceKm(originCity, c);
      const travel = computeAtlasTravelDays(distKm, activeAtlasTravelMode, originCity, c);
      const isHere = c.id === originId;
      const modeObj = modes[travel.modeUsed] || { icon: '🚶', label: 'A pé' };

      html += `
        <div class="atlas-city-card ${c.isStartingPoint ? 'starting-point' : ''} ${isHere ? 'current-location' : ''}" onclick="openAtlasCityModal('${c.id}')">
          <div class="atlas-city-card-top">
            <div>
              <div class="atlas-city-name">${c.isStartingPoint ? '🏰 ' : ''}${c.name}</div>
              <div class="atlas-city-region">${c.regionName}</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
              ${c.isStartingPoint ? '<span class="badge" style="background: rgba(245,158,11,0.2); color: #fef08a; border-color: #f59e0b; font-size: 10px;">🏰 Ponto de Partida / Bastião</span>' : ''}
              ${isHere ? '<span class="badge" style="background: rgba(16,185,129,0.2); color: #6ee7b7; border-color: #10b981; font-size: 10px;">📍 Grupo Aqui</span>' : ''}
            </div>
          </div>

          <div class="atlas-city-desc">${c.description}</div>

          <div class="atlas-city-travel-box">
            <div>
              <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Distância:</span>
              <div style="font-weight: 800; color: #f8fafc; font-size: 13px;">${distKm} km</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Tempo Estimado:</span>
              <div style="font-weight: 800; color: #7dd3fc; font-size: 13px;">
                ${isHere ? '0 dias (Local)' : `${modeObj.icon} ${travel.days} dia(s)${travel.seaUnavailable ? ' (por terra)' : ''}`}
              </div>
            </div>
          </div>

          <div class="atlas-city-factions">
            ${(c.factions || []).slice(0, 3).map(f => `<span class="atlas-faction-pill">${f}</span>`).join('')}
            ${(c.factions || []).length > 3 ? `<span class="atlas-faction-pill">+${c.factions.length - 3}</span>` : ''}
          </div>
        </div>
      `;
    });
  }

  html += `</div>`;
  container.innerHTML = html;
}

function openAtlasCityModal(cityId) {
  const cities = (typeof ATLAS_CITIES !== 'undefined') ? ATLAS_CITIES : [];
  const regions = (typeof ATLAS_REGIONS !== 'undefined') ? ATLAS_REGIONS : [];
  const modes = (typeof ATLAS_TRAVEL_MODES !== 'undefined') ? ATLAS_TRAVEL_MODES : {};
  const city = cities.find(c => c.id === cityId);
  if (!city) return;

  activeAtlasModalCityId = cityId;
  const originId = getCurrentPartyAtlasCityId();
  const originCity = cities.find(c => c.id === originId) || cities[0];
  const region = regions.find(r => r.id === city.regionId);
  const distKm = computeAtlasDistanceKm(originCity, city);
  const travel = computeAtlasTravelDays(distKm, activeAtlasTravelMode, originCity, city);
  const modeObj = modes[travel.modeUsed] || { icon: '🚶', label: 'A pé' };
  const isHere = city.id === originId;
  const isPortal = (typeof document !== 'undefined' && document.body && document.body.classList.contains('mode-player-portal')) ||
    (typeof activePortalPlayerId !== 'undefined' && !!activePortalPlayerId);

  const titleEl = document.getElementById('atlas-modal-city-title');
  const subEl = document.getElementById('atlas-modal-city-sub');
  const bodyEl = document.getElementById('atlas-modal-city-body');
  const travelBtn = document.getElementById('btn-atlas-travel-here');

  if (titleEl) titleEl.innerText = `${city.isStartingPoint ? '🏰 ' : ''}${city.name}`;
  if (subEl) subEl.innerText = `${city.regionName} • ${distKm} km de ${originCity ? originCity.name : 'PortoReal Bastião'} (${isHere ? 'Grupo está aqui' : `${travel.days} dia(s) ${modeObj.label.toLowerCase()}`})`;

  if (bodyEl) {
    const att = city.attractions || {};
    bodyEl.innerHTML = `
      <div style="font-size: 13px; color: #e2e8f0; line-height: 1.55; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
        ${city.description}
      </div>

      ${region ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11.5px; background: rgba(15,23,42,0.7); padding: 10px; border-radius: 8px; border: 1px solid rgba(56,189,248,0.25);">
          <div><b style="color: #7dd3fc;">🌦️ Clima da Região:</b><br>${region.climate}</div>
          <div><b style="color: #fca5a5;">⚠️ Perigo nas Estradas:</b><br>${region.dangerLevel}</div>
        </div>
      ` : ''}

      <div>
        <div style="font-size: 11px; font-weight: 800; color: var(--primary-light); text-transform: uppercase; margin-bottom: 6px;">🛡️ Facções Atuantes:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${(city.factions || []).map(f => `<span class="atlas-faction-pill">${f}</span>`).join('')}
        </div>
      </div>

      <div class="atlas-attractions-grid">
        <div class="atlas-attraction-box">
          <div class="atlas-attraction-title">⚔️ Forjas e Artesanato</div>
          <div class="atlas-attraction-text">${att.forjas || 'Sem registros notáveis.'}</div>
        </div>
        <div class="atlas-attraction-box">
          <div class="atlas-attraction-title">🔮 Magia e Itens Mágicos</div>
          <div class="atlas-attraction-text">${att.magia || 'Sem registros notáveis.'}</div>
        </div>
        <div class="atlas-attraction-box">
          <div class="atlas-attraction-title">📚 Livros e Conhecimento</div>
          <div class="atlas-attraction-text">${att.livros || 'Sem registros notáveis.'}</div>
        </div>
        <div class="atlas-attraction-box">
          <div class="atlas-attraction-title">🎭 Festas, Eventos e Cultura</div>
          <div class="atlas-attraction-text">${att.cultura || 'Sem registros notáveis.'}</div>
        </div>
      </div>
    `;
  }

  if (travelBtn) {
    if (isPortal || isHere) {
      travelBtn.style.display = 'none';
    } else {
      travelBtn.style.display = 'inline-flex';
      travelBtn.innerText = `🧭 Viajar para ali (+${travel.days} dias no Relógio & Bastião)`;
    }
  }

  const modal = document.getElementById('modal-atlas-city');
  if (modal) modal.style.display = 'flex';
}

function closeAtlasCityModal() {
  const modal = document.getElementById('modal-atlas-city');
  if (modal) modal.style.display = 'none';
}

function travelPartyToModalCity() {
  if (!activeAtlasModalCityId) return;
  const cities = (typeof ATLAS_CITIES !== 'undefined') ? ATLAS_CITIES : [];
  const destCity = cities.find(c => c.id === activeAtlasModalCityId);
  if (!destCity) return;

  const originId = getCurrentPartyAtlasCityId();
  const originCity = cities.find(c => c.id === originId) || cities[0];
  const distKm = computeAtlasDistanceKm(originCity, destCity);
  const travel = computeAtlasTravelDays(distKm, activeAtlasTravelMode, originCity, destCity);

  setCurrentPartyAtlasLocation(destCity.id);
  if (travel.days > 0 && typeof advanceCampaignDays === 'function') {
    advanceCampaignDays(travel.days);
  }
  if (typeof addLog === 'function') {
    addLog(`🧭 <b>Viagem pelo Atlas:</b> O grupo viajou de <b>${originCity?.name || 'PortoReal Bastião'}</b> para <b>${destCity.name}</b> (${distKm} km • +${travel.days} dias no relógio e no Bastião).`);
  }
  closeAtlasCityModal();
  renderAtlasTab();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentPartyAtlasCityId,
    setCurrentPartyAtlasLocation,
    computeAtlasDistanceKm,
    computeAtlasTravelDays,
    setAtlasTravelMode,
    setAtlasRegionFilter,
    setAtlasFactionFilter,
    handleAtlasSearch,
    getFilteredAtlasCities,
    renderAtlasTab,
    openAtlasCityModal,
    closeAtlasCityModal,
    travelPartyToModalCity
  };
}

if (typeof window !== 'undefined') {
  window.getCurrentPartyAtlasCityId = getCurrentPartyAtlasCityId;
  window.setCurrentPartyAtlasLocation = setCurrentPartyAtlasLocation;
  window.computeAtlasDistanceKm = computeAtlasDistanceKm;
  window.computeAtlasTravelDays = computeAtlasTravelDays;
  window.setAtlasTravelMode = setAtlasTravelMode;
  window.setAtlasRegionFilter = setAtlasRegionFilter;
  window.setAtlasFactionFilter = setAtlasFactionFilter;
  window.handleAtlasSearch = handleAtlasSearch;
  window.getFilteredAtlasCities = getFilteredAtlasCities;
  window.renderAtlasTab = renderAtlasTab;
  window.openAtlasCityModal = openAtlasCityModal;
  window.closeAtlasCityModal = closeAtlasCityModal;
  window.travelPartyToModalCity = travelPartyToModalCity;
}
