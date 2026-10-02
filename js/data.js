/**
 * EL ALMACÉN DE NOMITOS - js/data.js
 * Catálogo del inventario real (Local de Stockage Blue Bank -5) y configuración inicial.
 * Licencia: MIT
 */

window.NOMITOS_DATA = (function() {
  'use strict';

  // Zonas físicas del almacén según el inventario real
  var ZONES = {
    mural: {
      id: 'mural',
      name: 'Côté Gauche : Stockage Mural',
      badge: 'ESTRUCTURA METÁLICA',
      color: '#2ea043',
      rackTarget: [230, 240], // Coordenada base del anaquel en SVG
      capacity: 35
    },
    mobilier: {
      id: 'mobilier',
      name: 'Côté Droit : Mobilier Bureau',
      badge: 'POSTES DE TRAVAIL',
      color: '#58a6ff',
      rackTarget: [630, 240],
      capacity: 32
    },
    fond: {
      id: 'fond',
      name: 'Zone Fond : Logistique',
      badge: 'MARQUE STREFF',
      color: '#e3b341',
      rackTarget: [430, 160],
      capacity: 45
    },
    vrac: {
      id: 'vrac',
      name: 'Vrac & Accessoires',
      badge: 'ÉQUIPEMENT DIVERS',
      color: '#bc8cff',
      rackTarget: [430, 480],
      capacity: 20
    }
  };

  // Artículos reales del local de stockage con stocks iniciales y capacidades
  var INITIAL_ITEMS = [
    // Zona Côté Gauche : Stockage Mural
    {
      sku: 'MUR-01',
      name: 'Rayonnage Industriel (Vert)',
      zone: 'mural',
      stock: 1,
      capacity: 2,
      unit: 'Unité',
      color: '#2ea043',
      note: 'Estructura metálica base'
    },
    {
      sku: 'MUR-02',
      name: 'Panneaux Acoustiques TEXAA',
      zone: 'mural',
      stock: 12,
      capacity: 20,
      unit: 'Lot/Panneaux',
      color: '#ff7b72',
      note: 'Acústica de oficina'
    },
    {
      sku: 'MUR-03',
      name: 'Plateaux de Table (Sous bulle)',
      zone: 'mural',
      stock: 8,
      capacity: 15,
      unit: 'Unités',
      color: '#3fb950',
      note: 'Superficies embaladas'
    },
    {
      sku: 'MUR-04',
      name: "Radiateur électrique d'appoint",
      zone: 'mural',
      stock: 1,
      capacity: 3,
      unit: 'Unité',
      color: '#d29922',
      note: 'Calefacción auxiliar'
    },

    // Zona Côté Droit : Mobilier Bureau
    {
      sku: 'MOB-01',
      name: 'Sièges de Bureau (Ergo)',
      zone: 'mobilier',
      stock: 5,
      capacity: 10,
      unit: 'Unités',
      color: '#58a6ff',
      note: 'Sillas ergonómicas regulables'
    },
    {
      sku: 'MOB-02',
      name: 'Structures Sit-Stand (Moteurs)',
      zone: 'mobilier',
      stock: 2,
      capacity: 6,
      unit: 'Structures',
      color: '#79c0ff',
      note: 'Mesas elevables con motor'
    },
    {
      sku: 'MOB-03',
      name: 'Tabourets Hauts / Techniques',
      zone: 'mobilier',
      stock: 3,
      capacity: 6,
      unit: 'Unités',
      color: '#388bfd',
      note: 'Taburetes de laboratorio/diseño'
    },
    {
      sku: 'MOB-04',
      name: 'Caissons (Bucks) Bois/Métal',
      zone: 'mobilier',
      stock: 4,
      capacity: 8,
      unit: 'Caissons',
      color: '#a5d6ff',
      note: 'Cajoneras bajo mesa'
    },
    {
      sku: 'MOB-05',
      name: 'Armoire Métallique (Gris/Beige)',
      zone: 'mobilier',
      stock: 1,
      capacity: 2,
      unit: 'Armoire',
      color: '#8b949e',
      note: 'Archivo con cerradura'
    },

    // Zona Fond : Logistique Streff
    {
      sku: 'LOG-01',
      name: 'Cartons Streff (World Wide Moving)',
      zone: 'fond',
      stock: 5,
      capacity: 15,
      unit: 'Cartons',
      color: '#e3b341',
      note: 'Cajas reforzadas mudanza'
    },
    {
      sku: 'LOG-02',
      name: 'Cartons divers (Petits formats)',
      zone: 'fond',
      stock: 12,
      capacity: 25,
      unit: 'Cartons',
      color: '#d29922',
      note: 'Paquetería compacta'
    },
    {
      sku: 'LOG-03',
      name: 'Sacs "À détruire"',
      zone: 'fond',
      stock: 2,
      capacity: 5,
      unit: 'Sacs',
      color: '#f85149',
      note: 'Confidencial para triturar'
    },

    // Zona Vrac & Accessoires
    {
      sku: 'VRC-01',
      name: 'Portemanteaux sur pied',
      zone: 'vrac',
      stock: 2,
      capacity: 4,
      unit: 'Unités',
      color: '#bc8cff',
      note: 'Percheros de pie'
    },
    {
      sku: 'VRC-02',
      name: 'Poubelles bureau (Noires)',
      zone: 'vrac',
      stock: 2,
      capacity: 6,
      unit: 'Bacs',
      color: '#6e7681',
      note: 'Papeleras de despacho'
    },
    {
      sku: 'VRC-03',
      name: 'Supports porte-plans',
      zone: 'vrac',
      stock: 3,
      capacity: 6,
      unit: 'Supports',
      color: '#d2a8ff',
      note: 'Tubos y caballetes planos'
    }
  ];

  // Cuadrilla inicial de nomitos obreros con rostro y rasgos individuales
  var GNOME_ROSTER = [
    {
      id: 'gnome-faustino',
      name: 'Faustino Almacenero',
      role: 'bureau-in',
      hatColor: '#e55d23', // Naranja seguridad
      beardColor: '#f7efe4',
      eyes: 'focused',
      expression: 'attentive',
      pos: [175, 145], // Buró entrada
      isClerk: true,
      title: 'Jefe de Entrada'
    },
    {
      id: 'gnome-gaspar',
      name: 'Gaspar Almacenero',
      role: 'bureau-out',
      hatColor: '#007b70', // Teal logístico
      beardColor: '#e8ded0',
      eyes: 'focused',
      expression: 'attentive',
      pos: [685, 475], // Buró salida
      isClerk: true,
      title: 'Jefe de Expedición'
    },
    {
      id: 'gnome-pepe',
      name: 'Pepe el Rápido',
      role: 'carrier',
      hatColor: '#e55d23',
      beardColor: '#ffffff',
      eyes: 'happy',
      expression: 'smile',
      pos: [215, 340],
      isClerk: false,
      speed: 1.15
    },
    {
      id: 'gnome-bruno',
      name: 'Bruno el Fuerte',
      role: 'carrier',
      hatColor: '#007b70',
      beardColor: '#d6c6b2',
      eyes: 'determined',
      expression: 'strong',
      pos: [430, 260],
      isClerk: false,
      speed: 0.95
    },
    {
      id: 'gnome-nico',
      name: 'Nico Apilador',
      role: 'carrier',
      hatColor: '#f4b942',
      beardColor: '#ffffff',
      eyes: 'happy',
      expression: 'curious',
      pos: [580, 340],
      isClerk: false,
      speed: 1.05
    },
    {
      id: 'gnome-tito',
      name: 'Tito el Cuidadoso',
      role: 'carrier',
      hatColor: '#bc8cff',
      beardColor: '#ede2d3',
      eyes: 'wide',
      expression: 'calm',
      pos: [430, 390],
      isClerk: false,
      speed: 1.0
    }
  ];

  return {
    ZONES: ZONES,
    INITIAL_ITEMS: INITIAL_ITEMS,
    GNOME_ROSTER: GNOME_ROSTER,
    CONGESTION_THRESHOLD: 0.82 // Al 82% se activa la advertencia de pasillo
  };
})();
