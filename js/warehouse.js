/**
 * EL ALMACÉN DE NOMITOS - js/warehouse.js
 * Plano esquemático, vida permanente humana y organización de estantes:
 * - Teléfono fijo en el buró de Faustino
 * - Máquina de café con tazas y zona de descanso
 * - Rincón de fumadores con cenicero de pie junto a la salida
 * - Estantes organizados: Herramientas, Plomería/Texaa, Eléctricos, Mobiliario, Cajas Streff
 * - Secuencia telefónica al recibir carga: Faustino llama -> Nomito contesta -> Cuadrilla se activa
 * Licencia: MIT
 */

window.NOMITOS_WAREHOUSE = (function(Data, Agents, Engine) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var svgEl = null;
  var movingLayer = null;
  var gnomesSquad = [];
  var animFrameId = null;
  var lastTimestamp = null;
  var isPhoneRinging = false;
  var phoneRingingGnome = null;

  var BUILDING = {
    x: 20,
    y: 18,
    w: 920,
    h: 684
  };

  function init(svgSelector) {
    svgEl = document.querySelector(svgSelector);
    if (!svgEl) return;

    gnomesSquad = Agents.createSquad();

    renderBuildingStructure();
    renderAllWarehouseZones();
    setupEventListeners();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    lastTimestamp = performance.now();
    loop(lastTimestamp);
  }

  function loop(timestamp) {
    var deltaTime = (timestamp - lastTimestamp) / 16.66;
    if (deltaTime > 2.5) deltaTime = 2.5;
    lastTimestamp = timestamp;

    gnomesSquad.forEach(function(nomito) {
      if (nomito.humanState !== 'mission') {
        nomito.tickHuman(deltaTime, gnomesSquad);
      }
    });

    renderActiveGnomes();
    animFrameId = requestAnimationFrame(loop);
  }

  function renderBuildingStructure() {
    var bx = BUILDING.x, by = BUILDING.y, bw = BUILDING.w, bh = BUILDING.h;

    var html = '' +
      '<defs>' +
        '<pattern id="slab-grid" width="48" height="48" patternUnits="userSpaceOnUse">' +
          '<path d="M48 0H0V48" fill="none" stroke="var(--line)" stroke-width="0.75" opacity="0.4"/>' +
        '</pattern>' +
        '<pattern id="hazard-stripes" width="20" height="20" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
          '<rect width="10" height="20" fill="#f4b942"/>' +
          '<rect x="10" width="10" height="20" fill="#202a26"/>' +
        '</pattern>' +
        '<filter id="buildingShadow" x="-10%" y="-10%" width="120%" height="120%">' +
          '<feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.25"/>' +
        '</filter>' +
      '</defs>' +

      '<rect width="960" height="720" fill="var(--page)"/>' +

      // NAVE DEL LOCAL -5
      '<g id="nave-local-5" filter="url(#buildingShadow)">' +
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="var(--floor)"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="url(#slab-grid)"/>' +

        // Muros de carga
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="none" stroke="#252f2b" stroke-width="12" rx="4"/>' +
        '<rect x="' + (bx + 6) + '" y="' + (by + 6) + '" width="' + (bw - 12) + '" height="' + (bh - 12) + '" fill="none" stroke="var(--line-strong)" stroke-width="1.5"/>' +

        // Título del plano
        '<text x="' + (bx + bw / 2) + '" y="' + (by + 20) + '" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="bold" fill="var(--muted)" letter-spacing="1.5">' +
          'BLUE BANK · LOCAL -5 STOCKAGE (PLAN DE DISPOSITION : STOCKAGE & ÉLECTRIQUE)' +
        '</text>' +

        // PASILLO CENTRAL (COULOIR CENTRAL)
        '<g id="couloir-central">' +
          '<rect x="410" y="' + (by + 28) + '" width="120" height="' + (bh - 40) + '" fill="var(--surface-2)" opacity="0.6"/>' +
          '<line x1="410" y1="' + (by + 28) + '" x2="410" y2="' + (by + bh - 12) + '" stroke="var(--yellow)" stroke-width="3" stroke-dasharray="10 8"/>' +
          '<line x1="530" y1="' + (by + 28) + '" x2="530" y2="' + (by + bh - 12) + '" stroke="var(--yellow)" stroke-width="3" stroke-dasharray="10 8"/>' +
          '<text x="470" y="325" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="var(--muted)" letter-spacing="1">' +
            '▲ COULOIR CENTRAL ▲' +
          '</text>' +
          '<text x="470" y="340" text-anchor="middle" font-family="monospace" font-size="7.5" font-weight="bold" fill="var(--orange)" letter-spacing="1">' +
            'ZONE CRITIQUE : DÉGAGEMENT OBLIGATOIRE' +
          '</text>' +
        '</g>' +

        // PUERTA ENTRADA / MUELLE A
        '<g id="gate-dock-in" transform="translate(18, 160)">' +
          '<rect x="0" y="0" width="45" height="110" fill="#202a26" stroke="var(--teal)" stroke-width="2"/>' +
          '<rect x="0" y="10" width="30" height="90" fill="url(#hazard-stripes)"/>' +
          '<circle cx="22" cy="55" r="7" fill="var(--teal)" class="pulse"/>' +
          '<text x="6" y="-8" font-family="monospace" font-size="8.5" font-weight="bold" fill="var(--teal)">MUELLE A</text>' +
        '</g>' +

        // BURÓ DE ENTRADA CON TELÉFONO FIJO (FAUSTINO)
        '<g id="desk-faustino" transform="translate(85, 165)">' +
          '<rect width="76" height="74" rx="3" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
          '<rect x="6" y="8" width="28" height="22" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1"/>' +
          '<path d="M10 14h20M10 19h14M10 24h18" stroke="var(--teal)" stroke-width="1.5"/>' +
          // Monitor
          '<rect x="42" y="10" width="28" height="20" fill="#1b2420" rx="1"/>' +
          '<rect x="44" y="12" width="24" height="16" fill="var(--teal)" opacity="0.8"/>' +
          // TELÉFONO FIJO DEL BURÓ (CON AURICULAR)
          '<g id="faustino-phone" transform="translate(12, 38)">' +
            '<rect width="18" height="14" rx="2" fill="#222" stroke="#444" stroke-width="0.8"/>' +
            '<circle cx="9" cy="7" r="3.5" fill="#f4b942"/>' +
            '<path d="M-2 1Q9 -4 20 1" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '</g>' +
          '<text x="38" y="58" text-anchor="middle" font-size="8" font-family="monospace" font-weight="bold" fill="var(--ink)">BURÓ ENTRADA</text>' +
          '<text x="38" y="68" text-anchor="middle" font-size="6.5" font-family="monospace" fill="var(--muted)">Faustino (☎)</text>' +
        '</g>' +

        // PUERTA EXPEDICIÓN / MUELLE B
        '<g id="gate-dock-out" transform="translate(875, 460)">' +
          '<rect x="0" y="0" width="45" height="110" fill="#202a26" stroke="var(--orange)" stroke-width="2"/>' +
          '<rect x="15" y="10" width="30" height="90" fill="url(#hazard-stripes)"/>' +
          '<circle cx="22" cy="55" r="7" fill="var(--orange)" class="pulse"/>' +
          '<text x="4" y="-8" font-family="monospace" font-size="8.5" font-weight="bold" fill="var(--orange)">MUELLE B</text>' +
        '</g>' +

        // BURÓ DE SALIDA (GASPAR)
        '<g id="desk-gaspar" transform="translate(775, 480)">' +
          '<rect width="76" height="74" rx="3" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
          '<rect x="42" y="8" width="28" height="22" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1"/>' +
          '<path d="M46 14h20M46 19h14M46 24h18" stroke="var(--orange)" stroke-width="1.5"/>' +
          '<rect x="8" y="10" width="28" height="20" fill="#1b2420" rx="1"/>' +
          '<rect x="10" y="12" width="24" height="16" fill="var(--orange)" opacity="0.8"/>' +
          '<text x="38" y="52" text-anchor="middle" font-size="8" font-family="monospace" font-weight="bold" fill="var(--ink)">BURÓ SALIDA</text>' +
          '<text x="38" y="62" text-anchor="middle" font-size="6.5" font-family="monospace" fill="var(--muted)">Gaspar (Sello)</text>' +
        '</g>' +

        // ----------------------------------------------------
        // MÁQUINA DE CAFÉ DEL ALMACÉN (ZONA DE DESCANSO)
        // ----------------------------------------------------
        '<g id="machine-a-cafe" transform="translate(545, 620)">' +
          '<rect width="36" height="60" rx="3" fill="#bf3c32" stroke="#222" stroke-width="1.5"/>' +
          '<rect x="6" y="8" width="24" height="12" fill="#1b2420" rx="1"/>' +
          '<text x="18" y="16" font-size="6" font-family="monospace" text-anchor="middle" fill="#58a6ff">CAFÉ</text>' +
          // Dispensador y taza
          '<rect x="8" y="26" width="20" height="24" fill="#202a26" rx="1"/>' +
          '<rect x="13" y="38" width="10" height="10" rx="1" fill="#ffffff"/>' +
          '<path d="M16 34Q18 30 16 26" stroke="rgba(255,255,255,0.7)" stroke-width="1" fill="none"/>' +
          '<circle cx="27" cy="14" r="2" fill="#f4b942"/>' +
          '<text x="18" y="58" font-size="6" font-family="monospace" text-anchor="middle" fill="#fff" font-weight="bold">☕ PAUSA</text>' +
        '</g>' +

        // ----------------------------------------------------
        // RINCÓN DE FUMAR CON CENICERO (JUNTO A LA SALIDA)
        // ----------------------------------------------------
        '<g id="smoking-spot" transform="translate(830, 600)">' +
          // Marcas amarillas de zona fumador
          '<rect width="45" height="40" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="4 4"/>' +
          // Cenicero de pie metálico plateado
          '<line x1="22" y1="12" x2="22" y2="34" stroke="#8b949e" stroke-width="2.5"/>' +
          '<ellipse cx="22" cy="12" rx="7" ry="3" fill="#30363d" stroke="#8b949e" stroke-width="1"/>' +
          '<ellipse cx="22" cy="34" rx="8" ry="3" fill="#1b2420"/>' +
          '<text x="22" y="48" font-size="6" font-family="monospace" text-anchor="middle" fill="var(--muted)">🚬 FUMADORES</text>' +
        '</g>' +

        '<g id="zones-layer"></g>' +
        '<g id="active-gnomes-layer"></g>' +

        // Alerta de congestión
        '<g id="hazard-warning-sign" transform="translate(320, 32)" opacity="0" style="transition:opacity 0.4s ease">' +
          '<rect width="320" height="34" rx="4" fill="#bf3c32"/>' +
          '<text x="160" y="21" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="bold" fill="#ffffff">' +
            '⚠️ ATTENTION : COULOIR CENTRAL ENCOMBRÉ !' +
          '</text>' +
        '</g>' +
      '</g>';

    svgEl.innerHTML = html;
    movingLayer = svgEl.querySelector('#active-gnomes-layer');
  }

  function renderAllWarehouseZones() {
    var zonesLayer = svgEl.querySelector('#zones-layer');
    if (!zonesLayer) return;

    var items = Engine.ledger.items;

    var html = '' +
      // ======================================================================
      // ZONA FONDO: EXPÉDITION STREFF (Palets de madera y 15+ cajas)
      // ======================================================================
      renderStreffZone(290, 45, 180, 95, items.filter(function(i) { return i.category === 'streff'; })) +

      // FOND ARCHIVE -6/-7
      renderArchiveZone(490, 45, 180, 95, items.filter(function(i) { return i.sku === 'ARC-DETRUIRE'; })) +

      // ======================================================================
      // FILA IZQUIERDA: HERRAMIENTAS, PLOMERÍA/TEXAA Y ELÉCTRICOS
      // ======================================================================
      // 1. ESTANTE HERRAMIENTAS & OUTILLAGE (Verde)
      renderToolsRack(60, 255, 140, 95, items.filter(function(i) { return i.category === 'herramientas'; })) +

      // 2. ESTANTE PLOMERÍA & PANELES TEXAA
      renderPlumbingTexaaRack(60, 365, 140, 95, items.filter(function(i) { return i.category === 'plomeria_acabados'; })) +

      // 3. ESTANTE ELÉCTRICOS (Cables, Bobinas, Radiador)
      renderElectricRack(60, 475, 140, 95, items.filter(function(i) { return i.category === 'electricos'; })) +

      // 4. ZONE ÉTROITE (Sous bulle)
      renderNarrowZone(60, 585, 140, 95, items.filter(function(i) { return i.sku === 'PLO-BULLE'; })) +

      // ======================================================================
      // FILA DERECHA: MOBILIARIO, SIT-STAND, SIÈGES ERGO, CAISSONS
      // ======================================================================
      // 1. SIT-STAND
      renderSitStandZone(740, 60, 155, 95, items.filter(function(i) { return i.sku === 'MOB-SITSTAND'; })) +

      // 2. SIÈGES ERGONOMIQUES (5 sillas)
      renderChairsZone(740, 170, 155, 95, items.filter(function(i) { return i.sku === 'MOB-SIEGES'; })) +

      // 3. CAISSONS & BUCKS
      renderBucksZone(740, 280, 155, 95, items.filter(function(i) { return i.sku === 'MOB-BUCKS'; })) +

      // 4. ARMOIRE & SERVEURS
      renderCabinetZone(740, 390, 155, 80, items.filter(function(i) { return i.sku === 'MOB-ARMOIRE'; }));

    zonesLayer.innerHTML = html;

    var warnSign = svgEl.querySelector('#hazard-warning-sign');
    if (warnSign) {
      warnSign.setAttribute('opacity', Engine.ledger.getMetrics().isCongested ? '1' : '0');
    }
  }

  // --- RENDERS DE ZONAS DETALLADAS ---

  function renderStreffZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var boxes = '';
    // Dibujar palets de madera con cajas Streff apiladas
    for (var i = 0; i < Math.min(12, stock); i++) {
      var col = i % 4, row = Math.floor(i / 4);
      var bx = x + 12 + col * 38;
      var by = y + 30 + row * 26;
      boxes += '<g transform="translate(' + bx + ',' + by + ')">' +
        // Palet de madera
        (row === 1 ? '<rect x="-2" y="16" width="36" height="4" fill="#a07842" stroke="#5a4115" stroke-width="0.8"/>' : '') +
        // Caja de cartón Streff dorada
        '<rect width="32" height="18" rx="1.5" fill="#e3b341" stroke="#5a4115" stroke-width="1"/>' +
        '<text x="16" y="11" font-size="6.5" font-family="monospace" text-anchor="middle" font-weight="bold" fill="#3f2d12">STREFF</text>' +
        '<line x1="0" y1="13" x2="32" y2="13" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>' +
        '</g>';
    }

    return zoneShell(x, y, w, h, 'EXPÉDITION STREFF', '15+ CARTONS', '#e3b341', boxes, p, stock, cap);
  }

  function renderArchiveZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var sacs = '';
    for (var i = 0; i < Math.min(6, stock); i++) {
      var sx = x + 16 + i * 26;
      sacs += '<g transform="translate(' + sx + ',' + (y + 40) + ')">' +
        '<path d="M0 24 C-2 10 4 6 10 6 C16 6 22 10 20 24 Z" fill="#f85149" stroke="#791f1a" stroke-width="1"/>' +
        '<circle cx="10" cy="5" r="2.5" fill="#d29922"/>' +
        '<text x="10" y="18" font-size="5" font-family="monospace" text-anchor="middle" fill="#fff" font-weight="bold">CONF.</text>' +
        '</g>';
    }
    return zoneShell(x, y, w, h, 'ARCHIVES -6/-7', 'SACS CONFIDENTIEL', '#f85149', sacs, p, stock, cap);
  }

  function renderToolsRack(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    // Cajas de herramientas metálicas rojas y estante verde
    var tools = '' +
      '<line x1="' + (x + 8) + '" y1="' + (y + 55) + '" x2="' + (x + w - 8) + '" y2="' + (y + 55) + '" stroke="#2ea043" stroke-width="3"/>' +
      '<g transform="translate(' + (x + 14) + ',' + (y + 36) + ')">' +
        '<rect width="32" height="16" rx="2" fill="#bf3c32" stroke="#222" stroke-width="1"/>' +
        '<rect x="12" y="-3" width="8" height="3" fill="#222"/>' +
        '<line x1="8" y1="8" x2="24" y2="8" stroke="#f4b942" stroke-width="1"/>' +
      '</g>' +
      '<g transform="translate(' + (x + 55) + ',' + (y + 36) + ')">' +
        '<rect width="28" height="16" rx="2" fill="#2ea043" stroke="#123d1b" stroke-width="1"/>' +
        '<text x="14" y="11" font-size="6" font-family="monospace" text-anchor="middle" fill="#fff">OUTIL</text>' +
      '</g>';

    return zoneShell(x, y, w, h, 'RAYONNAGE OUTILLAGE', 'HERRAMIENTAS', '#2ea043', tools, p, stock, cap);
  }

  function renderPlumbingTexaaRack(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var texaa = '';
    for (var i = 0; i < Math.min(8, stock); i++) {
      var tx = x + 12 + i * 15;
      texaa += '<g transform="translate(' + tx + ',' + (y + 30) + ')">' +
        '<rect width="11" height="48" rx="2" fill="#ff7b72" stroke="#8b2c24" stroke-width="0.8"/>' +
        '<text x="5.5" y="28" font-size="5" font-family="monospace" text-anchor="middle" fill="#fff" transform="rotate(90 5.5 28)">TEXAA</text>' +
        '</g>';
    }

    return zoneShell(x, y, w, h, 'PLOMERIE & TEXAA', 'ACOUSTIQUE', '#ff7b72', texaa, p, stock, cap);
  }

  function renderElectricRack(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    // Bobinas de cobre y radiador
    var elec = '' +
      '<g transform="translate(' + (x + 14) + ',' + (y + 35) + ')">' +
        '<circle cx="14" cy="14" r="14" fill="#a07842" stroke="#5a4115" stroke-width="1.2"/>' +
        '<circle cx="14" cy="14" r="7" fill="#d29922"/>' +
        '<circle cx="14" cy="14" r="2.5" fill="#333"/>' +
      '</g>' +
      '<g transform="translate(' + (x + 52) + ',' + (y + 35) + ')">' +
        '<circle cx="14" cy="14" r="14" fill="#58a6ff" stroke="#1f4f82" stroke-width="1.2"/>' +
        '<circle cx="14" cy="14" r="7" fill="#202a26"/>' +
        '<circle cx="14" cy="14" r="2.5" fill="#fff"/>' +
      '</g>' +
      '<g transform="translate(' + (x + 92) + ',' + (y + 36) + ')">' +
        '<rect width="32" height="26" rx="2" fill="#f7f9f8" stroke="#333" stroke-width="1"/>' +
        '<path d="M4 6h24M4 12h24M4 18h24" stroke="#e55d23" stroke-width="1.5"/>' +
        '<text x="16" y="24" font-size="4.5" text-anchor="middle" fill="#666">RAD</text>' +
      '</g>';

    return zoneShell(x, y, w, h, 'LOCAL ÉLECTRIQUE', 'BOBINES & CÂBLES', '#d29922', elec, p, stock, cap);
  }

  function renderNarrowZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var tables = '';
    for (var i = 0; i < Math.min(4, stock); i++) {
      tables += '<rect x="' + (x + 12 + i * 28) + '" y="' + (y + 34) + '" width="24" height="46" rx="2" fill="#56d364" stroke="#225b29" stroke-width="1"/>' +
        '<line x1="' + (x + 14 + i * 28) + '" y1="' + (y + 40) + '" x2="' + (x + 34 + i * 28) + '" y2="' + (y + 40) + '" stroke="#fff" stroke-dasharray="2 2"/>';
    }

    return zoneShell(x, y, w, h, 'ZONE ÉTROITE', 'SOUS BULLE', '#3fb950', tables, p, stock, cap);
  }

  function renderSitStandZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var sit = '';
    for (var s = 0; s < Math.min(2, stock); s++) {
      var sx = x + 14 + s * 66;
      sit += '<g transform="translate(' + sx + ',' + (y + 36) + ')">' +
        '<rect width="58" height="12" rx="1.5" fill="#f7f9f8" stroke="#333" stroke-width="1.2"/>' +
        '<line x1="8" y1="12" x2="8" y2="44" stroke="#79c0ff" stroke-width="3"/>' +
        '<line x1="50" y1="12" x2="50" y2="44" stroke="#79c0ff" stroke-width="3"/>' +
        '<rect x="24" y="14" width="10" height="7" rx="1" fill="#1b2420"/>' +
        '<text x="29" y="19" font-size="5" text-anchor="middle" fill="#79c0ff">M</text>' +
        '</g>';
    }
    return zoneShell(x, y, w, h, 'BUREAUX SIT-STAND', '2 MOTORISÉS', '#79c0ff', sit, p, stock, cap);
  }

  function renderChairsZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var chairs = '';
    for (var c = 0; c < Math.min(5, stock); c++) {
      var cx = x + 12 + c * 27;
      chairs += '<g transform="translate(' + cx + ',' + (y + 40) + ')">' +
        '<circle cx="10" cy="10" r="8" fill="#58a6ff" stroke="#1f4f82" stroke-width="1"/>' +
        '<circle cx="10" cy="10" r="3" fill="#202a26"/>' +
        '<path d="M4 10 L16 10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' +
        '<circle cx="5" cy="22" r="2" fill="#333"/><circle cx="15" cy="22" r="2" fill="#333"/>' +
        '</g>';
    }
    return zoneShell(x, y, w, h, 'SIÈGES ERGONOMIQUES', '5 SIÈGES BUREAU', '#58a6ff', chairs, p, stock, cap);
  }

  function renderBucksZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var bucks = '';
    for (var b = 0; b < Math.min(4, stock); b++) {
      var bx = x + 14 + b * 32;
      bucks += '<g transform="translate(' + bx + ',' + (y + 36) + ')">' +
        '<rect width="26" height="38" rx="2" fill="#a5d6ff" stroke="#2b5379" stroke-width="1"/>' +
        '<line x1="4" y1="12" x2="22" y2="12" stroke="#2b5379" stroke-width="1"/>' +
        '<line x1="4" y1="24" x2="22" y2="24" stroke="#2b5379" stroke-width="1"/>' +
        '<circle cx="13" cy="6" r="1.5" fill="#333"/><circle cx="13" cy="18" r="1.5" fill="#333"/>' +
        '</g>';
    }
    return zoneShell(x, y, w, h, 'CAISSONS & BUCKS', 'STOCKAGE BAS', '#a5d6ff', bucks, p, stock, cap);
  }

  function renderCabinetZone(x, y, w, h, items) {
    var stock = items.reduce(function(a, b) { return a + b.stock; }, 0);
    var cap = items.reduce(function(a, b) { return a + b.capacity; }, 0);
    var p = Math.round((stock / cap) * 100);

    var cab = '<g transform="translate(' + (x + 20) + ',' + (y + 30) + ')">' +
      '<rect width="115" height="38" rx="2" fill="#8b949e" stroke="#333" stroke-width="1.2"/>' +
      '<line x1="58" y1="0" x2="58" y2="38" stroke="#333" stroke-width="1"/>' +
      '<circle cx="53" cy="18" r="1.5" fill="#fff"/><circle cx="63" cy="18" r="1.5" fill="#fff"/>' +
      '</g>';
    return zoneShell(x, y, w, h, 'ARMOIRE & RACKS INFO', 'MÉTAL & SERVEUR', '#8b949e', cab, p, stock, cap);
  }

  function zoneShell(x, y, w, h, title, tag, color, inner, p, stock, cap) {
    return '' +
      '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.5"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="22" fill="var(--surface-2)"/>' +
        '<line x1="' + x + '" y1="' + (y + 22) + '" x2="' + (x + w) + '" y2="' + (y + 22) + '" stroke="var(--line)" stroke-width="1"/>' +
        '<text x="' + (x + 8) + '" y="' + (y + 14) + '" font-family="monospace" font-size="8.5" font-weight="bold" fill="var(--ink)">' + title + '</text>' +
        '<text x="' + (x + w - 8) + '" y="' + (y + 14) + '" text-anchor="end" font-family="monospace" font-size="7" font-weight="bold" fill="' + color + '">' + tag + '</text>' +
        inner +
        '<rect x="' + (x + 8) + '" y="' + (y + h - 8) + '" width="' + (w - 16) + '" height="4" fill="var(--line)" rx="1"/>' +
        '<rect x="' + (x + 8) + '" y="' + (y + h - 8) + '" width="' + ((w - 16) * p / 100) + '" height="4" fill="' + color + '" rx="1"/>' +
      '</g>';
  }

  function renderActiveGnomes() {
    if (!movingLayer) return;
    var html = gnomesSquad.map(function(nomito) {
      if (nomito.humanState === 'mission') return '';
      return nomito.render();
    }).join('');
    movingLayer.innerHTML = html;
  }

  /**
   * SECUENCIA TELEFÓNICA REAL:
   * Faustino levanta el teléfono en su buró -> Suena el móvil del nomito -> Contesta y acude
   */
  function dispatchGnomeMovement(mission) {
    return new Promise(function(resolve) {
      var item = mission.item;
      var type = mission.type;

      // 1. Faustino levanta el teléfono
      var faustino = gnomesSquad.find(function(g) { return g.id === 'gnome-faustino'; });
      if (faustino) {
        faustino.speechBubble = '☎ ¡Ring!';
        faustino.speechTimer = 90;
      }

      // 2. Elegimos al nomito que recibirá la llamada (Pepe o Nico)
      var carrier = gnomesSquad.find(function(g) { return g.id === 'gnome-pepe'; }) || gnomesSquad[2];
      carrier.tool = 'phone';
      carrier.expression = 'phone';
      carrier.speechBubble = '📱 "¡Al lío!"';
      carrier.speechTimer = 80;

      // Pequeño retardo humano de 700ms para contestar la llamada antes de correr
      setTimeout(function() {
        carrier.tool = 'none';
        carrier.humanState = 'mission';

        // Destino del anaquel según el artículo
        var targetCoords = [210, 365];
        if (item.category === 'herramientas') targetCoords = [210, 255];
        else if (item.category === 'electricos') targetCoords = [210, 475];
        else if (item.category === 'streff') targetCoords = [380, 80];
        else if (item.category === 'mobiliario') targetCoords = [740, 220];

        var workerEl = document.createElementNS(NS, 'g');
        svgEl.querySelector('#nave-local-5').appendChild(workerEl);

        var pathPoints = [];
        if (type === 'in') {
          pathPoints = [
            [85, 230],
            [145, 230],
            [470, 360],
            [targetCoords[0], targetCoords[1]]
          ];
        } else {
          pathPoints = [
            [targetCoords[0], targetCoords[1]],
            [470, 360],
            [805, 520],
            [875, 520]
          ];
        }

        animateHumanMission({
          element: workerEl,
          points: pathPoints,
          duration: 3600, // Velocidad pausada y digerible (3.6s para recorrer la nave)
          hatColor: carrier.hatColor,
          itemColor: item.color,
          facing: type === 'in' ? 1 : -1
        }).then(function() {
          carrier.humanState = 'idle';
          carrier.tool = 'none';
          carrier.expression = 'normal';
          renderAllWarehouseZones();
          resolve();
        });
      }, 750);
    });
  }

  function animateHumanMission(opt) {
    return new Promise(function(resolve) {
      var el = opt.element;
      var pts = opt.points;
      var duration = opt.duration || 3500;
      var start = null;

      var lengths = [];
      var totalLen = 0;
      for (var i = 1; i < pts.length; i++) {
        var dx = pts[i][0] - pts[i - 1][0];
        var dy = pts[i][1] - pts[i - 1][1];
        var len = Math.hypot(dx, dy);
        lengths.push(len);
        totalLen += len;
      }

      function getPt(t) {
        var target = t * totalLen;
        var acc = 0;
        for (var j = 0; j < lengths.length; j++) {
          if (acc + lengths[j] >= target) {
            var frac = (target - acc) / lengths[j];
            return [
              pts[j][0] + (pts[j + 1][0] - pts[j][0]) * frac,
              pts[j][1] + (pts[j + 1][1] - pts[j][1]) * frac
            ];
          }
          acc += lengths[j];
        }
        return pts[pts.length - 1];
      }

      function step(ts) {
        if (!start) start = ts;
        var elapsed = ts - start;
        var raw = Math.min(1, elapsed / duration);
        var eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        var pos = getPt(eased);
        var bob = Math.sin(raw * Math.PI * 10) * 1.8;

        el.innerHTML = Agents.createGnomeSVG({
          x: pos[0],
          y: pos[1] + bob,
          scale: 0.74,
          hatColor: opt.hatColor,
          beardColor: '#ffffff',
          carrying: true,
          expression: 'straining',
          itemColor: opt.itemColor,
          facing: opt.facing,
          walkFrame: raw * 16
        });

        if (raw < 1) {
          requestAnimationFrame(step);
        } else {
          el.remove();
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }

  function setupEventListeners() {
    Engine.EventBus.on('stock:changed', renderAllWarehouseZones);
    Engine.EventBus.on('ledger:reset', renderAllWarehouseZones);
  }

  return {
    init: init,
    renderAllWarehouseZones: renderAllWarehouseZones,
    dispatchGnomeMovement: dispatchGnomeMovement
  };
})(window.NOMITOS_DATA, window.NOMITOS_AGENTS, window.NOMITOS_ENGINE);
