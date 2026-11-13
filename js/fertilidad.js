/* CaVeSal® GYN · Fertilidad.
   Algoritmo propio CaVeSal® · Basado en: ASRM 2020 · ESHRE 2023 · MSPyBS Res. S.G. N.º 050/2025 ·
   Palatnik 2012 · Shalom-Paz 2014 · cohortes 2024-2026 sobre tamaño folicular en IIU.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  // VALIDAR CON CARLOS: la nota original dice "+7 a +10" y el ejemplo llega al día 23.
  var P4_OFFSET_MIN = 7;
  var P4_OFFSET_MAX = 10;
  var CICLO_MIN_VALIDO = 15, CICLO_MAX_VALIDO = 60;
  var CICLO_HABITUAL_MIN = 21, CICLO_HABITUAL_MAX = 35;

  // Umbrales de trigger por esquema (mm). Rangos continuos para admitir decimales:
  //   folículo < rango[0]                → noAlcanza
  //   rango[0] ≤ folículo ≤ rango[1]     → rango
  //   rango[1] < folículo ≤ tolerancia   → tolerancia (si existe)
  //   por encima del último límite       → encima
  // Umbrales según ASRM 2013 y literatura (aprobado por el autor el 13/11/2026).
  //   Letrozol: 19-23 mm (cohortes de IIU con letrozol 2024-2025: 19,1-21 y 19-23 mm);
  //             tolerancia hasta 28 mm (Palatnik 2012: 23-28 mm con clomifeno o letrozol).
  //   Clomifeno: 20-28 mm (Shalom-Paz 2014: concepción con 20,4 ± 1,2 mm; Palatnik 2012: 23-28 mm).
  //   HMG o FSH: 16-18 mm (letrozol-HMG 16,1-18 mm; cohorte 2026 con pico en 15-16 mm);
  //             tolerancia hasta 20 mm (Shalom-Paz 2014: concepción con 18,5 ± 1,7 mm).
  var TRIGGER = {
    letrozol: { rango: [19, 23], tolerancia: 28 },
    clomifeno: { rango: [20, 28], tolerancia: null },
    gonadotropinas: { rango: [16, 18], tolerancia: 20 }
  };

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = Number(String(v).replace(',', '.'));
    return isFinite(n) ? n : null;
  }

  function calcularCiclo(duracion) {
    var d = num(duracion);
    if (d === null || d < CICLO_MIN_VALIDO || d > CICLO_MAX_VALIDO || Math.round(d) !== d) return { valido: false };
    var ov = d - 14;
    return {
      valido: true,
      ovulacion: ov,
      p4Desde: ov + P4_OFFSET_MIN,
      p4Hasta: ov + P4_OFFSET_MAX,
      fueraDeRango: d < CICLO_HABITUAL_MIN || d > CICLO_HABITUAL_MAX
    };
  }

  function clasificarFoliculo(esquema, mm) {
    var u = TRIGGER[esquema];
    var x = num(mm);
    if (!u || x === null || x <= 0) return null;
    if (x < u.rango[0]) return 'noAlcanza';
    if (x <= u.rango[1]) return 'rango';
    if (u.tolerancia !== null && x <= u.tolerancia) return 'tolerancia';
    return 'encima';
  }

  function fechaDia(fum, diaCiclo) {
    if (!fum) return null;
    var p = String(fum).split('-');
    if (p.length !== 3) return null;
    var f = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (isNaN(f.getTime())) return null;
    f.setDate(f.getDate() + diaCiclo - 1);
    return f;
  }

  function fmt(f) {
    return f ? f.toLocaleDateString('es-PY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
  }

  var COLOR = { noAlcanza: 'ambar', rango: 'verde', tolerancia: 'ambar', encima: 'rojo' };

  function render(cont, T) {
    var t = T.fertilidad;
    cont.innerHTML =
      '<div class="form">' +
      '<label class="campo"><span>' + t.ciclo + '</span><input id="f-ciclo" type="number" inputmode="numeric" min="15" max="60" step="1" placeholder="28"><small>' + t.cicloAyuda + '</small></label>' +
      '<label class="campo"><span>' + t.fum + '</span><input id="f-fum" type="date"></label>' +
      '<label class="campo"><span>' + t.esquema + '</span><select id="f-esq">' +
      Object.keys(t.esquemas).map(function (k) { return '<option value="' + k + '">' + t.esquemas[k] + '</option>'; }).join('') +
      '</select></label>' +
      '<label class="campo"><span>' + t.foliculo + '</span><input id="f-fol" type="number" inputmode="decimal" min="0" max="40" step="0.1" placeholder="19"></label>' +
      '</div><div id="f-out" class="resultados" aria-live="polite"></div>' +
      '<details class="ref"><summary>' + t.esquemasTitulo + '</summary><ul>' + t.esquemasTexto.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></details>' +
      '<p class="etiqueta">' + t.etiqueta + '</p>';

    var $ = function (id) { return cont.querySelector('#' + id); };
    function actualizar() {
      var out = $('f-out'); var html = '';
      var cicloTxt = $('f-ciclo').value;
      if (cicloTxt !== '') {
        var c = calcularCiclo(cicloTxt);
        if (!c.valido) html += fila('', t.cicloInvalido, '', 'ambar');
        else {
          var fOv = fechaDia($('f-fum').value, c.ovulacion);
          var fA = fechaDia($('f-fum').value, c.p4Desde), fB = fechaDia($('f-fum').value, c.p4Hasta);
          html += fila(t.ovulacion, t.dia + ' ' + c.ovulacion + ' ' + t.diaDel, fOv ? fmt(fOv) : '', 'neutro');
          html += fila(t.progesterona, t.dia + ' ' + c.p4Desde + ' a ' + c.p4Hasta + ' ' + t.diaDel, fA ? fmt(fA) + ' a ' + fmt(fB) : '', 'neutro');
          if (c.fueraDeRango) html += fila('', t.cicloFuera, '', 'ambar');
        }
      }
      var esq = $('f-esq').value, fol = $('f-fol').value;
      if (fol !== '') {
        if (esq === 'ninguno') html += fila(t.trigger, t.sinEsquema, '', 'neutro');
        else {
          var est = clasificarFoliculo(esq, fol);
          if (est) html += fila(t.trigger + ' · ' + t.esquemas[esq], String(fol).replace('.', ',') + ' mm: ' + t.estados[est], textoUmbral(esq), COLOR[est]);
        }
      }
      out.innerHTML = html;
    }
    ['f-ciclo', 'f-fum', 'f-esq', 'f-fol'].forEach(function (id) { $(id).addEventListener('input', actualizar); });
  }

  function textoUmbral(esq) {
    var u = TRIGGER[esq];
    var s = 'Rango ' + u.rango[0] + '-' + u.rango[1] + ' mm';
    if (u.tolerancia !== null) s += ' · tolerancia hasta ' + u.tolerancia + ' mm';
    return s;
  }

  function fila(etq, valor, detalle, color) {
    return '<div class="fila ' + color + '">' + (etq ? '<div class="f-etq">' + etq + '</div>' : '') +
      '<div class="f-val">' + valor + '</div>' + (detalle ? '<div class="f-det">' + detalle + '</div>' : '') + '</div>';
  }

  w.GYN = w.GYN || {};
  w.GYN.fertilidad = { calcularCiclo: calcularCiclo, clasificarFoliculo: clasificarFoliculo, TRIGGER: TRIGGER,
    P4_OFFSET_MIN: P4_OFFSET_MIN, P4_OFFSET_MAX: P4_OFFSET_MAX, render: render, fila: fila };
})(window);
