/**
 * EL ALMACÉN DE NOMITOS - js/engine.js
 * Motor lógico desacoplado: libro contable de existencias (StockLedger),
 * cálculo de diferencias (+/-), métricas y cola de misiones.
 * Sin dependencias del DOM.
 * Licencia: MIT
 */

window.NOMITOS_ENGINE = (function(Data) {
  'use strict';

  // Sistema Pub/Sub simple para desacoplamiento
  var EventBus = {
    _listeners: {},
    on: function(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
    },
    off: function(event, callback) {
      if (!this._listeners[event]) return;
      this._listeners[event] = this._listeners[event].filter(function(cb) {
        return cb !== callback;
      });
    },
    emit: function(event, data) {
      if (!this._listeners[event]) return;
      this._listeners[event].forEach(function(callback) {
        try {
          callback(data);
        } catch (err) {
          console.error('[EventBus] Error in listener for', event, err);
        }
      });
    }
  };

  // Libro de existencias (StockLedger)
  function StockLedger() {
    this.items = [];
    this.transactions = [];
    this.txCounter = 1;
    this.reset();
  }

  StockLedger.prototype.reset = function() {
    this.items = Data.INITIAL_ITEMS.map(function(item) {
      return Object.assign({}, item, {
        lastDelta: 0,
        lastDeltaType: null
      });
    });
    this.transactions = [];
    this.txCounter = 1;
    EventBus.emit('ledger:reset', { items: this.items });
  };

  StockLedger.prototype.getItem = function(sku) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].sku === sku) return this.items[i];
    }
    return null;
  };

  StockLedger.prototype.getItemsByZone = function(zoneId) {
    if (!zoneId || zoneId === 'all') return this.items;
    return this.items.filter(function(it) {
      return it.zone === zoneId;
    });
  };

  StockLedger.prototype.getMetrics = function() {
    var totalUnits = 0;
    var totalCapacity = 0;
    var zoneStats = {};

    Object.keys(Data.ZONES).forEach(function(zId) {
      zoneStats[zId] = {
        units: 0,
        capacity: Data.ZONES[zId].capacity,
        occupancy: 0
      };
    });

    this.items.forEach(function(item) {
      totalUnits += item.stock;
      totalCapacity += item.capacity;
      if (zoneStats[item.zone]) {
        zoneStats[item.zone].units += item.stock;
      }
    });

    Object.keys(zoneStats).forEach(function(zId) {
      var zs = zoneStats[zId];
      zs.occupancy = zs.capacity > 0 ? Math.round((zs.units / zs.capacity) * 100) : 0;
    });

    var globalOccupancy = totalCapacity > 0 ? Math.round((totalUnits / totalCapacity) * 100) : 0;
    var isCongested = (totalUnits / totalCapacity) >= Data.CONGESTION_THRESHOLD;

    return {
      totalUnits: totalUnits,
      totalCapacity: totalCapacity,
      occupancy: globalOccupancy,
      zoneStats: zoneStats,
      isCongested: isCongested
    };
  };

  /**
   * Registra una variación de stock (Entrada o Salida).
   * Reporta la diferencia exacta de cantidad.
   */
  StockLedger.prototype.recordMovement = function(sku, type, qty, note) {
    var item = this.getItem(sku);
    if (!item) {
      return { success: false, error: 'Producto no encontrado: ' + sku };
    }

    qty = parseInt(qty, 10);
    if (isNaN(qty) || qty <= 0) {
      return { success: false, error: 'Cantidad inválida: debe ser mayor a 0.' };
    }

    if (type === 'out') {
      if (item.stock < qty) {
        return {
          success: false,
          error: 'Stock insuficiente para ' + item.name + ' (disponible: ' + item.stock + ').'
        };
      }
    } else if (type === 'in') {
      if (item.stock + qty > item.capacity * 1.5) {
        return {
          success: false,
          error: 'Sobrecarga crítica: el anaquel ' + item.zone + ' supera el 150% de capacidad.'
        };
      }
    } else {
      return { success: false, error: 'Tipo de movimiento inválido (in/out).' };
    }

    var prevStock = item.stock;
    var delta = (type === 'in') ? qty : -qty;
    var newStock = prevStock + delta;

    item.stock = newStock;
    item.lastDelta = delta;
    item.lastDeltaType = type;

    var tx = {
      id: 'TX-' + String(this.txCounter++).padStart(4, '0'),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: type, // 'in' o 'out'
      sku: item.sku,
      name: item.name,
      zone: item.zone,
      delta: delta,
      qty: qty,
      prevStock: prevStock,
      newStock: newStock,
      note: note || (type === 'in' ? 'Recepción de camión' : 'Expedición en muelle')
    };

    this.transactions.unshift(tx);
    if (this.transactions.length > 50) this.transactions.pop();

    var metrics = this.getMetrics();

    EventBus.emit('stock:changed', {
      transaction: tx,
      item: item,
      metrics: metrics
    });

    if (metrics.isCongested) {
      EventBus.emit('warehouse:congested', {
        message: '⚠️ Avertissement sécurité : passage central encombré (Local -5)',
        metrics: metrics
      });
    }

    return { success: true, transaction: tx, item: item, metrics: metrics };
  };

  // Cola de Misiones Espaciales para los Nomitos
  function MissionDispatcher(ledger) {
    this.ledger = ledger;
    this.activeMissions = [];
    this.missionIdCounter = 1;
  }

  MissionDispatcher.prototype.createMission = function(type, sku, qty) {
    var item = this.ledger.getItem(sku);
    if (!item) return null;

    // Calcular cuántos nomitos moverán la carga (1 a 4 según volumen)
    var gnomeCount = Math.min(4, Math.max(1, Math.ceil(qty / 4)));

    var mission = {
      id: 'MIS-' + (this.missionIdCounter++),
      type: type, // 'in' | 'out'
      sku: sku,
      item: item,
      qty: qty,
      gnomeCount: gnomeCount,
      zone: Data.ZONES[item.zone],
      stage: 'queued', // 'at_gate' -> 'at_bureau' -> 'in_transit' -> 'completed'
      createdAt: Date.now()
    };

    this.activeMissions.push(mission);
    EventBus.emit('mission:created', mission);
    return mission;
  };

  MissionDispatcher.prototype.completeMission = function(missionId) {
    this.activeMissions = this.activeMissions.filter(function(m) {
      return m.id !== missionId;
    });
    EventBus.emit('mission:completed', { missionId: missionId });
  };

  var ledgerInstance = new StockLedger();
  var dispatcherInstance = new MissionDispatcher(ledgerInstance);

  return {
    EventBus: EventBus,
    ledger: ledgerInstance,
    dispatcher: dispatcherInstance
  };
})(window.NOMITOS_DATA);
