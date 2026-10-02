# Arquitectura del Sistema: El Almacén de Nomito
**Versión:** 1.1 (Decisiones de Diseño de Yoyocubano & Roadmap v1)  
**Licencia:** MIT  
**Filosofía:** Vanilla Web pura — *Zero build step, Zero dependencies, Open & Run*

---

## 1. Principios Rectores y Decisiones del Dueño (Yoyocubano)

1. **Stack Vanilla JS Puro (Filosofía Market Mayhem / Fishverse):**
   - Sin Vite, sin TypeScript, sin Node build, sin `package.json`.
   - Se abre `index.html` directamente con doble clic (`file://`) o en cualquier servidor estático local, y se despliega tal cual en GitHub Pages.
   - Visual fresco, sencillo, rápido y pulido sin dependencias pesadas.
2. **Estilo Visual Vectorial Ilustrado Contemporáneo:**
   - Conserva y eleva el estilo visual de la maqueta v0: gorro cónico, barba suave, caritas expresivas con ojos y boca, líneas claras y sombras sutiles.
   - Cero pixel art retro.
3. **Enfoque de la Versión 1.0 — Gemelo Digital Activo:**
   - La v1 se enfoca 100% en la experiencia de **gemelo digital reactivo**:
     - Pantalla de datos (documento/tablero) registra entradas y salidas de stock con cálculo en tiempo real de diferencias por producto.
     - Pantalla del almacén traduce esas diferencias a actividad física simultánea: camiones en el muelle de entrada, almacenero de buró de entrada sellando, nomitos cargando cajas por los pasillos hacia los anaqueles por zona, almacenero de buró de salida validando pedidos y furgoneta en gate de salida.
   - **Mecánicas económicas y finanzas:** Salarios por hora de los nomitos, penalizaciones por demora en muelle, alquiler de naves, etc. se reservan para un módulo posterior de **"Vista Empleador" (v2)**, manteniéndolas fuera de la v1 para no complicar el bucle principal.

---

## 2. Referencias Abiertas de Inspiración

- **`fishverse` (Market Mayhem):** Referencia clave de arquitectura: HTML, CSS y JS modular sin compilador. Cero dependencias externas.
- **`project-scim`:** La logística como problema espacial encarnado: la pantalla de datos decide *qué*, el almacén es donde los nomitos lo ejecutan en tiempo y espacio físico.
- **`logix`:** Grid de almacén, pasillos libres y A* para navegación fluida.
- **`multi-agent-logistics`:** Desacoplamiento de eventos mediante bus de mensajes (`EventBus`).
- **`datacenter-tycoon-2d`:** Inspiración para el futuro módulo de finanzas/empleador (v2).

---

## 3. Arquitectura del Sistema v1

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     EL ALMACÉN DE NOMITOS - ARQUITECTURA v1                 │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
  │      PANTALLA 1: DATOS          │       │      PANTALLA 2: ALMACÉN        │
  │   (Documento / Inventario)      │       │     (Gemelo Espacial Activo)    │
  │ - Modelo Blue Bank (4 zonas)    │       │ - Gate Entrada + Camión         │
  │ - Registro de albaranes in/out  │       │ - Buró de Entrada (Almacenero)  │
  │ - Diferencias de stock (+ / -)  │       │ - Pasillos y Anaqueles en zonas │
  │ - Alertas de pasillo obstruido  │       │ - Buró de Salida (Almacenero)   │
  │ - Timeline de transacciones     │       │ - Gate Salida + Furgoneta       │
  │                                 │       │ - Nomitos activos con carita    │
  └────────────────▲────────────────┘       └────────────────▲────────────────┘
                   │                                         │
                   └───────────────────┬─────────────────────┘
                                       │ Eventos (EventBus)
                                       ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                               EVENT BUS                                   │
  │   - stock:inbound         - stock:outbound       - mission:created        │
  │   - gnome:assigned        - hazard:congested     - doc:reset              │
  └────────────────────────────────────▲──────────────────────────────────────┘
                                       │
  ┌────────────────────────────────────┴──────────────────────────────────────┐
  │                            CORE & SIMULACIÓN                              │
  │  1. js/data.js      Catálogo real (Blue Bank), capacidades y nomitos      │
  │  2. js/engine.js    StockLedger, cálculo de diferencias, cola de misiones │
  │  3. js/nomitos.js   Agentes con caritas, estados FSM, paso y carga        │
  │  4. js/warehouse.js Render vectorial, muelles, burós, estantes dinámicos  │
  │  5. js/ui.js        DataGrid reactivo, panel de control, albaranes        │
  │  6. js/main.js      Orquestador y loop principal                          │
  └───────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Estructura Limpia de Archivos (Sin Bundler)

