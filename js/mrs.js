/* CaVeSal® GYN · Escala MRS.
   Algoritmo propio CaVeSal® · Basado en: Heinemann LAJ et al. Health Qual Life Outcomes 2004;2:67.
   Texto de los 11 ítems: el mismo de CaVeSal® Mujer y la Historia Clínica CaVeSal®.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  var ITEMS = [
    { id: 1, texto: 'Calores, sofocos, sudoración', dominio: 'somatico' },
    { id: 2, texto: 'Molestias en el corazón (palpitaciones, opresión en el pecho)', dominio: 'somatico' },
    { id: 3, texto: 'Dificultad para dormir', dominio: 'somatico' },
    { id: 4, texto: 'Dolores musculares y en las articulaciones', dominio: 'somatico' },
    { id: 5, texto: 'Ánimo bajo o tristeza', dominio: 'psicologico' },
    { id: 6, texto: 'Irritabilidad, poca paciencia', dominio: 'psicologico' },
    { id: 7, texto: 'Ansiedad, nerviosismo', dominio: 'psicologico' },
    { id: 8, texto: 'Cansancio físico y mental', dominio: 'psicologico' },
    { id: 9, texto: 'Cambios en el deseo o en la vida sexual', dominio: 'urogenital' },
    { id: 10, texto: 'Problemas con la orina (urgencia, pérdidas, ardor)', dominio: 'urogenital' },
    { id: 11, texto: 'Sequedad vaginal o molestias en las relaciones', dominio: 'urogenital' }
  ];
  var MAXIMO = { somatico: 16, psicologico: 16, urogenital: 12, total: 44 };
  // Límite inferior de leve, moderado y severo (Heinemann 2004).
  var CORTES = { total: [5, 9, 16], somatico: [3, 5, 8], psicologico: [2, 4, 7], urogenital: [1, 2, 4] };
  var RANGOS = { total: ['0-4', '5-8', '9-15', '16 o más'], somatico: ['0-2', '3-4', '5-7', '8 o más'],
    psicologico: ['0-1', '2-3', '4-6', '7 o más'], urogenital: ['0', '1', '2-3', '4 o más'] };
  var COLORES = ['verde', 'ambar', 'naranja', 'rojo'];

  function nivel(escala, puntaje) {
    var c = CORTES[escala], n = 0;
    for (var i = 0; i < c.length; i++) if (puntaje >= c[i]) n = i + 1;
    return n;
  }

  function calcular(resp) {
    var r = { somatico: 0, psicologico: 0, urogenital: 0, total: 0 };
    ITEMS.forEach(function (it, i) { var v = Number(resp[i]) || 0; r[it.dominio] += v; r.total += v; });
    var out = {};
    Object.keys(r).forEach(function (k) { var n = nivel(k, r[k]); out[k] = { puntaje: r[k], nivel: n, rango: RANGOS[k][n] }; });
    return out;
  }

  function render(cont, T) {
    var t = T.mrs;
    var resp = ITEMS.map(function () { return 0; });
    var grupos = ['somatico', 'psicologico', 'urogenital'];
    cont.innerHTML =
      '<div class="mrs-total" id="m-total" aria-live="polite"></div>' +
      '<p class="ayuda">' + t.ayuda + '</p>' +
      grupos.map(function (g) {
        return '<fieldset class="mrs-grupo"><legend>' + t.dominios[g] + '</legend>' +
          ITEMS.filter(function (it) { return it.dominio === g; }).map(function (it) {
            return '<div class="mrs-item"><div class="mrs-txt">' + it.id + '. ' + it.texto + '</div><div class="mrs-opts" role="radiogroup" aria-label="' + it.texto + '">' +
              [0, 1, 2, 3, 4].map(function (v) {
                return '<label class="opt"><input type="radio" name="m' + it.id + '" value="' + v + '"' + (v === 0 ? ' checked' : '') + '><span title="' + t.puntajes[v] + '">' + v + '</span></label>';
              }).join('') + '</div></div>';
          }).join('') + '</fieldset>';
      }).join('') +
      '<p class="leyenda">' + t.puntajes.join(' · ') + '</p>' +
      '<div id="m-sub" class="resultados"></div>' +
      '<details class="ref" open><summary>' + t.resumen + '</summary><ol id="m-lista" class="mrs-lista"></ol></details>' +
      '<button type="button" class="btn-sec" id="m-limpiar">' + T.app.limpiar + '</button>' +
      '<p class="cita">' + t.cita + ' <a href="' + t.citaUrl + '" target="_blank" rel="noopener">' + t.citaUrl + '</a></p>' +
      '<p class="etiqueta">' + t.etiqueta + '</p>';

    function actualizar() {
      var c = calcular(resp);
      cont.querySelector('#m-total').className = 'mrs-total ' + COLORES[c.total.nivel];
      cont.querySelector('#m-total').innerHTML = '<span class="mt-num">' + t.total + ': ' + c.total.puntaje + ' / ' + MAXIMO.total + '</span><span class="mt-etq">' + t.gravedad[c.total.nivel] + '</span>';
      cont.querySelector('#m-sub').innerHTML = grupos.map(function (g) {
        return w.GYN.fertilidad.fila(t.dominios[g], c[g].puntaje + ' / ' + MAXIMO[g] + ' · <strong>' + t.gravedad[c[g].nivel] + '</strong>', 'Rango ' + c[g].rango, COLORES[c[g].nivel]);
      }).join('');
      cont.querySelector('#m-lista').innerHTML = ITEMS.map(function (it, i) { return '<li>' + it.texto + ': <strong>' + resp[i] + '</strong></li>'; }).join('');
    }
    cont.addEventListener('change', function (e) {
      var m = /^m(\d+)$/.exec(e.target.name || '');
      if (m) { resp[Number(m[1]) - 1] = Number(e.target.value); actualizar(); }
    });
    cont.querySelector('#m-limpiar').addEventListener('click', function () {
      resp = resp.map(function () { return 0; });
      cont.querySelectorAll('input[type=radio]').forEach(function (r) { r.checked = r.value === '0'; });
      actualizar();
    });
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.mrs = { ITEMS: ITEMS, calcular: calcular, nivel: nivel, RANGOS: RANGOS, render: render };
})(window);
