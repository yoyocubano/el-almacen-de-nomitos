# El Almacén de Nomito

Videojuego de gestión de almacén con obreros nomitos. Proyecto open source (MIT).

> **Filosofía Vanilla Web:** Sin frameworks, sin bundler, sin `package.json`, sin paso de compilación (`npm run build`). Abre `index.html` en el navegador y funciona al instante. Listo para GitHub Pages.

---

## 🎮 Versión 2.0 — Gemelo Vivo & Plano de Disposition

Esta versión incorpora el plano esquemático real del local de stockage de Blue Bank (**"PLAN DE DISPOSITION : STOCKAGE & ÉLECTRIQUE"**, Local -5) y vida continua para los nomitos:

### 1. Vida Permanente (El almacén nunca se detiene)
Aunque no se registre ningún movimiento en la hoja de datos, los nomitos continúan su labor:
- **Tito el Barrendero:** Recorre continuamente el pasillo central con su escoba manteniéndolo limpio y despejado.
- **Bruno el Fuerte:** Empuja la transpaleta manual cargada con cajas Streff entre pasillos.
- **Blas el Inspector:** Camina con su portapapeles revisando estantes e inspeccionando stock con iconos de diálogo.
- **Faustino (Recepción) y Gaspar (Expedición):** En sus respectivos burós sellando y validando albaranes con globos de diálogo interactivos.
- **Pepe y Nico:** Patrullan y descansan en guardia, listos para correr al muelle cuando entra o sale un pedido.

### 2. Layout del Plano Real (Nave Cerrada con Muros y Pasillo Central)
El almacén es la nave arquitectónica del plano, con sus muros perimetrales delimitados y las zonas organizadas en 3 filas y un pasillo central:
- **COULOIR CENTRAL (Zona Crítica):** Marcado en el suelo con franjas de seguridad amarillas y negras y la consigna oficial: *"ZONE CRITIQUE : DÉGAGEMENT OBLIGATOIRE"*.
- **Fila Izquierda (Mural, Acoustique & Électrique):**
  - *Rayonnage Industriel Vert* (matériel divers).
  - *Panneaux Acoustiques TEXAA* (paneles rojizos acústicos alineados).
  - *Zone Étroite* (plateaux de table embalados sous bulle).
  - *Local Électrique* (bobinas de cableado, radiador de secours y cuadro).
- **Fila Derecha (Mobilier Bureau & Informatique):**
  - *Bureaux Sit-Stand* (2 estructuras metálicas con motor y patas telescópicas).
  - *Sièges de bureau ergonomiques* (5 sillas con ruedas y pistón de gas).
  - *Caissons & Bucks* (cajoneras bajas de madera/metal).
  - *Armoire Métallique & Racks Info* (armario con cerradura y servidor).
- **Zona Fondo (Expédition & Archives):**
  - *Zone Expédition Cartons STREFF* (15+ cajas Streff Worldwide Moving doradas sobre palets).
  - *Fond Archive -6/-7* (cajas y sacos para triturar confidencialmente).
- **Vrac & Accessoires:**
  - Portemanteaux, poubelles noires de bureau y supports porte-plans.

---

## 🚀 Cómo ejecutarlo

Simplemente abre `index.html` con doble clic en tu navegador preferido o usa cualquier servidor estático:

```bash
# Con Python
python3 -m http.server 8000

# O directamente abriendo el archivo en Chrome / Firefox / Safari:
open index.html
```

---

## 📁 Estructura del Proyecto

```
el-almacen-de-nomitos/
├── index.html                           # Shell principal (doble pantalla sincronizada)
├── css/
│   └── styles.css                       # Diseño split-screen, nave industrial, dark/light
├── js/
│   ├── data.js                          # Inventario real del plano (16 artículos) y cuadrilla
│   ├── engine.js                        # Motor contable desacoplado (StockLedger y diffs)
│   ├── nomitos.js                       # Render vectorial con escoba, transpaleta y globos
│   ├── warehouse.js                     # Plano arquitectónico, couloir central y loop 60fps
│   ├── ui.js                            # Spreadsheet interactivo con volúmenes reales
│   └── main.js                          # Orquestador, atajos de teclado y reloj
├── inventario-blue-bank-local-5.html    # Inventario logístico real de referencia
├── inspeccion-tecnica-electrica.html    # Informe técnico de inspección de referencia
├── docs/
│   └── ARQUITECTURA_Y_ROADMAP.md        # Especificación arquitectónica y roadmap
├── LICENSE                              # MIT
└── README.md
```

---

## ⌨️ Atajos de teclado

- **`E`**: Registrar Entrada rápida de mercancía (Muelle A → Buró Faustino → Anaquel).
- **`S`**: Registrar Salida rápida de mercancía (Anaquel → Buró Gaspar → Muelle B).
- **`R`**: Simular movimiento aleatorio (demostración activa).

---

## 📄 Licencia

MIT — Código abierto para todo el mundo.
