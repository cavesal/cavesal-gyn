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
      '<p class="ayuda">Bajo peso &lt; 18,5 · Normal 18,5–24,9 · Sobrepeso 25–29,9 · Obesidad I 30–34,9 · II 35–39,9 · III ≥ 40 kg/m².</p>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: OMS, TRS 894 (2000).</p>';
    function act() {
      var L = c.lector(cont), i = P.imc(L.n('imc-peso'), L.n('imc-talla')), r = cont.querySelector('#imc-r');
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