```
el-almacen-de-nomitos/
├── index.html                           # Entrada principal: doble pantalla funcional
├── css/
│   └── styles.css                       # Variables de diseño, split-screen, dark/light
├── js/
│   ├── data.js                          # Inventario Blue Bank Local-5 y configuración
│   ├── engine.js                        # Lógica pura de inventario, diffs y misiones
│   ├── nomitos.js                       # Renderizado vectorial de nomitos con cara y FSM
│   ├── warehouse.js                     # Renderizado de muelles, burós, anaqueles y rutas
│   ├── ui.js                            # Pantalla de datos (tabla interactiva y albaranes)
│   └── main.js                          # Arranque e integración del EventBus
├── inventario-blue-bank-local-5.html    # Inventario logístico real de referencia
├── inspeccion-tecnica-electrica.html    # Informe técnico de inspección de referencia
├── docs/
│   └── ARQUITECTURA_Y_ROADMAP.md        # Este documento
├── LICENSE                              # MIT
└── README.md                            # Visión general
```

---

## 5. Roadmap de Implementación v1

### Sprint 1: Fundación Modular y Datos Reales (Completado en arranque)
- Desglosar la lógica de `index.html` en módulos limpios de JS nativo (`data.js`, `engine.js`, `nomitos.js`, `warehouse.js`, `ui.js`, `main.js`).
- Integrar las 4 zonas reales de `inventario-blue-bank-local-5.html`:
  - **Côté Gauche (Stockage Mural):** Rayonnage Industriel, Panneaux Acoustiques Texaa, Plateaux de table.
  - **Côté Droit (Mobilier Bureau):** Sièges Ergo, Structures Sit-Stand con motor, Caissons, Armoire métallique.
  - **Zone Fond (Logistique):** Cartons Streff, Cartons divers, Sacs à détruire.
  - **Vrac & Accessoires:** Portemanteaux, Poubelles bureau, Supports porte-plans.

### Sprint 2: Gemelo Activo Completo (v1)
- **Buró de Entrada:** El almacenero nomito de guardia recibe al camión en el Gate de entrada y valida el albarán antes de despachar a los porteadores.
- **Buró de Salida:** El almacenero de salida revisa la comanda y entrega en el Gate de salida a quien vino a buscarla.
- **Nomitos con Rostro y Personalidad:** Ojos con pestañeo, cejas que se fruncen al cargar cajas pesadas, barbas y gorros de colores diferenciados.
- **Doble Pantalla Sincronizada:** Cada entrada o salida en el documento actualiza la tabla con el reporte de diferencias (+ / -), el porcentaje de ocupación por zona y dispara a los nomitos en el almacén.
- **Alerta de Pasillo Central Obstruido:** Si la capacidad excede el 85%, se activa la alerta de seguridad física del local -5.

### Sprint 3: Pulido y GitHub Pages (v1 Release)
- Optimización de rendimiento a 60 fps en SVG interactivo.
- Sonidos opcionales generados por Web Audio API sintética (cero archivos pesados).
- Commit y push a `main` listo para disfrutar en GitHub Pages.
