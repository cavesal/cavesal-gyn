/* CaVeSal® GYN · Elección del progestágeno (THM y anticoncepción oral).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  // Tabla propia CaVeSal®: perfil cualitativo por molécula.
  // ae = antiestrogénico endometrial · an = androgénico · aa = antiandrogénico · gc = glucocorticoide · am = antimineralocorticoide
  var GRUPOS = [
    { id: 'nat', nombre: 'Progesterona natural y retroprogesterona' },
    { id: '17oh', nombre: 'Derivados de la 17-OH-progesterona' },
    { id: '19np', nombre: 'Derivados de la 19-norprogesterona' },
    { id: '19nt', nombre: 'Derivados de la 19-nortestosterona' },
    { id: 'esp', nombre: 'Derivado de la espironolactona' },
    { id: 'stear', nombre: 'Esteroide sintético de acción tisular (no es progestágeno puro)' }
  ];
  var MOL = [
    { id: 'p4', g: 'nat', n: 'Progesterona micronizada', ae: '+', an: '−', aa: '±', gc: '+', am: '+', uso: 'THM' },
    { id: 'dyd', g: 'nat', n: 'Didrogesterona', ae: '+', an: '−', aa: '±', gc: '−', am: '±', uso: 'THM' },
    { id: 'cpa', g: '17oh', n: 'Ciproterona (acetato)', ae: '+', an: '−', aa: '++', gc: '+', am: '−', uso: 'AOC' },
    { id: 'cma', g: '17oh', n: 'Clormadinona (acetato)', ae: '+', an: '−', aa: '+', gc: '+', am: '−', uso: 'AOC' },
    { id: 'mpa', g: '17oh', n: 'Medroxiprogesterona (acetato)', ae: '+', an: '±', aa: '−', gc: '+', am: '−', uso: 'THM · inyectable' },
    { id: 'nomac', g: '19np', n: 'Nomegestrol (acetato)', ae: '+', an: '−', aa: '±', gc: '−', am: '−', uso: 'AOC · THM' },
    { id: 'net', g: '19nt', n: 'Noretisterona', ae: '+', an: '+', aa: '−', gc: '−', am: '−', uso: 'AOC · THM' },
    { id: 'lng', g: '19nt', n: 'Levonorgestrel', ae: '+', an: '+', aa: '−', gc: '−', am: '−', uso: 'AOC · DIU · implante' },
    { id: 'dsg', g: '19nt', n: 'Desogestrel / etonogestrel', ae: '+', an: '+', aa: '−', gc: '−', am: '−', uso: 'AOC · píldora sola · implante' },
    { id: 'gsd', g: '19nt', n: 'Gestodeno', ae: '+', an: '+', aa: '−', gc: '+', am: '+', uso: 'AOC' },
    { id: 'dng', g: '19nt', n: 'Dienogest', ae: '+', an: '−', aa: '+', gc: '−', am: '−', uso: 'AOC · endometriosis' },
    { id: 'drsp', g: 'esp', n: 'Drospirenona', ae: '+', an: '−', aa: '+', gc: '−', am: '+', uso: 'AOC · píldora sola · THM' },
    { id: 'tib', g: 'stear', n: 'Tibolona', ae: '+', an: '+', aa: '−', gc: '−', am: '−', uso: 'THM' }
  ];
  // Riesgo de TEV relativo (dato poblacional, no regla individual).
  var TEV_AOC = [
    ['Sin AOC', '2 por 10 000 mujeres por año'],
    ['LNG, noretisterona o norgestimato', '5 a 7 por 10 000'],
    ['Etonogestrel o norelgestromina', '6 a 12 por 10 000'],
    ['Gestodeno, desogestrel o drospirenona', '9 a 12 por 10 000'],
    ['Ciproterona', '1,5 a 2 veces el de LNG']
  ];
  var TEV_THM = [
    ['Progesterona micronizada o derivados de la pregnana con estradiol transdérmico', 'Sin aumento significativo (ESTHER/E3N, observacional)'],
    ['Derivados de la 19-norprogesterona', 'Aumento del riesgo (ESTHER/E3N, observacional)'],
    ['Estrógeno oral', 'Aumento del riesgo frente al transdérmico']
  ];
  var DOSIS_THM = [
    ['Progesterona micronizada', '200 mg/día 12 a 14 días por ciclo', '100 mg/día', 'Con estrógeno en dosis alta: 300 mg cíclica o 200 mg continua. De noche (efecto sedante).'],
    ['Didrogesterona', '10 mg/día 12 a 14 días', '5 mg/día', ''],
    ['Medroxiprogesterona (acetato)', '10 mg/día 12 a 14 días', '2,5 a 5 mg/día', ''],
    ['Noretisterona', '5 mg/día 12 a 14 días', 'Según preparado combinado', ''],
    ['DIU de levonorgestrel 52 mg', '—', 'Protección endometrial 5 años', 'Útil si hay sangrado o intolerancia oral.'],
    ['Tibolona', '—', '2,5 mg/día', 'No se asocia otro progestágeno.']
  ];

  function evaluar(d) {
    var sug = [], evitar = [], orient = [], avisos = [], prim = '';
    var thm = d.uso !== 'aoc';
    if (thm) {
      if (d.sinUtero) {
        return { uso: 'thm', prim: 'Sin útero: estrógeno solo, no necesita progestágeno.', sug: [], evitar: [], orient: [], avisos: ['Excepción: endometriosis previa; evaluar esquema combinado.'], esquema: '' };
      }
      prim = 'Progesterona micronizada o didrogesterona';
      sug.push('Primera elección por menor riesgo de TEV y perfil metabólico neutro.');
      if (d.tev) { sug.push('Riesgo de TEV: progesterona micronizada o didrogesterona con estradiol transdérmico.'); evitar.push('Derivados de la 19-norprogesterona y estrógeno oral.'); avisos.push('TEV previa es contraindicación de THM: confirmar en la Calculadora de THM.'); }
      if (d.hta || d.retencion) { sug.push('HTA o retención hídrica: drospirenona (efecto antimineralocorticoide); la progesterona micronizada también lo tiene.'); prim = d.tev ? prim : 'Drospirenona o progesterona micronizada'; }
      if (d.sangrado) sug.push('Sangrado o miomas: DIU de levonorgestrel 52 mg como protección endometrial.');
      if (d.libido) {
        orient.push('Libido baja: evitar antiandrogénicos fuertes (ciproterona).');
        if (!d.cancerMama && !(d.edad >= 60)) orient.push('La tibolona tiene efecto androgénico y puede ser una opción.');
      }
      if (d.sueno) orient.push('Insomnio: progesterona micronizada de noche por su efecto sedante.');
      if (d.mama) orient.push('Riesgo mamario: la progesterona micronizada y la didrogesterona podrían tener menor riesgo (dato observacional).');
      if (d.cancerMama) evitar.push('Tibolona: contraindicada con cáncer de mama (LIBERATE).');
      if (d.edad >= 60) evitar.push('Tibolona después de los 60 años: el riesgo de ACV supera al beneficio (LIFT).');
      var esquema = d.amenorrea12 ? 'Continuo (más de 12 meses sin menstruación)' : 'Cíclico (perimenopausia o menos de 12 meses sin menstruación)';
      return { uso: 'thm', prim: prim, sug: sug, evitar: evitar, orient: orient, avisos: avisos, esquema: esquema };
    }
    // Anticoncepción oral
    prim = 'Levonorgestrel, noretisterona o norgestimato';
    sug.push('Primera elección por menor riesgo de TEV (EMA).');
    if (d.tev) { prim = 'Sin estrógeno'; sug.push('Riesgo de TEV: píldora de progestágeno solo, implante o DIU.'); evitar.push('Toda anticoncepción combinada: ver categoría en MEC.'); }
    if (d.acne || d.hirsut || d.somp) {
      if (!d.tev) prim = 'Drospirenona, dienogest o clormadinona';
      sug.push('Acné, hirsutismo o SOMP: progestágeno antiandrogénico (drospirenona, dienogest o clormadinona).');
      sug.push('Ciproterona solo en acné moderado a grave o hirsutismo tras fracaso del tratamiento tópico o antibiótico (EMA). Riesgo de TEV 1,5 a 2 veces el de LNG.');
    }
    if (d.retencion) sug.push('Retención hídrica o mastodinia: drospirenona.');
    if (d.hta) avisos.push('HTA: la combinada puede estar contraindicada; ver categoría en MEC.');
    if (d.endometriosis) sug.push('Endometriosis: dienogest (solo o combinado).');
    if (d.sangrado) sug.push('Sangrado abundante o miomas: DIU de levonorgestrel 52 mg.');
    if (d.libido) orient.push('Libido baja: los antiandrogénicos pueden disminuirla; preferir LNG si no hay acné.');
    if (d.sueno) orient.push('Insomnio: sin progestágeno de elección en anticoncepción.');
    if (d.mama) orient.push('Riesgo mamario: ver categoría en MEC.');
    return { uso: 'aoc', prim: prim, sug: sug, evitar: evitar, orient: orient, avisos: avisos, esquema: '' };
  }

  function render(cont, T, opts) {
    var C = w.GYN.comun, F = w.GYN.fertilidad.fila;
    var esFull = !opts || opts.esFull !== false;
    var col = function (v) { return '<td style="text-align:center">' + v + '</td>'; };
    var tabla = '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Molécula</th><th>Antiestrogénico (endometrio)</th><th>Androgénico</th><th>Antiandrogénico</th><th>Glucocorticoide</th><th>Antimineralocorticoide</th><th>Uso</th></tr></thead><tbody>' +
      GRUPOS.map(function (g) {
        return '<tr><th colspan="7" style="text-align:left">' + g.nombre + '</th></tr>' +
          MOL.filter(function (m) { return m.g === g.id; }).map(function (m) { return '<tr><td>' + m.n + '</td>' + col(m.ae) + col(m.an) + col(m.aa) + col(m.gc) + col(m.am) + '<td>' + m.uso + '</td></tr>'; }).join('');
      }).join('') + '</tbody></table></div>' +
      '<p class="etiqueta">++ fuerte · + presente · ± débil · − ausente. Tabla propia CaVeSal® · Basada en: Schindler 2008 · Regidor 2018</p>';
    var tev = '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Anticoncepción combinada</th><th>TEV</th></tr></thead><tbody>' +
      TEV_AOC.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<table class="tabla"><thead><tr><th>THM</th><th>TEV</th></tr></thead><tbody>' +
      TEV_THM.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="etiqueta">Tabla propia CaVeSal® · Basada en: EMA 2014 · EMA 2013 · ESTHER/E3N</p>';
    var dosis = '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Progestágeno</th><th>Cíclica</th><th>Continua</th><th>Nota</th></tr></thead><tbody>' +
      DOSIS_THM.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="etiqueta">Tabla propia CaVeSal® · Basada en: BMS 2026 · Cochrane tibolona 2016 · MHRA</p>';

    cont.innerHTML = '<p class="ayuda">Perfil de cada progestágeno y sugerencia según las características clínicas, para THM o anticoncepción oral. <a href="#thm">Calculadora de THM</a> · <a href="#mec">Anticoncepción: elegibilidad y métodos</a></p>' +
      C.grupo('Contexto', '<div class="grid2">' + C.sel('pg-uso', [['thm', 'Terapia hormonal (climaterio)'], ['aoc', 'Anticoncepción oral']], 'Uso') + C.campo('pg-edad', 'Edad', 'años', '1') + '</div>') +
      C.grupo('Características', C.chk('pg-sinut', 'Sin útero (solo THM)') + C.chk('pg-am12', 'Más de 12 meses sin menstruación (solo THM)') +
        C.chk('pg-hta', 'HTA') + C.chk('pg-ret', 'Retención hídrica, edema o mastodinia') + C.chk('pg-tev', 'Antecedente o riesgo de TEV') +
        C.chk('pg-acne', 'Acné') + C.chk('pg-hir', 'Hirsutismo') + C.chk('pg-somp', 'SOMP') + C.chk('pg-endo', 'Endometriosis') +
        C.chk('pg-sang', 'Sangrado abundante o miomas') + C.chk('pg-cmama', 'Cáncer de mama previo')) +
      C.grupo('Dato orientativo (no suma)', C.chk('pg-lib', 'Libido baja') + C.chk('pg-sue', 'Insomnio') + C.chk('pg-mama', 'Preocupación por riesgo mamario')) +
      '<div id="pg-o" class="resultados" aria-live="polite"></div>' +
      F('Perfil farmacológico', tabla, '', 'neutro') + F('Riesgo de TEV', tev, '', 'neutro') + F('Dosis en THM', dosis, '', 'neutro') +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: BMS 2026 · EMA 2013 y 2014 · ESTHER/E3N · Schindler 2008 · Regidor 2018 · LIBERATE · LIFT</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = C.lector(cont);
    function act() {
      var d = { uso: L.v('pg-uso'), edad: L.n('pg-edad'), sinUtero: L.c('pg-sinut'), amenorrea12: L.c('pg-am12'), hta: L.c('pg-hta'), retencion: L.c('pg-ret'),
        tev: L.c('pg-tev'), acne: L.c('pg-acne'), hirsut: L.c('pg-hir'), somp: L.c('pg-somp'), endometriosis: L.c('pg-endo'), sangrado: L.c('pg-sang'),
        cancerMama: L.c('pg-cmama'), libido: L.c('pg-lib'), sueno: L.c('pg-sue'), mama: L.c('pg-mama') };
      var r = evaluar(d), h = [];
      if (!esFull) h.push(opts.bloqueo('Sugerencia de progestágeno en la versión completa'));
      else {
        h.push(F('Sugerencia', '<strong>' + r.prim + '</strong>' + (r.sug.length ? C.ul(r.sug) : ''), (r.esquema ? 'Esquema: ' + r.esquema + '. ' : '') + 'Sugerencia CaVeSal®.', 'verde'));
        if (r.evitar.length) h.push(F('Evitar', C.ul(r.evitar), '', 'rojo'));
        if (r.avisos.length) h.push(F('Aviso', C.ul(r.avisos), '', 'ambar'));
        if (r.orient.length) h.push(F('Dato orientativo', C.ul(r.orient), 'No modifica la sugerencia.', 'neutro'));
      }
      cont.querySelector('#pg-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.progestagenos = { evaluar: evaluar, render: render, MOL: MOL, GRUPOS: GRUPOS, DOSIS_THM: DOSIS_THM };
})(window);
