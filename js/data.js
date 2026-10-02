/**
 * EL ALMACÉN DE NOMITOS - js/data.js
 * Catálogo del inventario real, zonas organizadas y puntos de interés humano (POI):
 * - Café, rincón de fumar, asomarse a la puerta, estantes de eléctricos, plomería y herramientas.
 * - Velocidades digeribles y estados cotidianos humanos.
 * Licencia: MIT
 */

window.NOMITOS_DATA = (function() {
  'use strict';

  // Zonas del almacén categorizadas con claridad (Eléctricos, Plomería, Herramientas, Mobilier, Streff)
  var ZONES = {
    gauche: {
      id: 'gauche',
      name: 'Fila Izquierda : Électrique, Plomberie & Outillage',
      badge: 'TECH & MÉTAL',
      color: '#2ea043',
      subzones: ['Outillage & Matériel Vert', 'Plomberie & Acoustique TEXAA', 'Zone Étroite (Sous bulle)', 'Local Électrique & Bobines'],
      capacity: 40
    },
    droite: {
      id: 'droite',
      name: 'Fila Derecha : Mobilier, Sit-Stand & Info',
      badge: 'ERGONOMIE & POSTES',
      color: '#58a6ff',
      subzones: ['Bureaux Sit-Stand (Moteurs)', 'Sièges Bureau Ergonomiques', 'Caissons & Bucks (Bas)', 'Armoire Métallique & Serveurs'],
      capacity: 32
    },
    fond: {
      id: 'fond',
      name: 'Zona Fondo : Expédition STREFF & Archives',
      badge: 'LOGISTIQUE & ARCHIVES',
      color: '#e3b341',
      subzones: ['Palets Cartons STREFF (15+)', 'Archives Confidentielles (-6/-7)', 'Sacs à Détruire'],
      capacity: 45
    },
    vrac: {
      id: 'vrac',
      name: 'Zona Descanso & Vrac',
      badge: 'CAFÉ & ACCESSOIRES',
      color: '#bc8cff',
      subzones: ['Coin Café & Détente', 'Portemanteaux & Bacs', 'Chevalets Porte-Plans'],
      capacity: 15
    }
  };

  // Artículos con categorías claras (Eléctrico, Plomería/Materiales, Herramientas, Mobiliario, Streff)
  var INITIAL_ITEMS = [
    // ------------------------------------------------------------------------
    // SECTOR HERRAMIENTAS & OUTILLAGE (Estante Verde)
    // ------------------------------------------------------------------------
    {
      sku: 'OUT-VERT',
      name: 'Caisse Outillage & Rayonnage Vert',
      zone: 'gauche',
      subzone: 'Outillage & Matériel Vert',
      category: 'herramientas',
      stock: 2,
      capacity: 4,
      unit: 'Caisses',
      color: '#2ea043',
      note: 'Herramientas manuales y mantenimiento'
    },
    {
      sku: 'OUT-PERNOS',
      name: 'Coffrets Boulonnerie & Fixations',
      zone: 'gauche',
      subzone: 'Outillage & Matériel Vert',
      category: 'herramientas',
      stock: 4,
      capacity: 8,
      unit: 'Coffrets',
      color: '#3fb950',
      note: 'Tornillería y anclajes metálicos'
    },

    // ------------------------------------------------------------------------
    // SECTOR PLOMERÍA, PANELES & MATERIAUX (Estante Central Izq.)
    // ------------------------------------------------------------------------
    {
      sku: 'PLO-TEXAA',
      name: 'Panneaux Acoustiques TEXAA',
      zone: 'gauche',
      subzone: 'Plomberie & Acoustique TEXAA',
      category: 'plomeria_acabados',
      stock: 12,
      capacity: 20,
      unit: 'Panneaux',
      color: '#ff7b72',
      note: 'Paneles fonoabsorbentes rojizos'
    },
    {
      sku: 'PLO-BULLE',
      name: 'Plateaux de table sous bulle',
      zone: 'gauche',
      subzone: 'Zone Étroite (Sous bulle)',
      category: 'plomeria_acabados',
      stock: 8,
      capacity: 15,
      unit: 'Plateaux',
      color: '#56d364',
      note: 'Tableros protegidos con plástico burbuja'
    },

    // ------------------------------------------------------------------------
    // SECTOR ELÉCTRICO (Bobinas, Radiador, Cuadro)
    // ------------------------------------------------------------------------
    {
      sku: 'ELE-BOBINE',
      name: 'Bobines de Câble Cuivre & Gaine',
      zone: 'gauche',
      subzone: 'Local Électrique & Bobines',
      category: 'electricos',
      stock: 4,
      capacity: 8,
      unit: 'Bobines',
      color: '#d29922',
      note: 'Cables eléctricos y tubos corrugados'
    },
    {
      sku: 'ELE-RAD',
      name: "Radiateur électrique d'appoint",
      zone: 'gauche',
      subzone: 'Local Électrique & Bobines',
      category: 'electricos',
      stock: 1,
      capacity: 3,
      unit: 'Unité',
      color: '#e55d23',
      note: 'Calefacción auxiliar del local'
    },

    // ------------------------------------------------------------------------
    // SECTOR MOBILIARIO & INFORMÁTICA (Fila Derecha)
    // ------------------------------------------------------------------------
    {
      sku: 'MOB-SITSTAND',
      name: 'Structures Sit-Stand (Moteurs)',
      zone: 'droite',
      subzone: 'Bureaux Sit-Stand (Moteurs)',
      category: 'mobiliario',
      stock: 2,
      capacity: 4,
      unit: 'Bureaux',
      color: '#79c0ff',
      note: 'Mesas elevables con motor'
    },
    {
      sku: 'MOB-SIEGES',
      name: 'Sièges bureau ergonomiques (5)',
      zone: 'droite',
      subzone: 'Sièges Bureau Ergonomiques',
      category: 'mobiliario',
      stock: 5,
      capacity: 8,
      unit: 'Sièges',
      color: '#58a6ff',
      note: '5 sillas con ruedas y soporte lumbar'
    },
    {
      sku: 'MOB-BUCKS',
      name: 'Caissons & Bucks (Tiroirs)',
      zone: 'droite',
      subzone: 'Caissons & Bucks (Bas)',
      category: 'mobiliario',
      stock: 4,
      capacity: 8,
      unit: 'Caissons',
      color: '#a5d6ff',
      note: 'Cajoneras bajo mesa'
    },
    {
      sku: 'MOB-ARMOIRE',
      name: 'Armoire Métallique & Racks Info',
      zone: 'droite',
      subzone: 'Armoire Métallique & Serveurs',
      category: 'mobiliario',
      stock: 1,
      capacity: 2,
      unit: 'Armoire',
      color: '#8b949e',
      note: 'Armario cerrado y equipos de red'
    },

    // ------------------------------------------------------------------------
    // SECTOR EXPEDICIÓN STREFF & ARCHIVOS (Fondo)
    // ------------------------------------------------------------------------
    {
      sku: 'STR-MOVING',
      name: 'Cartons STREFF (World Wide Moving)',
      zone: 'fond',
      subzone: 'Palets Cartons STREFF (15+)',
      category: 'streff',
      stock: 15,
      capacity: 25,
      unit: 'Cartons',
      color: '#e3b341',
      note: '15+ grandes cajas Streff sobre palets'
    },
    {
      sku: 'STR-DIVERS',
      name: 'Cartons petits formats divers',
      zone: 'fond',
      subzone: 'Palets Cartons STREFF (15+)',
      category: 'streff',
      stock: 8,
      capacity: 20,
      unit: 'Cartons',
      color: '#d29922',
      note: 'Embalajes medianos'
    },
    {
      sku: 'ARC-DETRUIRE',
      name: 'Sacs confidentiels "À détruire"',
      zone: 'fond',
      subzone: 'Sacs à Détruire',
      category: 'streff',
      stock: 2,
      capacity: 6,
      unit: 'Sacs',
      color: '#f85149',
      note: 'Documentación para triturar -6/-7'
    },

    // ------------------------------------------------------------------------
    // ZONA DESCANSO, CAFÉ & VRAC
    // ------------------------------------------------------------------------
    {
      sku: 'VRC-MANTEAUX',
      name: 'Portemanteaux sur pied',
      zone: 'vrac',
      subzone: 'Portemanteaux & Bacs',
      category: 'vrac',
      stock: 2,
      capacity: 4,
      unit: 'Unités',
      color: '#bc8cff',
      note: 'Percheros vestuario'
    },
    {
      sku: 'VRC-PLANS',
      name: 'Chevalets porte-plans architecte',
      zone: 'vrac',
      subzone: 'Chevalets Porte-Plans',
      category: 'vrac',
      stock: 3,
      capacity: 6,
      unit: 'Chevalets',
      color: '#d2a8ff',
      note: 'Planos de disposition del local'
    }
  ];

  // Puntos de Interés Cotidianos (POI) donde los nomitos se mueven en su vida humana
  var POIS = {
    coffeeMachine: { x: 570, y: 645, name: 'Máquina de Café', icon: '☕' },
    smokingCorner: { x: 840, y: 620, name: 'Rincón de Fumar', icon: '🚬' },
    gateInLookout: { x: 70, y: 220, name: 'Asomarse a la Entrada', icon: '👀' },
    gateOutLookout: { x: 880, y: 510, name: 'Asomarse a la Salida', icon: '👀' },
    bureauFaustino: { x: 130, y: 200, name: 'Buró Faustino (Teléfono)', icon: '☎' },
    bureauGaspar: { x: 805, y: 520, name: 'Buró Gaspar', icon: '📋' },
    // Estantes
    shelfOutillage: { x: 195, y: 280, name: 'Estante Herramientas' },
    shelfPlomberie: { x: 195, y: 390, name: 'Estante Plomería/Texaa' },
    shelfElectrique: { x: 195, y: 610, name: 'Estante Eléctricos' },
    shelfMobilier: { x: 720, y: 220, name: 'Estante Mobiliario' },
    shelfStreff: { x: 370, y: 90, name: 'Palets Streff' },
    couloirNord: { x: 470, y: 190, name: 'Pasillo Norte' },
    couloirCentre: { x: 470, y: 360, name: 'Pasillo Centro' },
    couloirSud: { x: 470, y: 530, name: 'Pasillo Sur' }
  };

  // Cuadrilla de nomitos con personalidades, velocidades digeribles y roles
  var GNOME_ROSTER = [
    {
      id: 'gnome-faustino',
      name: 'Faustino',
      role: 'bureau-in',
      hatColor: '#e55d23', // Naranja
      beardColor: '#f7efe4',
      isClerk: true,
      clerkTool: 'phone', // Con teléfono de escritorio
      basePos: [130, 200],
      title: 'Almacenero Recepción'
    },
    {
      id: 'gnome-gaspar',
      name: 'Gaspar',
      role: 'bureau-out',
      hatColor: '#007b70', // Teal
      beardColor: '#e8ded0',
      isClerk: true,
      clerkTool: 'stamp',
      basePos: [805, 520],
      title: 'Almacenero Expedición'
    },
    {
      id: 'gnome-tito',
      name: 'Tito',
      role: 'sweeper',
      hatColor: '#58a6ff', // Azul
      beardColor: '#ede2d3',
      isClerk: false,
      tool: 'broom',
      basePos: [470, 360],
      speed: 0.38, // Velocidad humana pausada
      title: 'Mantenimiento y Charlas'
    },
    {
      id: 'gnome-bruno',
      name: 'Bruno',
      role: 'cart_pusher',
      hatColor: '#2ea043', // Verde
      beardColor: '#d6c6b2',
      isClerk: false,
      tool: 'hand_truck',
      basePos: [470, 480],
      speed: 0.35,
      title: 'Operador Transpaleta'
    },
    {
      id: 'gnome-pepe',
      name: 'Pepe',
      role: 'carrier',
      hatColor: '#e55d23', // Rojo/naranja
      beardColor: '#ffffff',
      isClerk: false,
      tool: 'box',
      basePos: [310, 360],
      speed: 0.42,
      title: 'Porteador'
    },
    {
      id: 'gnome-nico',
      name: 'Nico',
      role: 'carrier',
      hatColor: '#f4b942', // Amarillo
      beardColor: '#ffffff',
      isClerk: false,
      tool: 'box',
      basePos: [630, 360],
      speed: 0.40,
      title: 'Porteador & Café'
    },
    {
      id: 'gnome-blas',
      name: 'Blas',
      role: 'walker',
      hatColor: '#bc8cff', // Violeta
      beardColor: '#f4ece2',
      isClerk: false,
      tool: 'clipboard',
      basePos: [470, 240],
      speed: 0.36,
      title: 'Inspector & Cigarro'
    }
  ];

  return {
    ZONES: ZONES,
    INITIAL_ITEMS: INITIAL_ITEMS,
    POIS: POIS,
    GNOME_ROSTER: GNOME_ROSTER,
    CONGESTION_THRESHOLD: 0.80,
    HUMAN_WALK_SPEED: 0.38 // Velocidad calmada digerible para la visión humana
  };
})();
