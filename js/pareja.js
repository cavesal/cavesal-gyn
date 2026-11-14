/* CaVeSal® GYN · Estudio de la pareja infértil: espermograma, REM, ovulación, reserva ovárica, útero y trompas, y siguiente paso.
   Algoritmo propio CaVeSal® · Basado en: OMS Manual de semen 6.ª ed. (2021) · OMS Guía de infertilidad (2025) ·
   ASRM 2026 (evaluación de la mujer infértil) · ASRM 2020 (reserva ovárica) · ASRM 2021 (cirugía tubaria) ·
   AUA/ASRM 2024 (infertilidad masculina) · ESHRE 2023 (esterilidad sin causa aparente) · ESHRE 2024 (IOP) ·
   POSEIDON · ESHRE Bologna 2011 · Guía internacional SOMP 2023 (Teede) · RCPI 2023 · Guías CaVeSal® de HC.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  var coma = function (n) { return String(Math.round(n * 10) / 10).replace('.', ','); };

  // Límites inferiores de referencia OMS 2021 (percentil 5).
  var OMS = { vol: 1.4, conc: 16, total: 39, mot: 42, prog: 30, morf: 4, vital: 54 };

  /* ---------- Cuándo estudiar ---------- */
  // d: { edad, meses, causa }
  function cuando(d) {
    if (d.edad === null && d.meses === null) return null;
    if (d.causa) return { tit: 'Estudiar ahora: hay una causa conocida o sospechada', color: 'ambar' };
    if (d.edad !== null && d.edad > 40) return { tit: 'Más de 40 años: estudiar de inmediato', color: 'ambar' };
    var lim = d.edad !== null && d.edad >= 35 ? 6 : 12;
    if (d.meses === null) return { tit: 'Estudiar a los ' + lim + ' meses de búsqueda', color: 'neutro' };
    if (d.meses >= lim) return { tit: 'Corresponde estudiar a la pareja (' + lim + ' meses o más)', color: 'ambar' };
    return { tit: 'Aún dentro del plazo: estudiar a los ' + lim + ' meses, antes si aparece una causa', color: 'verde' };
  }

  /* ---------- Espermograma ---------- */
  // d: { vol, conc, total, mot, prog, morf, vital, cripto }
  function espermo(d) {
    if (d.conc === null && d.vol === null && d.prog === null && d.morf === null) return null;
    var dx = [], con = [], color = 'verde';
    if (d.conc === 0) {
      var cr = !!d.cripto;
      return {
        dx: [cr ? 'Criptozoospermia' : 'Azoospermia'], azoo: !cr, cripto: cr, color: 'rojo',
        tit: cr ? 'Criptozoospermia: espermatozoides solo en el sedimento centrifugado' : 'Azoospermia',
        con: [
          cr ? 'Repetir y congelar espermatozoides si aparecen; ICSI.' : 'Confirmar en una segunda muestra centrifugada (OMS 2021).',
          'Urología/andrología: examen físico (deferentes, volumen testicular), FSH, testosterona, volumen y pH seminal (AUA/ASRM 2024).',
          'No obstructiva: cariotipo y microdeleciones del cromosoma Y. Agenesia de deferentes: estudio de CFTR.',
          'Opciones: recuperación quirúrgica de espermatozoides + ICSI o semen de donante.'
        ]
      };
    }
    var total = d.total !== null ? d.total : (d.vol !== null && d.conc !== null ? d.vol * d.conc : null);
    if (d.vol !== null && d.vol < OMS.vol) dx.push('Hipospermia');
    var oligo = (d.conc !== null && d.conc < OMS.conc) || (total !== null && total < OMS.total);
    var asteno = (d.prog !== null && d.prog < OMS.prog) || (d.mot !== null && d.mot < OMS.mot);
    var terato = d.morf !== null && d.morf < OMS.morf;
    if (oligo && asteno && terato) dx.push('Oligoastenoteratozoospermia (OAT)');
    else {
      if (oligo) dx.push('Oligozoospermia');
      if (asteno) dx.push('Astenozoospermia');
      if (terato) dx.push('Teratozoospermia');
    }
    if (d.vital !== null && d.vital < OMS.vital) dx.push('Necrozoospermia');
    var faltan = [];
    if (d.conc === null) faltan.push('concentración');
    if (d.prog === null) faltan.push('motilidad progresiva');
    if (d.morf === null) faltan.push('morfología');
    if (!dx.length) {
      return { dx: ['Normozoospermia'], normal: !faltan.length, color: faltan.length ? 'neutro' : 'verde', total: total, faltan: faltan,
        tit: faltan.length ? 'Sin alteraciones en lo cargado' : 'Normal según los límites OMS 2021',
        con: [faltan.length ? 'Falta: ' + faltan.join(', ') + '.' : 'Un estudio normal basta; no hace falta repetir (EAU).'] };
    }
    color = 'ambar';
    con.push('Repetir tras 11 semanas o más (OMS 2025) antes de definir el diagnóstico.');
    con.push('Urología/andrología: examen físico, FSH y testosterona (AUA/ASRM 2024).');
    if (d.conc !== null && d.conc < 5) {
      color = 'rojo';
      con.push('Menos de 5 M/mL: cariotipo, sobre todo con FSH elevada o atrofia testicular (AUA/ASRM 2024).');
      if (d.conc <= 1) con.push('1 M/mL o menos: microdeleciones del cromosoma Y (AUA/ASRM 2024).');
    }
    if (d.vol !== null && d.vol < OMS.vol) con.push('Volumen bajo: confirmar recolección completa y abstinencia; orina posteyaculación y descartar obstrucción.');
    con.push('Definir la técnica con el REM tras capacitación.');
    return { dx: dx, color: color, total: total, faltan: faltan, tit: dx.join(' · '), con: con };
  }

  /* ---------- REM (Sugerencia CaVeSal®, escala de la guía HC) ---------- */
  function rem(v) {
    if (v === null) return null;
    var nota = v < 5 ? 'Con menos de 5 M móviles tras el procesamiento baja el éxito de la IIU (AUA/ASRM 2024).' : '';
    if (v >= 5) return { tecnica: 'IIU', tit: 'IIU', color: 'verde', nota: nota };
    if (v >= 3) return { tecnica: 'IIU', tit: 'IIU posible (zona de 3 a 5 M)', color: 'ambar', nota: nota };
    if (v >= 1) return { tecnica: 'FIV', tit: 'FIV', color: 'naranja', nota: nota };
    return { tecnica: 'ICSI', tit: 'ICSI directo', color: 'rojo', nota: nota };
  }

  /* ---------- Ovulación y causa de anovulación ---------- */
  // d: { ciclo: 'reg'|'irreg'|'amen'|'', p4, edad, fsh, prl, tsh, hipo, hiperA, mop }
  function ovulacion(d) {
    if (!d.ciclo && d.p4 === null) return null;
    var anov, tit, color, con = [], causas = [];
    if (d.p4 !== null) {
      anov = d.p4 <= 3;
      tit = anov ? 'Progesterona lútea media de 3 o menos: no confirma ovulación' : 'Ovulatoria (progesterona lútea media mayor de 3)';
      if (!anov && d.p4 < 10) con.push('Confirma ovulación; por debajo del valor óptimo de la guía HC (10 o más).');
    } else if (d.ciclo === 'reg') {
      anov = false; tit = 'Ciclos regulares de 21 a 35 días: sugieren ovulación';
      con.push('No hace falta confirmarla con estudios (ASRM 2026). Si se quiere confirmar: progesterona de fase lútea media (OMS 2025).');
    } else {
      anov = true; tit = d.ciclo === 'amen' ? 'Amenorrea: anovulación' : 'Ciclos irregulares: probable oligo/anovulación';
    }
    if (!anov) return { anov: false, tit: tit, color: 'verde', con: con, causas: [] };
    color = 'ambar';
    if (d.fsh !== null && d.fsh > 25 && d.ciclo && d.ciclo !== 'reg') {
      if (d.edad !== null && d.edad < 40) causas.push({ id: 'iop', txt: 'Insuficiencia ovárica prematura probable (menos de 40 años, FSH mayor de 25 y oligo/amenorrea de 4 meses o más). Repetir FSH a las 4 a 6 semanas solo si hay duda (ESHRE 2024). Consejería: ovodonación y terapia hormonal hasta la edad de la menopausia.' });
      else causas.push({ id: 'iop', txt: 'FSH mayor de 25 con 40 años o más: falla ovárica. Consejería: ovodonación.' });
      color = 'rojo';
    }
    if (d.prl !== null && d.prl > 25) causas.push({ id: 'prl', txt: 'Prolactina elevada: repetir, descartar fármacos, hipotiroidismo y macroprolactina; RM de silla turca si persiste; agonista dopaminérgico. Ver guía Hiperprolactinemia.' });
    if (d.tsh !== null && d.tsh > 4) causas.push({ id: 'tsh', txt: 'TSH alterada: completar con anti-TPO y tratar antes de inducir (módulo Preconcepcional, ATA 2017).' });
    if (d.hipo) causas.push({ id: 'hipo', txt: 'Hipogonadismo hipogonadotrópico: gonadotropinas o GnRH pulsátil; evaluar peso, ejercicio y estrés.' });
    if (d.hiperA || d.mop) causas.push({ id: 'somp', txt: 'Compatible con SOMP: completar criterios en el módulo SOMP. Letrozol de primera línea para inducir la ovulación (guía internacional 2023, OMS 2025).' });
    if (!causas.length) causas.push({ id: 'nd', txt: 'Sin causa definida: FSH, estradiol, prolactina, TSH y andrógenos; evaluar SOMP.' });
    return { anov: true, tit: tit, color: color, con: con, causas: causas };
  }

  /* ---------- Reserva ovárica ---------- */
  // d: { edad, rfaD, rfaI, amh }
  function reserva(d) {
    var tot = d.rfaD !== null && d.rfaI !== null ? d.rfaD + d.rfaI : null;
    var max = Math.max(d.rfaD === null ? -1 : d.rfaD, d.rfaI === null ? -1 : d.rfaI);
    if (tot === null && d.amh === null && max < 0) return null;
    var e35 = d.edad !== null && d.edad >= 35, con = [], tit, color, cat;
    var uso = 'Predice la respuesta a la estimulación, no el embarazo espontáneo; no se usa para negar tratamiento (ASRM 2020).';
    if ((tot !== null && tot < 5) || (d.amh !== null && d.amh < 1.2)) {
      cat = 'baja'; tit = 'Reserva baja (POSEIDON: RFA menor de 5 o AMH menor de 1,2 ng/mL)'; color = e35 ? 'rojo' : 'naranja';
      con.push(uso);
      con.push(e35 ? '35 años o más: no demorar; derivar a reproducción asistida.' : 'Menor de 35: no demorar el estudio; considerar la respuesta esperada al planificar la estimulación.');
    } else if (max >= 20) {
      cat = 'alta'; tit = '20 folículos o más en un ovario: criterio de morfología ovárica del SOMP'; color = 'ambar';
      con.push('Con transductor de 8 MHz o más (guía internacional 2023). Completar en el módulo SOMP.');
      con.push('Mayor riesgo de respuesta excesiva a la estimulación ovárica.');
    } else if (tot !== null && tot <= 7) {
      cat = 'limite'; tit = 'RFA de 5 a 7: dentro del rango de baja reserva de Bologna (menor de 5 a 7)'; color = 'ambar';
      con.push(uso);
      if (e35) con.push('35 años o más: no demorar el estudio ni el tratamiento.');
    } else {
      cat = 'normal'; tit = 'Sin criterios de reserva baja'; color = 'verde';
      con.push(uso);
    }
    return { cat: cat, tit: tit, color: color, con: con, total: tot };
  }

  /* ---------- Útero y trompas ---------- */
  // d: { eco: {polipo, mioma, septo, sineq, hidro, endom, adeno}, prueba: 'no'|'hsg'|'hycosy'|'lap', res: 'perm'|'uni'|'bil'|'hidro'|'', riesgo, clam: 'pos'|'neg'|'' }
  function uteroTrompas(d) {
    var e = d.eco || {}, con = [], color = 'verde', intra = e.polipo || e.mioma || e.septo || e.sineq;
    var hidro = e.hidro || d.res === 'hidro', alto = d.riesgo || d.clam === 'pos' || e.endom || hidro;
    if (intra) { con.push('Lesión intracavitaria (pólipo, mioma submucoso, septo o sinequias): histeroscopía para confirmar y tratar. Ver módulo Útero.'); color = 'ambar'; }
    if (e.adeno) con.push('Adenomiosis: ver módulo Útero (MUSA).');
    if (e.endom) con.push('Endometrioma: sospecha de endometriosis; derivar a reproducción.');
    var tubo = null;
    if (!d.prueba || d.prueba === 'no') {
      tubo = alto ? 'Riesgo tubario alto (clamidia o EPI, endometriosis, cirugía pélvica, ectópico, hidrosálpinx): prueba visual con laparoscopía y cromopertubación.' : 'Permeabilidad tubaria pendiente: HSG o HyCoSy/HyFoSy, equivalentes (ASRM 2026, OMS 2025).';
      if (color === 'verde') color = 'neutro';
    } else if (d.res === 'bil') { tubo = 'Obstrucción tubaria bilateral: FIV/ICSI (alta complejidad).'; color = 'rojo'; if (d.prueba === 'hsg') con.push('La obstrucción proximal en la HSG puede ser falso positivo (ASRM 2021).'); }
    else if (d.res === 'uni') { tubo = 'Obstrucción unilateral: individualizar (expectante, IIU con estimulación o FIV según el resto del estudio).'; if (color === 'verde') color = 'ambar'; }
    else if (d.res === 'perm') tubo = 'Trompas permeables.';
    else if (d.res !== 'hidro') { tubo = 'Cargá el resultado de la prueba tubaria.'; if (color === 'verde') color = 'neutro'; }
    if (hidro) { con.push('Hidrosálpinx: salpingectomía u oclusión proximal antes de la FIV (ASRM 2021).'); color = 'rojo'; }
    if (tubo) con.unshift(tubo);
    if (alto || (d.prueba && d.prueba !== 'no' && d.res && d.res !== 'perm')) con.push('PCR endocervical de clamidia y gonorrea según riesgo, tratando a ambos. Mycoplasma y Ureaplasma: solo con clínica (cervicitis, uretritis, EPI); ASRM, ESHRE y OMS no indican su estudio de rutina.');
    if (d.clam === 'pos') con.push('Serología de clamidia positiva: mayor riesgo de daño tubario (triage ESHRE).');
    return { color: color, con: con, intra: !!intra, hidro: !!hidro, bil: d.res === 'bil', perm: d.res === 'perm', pendiente: !d.prueba || d.prueba === 'no', uni: d.res === 'uni' };
  }

  /* ---------- Siguiente paso de la pareja ---------- */
  // x: { es, rm, ov, rs, ut, cervical, sexual, edad, prono: 'bueno'|'malo'|'' }
  function siguiente(x) {
    var pasos = [], faltan = [];
    if (!x.es) faltan.push('espermograma');
    if (!x.ov) faltan.push('evaluación ovulatoria');
    if (!x.ut || x.ut.pendiente) faltan.push('permeabilidad tubaria');
    if (x.es && x.es.azoo) pasos.push(['rojo', 'Azoospermia: urología; recuperación de espermatozoides + ICSI o semen de donante.']);
    if (x.ut && (x.ut.bil || x.ut.hidro)) pasos.push(['rojo', 'Factor tubario: FIV/ICSI' + (x.ut.hidro ? ', con salpingectomía u oclusión proximal previa' : '') + '.']);
    if (x.rm && x.rm.tecnica !== 'IIU') pasos.push([x.rm.color, 'Factor masculino por REM: ' + x.rm.tit + ' (Sugerencia CaVeSal®).']);
    if (x.ov && x.ov.anov && x.ov.causas.some(function (c) { return c.id === 'iop'; })) pasos.push(['rojo', 'Falla ovárica: consejería y ovodonación.']);
    if (x.ut && x.ut.intra) pasos.push(['ambar', 'Histeroscopía antes del tratamiento.']);
    if (x.ov && x.ov.anov && !x.ov.causas.some(function (c) { return c.id === 'iop'; })) pasos.push(['ambar', 'Anovulación: tratar la causa e inducir la ovulación (SOMP: letrozol).']);
    if (x.rs && x.rs.cat === 'baja' && x.edad !== null && x.edad >= 35) pasos.push(['naranja', 'Reserva baja con 35 años o más: derivar a reproducción asistida sin demora.']);
    if (x.cervical || x.sexual) pasos.push(['ambar', 'Factor cervical o disfunción sexual: IIU (RCPI 2023).']);
    if (x.rm && x.rm.tecnica === 'IIU' && x.es && !x.es.normal && !x.es.azoo) pasos.push([x.rm.color, 'Factor masculino leve: ' + x.rm.tit + ' (Sugerencia CaVeSal®).']);
    if (x.ut && x.ut.uni && !pasos.length) pasos.push(['ambar', 'Obstrucción unilateral: individualizar.']);
    var esca = !pasos.length && !faltan.length && x.es && x.es.normal && x.ov && !x.ov.anov && x.ut && x.ut.perm && !x.ut.intra;
    if (esca) {
      if (x.prono === 'bueno') pasos.push(['verde', 'Esterilidad sin causa aparente con buen pronóstico: manejo expectante (OMS 2025: antes que IIU sin estimulación; ESHRE 2023).']);
      else if (x.prono === 'malo') pasos.push(['ambar', 'Esterilidad sin causa aparente con pronóstico desfavorable: IIU con estimulación ovárica 3 a 6 ciclos; sin embarazo, FIV (ESHRE 2023).']);
      else pasos.push(['neutro', 'Esterilidad sin causa aparente: definir el pronóstico de embarazo espontáneo (edad, años de búsqueda, embarazo previo; modelo de Hunault, ESHRE 2023).']);
    }
    return { pasos: pasos, faltan: faltan, esca: !!esca };
  }

  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">Cada bloque calcula su resultado. Al final, el siguiente paso de la pareja según lo cargado.</p>' +
      '<h3 class="sub">Cuándo estudiar</h3>' +
      '<div class="form">' + c.campo('pa-edad', 'Edad de la mujer', 'años', '1') + c.campo('pa-meses', 'Meses buscando embarazo', 'meses', '1') + '</div>' +
      c.chk('pa-causa', 'Causa conocida o sospechada (oligo/amenorrea, endometriosis, EPI, cirugía pélvica, quimio o radioterapia, factor masculino)') +
      '<div id="pa-o0" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">Factor masculino · espermograma (OMS 2021)</h3>' +
      '<div class="form">' + c.campo('pa-vol', 'Volumen', 'mL') + c.campo('pa-conc', 'Concentración', 'M/mL') + c.campo('pa-tot', 'Total por eyaculado (opcional)', 'M') +
        c.campo('pa-mot', 'Motilidad total', '%', '1') + c.campo('pa-prog', 'Motilidad progresiva', '%', '1') + c.campo('pa-morf', 'Formas normales', '%', '1') + c.campo('pa-vit', 'Vitalidad (opcional)', '%', '1') + '</div>' +
      c.chk('pa-cripto', 'Concentración 0 con espermatozoides en el sedimento centrifugado') +
      '<div id="pa-o1" class="resultados" aria-live="polite"></div>' +
      '<div class="form">' + c.campo('pa-rem', 'REM tras capacitación', 'millones') + '</div>' +
      '<div id="pa-o2" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: OMS Manual de semen 6.ª ed. (2021) · OMS 2025 · AUA/ASRM 2024 · EAU · REM: Sugerencia CaVeSal® (guía HC Espermiograma y REM)</p>' +

      '<h3 class="sub">Factor ovulatorio</h3>' +
      '<div class="form">' + c.sel('pa-ciclo', [['', 'Elegí'], ['reg', 'Regulares (21 a 35 días)'], ['irreg', 'Irregulares'], ['amen', 'Amenorrea']], 'Ciclos') +
        c.campo('pa-p4', 'Progesterona lútea media', 'ng/mL') + c.campo('pa-fsh', 'FSH', 'mUI/mL') + c.campo('pa-prl', 'Prolactina', 'ng/mL') + c.campo('pa-tsh', 'TSH', 'µUI/mL', '0.01') + '</div>' +
      c.chk('pa-ha', 'Hiperandrogenismo clínico o bioquímico') + c.chk('pa-mop', 'Morfología ovárica de SOMP en la ecografía') + c.chk('pa-hipo', 'FSH y LH bajas con estradiol bajo (hipogonadismo hipogonadotrópico)') +
      '<div id="pa-o3" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ASRM 2026 · OMS 2025 · ESHRE POI 2024 · Guía internacional SOMP 2023 (Teede) · ATA 2017</p>' +

      '<h3 class="sub">Reserva ovárica</h3>' +
      '<div class="form">' + c.campo('pa-rd', 'RFA ovario derecho', 'folículos', '1') + c.campo('pa-ri', 'RFA ovario izquierdo', 'folículos', '1') + c.campo('pa-amh', 'AMH', 'ng/mL', '0.01') + '</div>' +
      '<div id="pa-o4" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ASRM 2020 · POSEIDON · ESHRE Bologna 2011 · Guía internacional SOMP 2023 (Teede)</p>' +

      '<h3 class="sub">Útero y trompas</h3>' +
      c.grupo('Ecografía transvaginal', c.chk('pa-e1', 'Pólipo endometrial') + c.chk('pa-e2', 'Mioma submucoso (FIGO 0 a 2)') + c.chk('pa-e3', 'Septo uterino') + c.chk('pa-e4', 'Sospecha de sinequias') +
        c.chk('pa-e5', 'Hidrosálpinx') + c.chk('pa-e6', 'Endometrioma') + c.chk('pa-e7', 'Adenomiosis')) +
      '<div class="form">' + c.sel('pa-prueba', [['no', 'No realizada'], ['hsg', 'HSG'], ['hycosy', 'HyCoSy o HyFoSy'], ['lap', 'Laparoscopía con cromopertubación']], 'Prueba tubaria') +
        c.sel('pa-res', [['', 'Sin dato'], ['perm', 'Permeables bilateral'], ['uni', 'Obstrucción unilateral'], ['bil', 'Obstrucción bilateral'], ['hidro', 'Hidrosálpinx']], 'Resultado') +
        c.sel('pa-clam', [['', 'Sin dato'], ['neg', 'Negativa'], ['pos', 'Positiva']], 'Serología de clamidia') + '</div>' +
      c.chk('pa-rt', 'Antecedente de EPI, clamidia, endometriosis, cirugía pélvica o ectópico') +
      '<div id="pa-o5" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ASRM 2026 · ASRM 2021 (cirugía tubaria) · OMS 2025 · ESHRE 2023</p>' +

      '<h3 class="sub">Otros factores</h3>' +
      c.chk('pa-cerv', 'Factor cervical (estenosis, conización previa)') + c.chk('pa-sex', 'Disfunción sexual o imposibilidad de coito vaginal') +
      '<p class="ayuda">El test poscoital no se recomienda (ASRM 2026).</p>' +
      '<div class="form">' + c.sel('pa-prono', [['', 'Sin definir'], ['bueno', 'Bueno'], ['malo', 'Desfavorable']], 'Pronóstico de embarazo espontáneo (si todo es normal)') + '</div>' +

      '<h3 class="sub">Siguiente paso de la pareja</h3>' +
      '<div id="pa-o6" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: OMS 2025 · ASRM 2026 · ESHRE 2023 · AUA/ASRM 2024 · ASRM 2021 · RCPI 2023 · Guías CaVeSal® de HC: «Algoritmo de estudio de la pareja infértil», «Espermiograma y REM», «Reserva ovárica»</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function bloque(o, nombre) { return F(nombre, '<strong>' + o.tit + '</strong>', '', o.color) + (o.con && o.con.length ? F('Conducta', c.ul(o.con), '', o.color) : ''); }
    function actualizar() {
      var edad = L.n('pa-edad');
      var cu = cuando({ edad: edad, meses: L.n('pa-meses'), causa: L.c('pa-causa') });
      q('#pa-o0').innerHTML = cu ? F('Estudio', '<strong>' + cu.tit + '</strong>', 'Estudiar a ambos en paralelo (OMS 2025, ASRM 2026).', cu.color) : '';

      var es = espermo({ vol: L.n('pa-vol'), conc: L.n('pa-conc'), total: L.n('pa-tot'), mot: L.n('pa-mot'), prog: L.n('pa-prog'), morf: L.n('pa-morf'), vital: L.n('pa-vit'), cripto: L.c('pa-cripto') });
      q('#pa-o1').innerHTML = es ? F('Espermograma', '<strong>' + es.tit + '</strong>', es.total !== null && es.total !== undefined ? 'Total por eyaculado: ' + coma(es.total) + ' M (límite 39).' : '', es.color) + F('Conducta', c.ul(es.con), '', es.color) : F('Espermograma', 'Cargá los valores.', '', 'neutro');
      var rm = rem(L.n('pa-rem'));
      q('#pa-o2').innerHTML = rm ? F('REM', '<strong>' + rm.tit + '</strong> · Sugerencia CaVeSal®', 'Escala de la guía HC: más de 3 a 5 M → IIU · 1 a 3 M → FIV · menos de 1 M → ICSI directo. ' + rm.nota, rm.color) : '';

      var ov = ovulacion({ ciclo: L.v('pa-ciclo'), p4: L.n('pa-p4'), edad: edad, fsh: L.n('pa-fsh'), prl: L.n('pa-prl'), tsh: L.n('pa-tsh'), hipo: L.c('pa-hipo'), hiperA: L.c('pa-ha'), mop: L.c('pa-mop') });
      q('#pa-o3').innerHTML = ov ? F('Ovulación', '<strong>' + ov.tit + '</strong>', ov.con.join(' '), ov.color) + (ov.causas.length ? F('Causa y conducta', c.ul(ov.causas.map(function (x) { return x.txt; })), '', ov.color) : '') : F('Ovulación', 'Elegí el patrón de ciclos o cargá la progesterona.', '', 'neutro');

      var rs = reserva({ edad: edad, rfaD: L.n('pa-rd'), rfaI: L.n('pa-ri'), amh: L.n('pa-amh') });
      q('#pa-o4').innerHTML = rs ? bloque(rs, 'Reserva' + (rs.total !== null ? ' · RFA total ' + rs.total : '')) : F('Reserva', 'Cargá la RFA de cada ovario o la AMH.', '', 'neutro');

      var ut = uteroTrompas({ eco: { polipo: L.c('pa-e1'), mioma: L.c('pa-e2'), septo: L.c('pa-e3'), sineq: L.c('pa-e4'), hidro: L.c('pa-e5'), endom: L.c('pa-e6'), adeno: L.c('pa-e7') }, prueba: L.v('pa-prueba'), res: L.v('pa-res'), riesgo: L.c('pa-rt'), clam: L.v('pa-clam') });
      q('#pa-o5').innerHTML = F('Útero y trompas', c.ul(ut.con), '', ut.color);

      var sg = siguiente({ es: es, rm: rm, ov: ov, rs: rs, ut: ut, cervical: L.c('pa-cerv'), sexual: L.c('pa-sex'), edad: edad, prono: L.v('pa-prono') });
      var h = sg.pasos.map(function (p, i) { return F(i === 0 ? 'Siguiente paso' : 'Además', p[1], '', p[0]); });
      if (sg.faltan.length) h.push(F('Falta para completar el estudio', sg.faltan.join(', ').replace(/^./, function (x) { return x.toUpperCase(); }) + '.', '', 'neutro'));
      if (!h.length) h.push(F('Siguiente paso', 'Cargá los resultados del estudio.', '', 'neutro'));
      q('#pa-o6').innerHTML = h.join('');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.pareja = { OMS: OMS, cuando: cuando, espermo: espermo, rem: rem, ovulacion: ovulacion, reserva: reserva, uteroTrompas: uteroTrompas, siguiente: siguiente, render: render };
})(window);
