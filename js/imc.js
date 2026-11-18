/* CaVeSal® GYN · IMC con clasificación OMS (abierto en la Demo).
   Algoritmo propio CaVeSal® · Basado en: OMS, Obesity: preventing and managing the global epidemic (TRS 894, 2000).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var COLOR = { 'Bajo peso': 'ambar', 'Normal': 'verde', 'Sobrepeso': 'ambar', 'Obesidad clase I': 'naranja', 'Obesidad clase II': 'rojo', 'Obesidad clase III': 'rojo' };
  function render(cont) {
    var c = w.GYN.comun, P = w.GYN.preconcepcional;
    cont.innerHTML =
      '<div class="mrs-total" id="imc-r" aria-live="polite"><span class="mt-etq">Cargá peso y talla</span></div>' +
      c.grupo('Datos', c.campo('imc-peso', 'Peso', 'kg') + c.campo('imc-talla', 'Talla', 'cm')) +
      '<div id="imc-ideal" class="resultados" aria-live="polite"></div>' +
      '<p class="ayuda">Bajo peso &lt; 18,5 · Normal 18,5–24,9 · Sobrepeso 25–29,9 · Obesidad I 30–34,9 · II 35–39,9 · III ≥ 40 kg/m².</p>' +
      '<p class="ayuda">Peso ideal: franja de peso que corresponde a un IMC entre 20 y 25 kg/m² para la talla cargada (peso = IMC × talla²).</p>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: OMS, TRS 894 (2000).</p>';
    // 2026-11-17 — a pedido de Carlos: peso ideal = franja de IMC 20–25 para
    // la talla, y cuánto bajar o subir para llegar a esa franja.
    function ideal(L) {
      var o = cont.querySelector('#imc-ideal'), t = L.n('imc-talla'), p = L.n('imc-peso');
      if (t === null || !(t > 0)) { o.innerHTML = ''; return; }
      var m = t / 100, min = Math.round(20 * m * m * 10) / 10, max = Math.round(25 * m * m * 10) / 10;
      var det = '', cls = 'verde';
      if (p !== null && p > 0) {
        if (p > max) { cls = 'ambar'; det = 'Para llegar a la franja: bajar ' + c.coma(Math.round((p - max) * 10) / 10) + ' kg (hasta ' + c.coma(max) + ' kg).'; }
        else if (p < min) { cls = 'ambar'; det = 'Para llegar a la franja: subir ' + c.coma(Math.round((min - p) * 10) / 10) + ' kg (hasta ' + c.coma(min) + ' kg).'; }
        else det = 'El peso actual está dentro de la franja.';
      }
      o.innerHTML = '<div class="fila ' + cls + '"><div class="f-etq">Peso ideal (IMC 20–25)</div><div class="f-val"><b>' + c.coma(min) + ' – ' + c.coma(max) + ' kg</b></div>' + (det ? '<div class="f-det">' + det + '</div>' : '') + '</div>';
    }
    function act() {
      var L = c.lector(cont), i = P.imc(L.n('imc-peso'), L.n('imc-talla')), r = cont.querySelector('#imc-r');
      ideal(L);
      if (i === null) { r.className = 'mrs-total'; r.innerHTML = '<span class="mt-etq">Cargá peso y talla</span>'; return; }
      var k = P.claseOMS(i);
      r.className = 'mrs-total ' + COLOR[k];
      r.innerHTML = '<span class="mt-num">IMC ' + c.coma(i) + ' kg/m²</span><span class="mt-etq">' + k + '</span>';
    }
    cont.addEventListener('input', act);
  }
  w.GYN = w.GYN || {};
  w.GYN.imc = { render: render };
})(window);
