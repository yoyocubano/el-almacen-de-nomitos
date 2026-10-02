/**
 * EL ALMACÉN DE NOMITOS - js/nomitos.js
 * Generador vectorial y comportamiento cinético humano:
 * - Cigarrillo encendido con humo, taza de café, teléfono móvil a la oreja, escoba, transpaleta, clipboard
 * - Expresiones: normal, smoking, coffee, phone, straining, chatting, focused
 * - Paso pausado y digerible para la visión humana
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
      tool: 'none', // 'broom', 'hand_truck', 'clipboard', 'box', 'coffee', 'cigarette', 'phone', 'pen', 'stamp'
      expression: 'normal', // 'normal', 'smoking', 'coffee', 'phone', 'straining', 'chatting', 'focused'
      itemColor: '#d29922',
      facing: 1, // 1: derecha, -1: izquierda
      isClerk: false,
      clerkTool: 'pen',
      speechBubble: null,
      walkFrame: 0
    }, options);

    // Ojos, cejas y boca según expresión
    var eyesMarkup = '';
    var browsMarkup = '';
    var mouthMarkup = '';
    var sweatMarkup = '';
    var smokeSmoke = '';

    if (opt.expression === 'smoking' || opt.tool === 'cigarette') {
      // Ojos relajados entornados disfrutando el descanso
      browsMarkup = '<path d="M-5 -1Q-3 -2 -1 -1M1 -1Q3 -2 5 -1" stroke="#5a3825" stroke-width="1" stroke-linecap="round" fill="none"/>';
      eyesMarkup = '<path d="M-5 2Q-3 3.5 -1 2M1 2Q3 3.5 5 2" stroke="#222" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
      mouthMarkup = '<ellipse cx="0" cy="5.2" rx="1.5" ry="1" fill="#442a19"/>';
      // Humo del cigarrillo
      smokeSmoke = '<g transform="translate(14, 0)">' +
        '<path d="M0 0 Q4 -8 1 -14 Q-2 -20 3 -26" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
        '<circle cx="2" cy="-18" r="2.5" fill="rgba(255,255,255,0.3)"/>' +
        '</g>';
    } else if (opt.expression === 'phone' || opt.tool === 'phone') {
      // Hablando por el móvil con atención
      browsMarkup = '<path d="M-5 -3L-1 -1M1 -3L5 -1" stroke="#4a2e1d" stroke-width="1.2" stroke-linecap="round"/>';
      eyesMarkup = '<circle cx="-3" cy="1.8" r="2" fill="#ffffff"/><circle cx="-2.5" cy="1.8" r="1.1" fill="#17201d"/>' +
                   '<circle cx="3" cy="1.8" r="2" fill="#ffffff"/><circle cx="3.5" cy="1.8" r="1.1" fill="#17201d"/>';
      mouthMarkup = '<ellipse cx="0" cy="5.5" rx="1.8" ry="1.2" fill="#683d25"/>';
    } else if (opt.expression === 'coffee' || opt.tool === 'coffee') {
      // Saboreando café caliente
      browsMarkup = '<path d="M-5 -2Q-3 -4 -1 -2M1 -2Q3 -4 5 -2" stroke="#5a3825" stroke-width="1" stroke-linecap="round" fill="none"/>';
      eyesMarkup = '<path d="M-5 2Q-3 0.5 -1 2M1 2Q3 0.5 5 2" stroke="#1b2420" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
      mouthMarkup = '<path d="M-2 5Q0 7 2 5" stroke="#793c20" stroke-width="1.2" stroke-linecap="round" fill="#e27c5e"/>';
    } else if (opt.expression === 'straining') {
      // Esfuerzo al cargar cajas
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
    } else {
      // Expresión atenta y vivaz
      browsMarkup = '<path d="M-5 -2Q-3 -4 -1 -2M1 -2Q3 -4 5 -2" stroke="#5a3825" stroke-width="1" stroke-linecap="round" fill="none"/>';
      eyesMarkup = '<circle cx="-3" cy="1.8" r="2.1" fill="#ffffff"/><circle cx="-2.7" cy="1.8" r="1.2" fill="#17201d"/>' +
                   '<circle cx="3" cy="1.8" r="2.1" fill="#ffffff"/><circle cx="3.3" cy="1.8" r="1.2" fill="#17201d"/>';
      mouthMarkup = '<path d="M-2 5Q0 6.6 2 5" stroke="#793c20" stroke-width="1" stroke-linecap="round" fill="none"/>';
    }

    // Herramientas y accesorios humanos
    var toolMarkup = '';

    if (opt.tool === 'cigarette') {
      // Cigarrillo blanco con punta encendida naranja/roja en la mano
      toolMarkup = '<g class="gnome-cig" transform="translate(8, 6) rotate(15)">' +
        '<rect x="0" y="0" width="10" height="2.2" rx="0.5" fill="#f7f9f8" stroke="#333" stroke-width="0.4"/>' +
        '<rect x="8" y="0" width="2" height="2.2" fill="#ff7440"/>' +
        '<circle cx="10" cy="1.1" r="1.2" fill="#ffaa40"/>' +
        '</g>' + smokeSmoke;
    } else if (opt.tool === 'coffee') {
      // Taza de café blanco con vapor
      toolMarkup = '<g class="gnome-coffee" transform="translate(8, 8)">' +
        '<rect x="0" y="0" width="9" height="11" rx="1.5" fill="#ffffff" stroke="#333" stroke-width="0.8"/>' +
        '<path d="M9 3Q12 5.5 9 8" fill="none" stroke="#ffffff" stroke-width="1.2"/>' +
        '<path d="M2 -2Q4 -6 2 -10" stroke="rgba(255,255,255,0.7)" stroke-width="1" fill="none"/>' +
        '</g>';
    } else if (opt.tool === 'phone') {
      // Smartphone negro pegado a la oreja
      toolMarkup = '<g class="gnome-phone" transform="translate(9, -2) rotate(-10)">' +
        '<rect x="0" y="0" width="6" height="12" rx="1.5" fill="#111714" stroke="#58a6ff" stroke-width="0.8"/>' +
        '<rect x="1" y="2" width="4" height="8" fill="#58a6ff" opacity="0.85"/>' +
        '<circle cx="3" cy="11" r="0.5" fill="#ffffff"/>' +
        '</g>';
    } else if (opt.tool === 'broom') {
      // Escoba de cerdas para Tito barriendo
      toolMarkup = '<g class="gnome-tool-broom" transform="translate(10, 8) rotate(' + (20 + Math.sin(opt.walkFrame) * 12) + ')">' +
        '<line x1="0" y1="-14" x2="0" y2="20" stroke="#9e7448" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M-6 20 L6 20 L8 28 L-8 28 Z" fill="#d29922" stroke="#6f4e1b" stroke-width="1"/>' +
        '<line x1="-4" y1="28" x2="-4" y2="30" stroke="#d29922" stroke-width="1.2"/>' +
        '<line x1="0" y1="28" x2="0" y2="30" stroke="#d29922" stroke-width="1.2"/>' +
        '<line x1="4" y1="28" x2="4" y2="30" stroke="#d29922" stroke-width="1.2"/>' +
        '</g>';
    } else if (opt.tool === 'hand_truck') {
      // Transpaleta manual que Bruno empuja
      toolMarkup = '<g class="gnome-tool-cart" transform="translate(14, 12)">' +
        '<line x1="-8" y1="6" x2="16" y2="6" stroke="#bf3c32" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="16" y1="6" x2="26" y2="16" stroke="#bf3c32" stroke-width="2.5"/>' +
        '<rect x="18" y="14" width="22" height="4" fill="#30363d" rx="1"/>' +
        '<circle cx="34" cy="22" r="5" fill="#1b2420" stroke="#8b949e" stroke-width="1"/>' +
        '<rect x="19" y="-2" width="18" height="15" rx="2" fill="#e3b341" stroke="#4a3717" stroke-width="1.2"/>' +
        '<text x="28" y="8" font-size="6" font-family="monospace" text-anchor="middle" fill="#333" font-weight="bold">STREFF</text>' +
        '</g>';
    } else if (opt.tool === 'clipboard') {
      toolMarkup = '<g transform="translate(9, 10) rotate(-15)">' +
        '<rect x="0" y="0" width="10" height="14" rx="1" fill="#8c5e35" stroke="#333" stroke-width="0.8"/>' +
        '<rect x="1.5" y="2" width="7" height="10" fill="#ffffff"/>' +
        '<line x1="2.5" y1="4" x2="7.5" y2="4" stroke="#333" stroke-width="0.8"/>' +
        '<line x1="2.5" y1="6" x2="6.5" y2="6" stroke="#007b70" stroke-width="0.8"/>' +
        '</g>';
    } else if (opt.carrying || opt.tool === 'box') {
      toolMarkup = '<g class="gnome-box" transform="translate(' + (11 * opt.facing) + ' 13)">' +
        '<rect x="-10" y="-8" width="20" height="16" rx="2" fill="' + opt.itemColor + '" stroke="#382613" stroke-width="1.2"/>' +
        '<path d="M-10 0H10" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>' +
        '<path d="M0 -8V8" stroke="rgba(0,0,0,0.18)" stroke-width="1.8"/>' +
        '</g>';
    }

    // Globo de diálogo
    var speechMarkup = '';
    if (opt.speechBubble) {
      speechMarkup = '<g class="gnome-speech" transform="translate(12, -28)">' +
        '<rect x="-10" y="-12" width="30" height="18" rx="5" fill="#ffffff" stroke="#1b2420" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>' +
        '<path d="M-2 6 L-5 11 L3 6 Z" fill="#ffffff" stroke="#1b2420" stroke-width="1.2"/>' +
        '<rect x="-1.5" y="5.5" width="4" height="2" fill="#ffffff"/>' +
        '<text x="5" y="1" font-size="9" text-anchor="middle" font-family="sans-serif" font-weight="bold">' + opt.speechBubble + '</text>' +
        '</g>';
    }

    var flipTransform = opt.facing === -1 ? 'scale(-1, 1)' : '';

    return '<g class="nomito-agent" transform="translate(' + opt.x + ' ' + opt.y + ') scale(' + opt.scale + ') ' + flipTransform + '">' +
      '<ellipse cx="0" cy="27" rx="14" ry="5.5" fill="rgba(0,0,0,0.16)"/>' +
      // Botas con paso calmado
      '<rect class="shoe" x="-11" y="' + (21 + Math.sin(opt.walkFrame) * 1.2) + '" width="9" height="6" rx="2.5" fill="#202a26" stroke="#121815" stroke-width="0.8"/>' +
      '<rect class="shoe" x="2" y="' + (21 - Math.sin(opt.walkFrame) * 1.2) + '" width="9" height="6" rx="2.5" fill="#202a26" stroke="#121815" stroke-width="0.8"/>' +
      // Overol
      '<rect class="overol" x="-9" y="5" width="18" height="19" rx="6" fill="#007b70" stroke="#004f48" stroke-width="1"/>' +
      '<rect x="-4" y="14" width="8" height="6" rx="1.5" fill="#00635a"/>' +
      '<path d="M-6 5V14M6 5V14" stroke="#f4b942" stroke-width="1.8" stroke-linecap="round"/>' +
      // Cara
      '<circle class="face" cx="0" cy="1" r="9.5" fill="#f5c296" stroke="#8c5332" stroke-width="1"/>' +
      '<ellipse cx="0" cy="3.5" rx="2.6" ry="2" fill="#ea9c77"/>' +
      browsMarkup + eyesMarkup + mouthMarkup + sweatMarkup +
      // Barba
      '<path class="beard" d="M-8 3Q0 22 8 3Q6 14 0 18Q-6 14-8 3" fill="' + opt.beardColor + '" stroke="#bda892" stroke-width="1"/>' +
      '<path d="M-5 4.5Q0 7.5 5 4.5Q0 5.2 -5 4.5" fill="' + opt.beardColor + '" opacity="0.95"/>' +
      // Gorro cónico
      '<path class="hat" d="M-11 -3Q0 -32 13 -3Q0 -9 -11 -3Z" fill="' + opt.hatColor + '" stroke="#882e08" stroke-width="1"/>' +
      '<path d="M-11.5 -2.5Q0 -7 13.5 -2.5" stroke="rgba(0,0,0,0.18)" stroke-width="2" fill="none"/>' +
      toolMarkup + speechMarkup +
      '</g>';
  }

  // Agente Nomito con máquina de estados humana (pausas, café, cigarro, llamadas, charlas)
  function HumanGnome(config) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.hatColor = config.hatColor || '#e55d23';
    this.beardColor = config.beardColor || '#f7efe4';
    this.basePos = [config.basePos[0], config.basePos[1]];
    this.pos = [config.basePos[0], config.basePos[1]];
    this.targetPos = [config.basePos[0], config.basePos[1]];
    this.isClerk = !!config.isClerk;
    this.clerkTool = config.clerkTool || 'pen';
    this.tool = config.tool || 'none';
    this.speed = config.speed || Data.HUMAN_WALK_SPEED;
    this.facing = 1;
    this.carrying = false;
    this.itemColor = '#d29922';
    this.expression = 'normal';
    this.speechBubble = null;
    this.speechTimer = 0;
    this.walkFrame = Math.random() * 10;

    // Estados humanos: 'idle', 'walking', 'coffee', 'smoking', 'phone', 'chatting', 'sweeping', 'mission'
    this.humanState = this.role === 'sweeper' ? 'sweeping' : 'idle';
    this.actionTimer = 60 + Math.random() * 120; // Tiempo en el estado actual
  }

  HumanGnome.prototype.render = function(overrideOpts) {
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
   * Actualiza el comportamiento humano pausado y digerible
   */
  HumanGnome.prototype.tickHuman = function(deltaTime, peers) {
    if (this.isClerk) {
      this.tickClerk(deltaTime);
      return;
    }

    if (this.speechTimer > 0) {
      this.speechTimer -= deltaTime;
      if (this.speechTimer <= 0) {
        this.speechBubble = null;
      }
    }

    this.actionTimer -= deltaTime;

    // Si terminó la acción actual, decide qué hacer a continuación como un humano
    if (this.actionTimer <= 0 && this.humanState !== 'mission') {
      this.decideNextHumanAction();
    }

    // Ejecución del estado actual
    if (this.humanState === 'walking') {
      this.walkTowardTarget(deltaTime);
      this.checkPeerEncounters(peers);
    } else if (this.humanState === 'sweeping') {
      this.sweepCorridor(deltaTime);
    } else if (this.humanState === 'smoking') {
      this.tool = 'cigarette';
      this.expression = 'smoking';
      if (Math.random() < 0.008 && !this.speechBubble) {
        this.speechBubble = '💨';
        this.speechTimer = 40;
      }
    } else if (this.humanState === 'coffee') {
      this.tool = 'coffee';
      this.expression = 'coffee';
      if (Math.random() < 0.008 && !this.speechBubble) {
        this.speechBubble = '☕';
        this.speechTimer = 40;
      }
    } else if (this.humanState === 'phone') {
      this.tool = 'phone';
      this.expression = 'phone';
    } else if (this.humanState === 'chatting') {
      this.expression = 'normal';
    }
  };

  HumanGnome.prototype.tickClerk = function(deltaTime) {
    this.actionTimer -= deltaTime;
    if (this.speechTimer > 0) {
      this.speechTimer -= deltaTime;
      if (this.speechTimer <= 0) this.speechBubble = null;
    }
    if (this.actionTimer <= 0) {
      this.actionTimer = 180 + Math.random() * 200;
      if (Math.random() > 0.5) {
        this.speechBubble = this.role === 'bureau-in' ? '☎' : '📋';
        this.speechTimer = 60;
      }
    }
  };

  /**
   * Decide la próxima actividad cotidiana
   */
  HumanGnome.prototype.decideNextHumanAction = function() {
    var rand = Math.random();

    if (this.role === 'sweeper') {
      // Tito a veces descansa de barrer y se echa un cigarro o un café
      if (rand < 0.25) {
        this.setTargetAndWalk(Data.POIS.coffeeMachine.x - 20, Data.POIS.coffeeMachine.y, 'coffee', 180);
      } else if (rand < 0.45) {
        this.setTargetAndWalk(Data.POIS.smokingCorner.x - 20, Data.POIS.smokingCorner.y, 'smoking', 200);
      } else {
        this.humanState = 'sweeping';
        this.tool = 'broom';
        this.actionTimer = 250 + Math.random() * 200;
      }
      return;
    }

    if (this.role === 'cart_pusher') {
      // Bruno mueve la transpaleta, pero se para a mirar o va a la salida
      if (rand < 0.3) {
        this.setTargetAndWalk(Data.POIS.smokingCorner.x - 40, Data.POIS.smokingCorner.y, 'smoking', 220);
      } else if (rand < 0.6) {
        this.setTargetAndWalk(Data.POIS.coffeeMachine.x, Data.POIS.coffeeMachine.y, 'coffee', 180);
      } else {
        var x = 320 + Math.random() * 280;
        this.tool = 'hand_truck';
        this.setTargetAndWalk(x, 480, 'idle', 140);
      }
      return;
    }

    // Porteadores e inspectores (Pepe, Nico, Blas)
    if (rand < 0.22) {
      // Ir a la máquina de café
      this.setTargetAndWalk(Data.POIS.coffeeMachine.x, Data.POIS.coffeeMachine.y, 'coffee', 220);
      this.speechBubble = '☕';
      this.speechTimer = 50;
    } else if (rand < 0.42) {
      // Ir al rincón de fumar junto a la salida
      this.setTargetAndWalk(Data.POIS.smokingCorner.x, Data.POIS.smokingCorner.y, 'smoking', 250);
      this.speechBubble = '🚬';
      this.speechTimer = 50;
    } else if (rand < 0.60) {
      // Ir a asomarse a la puerta de entrada a ver si llega camión
      this.setTargetAndWalk(Data.POIS.gateInLookout.x, Data.POIS.gateInLookout.y, 'idle', 160);
      this.speechBubble = '👀';
      this.speechTimer = 50;
    } else if (rand < 0.80) {
      // Ir a un estante a organizar
      var shelfPois = [Data.POIS.shelfOutillage, Data.POIS.shelfPlomberie, Data.POIS.shelfElectrique, Data.POIS.shelfMobilier, Data.POIS.shelfStreff];
      var dest = shelfPois[Math.floor(Math.random() * shelfPois.length)];
      this.setTargetAndWalk(dest.x + (Math.random() * 30 - 15), dest.y + (Math.random() * 20 - 10), 'idle', 180);
      this.tool = 'box';
      this.speechBubble = '📦';
      this.speechTimer = 40;
    } else {
      // Pasear tranquilo por el pasillo central
      var py = 200 + Math.random() * 320;
      this.setTargetAndWalk(Data.POIS.couloirCentre.x + (Math.random() * 20 - 10), py, 'idle', 150);
    }
  };

  HumanGnome.prototype.setTargetAndWalk = function(tx, ty, nextState, duration) {
    this.targetPos = [tx, ty];
    this.humanState = 'walking';
    this.nextStateAfterWalk = nextState;
    this.actionTimer = duration;
    this.tool = 'none';
    this.expression = 'normal';
  };

  HumanGnome.prototype.walkTowardTarget = function(deltaTime) {
    var dx = this.targetPos[0] - this.pos[0];
    var dy = this.targetPos[1] - this.pos[1];
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 4) {
      this.facing = dx >= 0 ? 1 : -1;
      var moveStep = this.speed * deltaTime * 1.8;
      this.pos[0] += (dx / dist) * Math.min(dist, moveStep);
      this.pos[1] += (dy / dist) * Math.min(dist, moveStep);
      this.walkFrame += deltaTime * 0.12;
    } else {
      this.humanState = this.nextStateAfterWalk || 'idle';
      this.nextStateAfterWalk = null;
    }
  };

  HumanGnome.prototype.sweepCorridor = function(deltaTime) {
    this.tool = 'broom';
    this.walkFrame += deltaTime * 0.08;
    var sweepY = 380 + Math.sin(this.walkFrame * 0.3) * 150;
    var sweepX = 470 + Math.sin(this.walkFrame * 1.5) * 14;
    this.facing = Math.cos(this.walkFrame * 0.3) > 0 ? 1 : -1;
    this.pos[0] = sweepX;
    this.pos[1] = sweepY;
  };

  /**
   * Si dos nomitos se cruzan en el pasillo, se paran a hablar
   */
  HumanGnome.prototype.checkPeerEncounters = function(peers) {
    if (!peers || this.humanState !== 'walking') return;
    for (var i = 0; i < peers.length; i++) {
      var other = peers[i];
      if (other.id === this.id || other.isClerk) continue;
      var dist = Math.hypot(other.pos[0] - this.pos[0], other.pos[1] - this.pos[1]);
      if (dist < 34 && other.humanState !== 'mission' && this.humanState !== 'chatting') {
        // Encuentro humano
        this.humanState = 'chatting';
        this.actionTimer = 90; // Charlan 1.5 segundos
        this.facing = other.pos[0] > this.pos[0] ? 1 : -1;
        other.facing = -this.facing;
        var greetings = ['¡Hola!', '¿Qué tal?', '¡Epa!', '☕', '💬'];
        this.speechBubble = greetings[Math.floor(Math.random() * greetings.length)];
        this.speechTimer = 60;
        break;
      }
    }
  };

  function createSquad() {
    return Data.GNOME_ROSTER.map(function(cfg) {
      return new HumanGnome(cfg);
    });
  }

  return {
    createGnomeSVG: createGnomeSVG,
    HumanGnome: HumanGnome,
    createSquad: createSquad
  };
})(window.NOMITOS_DATA);
