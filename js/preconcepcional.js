/* CaVeSal® GYN · Preconcepcional: panel hormonal.
   Algoritmo propio CaVeSal® · Basado en: ASRM 2021 · ATA 2017 · Guía CaVeSal® "Perfil hormonal femenino en fertilidad".
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  // VALIDAR CON CARLOS: unidades.
  var UNIDADES = { fsh: 'mUI/mL', lh: 'mUI/mL', amh: 'ng/mL', tsh: 'µUI/mL', prl: 'ng/mL', p4: 'ng/mL' };
  var CAMPOS = [
    { id: 'fsh', nombre: 'FSH (día 2 a 5)' },
    { id: 'lh', nombre: 'LH (día 2 a 5)' },
    { id: 'amh', nombre: 'AMH' },
    { id: 'tsh', nombre: 'TSH' },
    { id: 'prl', nombre: 'Prolactina (día 2 a 5)' },
    { id: 'p4', nombre: 'Progesterona (día 21)' }
  ];

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = Number(String(v).replace(',', '.'));
    return isFinite(n) && n >= 0 ? n : null;
  }

  function fsh(v) {
    if (v < 8) return { etq: 'Óptima', color: 'verde' };
    if (v <= 10) return { etq: 'Límite superior del rango óptimo', color: 'ambar' };
    if (v <= 15) return { etq: 'Intermedia, sin categoría en la guía', color: 'ambar' };
    return { etq: 'Baja reserva ovárica', color: 'rojo' };
  }
  function relacion(lh, f) {
    if (lh === null || f === null || f === 0) return null;
    var r = lh / f;
    var o;
    if (r <= 2) o = { etq: 'No sugiere SOP', color: 'verde' };
    else if (r <= 3) o = { etq: 'Zona de corte de la guía (">2-3")', color: 'ambar' };
    else o = { etq: 'Sugiere SOP', color: 'rojo' };
    o.valor = Math.round(r * 10) / 10;
    return o;
  }
  function amh(v) {
    if (v >= 1.2 && v <= 3.5) return { etq: 'Óptima', color: 'verde' };
    return { etq: 'Fuera del rango óptimo de la guía', color: 'ambar' };
  }
  function p4(v) {
    if (v >= 10) return { etq: 'Óptima', color: 'verde' };
    if (v > 3) return { etq: 'Confirma ovulación, pero por debajo del valor óptimo', color: 'ambar' };
    return { etq: 'No confirma ovulación', color: 'rojo' };
  }
  function tsh(v) {
    if (v < 2.5) return { etq: 'Dentro de la meta (menor de 2,5)', color: 'verde' };
    return { etq: 'Por encima de la meta (menor de 2,5)', color: 'ambar' };
  }
  function prl(v) {
    if (v < 20) return { etq: 'Normal', color: 'verde' };
    if (v <= 25) return { etq: 'Límite', color: 'ambar' };
    return { etq: 'Elevada', color: 'rojo' };
  }
  var INTERP = { fsh: fsh, amh: amh, tsh: tsh, prl: prl, p4: p4 };

  function interpretar(vals) {
    var res = [];
    CAMPOS.forEach(function (c) {
      var v = num(vals[c.id]);
      if (v === null || c.id === 'lh') return;
      var o = INTERP[c.id](v);
      res.push({ id: c.id, nombre: c.nombre, valor: v, unidad: UNIDADES[c.id], etq: o.etq, color: o.color });
    });
    var r = relacion(num(vals.lh), num(vals.fsh));
    if (r) res.splice(1, 0, { id: 'lhfsh', nombre: 'Relación LH/FSH', valor: r.valor, unidad: '', etq: r.etq, color: r.color });
    return res;
  }

  function render(cont, T) {
    var t = T.preconcepcional;
    cont.innerHTML = '<p class="ayuda">' + t.ayuda + '</p><div class="form">' +
      CAMPOS.map(function (c) {
        return '<label class="campo"><span>' + c.nombre + ' <em class="u">(' + UNIDADES[c.id] + ')</em></span>' +
          '<input id="p-' + c.id + '" type="number" inputmode="decimal" min="0" step="0.01"></label>';
      }).join('') + '</div><div id="p-out" class="resultados" aria-live="polite"></div>' +
      '<p class="orientativa">' + T.app.orientativa + '</p><p class="etiqueta">' + t.etiqueta + '</p>';
    function actualizar() {
      var vals = {};
      CAMPOS.forEach(function (c) { vals[c.id] = cont.querySelector('#p-' + c.id).value; });
      cont.querySelector('#p-out').innerHTML = interpretar(vals).map(function (r) {
        var v = String(r.valor).replace('.', ',') + (r.unidad ? ' ' + r.unidad : '');
        return w.GYN.fertilidad.fila(r.nombre, v + ' · <strong>' + r.etq + '</strong>', '', r.color);
      }).join('');
    }
    CAMPOS.forEach(function (c) { cont.querySelector('#p-' + c.id).addEventListener('input', actualizar); });
  }

  w.GYN = w.GYN || {};
  w.GYN.preconcepcional = { interpretar: interpretar, fsh: fsh, relacion: relacion, amh: amh, p4: p4, tsh: tsh, prl: prl, UNIDADES: UNIDADES, render: render };
})(window);
