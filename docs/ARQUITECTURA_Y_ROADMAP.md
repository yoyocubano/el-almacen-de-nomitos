# Arquitectura del Sistema: El Almacén de Nomito
**Versión:** 2.0 (Gemelo Vivo & Plano de Disposition Local -5)  
**Licencia:** MIT  
**Filosofía:** Vanilla Web pura — *Zero build step, Zero dependencies, Open & Run*

---

## 1. Principios Rectores y Decisiones del Dueño (Yoyocubano)

1. **Stack Vanilla JS Puro (Filosofía Market Mayhem / Fishverse):**
   - Sin Vite, sin TypeScript, sin Node build, sin `package.json`.
   - Se abre `index.html` directamente con doble clic (`file://`) o en cualquier servidor estático local, y se despliega tal cual en GitHub Pages.
2. **Estilo Visual Vectorial Ilustrado Contemporáneo:**
   - Conserva y eleva el estilo visual vectorial con sombras y caritas expresivas (ojos, cejas móviles, barba suave, gorro cónico).
   - Accesorios de trabajo: escoba para el barrendero, transpaleta/carretilla manual de carga, portapapeles de inspección, cajas con cinta de embalaje, lápiz y sello de buró.
3. **Plano Real del Local -5 (Plan de Disposition : Stockage & Électrique):**
   - El almacén es la nave arquitectónica cerrada del plano real (muros perimetrales, puertas de muelles integradas en los muros).
   - Tres filas principales con el **COULOIR CENTRAL (zona crítica de paso despejado)** señalizado con líneas amarillas de seguridad.
   - Presencia destacada de los volúmenes reales:
     - 5 Sièges ergo a roulettes.
     - 2 Structures Sit-Stand con motor.
     - 15+ Cartons Streff World Wide Moving sobre palets.
     - Panneaux acoustiques Texaa de color rojizo.
     - Zone étroite sous bulle y Local Électrique (câbles & radiateur).
4. **Vida Permanente en el Almacén:**
   - El almacén nunca se queda estático: Tito barre el pasillo central, Bruno recorre la nave con la transpaleta, Blas inspecciona con el portapapeles, Faustino y Gaspar sellan y revisan albaranes, y los porteadores Pepe y Nico acuden de inmediato ante cada orden de entrada o salida.

---

## 2. Mapa Espacial del Edificio (Plano Local -5)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              BLUE BANK · LOCAL -5 STOCKAGE & ÉLECTRIQUE                     │
│                                                                             │
│  [PUERTA ENTRADA]              ZONE EXPÉDITION STREFF      FOND ARCHIVE     │
│   (Muelle A / Camión)             (15+ Cartons)             (Sacs -6/-7)    │
│            │                                                                │
│      [BURÓ FAUSTINO]       ───────────────────────────     BUREAUX SIT-STAND│
│                            │                         │     (2 con motor)    │
│     RAYONNAGE VERT         │                         │                      │
│    (Matériel divers)       │     COULOIR CENTRAL     │     SIÈGES ERGO      │
│                            │     (PASILLO CRÍTICO)   │     (5 de oficina)   │
│     PANNEAUX TEXAA         │                         │                      │
│     (Acoustique rouge)     │  ▲ DÉGAGEMENT CONTINUO ▲│     CAISSONS & BUCKS │
│                            │                         │     (Stockage bas)   │
│     ZONE ÉTROITE           │                         │                      │
│     (Sous bulle)           │    Tito barriendo       │     ARMOIRE MÉTAL    │
│                            │    Bruno transpaleta    │     & RACKS INFO     │
│     LOCAL ÉLECTRIQUE       │                         │                      │
│     (Câbles & Radiateur)   │                         │     [BURÓ GASPAR]    │
│                            ───────────────────────────           │          │
│                                   VRAC & ACCESSOIRES     [PUERTA SALIDA]    │
│                                   (Porte-plans, bacs)    (Muelle B / Furgón)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de Archivos

```
el-almacen-de-nomitos/
├── index.html                           # Entrada principal: doble pantalla funcional
├── css/
│   └── styles.css                       # Variables de diseño, split-screen, nave y couloir
├── js/
│   ├── data.js                          # 16 artículos del plano de Blue Bank y cuadrilla
│   ├── engine.js                        # Lógica de stock, diffs (+/-) y seguridad de pasillo
│   ├── nomitos.js                       # Vectorial: escoba, transpaleta, clipboard y globos
│   ├── warehouse.js                     # Nave industrial, vida permanente y rutas
│   ├── ui.js                            # Spreadsheet interactivo con volúmenes reales
│   └── main.js                          # Arranque, loop y atajos de teclado
├── inventario-blue-bank-local-5.html    # Inventario logístico real de referencia
├── inspeccion-tecnica-electrica.html    # Informe técnico de inspección de referencia
├── docs/
│   └── ARQUITECTURA_Y_ROADMAP.md        # Esta especificación
├── LICENSE                              # MIT
└── README.md                            # Resumen y guía
```

---

## 4. Estado de Implementación

- [x] **v1.0**: Migración modular Vanilla JS, doble pantalla sincronizada y cálculo en vivo de diferencias.
- [x] **v2.0**: Integración del plano esquemático del Local -5 (nave cerrada, couloir central crítico, 12 subzonas con objetos reales) + Vida permanente continua (barrendero, transpaleta, inspectores, burós).
- [ ] **v3.0 (Futuro / Módulo Empleador)**: Panel de finanzas, costes de transporte, salarios y fatiga de nomitos.
