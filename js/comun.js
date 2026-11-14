/* CaVeSal® GYN · Ayudantes de formulario compartidos por los módulos de imágenes y oncología.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = Number(String(v).replace(',', '.'));
    return isFinite(n) && n >= 0 ? n : null;
  }
  function sel(id, ops, etq) {
    var s = '<select id="' + id + '">' + ops.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>';
    return etq ? '<label class="campo"><span>' + etq + '</span>' + s + '</label>' : s;
  }
  function campo(id, txt, u, step) {
    return '<label class="campo"><span>' + txt + (u ? ' <em class="u">(' + u + ')</em>' : '') + '</span><input id="' + id + '" type="number" inputmode="decimal" min="0" step="' + (step || '0.1') + '"></label>';
  }
  function chk(id, txt) { return '<label class="chk"><input type="checkbox" id="' + id + '"> ' + txt + '</label>'; }
  function grupo(leyenda, html) { return '<fieldset class="mrs-grupo"><legend>' + leyenda + '</legend>' + html + '</fieldset>'; }
  function ul(arr) { return '<ul class="lista">' + arr.filter(Boolean).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
  function coma(n) { return String(n).replace('.', ','); }
  // Lector de valores dentro de un contenedor.
  function lector(cont) {
    return {
      v: function (id) { var e = cont.querySelector('#' + id); return e ? e.value : ''; },
      n: function (id) { var e = cont.querySelector('#' + id); return e ? num(e.value) : null; },
      c: function (id) { var e = cont.querySelector('#' + id); return !!(e && e.checked); }
    };
  }
  w.GYN = w.GYN || {};
  w.GYN.comun = { num: num, sel: sel, campo: campo, chk: chk, grupo: grupo, ul: ul, coma: coma, lector: lector };
})(window);
