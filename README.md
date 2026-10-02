# El Almacén de Nomitos

Videojuego de gestión de almacén con obreros nomitos. Proyecto open source (MIT).

## La idea

Doble pantalla:

1. **Pantalla de datos** — un Excel / documento / tablero donde se registran las
   entradas y salidas de stock. Cada actualización reporta diferencias de
   cantidades por producto.
2. **Pantalla del almacén** — el almacén vivo: cuando entra mercancía, los
   nomitos van al puerto de entrada, recogen el producto del camión y lo
   organizan en los pasillos y anaqueles. Cuando sale mercancía, los nomitos
   la llevan a la puerta de salida y se la entregan a quien vino a buscarla.

El almacén tiene:

- **Puerto de entrada** con gate de camiones + **buró de entrada** (almacenero
  que registra la entrada).
- **Gate de salida** + **buró de salida** (almacenero que gestiona la entrega).
- **Pasillos y anaqueles** con trabajadores según la cantidad de mercancía.

## Estado

`index.html` — maqueta interactiva inicial (doble pantalla: registro de stock
+ almacén animado con nomitos). Punto de partida para desarrollar el juego.

## Referencias reales

- `inventario-blue-bank-local-5.html` — inventario logístico real de un local
  de stockage (modelo de datos por zonas: lado izquierdo / lado derecho /
  fondo, con cantidades y notas). Sirve como modelo de datos del juego.
- `inspeccion-tecnica-electrica.html` — informe técnico de inspección
  (estilo de reporte HTML de referencia).

## Referencias open source

- https://github.com/deasy-mandasari/logix — juego + simulación de almacén
  (HTML5 jugable, A*/Dijkstra/Q-learning). La referencia jugable más cercana.
- https://github.com/abhijitbetigeri/project-scim — simulación de almacén
  encarnada: el stock como problema espacial.
- https://github.com/beratmutlu/multi-agent-logistics — simulación logística
  multi-agente con replay en Pygame.
- https://github.com/ros-industrial/rmf_industrial — gestión de flotas a gran
  escala (referencia arquitectónica; demasiado pesado para bifurcar).

## Licencia

MIT — abierto para todo el mundo.
