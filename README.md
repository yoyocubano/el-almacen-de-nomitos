# El Almacén de Nomito

Videojuego de gestión de almacén con obreros nomitos. Proyecto open source (MIT).

> **Filosofía Vanilla Web:** Sin frameworks, sin bundler, sin `package.json`, sin paso de compilación (`npm run build`). Abre `index.html` en el navegador y funciona al instante. Listo para GitHub Pages.

---

## 🎮 La Doble Pantalla

1. **Pantalla de datos (Libro de existencias):** 
   - Un tablero/documento tipo hoja de cálculo donde se registran las entradas y salidas de mercancía.
   - Cada actualización reporta **diferencias exactas de stock (+ / −)** por producto.
   - Zonas reales basadas en el local de stockage Blue Bank (-5):
     - *Côté Gauche : Stockage Mural* (rayonnages industriales, paneles Texaa, tableros).
     - *Côté Droit : Mobilier Bureau* (mesas sit-stand con motor, sillas ergonómicas, cajoneras).
     - *Zone Fond : Logistique* (cajas Streff Worldwide Moving, paquetería).
     - *Vrac & Accessoires* (percheros, papeleras, portaplanos).
   - Detección de peligro: advertencia de seguridad si el pasillo central se congestiona.

2. **Pantalla del almacén (Gemelo espacial activo):**
   - **Puerto de entrada:** Gate de camiones con muelle A y **buró de entrada** donde el almacenero **Faustino** inspecciona y firma albaranes.
   - **Puerto de salida:** Gate de furgonetas con muelle B y **buró de salida** donde el almacenero **Gaspar** sella pedidos y valida expediciones.
   - **Pasillos y anaqueles:** Muestra visual de cajas físicas apiladas en tiempo real.
   - **Cuadrilla de nomitos obreros:** Gnomos con rostro expresivo (ojos, cejas móviles, barbas esponjosas y gorros cónicos), esfuerzo al cargar (`straining`), y transporte cinético por los pasillos.

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
│   └── styles.css                       # Diseño visual, split-screen y temas light/dark
├── js/
│   ├── data.js                          # Catálogo de artículos del Local -5 y cuadrilla
│   ├── engine.js                        # Motor contable desacoplado (StockLedger y misiones)
│   ├── nomitos.js                       # Renderizado vectorial de nomitos con cara y FSM
│   ├── warehouse.js                     # Render espacial SVG: muelles, burós, racks y rutas
│   ├── ui.js                            # Spreadsheet interactivo y formularios de albarán
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

- **`E`**: Registrar Entrada rápida de mercancía (Camión → Buró Entrada → Anaquel).
- **`S`**: Registrar Salida rápida de mercancía (Anaquel → Buró Salida → Muelle Salida).
- **`R`**: Simular movimiento aleatorio (demostración activa).

---

## 📚 Referencias Open Source

- [Fishverse / Market Mayhem](https://github.com/bennygx234-design/fishverse): Tycoon de navegador en HTML/CSS/JS plano sin dependencias ni build.
- [Project-SCIM](https://github.com/abhijitbetigeri/project-scim): Simulación de almacén encarnada (el stock como problema espacial).
- [LogiX](https://github.com/deasy-mandasari/logix): Simulación de almacén y rutas de reparto en HTML5.
- [Multi-Agent Logistics](https://github.com/beratmutlu/multi-agent-logistics): Arquitectura multi-agente con MessageBus.
- [Datacenter Tycoon 2D](https://github.com/ignaciochemes/datacenter-tycoon-2d): Tycoon 2D en navegador con vista en grid.
- [RMF Industrial](https://github.com/ros-industrial/rmf_industrial): Gestión de flotas a gran escala (referencia arquitectónica).

---

## 📄 Licencia

MIT — Código libre y abierto para todo el mundo.
