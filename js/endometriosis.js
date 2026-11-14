/* CaVeSal® GYN · Endometriosis: sospecha clínica, ecografía IDEA, #Enzian, rASRM, EFI y conducta.
   Algoritmo propio CaVeSal® · Basado en: ESHRE Guideline Endometriosis (Becker CM et al. Hum Reprod Open 2022;hoac009) ·
   IDEA (Guerriero S et al. Ultrasound Obstet Gynecol 2016;48:318-332) · #Enzian (Keckstein J et al. Acta Obstet Gynecol Scand 2021;100:1165-1175) ·
   rASRM (American Society for Reproductive Medicine. Fertil Steril 1997;67:817-821) · EFI (Adamson GD, Pasta DJ. Fertil Steril 2010;94:1609-1615).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function C() { return w.GYN.comun; }

  /* ---------- Sospecha clínica e IDEA ---------- */
  var SINTOMAS = [
    ['dism', 'Dismenorrea intensa (no cede con AINE o hace faltar a actividades)', ''],
    ['disp', 'Dispareunia profunda', 'B (uterosacros) o A (tabique rectovaginal)'],
    ['disq', 'Disquecia o dolor al defecar en la menstruación', 'C (recto y sigmoide) o A'],
    ['disu', 'Disuria o hematuria en la menstruación', 'FB (vejiga)'],
    ['dpc', 'Dolor pélvico crónico (6 meses o más)', ''],
    ['inf', 'Infertilidad', ''],
    ['otro', 'Dolor o sangrado cíclico en otro sitio (cicatriz, ombligo, tórax)', 'F otra localización']
  ];
  var IDEA = [
    ['i-ute', 'Paso 1 · Útero con rasgos de adenomiosis (MUSA)'],
    ['i-endo', 'Paso 1 · Endometrioma (quiste unilocular en vidrio esmerilado)'],
    ['i-dolor', 'Paso 2 · Dolor localizado al presionar con la sonda'],
    ['i-fijo', 'Paso 2 · Ovarios fijos o "ovarios que se besan"'],
    ['i-slide', 'Paso 3 · Signo de deslizamiento negativo (fondo de saco de Douglas obliterado)'],
    ['i-nod', 'Paso 4 · Nódulo de endometriosis profunda (vejiga, uterosacros, vagina, tabique o recto-sigmoide)']
  ];
  function sospecha(s, im) {
    var sint = SINTOMAS.filter(function (x) { return s[x[0]]; });
    var imagen = im['i-endo'] || im['i-slide'] || im['i-nod'];
    var blandos = im['i-dolor'] || im['i-fijo'];
    var r = { sint: sint, mapa: sint.filter(function (x) { return x[2]; }).map(function (x) { return x[1].split(' (')[0] + ' → ' + x[2]; }) };
    if (imagen) { r.color = 'naranja'; r.tit = 'Endometriosis diagnosticada por imagen'; r.txt = 'La ESHRE 2022 acepta el diagnóstico por ecografía o RM sin laparoscopía. Describí la extensión con #Enzian (u).'; }
    else if (sint.length || blandos) { r.color = 'ambar'; r.tit = 'Sospecha clínica'; r.txt = 'Una ecografía o RM negativa no descarta la enfermedad superficial. Se puede iniciar tratamiento empírico sin laparoscopía (ESHRE 2022).'; }
    else { r.color = 'neutro'; r.tit = 'Sin datos de sospecha'; r.txt = 'Marcá los síntomas y los hallazgos de la ecografía.'; }
    if (im['i-ute']) r.extra = 'Adenomiosis: completá MUSA en el módulo Útero. En #Enzian se anota FA.';
    return r;
  }

  /* ---------- #Enzian 2021 ---------- */
  var OPS_P = [['', '—'], ['0', '0 · Sin lesión'], ['1', '1 · Menos de 3 cm'], ['2', '2 · 3 a 7 cm'], ['3', '3 · Más de 7 cm'], ['x', 'x · No evaluable']];
  var OPS_O = OPS_P.concat([['m', 'm · Ovario ausente']]);
  var OPS_T = [['', '—'], ['0', '0 · Sin adherencias'], ['1', '1 · Leves'], ['2', '2 · Moderadas'], ['3', '3 · Graves'], ['m', 'm · Ausente'], ['x', 'x · No evaluable']];
  var OPS_ABC = [['', '—'], ['0', '0 · Sin lesión'], ['1', '1 · Menos de 1 cm'], ['2', '2 · 1 a 3 cm'], ['3', '3 · Más de 3 cm'], ['x', 'x · No evaluable']];
  var OPS_PERM = [['0', 'No evaluada'], ['+', 'Permeable (+)'], ['-', 'No permeable (−)']];
  var F_LOC = [['FA', 'Adenomiosis'], ['FB', 'Vejiga'], ['FU', 'Uréter (con dilatación)'], ['FI', 'Otro segmento intestinal'], ['FO', 'Otra localización']];
  function v0(x) { return x === '' || x === undefined || x === null ? '0' : x; }
  function enzian(e) {
    var met = e.metodo || 'u';
    var cod = '#Enzian(' + met + ')';
    cod += ' P' + v0(e.p);
    cod += ' O' + v0(e.oi) + '/' + v0(e.od);
    var t = ' T' + v0(e.ti) + '/' + v0(e.td);
    if (met === 's' && (e.pi !== '0' || e.pd !== '0')) t += ' (' + (e.pi === '0' ? '?' : e.pi) + '/' + (e.pd === '0' ? '?' : e.pd) + ')';
    cod += t + ' A' + v0(e.a) + ' B' + v0(e.bi) + '/' + v0(e.bd) + ' C' + v0(e.c);
    var f = (e.f || []).slice(); if (e.fo && f.indexOf('FO') >= 0) f[f.indexOf('FO')] = 'FO (' + e.fo + ')';
    if (f.length) cod += ' ' + f.join(' ');
    var prof = [['A', +e.a || 0], ['B izq.', +e.bi || 0], ['B der.', +e.bd || 0], ['C', +e.c || 0]].filter(function (x) { return x[1] > 0; });
    var max = prof.reduce(function (m, x) { return Math.max(m, x[1]); }, 0);
    var notas = [];
    if (prof.length || (e.f || []).some(function (k) { return k !== 'FA'; })) notas.push('Endometriosis profunda: planificar en un centro con experiencia y equipo multidisciplinario (ESHRE 2022).');
    if ((+e.c || 0) >= 2 || (e.f || []).indexOf('FI') >= 0) notas.push('Compromiso intestinal: sumar cirugía colorrectal a la planificación.');
    if ((e.f || []).indexOf('FU') >= 0) notas.push('Uréter con dilatación: evaluar ambos riñones por hidronefrosis y sumar urología.');
    if ((e.f || []).indexOf('FB') >= 0) notas.push('Vejiga: sumar urología a la planificación.');
    if (met !== 's' && (e.pi !== '0' || e.pd !== '0')) notas.push('La permeabilidad tubaria se anota solo en la clasificación quirúrgica (s).');
    return { codigo: cod, maxProf: max, notas: notas, color: max >= 3 ? 'rojo' : max === 2 ? 'naranja' : max === 1 ? 'ambar' : 'verde' };
  }

  /* ---------- rASRM ---------- */
  var R_PER_SUP = [['0', 'Ninguna'], ['1', 'Menos de 1 cm (1)'], ['2', '1 a 3 cm (2)'], ['4', 'Más de 3 cm (4)']];
  var R_PER_PRO = [['0', 'Ninguna'], ['2', 'Menos de 1 cm (2)'], ['4', '1 a 3 cm (4)'], ['6', 'Más de 3 cm (6)']];
  var R_OV_SUP = R_PER_SUP;
  var R_OV_PRO = [['0', 'Ninguna'], ['4', 'Menos de 1 cm (4)'], ['16', '1 a 3 cm (16)'], ['20', 'Más de 3 cm (20)']];
  var R_ADH = [['0', 'Ninguna'], ['1', 'Laxas, menos de 1/3 (1)'], ['2', 'Laxas, 1/3 a 2/3 (2)'], ['4', 'Laxas, más de 2/3 (4)'], ['4d', 'Densas, menos de 1/3 (4)'], ['8', 'Densas, 1/3 a 2/3 (8)'], ['16', 'Densas, más de 2/3 (16)']];
  var R_DOUG = [['0', 'Sin obliteración'], ['4', 'Parcial (4)'], ['40', 'Completa (40)']];
  function pts(v) { return parseInt(String(v || '0'), 10) || 0; }
  function rasrm(r) {
    var lesion = pts(r.perSup) + pts(r.perPro) + pts(r.oiSup) + pts(r.oiPro) + pts(r.odSup) + pts(r.odPro);
    var trompa = function (v, fim) { var p = pts(v); return fim && /d|8/.test(String(v)) ? 16 : p; };
    var adh = pts(r.oiAdh) + pts(r.odAdh) + trompa(r.tiAdh, r.tiFim) + trompa(r.tdAdh, r.tdFim);
    var total = lesion + adh + pts(r.doug);
    var est = total === 0 ? 0 : total <= 5 ? 1 : total <= 15 ? 2 : total <= 40 ? 3 : 4;
    var nom = ['Sin puntaje', 'Estadio I · mínima', 'Estadio II · leve', 'Estadio III · moderada', 'Estadio IV · severa'];
    return { lesion: lesion, adherencias: adh, douglas: pts(r.doug), total: total, estadio: est, nombre: nom[est], color: ['neutro', 'verde', 'ambar', 'naranja', 'rojo'][est] };
  }

  /* ---------- EFI ---------- */
  function efi(e) {
    var hist = 0, quir = 0, avisos = [];
    if (e.edad === null) avisos.push('Falta la edad.');
    else hist += e.edad <= 35 ? 2 : e.edad <= 39 ? 1 : 0;
    if (e.anios === null) avisos.push('Faltan los años de infertilidad.');
    else hist += e.anios <= 3 ? 2 : 0;
    if (e.embarazo) hist += 1;
    var minI = Math.min(e.ti, e.fi, e.oi), minD = Math.min(e.td, e.fd, e.od);
    var lf;
    if (e.sinOvI && e.sinOvD) lf = 0;
    else if (e.sinOvI) lf = Math.min(e.td, e.fd, e.od) * 2;
    else if (e.sinOvD) lf = Math.min(e.ti, e.fi, e.oi) * 2;
    else lf = minI + minD;
    var lfPts = lf >= 7 ? 3 : lf >= 4 ? 2 : 0;
    quir += lfPts;
    if (!e.rasrm || e.rasrm.total === 0) avisos.push('Sin rASRM cargado: se toma la lesión menor de 16 y el total menor de 71. Completá rASRM para que el EFI sea válido.');
    var les = e.rasrm ? e.rasrm.lesion : 0, tot = e.rasrm ? e.rasrm.total : 0;
    if (les < 16) quir += 1;
    if (tot < 71) quir += 1;
    if (!e.quirurgica) avisos.push('El EFI solo vale después de una cirugía con evaluación completa de trompas, fimbrias y ovarios.');
    var total = hist + quir;
    var cat = total <= 3 ? { color: 'rojo', txt: 'Pronóstico bajo de embarazo espontáneo. Derivar temprano a reproducción asistida (Maheux-Lacroix 2017; Tomassetti 2013).' }
      : total <= 6 ? { color: 'ambar', txt: 'Pronóstico intermedio. Decidir entre intento espontáneo o con baja complejidad y reproducción asistida según edad, reserva ovárica, trompas y factor masculino.' }
      : { color: 'verde', txt: 'Pronóstico favorable de embarazo espontáneo después de la cirugía.' };
    return { historia: hist, quirurgico: quir, lf: lf, lfPts: lfPts, total: total, cat: cat, avisos: avisos, valido: e.quirurgica && e.edad !== null && e.anios !== null };
  }

  /* ---------- Conducta (ESHRE 2022) ---------- */
  function conducta(o) {
    var b = [];
    function bloque(t, arr, color) { b.push({ t: t, l: arr.filter(Boolean), color: color || 'neutro' }); }
    if (o.objetivo === 'asin') {
      bloque('Hallazgo sin síntomas', [
        'No operar solo por el hallazgo (ESHRE 2022).',
        'Endometrioma: control según O-RADS (módulo Masa anexial).',
        'Profunda con dilatación del uréter o compromiso intestinal: evaluar aunque no haya dolor.'
      ], 'verde');
    }
    if (o.objetivo === 'dolor' || o.objetivo === 'ambos') {
      bloque('Dolor · primera línea', [
        'AINE: ibuprofeno 400 a 600 mg cada 6 a 8 h o naproxeno 550 mg cada 12 h, en ciclos cortos.',
        o.sinEstrogeno ? 'Estrógenos contraindicados: usar solo progestágenos (ver MEC).' : 'Anticonceptivo combinado oral, puede ser continuo, sin pausa.',
        'Progestágenos: dienogest 2 mg/día · desogestrel 75 mcg/día · acetato de noretisterona 5 mg/día (hasta 15 mg) · DIU de levonorgestrel 52 mg · medroxiprogesterona de depósito 150 mg IM cada 12 semanas (efecto sobre el hueso).'
      ], 'verde');
      bloque('Dolor · segunda línea', [
        'Antagonistas de GnRH: relugolix 40 mg + estradiol 1 mg + acetato de noretisterona 0,5 mg, 1 comprimido/día · elagolix 150 mg/día (hasta 24 meses) o 200 mg 2 veces/día (hasta 6 meses).',
        'Agonistas de GnRH: leuprorelina 3,75 mg IM mensual u 11,25 mg trimestral · goserelina 3,6 mg SC mensual.',
        'Con agonistas, add-back desde el inicio: acetato de noretisterona 5 mg/día, tibolona 2,5 mg/día o estradiol con progestágeno.',
        'Refractaria (sobre todo rectovaginal): inhibidores de aromatasa, letrozol 2,5 mg/día o anastrozol 1 mg/día, junto con supresión ovárica.',
        o.adolescente ? 'Adolescente: agonistas de GnRH solo en segunda línea, con add-back y por tiempo limitado, cuidando el hueso.' : ''
      ], 'ambar');
      bloque('Dolor · cirugía', [
        'Laparoscopía si no responde al tratamiento médico, si está contraindicado o si hay compromiso de órganos (dilatación del uréter, suboclusión intestinal).',
        'Endometrioma: quistectomía antes que drenaje o coagulación.',
        'Profunda: escisión en un centro con experiencia.',
        'Después de la cirugía, si no busca embarazo: DIU de levonorgestrel o anticonceptivo combinado prolongado para prevenir la recaída del dolor y del endometrioma.'
      ], 'naranja');
    }
    if (o.objetivo === 'fert' || o.objetivo === 'ambos') {
      bloque('Infertilidad', [
        'No dar supresión hormonal para mejorar la fertilidad: no aumenta el embarazo.',
        'Estadios rASRM I y II: laparoscopía operatoria (escisión o ablación), no solo diagnóstica. Después, calcular el EFI.',
        'I y II con trompas permeables: inseminación con estimulación ovárica.',
        'Endometrioma: no operar de rutina antes de la FIV. Operar si hay dolor o si impide la punción. Medir AMH y hablar de la reserva ovárica antes de operar.',
        'Profunda: elegir entre cirugía y FIV según dolor, edad y reserva ovárica.',
        'Antes de la FIV no hace falta dar agonistas de GnRH por 3 a 6 meses.',
        'Completar con edad, AMH, permeabilidad tubaria y factor masculino (módulos Pareja y Fertilidad).'
      ], 'ambar');
      b.push({ t: 'Evidencia preliminar', l: ['Profunda u ovárica diagnosticada por ecografía: un ensayo pequeño, detenido antes de tiempo, favoreció la FIV frente a la cirugía (Benaglia 2026). No cambia la conducta por sí solo.'], color: 'neutro' });
    }
    if (o.menopausia) bloque('Menopausia', [
      'Antecedente de endometriosis: THM combinada (estrógeno con progestágeno), también después de una histerectomía. Evitar el estrógeno solo.'
    ], 'ambar');
    bloque('Para todas', [
      'Riesgo absoluto bajo de cáncer de ovario asociado. No hay cribado de rutina; estudiar las masas anexiales con O-RADS.'
    ], 'neutro');
    return b;
  }

  /* ---------- Pantalla ---------- */
  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    function selLado(pref, ops, etq) { return '<div class="grid2">' + c.sel(pref + 'i', ops, etq + ' izquierdo') + c.sel(pref + 'd', ops, etq + ' derecho') + '</div>'; }
    function l04(id, etq) { return c.sel(id, [['4', '4'], ['3', '3'], ['2', '2'], ['1', '1'], ['0', '0']], etq); }
    cont.innerHTML =
      '<p class="ayuda">Flujo sugerido: síntomas y ecografía → #Enzian → rASRM y EFI si hubo cirugía → conducta.</p>' +

      '<h3 class="sub">1 · Sospecha clínica y ecografía IDEA</h3>' +
      c.grupo('Síntomas', SINTOMAS.map(function (x) { return c.chk('e-s-' + x[0], x[1]); }).join('')) +
      c.grupo('Ecografía sistemática en 4 pasos (IDEA)', IDEA.map(function (x) { return c.chk(x[0], x[1]); }).join('')) +
      '<div id="e-sosp" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ESHRE 2022 · IDEA (Guerriero 2016). La relación síntoma–compartimento es orientativa, no diagnóstica.</p>' +

      '<h3 class="sub">2 · #Enzian 2021</h3>' +
      '<div class="seg" role="radiogroup" aria-label="Método"><label class="opt-seg"><input type="radio" name="ez-m" value="u" checked><span>Ecografía (u)</span></label>' +
      '<label class="opt-seg"><input type="radio" name="ez-m" value="m"><span>RM (m)</span></label><label class="opt-seg"><input type="radio" name="ez-m" value="s"><span>Cirugía (s)</span></label></div>' +
      c.grupo('Peritoneo, ovarios y trompas', '<div class="form">' + c.sel('ez-p', OPS_P, 'P · Peritoneo (suma de diámetros)') + '</div>' +
        selLado('ez-o', OPS_O, 'O · Ovario (endometrioma mayor)') + selLado('ez-t', OPS_T, 'T · Adherencias tubo-ováricas') +
        '<div id="ez-perm">' + selLado('ez-pe', OPS_PERM, 'Permeabilidad tubaria') + '</div>') +
      c.grupo('Endometriosis profunda', '<div class="form">' + c.sel('ez-a', OPS_ABC, 'A · Vagina y tabique rectovaginal') + '</div>' +
        selLado('ez-b', OPS_ABC, 'B · Uterosacros, parametrios y pared pélvica') + '<div class="form">' + c.sel('ez-c', OPS_ABC, 'C · Recto y sigmoide') + '</div>') +
      c.grupo('Localizaciones F', F_LOC.map(function (x) { return c.chk('ez-f-' + x[0], x[0] + ' · ' + x[1]); }).join('') +
        '<label class="campo"><span>Otra localización (FO)</span><input id="ez-fo" type="text" maxlength="40" placeholder="ej. diafragma"></label>') +
      '<div id="ez-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: #Enzian (Keckstein J et al. Acta Obstet Gynecol Scand 2021;100:1165-1175) · ESHRE 2022</p>' +

      '<h3 class="sub">3 · rASRM (quirúrgica)</h3>' +
      c.grupo('Peritoneo', '<div class="grid2">' + c.sel('r-ps', R_PER_SUP, 'Superficial') + c.sel('r-pp', R_PER_PRO, 'Profunda') + '</div>') +
      c.grupo('Ovario izquierdo', '<div class="grid2">' + c.sel('r-ois', R_OV_SUP, 'Superficial') + c.sel('r-oip', R_OV_PRO, 'Profunda') + '</div>' + c.sel('r-oia', R_ADH, 'Adherencias')) +
      c.grupo('Ovario derecho', '<div class="grid2">' + c.sel('r-ods', R_OV_SUP, 'Superficial') + c.sel('r-odp', R_OV_PRO, 'Profunda') + '</div>' + c.sel('r-oda', R_ADH, 'Adherencias')) +
      c.grupo('Trompas', '<div class="grid2">' + c.sel('r-tia', R_ADH, 'Adherencias izquierda') + c.sel('r-tda', R_ADH, 'Adherencias derecha') + '</div>' +
        c.chk('r-tif', 'Fimbria izquierda totalmente cubierta (las densas pasan a 16)') + c.chk('r-tdf', 'Fimbria derecha totalmente cubierta (las densas pasan a 16)')) +
      c.grupo('Fondo de saco de Douglas', c.sel('r-dg', R_DOUG, 'Obliteración')) +
      '<div id="r-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: rASRM (Fertil Steril 1997;67:817-821)</p>' +

      '<h3 class="sub">4 · EFI · índice de fertilidad (solo posquirúrgico)</h3>' +
      c.chk('f-q', 'Hubo cirugía con evaluación completa de trompas, fimbrias y ovarios') +
      c.grupo('Historia', '<div class="grid2">' + c.campo('f-edad', 'Edad', 'años', '1') + c.campo('f-anios', 'Años de infertilidad', 'años', '0.5') + '</div>' + c.chk('f-emb', 'Embarazo previo')) +
      '<p class="ayuda">Función de cada estructura: 4 normal · 3 disfunción leve · 2 moderada · 1 severa · 0 ausente o no funcional.</p>' +
      c.grupo('Función al terminar la cirugía · lado izquierdo', '<div class="grid3">' + l04('f-ti', 'Trompa') + l04('f-fi', 'Fimbria') + l04('f-oi', 'Ovario') + '</div>' + c.chk('f-soi', 'Sin ovario izquierdo')) +
      c.grupo('Función al terminar la cirugía · lado derecho', '<div class="grid3">' + l04('f-td', 'Trompa') + l04('f-fd', 'Fimbria') + l04('f-od', 'Ovario') + '</div>' + c.chk('f-sod', 'Sin ovario derecho')) +
      '<div id="f-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: EFI (Adamson GD, Pasta DJ. Fertil Steril 2010;94:1609-1615) · Maheux-Lacroix S et al. Hum Reprod 2017;32:2243-2249</p>' +

      '<h3 class="sub">5 · Conducta</h3>' +
      '<div class="form">' + c.sel('k-obj', [['dolor', 'Dolor'], ['fert', 'Busca embarazo'], ['ambos', 'Dolor y busca embarazo'], ['asin', 'Hallazgo sin síntomas']], 'Objetivo') + '</div>' +
      c.chk('k-ado', 'Adolescente') + c.chk('k-sinE', 'Estrógenos contraindicados') + c.chk('k-meno', 'Menopausia o THM en evaluación') +
      '<div id="k-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ESHRE Guideline Endometriosis (Becker CM et al. Hum Reprod Open 2022;hoac009) · Sugerencia CaVeSal® para dosis habituales</p>' +

      '<div class="pq-acciones"><button type="button" class="btn-sec" id="e-copiar">Copiar resumen</button></div>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); }, ultimo = '';
    function metodo() { var r = cont.querySelector('input[name=ez-m]:checked'); return r ? r.value : 'u'; }
    function actualizar() {
      var s = {}; SINTOMAS.forEach(function (x) { s[x[0]] = L.c('e-s-' + x[0]); });
      var im = {}; IDEA.forEach(function (x) { im[x[0]] = L.c(x[0]); });
      var so = sospecha(s, im), h = [F('Resultado', '<strong>' + so.tit + '</strong>', so.txt, so.color)];
      if (so.mapa.length) h.push(F('Compartimento probable', c.ul(so.mapa), 'Orientativo: confirmar con la imagen.', 'neutro'));
      if (so.extra) h.push(F('Útero', so.extra, '', 'neutro'));
      q('#e-sosp').innerHTML = h.join('');

      var met = metodo();
      q('#ez-perm').hidden = met !== 's';
      var ez = enzian({ metodo: met, p: L.v('ez-p'), oi: L.v('ez-oi'), od: L.v('ez-od'), ti: L.v('ez-ti'), td: L.v('ez-td'), pi: met === 's' ? L.v('ez-pei') : '0', pd: met === 's' ? L.v('ez-ped') : '0',
        a: L.v('ez-a'), bi: L.v('ez-bi'), bd: L.v('ez-bd'), c: L.v('ez-c'), f: F_LOC.filter(function (x) { return L.c('ez-f-' + x[0]); }).map(function (x) { return x[0]; }), fo: L.v('ez-fo').trim() });
      q('#ez-out').innerHTML = F('Código #Enzian', '<strong>' + ez.codigo + '</strong>', ez.maxProf ? 'Grado máximo en profunda: ' + ez.maxProf : '', ez.color) + (ez.notas.length ? F('Planificación', c.ul(ez.notas), '', 'neutro') : '');

      var ra = rasrm({ perSup: L.v('r-ps'), perPro: L.v('r-pp'), oiSup: L.v('r-ois'), oiPro: L.v('r-oip'), odSup: L.v('r-ods'), odPro: L.v('r-odp'),
        oiAdh: L.v('r-oia').replace('d', ''), odAdh: L.v('r-oda').replace('d', ''), tiAdh: L.v('r-tia'), tdAdh: L.v('r-tda'), tiFim: L.c('r-tif'), tdFim: L.c('r-tdf'), doug: L.v('r-dg') });
      q('#r-out').innerHTML = F('rASRM', '<strong>' + ra.total + ' puntos · ' + ra.nombre + '</strong>', 'Lesiones ' + ra.lesion + ' · adherencias ' + ra.adherencias + ' · Douglas ' + ra.douglas + '. Estadios: I 1–5 · II 6–15 · III 16–40 · IV más de 40. Describe extensión; se correlaciona poco con el dolor y la fertilidad.', ra.color);

      var n = function (id) { return +L.v(id); };
      var ef = efi({ edad: L.n('f-edad'), anios: L.n('f-anios'), embarazo: L.c('f-emb'), quirurgica: L.c('f-q'), rasrm: ra,
        ti: n('f-ti'), fi: n('f-fi'), oi: n('f-oi'), td: n('f-td'), fd: n('f-fd'), od: n('f-od'), sinOvI: L.c('f-soi'), sinOvD: L.c('f-sod') });
      var eh = [F('EFI', '<strong>' + ef.total + ' / 10</strong>', 'Historia ' + ef.historia + ' · cirugía ' + ef.quirurgico + ' (función mínima ' + ef.lf + ' = ' + ef.lfPts + ' puntos)', ef.valido ? ef.cat.color : 'neutro')];
      if (ef.valido) eh.push(F('Pronóstico', ef.cat.txt, '', ef.cat.color));
      if (ef.avisos.length) eh.push(F('Atención', c.ul(ef.avisos), '', 'ambar'));
      q('#f-out').innerHTML = eh.join('');

      var k = conducta({ objetivo: L.v('k-obj'), adolescente: L.c('k-ado'), sinEstrogeno: L.c('k-sinE'), menopausia: L.c('k-meno') });
      q('#k-out').innerHTML = k.map(function (x) { return F(x.t, c.ul(x.l), '', x.color); }).join('');

      ultimo = 'Endometriosis · ' + so.tit + '.\n' + ez.codigo + '\n' +
        (ra.total ? 'rASRM ' + ra.total + ' puntos (' + ra.nombre + ').\n' : '') +
        (ef.valido ? 'EFI ' + ef.total + '/10.\n' : '') + 'CaVeSal® GYN · orientativo, no reemplaza el juicio clínico.';
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    q('#e-copiar').addEventListener('click', function () {
      var b = this, listo = function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar resumen'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ultimo).then(listo, listo); else listo();
    });
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.endometriosis = { sospecha: sospecha, enzian: enzian, rasrm: rasrm, efi: efi, conducta: conducta, render: render };
})(window);
