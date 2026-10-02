/**
 * EL ALMACÉN DE NOMITOS - js/nomitos.js
 * Generador vectorial y comportamiento de los nomitos obreros con rostro expresivo.
 * Estilo vectorial contemporáneo: gorro cónico, barba suave, caritas expresivas, sombras.
 * Licencia: MIT
 */

window.NOMITOS_AGENTS = (function(Data) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /**
   * Genera el marcado SVG vectorial de un nomito obrero.
   * @param {Object} options Configuración del nomito (x, y, scale, hatColor, beardColor, carrying, expression, itemColor)
   */
  function createGnomeSVG(options) {
    var opt = Object.assign({
      x: 0,
      y: 0,
      scale: 0.75,
      hatColor: '#e55d23',
      beardColor: '#f7efe4',
      carrying: false,
      expression: 'normal', // 'normal', 'focused', 'straining', 'happy'
      itemColor: '#d29922',
      facing: 1, // 1: derecha, -1: izquierda
      isClerk: false,
      clerkTool: 'pen' // 'pen' o 'stamp'
    }, options);

    // Ojos y cejas según la expresión
    var eyesMarkup = '';
    var browsMarkup = '';
    var mouthMarkup = '';
    var sweatMarkup = '';

    if (opt.expression === 'straining') {
      // Cejas en esfuerzo hacia abajo, ojos apretados
      browsMarkup = '<path d="M-5 -2L-1 0M5 -2L1 0" stroke="#5a3825" stroke-width="1.2" stroke-linecap="round"/>';
      eyesMarkup = '<circle cx="-3" cy="2" r="1.3" fill="#1b2420"/><circle cx="3" cy="2" r="1.3" fill="#1b2420"/>';
      mouthMarkup = '<ellipse cx="0" cy="6" rx="2" ry="1.2" fill="#5a3825"/>';
      // Gota de sudor animable
      sweatMarkup = '<path d="M8 -2Q10 -5 11 -2Q10 0 8 -2" fill="#58a6ff" opacity="0.85"/>';
    } else if (opt.expression === 'focused') {
      // Almacenero con gafas o mirada analítica
      browsMarkup = '<path d="M-6 -2H-1M1 -2H6" stroke="#4a2e1d" stroke-width="1.2" stroke-linecap="round"/>';
      eyesMarkup = '<circle cx="-3" cy="2" r="2" fill="#ffffff" stroke="#333" stroke-width="0.5"/>' +
                   '<circle cx="-2.5" cy="2" r="1.1" fill="#17201d"/>' +
                   '<circle cx="3" cy="2" r="2" fill="#ffffff" stroke="#333" stroke-width="0.5"/>' +
                   '<circle cx="3.5" cy="2" r="1.1" fill="#17201d"/>';
      mouthMarkup = '<line x1="-2" y1="5.5" x2="2" y2="5.5" stroke="#683d25" stroke-width="1" stroke-linecap="round"/>';
    } else if (opt.expression === 'happy') {
      // Ojos sonrientes en arco
      eyesMarkup = '<path d="M-5 2Q-3 0 -1 2M1 2Q3 0 5 2" stroke="#1b2420" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
      mouthMarkup = '<path d="M-2.5 5Q0 7.5 2.5 5" stroke="#793c20" stroke-width="1.2" stroke-linecap="round" fill="#e27c5e"/>';
    } else {
      // Ojos estándar con brillo
      browsMarkup = '<path d="M-5 -2Q-3 -4 -1 -2M1 -2Q3 -4 5 -2" stroke="#5a3825" stroke-width="0.9" stroke-linecap="round" fill="none"/>';
      eyesMarkup = '<circle cx="-3" cy="1.8" r="2" fill="#ffffff"/>' +
                   '<circle cx="-2.7" cy="1.8" r="1.2" fill="#17201d"/>' +
                   '<circle cx="-3.2" cy="1.3" r="0.5" fill="#ffffff"/>' +
                   '<circle cx="3" cy="1.8" r="2" fill="#ffffff"/>' +
                   '<circle cx="3.3" cy="1.8" r="1.2" fill="#17201d"/>' +
                   '<circle cx="2.8" cy="1.3" r="0.5" fill="#ffffff"/>';
      mouthMarkup = '<path d="M-2 5Q0 6.5 2 5" stroke="#793c20" stroke-width="1" stroke-linecap="round" fill="none"/>';
    }

    // Caja o mercancía cargada
    var carryMarkup = '';
    if (opt.carrying) {
      carryMarkup = '<g class="gnome-box" transform="translate(' + (11 * opt.facing) + ' 13)">' +
        '<rect x="-10" y="-8" width="20" height="16" rx="2" fill="' + opt.itemColor + '" stroke="#3f2b15" stroke-width="1.2"/>' +
        // Cinta de embalaje
        '<path d="M-10 0H10" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>' +
        '<path d="M0 -8V8" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>' +
        '</g>';
    }

    // Herramienta de almacenero
    var clerkToolMarkup = '';
    if (opt.isClerk) {
      if (opt.clerkTool === 'pen') {
        clerkToolMarkup = '<g transform="translate(10, 10) rotate(-35)">' +
          '<rect x="0" y="0" width="3" height="14" rx="1" fill="#f4b942" stroke="#333" stroke-width="0.6"/>' +
          '<path d="M0 14L1.5 18L3 14Z" fill="#333"/>' +
          '</g>';
      } else {
        clerkToolMarkup = '<g transform="translate(10, 10)">' +
          '<rect x="0" y="0" width="6" height="8" rx="1" fill="#bf3c32"/>' +
          '<rect x="2" y="-5" width="2" height="5" fill="#d6c6b2"/>' +
          '</g>';
      }
    }

    var flipTransform = opt.facing === -1 ? 'scale(-1, 1)' : '';

    return '<g class="nomito-agent" transform="translate(' + opt.x + ' ' + opt.y + ') scale(' + opt.scale + ') ' + flipTransform + '">' +
      // Sombra en el suelo
      '<ellipse cx="0" cy="27" rx="14" ry="5.5" fill="rgba(0,0,0,0.16)"/>' +
      // Botas de obrero
      '<rect class="shoe" x="-11" y="21" width="9" height="6" rx="2.5" fill="#202a26" stroke="#121815" stroke-width="0.8"/>' +
      '<rect class="shoe" x="2" y="21" width="9" height="6" rx="2.5" fill="#202a26" stroke="#121815" stroke-width="0.8"/>' +
      // Cuerpo / Overol de almacenero
      '<rect class="overol" x="-9" y="5" width="18" height="19" rx="6" fill="#007b70" stroke="#004f48" stroke-width="1"/>' +
      // Bolsillo frontal con lápiz o herramienta
      '<rect x="-4" y="14" width="8" height="6" rx="1.5" fill="#00635a"/>' +
      // Tirantes del peto
      '<path d="M-6 5V14M6 5V14" stroke="#f4b942" stroke-width="1.8" stroke-linecap="round"/>' +
      // Cabeza / Cara
      '<circle class="face" cx="0" cy="1" r="9.5" fill="#f5c296" stroke="#8c5332" stroke-width="1"/>' +
      // Nariz redondita típica de gnomo
      '<ellipse cx="0" cy="3.5" rx="2.6" ry="2" fill="#ea9c77"/>' +
      // Expresión facial
      browsMarkup + eyesMarkup + mouthMarkup + sweatMarkup +
      // Barba suave y espesa
      '<path class="beard" d="M-8 3Q0 22 8 3Q6 14 0 18Q-6 14-8 3" fill="' + opt.beardColor + '" stroke="#bda892" stroke-width="1"/>' +
      // Bigote simpático
      '<path d="M-5 4.5Q0 7.5 5 4.5Q0 5.2 -5 4.5" fill="' + opt.beardColor + '" opacity="0.95"/>' +
      // Gorro cónico con pliegue
      '<path class="hat" d="M-11 -3Q0 -32 13 -3Q0 -9 -11 -3Z" fill="' + opt.hatColor + '" stroke="#882e08" stroke-width="1"/>' +
      // Ribete del gorro
      '<path d="M-11.5 -2.5Q0 -7 13.5 -2.5" stroke="rgba(0,0,0,0.18)" stroke-width="2" fill="none"/>' +
      // Carga o herramienta
      carryMarkup + clerkToolMarkup +
      '</g>';
  }

  // Clase Nomito para control cinético
  function Nomito(config) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.hatColor = config.hatColor || '#e55d23';
    this.beardColor = config.beardColor || '#f7efe4';
    this.pos = config.pos ? [config.pos[0], config.pos[1]] : [100, 100];
    this.homePos = [this.pos[0], this.pos[1]];
    this.isClerk = !!config.isClerk;
    this.clerkTool = config.role === 'bureau-in' ? 'pen' : 'stamp';
    this.speed = config.speed || 1.0;
    this.state = 'idle'; // 'idle', 'moving', 'carrying', 'celebrating'
    this.facing = 1;
    this.carrying = false;
    this.itemColor = '#d29922';
    this.expression = config.expression || 'normal';
    this.domElement = null;
  }

  Nomito.prototype.renderMarkup = function(overrideOptions) {
    var opts = Object.assign({
      x: this.pos[0],
      y: this.pos[1],
      scale: this.isClerk ? 0.8 : 0.74,
      hatColor: this.hatColor,
      beardColor: this.beardColor,
      carrying: this.carrying,
      expression: this.expression,
      itemColor: this.itemColor,
      facing: this.facing,
      isClerk: this.isClerk,
      clerkTool: this.clerkTool
    }, overrideOptions);

    return createGnomeSVG(opts);
  };

  /**
   * Genera la cuadrilla activa a partir del roster
   */
  function createSquad() {
    return Data.GNOME_ROSTER.map(function(cfg) {
      return new Nomito(cfg);
    });
  }

  return {
    createGnomeSVG: createGnomeSVG,
    Nomito: Nomito,
    createSquad: createSquad
  };
})(window.NOMITOS_DATA);
