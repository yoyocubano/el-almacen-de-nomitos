/**
 * EL ALMACÉN DE NOMITOS - js/ui.js
 * Interfaz de la Pantalla 1 (Datos / Documento de Inventario):
 * - Tabla interactiva tipo hoja de cálculo
 * - Formulario de registro de albaranes in/out
 * - Reporte de diferencias en tiempo real
 * - Bitácora de transacciones
 * Licencia: MIT
 */

window.NOMITOS_UI = (function(Data, Engine, Warehouse) {
  'use strict';

  var currentFilter = 'all';
  var isBusy = false;

  var dom = {
    totalUnits: null,
    occupancy: null,
    statusChip: null,
    gnomesCount: null,
    stockTableBody: null,
    productSelect: null,
    quantityInput: null,
    btnIn: null,
    btnOut: null,
    btnRandom: null,
    btnReset: null,
    eventList: null,
    toast: null,
    mobileButtons: null,
    zoneFilterPills: null
  };

  function init() {
    dom.totalUnits = document.getElementById('total-units');
    dom.occupancy = document.getElementById('occupancy');
    dom.statusChip = document.getElementById('status-chip');
    dom.gnomesCount = document.getElementById('workers-count');
    dom.stockTableBody = document.getElementById('stock-body');
    dom.productSelect = document.getElementById('product-select');
    dom.quantityInput = document.getElementById('quantity');
    dom.btnIn = document.getElementById('btn-in');
    dom.btnOut = document.getElementById('btn-out');
    dom.btnRandom = document.getElementById('btn-random');
    dom.btnReset = document.getElementById('reset-demo');
    dom.eventList = document.getElementById('event-list');
    dom.toast = document.getElementById('toast');
    dom.mobileButtons = document.querySelectorAll('.mobile-switch button');
    dom.zoneFilterPills = document.querySelectorAll('.filter-pill');

    populateProductSelect();
    bindEvents();
    renderAll();
  }

  function populateProductSelect() {
    if (!dom.productSelect) return;
    var html = '';
    Object.keys(Data.ZONES).forEach(function(zId) {
      var zone = Data.ZONES[zId];
      var items = Engine.ledger.getItemsByZone(zId);
      html += '<optgroup label="' + zone.name + '">';
      items.forEach(function(item) {
        html += '<option value="' + item.sku + '">' + item.sku + ' · ' + item.name + ' (' + item.stock + ' ' + item.unit + ')</option>';
      });
      html += '</optgroup>';
    });
    dom.productSelect.innerHTML = html;
  }

  function renderMetrics() {
    var metrics = Engine.ledger.getMetrics();
    if (dom.totalUnits) dom.totalUnits.textContent = metrics.totalUnits;
    if (dom.occupancy) dom.occupancy.innerHTML = metrics.occupancy + '<em>%</em>';
    if (dom.gnomesCount) dom.gnomesCount.innerHTML = '6 <em>nomitos</em>';

    if (dom.statusChip) {
      if (metrics.isCongested) {
        dom.statusChip.textContent = '⚠️ PASILLO SATURADO';
        dom.statusChip.style.color = 'var(--red)';
        dom.statusChip.style.borderColor = 'var(--red)';
      } else {
        dom.statusChip.textContent = isBusy ? 'OPERACIÓN EN CURSO' : 'ALMACÉN OPERATIVO';
        dom.statusChip.style.color = isBusy ? 'var(--orange)' : 'var(--teal)';
        dom.statusChip.style.borderColor = 'var(--line)';
      }
    }
  }

  function renderTable() {
    if (!dom.stockTableBody) return;
    var items = Engine.ledger.getItemsByZone(currentFilter);

    var html = items.map(function(p) {
      var percent = Math.min(100, Math.round((p.stock / p.capacity) * 100));
      var zoneInfo = Data.ZONES[p.zone];

      var diffBadge = '<span class="diff-neutral">—</span>';
      if (p.lastDelta > 0) {
        diffBadge = '<span class="diff-badge in">+' + p.lastDelta + '</span>';
      } else if (p.lastDelta < 0) {
        diffBadge = '<span class="diff-badge out">' + p.lastDelta + '</span>';
      }

      return '' +
        '<tr data-sku="' + p.sku + '" class="clickable-row">' +
          '<td>' +
            '<div class="product" style="--product:' + p.color + '">' +
              '<i class="swatch" style="background:' + p.color + '"></i>' +
              '<div>' +
                '<b>' + p.name + '</b>' +
                '<small>' + p.sku + ' · <span style="color:' + zoneInfo.color + '">' + zoneInfo.name.split(':')[0] + '</span></small>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td class="qty-cell">' +
            '<strong>' + p.stock + '</strong>' +
            '<small>' + p.unit + '</small>' +
          '</td>' +
          '<td>' +
            '<div class="capacity" style="--fill:' + percent + '%;--product:' + p.color + '">' +
              '<span class="bar"><i style="width:' + percent + '%;background:' + p.color + '"></i></span>' +
              '<small>' + percent + '%</small>' +
            '</div>' +
          '</td>' +
          '<td class="diff-cell">' + diffBadge + '</td>' +
        '</tr>';
    }).join('');

    dom.stockTableBody.innerHTML = html;

    // Permitir seleccionar ítem al hacer clic en una fila
    var rows = dom.stockTableBody.querySelectorAll('.clickable-row');
    rows.forEach(function(row) {
      row.addEventListener('click', function() {
        var sku = row.getAttribute('data-sku');
        if (dom.productSelect) dom.productSelect.value = sku;
        showToast('Producto seleccionado: ' + sku);
      });
    });
  }

  function renderTransactions() {
    if (!dom.eventList) return;
    var txs = Engine.ledger.transactions;

    if (txs.length === 0) {
      dom.eventList.innerHTML = '<li class="empty-state"><time>—</time><span>Sin movimientos en esta sesión</span><b>—</b></li>';
      return;
    }

    dom.eventList.innerHTML = txs.slice(0, 5).map(function(t) {
      var isEntry = t.type === 'in';
      return '' +
        '<li>' +
          '<time>' + t.time + '</time>' +
          '<span>' +
            '<span class="event-type ' + t.type + '">' + (isEntry ? 'ENTRADA' : 'SALIDA') + '</span> ' +
            '<b>' + t.name + '</b>' +
            '<small style="color:var(--muted);display:block;font-size:0.65rem">' + t.note + ' (' + t.prevStock + ' → ' + t.newStock + ')</small>' +
          '</span>' +
          '<b class="diff-pill ' + t.type + '">' + (isEntry ? '+' : '') + t.delta + '</b>' +
        '</li>';
    }).join('');
  }

  function renderAll() {
    renderMetrics();
    renderTable();
    renderTransactions();
    populateProductSelect();
  }

  async function handleMovement(type) {
    if (isBusy) return;

    var sku = dom.productSelect ? dom.productSelect.value : null;
    var qty = dom.quantityInput ? parseInt(dom.quantityInput.value, 10) : 1;

    if (!sku) {
      showToast('Selecciona un producto');
      return;
    }

    var item = Engine.ledger.getItem(sku);
    if (!item) return;

    // Validar con el motor
    if (type === 'out' && item.stock < qty) {
      showToast('⚠️ No hay suficiente stock de ' + item.name + ' (disponible: ' + item.stock + ').');
      return;
    }

    // Bloquear UI temporalmente
    isBusy = true;
    updateButtonsState();

    // Enviar a vista de almacén si es pantalla móvil
    if (window.matchMedia('(max-width:900px)').matches) {
      setMobileScreen('warehouse');
    }

    // Crear la misión espacial
    var mission = Engine.dispatcher.createMission(type, sku, qty);

    showToast((type === 'in' ? '📦 Camión arribó con +' : '🚚 Preparando salida de −') + qty + ' ' + item.unit + ' · ' + item.sku);

    // Disparar la animación del almacén
    await Warehouse.dispatchGnomeMovement(mission);

    // Actualizar el libro de existencias contable
    var res = Engine.ledger.recordMovement(sku, type, qty);

    Engine.dispatcher.completeMission(mission.id);

    isBusy = false;
    updateButtonsState();
    renderAll();

    if (res.metrics && res.metrics.isCongested) {
      showToast('⚠️ ATENCIÓN: Pasillo central del Local -5 saturado.');
    }
  }

  function updateButtonsState() {
    if (dom.btnIn) dom.btnIn.disabled = isBusy;
    if (dom.btnOut) dom.btnOut.disabled = isBusy;
    if (dom.btnRandom) dom.btnRandom.disabled = isBusy;
    renderMetrics();
  }

  function handleRandomSimulation() {
    if (isBusy) return;
    var items = Engine.ledger.items;
    var randItem = items[Math.floor(Math.random() * items.length)];
    var isEntry = Math.random() > 0.45;

    var qty = Math.floor(Math.random() * 4) + 1;
    if (!isEntry && randItem.stock <= 1) isEntry = true;

    if (dom.productSelect) dom.productSelect.value = randItem.sku;
    if (dom.quantityInput) dom.quantityInput.value = qty;

    handleMovement(isEntry ? 'in' : 'out');
  }

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function() {
      dom.toast.classList.remove('show');
    }, 3200);
  }

  function setMobileScreen(screenName) {
    document.querySelectorAll('[data-screen]').forEach(function(p) {
      p.classList.toggle('active', p.dataset.screen === screenName);
    });
    if (dom.mobileButtons) {
      dom.mobileButtons.forEach(function(b) {
        b.classList.toggle('active', b.dataset.target === screenName);
      });
    }
  }

  function bindEvents() {
    if (dom.btnIn) dom.btnIn.addEventListener('click', function() { handleMovement('in'); });
    if (dom.btnOut) dom.btnOut.addEventListener('click', function() { handleMovement('out'); });
    if (dom.btnRandom) dom.btnRandom.addEventListener('click', handleRandomSimulation);

    if (dom.btnReset) {
      dom.btnReset.addEventListener('click', function() {
        if (isBusy) return;
        Engine.ledger.reset();
        renderAll();
        showToast('Documento e inventario reiniciados a valores iniciales.');
      });
    }

    if (dom.mobileButtons) {
      dom.mobileButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          setMobileScreen(btn.dataset.target);
        });
      });
    }

    // Atajos de incremento rápido en cantidad
    document.querySelectorAll('[data-qty-add]').forEach(function(badge) {
      badge.addEventListener('click', function() {
        var add = parseInt(badge.getAttribute('data-qty-add'), 10) || 1;
        if (dom.quantityInput) {
          var val = (parseInt(dom.quantityInput.value, 10) || 0) + add;
          dom.quantityInput.value = Math.max(1, Math.min(30, val));
        }
      });
    });

    // Píldoras de filtro por zona
    document.querySelectorAll('.filter-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-zone') || 'all';
        renderTable();
      });
    });
  }

  return {
    init: init,
    renderAll: renderAll,
    showToast: showToast
  };
})(window.NOMITOS_DATA, window.NOMITOS_ENGINE, window.NOMITOS_WAREHOUSE);
