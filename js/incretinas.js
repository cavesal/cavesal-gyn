/* CaVeSal® GYN · Incretinas: escalada de dosis, contraindicaciones y signos de alarma.
   Algoritmo propio CaVeSal® · Basado en: fichas FDA de Wegovy y Zepbound · ficha británica/EMA de Mounjaro ·
   guías CaVeSal® de análogos GLP-1/GIP, washout preconcepcional y anticoncepción durante tirzepatida.
   No usa datos observacionales como reglas. No incluye moléculas no aprobadas (retatrutida).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  // Escalada aprobada: cada paso dura al menos 4 semanas.
  var MOLECULAS = {
    sema: { nombre: 'Semaglutida SC semanal', dosis: [0.25, 0.5, 1, 1.7, 2.4], washoutDias: 60,
      washout: 'Suspender al menos 2 meses antes de buscar embarazo (ficha FDA de Wegovy, todas las presentaciones).',
      anticoncepcion: 'Sin ajuste del anticonceptivo oral en la ficha. Usar un método eficaz mientras no busque embarazo.' },
    tirze: { nombre: 'Tirzepatida SC semanal', dosis: [2.5, 5, 7.5, 10, 12.5, 15], washoutDias: 30,
      washout: 'Suspender al menos 1 mes antes de buscar embarazo (ficha británica/EMA de Mounjaro). La ficha FDA no fija intervalo: indica suspender al reconocer el embarazo.',
      anticoncepcion: 'Si usa anticonceptivo oral: cambiar a un método no oral o agregar barrera durante 4 semanas tras el inicio y tras cada escalada (ficha de Mounjaro/Zepbound).' }
  };
  var SEMANAS_PASO = 4;
  var ABSOLUTAS = [
    { id: 'mtc', txt: 'Carcinoma medular de tiroides o MEN2, personal o familiar' },
    { id: 'emb', txt: 'Embarazo' },
    { id: 'lact', txt: 'Lactancia' },
    { id: 'panc', txt: 'Pancreatitis previa' }
  ];
  var CAUTELAS = [
    { id: 'bil', txt: 'Litiasis o enfermedad biliar' },
    { id: 'gastro', txt: 'Gastroparesia' },
    { id: 'retino', txt: 'Retinopatía diabética' },
    { id: 'hipo', txt: 'Usa insulina o sulfonilureas' },
    { id: 'tca', txt: 'Trastorno de la conducta alimentaria' }
  ];
  var DETALLE_CAUTELA = {
    bil: 'Vigilar dolor en hipocondrio derecho; la baja rápida de peso aumenta el riesgo de colelitiasis.',
    gastro: 'Enlentece el vaciamiento gástrico: puede empeorar los síntomas.',
    retino: 'Control oftalmológico: la mejora rápida de la glucemia puede agravar la retinopatía.',
    hipo: 'Riesgo de hipoglucemia: valorar bajar la dosis de insulina o sulfonilurea.',
    tca: 'Valorar con salud mental antes de iniciar.'
  };
  var ESTUDIOS = ['Peso, talla, IMC y circunferencia de cintura', 'Presión arterial', 'Glucemia en ayunas y HbA1c', 'Perfil lipídico',
    'Hepatograma', 'Creatinina y filtrado glomerular', 'TSH', 'β-hCG en edad fértil'];
  var ALARMAS = [
    'Dolor abdominal intenso y persistente, con o sin vómitos: descartar pancreatitis.',
    'Dolor en hipocondrio derecho, fiebre o ictericia: descartar colecistitis o colelitiasis.',
    'Vómitos o diarrea que no ceden, poca orina: deshidratación e injuria renal aguda.',
    'Temblor, sudoración, confusión (sobre todo con insulina o sulfonilureas): hipoglucemia.',
    'Pérdida o cambio brusco de la visión.',
    'Bulto en el cuello, disfagia, disfonía persistente.',
    'Ánimo depresivo, ideas de muerte o de autolesión.',
    'Cirugía o endoscopia con sedación: avisar al anestesiólogo por riesgo de aspiración (vaciamiento gástrico lento).'
  ];

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = Number(String(v).replace(',', '.'));
    return isFinite(n) && n >= 0 ? n : null;
  }
  function sumarDias(base, dias) { var d = new Date(base.getTime()); d.setDate(d.getDate() + dias); return d; }
  function fmt(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); }
  function mg(v) { return String(v).replace('.', ',') + ' mg'; }

  function imc(peso, tallaCm) {
    if (!peso || !tallaCm) return null;
    var m = tallaCm / 100;
    return Math.round(peso / (m * m) * 10) / 10;
  }

  // Indicación por IMC: ≥30, o ≥27 con comorbilidad.
  function indicacion(valorImc, comorbilidad) {
    if (valorImc === null) return null;
    if (valorImc >= 30) return { cumple: true, txt: 'IMC ≥30: cumple el criterio de indicación.' };
    if (valorImc >= 27 && comorbilidad) return { cumple: true, txt: 'IMC ≥27 con comorbilidad: cumple el criterio de indicación.' };
    if (valorImc >= 27) return { cumple: false, txt: 'IMC 27 a 29,9 sin comorbilidad cargada: no cumple el criterio.' };
    return { cumple: false, txt: 'IMC <27: no cumple el criterio de indicación.' };
  }

  // Próximo paso de la escalada. dosisIdx = -1 si aún no inicia.
  function escalada(mol, dosisIdx, semanasEnDosis, tolerancia, hoy) {
    var esc = MOLECULAS[mol].dosis;
    if (dosisIdx < 0) return { clave: 'iniciar', dosis: esc[0], fecha: hoy, sig: esc[1] };
    var actual = esc[dosisIdx], ultima = dosisIdx === esc.length - 1;
    if (tolerancia === 'no') return { clave: 'noTolera', dosis: actual, anterior: dosisIdx > 0 ? esc[dosisIdx - 1] : null };
    if (ultima) return { clave: 'maxima', dosis: actual };
    var sem = semanasEnDosis === null ? 0 : semanasEnDosis;
    if (sem < SEMANAS_PASO) return { clave: 'esperar', dosis: actual, sig: esc[dosisIdx + 1], fecha: sumarDias(hoy, Math.ceil((SEMANAS_PASO - sem) * 7)) };
    if (tolerancia === 'leve') return { clave: 'leve', dosis: actual, sig: esc[dosisIdx + 1], fecha: hoy };
    return { clave: 'subir', dosis: actual, sig: esc[dosisIdx + 1], fecha: hoy };
  }

  // Respuesta: menos de 5 % a las 12 semanas de tratamiento.
  function respuesta(pesoIni, pesoAct, semanasTotales) {
    if (!pesoIni || !pesoAct) return null;
    var pct = Math.round((pesoIni - pesoAct) / pesoIni * 1000) / 10;
    var o = { pct: pct, evaluable: semanasTotales !== null && semanasTotales >= 12 };
    o.insuficiente = o.evaluable && pct < 5;
    return o;
  }

  function calcular(e) {
    var hoy = e.hoy || new Date();
    var r = { absolutas: ABSOLUTAS.filter(function (a) { return e.contra && e.contra[a.id]; }).map(function (a) { return a.id; }),
      cautelas: CAUTELAS.filter(function (a) { return e.contra && e.contra[a.id]; }).map(function (a) { return a.id; }) };
    r.imc = imc(num(e.pesoAct) || num(e.pesoIni), num(e.talla));
    r.indicacion = indicacion(r.imc, !!e.comorbilidad);
    r.bloqueo = r.absolutas.length > 0;
    r.escalada = r.bloqueo || e.objetivo === 'embarazo' ? null : escalada(e.mol, e.dosisIdx, num(e.semanasDosis), e.tolerancia, hoy);
    r.respuesta = respuesta(num(e.pesoIni), num(e.pesoAct), num(e.semanasTotales));
    var M = MOLECULAS[e.mol];
    r.washout = e.objetivo === 'embarazo' ? { txt: M.washout, desde: sumarDias(hoy, M.washoutDias) } : null;
    // Anticoncepción
    if (e.objetivo === 'embarazo' || r.absolutas.indexOf('emb') >= 0) r.anticoncepcion = null;
    else if (e.metodo === 'ninguno') r.anticoncepcion = { color: 'rojo', txt: 'Sin método: indicar anticoncepción eficaz durante el tratamiento.' };
    else if (e.mol === 'tirze' && e.metodo === 'oral') {
      var sem = num(e.semanasDosis);
      var hasta = (e.dosisIdx < 0) ? sumarDias(hoy, 28) : (sem !== null && sem < 4 ? sumarDias(hoy, Math.ceil((4 - sem) * 7)) : null);
      r.anticoncepcion = { color: 'ambar', txt: M.anticoncepcion + (hasta ? ' Ahora: barrera hasta el ' + fmt(hasta) + '.' : ' Repetir 4 semanas de barrera en la próxima escalada.') };
    } else r.anticoncepcion = { color: 'verde', txt: M.anticoncepcion };
    r.embarazo = r.absolutas.indexOf('emb') >= 0;
    return r;
  }

  function render(cont, T) {
    var F = w.GYN.fertilidad.fila;
    function opcionesDosis(mol) {
      return '<option value="-1">Aún no inicia</option>' + MOLECULAS[mol].dosis.map(function (d, i) { return '<option value="' + i + '">' + mg(d) + '</option>'; }).join('');
    }
    cont.innerHTML =
      '<p class="ayuda">Cargá el objetivo, la molécula y la dosis actual. Cada bloque calcula su propio resultado.</p>' +
      '<div class="form">' +
        '<label class="campo"><span>Objetivo</span><select id="i-obj"><option value="peso">Bajar de peso</option><option value="embarazo">Buscar embarazo</option><option value="climaterio">Climaterio</option></select></label>' +
        '<label class="campo"><span>Molécula</span><select id="i-mol"><option value="sema">' + MOLECULAS.sema.nombre + '</option><option value="tirze">' + MOLECULAS.tirze.nombre + '</option></select></label>' +
        '<label class="campo"><span>Dosis actual</span><select id="i-dosis">' + opcionesDosis('sema') + '</select></label>' +
        '<label class="campo"><span>Semanas en la dosis actual</span><input id="i-semd" type="number" inputmode="numeric" min="0" step="1"></label>' +
        '<label class="campo"><span>Semanas desde el inicio</span><input id="i-semt" type="number" inputmode="numeric" min="0" step="1"></label>' +
        '<label class="campo"><span>Tolerancia</span><select id="i-tol"><option value="buena">Buena</option><option value="leve">Síntomas digestivos leves</option><option value="no">No tolera</option></select></label>' +
        '<label class="campo"><span>Peso inicial <em class="u">(kg)</em></span><input id="i-pi" type="number" inputmode="decimal" min="0" step="0.1"></label>' +
        '<label class="campo"><span>Peso actual <em class="u">(kg)</em></span><input id="i-pa" type="number" inputmode="decimal" min="0" step="0.1"></label>' +
        '<label class="campo"><span>Talla <em class="u">(cm)</em></span><input id="i-talla" type="number" inputmode="decimal" min="0" step="0.5"></label>' +
        '<label class="campo"><span>Anticoncepción actual</span><select id="i-met"><option value="ninguno">Ninguna</option><option value="oral">Anticonceptivo oral</option><option value="nooral">No oral (DIU, implante, inyectable, parche, anillo)</option><option value="barrera">Solo barrera</option></select></label>' +
      '</div>' +
      '<label class="chk"><input type="checkbox" id="i-com"> Comorbilidad asociada al peso (HTA, DM2, dislipemia, apnea del sueño, SOMP, otra)</label>' +
      '<fieldset class="mrs-grupo"><legend>Contraindicaciones</legend>' + ABSOLUTAS.map(function (a) { return '<label class="chk"><input type="checkbox" data-c="' + a.id + '"> ' + a.txt + '</label>'; }).join('') + '</fieldset>' +
      '<fieldset class="mrs-grupo"><legend>Precauciones</legend>' + CAUTELAS.map(function (a) { return '<label class="chk"><input type="checkbox" data-c="' + a.id + '"> ' + a.txt + '</label>'; }).join('') + '</fieldset>' +
      '<div id="i-out" class="resultados" aria-live="polite"></div>' +
      '<details class="ref"><summary>Estudios basales</summary><ul>' + ESTUDIOS.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></details>' +
      '<details class="ref" open><summary>Signos de alarma: suspender y consultar</summary><ul>' + ALARMAS.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></details>' +
      '<div class="pq-acciones"><a class="btn-sec" href="#mec">Elegibilidad de métodos (MEC)</a><button type="button" class="btn-sec" id="i-limpiar">' + T.app.limpiar + '</button></div>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>' +
      '<p class="cita">Fichas: Wegovy (FDA 2026) <a href="https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b" target="_blank" rel="noopener">DailyMed</a> · Zepbound (FDA) <a href="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b" target="_blank" rel="noopener">DailyMed</a> · Mounjaro (MHRA/EMA, rev. 29/08/2026) <a href="https://www.medicines.org.uk/emc/medicine/44434/spc" target="_blank" rel="noopener">emc</a>. Ver bibliografía completa.</p>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: fichas FDA de Wegovy y Zepbound · ficha británica/EMA de Mounjaro · Sugerencia CaVeSal® en el corte de respuesta</p>';

    var q = function (s) { return cont.querySelector(s); };
    function leer() {
      var contra = {};
      cont.querySelectorAll('input[data-c]').forEach(function (c) { contra[c.getAttribute('data-c')] = c.checked; });
      return { objetivo: q('#i-obj').value, mol: q('#i-mol').value, dosisIdx: Number(q('#i-dosis').value), semanasDosis: q('#i-semd').value,
        semanasTotales: q('#i-semt').value, tolerancia: q('#i-tol').value, pesoIni: q('#i-pi').value, pesoAct: q('#i-pa').value,
        talla: q('#i-talla').value, metodo: q('#i-met').value, comorbilidad: q('#i-com').checked, contra: contra };
    }
    function actualizar() {
      var e = leer(), r = calcular(e), M = MOLECULAS[e.mol], h = [];
      if (r.indicacion) h.push(F('Indicación', 'IMC ' + String(r.imc).replace('.', ',') + ' · <strong>' + r.indicacion.txt + '</strong>', '', r.indicacion.cumple ? 'verde' : 'ambar'));
      if (r.bloqueo) {
        var nombres = ABSOLUTAS.filter(function (a) { return r.absolutas.indexOf(a.id) >= 0; }).map(function (a) { return a.txt; });
        var det = r.absolutas.indexOf('lact') >= 0 ? 'Lactancia: los datos en leche son escasos y de corto plazo; ver guía de Puerperio y lactancia.' : '';
        h.push(F('Contraindicación', '<strong>No iniciar o suspender.</strong> ' + nombres.join(' · '), det, 'rojo'));
      }
      if (r.embarazo) h.push(F('Embarazo durante el tratamiento', '<strong>Suspender ya.</strong> Control prenatal habitual.', 'La exposición no es indicación de interrumpir el embarazo. Ver guía de Embarazo inadvertido durante GLP-1/tirzepatida.', 'rojo'));
      r.cautelas.forEach(function (c) { var a = CAUTELAS.filter(function (x) { return x.id === c; })[0]; h.push(F('Precaución', '<strong>' + a.txt + '</strong>', DETALLE_CAUTELA[c], 'ambar')); });
      var s = r.escalada;
      if (s) {
        var txt, color = 'verde';
        if (s.clave === 'iniciar') txt = 'Iniciar con <strong>' + mg(s.dosis) + '</strong> semanal. Próxima dosis posible: ' + mg(s.sig) + ' desde el ' + fmt(sumarDias(new Date(), 28)) + '.';
        else if (s.clave === 'noTolera') { color = 'ambar'; txt = '<strong>No escalar.</strong> Mantener ' + mg(s.dosis) + (s.anterior ? ' o volver a ' + mg(s.anterior) : '') + ' hasta que tolere.'; }
        else if (s.clave === 'maxima') txt = 'Dosis máxima de mantenimiento: <strong>' + mg(s.dosis) + '</strong>.';
        else if (s.clave === 'esperar') { color = 'ambar'; txt = 'Mantener ' + mg(s.dosis) + '. Próxima escalada a <strong>' + mg(s.sig) + '</strong> desde el ' + fmt(s.fecha) + '.'; }
        else if (s.clave === 'leve') { color = 'ambar'; txt = 'Puede subir a <strong>' + mg(s.sig) + '</strong> desde hoy (' + fmt(s.fecha) + '), o mantener 4 semanas más si los síntomas molestan.'; }
        else txt = 'Subir a <strong>' + mg(s.sig) + '</strong> desde hoy (' + fmt(s.fecha) + ').';
        var nota = e.mol === 'sema' ? 'Escalada: ' + M.dosis.map(mg).join(' → ') + ', cada 4 semanas o más. Si no tolera 2,4 mg, puede mantener 1,7 mg.' : 'Escalada: ' + M.dosis.map(mg).join(' → ') + ', cada 4 semanas o más. Mantenimiento con 5, 10 o 15 mg según respuesta.';
        h.push(F('Escalada de dosis', txt, nota, color));
      }
      if (e.objetivo === 'embarazo' && !r.bloqueo) h.push(F('Escalada de dosis', '<strong>No escalar:</strong> busca embarazo.', 'Planificar la suspensión según la molécula.', 'ambar'));
      if (r.respuesta) {
        var rp = r.respuesta, v = 'Baja de peso: <strong>' + String(rp.pct).replace('.', ',') + ' %</strong>';
        if (!rp.evaluable) h.push(F('Respuesta', v, 'Se evalúa a las 12 semanas de tratamiento.', 'verde'));
        else if (rp.insuficiente) h.push(F('Respuesta', v + ' · <strong>Respuesta insuficiente</strong>', 'Menos de 5 % a las 12 semanas: revisar adherencia, dosis alcanzada y tolerancia antes de decidir (Sugerencia CaVeSal®).', 'ambar'));
        else h.push(F('Respuesta', v + ' · <strong>Respuesta adecuada</strong>', '5 % o más a las 12 semanas.', 'verde'));
      }
      if (r.washout) h.push(F('Washout preconcepcional', '<strong>' + r.washout.txt + '</strong>', 'Si suspende hoy, podría buscar embarazo desde el ' + fmt(r.washout.desde) + '. Al suspender se recupera peso (STEP 4, SURMOUNT-4): planificar con la paciente.', 'ambar'));
      if (r.anticoncepcion) h.push(F('Anticoncepción', r.anticoncepcion.txt, '', r.anticoncepcion.color));
      q('#i-out').innerHTML = h.join('');
    }
    q('#i-mol').addEventListener('change', function () { q('#i-dosis').innerHTML = opcionesDosis(q('#i-mol').value); actualizar(); });
    cont.addEventListener('change', actualizar);
    cont.addEventListener('input', actualizar);
    q('#i-limpiar').addEventListener('click', function () {
      cont.querySelectorAll('input[type=number]').forEach(function (i) { i.value = ''; });
      cont.querySelectorAll('input[type=checkbox]').forEach(function (i) { i.checked = false; });
      cont.querySelectorAll('select').forEach(function (s) { s.selectedIndex = 0; });
      q('#i-dosis').innerHTML = opcionesDosis('sema');
      actualizar();
    });
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.incretinas = { MOLECULAS: MOLECULAS, imc: imc, indicacion: indicacion, escalada: escalada, respuesta: respuesta, calcular: calcular, render: render };
})(window);
