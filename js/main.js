/**
 * EL ALMACÉN DE NOMITOS - js/main.js
 * Orquestador principal de la aplicación.
 * Sincroniza la Pantalla 1 (Datos / Inventario) con la Pantalla 2 (Almacén Activo).
 * Licencia: MIT
 */

(function(Data, Engine, Agents, Warehouse, UI) {
  'use strict';

  function updateClock() {
    var clockEl = document.getElementById('clock');
    if (!clockEl) return;
    var now = new Date();
    clockEl.textContent = 'LOCAL -5 STOCKAGE · ' + now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', function(e) {
      // Ignorar si el usuario está escribiendo en un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === 'e' || e.key === 'E') {
        var btnIn = document.getElementById('btn-in');
        if (btnIn && !btnIn.disabled) btnIn.click();
      } else if (e.key === 's' || e.key === 'S') {
        var btnOut = document.getElementById('btn-out');
        if (btnOut && !btnOut.disabled) btnOut.click();
      } else if (e.key === 'r' || e.key === 'R') {
        var btnRandom = document.getElementById('btn-random');
        if (btnRandom && !btnRandom.disabled) btnRandom.click();
      }
    });
  }

  function start() {
    // 1. Inicializar el motor espacial en el SVG
    Warehouse.init('#warehouse');

    // 2. Inicializar la interfaz de datos y controles
    UI.init();

    // 3. Reloj en tiempo real
    updateClock();
    setInterval(updateClock, 1000);

    // 4. Atajos de teclado
    setupKeyboardShortcuts();

    console.log('📦 El Almacén de Nomito v1 inicializado correctamente.');
  }

  // Arrancar en cuanto el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(
  window.NOMITOS_DATA,
  window.NOMITOS_ENGINE,
  window.NOMITOS_AGENTS,
  window.NOMITOS_WAREHOUSE,
  window.NOMITOS_UI
);
