/**
 * EL ALMACÉN DE NOMITOS - js/warehouse.js
 * Renderizado espacial del almacén (SVG interactivo):
 * - Gate de entrada con camión + Buró de entrada (Faustino)
 * - Gate de salida con furgoneta + Buró de salida (Gaspar)
 * - 4 Zonas físicas del inventario real (Mural, Mobilier, Logistique Streff, Vrac)
 * - Anaqueles con cajas físicas dinámicas
 * - Rutas cinéticas para los nomitos obreros
 * Licencia: MIT
 */

window.NOMITOS_WAREHOUSE = (function(Data, Agents, Engine) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var svgEl = null;
  var movingLayer = null;
  var staticGnomesLayer = null;
  var racksLayer = null;
  var hazardBanner = null;

  // Waypoints clave del plano espacial (viewBox 0 0 940 720)
  var WAYPOINTS = {
    dockIn: [80, 260],
    bureauIn: [180, 230],
    centralCorridorWest: [280, 360],
    centralCorridorCenter: [470, 360],
    centralCorridorEast: [660, 360],
    bureauOut: [740, 480],
    dockOut: [860, 520],
    // Zonas de almacenamiento
    zoneMural: [250, 240],
    zoneFond: [470, 210],
    zoneMobilier: [690, 240],
    zoneVrac: [470, 520]
  };

  function init(svgSelector) {
    svgEl = document.querySelector(svgSelector);
    if (!svgEl) return;

    svgEl.innerHTML = '';
    renderStaticWorld();
    renderRacks();
    renderStationaryGnomes();
    setupEventListeners();
  }

  function renderStaticWorld() {
    var width = 940, height = 720;

    var html = '' +
      '<defs>' +
        // Trama de baldosas de hormigón industrial
        '<pattern id="wh-grid" width="40" height="40" patternUnits="userSpaceOnUse">' +
          '<path d="M40 0H0V40" fill="none" stroke="var(--line)" stroke-width="0.8" opacity="0.45"/>' +
        '</pattern>' +
        '<filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.14"/>' +
        '</filter>' +
        '<filter id="heavyShadow" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.22"/>' +
        '</filter>' +
      '</defs>' +

      // Suelo general
      '<rect width="' + width + '" height="' + height + '" fill="var(--floor)"/>' +
      '<rect width="' + width + '" height="' + height + '" fill="url(#wh-grid)"/>' +

      // Líneas de señalización vial en el suelo (amarillo seguridad)
      '<line x1="120" y1="0" x2="120" y2="720" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>' +
      '<line x1="820" y1="0" x2="820" y2="720" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>' +
      '<path d="M140 360 H800" stroke="var(--line-strong)" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.3"/>' +

      // ----------------------------------------------------
      // MUELLE DE ENTRADA (GATE A - CAMIÓN)
      // ----------------------------------------------------
      '<g id="gate-in" transform="translate(16, 120)">' +
        '<rect width="94" height="230" rx="4" class="dock" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Persiana industrial
        '<rect x="12" y="24" width="70" height="100" fill="#1b2420" opacity="0.9"/>' +
        '<path d="M12 40H82M12 56H82M12 72H82M12 88H82M12 104H82" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Rampa de descarga
        '<rect x="8" y="140" width="78" height="60" fill="var(--teal)" opacity="0.18" stroke="var(--teal)" stroke-width="1.5"/>' +
        '<circle cx="24" cy="214" r="6" fill="var(--teal)" class="pulse"/>' +
        '<text x="47" y="174" text-anchor="middle" class="zone-label" fill="var(--teal)">MUELLE A</text>' +
        '<text x="47" y="190" text-anchor="middle" class="tiny-label" fill="var(--muted)">RECEPCIÓN</text>' +
        // Camión de reparto exterior
        '<g id="truck-in" transform="translate(-6, 30)">' +
          '<path d="M-4 12h54l22 24v42H-4Z" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
          '<rect x="42" y="20" width="22" height="18" fill="var(--teal-soft)"/>' +
          '<circle cx="14" cy="78" r="9" fill="#1b2420"/><circle cx="58" cy="78" r="9" fill="#1b2420"/>' +
          '<rect x="2" y="16" width="36" height="52" fill="var(--teal)" opacity="0.8"/>' +
          '<text x="20" y="46" text-anchor="middle" font-size="8" font-family="monospace" fill="#fff" font-weight="bold">CARGA</text>' +
        '</g>' +
      '</g>' +

      // ----------------------------------------------------
      // BURÓ DE ENTRADA (MESA DE FAUSTINO)
      // ----------------------------------------------------
      '<g id="bureau-in" transform="translate(136, 175)" filter="url(#softShadow)">' +
        '<rect width="110" height="68" rx="4" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Tablero y documentos
        '<rect x="10" y="10" width="38" height="26" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1"/>' +
        '<path d="M15 16h28M15 22h22M15 28h26" stroke="var(--teal)" stroke-width="2"/>' +
        // Monitor de control
        '<rect x="62" y="12" width="36" height="22" rx="2" fill="#1b2420"/>' +
        '<rect x="65" y="15" width="30" height="16" fill="var(--teal)" opacity="0.85"/>' +
        '<text x="55" y="56" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="var(--ink)">BURÓ ENTRADA</text>' +
        '<text x="55" y="64" text-anchor="middle" font-size="7" font-family="monospace" fill="var(--muted)">Faustino (Control)</text>' +
      '</g>' +

      // ----------------------------------------------------
      // BURÓ DE SALIDA (MESA DE GASPAR)
      // ----------------------------------------------------
      '<g id="bureau-out" transform="translate(680, 420)" filter="url(#softShadow)">' +
        '<rect width="110" height="68" rx="4" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Selladora y comanda
        '<rect x="62" y="10" width="38" height="26" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1"/>' +
        '<path d="M67 16h28M67 22h20M67 28h24" stroke="var(--orange)" stroke-width="2"/>' +
        // Monitor de expedición
        '<rect x="12" y="12" width="36" height="22" rx="2" fill="#1b2420"/>' +
        '<rect x="15" y="15" width="30" height="16" fill="var(--orange)" opacity="0.85"/>' +
        '<text x="55" y="56" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="var(--ink)">BURÓ SALIDA</text>' +
        '<text x="55" y="64" text-anchor="middle" font-size="7" font-family="monospace" fill="var(--muted)">Gaspar (Expedición)</text>' +
      '</g>' +

      // ----------------------------------------------------
      // MUELLE DE SALIDA (GATE B - FURGONETA)
      // ----------------------------------------------------
      '<g id="gate-out" transform="translate(826, 410)">' +
        '<rect width="94" height="230" rx="4" class="dock" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Persiana
        '<rect x="12" y="24" width="70" height="100" fill="#1b2420" opacity="0.9"/>' +
        '<path d="M12 40H82M12 56H82M12 72H82M12 88H82M12 104H82" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Rampa de salida
        '<rect x="8" y="140" width="78" height="60" fill="var(--orange)" opacity="0.18" stroke="var(--orange)" stroke-width="1.5"/>' +
        '<circle cx="70" cy="214" r="6" fill="var(--orange)" class="pulse"/>' +
        '<text x="47" y="174" text-anchor="middle" class="zone-label" fill="var(--orange)">MUELLE B</text>' +
        '<text x="47" y="190" text-anchor="middle" class="tiny-label" fill="var(--muted)">EXPEDICIÓN</text>' +
        // Furgoneta de recogida
        '<g id="truck-out" transform="translate(26, 120)">' +
          '<path d="M0 0h48l18 18v34H0Z" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
          '<rect x="38" y="6" width="16" height="14" fill="var(--orange-soft)"/>' +
          '<circle cx="12" cy="52" r="8" fill="#1b2420"/><circle cx="50" cy="52" r="8" fill="#1b2420"/>' +
          '<rect x="4" y="6" width="30" height="40" fill="var(--orange)" opacity="0.8"/>' +
          '<text x="19" y="30" text-anchor="middle" font-size="7" font-family="monospace" fill="#fff" font-weight="bold">ENVÍO</text>' +
        '</g>' +
      '</g>' +

      // Capa de anaqueles
      '<g id="racks-layer"></g>' +

      // Banner de advertencia de congestión (Local -5)
      '<g id="hazard-banner" transform="translate(270, 20)" opacity="0" style="transition:opacity 0.4s ease">' +
        '<rect width="400" height="34" rx="4" fill="#bf3c32" filter="url(#softShadow)"/>' +
        '<text x="200" y="21" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff">' +
          '⚠️ PASSAGE CENTRAL ENCOMBRÉ (LOCAL -5)' +
        '</text>' +
      '</g>' +

      // Capa de trabajadores fijos (almaceneros en buró)
      '<g id="static-gnomes-layer"></g>' +

      // Capa de trabajadores en movimiento
      '<g id="moving-gnomes-layer"></g>';

    svgEl.innerHTML = html;
    movingLayer = svgEl.querySelector('#moving-gnomes-layer');
    staticGnomesLayer = svgEl.querySelector('#static-gnomes-layer');
    racksLayer = svgEl.querySelector('#racks-layer');
    hazardBanner = svgEl.querySelector('#hazard-banner');
  }

  function renderRacks() {
    if (!racksLayer) return;

    var metrics = Engine.ledger.getMetrics();
    var zs = metrics.zoneStats;

    var html = '' +
      // 1. ZONA IZQUIERDA: STOCKAGE MURAL (Mural metálico)
      renderRackModule({
        id: 'rack-mural',
        x: 180,
        y: 280,
        w: 160,
        h: 180,
        title: 'CÔTÉ GAUCHE : MURAL',
        subtitle: 'Estructura Metálica',
        color: Data.ZONES.mural.color,
        units: zs.mural.units,
        capacity: zs.mural.capacity,
        boxItems: Engine.ledger.getItemsByZone('mural')
      }) +

      // 2. ZONA FONDO: LOGISTIQUE STREFF
      renderRackModule({
        id: 'rack-fond',
        x: 390,
        y: 80,
        w: 160,
        h: 180,
        title: 'ZONE FOND : LOGISTIQUE',
        subtitle: 'Cartons Streff',
        color: Data.ZONES.fond.color,
        units: zs.fond.units,
        capacity: zs.fond.capacity,
        boxItems: Engine.ledger.getItemsByZone('fond')
      }) +

      // 3. ZONA DERECHA: MOBILIER BUREAU
      renderRackModule({
        id: 'rack-mobilier',
        x: 600,
        y: 180,
        w: 160,
        h: 180,
        title: 'CÔTÉ DROIT : MOBILIER',
        subtitle: 'Sit-Stand & Sièges',
        color: Data.ZONES.mobilier.color,
        units: zs.mobilier.units,
        capacity: zs.mobilier.capacity,
        boxItems: Engine.ledger.getItemsByZone('mobilier')
      }) +

      // 4. ZONA INFERIOR: VRAC & ACCESSOIRES
      renderRackModule({
        id: 'rack-vrac',
        x: 390,
        y: 430,
        w: 160,
        h: 170,
        title: 'VRAC & ACCESSOIRES',
        subtitle: 'Bureautique',
        color: Data.ZONES.vrac.color,
        units: zs.vrac.units,
        capacity: zs.vrac.capacity,
        boxItems: Engine.ledger.getItemsByZone('vrac')
      });

    racksLayer.innerHTML = html;

    // Actualizar banner de pasillo central encombré
    if (hazardBanner) {
      hazardBanner.setAttribute('opacity', metrics.isCongested ? '1' : '0');
    }
  }

  function renderRackModule(cfg) {
    var percent = Math.min(100, Math.round((cfg.units / cfg.capacity) * 100));
    var boxes = [];

    // Generar representación visual de cajas apiladas según el stock real
    var totalBoxesToDraw = Math.min(24, Math.ceil(cfg.units * 0.7));
    var boxIndex = 0;

    cfg.boxItems.forEach(function(item) {
      var count = Math.min(6, Math.ceil(item.stock * 0.6));
      for (var b = 0; b < count; b++) {
        if (boxIndex >= 18) break;
        var col = boxIndex % 4;
        var row = Math.floor(boxIndex / 4);
        var bx = cfg.x + 18 + col * 32;
        var by = cfg.y + 36 + row * 40;
        boxes.push(
          '<rect x="' + bx + '" y="' + by + '" width="24" height="20" rx="2" fill="' + item.color + '" stroke="#27342f" stroke-width="1" opacity="0.9"/>' +
          '<line x1="' + bx + '" y1="' + (by + 10) + '" x2="' + (bx + 24) + '" y2="' + (by + 10) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>'
        );
        boxIndex++;
      }
    });

    return '' +
      '<g id="' + cfg.id + '" filter="url(#softShadow)">' +
        // Marco del estante / pasillo
        '<rect x="' + cfg.x + '" y="' + cfg.y + '" width="' + cfg.w + '" height="' + cfg.h + '" rx="4" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
        // Cabecera del anaquel
        '<rect x="' + cfg.x + '" y="' + cfg.y + '" width="' + cfg.w + '" height="26" fill="var(--surface-2)"/>' +
        '<line x1="' + cfg.x + '" y1="' + (cfg.y + 26) + '" x2="' + (cfg.x + cfg.w) + '" y2="' + (cfg.y + 26) + '" stroke="var(--line)" stroke-width="1"/>' +
        '<text x="' + (cfg.x + cfg.w / 2) + '" y="' + (cfg.y + 16) + '" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="var(--ink)">' +
          cfg.title +
        '</text>' +
        // Baldas metálicas horizontales
        '<line x1="' + (cfg.x + 8) + '" y1="' + (cfg.y + 70) + '" x2="' + (cfg.x + cfg.w - 8) + '" y2="' + (cfg.y + 70) + '" stroke="var(--line-strong)" stroke-width="3"/>' +
        '<line x1="' + (cfg.x + 8) + '" y1="' + (cfg.y + 115) + '" x2="' + (cfg.x + cfg.w - 8) + '" y2="' + (cfg.y + 115) + '" stroke="var(--line-strong)" stroke-width="3"/>' +
        '<line x1="' + (cfg.x + 8) + '" y1="' + (cfg.y + 155) + '" x2="' + (cfg.x + cfg.w - 8) + '" y2="' + (cfg.y + 155) + '" stroke="var(--line-strong)" stroke-width="3"/>' +
        // Cajas apiladas
        boxes.join('') +
        // Barra inferior de capacidad y métrica
        '<rect x="' + (cfg.x + 12) + '" y="' + (cfg.y + cfg.h - 14) + '" width="' + (cfg.w - 24) + '" height="6" fill="var(--line)" rx="2"/>' +
        '<rect x="' + (cfg.x + 12) + '" y="' + (cfg.y + cfg.h - 14) + '" width="' + ((cfg.w - 24) * percent / 100) + '" height="6" fill="' + cfg.color + '" rx="2"/>' +
        '<text x="' + (cfg.x + cfg.w / 2) + '" y="' + (cfg.y + cfg.h + 14) + '" text-anchor="middle" font-family="monospace" font-size="9" fill="var(--muted)">' +
          cfg.units + ' / ' + cfg.capacity + ' u. (' + percent + '%)' +
        '</text>' +
      '</g>';
  }

  function renderStationaryGnomes() {
    if (!staticGnomesLayer) return;

    // Almacenero de entrada: Faustino
    var faustino = Agents.createGnomeSVG({
      x: 185,
      y: 195,
      scale: 0.8,
      hatColor: '#e55d23',
      beardColor: '#f7efe4',
      expression: 'focused',
      isClerk: true,
      clerkTool: 'pen'
    });

    // Almacenero de salida: Gaspar
    var gaspar = Agents.createGnomeSVG({
      x: 735,
      y: 440,
      scale: 0.8,
      hatColor: '#007b70',
      beardColor: '#e8ded0',
      expression: 'focused',
      isClerk: true,
      clerkTool: 'stamp',
      facing: -1
    });

    // Nomitos descansando en guardia (Pepe, Bruno, Nico)
    var pepe = Agents.createGnomeSVG({ x: 260, y: 500, scale: 0.72, hatColor: '#e55d23', beardColor: '#fff', expression: 'happy' });
    var bruno = Agents.createGnomeSVG({ x: 300, y: 500, scale: 0.74, hatColor: '#007b70', beardColor: '#d6c6b2', expression: 'normal' });
    var nico = Agents.createGnomeSVG({ x: 620, y: 490, scale: 0.72, hatColor: '#f4b942', beardColor: '#fff', expression: 'happy', facing: -1 });

    staticGnomesLayer.innerHTML = faustino + gaspar + pepe + bruno + nico;
  }

  /**
   * Ejecuta la animación de transporte cinético de una misión.
   * Entrada: Camión -> Buró Entrada (Faustino) -> Anaquel correspondiente.
   * Salida: Anaquel -> Buró Salida (Gaspar) -> Gate Salida (Furgoneta).
   */
  function dispatchGnomeMovement(mission) {
    if (!movingLayer) return;

    var type = mission.type;
    var item = mission.item;
    var count = mission.gnomeCount || 2;
    var targetRack = WAYPOINTS.zoneFond;

    if (item.zone === 'mural') targetRack = WAYPOINTS.zoneMural;
    else if (item.zone === 'mobilier') targetRack = WAYPOINTS.zoneMobilier;
    else if (item.zone === 'vrac') targetRack = WAYPOINTS.zoneVrac;

    var promises = [];

    for (var i = 0; i < count; i++) {
      (function(idx) {
        var hat = idx % 2 === 0 ? '#e55d23' : '#007b70';
        var workerEl = document.createElementNS(NS, 'g');
        workerEl.setAttribute('class', 'moving-worker');
        movingLayer.appendChild(workerEl);

        var pathPoints = [];
        if (type === 'in') {
          // ENTRADA: Muelle A -> Buró Entrada -> Pasillo -> Anaquel Destino
          pathPoints = [
            [WAYPOINTS.dockIn[0] + idx * 10, WAYPOINTS.dockIn[1]],
            [WAYPOINTS.bureauIn[0] + idx * 8, WAYPOINTS.bureauIn[1] + 10],
            [WAYPOINTS.centralCorridorWest[0], WAYPOINTS.centralCorridorWest[1]],
            [targetRack[0] + (idx * 20 - 15), targetRack[1] + 25]
          ];
        } else {
          // SALIDA: Anaquel Origen -> Pasillo Central -> Buró Salida -> Muelle B
          pathPoints = [
            [targetRack[0] + (idx * 20 - 15), targetRack[1] + 25],
            [WAYPOINTS.centralCorridorCenter[0], WAYPOINTS.centralCorridorCenter[1]],
            [WAYPOINTS.bureauOut[0] - idx * 8, WAYPOINTS.bureauOut[1] + 10],
            [WAYPOINTS.dockOut[0] - idx * 10, WAYPOINTS.dockOut[1]]
          ];
        }

        var promise = animatePolyline({
          element: workerEl,
          points: pathPoints,
          delay: idx * 260,
          duration: 2400 + idx * 120,
          hatColor: hat,
          itemColor: item.color,
          facing: type === 'in' ? 1 : (pathPoints[0][0] > pathPoints[pathPoints.length - 1][0] ? -1 : 1),
          carrying: true
        });

        promises.push(promise);
      })(i);
    }

    return Promise.all(promises).then(function() {
      renderRacks();
    });
  }

  function animatePolyline(options) {
    return new Promise(function(resolve) {
      var el = options.element;
      var pts = options.points;
      var delay = options.delay || 0;
      var duration = options.duration || 2000;
      var startTime = null;

      // Calcular longitudes de segmento
      var lengths = [];
      var totalLen = 0;
      for (var i = 1; i < pts.length; i++) {
        var dx = pts[i][0] - pts[i - 1][0];
        var dy = pts[i][1] - pts[i - 1][1];
        var len = Math.sqrt(dx * dx + dy * dy);
        lengths.push(len);
        totalLen += len;
      }

      function getInterpolatedPoint(t) {
        var targetDist = t * totalLen;
        var accumulated = 0;
        for (var j = 0; j < lengths.length; j++) {
          if (accumulated + lengths[j] >= targetDist) {
            var frac = (targetDist - accumulated) / lengths[j];
            var p0 = pts[j];
            var p1 = pts[j + 1];
            return [p0[0] + (p1[0] - p0[0]) * frac, p0[1] + (p1[1] - p0[1]) * frac];
          }
          accumulated += lengths[j];
        }
        return pts[pts.length - 1];
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime - delay;

        if (elapsed < 0) {
          requestAnimationFrame(step);
          return;
        }

        var progress = Math.max(0, Math.min(1, elapsed / duration));
        // Easing suave (quad)
        var eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        var pt = getInterpolatedPoint(eased);

        // Bamboleo vertical realista (bobbing de caminar con peso)
        var bob = Math.sin(progress * Math.PI * 14) * 2.8;

        el.innerHTML = Agents.createGnomeSVG({
          x: pt[0],
          y: pt[1] + bob,
          scale: 0.74,
          hatColor: options.hatColor,
          beardColor: '#f7efe4',
          carrying: true,
          expression: 'straining',
          itemColor: options.itemColor,
          facing: options.facing
        });

        if (progress < 1) {
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
    Engine.EventBus.on('stock:changed', function(data) {
      renderRacks();
    });

    Engine.EventBus.on('ledger:reset', function() {
      renderRacks();
    });
  }

  return {
    init: init,
    renderRacks: renderRacks,
    dispatchGnomeMovement: dispatchGnomeMovement
  };
})(window.NOMITOS_DATA, window.NOMITOS_AGENTS, window.NOMITOS_ENGINE);
