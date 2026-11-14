/* CaVeSal® GYN · Diabetes fuera del embarazo: normal, prediabetes o diabetes, confirmación y conducta.
   Algoritmo propio CaVeSal® · Basado en: ADA, Standards of Care in Diabetes 2026, sección 2 (Diagnosis and Classification) ·
   OMS 2006 y 2011 (glucemia en ayunas alterada desde 110 mg/dL; HbA1c ≥ 6,5 % para diabetes).
   No usa los cortes de la gestante (IADPSG). Reutiliza los cortes ADA del módulo SOMP.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function coma(n) { return String(n).replace('.', ','); }

  // d: { ay, h2, a1c, azar, sintomas, embarazo }
  function clasificar(d) {
    if (d.embarazo) return { tit: 'Embarazada: usar los criterios de la gestante', color: 'ambar', nivel: -1, items: [], notas: ['Este módulo es para la no gestante. En el embarazo rigen otros cortes (IADPSG): usar la Calculadora prenatal CaVeSal®.'] };
    var g = w.GYN.somp.glucemia({ ay: d.ay, h2: d.h2, a1c: d.a1c }), items = g ? g.items.slice() : [], nivel = g ? g.nivel : -1, notas = [];
    var enRango = [d.ay !== null && d.ay >= 126, d.h2 !== null && d.h2 >= 200, d.a1c !== null && d.a1c >= 6.5].filter(Boolean).length;
    if (d.azar !== null) {
      items.push('Glucemia al azar ' + coma(d.azar) + ' mg/dL' + (d.azar >= 200 ? (d.sintomas ? ': diabetes (con síntomas clásicos o crisis hiperglucémica)' : ': ≥ 200 sin síntomas, no diagnostica sola') : ''));
      if (d.azar >= 200 && d.sintomas) nivel = 3;
    }
    if (nivel < 0) return null;
    var tit, color;
    if (nivel === 3) { tit = 'Diabetes'; color = 'rojo'; notas.push('Glucemia al azar ≥ 200 mg/dL con síntomas clásicos: no requiere segunda prueba (ADA 2026).'); }
    else if (nivel === 2) {
      if (enRango >= 2) { tit = 'Diabetes'; color = 'rojo'; notas.push('Dos pruebas en rango de diabetes (misma muestra o muestras distintas): diagnóstico confirmado (ADA 2026).'); }
      else { tit = 'Rango de diabetes: confirmar'; color = 'rojo'; notas.push('Un solo valor en rango de diabetes: repetir la misma prueba u otra en una segunda muestra (ADA 2026).'); }
    } else if (nivel === 1) {
      tit = 'Prediabetes'; color = 'ambar';
      if (d.ay !== null && d.ay >= 100 && d.ay < 110) notas.push('Ayunas de 100 a 109 mg/dL: prediabetes para ADA; normal para OMS (glucemia en ayunas alterada desde 110).');
      if (d.a1c !== null && d.a1c >= 5.7 && d.a1c < 6.5) notas.push('HbA1c de 5,7 a 6,4 %: prediabetes para ADA; OMS no usa HbA1c para prediabetes.');
    } else { tit = 'Normoglucemia'; color = 'verde'; }
    return { tit: tit, color: color, nivel: nivel, items: items, notas: notas };
  }

  // x: { r, imc, edad, dmgPrevia, planifica }
  function conducta(x) {
    var c = [], r = x.r;
    if (!r || r.nivel < 0) return c;
    if (r.tit === 'Rango de diabetes: confirmar') c.push('Repetir la prueba en otra muestra antes de rotular.');
    if (r.tit === 'Diabetes') {
      c.push('Control y tratamiento por clínica médica o diabetología; evaluar complicaciones (fondo de ojo, función renal y albuminuria, pie, perfil lipídico, presión arterial).');
      c.push('Anticoncepción eficaz hasta lograr buen control: revisar elegibilidad en el módulo MEC.');
      if (x.planifica) c.push('Planifica embarazo: lograr HbA1c menor de 6,5 % si es posible sin hipoglucemias y ácido fólico antes de concebir (ADA 2026). Ver módulo Preconcepcional.');
    }
    if (r.tit === 'Prediabetes') {
      c.push('Cambios en el estilo de vida: alimentación, actividad física y pérdida de 7 % del peso si hay sobrepeso (ADA 2026).');
      c.push('Control glucémico al menos una vez por año.');
      if (x.dmgPrevia || (x.imc !== null && x.imc >= 35 && (x.edad === null || (x.edad >= 25 && x.edad < 60)))) c.push('Considerar metformina para prevenir diabetes tipo 2, sobre todo con IMC ≥ 35 entre 25 y 59 años, o antecedente de diabetes gestacional (ADA 2026).');
    }
    if (r.tit === 'Normoglucemia') c.push('Repetir el tamizaje cada 3 años, o antes si hay factores de riesgo (ADA 2026). Antecedente de diabetes gestacional: tamizaje al menos cada 3 años de por vida.');
    if (x.imc !== null && x.imc >= 27 && r.nivel >= 1) c.push('IMC ' + coma(x.imc) + ': valorar incretinas en el módulo Incretinas.');
    return c;
  }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">Criterio de la no gestante (ADA 2026). Para la embarazada se usan los cortes IADPSG de la Calculadora prenatal.</p>' +
      c.grupo('Glucemia', '<div class="grid2">' + c.campo('dm-ay', 'Glucemia en ayunas', 'mg/dL', '1') + c.campo('dm-h2', 'PTOG 75 g a las 2 h', 'mg/dL', '1') +
        c.campo('dm-a1c', 'HbA1c', '%') + c.campo('dm-az', 'Glucemia al azar', 'mg/dL', '1') + '</div>' +
        c.chk('dm-sin', 'Síntomas clásicos de hiperglucemia (poliuria, polidipsia, pérdida de peso) o crisis hiperglucémica')) +
      c.grupo('Datos para la conducta', '<div class="grid2">' + c.campo('dm-edad', 'Edad', 'años', '1') + c.campo('dm-imc', 'IMC', 'kg/m²') + '</div>' +
        c.chk('dm-dmg', 'Antecedente de diabetes gestacional') + c.chk('dm-plan', 'Planifica embarazo') + c.chk('dm-emb', 'Está embarazada')) +
      '<div id="dm-o" class="resultados" aria-live="polite"></div>' +
      '<p class="ayuda">Diabetes: ayunas ≥ 126 · PTOG 2 h ≥ 200 · HbA1c ≥ 6,5 % · al azar ≥ 200 con síntomas. Prediabetes (ADA): ayunas 100–125 · PTOG 2 h 140–199 · HbA1c 5,7–6,4 %.</p>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ADA, Standards of Care in Diabetes 2026 (Diabetes Care 2026;49 Suppl 1) · OMS 2006 y 2011.</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function act() {
      var r = clasificar({ ay: L.n('dm-ay'), h2: L.n('dm-h2'), a1c: L.n('dm-a1c'), azar: L.n('dm-az'), sintomas: L.c('dm-sin'), embarazo: L.c('dm-emb') });
      var h = [];
      if (!r) h.push(F('', 'Cargá al menos una glucemia o la HbA1c.', '', 'neutro'));
      else {
        h.push(F('Resultado', '<strong>' + r.tit + '</strong>', r.items.length ? c.ul(r.items) : '', r.color));
        if (r.notas.length) h.push(F('Notas', c.ul(r.notas), '', 'neutro'));
        if (!esFull) h.push(opts.bloqueo('Conducta en la versión completa'));
        else {
          var k = conducta({ r: r, imc: L.n('dm-imc'), edad: L.n('dm-edad'), dmgPrevia: L.c('dm-dmg'), planifica: L.c('dm-plan') });
          if (k.length) h.push(F('Conducta', c.ul(k), 'Sugerencia CaVeSal®.', r.color === 'verde' ? 'verde' : 'ambar'));
        }
      }
      cont.querySelector('#dm-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.dm = { clasificar: clasificar, conducta: conducta, render: render };
})(window);
