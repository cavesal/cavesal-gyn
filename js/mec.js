/* CaVeSal® GYN · Elegibilidad de métodos anticonceptivos (MEC).
   Tabla adaptada (traducida) de: CDC. U.S. Medical Eligibility Criteria for Contraceptive Use, 2024.
   MMWR Recomm Rep 2024;73(No. RR-4):1-126 · Dominio público (gobierno de EE. UU.).
   Algoritmo propio CaVeSal® · Basado en: US MEC 2024 · OMS MEC 6.ª ed. 2025 (solo notas de texto, sin su tabla) ·
   SIC (Cagnacci A et al.) Eur J Contracept Reprod Health Care 2025;30:304-318 · FSRH Contraception for women aged over 40 (2017, enmienda 2023) ·
   ANMAT DI-2025-79202301 (implante 5 años) · FDA, prospecto de Mounjaro 08/2026 y de Ozempic 05/2026 · FSRH CHC 2019 (actualización 2023) ·
   OMS 2026 (uso extendido y continuo, implante 5 años, mifepristona de emergencia) · US MEC 2024 apéndices E, F, I y J.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  // Orden de métodos: DIU de cobre, DIU-LNG, implante, AMPD (inyectable trimestral), píldora solo progestágeno, anticonceptivo hormonal combinado.
  var METODOS = ['cu', 'lng', 'imp', 'ampd', 'pop', 'ahc'];

  // Celdas: '1'..'4' · '*' = aclaración en la guía completa · '-' = no aplica · 'NA' = no corresponde (embarazo)
  // 'a>b' = iniciación a / continuación b · 'a~b' = a o b según gravedad (ver aclaración).
  var C = [
    // Características personales e historia reproductiva
    ['personal', 'embarazo', [['si', ['4*', '4*', 'NA', 'NA', 'NA', 'NA']]]],
    ['personal', 'paridad', [['nulipara', ['2', '2', '1', '1', '1', '1']], ['multipara', ['1', '1', '1', '1', '1', '1']]]],
    ['personal', 'lactancia', [
      ['l21', ['-', '-', '2*', '2*', '2*', '4*']],
      ['l21_30', ['-', '-', '2*', '2*', '2*', '3*']],
      ['l30_42r', ['-', '-', '1*', '2*', '1*', '3*']],
      ['l30_42', ['-', '-', '1*', '1*', '1*', '2*']],
      ['l42', ['-', '-', '1*', '1*', '1*', '2*']]]],
    ['personal', 'posparto', [
      ['p21', ['-', '-', '1', '2', '1', '4']],
      ['p21_42r', ['-', '-', '1', '2', '1', '3*']],
      ['p21_42', ['-', '-', '1', '1', '1', '2']],
      ['p42', ['-', '-', '1', '1', '1', '1']]]],
    ['personal', 'diuPosparto', [
      ['d10min', ['2*', '2*', '-', '-', '-', '-']],
      ['d10m4s', ['2*', '2*', '-', '-', '-', '-']],
      ['d4s', ['1*', '1*', '-', '-', '-', '-']],
      ['sepsis', ['4', '4', '-', '-', '-', '-']]]],
    ['personal', 'postaborto', [
      ['t1q', ['1*', '1*', '1*', '1*', '1*', '1*']],
      ['t1m', ['1*', '1*', '1*', '1~2*', '1*', '1*']],
      ['t1e', ['1*', '1*', '1*', '1*', '1*', '1*']],
      ['t2', ['2*', '2*', '1*', '1*', '1*', '1*']],
      ['septico', ['4', '4', '1*', '1*', '1*', '1*']]]],
    ['personal', 'ectopico', [['si', ['1', '1', '1', '1', '2', '1']]]],
    ['personal', 'tabaco', [['menor35', ['1', '1', '1', '1', '1', '2']], ['mayor35menos15', ['1', '1', '1', '1', '1', '3']], ['mayor35mas15', ['1', '1', '1', '1', '1', '4']]]],
    ['personal', 'obesidad', [['imc30', ['1', '1', '1', '1', '1', '2*']], ['imc30menor18', ['1', '1', '1', '2', '1', '2*']]]],
    ['personal', 'bariatrica', [['restrictiva', ['1', '1', '1', '1', '1', '1']], ['malabsortiva', ['1', '1', '1', '1', '3', '3']]]],
    ['personal', 'cirugiaPelvica', [['si', ['1', '1', '1', '1', '1', '1']]]],
    ['personal', 'cirugia', [['menor', ['1', '1', '1', '1', '1', '1']], ['mayorSin', ['1', '1', '1', '1', '1', '2']], ['mayorCon', ['1', '1', '1', '2', '1', '4']]]],
    // Cardiovascular
    ['cv', 'multiplesFr', [['si', ['1', '2', '2*', '3*', '2*', '3~4*']]]],
    ['cv', 'hta', [
      ['controlada', ['1*', '1*', '1*', '2*', '1*', '3*']],
      ['h140', ['1*', '1*', '1*', '2*', '1*', '3*']],
      ['h160', ['1*', '2*', '2*', '3*', '2*', '4*']],
      ['vascular', ['1*', '2*', '2*', '3*', '2*', '4*']]]],
    ['cv', 'htaEmbarazo', [['si', ['1', '1', '1', '1', '1', '2']]]],
    ['cv', 'tev', [
      ['anticoagTerap', ['2*', '2*', '2*', '2*', '2*', '3*']],
      ['profAlto', ['2*', '2*', '2*', '3*', '2*', '4*']],
      ['profBajo', ['2*', '2*', '2*', '2*', '2*', '3*']],
      ['sinAltoRiesgo', ['1', '2', '2', '3', '2', '4']],
      ['sinBajoRiesgo', ['1', '2', '2', '2', '2', '3']],
      ['familiar', ['1', '1', '1', '1', '1', '2']]]],
    ['cv', 'trombofilia', [['si', ['1*', '2*', '2*', '3*', '2*', '4*']]]],
    ['cv', 'venasSup', [['varices', ['1', '1', '1', '1', '1', '1']], ['tvs', ['1', '1', '1', '2', '1', '3*']]]],
    ['cv', 'isquemica', [['si', ['1', '2>3', '2>3', '3', '2>3', '4']]]],
    ['cv', 'acv', [['si', ['1', '2', '2>3', '3', '2>3', '4']]]],
    ['cv', 'valvular', [['nocomp', ['1', '1', '1', '1', '1', '2']], ['comp', ['1', '1', '1', '2', '1', '4']]]],
    ['cv', 'mcpp', [['leveMenos6', ['2', '2', '1', '2', '1', '4']], ['leveMas6', ['2', '2', '1', '2', '1', '3']], ['moderada', ['2', '2', '2', '3', '2', '4']]]],
    // Renal
    ['renal', 'erc', [['nefrotico', ['1', '2', '2', '3', '2*', '4']], ['hemodialisis', ['1', '2', '2', '3', '2*', '4']], ['peritoneal', ['2>1', '2', '2', '3', '2*', '4']]]],
    // Reumatológicas
    ['reuma', 'les', [['aaf', ['1*', '2*', '2*', '3*', '2*', '4*']], ['trombocitopenia', ['3*>2*', '2*', '2*', '3*>2*', '2*', '2*']], ['inmuno', ['2*>1*', '2*', '2*', '2*', '2*', '2*']], ['ninguno', ['1*', '2*', '2*', '2*', '2*', '2*']]]],
    ['reuma', 'ar', [['sinInmuno', ['1', '1', '1', '2', '1', '2']], ['conInmuno', ['2>1', '2>1', '1', '2~3*', '1', '2']]]],
    // Neurológicas y psiquiátricas
    ['neuro', 'cefalea', [['noMigrana', ['1', '1', '1', '1', '1', '1*']], ['migranaSin', ['1', '1', '1', '1', '1', '2*']], ['migranaCon', ['1', '1', '1', '1', '1', '4*']]]],
    ['neuro', 'epilepsia', [['si', ['1', '1', '1*', '1*', '1*', '1*']]]],
    ['neuro', 'em', [['sinInmov', ['1', '1', '1', '2', '1', '1']], ['conInmov', ['1', '1', '1', '2', '1', '3']]]],
    ['neuro', 'depresion', [['si', ['1*', '1*', '1*', '1*', '1*', '1*']]]],
    // Tracto reproductivo
    ['repro', 'sangrado', [['irregular', ['1', '1', '2', '2', '2', '1']], ['abundante', ['2*', '1*>2*', '2*', '2*', '2*', '1*']]]],
    ['repro', 'sangradoInexplicado', [['si', ['4*>2*', '4*>2*', '3*', '3*', '2*', '2*']]]],
    ['repro', 'endometriosis', [['si', ['2', '1', '1', '1', '1', '1']]]],
    ['repro', 'tumorOvarico', [['si', ['1', '1', '1', '1', '1', '1']]]],
    ['repro', 'dismenorrea', [['si', ['2', '1', '1', '1', '1', '1']]]],
    ['repro', 'etg', [
      ['sosp1t', ['1*', '1*', '1*', '1*', '1*', '1*']], ['sosp2t', ['2*', '2*', '1*', '1*', '1*', '1*']],
      ['hcgNeg', ['1*', '1*', '1*', '1*', '1*', '1*']], ['hcgBaja', ['2*>1*', '2*>1*', '1*', '1*', '1*', '1*']],
      ['persistSin', ['2*>1*', '2*>1*', '1*', '1*', '1*', '1*']], ['persistCon', ['4*>2*', '4*>2*', '1*', '1*', '1*', '1*']]]],
    ['repro', 'ectropion', [['si', ['1', '1', '1', '1', '1', '1']]]],
    ['repro', 'cin', [['si', ['1', '2', '2', '2', '1', '2']]]],
    ['repro', 'cancerCervix', [['si', ['4>2', '4>2', '2', '2', '1', '2']]]],
    ['repro', 'mama', [['nodulo', ['1', '2*', '2*', '2*', '2*', '2*']], ['benigna', ['1', '1', '1', '1', '1', '1']], ['familiar', ['1', '1', '1', '1', '1', '1']], ['actual', ['1', '4', '4', '4', '4', '4']], ['previo5', ['1', '3', '3', '3', '3', '3']]]],
    ['repro', 'hiperplasia', [['si', ['1', '1', '1', '1', '1', '1']]]],
    ['repro', 'cancerEndometrio', [['si', ['4>2', '4>2', '1', '1', '1', '1']]]],
    ['repro', 'cancerOvario', [['si', ['1', '1', '1', '1', '1', '1']]]],
    ['repro', 'miomas', [['si', ['2', '2', '1', '1', '1', '1']]]],
    ['repro', 'anatomia', [['distorsion', ['4', '4', '-', '-', '-', '-']], ['otras', ['2', '2', '-', '-', '-', '-']]]],
    ['repro', 'epi', [['actual', ['4>2*', '4>2*', '1', '1', '1', '1']], ['pasadaCon', ['1', '1', '1', '1', '1', '1']], ['pasadaSin', ['2', '2', '1', '1', '1', '1']]]],
    ['repro', 'its', [['cervicitis', ['4>2*', '4>2*', '1', '1', '1', '1']], ['vaginitis', ['2', '2', '1', '1', '1', '1']], ['otros', ['2*>2', '2*>2', '1', '1', '1', '1']]]],
    // VIH
    ['vih', 'riesgoVih', [['si', ['1*', '1*', '1', '1', '1', '1']]]],
    ['vih', 'vih', [['bien', ['1', '1', '1*', '1*', '1*', '1*']], ['noBien', ['2>1', '2>1', '1*', '1*', '1*', '1*']]]],
    // Otras infecciones
    ['infec', 'tbc', [['noPelvica', ['1', '1', '1*', '1*', '1*', '1*']], ['pelvica', ['4>3', '4>3', '1*', '1*', '1*', '1*']]]],
    ['infec', 'esquisto', [['nocomp', ['1', '1', '1', '1', '1', '1']], ['fibrosis', ['1', '1', '1', '1', '1', '1']]]],
    ['infec', 'malaria', [['si', ['1', '1', '1', '1', '1', '1']]]],
    // Endocrinas
    ['endo', 'diabetes', [['gestacional', ['1', '1', '1', '1', '1', '1']], ['noVascNoInsu', ['1', '2', '2', '2', '2', '2']], ['noVascInsu', ['1', '2', '2', '2', '2', '2']], ['organoBlanco', ['1', '2', '2', '3', '2', '3~4*']], ['vasc20', ['1', '2', '2', '3', '2', '3~4*']]]],
    ['endo', 'tiroides', [['bocio', ['1', '1', '1', '1', '1', '1']], ['hiper', ['1', '1', '1', '1', '1', '1']], ['hipo', ['1', '1', '1', '1', '1', '1']]]],
    // Gastrointestinales
    ['gi', 'eii', [['si', ['1', '1', '1', '2', '2', '2~3*']]]],
    ['gi', 'vesicula', [['asinto', ['1', '2', '2', '2', '2', '2']], ['actual', ['1', '2', '2', '2', '2', '3']], ['colecistectomia', ['1', '2', '2', '2', '2', '2']], ['medica', ['1', '2', '2', '2', '2', '3']]]],
    ['gi', 'colestasis', [['embarazo', ['1', '1', '1', '1', '1', '2']], ['aoc', ['1', '2', '2', '2', '2', '3']]]],
    ['gi', 'hepatitis', [['aguda', ['1', '1', '1', '1', '1', '3~4*>2']], ['cronica', ['1', '1', '1', '1', '1', '1']]]],
    ['gi', 'cirrosis', [['compensada', ['1', '1', '1', '1', '1', '1']], ['descompensada', ['1', '2', '2', '3', '2', '4']]]],
    ['gi', 'tumorHepatico', [['hnf', ['1', '2', '2', '2', '2', '2']], ['adenoma', ['1', '2', '2', '3', '2', '4']], ['maligno', ['1', '3', '3', '3', '3', '4']]]],
    // Respiratorias y hematológicas
    ['resp', 'fq', [['si', ['1*', '1*', '1*', '2*', '1*', '1*']]]],
    ['hemato', 'talasemia', [['si', ['2', '1', '1', '1', '1', '1']]]],
    ['hemato', 'falciforme', [['si', ['2', '1', '1', '2~3*', '1', '4']]]],
    ['hemato', 'ferropenia', [['si', ['2', '1', '1', '1', '1', '1']]]],
    ['hemato', 'trasplante', [['sinFalla', ['1', '1', '2', '2~3*', '2', '2*']], ['falla', ['2>1', '2>1', '2', '2~3*', '2', '4']]]],
    // Otras situaciones (solo cambian barrera, naturales o emergencia: US MEC 2024, apéndices E, F y J)
    ['otros', 'violacion', [['si', ['-', '-', '-', '-', '-', '-']]]],
    ['otros', 'alergiaLatex', [['si', ['-', '-', '-', '-', '-', '-']]]],
    ['otros', 'sst', [['si', ['-', '-', '-', '-', '-', '-']]]],
    ['otros', 'itu', [['si', ['-', '-', '-', '-', '-', '-']]]],
    ['otros', 'drogasCiclo', [['si', ['-', '-', '-', '-', '-', '-']]]],
    ['otros', 'fiebre', [['aguda', ['-', '-', '-', '-', '-', '-']], ['cronica', ['-', '-', '-', '-', '-', '-']]]],
    // Interacciones
    ['inter', 'arv', [
      ['inti', ['1~2*>1*', '1~2*>1*', '1', '1', '1', '1']],
      ['efavirenz', ['1~2*>1*', '1~2*>1*', '2*', '1*', '2*', '2*']],
      ['nnrtiOtros', ['1~2*>1*', '1~2*>1*', '1', '1', '1', '1']],
      ['ipr', ['1~2*>1*', '1~2*>1*', '2*', '1*', '2*', '2*']],
      ['lopinavir', ['1~2*>1*', '1~2*>1*', '1', '1', '1', '1']],
      ['atazanavir', ['1~2*>1*', '1~2*>1*', '1', '1', '1', '2*']],
      ['fosamprenavir', ['1~2*>1*', '1~2*>1*', '2*', '2*', '2*', '3*']],
      ['nelfinavir', ['1~2*>1*', '1~2*>1*', '2*', '1*', '2*', '2*']],
      ['otrosArv', ['1~2*>1*', '1~2*>1*', '1', '1', '1', '1']]]],
    ['inter', 'anticonvulsivantes', [['inductores', ['1', '1', '2*', '1*', '3*', '3*']], ['lamotrigina', ['1', '1', '1', '1', '1', '3*']]]],
    ['inter', 'antimicrobianos', [['rifampicina', ['1', '1', '2*', '1*', '3*', '3*']], ['otros', ['1', '1', '1', '1', '1', '1']]]],
    ['inter', 'psico', [['isrs', ['1', '1', '1', '1', '1', '1']], ['hiperico', ['1', '1', '2', '1', '2', '2']]]]
  ];
  var GRUPOS = ['personal', 'cv', 'renal', 'reuma', 'neuro', 'repro', 'vih', 'infec', 'endo', 'gi', 'resp', 'hemato', 'otros', 'inter'];

  // Notas OMS 2025 (texto, sin su tabla): condición → clave de nota.
  var NOTAS_OMS = { lactancia: 'ampdLactancia', posparto: 'ampdPosparto', arv: 'arv', riesgoVih: 'prep', eii: 'eii' };

  function edadFila(e) {
    if (e === null) return null;
    return [e < 20 ? '2' : '1', e < 20 ? '2' : '1', '1', (e < 18 || e > 45) ? '2' : '1', '1', e >= 40 ? '2' : '1'];
  }

  // Interpreta una celda según el uso (iniciación o continuación).
  function celda(s, uso) {
    if (s === '-' || s === 'NA') return { cat: null, txt: s === 'NA' ? 'NA' : '—', na: true };
    var p = s.split('>'), x = (uso === 'continuacion' && p[1]) ? p[1] : p[0];
    var star = x.indexOf('*') >= 0; x = x.replace(/\*/g, '');
    var r = x.split('~').map(Number);
    return { cat: Math.max.apply(null, r), min: Math.min.apply(null, r), txt: r.join('–'), aclaracion: star, rango: r.length > 1, ic: p.length > 1 };
  }

  function buscar(id) { for (var i = 0; i < C.length; i++) if (C[i][1] === id) return C[i]; return null; }

  // d: { edad, uso:'iniciacion'|'continuacion', sel: {condId: subId}, tirzepatida, mas40:{sangrado, irregular, hueso}, metodoActual, amenorreaMeses, fsh30 }
  function calcular(d) {
    var filas = [], ef = edadFila(d.edad);
    if (ef) filas.push({ id: 'edad', sub: null, celdas: ef });
    Object.keys(d.sel || {}).forEach(function (id) {
      var c = buscar(id), sub = d.sel[id]; if (!c || !sub) return;
      for (var j = 0; j < c[2].length; j++) if (c[2][j][0] === sub) filas.push({ id: id, sub: sub, celdas: c[2][j][1] });
    });
    var res = {};
    METODOS.forEach(function (m, k) {
      var peor = null, por = [], na = false, acl = false, aplica = 0;
      filas.forEach(function (f) {
        var v = celda(f.celdas[k], d.uso);
        if (v.na) { if (f.celdas[k] === 'NA') na = true; return; }
        aplica++;
        if (peor === null || v.cat > peor.cat) { peor = v; por = [{ id: f.id, sub: f.sub, v: v }]; }
        else if (v.cat === peor.cat && v.cat >= 2) por.push({ id: f.id, sub: f.sub, v: v });
      });
      acl = por.some(function (p) { return p.v.aclaracion; });
      res[m] = { cat: na || !aplica ? null : peor.cat, txt: na ? 'NA' : (peor ? peor.txt : ''), por: peor && peor.cat >= 2 ? por : [], aclaracion: acl, embarazo: na };
    });
    var notasOms = [];
    Object.keys(d.sel || {}).forEach(function (id) { if (d.sel[id] && NOTAS_OMS[id] && notasOms.indexOf(NOTAS_OMS[id]) < 0) notasOms.push(NOTAS_OMS[id]); });
    var alertas = [];
    var inc = d.incretina || (d.tirzepatida ? 'tirz_inicio' : '');
    if (inc === 'tirz_inicio' || inc === 'tirz_aumento') alertas.push('tirzepatida');
    else if (inc === 'tirz_estable') alertas.push('tirzEstable');
    else if (inc === 'sema' || inc === 'otra') alertas.push('glp1');
    var ext = extras(d);
    return { metodos: res, barrera: ext.barrera, naturales: ext.naturales, emergencia: ext.emergencia, esterilizacion: ext.esterilizacion, filas: filas.length, notasOms: notasOms, alertas: alertas, mas40: d.edad !== null && d.edad >= 40 ? mas40(d) : null, suspension: d.edad !== null && d.edad >= 40 ? suspension(d) : null };
  }

  // ===== Barrera, naturales, emergencia y esterilización =====
  // Reglas: [condición, subopciones (null = cualquiera), valores por columna]. Lo no listado es 1 (o A).
  // Tabla adaptada (traducida) de: US MEC 2024, apéndice E (barrera), F (conocimiento de la fertilidad) y J (emergencia). Dominio público.
  var POSP6 = ['l21', 'l21_30', 'l30_42r', 'l30_42'];
  var BAR = {
    cols: ['condon', 'condonInt', 'esperm', 'diaf'],
    reglas: [
      ['embarazo', null, { condon: 'NA', condonInt: 'NA', esperm: 'NA', diaf: 'NA' }],
      ['paridad', ['multipara'], { diaf: 2 }],
      ['lactancia', POSP6, { diaf: 'NA' }],
      ['posparto', ['p21', 'p21_42r', 'p21_42'], { diaf: 'NA' }],
      ['cancerCervix', null, { esperm: 2 }],
      ['valvular', ['comp'], { diaf: 2 }],
      ['riesgoVih', null, { esperm: 4, diaf: 4 }],
      ['vih', null, { esperm: 3, diaf: 3 }],
      ['sst', null, { diaf: 3 }],
      ['itu', null, { diaf: 2 }],
      ['anatomia', null, { diaf: 'NA' }],
      ['alergiaLatex', null, { condon: 3, diaf: 3 }]
    ]
  };
  var FAB = {
    cols: ['sin', 'cal'],
    reglas: [
      ['embarazo', null, { sin: 'NA', cal: 'NA' }],
      ['lactancia', POSP6, { sin: 'D', cal: 'D' }],
      ['lactancia', ['l42'], { sin: 'C', cal: 'D' }],
      ['posparto', ['p21'], { sin: 'D', cal: 'D' }],
      ['posparto', ['p21_42r', 'p21_42', 'p42'], { sin: 'A', cal: 'D' }],
      ['postaborto', null, { sin: 'C', cal: 'D' }],
      ['sangrado', ['irregular'], { sin: 'D', cal: 'D' }],
      ['sangradoInexplicado', null, { sin: 'D', cal: 'D' }],
      ['its', ['cervicitis', 'vaginitis'], { sin: 'D', cal: 'A' }],
      ['drogasCiclo', null, { sin: 'C~D', cal: 'C~D' }],
      ['fiebre', ['cronica'], { sin: 'C', cal: 'A' }],
      ['fiebre', ['aguda'], { sin: 'D', cal: 'A' }]
    ]
  };
  var INDUCTORES = [['anticonvulsivantes', ['inductores']], ['antimicrobianos', ['rifampicina']], ['psico', ['hiperico']], ['arv', ['efavirenz']]];
  var AE = {
    cols: ['cu', 'upa', 'lng', 'yuzpe'],
    reglas: [
      ['embarazo', null, { cu: 4, upa: 'NA', lng: 'NA', yuzpe: 'NA' }],
      ['obesidad', null, { upa: 2, lng: 2, yuzpe: 2 }],
      ['isquemica', null, { upa: 2, lng: 2, yuzpe: 2 }],
      ['acv', null, { upa: 2, lng: 2, yuzpe: 2 }],
      ['tev', ['anticoagTerap', 'profAlto', 'profBajo', 'sinAltoRiesgo', 'sinBajoRiesgo'], { upa: 2, lng: 2, yuzpe: 2 }],
      ['ar', ['conInmuno'], { cu: 2 }],
      ['cefalea', ['migranaSin', 'migranaCon'], { yuzpe: 2 }],
      ['hepatitis', ['aguda'], { upa: 2, lng: 2, yuzpe: 2 }],
      ['cirrosis', ['descompensada'], { upa: 2, lng: 2, yuzpe: 2 }],
      ['tumorHepatico', ['adenoma', 'maligno'], { upa: 2, lng: 2, yuzpe: 2 }],
      ['trasplante', ['falla'], { cu: 2 }],
      ['violacion', null, { cu: 2 }]
    ].concat(INDUCTORES.map(function (x) { return [x[0], x[1], { upa: 2, lng: 2, yuzpe: 2 }]; }))
  };
  // Esterilización femenina: el US MEC no clasifica (apéndice I). Resumen propio CaVeSal® de los criterios A/C/D/S de la OMS, en texto.
  var EST = [
    ['D', 'embarazo', null], ['D', 'diuPosparto', ['sepsis']], ['D', 'postaborto', ['septico']], ['D', 'epi', ['actual']], ['D', 'its', ['cervicitis']],
    ['D', 'sangradoInexplicado', null], ['D', 'cancerCervix', null], ['D', 'cancerEndometrio', null], ['D', 'cancerOvario', null], ['D', 'etg', ['persistCon']],
    ['D', 'tev', ['anticoagTerap']], ['D', 'cirugia', ['mayorCon']], ['D', 'fiebre', ['aguda']],
    ['S', 'hta', ['h160', 'vascular']], ['S', 'valvular', ['comp']], ['S', 'diabetes', ['organoBlanco', 'vasc20']], ['S', 'cirrosis', ['descompensada']],
    ['S', 'tbc', ['pelvica']], ['S', 'endometriosis', null], ['S', 'vih', ['noBien']], ['S', 'les', ['aaf', 'trombocitopenia']],
    ['C', 'obesidad', null], ['C', 'hta', ['controlada', 'h140']], ['C', 'acv', null], ['C', 'isquemica', null], ['C', 'diabetes', ['noVascNoInsu', 'noVascInsu']],
    ['C', 'epilepsia', null], ['C', 'depresion', null], ['C', 'miomas', null], ['C', 'mama', ['actual']], ['C', 'ferropenia', null], ['C', 'talasemia', null],
    ['C', 'falciforme', null], ['C', 'les', ['inmuno', 'ninguno']]
  ];
  var RANGO_L = { A: 1, C: 2, S: 3, D: 4 };
  function tocaRegla(sel, r) { var v = sel[r[0]]; return !!v && (!r[1] || r[1].indexOf(v) >= 0); }
  function tabla(T, sel, num) {
    var out = {};
    T.cols.forEach(function (k) { out[k] = { cat: num ? 1 : 'A', por: [], na: false }; });
    T.reglas.forEach(function (r) {
      if (!tocaRegla(sel, r)) return;
      Object.keys(r[2]).forEach(function (k) {
        var v = r[2][k], o = out[k];
        if (v === 'NA') { o.na = true; o.por.push(r[0]); return; }
        var peor = String(v).split('~').pop();
        var val = num ? v : peor, ant = num ? o.cat : o.cat;
        var mayor = num ? v > ant : RANGO_L[peor] > RANGO_L[String(ant).split('~').pop()];
        if (mayor) { o.cat = v; o.por = [r[0]]; } else if (String(v) === String(ant) && (num ? v >= 2 : v !== 'A')) o.por.push(r[0]);
      });
    });
    T.cols.forEach(function (k) { if (out[k].na) { out[k].cat = 'NA'; } });
    return out;
  }
  function extras(d) {
    var sel = d.sel || {}, fab = tabla(FAB, sel, false);
    if (d.edad !== null && d.edad !== undefined && (d.edad < 18 || d.edad >= 45) && !sel.embarazo) {
      ['sin', 'cal'].forEach(function (k) { var o = fab[k]; if (o.cat !== 'NA' && RANGO_L[String(o.cat).split('~').pop()] < 2) { o.cat = 'C'; o.por = [d.edad < 18 ? 'menarca' : 'perimenopausia']; } });
    }
    var est = { cat: 'A', por: [] };
    EST.forEach(function (r) {
      if (!tocaRegla(sel, [r[1], r[2]])) return;
      if (RANGO_L[r[0]] > RANGO_L[est.cat]) { est.cat = r[0]; est.por = [r[1]]; } else if (r[0] === est.cat) est.por.push(r[1]);
    });
    return { barrera: tabla(BAR, sel, true), naturales: fab, emergencia: tabla(AE, sel, true), esterilizacion: est };
  }

  // Más de 40 años: consenso SIC 2025 (prioridades según objetivo).
  function mas40(d) {
    var o = d.mas40 || {}, r = { base: true, extra: [] };
    if (o.sangrado) r.extra.push('sangrado');
    if (o.irregular) r.extra.push('irregular');
    if (o.hueso) r.extra.push('hueso');
    if (o.sexualidad) r.extra.push('sexualidad');
    return r;
  }

  // Cuándo suspender la anticoncepción y pasar a THM (FSRH 2017/2023).
  function suspension(d) {
    var e = d.edad, m = d.metodoActual, am = d.amenorreaMeses;
    if (e >= 55) return { clave: 'suspender55' };
    if (m === 'ahc') return { clave: e >= 50 ? 'ahc50' : 'ahcMenos50' };
    if (m === 'ampd') return { clave: e >= 50 ? 'ampd50' : 'ampdMenos50' };
    if (m === 'pop' || m === 'imp' || m === 'lng') {
      if (e < 50) return { clave: 'pocMenos50' };
      if (d.fsh30 === 'si') return { clave: 'pocFshAlta' };
      if (d.fsh30 === 'no') return { clave: 'pocFshBaja' };
      return { clave: 'pocFsh' };
    }
    if (m === 'ninguno' || m === 'cu' || m === 'barrera') {
      if (am === null) return { clave: 'faltaAmenorrea' };
      if (e >= 50) return { clave: am >= 12 ? 'noHormonalSuspender' : 'noHormonal50' };
      return { clave: am >= 24 ? 'noHormonalSuspender' : 'noHormonalMenos50' };
    }
    return { clave: 'elegirMetodo' };
  }

  function num(v) { if (v === '' || v === null || v === undefined) return null; var n = Number(String(v).replace(',', '.')); return isFinite(n) ? n : null; }

  // ===== Vista unificada: elegibilidad y métodos (opción A) =====
  var X = {
    cat: {
      1: ['Sin restricción', 'Se puede usar en cualquier circunstancia.'],
      2: ['Las ventajas superan los riesgos', 'En general se puede usar.'],
      3: ['Los riesgos superan las ventajas', 'No se recomienda, salvo que no haya otro método disponible o aceptable.'],
      4: ['Riesgo inaceptable', 'No usar.']
    },
    letras: {
      A: 'Aceptar', C: 'Precaución', D: 'Diferir', S: 'Situación especial', NA: 'No corresponde'
    },
    porExtra: { menarca: 'Adolescencia con ciclos todavía irregulares tras la menarca', perimenopausia: 'Perimenopausia (ciclos que cambian)' },
    familiaNota: {
      comb: 'Todos los combinados (píldora, parche, anillo e inyectable mensual) comparten la misma categoría del US MEC.',
      lact: 'Métodos pensados para la lactancia. El anillo de progesterona y el spray no tienen categoría en el US MEC 2024.',
      barrera: 'US MEC 2024, apéndice E: todo lo no indicado es categoría 1. Única protección contra las ITS: el preservativo.',
      emerg: 'US MEC 2024, apéndice J. La lactancia, el ectópico previo y el uso repetido no restringen la píldora de emergencia.',
      ester: 'El US MEC no clasifica la esterilización (apéndice I): ninguna condición la contraindica de forma absoluta, salvo alergia a los materiales. Las letras A/C/D/S son un resumen propio de los criterios de la OMS.',
      natural: 'US MEC 2024, apéndice F: A = aceptar, C = precaución (más asesoría y seguimiento), D = diferir hasta que se resuelva la condición.'
    }
  };
  // Formas de uso de los combinados: FSRH CHC 2019 (actualización 2023), tabla 1; límites OMS 2026.
  var FORMAS = '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Forma de uso</th><th>Esquema</th></tr></thead><tbody>' +
    '<tr><td>Secuencial estándar</td><td>21 días activos + 7 de pausa (o 24/4 con placebo)</td></tr>' +
    '<tr><td>Secuencial con pausa acortada</td><td>21 días activos + 4 de pausa</td></tr>' +
    '<tr><td>Extendido fijo (tricycling)</td><td>9 semanas seguidas (3 envases, parches o anillos) + 4 o 7 días de pausa</td></tr>' +
    '<tr><td>Extendido flexible</td><td>Uso continuo de al menos 21 días hasta que aparezca un sangrado de 3 a 4 días; entonces, pausa de 4 días</td></tr>' +
    '<tr><td>Continuo</td><td>Sin pausa</td></tr></tbody></table></div>' +
    '<p class="ayuda">FSRH 2023: los esquemas a medida se usan fuera de prospecto, solo con preparados monofásicos y omitiendo las píldoras placebo. OMS 2026: extendido hasta 6 meses seguidos o continuo hasta 1 año, luego reevaluar.</p>';
  var FORMAS_IDS = ['aoc', 'aoce4', 'parche', 'anillo'];

  function badge(c, t) {
    if (c === null || c === undefined) return '<span class="mec-c cNA">—</span>';
    var s = String(c), k = s === 'NA' ? 'NA' : s.split('~').pop().split('–').pop();
    return '<span class="mec-c c' + k + '">' + (t || s.replace('~', ' o ')) + '</span>';
  }
  function filaColor(c) {
    var s = String(c).split('~').pop().split('–').pop();
    return { 1: 'verde', 2: 'verdeclaro', 3: 'ambar', 4: 'rojo', A: 'verde', C: 'ambar', D: 'rojo', S: 'violeta' }[s] || 'neutro';
  }
  function norm(x) { return String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function render(cont, T, opts) {
    var t = T.mec, MT = w.GYN.metodos, esFull = !opts || opts.esFull !== false;
    function nombre(id, sub) {
      if (X.porExtra[id]) return X.porExtra[id];
      var n = t.cond[id]; if (!n) return id;
      return n.n + (n.o && sub ? ': ' + n.o[sub] : '');
    }
    function chk(id, txt) { return '<label class="chk"><input type="checkbox" id="mc-' + id + '"> ' + txt + '</label>'; }
    function seg(name, ops, def) {
      return '<div class="seg" role="radiogroup">' + ops.map(function (o) { return '<label class="opt-seg"><input type="radio" name="' + name + '" value="' + o[0] + '"' + (o[0] === def ? ' checked' : '') + '><span>' + o[1] + '</span></label>'; }).join('') + '</div>';
    }
    function condHtml(c) {
      var n = t.cond[c[1]], ops = c[2], uno = ops.length === 1 && ops[0][0] === 'si';
      var sel = '<select data-cond="' + c[1] + '" hidden aria-hidden="true" tabindex="-1"><option value="">' + t.no + '</option>' +
        ops.map(function (o) { return '<option value="' + o[0] + '">' + (n.o ? n.o[o[0]] : t.si) + '</option>'; }).join('') + '</select>';
      var txt = norm(n.n + ' ' + (n.o ? Object.keys(n.o).map(function (k) { return n.o[k]; }).join(' ') : ''));
      if (uno) return '<div class="mc-cond mc-uno" data-c="' + c[1] + '" data-t="' + txt + '"><button type="button" class="chip" data-v="si" aria-pressed="false">' + n.n + '</button>' + sel + '</div>';
      return '<div class="mc-cond" data-c="' + c[1] + '" data-t="' + txt + '"><div class="mc-cn">' + n.n + '</div><div class="mc-ops">' +
        ops.map(function (o) { return '<button type="button" class="chip" data-v="' + o[0] + '" aria-pressed="false">' + n.o[o[0]] + '</button>'; }).join('') + '</div>' + sel + '</div>';
    }
    var INC = [['tirz_inicio', 'Tirzepatida: inicio (primeras 4 semanas)'], ['tirz_aumento', 'Tirzepatida: aumento de dosis (4 semanas siguientes)'], ['tirz_estable', 'Tirzepatida: dosis estable más de 4 semanas'], ['sema', 'Semaglutida'], ['otra', 'Otro GLP-1 (liraglutida, dulaglutida)']];
    var incHtml = '<div class="mc-cond" data-c="incretina" data-t="' + norm('incretinas glp-1 gip tirzepatida mounjaro zepbound semaglutida ozempic wegovy liraglutida') + '"><div class="mc-cn">Incretinas (GLP-1 / GIP)</div><div class="mc-ops">' +
      INC.map(function (o) { return '<button type="button" class="chip" data-inc="' + o[0] + '" aria-pressed="false">' + o[1] + '</button>'; }).join('') + '</div>' +
      '<select id="mc-incretina" hidden aria-hidden="true" tabindex="-1"><option value=""></option>' + INC.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select></div>';

    var leyenda = '<div class="mc-ley">' +
      '<p><b>Tres lecturas de la categoría 1 a 4</b></p><ul class="pq-notas">' +
      '<li>' + badge(1) + ' ' + badge(2) + ' ' + badge(3) + ' ' + badge(4) + ' Categoría numérica de la OMS y el CDC.</li>' +
      '<li>Con criterio clínico: 1 se usa siempre; 2 en general se usa; 3 no se recomienda salvo que no haya otro método disponible o aceptable; 4 no se usa.</li>' +
      '<li>Con criterio clínico limitado: 1 y 2 = sí se usa; 3 y 4 = no se usa.</li></ul>' +
      '<p><b>Otras marcas</b></p><ul class="pq-notas">' +
      '<li><b>I / C</b>: iniciación / continuación. «2 > 3» = categoría 2 para iniciar y 3 para seguir con un método que ya usa.</li>' +
      '<li><b>3–4</b>: rango según la gravedad; se toma el valor más alto.</li>' +
      '<li><b>A / C / D</b> (naturales, US MEC apéndice F): ' + badge('A') + ' aceptar · ' + badge('C') + ' precaución · ' + badge('D') + ' diferir.</li>' +
      '<li><b>A / C / D / S</b> (esterilización, criterios OMS): ' + badge('A') + ' aceptar · ' + badge('C') + ' precaución · ' + badge('D') + ' diferir · ' + badge('S') + ' situación especial (equipo, personal con experiencia y anestesia general).</li>' +
      '<li>' + badge('NA') + ' no corresponde · <b>*</b> tiene aclaración en el US MEC 2024.</li></ul></div>';

    var h = '<details class="mc-cats" open><summary>Categorías de la OMS 1 a 4</summary><div class="mc-cats-l">' +
      [1, 2, 3, 4].map(function (k) { return '<div class="mc-cat-r">' + badge(k) + '<div><b>' + X.cat[k][0] + '</b><br><small>' + X.cat[k][1] + '</small></div></div>'; }).join('') +
      '<p class="ayuda">Con criterio clínico limitado: 1 y 2 = sí se usa; 3 y 4 = no se usa.</p></div></details>' +
      '<p class="mc-acc"><button type="button" class="btn-sec" id="mc-bley" aria-expanded="false">(i) Leyenda</button></p><div id="mc-ley" hidden>' + leyenda + '</div>' +
      // Paso 1
      '<section class="mc-paso"><h3 class="mc-ph">Paso 1 · Datos</h3><div class="grid2">' +
      '<label class="campo"><span>' + t.edad + '</span><input id="mc-edad" type="number" inputmode="numeric" placeholder="30"></label>' +
      '<label class="campo"><span>' + t.metodoActual + '</span><select id="mc-metodoActual"><option value="">' + t.elegir + '</option>' +
      ['ninguno', 'barrera', 'cu', 'lng', 'imp', 'ampd', 'pop', 'ahc'].map(function (k) { return '<option value="' + k + '">' + t.actual[k] + '</option>'; }).join('') + '</select></label></div>' +
      '<span class="campo"><span>' + t.uso + '</span></span>' + seg('mc-uso', [['iniciacion', t.usos.iniciacion + ' (I)'], ['continuacion', t.usos.continuacion + ' (C)']], 'iniciacion') +
      '<small class="ayuda">' + t.usoAyuda + '</small>' +
      '<fieldset class="mrs-grupo" id="mc-w40"><legend>' + t.g.mas40 + '</legend>' +
      chk('sangrado', t.m40.sangrado) + chk('irregular', t.m40.irregular) + chk('hueso', t.m40.hueso) + chk('sexualidad', t.m40.sexualidad) +
      '<div class="grid2"><label class="campo" id="mc-wAm"><span>' + t.amenorrea + '</span><input id="mc-amenorrea" type="number" inputmode="numeric" placeholder="12"><small>' + t.amenorreaAyuda + '</small></label>' +
      '<label class="campo" id="mc-wFsh"><span>' + t.fsh + '</span><select id="mc-fsh"><option value="">' + t.fshNo + '</option><option value="si">' + t.fshSi + '</option><option value="no">' + t.fshMenor + '</option></select></label></div></fieldset></section>' +
      // Paso 2
      '<section class="mc-paso"><h3 class="mc-ph">Paso 2 · Condiciones</h3><p class="ayuda">Tocá la condición (o su variante). Si hay varias, manda la categoría más alta.</p>' +
      '<div id="mc-marcadas" class="mc-marcadas"></div>' +
      '<label class="campo"><span>Buscar condición</span><input class="mc-buscar" type="search" placeholder="Ej.: migraña, lactancia, látex"></label>';
    GRUPOS.forEach(function (g) {
      h += '<details class="mrs-grupo mec-grupo" data-g="' + g + '"' + (g === 'personal' ? ' open' : '') + '><summary>' + t.grupos[g] + ' <span class="mec-cuenta" data-g="' + g + '"></span></summary>' +
        C.filter(function (c) { return c[0] === g; }).map(condHtml).join('') + (g === 'inter' ? incHtml : '') + '</details>';
    });
    h += '</section>' +
      // Paso 3
      '<section class="mc-paso"><h3 class="mc-ph">Paso 3 · Métodos</h3>' +
      '<div class="chips mc-filtros" role="group" aria-label="Filtrar métodos">' +
      [['todos', 'Todos'], ['sinhorm', 'Sin hormonas'], ['horm', 'Hormonales'], ['larc', 'Larga duración'], ['ciclo', 'Sangrado programado']].map(function (f, i) { return '<button type="button" class="chip" data-f="' + f[0] + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + f[1] + '</button>'; }).join('') +
      '</div><div id="mc-out" class="resultados" aria-live="polite"></div></section>' +
      '<div class="pq-acciones"><button type="button" class="btn-sec" id="mc-copiar">' + t.copiar + '</button>' +
      '<button type="button" class="btn-sec" id="mc-limpiar">' + T.app.limpiar + '</button></div>' +
      '<details class="ref"><summary>' + t.omsTitulo + '</summary>' + t.omsTexto + '</details>' +
      '<p class="cita">' + t.cita + '</p><p class="etiqueta">' + t.etq + '</p>' +
      '<p class="etiqueta">Tabla propia CaVeSal® · Índice de Pearl: OMS, Planificación familiar: manual mundial 2018 (O) · Trussell J. Contraception 2011;83:397-404 (T) · ensayos de fase 3 y prospectos citados en cada método</p>';
    cont.innerHTML = h;

    var $ = function (id) { return cont.querySelector('#mc-' + id); };
    var ultimo = '', filtro = 'todos';
    function leer() {
      var d = { edad: num($('edad').value), uso: (cont.querySelector('input[name=mc-uso]:checked') || {}).value || 'iniciacion', sel: {},
        incretina: $('incretina').value, mas40: { sangrado: $('sangrado').checked, irregular: $('irregular').checked, hueso: $('hueso').checked, sexualidad: $('sexualidad').checked },
        metodoActual: $('metodoActual').value, amenorreaMeses: num($('amenorrea').value), fsh30: $('fsh').value };
      cont.querySelectorAll('select[data-cond]').forEach(function (s) { if (s.value) d.sel[s.getAttribute('data-cond')] = s.value; });
      return d;
    }
    function sincronizar(d) {
      cont.querySelectorAll('.mc-cond').forEach(function (div) {
        var id = div.getAttribute('data-c'), v = id === 'incretina' ? d.incretina : d.sel[id] || '';
        div.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-v') || b.getAttribute('data-inc')) === v && !!v)); });
        div.classList.toggle('mc-on', !!v);
      });
      var m = Object.keys(d.sel).map(function (k) { return '<button type="button" class="chip mc-quitar" data-q="' + k + '" aria-pressed="true">' + nombre(k, d.sel[k]) + ' ×</button>'; });
      if (d.incretina) m.push('<button type="button" class="chip mc-quitar" data-q="incretina" aria-pressed="true">' + $('incretina').selectedOptions[0].textContent + ' ×</button>');
      $('marcadas').innerHTML = m.length ? '<small class="ayuda">Marcadas (' + m.length + '):</small> ' + m.join(' ') : '';
    }

    // Categoría de un método del catálogo según su fuente.
    function catMetodo(m, r, d) {
      var lact = d.sel.lactancia;
      if (m.src === 'mec') { var x = r.metodos[m.k]; return { cat: x.embarazo ? 'NA' : x.cat, txt: x.txt, por: x.por.map(function (p) { return nombre(p.id, p.sub) + (p.v.ic ? ' (' + t.usos[d.uso].toLowerCase() + ')' : '') + (p.v.rango ? ' · ' + t.segunGravedad : ''); }), acl: x.aclaracion }; }
      if (m.src === 'bar') { var b = r.barrera[m.k === 'condonInt' ? 'condonInt' : m.k]; return { cat: b.cat, por: b.por.map(function (k) { return nombre(k, d.sel[k]); }) }; }
      if (m.src === 'fab') { var f = r.naturales[m.k]; return { cat: f.cat, por: f.por.map(function (k) { return nombre(k, d.sel[k]); }) }; }
      if (m.src === 'ae') {
        var e = r.emergencia[m.k], o = { cat: e.cat, por: e.por.map(function (k) { return nombre(k, d.sel[k]); }) };
        if (m.k === 'cu' && r.metodos.cu.cat && e.cat !== 'NA' && r.metodos.cu.cat > e.cat) { o.cat = r.metodos.cu.cat; o.por = o.por.concat(['categoría del DIU de cobre de la tabla general (sugerencia CaVeSal®)']); }
        return o;
      }
      if (m.src === 'est') { var s = r.esterilizacion; return { cat: d.sel.embarazo ? 'D' : s.cat, por: s.por.map(function (k) { return nombre(k, d.sel[k]); }), letra: true }; }
      if (m.id === 'spray') return { inv: true, txt: 'En investigación' };
      if (m.id === 'mela') return lact ? { estado: 'Aplica si cumple las 3 condiciones', col: 'verde' } : { estado: 'Solo con lactancia', col: 'neutro' };
      if (m.id === 'anprog') return !lact ? { estado: 'Solo con lactancia', col: 'neutro' } : (lact === 'l21' || lact === 'l21_30') ? { estado: 'Desde las 4 semanas posparto', col: 'ambar' } : { estado: 'Aplica con lactancia 4 o más veces por día', col: 'verde' };
      if (m.id === 'vasec') return { estado: 'Depende de la pareja', col: 'neutro' };
      if (m.id === 'aemife') return { estado: 'OMS 2026 · sin categoría US MEC', col: 'neutro' };
      if (m.id === 'coito') return { estado: 'Sin categoría', col: 'neutro' };
      return { estado: '—', col: 'neutro' };
    }
    function pasaFiltro(m) {
      if (filtro === 'sinhorm') return !m.horm;
      if (filtro === 'horm') return m.horm;
      if (filtro === 'larc') return m.larc;
      if (filtro === 'ciclo') return m.ciclo;
      return true;
    }
    function rango(c) { if (c === 'NA' || c === null || c === undefined) return 9; var s = String(c).split('~').pop().split('–').pop(); return isNaN(+s) ? RANGO_L[s] : +s; }

    function sugerencia(d, r) {
      var s = [], ahc = r.metodos.ahc;
      if (d.sel.embarazo) return ['Con embarazo no se indica anticoncepción.'];
      if (ahc.cat !== null && ahc.cat >= 3) {
        var ok = ['cu', 'lng', 'imp', 'pop', 'ampd'].filter(function (k) { var x = r.metodos[k]; return x.cat !== null && x.cat <= 2; }).map(function (k) { return t.metodos[k]; });
        s.push('No usar estrógenos (categoría ' + ahc.txt + ' para los combinados: ' + ahc.por.map(function (p) { return nombre(p.id, p.sub); }).join('; ') + ').' + (ok.length ? ' Opciones con categoría 1 o 2: ' + ok.join(', ') + '.' : ''));
      }
      if (d.sel.lactancia) s.push('Lactancia: priorizar métodos sin estrógenos (DIU, implante, solo progestágeno), MELA si se cumplen las 3 condiciones o el anillo de progesterona desde las 4 semanas.');
      if (r.alertas.indexOf('tirzepatida') >= 0) s.push('Tirzepatida en inicio o aumento de dosis: si usa un método oral, cambiar a uno no oral o sumar barrera durante 4 semanas (prospecto FDA de Mounjaro).');
      if (d.sel.riesgoVih || d.sel.vih) s.push('Sumar preservativo (doble protección). Evitar espermicida y diafragma con riesgo alto de VIH o VIH (categoría 4 y 3).');
      if (d.edad !== null && d.edad < 20) s.push('Adolescente: los LARC son seguros (categoría 1 a 2) y los más eficaces; sumar preservativo.');
      if (!s.length) s.push('Sin restricciones en lo cargado: elegir según preferencia, priorizando la eficacia (LARC) y sumando preservativo si hay riesgo de ITS.');
      return s;
    }

    function actualizar() {
      var d = leer(), out = $('out');
      sincronizar(d);
      GRUPOS.forEach(function (g) {
        var k = C.filter(function (c) { return c[0] === g && d.sel[c[1]]; }).length + (g === 'inter' && d.incretina ? 1 : 0);
        cont.querySelector('.mec-cuenta[data-g=' + g + ']').textContent = k ? '(' + k + ')' : '';
      });
      var e40 = d.edad !== null && d.edad >= 40;
      $('w40').style.display = e40 ? '' : 'none';
      var m = d.metodoActual;
      $('wAm').style.display = (m === 'ninguno' || m === 'cu' || m === 'barrera') ? '' : 'none';
      $('wFsh').style.display = ((m === 'pop' || m === 'imp' || m === 'lng') && d.edad >= 50 && d.edad < 55) ? '' : 'none';
      var r = calcular(d);
      if (!r.filas) { out.innerHTML = '<p class="ayuda">Cargá la edad en el paso 1 para ver la categoría de cada método.</p>'; ultimo = ''; return; }
      var html = '', txt = [], incOral = r.alertas.indexOf('tirzepatida') >= 0, glp = r.alertas.indexOf('glp1') >= 0;
      var sug = sugerencia(d, r);
      html += esFull ? '<div class="fila ' + (r.metodos.ahc.cat >= 3 ? 'naranja' : 'verde') + '"><div class="f-etq">Sugerencia CaVeSal®</div><div class="f-val">' + w.GYN.comun.ul(sug) + '</div><div class="f-det">Sugerencia CaVeSal® · Basado en: US MEC 2024 · OMS 2025 y 2026 · FSRH 2023 · prospecto FDA de Mounjaro 08/2026</div></div>'
        : opts.bloqueo('Sugerencia de método en la versión completa');
      if (esFull) txt.push('Sugerencia CaVeSal®: ' + sug.join(' '));
      var notas = [];
      r.alertas.forEach(function (a) { notas.push(t.alertas[a]); });
      if (d.sel.lactancia || d.sel.posparto || d.sel.diuPosparto || d.sel.postaborto) notas.push(t.duracion);
      if (notas.length) html += '<div class="vg-tto"><p><b>' + t.notasTit + '</b></p><ul class="pq-notas">' + notas.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></div>';
      MT.FAMILIAS.forEach(function (fam) {
        var lista = MT.METODOS.filter(function (x) { return x.f === fam[0] && pasaFiltro(x); });
        if (!lista.length) return;
        var cats = [], filas = lista.map(function (mm) {
          var c = catMetodo(mm, r, d), b;
          if (c.inv) b = '<span class="mec-c cINV">En investigación</span>';
          else if (c.estado) b = '<span class="mec-c cTXT c-' + c.col + '">' + c.estado + '</span>';
          else { b = badge(c.cat, c.cat === 'NA' ? 'NA' : c.txt); cats.push(c.cat); }
          var inc = mm.oral && incOral ? '<span class="mc-tag">Incretina: barrera 4 semanas</span>' : mm.oral && glp ? '<span class="mc-tag">GLP-1: precaución con vómitos</span>' : '';
          var cuerpo = '<dl class="mc-ficha"><dt>' + (mm.pt ? 'Eficacia' : 'Pearl (perfecto / típico)') + '</dt><dd>' + MT.pearl(mm.p, mm) + (mm.p && !mm.pt ? ' <small>(' + mm.p[2] + ')</small>' : '') + '</dd>' +
            '<dt>Duración</dt><dd>' + mm.dur + '</dd><dt>Composición</dt><dd>' + mm.comp + '</dd></dl>' +
            (c.por && c.por.length ? '<p class="f-det"><b>Por qué esta categoría:</b> ' + c.por.join(' · ') + (c.acl ? ' · ' + t.aclaracion : '') + '</p>' : '') +
            (inc && incOral ? '<p class="f-det"><b>Sugerencia CaVeSal® · Basado en: prospecto FDA de Mounjaro 08/2026:</b> cambiar a un método no oral o sumar barrera durante 4 semanas tras el inicio y tras cada aumento de dosis.</p>' : '') +
            w.GYN.comun.ul(mm.uso) + (FORMAS_IDS.indexOf(mm.id) >= 0 ? '<p><b>Formas de uso</b></p>' + FORMAS : '') +
            (mm.id === 'aoce2' ? '<p class="ayuda">Valerato de estradiol/dienogest es multifásico: no usar en esquemas extendidos. Estradiol/nomegestrol es monofásico.</p>' : '');
          if (c.cat !== undefined || c.estado || c.inv) txt.push(mm.n + ': ' + (c.inv ? 'en investigación' : c.estado ? c.estado : (c.cat === 'NA' ? 'no corresponde' : (c.txt || c.cat))) + (c.por && c.por.length ? ' (' + c.por.join('; ') + ')' : '') + '.');
          return '<details class="mt-item fila ' + (c.inv || c.estado ? 'neutro' : filaColor(c.cat)) + '"><summary>' + b + ' <b>' + mm.n + '</b> ' + inc + '</summary>' + cuerpo + '</details>';
        });
        var peor = cats.length ? cats.slice().sort(function (a, b2) { return rango(b2) - rango(a); })[0] : null, mejor = cats.length ? cats.slice().sort(function (a, b2) { return rango(a) - rango(b2); })[0] : null;
        var res = cats.length ? badge(mejor, mejor === 'NA' ? 'NA' : null) + (String(peor) !== String(mejor) ? ' a ' + badge(peor) : '') : '';
        html += '<details class="mrs-grupo mc-fam" data-fam="' + fam[0] + '"><summary>' + fam[1] + ' <small>(' + lista.length + ')</small> ' + res + '</summary>' +
          (X.familiaNota[fam[0]] ? '<p class="ayuda">' + X.familiaNota[fam[0]] + '</p>' : '') + filas.join('') + '</details>';
      });
      if (r.notasOms.length) {
        html += '<div class="vg-tto"><p><b>' + t.omsNotasTit + '</b></p><ul class="pq-notas">' + r.notasOms.map(function (k) { return '<li>' + t.oms[k] + '</li>'; }).join('') + '</ul></div>';
        txt.push(t.omsNotasTit + ': ' + r.notasOms.map(function (k) { return t.oms[k]; }).join(' '));
      }
      if (r.mas40) {
        var l = [t.m40Base.venoso, t.m40Base.arterial].concat(r.mas40.extra.map(function (k) { return t.m40Det[k]; }));
        html += w.GYN.fertilidad.fila(t.g.mas40, '<strong>' + t.m40Tit + '</strong>', '', 'neutro') + '<ul class="pq-notas">' + l.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';
        txt.push(t.g.mas40 + ': ' + l.join(' '));
      }
      if (r.suspension) {
        var s = t.susp[r.suspension.clave];
        html += w.GYN.fertilidad.fila(t.suspTit, '<strong>' + s + '</strong>', t.suspDet, r.suspension.clave === 'suspender55' || r.suspension.clave === 'noHormonalSuspender' ? 'verde' : 'neutro') +
          '<p class="ayuda"><a href="#thm">' + t.aThm + '</a></p>';
        txt.push(t.suspTit + ': ' + s);
      }
      html += '<div class="mc-ley-b"><b>Leyenda:</b> ' + badge(1) + ' sin restricción · ' + badge(2) + ' ventajas superan riesgos · ' + badge(3) + ' riesgos superan ventajas · ' + badge(4) + ' no usar · ' +
        badge('A') + ' aceptar · ' + badge('C') + ' precaución · ' + badge('D') + ' diferir · ' + badge('S') + ' situación especial · ' + badge('NA') + ' no corresponde · I/C: iniciación/continuación. Tocá cada método para ver su ficha.</div>';
      html += '<p class="ayuda">' + T.app.orientativa + '</p>';
      out.innerHTML = html;
      ultimo = t.titCopia + '\n' + txt.join('\n') + '\n' + t.cita;
    }

    cont.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !cont.contains(b)) return;
      if (b.id === 'mc-bley') { var p = $('ley'); p.hidden = !p.hidden; b.setAttribute('aria-expanded', String(!p.hidden)); return; }
      if (b.hasAttribute('data-f')) { filtro = b.getAttribute('data-f'); cont.querySelectorAll('.mc-filtros .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); actualizar(); return; }
      var s;
      if (b.hasAttribute('data-q')) {
        var q = b.getAttribute('data-q');
        s = q === 'incretina' ? $('incretina') : cont.querySelector('select[data-cond="' + q + '"]'); s.value = '';
      } else if (b.hasAttribute('data-inc')) { s = $('incretina'); s.value = s.value === b.getAttribute('data-inc') ? '' : b.getAttribute('data-inc'); }
      else if (b.hasAttribute('data-v')) { s = b.closest('.mc-cond').querySelector('select[data-cond]'); s.value = s.value === b.getAttribute('data-v') ? '' : b.getAttribute('data-v'); }
      else return;
      s.dispatchEvent(new Event('change', { bubbles: true }));
    });
    cont.querySelector('.mc-buscar').addEventListener('input', function (e) {
      e.stopPropagation();
      var q = norm(this.value.trim());
      cont.querySelectorAll('.mec-grupo').forEach(function (g) {
        var n = 0;
        g.querySelectorAll('.mc-cond').forEach(function (c) { var ok = !q || c.getAttribute('data-t').indexOf(q) >= 0; c.hidden = !ok; if (ok) n++; });
        g.hidden = !!q && !n; if (q && n) g.open = true;
      });
    });
    cont.addEventListener('input', function (e) { if (!e.target.classList.contains('mc-buscar')) actualizar(); });
    cont.addEventListener('change', function (e) { if (!e.target.classList.contains('mc-buscar')) actualizar(); });
    $('copiar').addEventListener('click', function () {
      var b = this; if (!ultimo) return;
      var listo = function () { b.textContent = t.copiado; setTimeout(function () { b.textContent = t.copiar; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ultimo).then(listo, listo);
      else { var ta = document.createElement('textarea'); ta.value = ultimo; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); listo(); }
    });
    $('limpiar').addEventListener('click', function () {
      cont.querySelectorAll('input[type=number],input[type=search]').forEach(function (i) { i.value = ''; });
      cont.querySelectorAll('select').forEach(function (s) { s.value = ''; });
      cont.querySelectorAll('input[type=checkbox]').forEach(function (i) { i.checked = false; });
      cont.querySelector('input[name=mc-uso][value=iniciacion]').checked = true;
      cont.querySelectorAll('.mec-grupo,.mc-cond').forEach(function (g) { g.hidden = false; });
      actualizar();
    });
    cont._texto = function () { return ultimo; };
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.mec = { calcular: calcular, celda: celda, render: render, METODOS: METODOS, CONDICIONES: C, GRUPOS: GRUPOS, BARRERA: BAR, NATURALES: FAB, EMERGENCIA: AE };
})(window);
