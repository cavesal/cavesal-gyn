/* CaVeSal® GYN · Elegibilidad de métodos anticonceptivos (MEC).
   Tabla adaptada (traducida) de: CDC. U.S. Medical Eligibility Criteria for Contraceptive Use, 2024.
   MMWR Recomm Rep 2024;73(No. RR-4):1-126 · Dominio público (gobierno de EE. UU.).
   Algoritmo propio CaVeSal® · Basado en: US MEC 2024 · OMS MEC 6.ª ed. 2025 (solo notas de texto, sin su tabla) ·
   SIC (Cagnacci A et al.) Eur J Contracept Reprod Health Care 2025;30:304-318 · FSRH Contraception for women aged over 40 (2017, enmienda 2023) ·
   ANMAT DI-2025-79202301 (implante 5 años) · FDA, prospecto de tirzepatida.
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
  var GRUPOS = ['personal', 'cv', 'renal', 'reuma', 'neuro', 'repro', 'vih', 'infec', 'endo', 'gi', 'resp', 'hemato', 'inter'];

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
    if (d.tirzepatida) alertas.push('tirzepatida');
    return { metodos: res, filas: filas.length, notasOms: notasOms, alertas: alertas, mas40: d.edad !== null && d.edad >= 40 ? mas40(d) : null, suspension: d.edad !== null && d.edad >= 40 ? suspension(d) : null };
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

  function render(cont, T, opts) {
    var t = T.mec, F = w.GYN.fertilidad.fila;
    function chk(id, txt) { return '<label class="chk"><input type="checkbox" id="mc-' + id + '"> ' + txt + '</label>'; }
    function seg(name, ops, def) {
      return '<div class="seg" role="radiogroup">' + ops.map(function (o) { return '<label class="opt-seg"><input type="radio" name="' + name + '" value="' + o[0] + '"' + (o[0] === def ? ' checked' : '') + '><span>' + o[1] + '</span></label>'; }).join('') + '</div>';
    }
    function selCond(c) {
      var n = t.cond[c[1]];
      return '<label class="campo"><span>' + n.n + '</span><select data-cond="' + c[1] + '"><option value="">' + t.no + '</option>' +
        c[2].map(function (o) { return '<option value="' + o[0] + '">' + (n.o ? n.o[o[0]] : t.si) + '</option>'; }).join('') + '</select></label>';
    }
    var h = '<p class="ayuda">' + t.ayuda + '</p>' +
      '<fieldset class="mrs-grupo"><legend>' + t.g.base + '</legend><div class="grid2">' +
      '<label class="campo"><span>' + t.edad + '</span><input id="mc-edad" type="number" inputmode="numeric" placeholder="30"></label></div>' +
      '<span class="campo"><span>' + t.uso + '</span></span>' + seg('mc-uso', [['iniciacion', t.usos.iniciacion], ['continuacion', t.usos.continuacion]], 'iniciacion') +
      '<small class="ayuda">' + t.usoAyuda + '</small></fieldset>';
    GRUPOS.forEach(function (g) {
      h += '<details class="mrs-grupo mec-grupo"' + (g === 'personal' ? ' open' : '') + '><summary>' + t.grupos[g] + ' <span class="mec-cuenta" data-g="' + g + '"></span></summary>' +
        C.filter(function (c) { return c[0] === g; }).map(selCond).join('') +
        (g === 'inter' ? chk('tirzepatida', t.tirzepatida) : '') + '</details>';
    });
    h += '<fieldset class="mrs-grupo" id="mc-w40"><legend>' + t.g.mas40 + '</legend>' +
      chk('sangrado', t.m40.sangrado) + chk('irregular', t.m40.irregular) + chk('hueso', t.m40.hueso) + chk('sexualidad', t.m40.sexualidad) +
      '<div class="grid2"><label class="campo"><span>' + t.metodoActual + '</span><select id="mc-metodoActual"><option value="">' + t.elegir + '</option>' +
      ['ninguno', 'barrera', 'cu', 'lng', 'imp', 'ampd', 'pop', 'ahc'].map(function (k) { return '<option value="' + k + '">' + t.actual[k] + '</option>'; }).join('') + '</select></label>' +
      '<label class="campo" id="mc-wAm"><span>' + t.amenorrea + '</span><input id="mc-amenorrea" type="number" inputmode="numeric" placeholder="12"><small>' + t.amenorreaAyuda + '</small></label>' +
      '<label class="campo" id="mc-wFsh"><span>' + t.fsh + '</span><select id="mc-fsh"><option value="">' + t.fshNo + '</option><option value="si">' + t.fshSi + '</option><option value="no">' + t.fshMenor + '</option></select></label></div></fieldset>' +
      '<div id="mc-out" class="resultados" aria-live="polite"></div>' +
      '<div class="pq-acciones"><button type="button" class="btn-sec" id="mc-copiar">' + t.copiar + '</button>' +
      '<button type="button" class="btn-sec" id="mc-limpiar">' + T.app.limpiar + '</button></div>' +
      '<details class="ref"><summary>' + t.catTitulo + '</summary>' + t.catTexto + '</details>' +
      '<details class="ref"><summary>' + t.omsTitulo + '</summary>' + t.omsTexto + '</details>' +
      '<p class="cita">' + t.cita + '</p><p class="etiqueta">' + t.etq + '</p>';
    cont.innerHTML = h;

    var $ = function (id) { return cont.querySelector('#mc-' + id); };
    var ultimo = '';
    function leer() {
      var d = { edad: num($('edad').value), uso: (cont.querySelector('input[name=mc-uso]:checked') || {}).value || 'iniciacion', sel: {},
        tirzepatida: $('tirzepatida').checked, mas40: { sangrado: $('sangrado').checked, irregular: $('irregular').checked, hueso: $('hueso').checked, sexualidad: $('sexualidad').checked },
        metodoActual: $('metodoActual').value, amenorreaMeses: num($('amenorrea').value), fsh30: $('fsh').value };
      cont.querySelectorAll('select[data-cond]').forEach(function (s) { if (s.value) d.sel[s.getAttribute('data-cond')] = s.value; });
      return d;
    }
    function color(c) { return c === 1 ? 'verde' : c === 2 ? 'neutro' : c === 3 ? 'ambar' : c === 4 ? 'rojo' : 'neutro'; }
    function nombreFila(f) { if (f.id === 'edad') return t.edad; var n = t.cond[f.id]; return n.n + (n.o && f.sub ? ': ' + n.o[f.sub] : ''); }

    function actualizar() {
      var d = leer(), out = $('out');
      GRUPOS.forEach(function (g) {
        var k = C.filter(function (c) { return c[0] === g && d.sel[c[1]]; }).length;
        cont.querySelector('.mec-cuenta[data-g=' + g + ']').textContent = k ? '(' + k + ')' : '';
      });
      var e40 = d.edad !== null && d.edad >= 40;
      $('w40').style.display = e40 ? '' : 'none';
      var m = d.metodoActual;
      $('wAm').style.display = (m === 'ninguno' || m === 'cu' || m === 'barrera') ? '' : 'none';
      $('wFsh').style.display = ((m === 'pop' || m === 'imp' || m === 'lng') && d.edad >= 50 && d.edad < 55) ? '' : 'none';
      var r = calcular(d);
      if (!r.filas) { out.innerHTML = '<p class="ayuda">' + t.faltan + '</p>'; ultimo = ''; return; }
      var html = '', txt = [];
      METODOS.forEach(function (k) {
        var x = r.metodos[k];
        if (x.embarazo) { html += F(t.metodos[k], '<strong>' + t.noCorresponde + '</strong>', t.embarazoDet, 'neutro'); txt.push(t.metodos[k] + ': ' + t.noCorresponde + '.'); return; }
        if (x.cat === null) return;
        var det = x.por.map(function (p) { return nombreFila(p) + (p.v.ic ? ' (' + t.usos[d.uso].toLowerCase() + ')' : '') + (p.v.rango ? ' · ' + t.segunGravedad : ''); }).join(' · ');
        if (x.aclaracion) det += (det ? ' · ' : '') + t.aclaracion;
        html += F(t.metodos[k], '<strong>' + t.cat + ' ' + x.txt + ' · ' + t.catNombre[x.cat] + '</strong>', det, color(x.cat));
        txt.push(t.metodos[k] + ': ' + t.cat + ' ' + x.txt + ' (' + t.catNombre[x.cat] + ')' + (det ? '. ' + det : '') + '.');
      });
      var notas = [];
      r.alertas.forEach(function (a) { notas.push(t.alertas[a]); });
      if (d.sel.lactancia || d.sel.posparto || d.sel.diuPosparto || d.sel.postaborto) notas.push(t.duracion);
      if (notas.length) html += '<div class="vg-tto"><p><b>' + t.notasTit + '</b></p><ul class="pq-notas">' + notas.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></div>';
      if (r.notasOms.length) {
        html += '<div class="vg-tto"><p><b>' + t.omsNotasTit + '</b></p><ul class="pq-notas">' + r.notasOms.map(function (k) { return '<li>' + t.oms[k] + '</li>'; }).join('') + '</ul></div>';
        txt.push(t.omsNotasTit + ': ' + r.notasOms.map(function (k) { return t.oms[k]; }).join(' '));
      }
      if (r.mas40) {
        var l = [t.m40Base.venoso, t.m40Base.arterial].concat(r.mas40.extra.map(function (k) { return t.m40Det[k]; }));
        html += F(t.g.mas40, '<strong>' + t.m40Tit + '</strong>', '', 'neutro') + '<ul class="pq-notas">' + l.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';
        txt.push(t.g.mas40 + ': ' + l.join(' '));
      }
      if (r.suspension) {
        var s = t.susp[r.suspension.clave];
        html += F(t.suspTit, '<strong>' + s + '</strong>', t.suspDet, r.suspension.clave === 'suspender55' || r.suspension.clave === 'noHormonalSuspender' ? 'verde' : 'neutro') +
          '<p class="ayuda"><a href="#thm">' + t.aThm + '</a></p>';
        txt.push(t.suspTit + ': ' + s);
      }
      html += '<p class="ayuda">' + T.app.orientativa + '</p>';
      out.innerHTML = html;
      ultimo = t.titCopia + '\n' + txt.join('\n') + '\n' + t.cita;
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    $('copiar').addEventListener('click', function () {
      var b = this; if (!ultimo) return;
      var listo = function () { b.textContent = t.copiado; setTimeout(function () { b.textContent = t.copiar; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ultimo).then(listo, listo);
      else { var ta = document.createElement('textarea'); ta.value = ultimo; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); listo(); }
    });
    $('limpiar').addEventListener('click', function () {
      cont.querySelectorAll('input[type=number]').forEach(function (i) { i.value = ''; });
      cont.querySelectorAll('select').forEach(function (s) { s.value = ''; });
      cont.querySelectorAll('input[type=checkbox]').forEach(function (i) { i.checked = false; });
      cont.querySelector('input[name=mc-uso][value=iniciacion]').checked = true;
      actualizar();
    });
    cont._texto = function () { return ultimo; };
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.mec = { calcular: calcular, celda: celda, render: render, METODOS: METODOS, CONDICIONES: C, GRUPOS: GRUPOS };
})(window);
