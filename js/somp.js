/* CaVeSal® GYN · SOMP (síndrome ovárico metabólico poliendocrino): criterios 2023, fenotipo, HOMA-IR y estado glucémico.
   Algoritmo propio CaVeSal® · Basado en: Teede HJ et al. Recomendaciones de la guía internacional 2023 (JCEM 2023;108:2447-2469) ·
   Teede HJ et al. Lancet 2026;407:2329-2339 (nuevo nombre, criterios sin cambios) · Matthews DR et al. Diabetologia 1985 (HOMA) ·
   ADA Standards of Care (criterios fuera del embarazo) · OMS 2025 · Guías CaVeSal® de HC.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  var coma = function (n) { return String(n).replace('.', ','); };

  // d: { anosMenarca, ciclo: 'reg'|'irreg'|'amen'|'', anovReg, hirs, bioq, rfa, vol, amhAlta, tsh, prl, ohp }
  function criterios(d) {
    var od = d.ciclo === 'irreg' || d.ciclo === 'amen' || !!d.anovReg;
    var ha = !!(d.hirs || d.bioq);
    var adol = d.anosMenarca !== null && d.anosMenarca !== undefined && d.anosMenarca < 8;
    var mopEval = d.rfa !== null || d.vol !== null || !!d.amhAlta;
    var mop = (d.rfa !== null && d.rfa >= 20) || (d.vol !== null && d.vol >= 10) || !!d.amhAlta;
    if (!d.ciclo && !d.anovReg && !ha && !mopEval) return null;
    var excl = [];
    if (!d.tsh) excl.push('TSH');
    if (!d.prl) excl.push('prolactina');
    if (!d.ohp) excl.push('17-OH progesterona');
    var r = { od: od, ha: ha, mop: adol ? false : mop, adol: adol, excl: excl, notas: [] };
    if (adol) {
      r.dx = od && ha;
      r.tit = r.dx ? 'Cumple criterios de SOMP en la adolescencia (disfunción ovulatoria e hiperandrogenismo)' : (od || ha ? 'Riesgo aumentado de SOMP: reevaluar' : 'No cumple criterios');
      r.color = r.dx ? 'ambar' : (od || ha ? 'ambar' : 'verde');
      r.notas.push('Menos de 8 años desde la menarca: no usar ecografía ni AMH para el diagnóstico (guía 2023).');
      if (!r.dx && (od || ha)) r.notas.push('Reevaluar a los 8 años de la menarca o antes según la clínica.');
      return fin(r);
    }
    var n = (od ? 1 : 0) + (ha ? 1 : 0) + (mop ? 1 : 0);
    r.n = n; r.dx = n >= 2;
    if (r.dx) {
      if (od && ha && mop) r.fen = 'A (hiperandrogenismo + disfunción ovulatoria + morfología)';
      else if (od && ha) r.fen = mopEval ? 'B (hiperandrogenismo + disfunción ovulatoria, morfología normal)' : 'A o B (sin ecografía ni AMH: no hacen falta para el diagnóstico)';
      else if (ha && mop) r.fen = 'C (hiperandrogenismo + morfología, ciclos ovulatorios)';
      else r.fen = 'D (disfunción ovulatoria + morfología, sin hiperandrogenismo)';
    }
    r.tit = r.dx ? 'Cumple criterios de SOMP (' + n + ' de 3)' : n + ' de 3 criterios: no cumple';
    r.color = r.dx ? 'ambar' : 'verde';
    if (od && ha && !mopEval) r.notas.push('Con ciclos irregulares e hiperandrogenismo no hace falta ecografía ni AMH (guía 2023).');
    if (!r.dx && n === 1 && !mopEval) r.notas.push('Falta evaluar la morfología ovárica (20 folículos o más por ovario o volumen de 10 mL o más, con transductor de 8 MHz o más; o AMH).');
    return fin(r);
    function fin(x) {
      if (x.dx && x.excl.length) x.notas.push('Diagnóstico de exclusión: falta descartar con ' + x.excl.join(', ') + ' (y embarazo).');
      return x;
    }
  }

  function homa(g, i) {
    if (g === null || i === null || g <= 0 || i <= 0) return null;
    return Math.round(g * i / 405 * 10) / 10;
  }

  // ADA, fuera del embarazo. d: { ay, h2, a1c }
  function glucemia(d) {
    var r = [], peor = 0;
    function add(txt, nivel) { r.push(txt); if (nivel > peor) peor = nivel; }
    if (d.ay !== null) add('Ayunas ' + coma(d.ay) + ' mg/dL: ' + (d.ay >= 126 ? 'rango de diabetes' : d.ay >= 100 ? 'glucemia en ayunas alterada' : 'normal'), d.ay >= 126 ? 2 : d.ay >= 100 ? 1 : 0);
    if (d.h2 !== null) add('PTOG 2 h ' + coma(d.h2) + ' mg/dL: ' + (d.h2 >= 200 ? 'rango de diabetes' : d.h2 >= 140 ? 'intolerancia a la glucosa' : 'normal'), d.h2 >= 200 ? 2 : d.h2 >= 140 ? 1 : 0);
    if (d.a1c !== null) add('HbA1c ' + coma(d.a1c) + ' %: ' + (d.a1c >= 6.5 ? 'rango de diabetes' : d.a1c >= 5.7 ? 'prediabetes' : 'normal'), d.a1c >= 6.5 ? 2 : d.a1c >= 5.7 ? 1 : 0);
    if (!r.length) return null;
    return { items: r, nivel: peor, color: ['verde', 'ambar', 'rojo'][peor], nota: peor === 2 ? 'Un solo valor en rango de diabetes se confirma con una segunda prueba (ADA).' : '' };
  }

  function imc(p, t) { if (!p || !t) return null; if (t > 3) t = t / 100; return Math.round(p / (t * t) * 10) / 10; }

  // x: { cr, imc, h2, embarazo, adol }
  function conducta(x) {
    var c = ['Estilo de vida (alimentación y actividad física) en todas.'];
    if (x.imc !== null && x.imc >= 25 && !x.adol) c.push('IMC de 25 o más: metformina para resultados metabólicos (guía 2023).');
    if (x.embarazo) {
      if (x.h2 === null) c.push('Planifica embarazo: PTOG con 75 g (guía 2023).');
      if (x.cr && x.cr.od) c.push('Inducción de la ovulación: letrozol de primera línea (guía 2023, OMS 2025). Ver módulos Fertilidad y Estudio de la pareja.');
    }
    c.push('Valorar el estado glucémico al diagnóstico y cada 1 a 3 años; perfil lipídico y presión arterial.');
    c.push('Tamizaje de ansiedad, depresión y trastornos de la conducta alimentaria (guía 2023).');
    return c;
  }

  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">SOMP es el nombre nuevo del síndrome (Lancet 2026); los criterios diagnósticos de la guía internacional 2023 no cambiaron.</p>' +
      '<h3 class="sub">Criterios diagnósticos (guía internacional 2023)</h3>' +
      '<div class="form">' + c.campo('so-men', 'Años desde la menarca', 'años', '1') +
        c.sel('so-ciclo', [['', 'Elegí'], ['reg', 'Regulares (21 a 35 días)'], ['irreg', 'Irregulares (menos de 21 o más de 35 días, o menos de 8 por año)'], ['amen', 'Amenorrea']], 'Ciclos') + '</div>' +
      c.chk('so-anov', 'Anovulación confirmada con ciclos regulares (progesterona lútea media)') +
      c.grupo('Hiperandrogenismo', c.chk('so-hirs', 'Clínico: hirsutismo (Ferriman-Gallwey modificado de 4 a 6 o más según etnia), acné o alopecia androgénica') +
        c.chk('so-bioq', 'Bioquímico: testosterona total o libre, o índice de andrógenos libres, elevados')) +
      '<div class="form">' + c.campo('so-rfa', 'Folículos por ovario (el mayor)', 'n', '1') + c.campo('so-vol', 'Volumen ovárico (el mayor)', 'mL') + '</div>' +
      c.chk('so-amh', 'AMH elevada según el laboratorio') +
      c.grupo('Exclusiones con resultado normal', c.chk('so-tsh', 'TSH') + c.chk('so-prl', 'Prolactina') + c.chk('so-ohp', '17-OH progesterona')) +
      '<div id="so-o1" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">Metabolismo</h3>' +
      '<div class="form">' + c.campo('so-peso', 'Peso', 'kg') + c.campo('so-talla', 'Talla', 'cm', '0.5') +
        c.campo('so-glu', 'Glucemia en ayunas', 'mg/dL', '1') + c.campo('so-ins', 'Insulina en ayunas', 'µU/mL') +
        c.campo('so-h2', 'PTOG 75 g a las 2 h', 'mg/dL', '1') + c.campo('so-a1c', 'HbA1c', '%') + '</div>' +
      c.chk('so-emb', 'Planifica embarazo o tratamiento de fertilidad') +
      '<div id="so-o2" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Teede HJ et al. Guía internacional 2023 (JCEM 2023;108:2447-2469) · Teede HJ et al. Lancet 2026 · Matthews DR et al. Diabetologia 1985 · ADA Standards of Care · OMS 2025 · Guías CaVeSal® de HC: «SOMP», «Insulinorresistencia — HOMA-IR y PTOG en SOMP»</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function actualizar() {
      var cr = criterios({ anosMenarca: L.n('so-men'), ciclo: L.v('so-ciclo'), anovReg: L.c('so-anov'), hirs: L.c('so-hirs'), bioq: L.c('so-bioq'), rfa: L.n('so-rfa'), vol: L.n('so-vol'), amhAlta: L.c('so-amh'), tsh: L.c('so-tsh'), prl: L.c('so-prl'), ohp: L.c('so-ohp') });
      var h = [];
      if (!cr) h.push(F('SOMP', 'Cargá los ciclos, el hiperandrogenismo o la morfología ovárica.', '', 'neutro'));
      else {
        h.push(F('Diagnóstico', '<strong>' + cr.tit + '</strong>' + (cr.fen ? ' · fenotipo ' + cr.fen : ''), '', cr.color));
        if (cr.notas.length) h.push(F('Notas', c.ul(cr.notas), '', cr.excl.length && cr.dx ? 'ambar' : 'neutro'));
      }
      q('#so-o1').innerHTML = h.join('');

      var im = imc(L.n('so-peso'), L.n('so-talla')), ho = homa(L.n('so-glu'), L.n('so-ins'));
      var gl = glucemia({ ay: L.n('so-glu'), h2: L.n('so-h2'), a1c: L.n('so-a1c') }), m = [];
      if (im !== null) m.push(F('IMC', coma(im), '', im >= 30 ? 'naranja' : im >= 25 ? 'ambar' : 'verde'));
      if (ho !== null) m.push(F('HOMA-IR', '<strong>' + coma(ho) + '</strong>', 'Glucemia (mg/dL) × insulina (µU/mL) / 405. Sin punto de corte universal: varía según población, IMC y método de insulina. La guía 2023 no recomienda medir insulina ni HOMA-IR en la práctica de rutina; usarlo como dato descriptivo.', 'neutro'));
      if (gl) m.push(F('Estado glucémico (ADA, fuera del embarazo)', c.ul(gl.items), gl.nota, gl.color));
      if (cr && cr.dx) m.push(F('Conducta', c.ul(conducta({ cr: cr, imc: im, h2: L.n('so-h2'), embarazo: L.c('so-emb'), adol: cr.adol })), '', 'ambar'));
      q('#so-o2').innerHTML = m.join('');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.somp = { criterios: criterios, homa: homa, glucemia: glucemia, imc: imc, conducta: conducta, render: render };
})(window);
