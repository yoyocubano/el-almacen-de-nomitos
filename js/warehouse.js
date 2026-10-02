/**
 * EL ALMACÉN DE NOMITOS - js/warehouse.js
 * Plano esquemático y motor espacial:
 * "PLAN DE DISPOSITION : STOCKAGE & ÉLECTRIQUE" (Local -5 Blue Bank)
 * 
 * - Nave industrial delimitada por muros perimetrales
 * - 3 Filas y Pasillo Central continuo ("COULOIR CENTRAL — DÉGAGEMENT OBLIGATOIRE")
 * - 12 Zonas reales con objetos visibles: Sièges ergo, Sit-Stand, Cartons Streff, Panneaux Texaa
 * - VIDA PERMANENTE: Loop de animación idle continuo (Tito barriendo, Bruno con transpaleta,
 *   Blas inspeccionando, charlas, burós activos) + Misiones de albarán prioritarias.
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
  var isMissionActive = false;

  // Coordenadas espaciales dentro de la nave (viewBox 0 0 960 720)
  var BUILDING = {
    x: 24,
    y: 20,
    w: 912,
    h: 680
  };

  var WAYPOINTS = {
    gateIn: [85, 230],
    bureauIn: [145, 230],
    couloirNord: [470, 180],
    couloirCentre: [470, 360],
    couloirSud: [470, 540],
    bureauOut: [810, 520],
    gateOut: [870, 520],
    // Puntos de carga de cada zona
    rackVert: [210, 180],
    rackTexaa: [210, 330],
    rackBulle: [210, 480],
    rackElec: [210, 600],
    rackSitstand: [730, 180],
    rackSieges: [730, 330],
    rackBucks: [730, 470],
    rackArmoire: [730, 590],
    zoneStreff: [360, 110],
    zoneArchive: [580, 110]
  };

  function init(svgSelector) {
    svgEl = document.querySelector(svgSelector);
    if (!svgEl) return;

    // Crear la cuadrilla autónoma
    gnomesSquad = Agents.createSquad();

    renderBuildingStructure();
    renderAllWarehouseZones();
    setupEventListeners();

    // Arrancar el loop de vida permanente a 60 fps
    if (animFrameId) cancelAnimationFrame(animFrameId);
    lastTimestamp = performance.now();
    loop(lastTimestamp);
  }

  /**
   * Bucle de simulación espacial continua (vida permanente)
   */
  function loop(timestamp) {
    var deltaTime = (timestamp - lastTimestamp) / 16.66; // Normalizado a ~1.0 a 60fps
    if (deltaTime > 3) deltaTime = 3;
    lastTimestamp = timestamp;

    // Actualizar cada nomito de la cuadrilla
    gnomesSquad.forEach(function(nomito) {
      if (nomito.state !== 'mission') {
        nomito.tickIdle(deltaTime);
      }
    });

    renderActiveGnomes();

    animFrameId = requestAnimationFrame(loop);
  }

  /**
   * Renderiza los muros y arquitectura del Local -5
   */
  function renderBuildingStructure() {
    var bx = BUILDING.x, by = BUILDING.y, bw = BUILDING.w, bh = BUILDING.h;

    var html = '' +
      '<defs>' +
        // Baldosas de hormigón reforzado
        '<pattern id="slab-grid" width="48" height="48" patternUnits="userSpaceOnUse">' +
          '<path d="M48 0H0V48" fill="none" stroke="var(--line)" stroke-width="0.75" opacity="0.4"/>' +
        '</pattern>' +
        // Patrón de rayas amarillas y negras de seguridad
        '<pattern id="hazard-stripes" width="20" height="20" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
          '<rect width="10" height="20" fill="#f4b942"/>' +
          '<rect x="10" width="10" height="20" fill="#202a26"/>' +
        '</pattern>' +
        '<filter id="buildingShadow" x="-10%" y="-10%" width="120%" height="120%">' +
          '<feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.25"/>' +
        '</filter>' +
      '</defs>' +

      // Terreno exterior
      '<rect width="960" height="720" fill="var(--page)"/>' +

      // ----------------------------------------------------
      // LA NAVE ARQUITECTÓNICA (LOCAL -5 DE BLUE BANK)
      // ----------------------------------------------------
      '<g id="nave-local-5" filter="url(#buildingShadow)">' +
        // Suelo interior
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="var(--floor)"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="url(#slab-grid)"/>' +

        // Muros de carga perimetrales (12px de grosor)
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="none" stroke="#252f2b" stroke-width="12" rx="4"/>' +
        '<rect x="' + (bx + 6) + '" y="' + (by + 6) + '" width="' + (bw - 12) + '" height="' + (bh - 12) + '" fill="none" stroke="var(--line-strong)" stroke-width="1.5"/>' +

        // Rótulo del edificio en pared superior
        '<text x="' + (bx + bw / 2) + '" y="' + (by + 20) + '" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="var(--muted)" letter-spacing="2">' +
          'BLUE BANK · LOCAL -5 STOCKAGE (PLAN DE DISPOSITION : STOCKAGE & ÉLECTRIQUE)' +
        '</text>' +

        // ----------------------------------------------------
        // PASILLO CENTRAL (COULOIR CENTRAL - DÉGAGEMENT OBLIGATOIRE)
        // ----------------------------------------------------
        '<g id="couloir-central">' +
          // Franja del pasillo central
          '<rect x="410" y="' + (by + 28) + '" width="120" height="' + (bh - 40) + '" fill="var(--surface-2)" opacity="0.6"/>' +
          // Bandas laterales de seguridad amarilla
          '<line x1="410" y1="' + (by + 28) + '" x2="410" y2="' + (by + bh - 12) + '" stroke="var(--yellow)" stroke-width="3" stroke-dasharray="10 8"/>' +
          '<line x1="530" y1="' + (by + 28) + '" x2="530" y2="' + (by + bh - 12) + '" stroke="var(--yellow)" stroke-width="3" stroke-dasharray="10 8"/>' +
          // Marcas de suelo
          '<text x="470" y="320" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="var(--muted)" letter-spacing="1">' +
            '▲ COULOIR CENTRAL ▲' +
          '</text>' +
          '<text x="470" y="335" text-anchor="middle" font-family="monospace" font-size="7.5" font-weight="bold" fill="var(--orange)" letter-spacing="1">' +
            'ZONE CRITIQUE : DÉGAGEMENT PERMANENT' +
          '</text>' +
          '<text x="470" y="440" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="var(--muted)" letter-spacing="1">' +
            'PRIORITÉ CIRCULATION NOMITOS' +
          '</text>' +
        '</g>' +

        // ----------------------------------------------------
        // ACCESO MUELLE A (ENTRÉE DU LOCAL / CAMION)
        // ----------------------------------------------------
        '<g id="gate-dock-in" transform="translate(18, 170)">' +
          '<rect x="0" y="0" width="45" height="110" fill="#202a26" stroke="var(--teal)" stroke-width="2"/>' +
          '<rect x="0" y="10" width="30" height="90" fill="url(#hazard-stripes)"/>' +
          '<circle cx="22" cy="55" r="7" fill="var(--teal)" class="pulse"/>' +
          '<text x="8" y="-8" font-family="monospace" font-size="9" font-weight="bold" fill="var(--teal)">PORTE ENTRÉE</text>' +
        '</g>' +

        // Camión descargando en Muelle A
        '<g id="truck-graphic" transform="translate(5, 175)">' +
          '<rect x="-8" y="12" width="22" height="74" rx="2" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.5"/>' +
          '<rect x="-4" y="24" width="14" height="50" fill="var(--teal)" opacity="0.8"/>' +
          '<text x="3" y="52" font-family="monospace" font-size="7" font-weight="bold" fill="#fff" transform="rotate(90 3 52)">LIVRAISON</text>' +
        '</g>' +

        // Buró de entrada: Faustino
        '<g id="desk-faustino" transform="translate(85, 175)">' +
          '<rect width="70" height="70" rx="3" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
          '<rect x="6" y="8" width="26" height="20" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1"/>' +
          '<path d="M10 14h18M10 19h14M10 24h16" stroke="var(--teal)" stroke-width="1.5"/>' +
          '<rect x="36" y="10" width="26" height="18" fill="#1b2420" rx="1"/>' +
          '<rect x="38" y="12" width="22" height="14" fill="var(--teal)" opacity="0.75"/>' +
          '<text x="35" y="48" text-anchor="middle" font-size="8" font-family="monospace" font-weight="bold" fill="var(--ink)">BURÓ ENTRADA</text>' +
          '<text x="35" y="58" text-anchor="middle" font-size="6.5" font-family="monospace" fill="var(--muted)">Faustino (Sello)</text>' +
        '</g>' +

        // ----------------------------------------------------
        // ACCESO MUELLE B (EXPÉDITION / FURGONETA)
        // ----------------------------------------------------
        '<g id="gate-dock-out" transform="translate(875, 460)">' +
          '<rect x="0" y="0" width="45" height="110" fill="#202a26" stroke="var(--orange)" stroke-width="2"/>' +
          '<rect x="15" y="10" width="30" height="90" fill="url(#hazard-stripes)"/>' +
          '<circle cx="22" cy="55" r="7" fill="var(--orange)" class="pulse"/>' +
          '<text x="4" y="-8" font-family="monospace" font-size="9" font-weight="bold" fill="var(--orange)">PORTE EXPÉDITION</text>' +
        '</g>' +

        // Furgoneta de salida en Muelle B
        '<g id="van-graphic" transform="translate(900, 465)">' +
          '<rect x="2" y="12" width="20" height="70" rx="2" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.5"/>' +
          '<rect x="4" y="22" width="14" height="48" fill="var(--orange)" opacity="0.8"/>' +
          '<text x="11" y="48" font-family="monospace" font-size="6.5" font-weight="bold" fill="#fff" transform="rotate(90 11 48)">ENLÈVEMENT</text>' +
        '</g>' +

        // Buró de salida: Gaspar
        '<g id="desk-gaspar" transform="translate(775, 480)">' +
          '<rect width="70" height="70" rx="3" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
          '<rect x="38" y="8" width="26" height="20" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1"/>' +
          '<path d="M42 14h18M42 19h14M42 24h16" stroke="var(--orange)" stroke-width="1.5"/>' +
          '<rect x="8" y="10" width="26" height="18" fill="#1b2420" rx="1"/>' +
          '<rect x="10" y="12" width="22" height="14" fill="var(--orange)" opacity="0.75"/>' +
          '<text x="35" y="48" text-anchor="middle" font-size="8" font-family="monospace" font-weight="bold" fill="var(--ink)">BURÓ SALIDA</text>' +
          '<text x="35" y="58" text-anchor="middle" font-size="6.5" font-family="monospace" fill="var(--muted)">Gaspar (Expedición)</text>' +
        '</g>' +

        // Capa dinámica para todas las zonas de almacenamiento
        '<g id="zones-layer"></g>' +

        // Capa de los nomitos activos (vida permanente + misiones)
        '<g id="active-gnomes-layer"></g>' +

        // Alerta de congestión física del pasillo central
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

  /**
   * Dibuja los anaqueles y zonas del plano real de Blue Bank
   */
  function renderAllWarehouseZones() {
    var zonesLayer = svgEl.querySelector('#zones-layer');
    if (!zonesLayer) return;

    var metrics = Engine.ledger.getMetrics();
    var items = Engine.ledger.items;

    var html = '' +
      // ======================================================================
      // 1. ZONA FONDO: EXPÉDITION CARTONS STREFF & ARCHIVES (-6 / -7)
      // ======================================================================
      renderZoneModule({
        id: 'zone-streff',
        x: 290,
        y: 45,
        w: 180,
        h: 90,
        title: 'EXPÉDITION STREFF',
        tag: '15+ CARTONS',
        color: '#e3b341',
        items: items.filter(function(i) { return i.zone === 'fond' && i.sku.startsWith('STR'); }),
        visualType: 'streff'
      }) +

      renderZoneModule({
        id: 'zone-archive',
        x: 490,
        y: 45,
        w: 180,
        h: 90,
        title: 'FOND ARCHIVE -6/-7',
        tag: 'SACS CONFIDENTIEL',
        color: '#f85149',
        items: items.filter(function(i) { return i.zone === 'fond' && i.sku.startsWith('ARC'); }),
        visualType: 'archive'
      }) +

      // ======================================================================
      // 2. FILA IZQUIERDA (CÔTÉ GAUCHE : MURAL, TEXAA, BULLE, ÉLECTRIQUE)
      // ======================================================================
      renderZoneModule({
        id: 'zone-vert',
        x: 60,
        y: 260,
        w: 140,
        h: 95,
        title: 'RAYONNAGE VERT',
        tag: 'MATÉRIEL DIVERS',
        color: '#2ea043',
        items: items.filter(function(i) { return i.sku === 'MUR-VERT'; }),
        visualType: 'metal_rack'
      }) +

      renderZoneModule({
        id: 'zone-texaa',
        x: 60,
        y: 370,
        w: 140,
        h: 95,
        title: 'PANNEAUX TEXAA',
        tag: 'ACOUSTIQUE',
        color: '#ff7b72',
        items: items.filter(function(i) { return i.sku === 'MUR-TEXAA'; }),
        visualType: 'texaa'
      }) +

      renderZoneModule({
        id: 'zone-bulle',
        x: 60,
        y: 480,
        w: 140,
        h: 95,
        title: 'ZONE ÉTROITE',
        tag: 'SOUS BULLE',
        color: '#3fb950',
        items: items.filter(function(i) { return i.sku === 'MUR-BULLE'; }),
        visualType: 'table_top'
      }) +

      renderZoneModule({
        id: 'zone-elec',
        x: 60,
        y: 590,
        w: 140,
        h: 95,
        title: 'LOCAL ÉLECTRIQUE',
        tag: 'CÂBLES & RADIATEUR',
        color: '#d29922',
        items: items.filter(function(i) { return i.zone === 'gauche' && i.sku.startsWith('ELEC'); }),
        visualType: 'electric'
      }) +

      // ======================================================================
      // 3. FILA DERECHA (CÔTÉ DROIT : MOBILIER, SIT-STAND, SIÈGES, ARMOIRE)
      // ======================================================================
      renderZoneModule({
        id: 'zone-sitstand',
        x: 740,
        y: 60,
        w: 155,
        h: 95,
        title: 'BUREAUX SIT-STAND',
        tag: '2 STRUCTURES MÉTAL',
        color: '#79c0ff',
        items: items.filter(function(i) { return i.sku === 'MOB-SITSTAND'; }),
        visualType: 'sit_stand'
      }) +

      renderZoneModule({
        id: 'zone-sieges',
        x: 740,
        y: 170,
        w: 155,
        h: 95,
        title: 'SIÈGES ERGONOMIQUES',
        tag: '5 SIÈGES BUREAU',
        color: '#58a6ff',
        items: items.filter(function(i) { return i.sku === 'MOB-SIEGES' || i.sku === 'MOB-TABOURETS'; }),
        visualType: 'chairs'
      }) +

      renderZoneModule({
        id: 'zone-bucks',
        x: 740,
        y: 280,
        w: 155,
        h: 95,
        title: 'CAISSONS & BUCKS',
        tag: 'STOCKAGE BAS',
        color: '#a5d6ff',
        items: items.filter(function(i) { return i.sku === 'MOB-BUCKS'; }),
        visualType: 'bucks'
      }) +

      renderZoneModule({
        id: 'zone-armoire',
        x: 740,
        y: 390,
        w: 155,
        h: 80,
        title: 'ARMOIRE & RACKS INFO',
        tag: 'SERVEUR / MÉTAL',
        color: '#8b949e',
        items: items.filter(function(i) { return i.sku === 'MOB-ARMOIRE'; }),
        visualType: 'cabinet'
      }) +

      // ======================================================================
      // 4. VRAC & ACCESSOIRES (PASILLO INFERIOR DERECHO)
      // ======================================================================
      renderZoneModule({
        id: 'zone-vrac',
        x: 580,
        y: 575,
        w: 175,
        h: 110,
        title: 'VRAC & ACCESSOIRES',
        tag: 'PORTE-PLANS & BACS',
        color: '#bc8cff',
        items: items.filter(function(i) { return i.zone === 'vrac'; }),
        visualType: 'vrac'
      });

    zonesLayer.innerHTML = html;

    // Actualizar advertencia del pasillo central
    var warnSign = svgEl.querySelector('#hazard-warning-sign');
    if (warnSign) {
      warnSign.setAttribute('opacity', metrics.isCongested ? '1' : '0');
    }
  }

  /**
   * Genera el módulo visual de una zona con objetos reales dibujados
   */
  function renderZoneModule(cfg) {
    var totalStock = cfg.items.reduce(function(acc, i) { return acc + i.stock; }, 0);
    var totalCap = cfg.items.reduce(function(acc, i) { return acc + i.capacity; }, 0);
    var percent = totalCap > 0 ? Math.min(100, Math.round((totalStock / totalCap) * 100)) : 0;

    // Representación visual detallada de los objetos de Blue Bank
    var visualObjects = '';

    if (cfg.visualType === 'streff') {
      // Cajas STREFF World Wide Moving doradas con texto
      var boxCount = Math.min(10, Math.ceil(totalStock * 0.6));
      for (var b = 0; b < boxCount; b++) {
        var bx = cfg.x + 12 + (b % 5) * 32;
        var by = cfg.y + 34 + Math.floor(b / 5) * 24;
        visualObjects += '<g transform="translate(' + bx + ',' + by + ')">' +
          '<rect width="28" height="20" rx="1.5" fill="#e3b341" stroke="#5a4115" stroke-width="1"/>' +
          '<text x="14" y="11" font-size="6.5" font-family="monospace" text-anchor="middle" font-weight="bold" fill="#3f2d12">STREFF</text>' +
          '<line x1="0" y1="13" x2="28" y2="13" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>' +
          '</g>';
      }
    } else if (cfg.visualType === 'texaa') {
      // Paneles acústicos Texaa rojizos alineados verticalmente
      var pCount = Math.min(8, totalStock);
      for (var p = 0; p < pCount; p++) {
        var px = cfg.x + 10 + p * 15;
        visualObjects += '<g transform="translate(' + px + ',' + (cfg.y + 34) + ')">' +
          '<rect width="11" height="46" rx="2" fill="#ff7b72" stroke="#8b2c24" stroke-width="0.8"/>' +
          '<line x1="3" y1="4" x2="3" y2="42" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>' +
          '<text x="5.5" y="26" font-size="5" font-family="monospace" text-anchor="middle" fill="#fff" transform="rotate(90 5.5 26)">TEXAA</text>' +
          '</g>';
      }
    } else if (cfg.visualType === 'chairs') {
      // Sillas ergonómicas con ruedas y respaldo
      var chairCount = Math.min(5, totalStock);
      for (var c = 0; c < chairCount; c++) {
        var cx = cfg.x + 12 + c * 27;
        var cy = cfg.y + 40;
        visualObjects += '<g transform="translate(' + cx + ',' + cy + ')">' +
          '<circle cx="10" cy="10" r="8" fill="#58a6ff" stroke="#1f4f82" stroke-width="1"/>' +
          '<circle cx="10" cy="10" r="3" fill="#202a26"/>' +
          '<path d="M4 10 L16 10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' +
          '<circle cx="5" cy="22" r="2" fill="#333"/><circle cx="15" cy="22" r="2" fill="#333"/>' +
          '</g>';
      }
    } else if (cfg.visualType === 'sit_stand') {
      // Mesas Sit-Stand ergonómicas con motor
      var sCount = Math.min(2, totalStock);
      for (var s = 0; s < sCount; s++) {
        var sx = cfg.x + 14 + s * 66;
        var sy = cfg.y + 36;
        visualObjects += '<g transform="translate(' + sx + ',' + sy + ')">' +
          '<rect width="58" height="12" rx="1.5" fill="#f7f9f8" stroke="#333" stroke-width="1.2"/>' +
          '<line x1="8" y1="12" x2="8" y2="44" stroke="#79c0ff" stroke-width="3"/>' +
          '<line x1="50" y1="12" x2="50" y2="44" stroke="#79c0ff" stroke-width="3"/>' +
          '<rect x="24" y="14" width="10" height="7" rx="1" fill="#1b2420"/>' +
          '<text x="29" y="19" font-size="5" text-anchor="middle" fill="#79c0ff">M</text>' +
          '</g>';
      }
    } else {
      // Cajas genéricas organizadas en estante
      var gCount = Math.min(8, totalStock);
      for (var g = 0; g < gCount; g++) {
        var gx = cfg.x + 14 + (g % 4) * 28;
        var gy = cfg.y + 36 + Math.floor(g / 4) * 24;
        visualObjects += '<rect x="' + gx + '" y="' + gy + '" width="22" height="18" rx="2" fill="' + cfg.color + '" stroke="#27342f" stroke-width="0.8" opacity="0.9"/>';
      }
    }

    return '' +
      '<g id="' + cfg.id + '">' +
        // Marco de la zona
        '<rect x="' + cfg.x + '" y="' + cfg.y + '" width="' + cfg.w + '" height="' + cfg.h + '" rx="4" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.5"/>' +
        // Barra de título de la zona
        '<rect x="' + cfg.x + '" y="' + cfg.y + '" width="' + cfg.w + '" height="22" fill="var(--surface-2)"/>' +
        '<line x1="' + cfg.x + '" y1="' + (cfg.y + 22) + '" x2="' + (cfg.x + cfg.w) + '" y2="' + (cfg.y + 22) + '" stroke="var(--line)" stroke-width="1"/>' +
        '<text x="' + (cfg.x + 8) + '" y="' + (cfg.y + 14) + '" font-family="monospace" font-size="8.5" font-weight="bold" fill="var(--ink)">' +
          cfg.title +
        '</text>' +
        '<text x="' + (cfg.x + cfg.w - 8) + '" y="' + (cfg.y + 14) + '" text-anchor="end" font-family="monospace" font-size="7" font-weight="bold" fill="' + cfg.color + '">' +
          cfg.tag +
        '</text>' +
        // Objetos físicos reales visibles
        visualObjects +
        // Barra inferior de capacidad
        '<rect x="' + (cfg.x + 8) + '" y="' + (cfg.y + cfg.h - 8) + '" width="' + (cfg.w - 16) + '" height="4" fill="var(--line)" rx="1"/>' +
        '<rect x="' + (cfg.x + 8) + '" y="' + (cfg.y + cfg.h - 8) + '" width="' + ((cfg.w - 16) * percent / 100) + '" height="4" fill="' + cfg.color + '" rx="1"/>' +
      '</g>';
  }

  /**
   * Renderiza a todos los nomitos activos (Faustino, Gaspar, Tito, Bruno, Pepe, Nico, Blas)
   */
  function renderActiveGnomes() {
    if (!movingLayer) return;

    // Solo dibujamos los nomitos que no estén en misión prioritaria de transporte
    var html = gnomesSquad.map(function(nomito) {
      if (nomito.state === 'mission') return '';
      return nomito.render();
    }).join('');

    movingLayer.innerHTML = html;
  }

  /**
   * Ejecuta una misión de transporte activa cuando el usuario registra un movimiento
   */
  function dispatchGnomeMovement(mission) {
    return new Promise(function(resolve) {
      var item = mission.item;
      var type = mission.type;
      var count = mission.gnomeCount || 2;

      // Destino en el almacén según el artículo
      var targetCoords = WAYPOINTS.rackTexaa;
      if (item.sku === 'MUR-VERT') targetCoords = WAYPOINTS.rackVert;
      else if (item.sku === 'MUR-BULLE') targetCoords = WAYPOINTS.rackBulle;
      else if (item.sku.startsWith('ELEC')) targetCoords = WAYPOINTS.rackElec;
      else if (item.sku === 'MOB-SITSTAND') targetCoords = WAYPOINTS.rackSitstand;
      else if (item.sku === 'MOB-SIEGES' || item.sku === 'MOB-TABOURETS') targetCoords = WAYPOINTS.rackSieges;
      else if (item.sku === 'MOB-BUCKS') targetCoords = WAYPOINTS.rackBucks;
      else if (item.sku === 'MOB-ARMOIRE') targetCoords = WAYPOINTS.rackArmoire;
      else if (item.sku.startsWith('STR')) targetCoords = WAYPOINTS.zoneStreff;
      else if (item.sku.startsWith('ARC')) targetCoords = WAYPOINTS.zoneArchive;
      else if (item.zone === 'vrac') targetCoords = [660, 610];

      // Ponemos a Pepe y Nico en estado 'mission' para el transporte prioritario
      var carriers = gnomesSquad.filter(function(g) { return g.role === 'carrier'; });
      carriers.forEach(function(c) { c.state = 'mission'; });

      var promises = [];
      for (var i = 0; i < count; i++) {
        (function(idx) {
          var workerEl = document.createElementNS(NS, 'g');
          workerEl.setAttribute('class', 'mission-worker');
          svgEl.querySelector('#nave-local-5').appendChild(workerEl);

          var pathPoints = [];
          if (type === 'in') {
            // ENTRADA: Gate In -> Buró Faustino -> Pasillo Central -> Anaquel destino
            pathPoints = [
              [WAYPOINTS.gateIn[0], WAYPOINTS.gateIn[1] + idx * 8],
              [WAYPOINTS.bureauIn[0] + idx * 6, WAYPOINTS.bureauIn[1] + 10],
              [WAYPOINTS.couloirCentre[0], WAYPOINTS.couloirCentre[1] + (idx * 20 - 10)],
              [targetCoords[0] + (idx * 16 - 8), targetCoords[1] + 20]
            ];
          } else {
            // SALIDA: Anaquel origen -> Pasillo Central -> Buró Gaspar -> Gate Out
            pathPoints = [
              [targetCoords[0] + (idx * 16 - 8), targetCoords[1] + 20],
              [WAYPOINTS.couloirCentre[0], WAYPOINTS.couloirCentre[1] + (idx * 20 - 10)],
              [WAYPOINTS.bureauOut[0] - idx * 6, WAYPOINTS.bureauOut[1] + 10],
              [WAYPOINTS.gateOut[0], WAYPOINTS.gateOut[1] + idx * 8]
            ];
          }

          var p = animateMissionGnome({
            element: workerEl,
            points: pathPoints,
            delay: idx * 240,
            duration: 2500 + idx * 120,
            hatColor: idx % 2 === 0 ? '#e55d23' : '#f4b942',
            itemColor: item.color,
            facing: type === 'in' ? 1 : -1
          });
          promises.push(p);
        })(i);
      }

      Promise.all(promises).then(function() {
        carriers.forEach(function(c) { c.state = 'idle'; });
        renderAllWarehouseZones();
        resolve();
      });
    });
  }

  function animateMissionGnome(opt) {
    return new Promise(function(resolve) {
      var el = opt.element;
      var pts = opt.points;
      var delay = opt.delay || 0;
      var duration = opt.duration || 2400;
      var start = null;

      // Longitudes
      var lengths = [];
      var totalLen = 0;
      for (var i = 1; i < pts.length; i++) {
        var dx = pts[i][0] - pts[i - 1][0];
        var dy = pts[i][1] - pts[i - 1][1];
        var len = Math.sqrt(dx * dx + dy * dy);
        lengths.push(len);
        totalLen += len;
      }

      function getPt(t) {
        var target = t * totalLen;
        var acc = 0;
        for (var j = 0; j < lengths.length; j++) {
          if (acc + lengths[j] >= target) {
            var frac = (target - acc) / lengths[j];
            var p0 = pts[j];
            var p1 = pts[j + 1];
            return [p0[0] + (p1[0] - p0[0]) * frac, p0[1] + (p1[1] - p0[1]) * frac];
          }
          acc += lengths[j];
        }
        return pts[pts.length - 1];
      }

      function step(ts) {
        if (!start) start = ts;
        var elapsed = ts - start - delay;
        if (elapsed < 0) { requestAnimationFrame(step); return; }

        var raw = Math.max(0, Math.min(1, elapsed / duration));
        var eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        var pos = getPt(eased);
        var bob = Math.sin(raw * Math.PI * 14) * 2.8;

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
          walkFrame: raw * 20
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
    Engine.EventBus.on('stock:changed', function() {
      renderAllWarehouseZones();
    });

    Engine.EventBus.on('ledger:reset', function() {
      renderAllWarehouseZones();
    });
  }

  return {
    init: init,
    renderAllWarehouseZones: renderAllWarehouseZones,
    dispatchGnomeMovement: dispatchGnomeMovement
  };
})(window.NOMITOS_DATA, window.NOMITOS_AGENTS, window.NOMITOS_ENGINE);
