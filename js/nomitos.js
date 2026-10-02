/**
 * EL ALMACÉN DE NOMITOS - js/nomitos.js
 * Generador vectorial y comportamiento cinético de nomitos obreros:
 * - Rostro expresivo (ojos, cejas, parpadeo, boca, barba, gorro cónico)
 * - Herramientas: escoba, carretilla/transpaleta, portapapeles, cajas, lápiz, sello
 * - Expresiones: normal, focused, straining, happy, chatting
 * - Globos de cómic para interactuar y dar vida permanente al almacén
 * Licencia: MIT
 */

window.NOMITOS_AGENTS = (function(Data) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /**
   * Genera el marcado SVG vectorial de un nomito obrero.
   */
  function createGnomeSVG(options) {
    var opt = Object.assign({
      x: 0,
      y: 0,
      scale: 0.74,
      hatColor: '#e55d23',
      beardColor: '#f7efe4',
      carrying: false,
      tool: 'none', // 'broom', 'hand_truck', 'clipboard', 'box', 'pen', 'stamp'
      expression: 'normal', // 'normal', 'focused', 'straining', 'happy'
      itemColor: '#d29922',
      facing: 1, // 1: derecha, -1: izquierda
      isClerk: false,
      speechBubble: null, // Texto o emoji flotante
      walkFrame: 0 // Inclinación o paso
    }, options);

    // Ojos y cejas según expresión
    var eyesMarkup = '';
    var browsMarkup = '';
    var mouthMarkup = '';
    var sweatMarkup = '';

    if (opt.expression === 'straining') {
      browsMarkup = '<path d="M-5 -2L-1 0M5 -2L1 0" stroke="#4a2e1d" stroke-width="1.3" stroke-linecap="round"/>';
      eyesMarkup = '<circle cx="-3" cy="2" r="1.3" fill="#1b2420"/><circle cx="3" cy="2" r="1.3" fill="#1b2420"/>';
      mouthMarkup = '<ellipse cx="0" cy="6.2" rx="2" ry="1.2" fill="#5a3825"/>';
      sweatMarkup = '<path d="M8 -2Q10 -5 11 -2Q10 0 8 -2" fill="#58a6ff" opacity="0.9"/>';
    } else if (opt.expression === 'focused') {
      browsMarkup = '<path d="M-6 -2H-1M1 -2H6" stroke="#3d2617" stroke-width="1.2" stroke-linecap="round"/>';
      eyesMarkup = '<circle cx="-3" cy="2" r="2.1" fill="#ffffff" stroke="#222" stroke-width="0.5"/>' +
                   '<circle cx="-2.5" cy="2" r="1.1" fill="#17201d"/>' +
                   '<circle cx="3" cy="2" r="2.1" fill="#ffffff" stroke="#222" stroke-width="0.5"/>' +
                   '<circle cx="3.5" cy="2" r="1.1" fill="#17201d"/>';
      mouthMarkup = '<line x1="-2.5" y1="5.5" x2="2.5" y2="5.5" stroke="#5a3825" stroke-width="1" stroke-linecap="round"/>';
    } else if (opt.expression === 'happy') {
      eyesMarkup = '<path d="M-5 2Q-3 0 -1 2M1 2Q3 0 5 2" stroke="#1b2420" stroke-width="1.4" stroke-linecap="round" fill="none"/>';
      mouthMarkup = '<path d="M-2.5 5Q0 7.8 2.5 5" stroke="#793c20" stroke-width="1.2" stroke-linecap="round" fill="#e27c5e"/>';
    } else {
      // Expresión atenta y vivaz
      browsMarkup = '<path d="M-5 -2Q-3 -4 -1 -2M1 -2Q3 -4 5 -2" stroke="#5a3825" stroke-width="1" stroke-linecap="round" fill="none"/>';
      eyesMarkup = '<circle cx="-3" cy="1.8" r="2.1" fill="#ffffff"/>' +
                   '<circle cx="-2.7" cy="1.8" r="1.2" fill="#17201d"/>' +
                   '<circle cx="-3.2" cy="1.3" r="0.6" fill="#ffffff"/>' +
                   '<circle cx="3" cy="1.8" r="2.1" fill="#ffffff"/>' +
                   '<circle cx="3.3" cy="1.8" r="1.2" fill="#17201d"/>' +
                   '<circle cx="2.8" cy="1.3" r="0.6" fill="#ffffff"/>';
      mouthMarkup = '<path d="M-2 5Q0 6.6 2 5" stroke="#793c20" stroke-width="1" stroke-linecap="round" fill="none"/>';
    }

    // Herramientas y accesorios
    var toolMarkup = '';

    if (opt.tool === 'broom') {
      // Escoba de cerdas para Tito barriendo
      toolMarkup = '<g class="gnome-tool-broom" transform="translate(10, 8) rotate(' + (20 + Math.sin(opt.walkFrame) * 15) + ')">' +
        '<line x1="0" y1="-14" x2="0" y2="20" stroke="#9e7448" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M-6 20 L6 20 L8 28 L-8 28 Z" fill="#d29922" stroke="#6f4e1b" stroke-width="1"/>' +
        '<line x1="-5" y1="28" x2="-5" y2="30" stroke="#d29922" stroke-width="1.2"/>' +
        '<line x1="0" y1="28" x2="0" y2="30" stroke="#d29922" stroke-width="1.2"/>' +
        '<line x1="5" y1="28" x2="5" y2="30" stroke="#d29922" stroke-width="1.2"/>' +
        '</g>';
    } else if (opt.tool === 'hand_truck') {
      // Carretilla / Transpaleta manual que Bruno empuja
      toolMarkup = '<g class="gnome-tool-cart" transform="translate(14, 12)">' +
        // Mango y estructura de acero rojo
        '<line x1="-8" y1="6" x2="16" y2="6" stroke="#bf3c32" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="16" y1="6" x2="26" y2="16" stroke="#bf3c32" stroke-width="2.5"/>' +
        '<rect x="18" y="14" width="22" height="4" fill="#30363d" rx="1"/>' +
        // Rueda delantera
        '<circle cx="34" cy="22" r="5" fill="#1b2420" stroke="#8b949e" stroke-width="1"/>' +
        // Caja apilada sobre la transpaleta
        '<rect x="19" y="-2" width="18" height="15" rx="2" fill="#e3b341" stroke="#4a3717" stroke-width="1.2"/>' +
        '<text x="28" y="8" font-size="6" font-family="monospace" text-anchor="middle" fill="#333" font-weight="bold">STREFF</text>' +
        '</g>';
    } else if (opt.tool === 'clipboard') {
      // Tabla de inventario para Blas
      toolMarkup = '<g transform="translate(9, 10) rotate(-15)">' +
        '<rect x="0" y="0" width="10" height="14" rx="1" fill="#8c5e35" stroke="#333" stroke-width="0.8"/>' +
        '<rect x="1.5" y="2" width="7" height="10" fill="#ffffff"/>' +
        '<line x1="2.5" y1="4" x2="7.5" y2="4" stroke="#333" stroke-width="0.8"/>' +
        '<line x1="2.5" y1="6" x2="6.5" y2="6" stroke="#007b70" stroke-width="0.8"/>' +
        '<line x1="2.5" y1="8" x2="7" y2="8" stroke="#333" stroke-width="0.8"/>' +
        '</g>';
    } else if (opt.carrying || opt.tool === 'box') {
      // Caja o paquete en brazos
      toolMarkup = '<g class="gnome-box" transform="translate(' + (11 * opt.facing) + ' 13)">' +
        '<rect x="-10" y="-8" width="20" height="16" rx="2" fill="' + opt.itemColor + '" stroke="#382613" stroke-width="1.2"/>' +
        '<path d="M-10 0H10" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>' +
        '<path d="M0 -8V8" stroke="rgba(0,0,0,0.18)" stroke-width="1.8"/>' +
        '</g>';
    } else if (opt.isClerk) {
      if (opt.clerkTool === 'pen') {
        toolMarkup = '<g transform="translate(10, 10) rotate(-35)">' +
          '<rect x="0" y="0" width="3" height="14" rx="1" fill="#f4b942" stroke="#333" stroke-width="0.6"/>' +
          '<path d="M0 14L1.5 18L3 14Z" fill="#333"/>' +
          '</g>';
      } else {
        toolMarkup = '<g transform="translate(10, 10)">' +
          '<rect x="0" y="0" width="6" height="8" rx="1" fill="#bf3c32"/>' +
          '<rect x="2" y="-5" width="2" height="5" fill="#d6c6b2"/>' +
          '</g>';
      }
    }

    // Globo de diálogo si está hablando o pensando
    var speechMarkup = '';
    if (opt.speechBubble) {
      speechMarkup = '<g class="gnome-speech" transform="translate(12, -28)">' +
        '<rect x="-8" y="-12" width="26" height="18" rx="5" fill="#ffffff" stroke="#1b2420" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>' +
        '<path d="M-2 6 L-5 11 L3 6 Z" fill="#ffffff" stroke="#1b2420" stroke-width="1.2"/>' +
        '<rect x="-1.5" y="5.5" width="4" height="2" fill="#ffffff"/>' +
        '<text x="5" y="1" font-size="10" text-anchor="middle" font-weight="bold">' + opt.speechBubble + '</text>' +
        '</g>';
    }

    var flipTransform = opt.facing === -1 ? 'scale(-1, 1)' : '';

    return '<g class="nomito-agent" transform="translate(' + opt.x + ' ' + opt.y + ') scale(' + opt.scale + ') ' + flipTransform + '">' +
      // Sombra proyectada
      '<ellipse cx="0" cy="27" rx="14" ry="5.5" fill="rgba(0,0,0,0.16)"/>' +
      // Botas de obrero con paso según frame
      '<rect class="shoe" x="-11" y="' + (21 + Math.sin(opt.walkFrame) * 1.5) + '" width="9" height="6" rx="2.5" fill="#202a26" stroke="#121815" stroke-width="0.8"/>' +
      '<rect class="shoe" x="2" y="' + (21 - Math.sin(opt.walkFrame) * 1.5) + '" width="9" height="6" rx="2.5" fill="#202a26" stroke="#121815" stroke-width="0.8"/>' +
      // Overol de trabajo
      '<rect class="overol" x="-9" y="5" width="18" height="19" rx="6" fill="#007b70" stroke="#004f48" stroke-width="1"/>' +
      '<rect x="-4" y="14" width="8" height="6" rx="1.5" fill="#00635a"/>' +
      '<path d="M-6 5V14M6 5V14" stroke="#f4b942" stroke-width="1.8" stroke-linecap="round"/>' +
      // Cabeza y cara
      '<circle class="face" cx="0" cy="1" r="9.5" fill="#f5c296" stroke="#8c5332" stroke-width="1"/>' +
      '<ellipse cx="0" cy="3.5" rx="2.6" ry="2" fill="#ea9c77"/>' +
      browsMarkup + eyesMarkup + mouthMarkup + sweatMarkup +
      // Barba suave
      '<path class="beard" d="M-8 3Q0 22 8 3Q6 14 0 18Q-6 14-8 3" fill="' + opt.beardColor + '" stroke="#bda892" stroke-width="1"/>' +
      '<path d="M-5 4.5Q0 7.5 5 4.5Q0 5.2 -5 4.5" fill="' + opt.beardColor + '" opacity="0.95"/>' +
      // Gorro cónico
      '<path class="hat" d="M-11 -3Q0 -32 13 -3Q0 -9 -11 -3Z" fill="' + opt.hatColor + '" stroke="#882e08" stroke-width="1"/>' +
      '<path d="M-11.5 -2.5Q0 -7 13.5 -2.5" stroke="rgba(0,0,0,0.18)" stroke-width="2" fill="none"/>' +
      // Herramientas y globo
      toolMarkup + speechMarkup +
      '</g>';
  }

  // Agente Nomito con máquina de estados finita para vida permanente
  function NomitoAgent(config) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.hatColor = config.hatColor || '#e55d23';
    this.beardColor = config.beardColor || '#f7efe4';
    this.basePos = [config.basePos[0], config.basePos[1]];
    this.pos = [config.basePos[0], config.basePos[1]];
    this.isClerk = !!config.isClerk;
    this.clerkTool = config.clerkTool || (config.role === 'bureau-in' ? 'pen' : 'stamp');
    this.tool = config.tool || 'none';
    this.speed = config.speed || 1.0;
    this.state = 'idle'; // 'idle', 'patrolling', 'sweeping', 'pushing_cart', 'chatting', 'mission'
    this.facing = 1;
    this.carrying = false;
    this.itemColor = '#d29922';
    this.expression = 'normal';
    this.speechBubble = null;
    this.speechTimer = 0;
    this.walkFrame = Math.random() * 10;
    this.idleTimer = Math.random() * 100;
  }

  NomitoAgent.prototype.render = function(overrideOpts) {
    var opts = Object.assign({
      x: this.pos[0],
      y: this.pos[1],
      scale: this.isClerk ? 0.8 : 0.74,
      hatColor: this.hatColor,
      beardColor: this.beardColor,
      carrying: this.carrying,
      tool: this.tool,
      expression: this.expression,
      itemColor: this.itemColor,
      facing: this.facing,
      isClerk: this.isClerk,
      clerkTool: this.clerkTool,
      speechBubble: this.speechBubble,
      walkFrame: this.walkFrame
    }, overrideOpts);

    return createGnomeSVG(opts);
  };

  /**
   * Actualiza el comportamiento autónomo del nomito (vida permanente)
   */
  NomitoAgent.prototype.tickIdle = function(deltaTime) {
    if (this.isClerk) {
      // Faustino y Gaspar hacen pequeñas comprobaciones en su buró
      this.idleTimer += deltaTime;
      if (this.idleTimer > 180) {
        this.speechBubble = Math.random() > 0.5 ? '📋' : '✓';
        this.speechTimer = 50;
        this.idleTimer = 0;
      }
      if (this.speechTimer > 0) {
        this.speechTimer -= deltaTime;
        if (this.speechTimer <= 0) this.speechBubble = null;
      }
      return;
    }

    this.walkFrame += deltaTime * 0.12 * this.speed;

    // Actualizar burbuja de charla si la tiene
    if (this.speechTimer > 0) {
      this.speechTimer -= deltaTime;
      if (this.speechTimer <= 0) {
        this.speechBubble = null;
        this.expression = 'normal';
      }
    }

    // Rutinas según el rol
    if (this.role === 'sweeper') {
      // Tito barre de arriba hacia abajo por el Pasillo Central (eje Y entre 200 y 560, X ~ 470)
      this.tool = 'broom';
      var sweepCenter = 470;
      var targetY = 380 + Math.sin(this.walkFrame * 0.4) * 160;
      var targetX = sweepCenter + Math.sin(this.walkFrame * 1.8) * 18;
      this.facing = Math.cos(this.walkFrame * 0.4) > 0 ? 1 : -1;
      this.pos[0] = targetX;
      this.pos[1] = targetY;

    } else if (this.role === 'cart_pusher') {
      // Bruno mueve la transpaleta a lo largo del pasillo de fondo y central
      this.tool = 'hand_truck';
      var cartX = 470 + Math.cos(this.walkFrame * 0.3) * 180;
      this.facing = -Math.sin(this.walkFrame * 0.3) > 0 ? 1 : -1;
      this.pos[0] = cartX;
      this.pos[1] = 480;

    } else if (this.role === 'walker') {
      // Blas patrulla e inspecciona estantes con el clipboard
      this.tool = 'clipboard';
      var walkX = 470 + Math.sin(this.walkFrame * 0.35) * 190;
      var walkY = 240 + Math.sin(this.walkFrame * 0.7) * 30;
      this.facing = Math.cos(this.walkFrame * 0.35) > 0 ? 1 : -1;
      this.pos[0] = walkX;
      this.pos[1] = walkY;

      // Ocasionalmente muestra un globito de inspección
      if (Math.random() < 0.003 && !this.speechBubble) {
        var icons = ['👀', '📦', '🔍', '👌'];
        this.speechBubble = icons[Math.floor(Math.random() * icons.length)];
        this.speechTimer = 60;
      }
    } else {
      // Porteadores Pepe y Nico: caminan despacio cerca de su base si no hay misión activa
      var patrolOffset = Math.sin(this.walkFrame * 0.5) * 35;
      this.pos[0] = this.basePos[0] + patrolOffset;
      this.facing = Math.cos(this.walkFrame * 0.5) > 0 ? 1 : -1;

      if (Math.random() < 0.002 && !this.speechBubble) {
        var idleIcons = ['💬', '☕', '💪', '📦'];
        this.speechBubble = idleIcons[Math.floor(Math.random() * idleIcons.length)];
        this.speechTimer = 50;
      }
    }
  };

  function createSquad() {
    return Data.GNOME_ROSTER.map(function(cfg) {
      return new NomitoAgent(cfg);
    });
  }

  return {
    createGnomeSVG: createGnomeSVG,
    NomitoAgent: NomitoAgent,
    createSquad: createSquad
  };
})(window.NOMITOS_DATA);
