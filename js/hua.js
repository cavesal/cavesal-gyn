/* CaVeSal® GYN · Sangrado uterino anormal (HUA/SUA): patrón FIGO, tamizaje de coagulopatía, PALM-COEIN y conducta.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · Munro MG et al., FIGO 2018 (sistemas 1 y 2) ·
   ACOG Committee Opinion 557 (2013, sangrado agudo) · ACOG Practice Bulletin 128 (2012) · ACOG Committee Opinion 785 (2019, adolescentes) ·
   ACOG Committee Opinion 734 (2018, sangrado posmenopáusico).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function coma(n) { return String(n).replace('.', ','); }

  // Sistema 1 FIGO 2018: frecuencia 24–38 d, duración ≤ 8 d, variación ≤ 7–9 d (≤ 9 entre 18–25 y 42–45 años).
  function patron(d) {
    var h = [], anormal = false;
    if (d.posmeno) return { items: ['Sangrado en la posmenopausia: siempre se estudia el endometrio.'], anormal: true };
    if (d.frec !== null) {
      if (d.frec < 24) { h.push('Frecuencia ' + d.frec + ' días: frecuente (menos de 24)'); anormal = true; }
      else if (d.frec > 38) { h.push('Frecuencia ' + d.frec + ' días: infrecuente (más de 38)'); anormal = true; }
      else h.push('Frecuencia ' + d.frec + ' días: normal (24 a 38)');
    }
    if (d.dur !== null) {
      if (d.dur > 8) { h.push('Duración ' + d.dur + ' días: prolongada (más de 8)'); anormal = true; }
      else h.push('Duración ' + d.dur + ' días: normal (hasta 8)');
    }
    if (d.var !== null) {
      var lim = (d.edad !== null && ((d.edad >= 18 && d.edad <= 25) || (d.edad >= 42 && d.edad <= 45))) ? 9 : 7;
      if (d.var > lim) { h.push('Variación entre el ciclo más corto y el más largo ' + d.var + ' días: irregular (más de ' + lim + ')'); anormal = true; }
      else h.push('Variación ' + d.var + ' días: regular (hasta ' + lim + ')');
    }
    if (d.abund) { h.push('Volumen abundante (lo define la paciente: interfiere con su calidad de vida)'); anormal = true; }
    if (d.inter) { h.push('Sangrado intermenstrual'); anormal = true; }
    if (d.posc) { h.push('Sangrado poscoital: evaluar cuello uterino (citología, VPH, colposcopía)'); anormal = true; }
    return { items: h, anormal: anormal };
  }

  // Tamizaje de trastorno de la coagulación (ACOG CO 785 / 557).
  function coagulopatia(d) {
    var men = d.cMenarca, uno = [d.cHpp, d.cQx, d.cDental].filter(Boolean).length, dos = [d.cHema, d.cEpi, d.cEnc, d.cFam].filter(Boolean).length;
    return { positivo: men || uno >= 1 || dos >= 2, n: { men: men, uno: uno, dos: dos } };
  }

  function biopsia(d) {
    var r = [];
    if (d.posmeno) r.push(d.endo !== null && d.endo <= 4 ? 'Endometrio ' + coma(d.endo) + ' mm (4 mm o menos): bajo riesgo; biopsia si el sangrado persiste o recurre' : 'Posmenopausia' + (d.endo !== null ? ' con endometrio de ' + coma(d.endo) + ' mm' : '') + ': biopsia endometrial o histeroscopía');
    else {
      if (d.edad !== null && d.edad >= 45) r.push('45 años o más');
      if (d.estrSinOp) r.push('Exposición a estrógenos sin oposición (obesidad, SOMP, anovulación crónica)');
      if (d.falla) r.push('Falla del tratamiento médico o sangrado persistente');
      if (d.tamox) r.push('Tamoxifeno');
      if (d.lynch) r.push('Síndrome de Lynch');
    }
    return r;
  }

  function causas(d) {
    var c = [];
    if (d.pPolipo) c.push(['P', 'Pólipo', 'Polipectomía histeroscópica, con estudio histológico.']);
    if (d.pAdeno) c.push(['A', 'Adenomiosis', 'DIU-LNG 52 mg, dienogest o anticonceptivo combinado; histerectomía si la paridad está cumplida y falla el tratamiento. Ver módulo Útero.']);
    if (d.pMioma) c.push(['L', 'Leiomioma' + (d.pMiomaSm ? ' submucoso' : ''), d.pMiomaSm ? 'Submucoso: miomectomía histeroscópica (calcular STEP-W en el módulo Útero).' : 'Tratamiento según tipo FIGO, síntomas y deseo de fertilidad: ver módulo Útero.']);
    if (d.pMalig) c.push(['M', 'Malignidad o hiperplasia', 'Hiperplasia sin atipia: progestágeno (DIU-LNG de preferencia) y control histológico. Con atipia: histerectomía, o tratamiento conservador en centro de referencia si desea fertilidad. Cáncer: estadificación FIGO y derivación a ginecología oncológica.']);
    if (d.coag) c.push(['C', 'Coagulopatía', 'Hemograma, TP, TTPa, fibrinógeno y panel de von Willebrand; interconsulta con hematología. Tratamiento: ácido tranexámico, anticonceptivo combinado o DIU-LNG. Evitar AINE.']);
    if (d.oAnov) c.push(['O', 'Disfunción ovulatoria', 'Buscar la causa: TSH, prolactina, SOMP, extremos de peso, estrés, inmadurez del eje en la adolescencia, transición a la menopausia. Progestágeno cíclico, anticonceptivo combinado o DIU-LNG.']);
    if (d.eEndo) c.push(['E', 'Endometrial', 'Diagnóstico de exclusión (ciclos regulares abundantes sin otra causa). DIU-LNG de primera línea; ácido tranexámico o AINE durante la menstruación; anticonceptivo combinado.']);
    if (d.iIatro) c.push(['I', 'Iatrogénica', 'Revisar el fármaco o dispositivo (anticoagulantes, hormonas, DIU de cobre, tamoxifeno). Con anticoagulación: no suspenderla sin indicación del especialista; DIU-LNG es una buena opción.']);
    if (d.nNo) c.push(['N', 'No clasificada', 'Según el hallazgo: istmocele, malformación arteriovenosa (embolización), endometritis crónica.']);
    return c;
  }

  function agudo(d) {
    if (!d.agudo) return [];
    var c = ['Sangrado agudo abundante: evaluar estabilidad hemodinámica, hemograma, grupo y factor, coagulograma y β-hCG.'];
    if (d.inestable) c.push('Inestable: internación, dos vías, reposición y transfusión según necesidad. Estrógenos conjugados 25 mg EV cada 4 a 6 h (hasta 24 h); taponamiento con sonda Foley intrauterina; legrado o histeroscopía si no responde.');
    else c.push('Estable: anticonceptivo combinado monofásico (35 µg de etinilestradiol) 1 comprimido cada 8 h por 7 días, o acetato de medroxiprogesterona 20 mg cada 8 h por 7 días, o ácido tranexámico 1,3 g VO cada 8 h por 5 días (10 mg/kg EV, máximo 600 mg). Verificar contraindicaciones de estrógenos en el módulo MEC.');
    c.push('Después del episodio agudo: tratamiento de mantenimiento según la causa PALM-COEIN.');
    return c;
  }

  function evaluar(d) {
    var p = patron(d), cg = coagulopatia(d);
    d.coag = d.coag || false;
    var notas = [], color = p.anormal ? 'ambar' : 'verde';
    if (d.hcg === 'pos') return { tit: 'β-hCG positiva: no es un sangrado uterino anormal', color: 'rojo', patron: p, cg: cg, notas: ['Evaluar embarazo y sus complicaciones (aborto, ectópico, enfermedad trofoblástica). Ver módulo Dolor pélvico para el ectópico.'], bio: [], causas: [], agudo: [], estudio: [] };
    var estudio = [];
    if (d.hcg !== 'neg' && !d.posmeno && (d.edad === null || d.edad >= 10)) estudio.push('β-hCG (siempre en edad reproductiva)');
    estudio.push('Hemograma y ferritina');
    if (!d.posmeno) estudio.push('TSH; prolactina si hay oligo-anovulación');
    estudio.push((d.edad !== null && d.edad < 18) || d.virgen ? 'Ecografía transabdominal (o transrectal) del útero y anexos' : 'Ecografía transvaginal: útero, endometrio y anexos; histeroscopía o histerosonografía si se sospecha lesión intracavitaria');
    if (cg.positivo) { estudio.push('Tamizaje de coagulopatía positivo: TP, TTPa, fibrinógeno, panel de von Willebrand; hematología'); notas.push('Tamizaje de trastorno de la coagulación positivo (ACOG).'); }
    if (d.edad !== null && d.edad < 20) notas.push('Adolescencia: la anovulación por inmadurez del eje es la causa más frecuente; el trastorno de la coagulación (sobre todo von Willebrand) es la segunda causa a descartar.');
    if (d.hb !== null && d.hb < 12) notas.push('Hemoglobina ' + coma(d.hb) + ' g/dL: anemia; indicar hierro oral o EV según severidad.');
    var bio = biopsia(d);
    var cs = causas(d);
    var tit = d.posmeno ? 'Sangrado posmenopáusico' : p.anormal ? 'Sangrado uterino anormal' : 'Patrón dentro de lo normal (FIGO)';
    if (d.agudo) { tit = 'Sangrado uterino anormal agudo'; color = 'rojo'; }
    if (cs.length) tit += ' · ' + cs.map(function (x) { return x[0]; }).join('-');
    if (d.posmeno || cs.some(function (x) { return x[0] === 'M'; })) color = 'rojo';
    return { tit: tit, color: color, patron: p, cg: cg, notas: notas, bio: bio, causas: cs, agudo: agudo(d), estudio: estudio };
  }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">Flujo: patrón de sangrado (FIGO sistema 1) → embarazo descartado → tamizaje de coagulopatía → estudios → causa PALM-COEIN (sistema 2) → conducta.</p>' +
      c.grupo('1 · Paciente y patrón de sangrado', '<div class="grid2">' + c.campo('hu-edad', 'Edad', 'años', '1') +
        c.sel('hu-hcg', [['', 'Sin dato'], ['neg', 'Negativa'], ['pos', 'Positiva']], 'β-hCG') +
        c.campo('hu-frec', 'Frecuencia del ciclo', 'días', '1') + c.campo('hu-dur', 'Duración del sangrado', 'días', '1') +
        c.campo('hu-var', 'Diferencia entre el ciclo más corto y el más largo', 'días', '1') + c.campo('hu-hb', 'Hemoglobina', 'g/dL') + '</div>' +
        c.chk('hu-abund', 'Volumen abundante (interfiere con la calidad de vida)') + c.chk('hu-inter', 'Sangrado intermenstrual') + c.chk('hu-posc', 'Sangrado poscoital') +
        c.chk('hu-posmeno', 'Posmenopausia (12 meses o más sin menstruación)') + '<div class="grid2">' + c.campo('hu-endo', 'Grosor endometrial', 'mm') + '</div>' +
        c.chk('hu-virgen', 'Sin inicio de relaciones sexuales') +
        c.chk('hu-agudo', 'Sangrado agudo abundante que requiere intervención inmediata') + c.chk('hu-inest', 'Inestabilidad hemodinámica')) +
      c.grupo('2 · Tamizaje de trastorno de la coagulación', c.chk('hu-cmen', 'Sangrado menstrual abundante desde la menarca') +
        '<p class="ayuda">Uno de estos:</p>' + c.chk('hu-chpp', 'Hemorragia posparto') + c.chk('hu-cqx', 'Sangrado relacionado con cirugía') + c.chk('hu-cden', 'Sangrado con tratamiento dental') +
        '<p class="ayuda">O dos de estos:</p>' + c.chk('hu-chem', 'Hematomas 1 a 2 veces por mes') + c.chk('hu-cepi', 'Epistaxis 1 a 2 veces por mes') + c.chk('hu-cenc', 'Sangrado de encías frecuente') + c.chk('hu-cfam', 'Antecedente familiar de síntomas de sangrado')) +
      c.grupo('3 · Factores para biopsia endometrial', c.chk('hu-eso', 'Exposición a estrógenos sin oposición (obesidad, SOMP, anovulación crónica)') + c.chk('hu-falla', 'Falla del tratamiento o sangrado persistente') + c.chk('hu-tam', 'Usa tamoxifeno') + c.chk('hu-lyn', 'Síndrome de Lynch')) +
      c.grupo('4 · Causa PALM-COEIN (según ecografía, histeroscopía, biopsia y laboratorio)',
        '<p class="ayuda"><b>PALM (estructural)</b></p>' + c.chk('hu-pp', 'P · Pólipo') + c.chk('hu-pa', 'A · Adenomiosis') + c.chk('hu-pl', 'L · Leiomioma') + c.chk('hu-pls', 'Leiomioma submucoso (FIGO 0 a 2)') + c.chk('hu-pm', 'M · Malignidad o hiperplasia') +
        '<p class="ayuda"><b>COEIN (no estructural)</b></p>' + c.chk('hu-cc', 'C · Coagulopatía confirmada') + c.chk('hu-co', 'O · Disfunción ovulatoria') + c.chk('hu-ce', 'E · Endometrial') + c.chk('hu-ci', 'I · Iatrogénica (fármacos, DIU)') + c.chk('hu-cn', 'N · No clasificada (istmocele, MAV, otras)')) +
      '<div id="hu-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · Munro et al., FIGO 2018 · ACOG CO 557 (2013) · ACOG PB 128 (2012) · ACOG CO 785 (2019) · ACOG CO 734 (2018).</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function act() {
      var d = { edad: L.n('hu-edad'), hcg: L.v('hu-hcg'), frec: L.n('hu-frec'), dur: L.n('hu-dur'), var: L.n('hu-var'), hb: L.n('hu-hb'), endo: L.n('hu-endo'),
        abund: L.c('hu-abund'), inter: L.c('hu-inter'), posc: L.c('hu-posc'), posmeno: L.c('hu-posmeno'), virgen: L.c('hu-virgen'), agudo: L.c('hu-agudo'), inestable: L.c('hu-inest'),
        cMenarca: L.c('hu-cmen'), cHpp: L.c('hu-chpp'), cQx: L.c('hu-cqx'), cDental: L.c('hu-cden'), cHema: L.c('hu-chem'), cEpi: L.c('hu-cepi'), cEnc: L.c('hu-cenc'), cFam: L.c('hu-cfam'),
        estrSinOp: L.c('hu-eso'), falla: L.c('hu-falla'), tamox: L.c('hu-tam'), lynch: L.c('hu-lyn'),
        pPolipo: L.c('hu-pp'), pAdeno: L.c('hu-pa'), pMioma: L.c('hu-pl') || L.c('hu-pls'), pMiomaSm: L.c('hu-pls'), pMalig: L.c('hu-pm'), coag: L.c('hu-cc'), oAnov: L.c('hu-co'), eEndo: L.c('hu-ce'), iIatro: L.c('hu-ci'), nNo: L.c('hu-cn') };
      var vacio = d.frec === null && d.dur === null && d.var === null && !d.abund && !d.inter && !d.posc && !d.posmeno && !d.agudo && d.hcg === '';
      var h = [];
      if (vacio) h.push(F('', 'Cargá el patrón de sangrado (frecuencia, duración, regularidad o volumen).', '', 'neutro'));
      else {
        var r = evaluar(d);
        h.push(F('Resultado', '<strong>' + r.tit + '</strong>', r.patron.items.length ? c.ul(r.patron.items) : '', r.color));
        if (r.notas.length) h.push(F('Notas', c.ul(r.notas), '', 'neutro'));
        if (r.estudio.length) h.push(F('Estudios iniciales', c.ul(r.estudio), '', 'neutro'));
        if (!esFull) h.push(opts.bloqueo('Biopsia, causa PALM-COEIN y conducta en la versión completa'));
        else {
          if (r.agudo.length) h.push(F('Sangrado agudo', c.ul(r.agudo), 'Sugerencia CaVeSal® · ACOG CO 557.', 'rojo'));
          if (r.bio.length) h.push(F('Biopsia endometrial indicada', c.ul(r.bio), 'ACOG PB 128 y CO 734.', 'naranja'));
          if (r.causas.length) h.push(F('Conducta por causa', c.ul(r.causas.map(function (x) { return '<b>' + x[0] + ' · ' + x[1] + ':</b> ' + x[2]; })), 'Sugerencia CaVeSal®.', 'ambar'));
          else if (r.patron.anormal) h.push(F('Siguiente paso', 'Completá los estudios y marcá la causa PALM-COEIN para ver la conducta. Puede haber más de una causa.', '', 'neutro'));
        }
      }
      cont.querySelector('#hu-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.hua = { patron: patron, coagulopatia: coagulopatia, biopsia: biopsia, evaluar: evaluar, render: render };
})(window);
