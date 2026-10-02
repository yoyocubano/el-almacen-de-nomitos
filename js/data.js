/**
 * EL ALMACÉN DE NOMITOS - js/data.js
 * Catálogo del inventario real y plano del local:
 * "PLAN DE DISPOSITION : STOCKAGE & ÉLECTRIQUE" (Local -5 Blue Bank)
 * Licencia: MIT
 */

window.NOMITOS_DATA = (function() {
  'use strict';

  // Zonas del plano esquemático real del local -5
  var ZONES = {
    gauche: {
      id: 'gauche',
      name: 'Côté Gauche : Mural & Électrique',
      badge: 'RAYONNAGE & ACOUSTIQUE',
      color: '#2ea043',
      subzones: ['Rayonnage Vert', 'Panneaux Acoustiques TEXAA', 'Zone Étroite (Sous bulle)', 'Local Électrique'],
      capacity: 38
    },
    droite: {
      id: 'droite',
      name: 'Côté Droit : Mobilier & Informatique',
      badge: 'SIT-STAND & POSTES ERGO',
      color: '#58a6ff',
      subzones: ['Bureaux Sit-Stand', 'Sièges Bureau Ergo', 'Caissons & Bucks', 'Armoire Métallique & Racks Info'],
      capacity: 30
    },
    fond: {
      id: 'fond',
      name: 'Zone Fond : Expédition & Archives',
      badge: 'STREFF & ARCHIVES -6/-7',
      color: '#e3b341',
      subzones: ['Zone Expédition Cartons STREFF', 'Fond Archive (-6/-7)', 'Sacs Confidentiels'],
      capacity: 45
    },
    vrac: {
      id: 'vrac',
      name: 'Vrac & Équipements Divers',
      badge: 'ACCESSOIRES BUREAU',
      color: '#bc8cff',
      subzones: ['Portemanteaux', 'Poubelles Noires', 'Supports Porte-Plans'],
      capacity: 15
    }
  };

  // Artículos del inventario real organizados según el plano de disposition
  var INITIAL_ITEMS = [
    // ------------------------------------------------------------------------
    // CÔTÉ GAUCHE : MURAL, ACOUSTIQUE & ÉLECTRIQUE
    // ------------------------------------------------------------------------
    {
      sku: 'MUR-VERT',
      name: 'Rayonnage Industriel Vert',
      zone: 'gauche',
      subzone: 'Rayonnage Vert',
      stock: 1,
      capacity: 2,
      unit: 'Unité',
      color: '#2ea043',
      itemType: 'rack_metal',
      note: 'Rayonnage vert pour matériel divers'
    },
    {
      sku: 'MUR-TEXAA',
      name: 'Panneaux Acoustiques TEXAA',
      zone: 'gauche',
      subzone: 'Panneaux Acoustiques TEXAA',
      stock: 12,
      capacity: 20,
      unit: 'Panneaux',
      color: '#ff7b72',
      itemType: 'texaa_panel',
      note: 'Panneaux muraux acoustiques rouge brique'
    },
    {
      sku: 'MUR-BULLE',
      name: 'Plateaux sous bulle (Zone Étroite)',
      zone: 'gauche',
      subzone: 'Zone Étroite (Sous bulle)',
      stock: 8,
      capacity: 15,
      unit: 'Plateaux',
      color: '#3fb950',
      itemType: 'table_top',
      note: 'Plateaux de table sous film à bulles'
    },
    {
      sku: 'ELEC-CABLE',
      name: 'Local Électrique : Câbles & Bobines',
      zone: 'gauche',
      subzone: 'Local Électrique',
      stock: 3,
      capacity: 6,
      unit: 'Bobines',
      color: '#d29922',
      itemType: 'coils',
      note: 'Bobines de câblage et outillage électrique'
    },
    {
      sku: 'ELEC-RAD',
      name: "Radiateur électrique d'appoint",
      zone: 'gauche',
      subzone: 'Local Électrique',
      stock: 1,
      capacity: 3,
      unit: 'Unité',
      color: '#e55d23',
      itemType: 'radiator',
      note: 'Chauffage mobile de secours'
    },

    // ------------------------------------------------------------------------
    // CÔTÉ DROIT : MOBILIER, SIT-STAND & INFORMATIQUE
    // ------------------------------------------------------------------------
    {
      sku: 'MOB-SITSTAND',
      name: 'Structures Sit-Stand (Moteurs)',
      zone: 'droite',
      subzone: 'Bureaux Sit-Stand',
      stock: 2,
      capacity: 4,
      unit: 'Bureaux',
      color: '#79c0ff',
      itemType: 'sit_stand',
      note: 'Structures métal réglables en hauteur motorisées'
    },
    {
      sku: 'MOB-SIEGES',
      name: 'Sièges de bureau ergonomiques',
      zone: 'droite',
      subzone: 'Sièges Bureau Ergo',
      stock: 5,
      capacity: 8,
      unit: 'Sièges',
      color: '#58a6ff',
      itemType: 'ergo_chair',
      note: '5 sièges bureau à roulettes et accoudoirs'
    },
    {
      sku: 'MOB-BUCKS',
      name: 'Caissons & Bucks (Bois/Métal)',
      zone: 'droite',
      subzone: 'Caissons & Bucks',
      stock: 4,
      capacity: 8,
      unit: 'Caissons',
      color: '#a5d6ff',
      itemType: 'bucks',
      note: 'Stockage bas sous bureau'
    },
    {
      sku: 'MOB-ARMOIRE',
      name: 'Armoire Métallique + Racks Info',
      zone: 'droite',
      subzone: 'Armoire Métallique & Racks Info',
      stock: 1,
      capacity: 2,
      unit: 'Armoire',
      color: '#8b949e',
      itemType: 'metal_cabinet',
      note: 'Armoire verrouillée et matériel serveur'
    },
    {
      sku: 'MOB-TABOURETS',
      name: 'Tabourets Hauts / Techniques',
      zone: 'droite',
      subzone: 'Sièges Bureau Ergo',
      stock: 3,
      capacity: 6,
      unit: 'Unités',
      color: '#388bfd',
      itemType: 'stool',
      note: 'Assises hautes atelier'
    },

    // ------------------------------------------------------------------------
    // ZONE FOND : EXPÉDITION STREFF & ARCHIVES
    // ------------------------------------------------------------------------
    {
      sku: 'STR-MOVING',
      name: 'Cartons STREFF (World Wide Moving)',
      zone: 'fond',
      subzone: 'Zone Expédition Cartons STREFF',
      stock: 15,
      capacity: 25,
      unit: 'Cartons',
      color: '#e3b341',
      itemType: 'streff_box',
      note: '15+ grands cartons Streff renforcés'
    },
    {
      sku: 'STR-DIVERS',
      name: 'Cartons divers (Petits formats)',
      zone: 'fond',
      subzone: 'Zone Expédition Cartons STREFF',
      stock: 8,
      capacity: 20,
      unit: 'Cartons',
      color: '#d29922',
      itemType: 'small_box',
      note: 'Fournitures et consommables'
    },
    {
      sku: 'ARC-DETRUIRE',
      name: 'Sacs "À détruire" (Confidentiel)',
      zone: 'fond',
      subzone: 'Fond Archive (-6/-7)',
      stock: 2,
      capacity: 6,
      unit: 'Sacs',
      color: '#f85149',
      itemType: 'destroy_bag',
      note: 'Archives confidentielles pour broyage'
    },

    // ------------------------------------------------------------------------
    // VRAC & ACCESSOIRES
    // ------------------------------------------------------------------------
    {
      sku: 'VRC-MANTEAUX',
      name: 'Portemanteaux sur pied',
      zone: 'vrac',
      subzone: 'Portemanteaux',
      stock: 2,
      capacity: 4,
      unit: 'Unités',
      color: '#bc8cff',
      itemType: 'coat_rack',
      note: 'Équipement vestiaire'
    },
    {
      sku: 'VRC-POUBELLES',
      name: 'Poubelles bureau (Noires)',
      zone: 'vrac',
      subzone: 'Poubelles Noires',
      stock: 2,
      capacity: 6,
      unit: 'Bacs',
      color: '#6e7681',
      itemType: 'bin',
      note: 'Corbeilles à papier'
    },
    {
      sku: 'VRC-PLANS',
      name: 'Supports porte-plans d’architecte',
      zone: 'vrac',
      subzone: 'Supports Porte-Plans',
      stock: 3,
      capacity: 6,
      unit: 'Supports',
      color: '#d2a8ff',
      itemType: 'plan_rack',
      note: 'Chevalets de plans et schémas'
    }
  ];

  // Cuadrilla viva de nomitos obreros con roles y personalidades activas
  var GNOME_ROSTER = [
    {
      id: 'gnome-faustino',
      name: 'Faustino',
      role: 'bureau-in',
      hatColor: '#e55d23', // Naranja
      beardColor: '#f7efe4',
      isClerk: true,
      clerkTool: 'pen',
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
      name: 'Tito el Barrendero',
      role: 'sweeper',
      hatColor: '#58a6ff', // Azul
      beardColor: '#ede2d3',
      isClerk: false,
      tool: 'broom',
      basePos: [470, 360],
      speed: 0.75,
      title: 'Mantenimiento Pasillo Central'
    },
    {
      id: 'gnome-bruno',
      name: 'Bruno el Fuerte',
      role: 'cart_pusher',
      hatColor: '#2ea043', // Verde
      beardColor: '#d6c6b2',
      isClerk: false,
      tool: 'hand_truck',
      basePos: [470, 480],
      speed: 0.85,
      title: 'Operador Transpaleta'
    },
    {
      id: 'gnome-pepe',
      name: 'Pepe el Rápido',
      role: 'carrier',
      hatColor: '#e55d23',
      beardColor: '#ffffff',
      isClerk: false,
      tool: 'box',
      basePos: [320, 360],
      speed: 1.15,
      title: 'Porteador Rápido'
    },
    {
      id: 'gnome-nico',
      name: 'Nico Apilador',
      role: 'carrier',
      hatColor: '#f4b942', // Amarillo
      beardColor: '#ffffff',
      isClerk: false,
      tool: 'box',
      basePos: [620, 360],
      speed: 1.0,
      title: 'Porteador y Apilador'
    },
    {
      id: 'gnome-blas',
      name: 'Blas el Inspector',
      role: 'walker',
      hatColor: '#bc8cff', // Violeta
      beardColor: '#f4ece2',
      isClerk: false,
      tool: 'clipboard',
      basePos: [470, 240],
      speed: 0.8,
      title: 'Inspector de Pasillos'
    }
  ];

  return {
    ZONES: ZONES,
    INITIAL_ITEMS: INITIAL_ITEMS,
    GNOME_ROSTER: GNOME_ROSTER,
    CONGESTION_THRESHOLD: 0.80, // Si pasa del 80% se activa alarma pasillo
    SECURITY_NOTE: 'PRIORITÉ : DÉGAGER LE COULOIR CENTRAL (ZONE CRITIQUE)'
  };
})();
