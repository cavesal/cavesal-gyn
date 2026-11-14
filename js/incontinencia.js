/* CaVeSal® GYN · Incontinencia urinaria: tipo, grado de Stamey, índice de Sandvik, diario miccional y conducta.
   Algoritmo propio CaVeSal® · Basado en: NICE NG123 (2019) · AUA/SUFU Stress Urinary Incontinence 2023 ·
   AUA/SUFU Overactive Bladder 2024 · Stamey TA. Ann Surg 1980;192:465-471 · Sandvik H et al. (1993, 2000) · ICS (terminología del diario miccional).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function C() { return w.GYN.comun; }

  var ALARMAS = [
    ['hem', 'Hematuria'], ['itu', 'Infecciones urinarias a repetición'], ['dolor', 'Dolor vesical o uretral'],
    ['vac', 'Chorro débil, pujo para orinar o vaciamiento incompleto'], ['neuro', 'Síntomas neurológicos'],
    ['rt', 'Cirugía o radioterapia pélvica previa'], ['cont', 'Pérdida continua (sospecha de fístula)'], ['masa', 'Masa pélvica']
  ];

  function sandvik(frec, cant) {
    if (!frec || !cant) return null;
    var v = frec * cant;
    var k = v <= 2 ? ['Leve', 'verde'] : v <= 6 ? ['Moderada', 'ambar'] : v <= 9 ? ['Severa', 'naranja'] : ['Muy severa', 'rojo'];
    return { valor: v, nivel: k[0], color: k[1] };
  }
  var STAMEY = ['', 'Grado 1 · pierde con esfuerzo grande: tos, estornudo, risa, levantar peso',
    'Grado 2 · pierde con esfuerzo leve: caminar, pararse, cambiar de posición',
    'Grado 3 · pierde en reposo, sin relación con el esfuerzo ni la posición'];

  // d: { micDia, micNoche, urg, pEsf, pUrg, vol24, volNoche, peso, edad }
  function diario(d) {
    var out = { h: [], tipo: null };
    if (d.micDia !== null) out.h.push(d.micDia > 8 ? ['Polaquiuria diurna: ' + d.micDia + ' micciones (más de 8)', 'ambar'] : ['Frecuencia diurna normal: ' + d.micDia, 'verde']);
    if (d.micNoche !== null) out.h.push(d.micNoche >= 2 ? ['Nicturia: ' + d.micNoche + ' por noche (2 o más es relevante)', 'ambar'] : d.micNoche === 1 ? ['Nicturia: 1 por noche', 'neutro'] : ['Sin nicturia', 'verde']);
    if (d.vol24 !== null && d.peso) {
      var mlkg = Math.round(d.vol24 / d.peso);
      out.h.push(mlkg > 40 ? ['Poliuria: ' + mlkg + ' ml/kg en 24 h (más de 40). Buscar diabetes, diuréticos o exceso de líquidos.', 'naranja'] : ['Volumen de 24 h: ' + mlkg + ' ml/kg', 'verde']);
    }
    if (d.vol24 && d.volNoche !== null) {
      var ipn = Math.round(d.volNoche / d.vol24 * 100), corte = d.edad !== null && d.edad < 65 ? 20 : 33;
      out.h.push(ipn > corte ? ['Poliuria nocturna: ' + ipn + ' % del volumen (corte ' + corte + ' %). Revisar líquidos de la noche, edemas, apnea del sueño o insuficiencia cardíaca.', 'naranja'] : ['Volumen nocturno: ' + ipn + ' % del total', 'verde']);
    }
    if (d.pEsf !== null || d.pUrg !== null) {
      var e = d.pEsf || 0, u = d.pUrg || 0;
      out.tipo = e && u ? (e > u ? 'mixta-esf' : u > e ? 'mixta-urg' : 'mixta') : e ? 'esfuerzo' : u ? 'urgencia' : null;
      out.h.push(['Pérdidas por día: ' + e + ' por esfuerzo y ' + u + ' por urgencia', 'neutro']);
    }
    if (d.urg !== null && d.urg > 0) out.h.push(['Episodios de urgencia: ' + d.urg + ' por día', d.urg >= 1 ? 'ambar' : 'neutro']);
    return out;
  }

  // s: { esf, urgP, urgS, frec, noct, pred, alarmas[], tipoDiario }
  function tipo(s) {
    var esf = s.esf, urg = s.urgP || s.urgS || s.frec;
    if (s.tipoDiario && !esf && !urg) return s.tipoDiario.indexOf('mixta') === 0 ? 'mixta' : s.tipoDiario;
    if (esf && (s.urgP || s.urgS)) return 'mixta';
    if (esf) return 'esfuerzo';
    if (urg) return 'urgencia';
    return null;
  }
  var NOMBRES = { esfuerzo: 'Incontinencia de esfuerzo', urgencia: 'Urgencia miccional o vejiga hiperactiva', mixta: 'Incontinencia mixta' };

  function conducta(o) {
    var b = [];
    function bloque(t, arr, color) { b.push({ t: t, l: arr.filter(Boolean), color: color || 'neutro' }); }
    if (o.alarmas.length) bloque('Derivar antes de tratar', ['Signos de alarma: ' + o.alarmas.join(', ') + '. Estudiar o derivar a uroginecología o urología.'], 'rojo');
    bloque('Para todas', [
      'Tira reactiva o examen de orina para descartar infección.',
      'Ajustar líquidos si toma mucho o muy poco. Bajar la cafeína.',
      o.imc30 ? 'IMC de 30 o más: bajar de peso mejora la pérdida de orina.' : '',
      'Tratar la constipación y la tos crónica. Dejar de fumar.',
      o.atrofia ? 'Atrofia vaginal: estrógeno vaginal, estriol crema 0,5 mg/día por 2 a 3 semanas y después 2 veces por semana, o estradiol 10 mcg comprimido vaginal diario por 2 semanas y después 2 veces por semana. La THM sistémica no trata la incontinencia.' : ''
    ], 'neutro');
    var esf = o.tipo === 'esfuerzo' || (o.tipo === 'mixta' && o.pred !== 'urg');
    var urg = o.tipo === 'urgencia' || (o.tipo === 'mixta' && o.pred !== 'esf');
    if (o.tipo === 'mixta') bloque('Mixta', ['Tratar primero el componente que predomina' + (o.pred === 'esf' ? ' (esfuerzo).' : o.pred === 'urg' ? ' (urgencia).' : '. Si no está claro, empezar por el entrenamiento vesical y el suelo pélvico.'), 'Antes de una cirugía: estudio urodinámico.'], 'ambar');
    if (esf) {
      bloque('Esfuerzo · primera línea', [
        'Entrenamiento del suelo pélvico supervisado por al menos 3 meses: 8 contracciones o más, 3 veces por día.',
        'Pesario o dispositivo de incontinencia: temporal o para uso ocasional, por ejemplo durante el ejercicio.',
        o.stamey === 3 ? 'Grado 3 de Stamey: pensar en deficiencia del esfínter o en una fístula. Derivar a uroginecología.' : ''
      ], 'verde');
      bloque('Esfuerzo · si no mejora', [
        'Duloxetina 40 mg 2 veces por día: segunda línea si no quiere operarse. Da náuseas; no es primera línea.',
        'Cirugía: cabestrillo medio uretral retropúbico (TVT) o transobturador (TOT), minicabestrillo de incisión única, colposuspensión de Burch o cabestrillo fascial autólogo.',
        'Agentes de relleno uretral: menos invasivos y menos eficaces; opción si no quiere o no puede operarse.',
        'Malla para incontinencia: aceptada por la AUA y restringida en el Reino Unido. Explicar riesgos y dejar constancia del consentimiento.',
        'Urodinamia antes de operar si es mixta, hay cirugía previa, síntomas de vaciamiento o prolapso anterior o apical. No hace falta si es de esfuerzo pura y demostrada.',
        o.prolapso ? 'Con prolapso: test de esfuerzo con el prolapso reducido para buscar incontinencia oculta (ver Prolapso).' : ''
      ], 'ambar');
    }
    if (urg) {
      bloque('Urgencia · primera línea', [
        'Entrenamiento vesical por al menos 6 semanas: orinar con horario y alargar de a poco el intervalo.',
        'Bajar la cafeína y repartir los líquidos en el día.',
        'Suelo pélvico: ayuda a inhibir la urgencia.'
      ], 'verde');
      bloque('Urgencia · fármacos', [
        o.mayor ? 'Mayor de 65, deterioro cognitivo o muchos fármacos: preferir agonista β3 por la carga anticolinérgica y el riesgo de demencia.' : '',
        'Agonistas β3: mirabegrón 25 a 50 mg/día · vibegrón 75 mg/día.' + (o.hta ? ' Mirabegrón: no usar con HTA severa no controlada (180/110 o más).' : ''),
        'Antimuscarínicos: oxibutinina 2,5 a 5 mg 2 a 3 veces por día o 5 a 30 mg/día de liberación prolongada o parche 3,9 mg/día (cambio 2 veces por semana) · tolterodina 2 mg 2 veces por día o 4 mg/día prolongada · solifenacina 5 a 10 mg/día · darifenacina 7,5 a 15 mg/día · trospio 20 mg 2 veces por día · fesoterodina 4 a 8 mg/día.',
        o.glaucoma ? 'Glaucoma de ángulo cerrado: no usar antimuscarínicos.' : 'Antimuscarínicos: no usar con glaucoma de ángulo cerrado no tratado, retención urinaria ni miastenia.',
        o.residuo !== null && o.residuo >= 250 ? 'Residuo de ' + o.residuo + ' ml: precaución con los antimuscarínicos (250 a 300 ml o más, AUA/SUFU 2024).' : '',
        'Revisar a las 4 semanas. Si no alcanza, cambiar la dosis o el fármaco.'
      ], 'ambar');
      bloque('Urgencia · refractaria', [
        'Toxina onabotulínica A 100 U intravesical. Enseñar autocateterismo por riesgo de retención.',
        'Estimulación percutánea del nervio tibial posterior: 12 sesiones semanales.',
        'Neuromodulación sacra. Derivar a uroginecología.'
      ], 'naranja');
    }
    return b;
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila;
    var frecO = [['', '—'], ['1', 'Menos de 1 vez por mes'], ['2', 'Algunas veces por mes'], ['3', 'Algunas veces por semana'], ['4', 'Todos los días o noches']];
    var cantO = [['', '—'], ['1', 'Gotas'], ['2', 'Pequeños chorros'], ['3', 'Más']];
    cont.innerHTML =
      '<h3 class="sub">1 · Tipo de incontinencia</h3>' +
      c.grupo('Síntomas', c.chk('u-esf', 'Pierde orina al toser, estornudar, reír o hacer fuerza') +
        c.chk('u-urgP', 'Ganas súbitas de orinar y pierde antes de llegar al baño') + c.chk('u-urgS', 'Ganas súbitas de orinar sin pérdida') +
        c.chk('u-frec', 'Orina muchas veces en el día') + c.chk('u-noct', 'Se levanta de noche a orinar')) +
      '<div id="u-predW" class="form" hidden>' + c.sel('u-pred', [['', 'No está claro'], ['esf', 'Esfuerzo'], ['urg', 'Urgencia']], 'Qué predomina') + '</div>' +
      c.grupo('Signos de alarma', ALARMAS.map(function (x) { return c.chk('u-a-' + x[0], x[1]); }).join('')) +

      '<h3 class="sub">2 · Grado y gravedad</h3>' +
      '<div class="form" id="u-stW">' + c.sel('u-st', [['', '—'], ['1', STAMEY[1]], ['2', STAMEY[2]], ['3', STAMEY[3]]], 'Grado de Stamey (esfuerzo)') + '</div>' +
      c.grupo('Índice de Sandvik', '<div class="grid2">' + c.sel('u-sf', frecO, 'Con qué frecuencia pierde') + c.sel('u-sc', cantO, 'Cuánto pierde') + '</div>') +
      '<div id="u-gr" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">3 · Diario miccional (promedio de 3 días)</h3>' +
      c.grupo('Por día', '<div class="grid2">' + c.campo('u-md', 'Micciones de día', '', '1') + c.campo('u-mn', 'Micciones de noche', '', '1') +
        c.campo('u-ue', 'Episodios de urgencia', '', '1') + c.campo('u-pe', 'Pérdidas por esfuerzo', '', '1') + c.campo('u-pu', 'Pérdidas por urgencia', '', '1') + '</div>') +
      c.grupo('Volúmenes (opcional)', '<div class="grid2">' + c.campo('u-v24', 'Orina de 24 h', 'ml', '10') + c.campo('u-vn', 'Orina de la noche', 'ml', '10') +
        c.campo('u-peso', 'Peso', 'kg') + c.campo('u-edad', 'Edad', 'años', '1') + '</div>') +
      '<div id="u-dm" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">4 · Conducta</h3>' +
      '<div id="u-condW">' +
      c.grupo('Datos para la conducta', c.chk('u-atr', 'Atrofia vaginal o posmenopausia con síndrome genitourinario') + c.chk('u-imc', 'IMC de 30 o más') +
        c.chk('u-pro', 'Prolapso asociado') + c.chk('u-may', 'Mayor de 65, deterioro cognitivo o muchos fármacos') +
        c.chk('u-gla', 'Glaucoma de ángulo cerrado') + c.chk('u-hta', 'HTA no controlada') + '<div class="form">' + c.campo('u-res', 'Residuo posmiccional', 'ml', '10') + '</div>') +
      '<div id="u-out" class="resultados" aria-live="polite"></div></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: NICE NG123 (2019) · AUA/SUFU SUI 2023 · AUA/SUFU OAB 2024 · Stamey TA. Ann Surg 1980;192:465-471 · Sandvik H et al. J Epidemiol Community Health 1993;47:497-499 y Neurourol Urodyn 2000;19:137-145 · ICS · Sugerencia CaVeSal® para dosis habituales</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    var esFull = !opts || opts.esFull !== false;
    function actualizar() {
      var al = ALARMAS.filter(function (x) { return L.c('u-a-' + x[0]); }).map(function (x) { return x[1].toLowerCase(); });
      var dm = diario({ micDia: L.n('u-md'), micNoche: L.n('u-mn'), urg: L.n('u-ue'), pEsf: L.n('u-pe'), pUrg: L.n('u-pu'), vol24: L.n('u-v24'), volNoche: L.n('u-vn'), peso: L.n('u-peso'), edad: L.n('u-edad') });
      var tp = tipo({ esf: L.c('u-esf'), urgP: L.c('u-urgP'), urgS: L.c('u-urgS'), frec: L.c('u-frec'), tipoDiario: dm.tipo });
      q('#u-predW').hidden = tp !== 'mixta';
      q('#u-stW').hidden = !(tp === 'esfuerzo' || tp === 'mixta');
      var sv = sandvik(+L.v('u-sf'), +L.v('u-sc')), st = +L.v('u-st') || 0;
      var g = [F('Tipo', '<strong>' + (tp ? NOMBRES[tp] : 'Marcá los síntomas o cargá el diario') + '</strong>', '', tp ? 'ambar' : 'neutro')];
      if (st && (tp === 'esfuerzo' || tp === 'mixta')) g.push(F('Stamey', '<strong>Grado ' + st + '</strong>', STAMEY[st].split(' · ')[1], st === 3 ? 'rojo' : st === 2 ? 'naranja' : 'ambar'));
      if (sv) g.push(F('Sandvik', '<strong>' + sv.valor + ' · ' + sv.nivel + '</strong>', 'Leve 1–2 · moderada 3–6 · severa 8–9 · muy severa 12', sv.color));
      if (al.length) g.push(F('Alarma', 'Derivar: ' + al.join(', ') + '.', '', 'rojo'));
      q('#u-gr').innerHTML = g.join('');
      q('#u-dm').innerHTML = dm.h.length ? dm.h.map(function (x) { return F('', x[0], '', x[1]); }).join('') : '<p class="ayuda">Cargá los promedios del diario. Desde la HC se puede llevar el Diario Miccional.</p>';
      if (!esFull) { q('#u-out').innerHTML = opts.bloqueo('Conducta en la versión completa'); return; }
      if (!tp && !al.length) { q('#u-out').innerHTML = '<p class="ayuda">Definí el tipo para ver la conducta.</p>'; return; }
      var k = conducta({ tipo: tp, pred: L.v('u-pred'), alarmas: al, stamey: st, atrofia: L.c('u-atr'), imc30: L.c('u-imc'), prolapso: L.c('u-pro'), mayor: L.c('u-may'), glaucoma: L.c('u-gla'), hta: L.c('u-hta'), residuo: L.n('u-res') });
      q('#u-out').innerHTML = k.map(function (x) { return F(x.t, c.ul(x.l), '', x.color); }).join('');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.incontinencia = { sandvik: sandvik, diario: diario, tipo: tipo, conducta: conducta, render: render, STAMEY: STAMEY };
})(window);
