/* CaVeSal® GYN · Dolor pélvico agudo y crónico: causas probables según hallazgos y conducta por algoritmo.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · ACOG Practice Bulletin 193, Tubal ectopic pregnancy (2018) ·
   ACOG Committee Opinion 783, Adnexal torsion in adolescents (2019) · NICE NG126, Ectopic pregnancy and miscarriage (2019, actualizada 2023) ·
   CDC 2021 (EPI) · ACOG Practice Bulletin 218, Chronic pelvic pain (Obstet Gynecol 2020;135:e98-e109) · RCOG Green-top Guideline 41 (2012) ·
   Roma IV (colon irritable) · AUA, Interstitial cystitis/bladder pain syndrome (2022) · ESHRE Endometriosis 2022.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function coma(n) { return String(n).replace('.', ','); }

  // ── Agudo ──
  function agudo(d) {
    var r = { causas: [], conducta: [], alarma: [], color: 'ambar' };
    if (d.inest) r.alarma.push('Inestabilidad hemodinámica: reanimación, laboratorio con grupo y factor, y cirugía de urgencia si hay hemoperitoneo.');
    if (d.hcg === 'pos') {
      if (d.saco === 'iu') {
        r.causas.push({ c: 'Embarazo intrauterino', p: 'confirmado', col: 'verde' });
        r.conducta.push('Embarazo intrauterino: evaluar amenaza de aborto, aborto en curso o causa no obstétrica del dolor (quiste de cuerpo lúteo, torsión, apendicitis). Si hubo tratamiento de fertilidad, considerar embarazo heterotópico.');
        return r;
      }
      if (d.saco === 'ect' || d.masa) {
        r.causas.push({ c: 'Embarazo ectópico', p: d.saco === 'ect' ? 'visto en la ecografía' : 'masa anexial con útero vacío', col: 'rojo' }); r.color = 'rojo';
        var rot = d.inest || d.hemo;
        if (rot) r.conducta.push('Ectópico con inestabilidad o hemoperitoneo: cirugía de urgencia (salpingectomía laparoscópica o laparotomía según la estabilidad).');
        else {
          var mtx = d.hcgV !== null && d.hcgV <= 5000 && !d.lcf && !d.lact && !d.contraMtx;
          if (mtx) r.conducta.push('Candidata a metotrexato: estable, sin rotura, β-hCG ' + coma(d.hcgV) + ' mUI/mL (hasta 5000), sin actividad cardíaca embrionaria, con seguimiento asegurado. Protocolo de dosis única 50 mg/m² IM; β-hCG los días 4 y 7: debe caer 15 % o más entre el día 4 y el 7; luego semanal hasta negativa.');
          else r.conducta.push('No cumple criterios de metotrexato' + (d.hcgV === null ? ' (cargá la β-hCG)' : '') + (d.hcgV !== null && d.hcgV > 5000 ? ': β-hCG mayor de 5000' : '') + (d.lcf ? ': actividad cardíaca embrionaria' : '') + (d.lact ? ': lactancia' : '') + (d.contraMtx ? ': contraindicación médica' : '') + '. Tratamiento quirúrgico: salpingectomía laparoscópica (salpingostomía si la otra trompa está dañada y desea fertilidad).');
          r.conducta.push('Contraindicaciones del metotrexato: inestabilidad, rotura, embarazo intrauterino coexistente, lactancia, inmunodeficiencia, alcoholismo, enfermedad hepática o renal, discrasia sanguínea, úlcera péptica activa, enfermedad pulmonar, alergia.');
          r.conducta.push('Expectante: solo si está estable, β-hCG baja y en descenso (por ejemplo menor de 1500) y acepta controles.');
        }
        r.conducta.push('Rh negativo: inmunoglobulina anti-D según protocolo local.');
        return r;
      }
      r.causas.push({ c: 'Embarazo de localización desconocida', p: 'β-hCG positiva sin saco visible', col: 'naranja' }); r.color = 'naranja';
      if (d.hcgV !== null && d.hcgV >= 3500) r.conducta.push('β-hCG ' + coma(d.hcgV) + ' mUI/mL, por encima de la zona discriminatoria (hasta 3500) sin saco intrauterino: alta sospecha de ectópico o embarazo no viable. Repetir ecografía transvaginal por operador experto.');
      if (d.hcgV !== null && d.hcg48 !== null) {
        var cambio = (d.hcg48 - d.hcgV) / d.hcgV * 100;
        if (cambio >= 35) r.conducta.push('β-hCG a las 48 h subió ' + Math.round(cambio) + ' % (mínimo esperado 35 %): compatible con embarazo intrauterino viable. Ecografía cuando supere la zona discriminatoria.');
        else if (cambio <= -50) r.conducta.push('β-hCG cayó ' + Math.round(-cambio) + ' % en 48 h: embarazo en resolución (aborto). Seguir hasta negativa.');
        else r.conducta.push('Cambio de β-hCG ' + Math.round(cambio) + ' % en 48 h (subida menor del 35 % o caída menor del 50 %): sospecha de ectópico o embarazo no viable. Ecografía y evaluación especializada.');
      } else r.conducta.push('Repetir β-hCG a las 48 horas y comparar: la subida mínima esperada en un embarazo viable es del 35 %.');
      if (d.inest || d.hemo) r.conducta.unshift('Inestabilidad o líquido libre abundante: tratar como ectópico roto (cirugía).');
      return r;
    }
    if (d.hcg !== 'neg') { r.causas.push({ c: 'Primer paso: β-hCG', p: 'toda mujer en edad fértil con dolor pélvico agudo', col: 'neutro' }); return r; }
    // hCG negativa
    if (d.masaAnex && (d.subito || d.vomitos)) {
      r.causas.push({ c: 'Torsión anexial', p: 'dolor súbito con náuseas o vómitos y masa anexial', col: 'rojo' }); r.color = 'rojo';
      r.conducta.push('Torsión: laparoscopía urgente con destorsión y conservación del ovario aunque se vea oscuro (incluso en adolescentes); quistectomía si hay quiste. Un Doppler con flujo normal no la descarta.');
    }
    if (d.cmt || d.fiebre || d.flujo) {
      r.causas.push({ c: 'Enfermedad pélvica inflamatoria', p: 'dolor a la movilización, fiebre o flujo', col: 'naranja' });
      r.conducta.push('EPI: ver el módulo de EPI (criterios CDC 2021, internación y esquema).');
      if (d.masaComp) { r.causas.push({ c: 'Absceso tubo-ovárico', p: 'masa compleja con fiebre', col: 'rojo' }); r.color = 'rojo'; r.conducta.push('Absceso tubo-ovárico: internación, antibióticos parenterales y drenaje si no responde o mide 7 a 8 cm o más.'); }
    }
    if (d.liquido && d.quiste) { r.causas.push({ c: 'Quiste ovárico hemorrágico o roto', p: 'quiste con líquido libre', col: d.inest ? 'rojo' : 'ambar' }); r.conducta.push('Quiste roto o hemorrágico: estable, conducta expectante con analgesia y control de hemoglobina; inestable o hemoperitoneo progresivo, cirugía.'); }
    else if (d.quiste && !d.masaAnex) { r.causas.push({ c: 'Quiste funcional o hemorrágico', p: 'quiste sin líquido libre', col: 'ambar' }); r.conducta.push('Quiste hemorrágico sin complicaciones: analgesia y ecografía de control en 6 a 12 semanas.'); }
    if (d.mitad && !r.causas.length) { r.causas.push({ c: 'Dolor ovulatorio (Mittelschmerz)', p: 'mitad del ciclo, autolimitado', col: 'verde' }); r.conducta.push('Dolor ovulatorio: AINE; si es recurrente, anticoncepción hormonal.'); }
    if (d.fid) { r.causas.push({ c: 'Apendicitis', p: 'dolor migratorio a fosa ilíaca derecha', col: 'naranja' }); r.conducta.push('Sospecha de apendicitis: evaluación quirúrgica, hemograma, PCR y ecografía o TAC.'); }
    if (d.urin) { r.causas.push({ c: 'Infección urinaria, pielonefritis o litiasis', p: 'síntomas urinarios o dolor lumbar', col: 'ambar' }); r.conducta.push('Causa urinaria: orina completa, urocultivo y ecografía renal.'); }
    if (d.mioma) { r.causas.push({ c: 'Degeneración de mioma', p: 'mioma conocido', col: 'ambar' }); r.conducta.push('Degeneración de mioma: AINE y reposo; ver módulo Útero.'); }
    if (d.diu) { r.causas.push({ c: 'DIU mal posicionado o perforación', p: 'usuaria de DIU', col: 'ambar' }); r.conducta.push('DIU: ecografía para ubicarlo; descartar EPI.'); }
    if (!r.causas.length) { r.causas.push({ c: 'Sin causa definida', p: 'cargá los hallazgos', col: 'neutro' }); r.conducta.push('Ecografía transvaginal, hemograma, PCR, orina y cultivos de cuello según la clínica. Si persiste el dolor sin diagnóstico, laparoscopía diagnóstica.'); }
    return r;
  }

  // ── Crónico ──
  function cronico(d) {
    var r = { definicion: '', causas: [], estudios: [], conducta: [], banderas: [], color: 'ambar' };
    r.definicion = d.meses === null ? 'Cargá los meses de evolución.' : d.meses >= 6 ? 'Dolor pélvico crónico: ' + d.meses + ' meses (6 meses o más, ACOG 2020)' : 'Menos de 6 meses: todavía no cumple la definición de crónico; evaluar como agudo o subagudo.';
    if (d.bSang) r.banderas.push('Sangrado posmenopáusico o poscoital');
    if (d.bPeso) r.banderas.push('Pérdida de peso involuntaria');
    if (d.bMasa) r.banderas.push('Masa pélvica');
    if (d.bRect) r.banderas.push('Sangrado rectal o cambio del hábito intestinal después de los 50 años');
    if (d.bHem) r.banderas.push('Hematuria');
    if (d.bEdad) r.banderas.push('Inicio del dolor después de los 50 años');
    if (r.banderas.length) { r.color = 'rojo'; r.estudios.push('Banderas rojas: estudiar malignidad (ecografía, marcadores, colonoscopía, cistoscopía) antes de atribuir el dolor a una causa funcional.'); }
    function add(c, p, cond) { r.causas.push({ c: c, p: p }); r.conducta.push(cond); }
    if (d.dism || d.disp || d.disq || d.infert) add('Endometriosis', [d.dism && 'dismenorrea', d.disp && 'dispareunia profunda', d.disq && 'disquecia o disuria cíclicas', d.infert && 'infertilidad'].filter(Boolean).join(', '), 'Endometriosis: tratamiento empírico sin laparoscopía (AINE + anticonceptivo combinado continuo o progestágeno: dienogest 2 mg/día, DIU-LNG); ecografía experta o RMN; ver módulo Endometriosis.');
    if (d.utGrande || (d.sangAbund && d.dism)) add('Adenomiosis', 'útero aumentado, doloroso, con sangrado abundante y dismenorrea', 'Adenomiosis: DIU-LNG, dienogest o anticonceptivo continuo; ver módulo Útero (MUSA).');
    if (d.postural) add('Síndrome de congestión pélvica', 'dolor que empeora de pie, al final del día y después del coito, con várices', 'Congestión pélvica: ecografía Doppler o venografía; progestágenos o agonistas GnRH; embolización de venas ováricas en casos seleccionados.');
    if (d.cirugia || d.epiPrev) add('Adherencias', 'cirugía abdominal o EPI previa', 'Adherencias: la adhesiólisis solo se considera si son densas y vasculares y el dolor se relaciona con ellas.');
    if (d.vejiga) add('Síndrome de vejiga dolorosa o cistitis intersticial', 'dolor con el llenado vesical que alivia al orinar, urgencia y frecuencia, urocultivo negativo', 'Vejiga dolorosa: educación, evitar alimentos desencadenantes, fisioterapia de suelo pélvico; amitriptilina, pentosano o instilaciones según urología.');
    if (d.intestino) add('Síndrome de colon irritable (Roma IV)', 'dolor abdominal al menos 1 día por semana en los últimos 3 meses, relacionado con la defecación o con cambios en la frecuencia o la forma de las heces', 'Colon irritable: dieta (baja en FODMAP), fibra soluble, antiespasmódicos; neuromoduladores según gastroenterología.');
    if (d.carnett || d.gatillo) add('Dolor miofascial de pared abdominal o de suelo pélvico', d.carnett ? 'signo de Carnett positivo' : 'puntos gatillo en el suelo pélvico', 'Miofascial: fisioterapia de suelo pélvico y pared abdominal, infiltración de puntos gatillo.');
    if (d.neuro) add('Dolor neuropático o atrapamiento nervioso', 'dolor quemante o lancinante en el territorio de un nervio (pudendo, ilioinguinal, iliohipogástrico, genitofemoral)', 'Neuropático: gabapentina, pregabalina o amitriptilina; bloqueo nervioso diagnóstico-terapéutico.');
    if (d.psico) add('Componente psicosocial', 'depresión, ansiedad, antecedente de abuso o violencia', 'Psicosocial: tamizaje de depresión y violencia; terapia cognitivo-conductual y abordaje multidisciplinario.');
    if (!r.causas.length) r.causas.push({ c: 'Sin patrón definido', p: 'marcá los hallazgos' });
    r.estudios.push('Historia del dolor, mapa del dolor, diario de síntomas; examen abdominal (signo de Carnett) y pélvico con palpación de músculos del suelo pélvico.');
    r.estudios.push('Laboratorio según clínica: β-hCG, hemograma, orina y urocultivo, gonococo y clamidia. Ecografía transvaginal (RMN si la ecografía no aclara o hay sospecha de endometriosis profunda).');
    r.conducta.push('General: AINE como primera línea; abordaje multidisciplinario. Laparoscopía diagnóstica si fallan los tratamientos empíricos o hay hallazgos sugestivos, no como primer paso.');
    return r;
  }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<div class="grid2">' + c.sel('dp-modo', [['agudo', 'Dolor pélvico agudo'], ['cronico', 'Dolor pélvico crónico (6 meses o más)']], 'Tipo de dolor') + '</div>' +
      '<div id="dp-agudo">' +
      '<p class="ayuda">Flujo: estabilidad → β-hCG → si es positiva: ecografía (intrauterino, ectópico o localización desconocida) → metotrexato o cirugía. Si es negativa: torsión, EPI, quiste roto y causas no ginecológicas.</p>' +
      c.grupo('1 · Estabilidad y β-hCG', c.chk('da-inest', 'Inestabilidad hemodinámica') + '<div class="grid2">' + c.sel('da-hcg', [['', 'Sin dato'], ['neg', 'Negativa'], ['pos', 'Positiva']], 'β-hCG') +
        c.campo('da-hcgv', 'β-hCG cuantitativa', 'mUI/mL', '1') + c.campo('da-hcg48', 'β-hCG a las 48 h', 'mUI/mL', '1') +
        c.sel('da-saco', [['', 'Sin dato'], ['iu', 'Saco intrauterino'], ['ect', 'Ectópico visible'], ['nada', 'Sin saco visible']], 'Ecografía transvaginal') + '</div>' +
        c.chk('da-masa', 'Masa anexial con útero vacío') + c.chk('da-hemo', 'Líquido libre abundante o hemoperitoneo') + c.chk('da-lcf', 'Actividad cardíaca embrionaria en el ectópico') +
        c.chk('da-lact', 'Lactancia') + c.chk('da-cmtx', 'Contraindicación médica para metotrexato')) +
      c.grupo('2 · Hallazgos con β-hCG negativa', c.chk('da-sub', 'Dolor de inicio súbito') + c.chk('da-vom', 'Náuseas o vómitos') + c.chk('da-manex', 'Masa o quiste anexial aumentado (torsión)') +
        c.chk('da-cmt', 'Dolor a la movilización del cuello') + c.chk('da-fie', 'Fiebre') + c.chk('da-flu', 'Flujo mucopurulento') + c.chk('da-mcomp', 'Masa anexial compleja') +
        c.chk('da-quiste', 'Quiste ovárico') + c.chk('da-liq', 'Líquido libre') + c.chk('da-mitad', 'Mitad del ciclo') + c.chk('da-fid', 'Dolor migratorio a fosa ilíaca derecha') +
        c.chk('da-urin', 'Síntomas urinarios o dolor lumbar') + c.chk('da-mioma', 'Mioma conocido') + c.chk('da-diu', 'Usuaria de DIU')) +
      '<div id="da-o" class="resultados" aria-live="polite"></div></div>' +
      '<div id="dp-cronico" hidden>' +
      '<p class="ayuda">Flujo: definición (6 meses o más) → banderas rojas → patrón del dolor → causas probables (puede haber varias) → estudios → conducta.</p>' +
      c.grupo('1 · Definición y banderas rojas', '<div class="grid2">' + c.campo('dc-meses', 'Meses de evolución', 'meses', '1') + '</div>' +
        c.chk('dc-bsang', 'Sangrado posmenopáusico o poscoital') + c.chk('dc-bpeso', 'Pérdida de peso') + c.chk('dc-bmasa', 'Masa pélvica') + c.chk('dc-brect', 'Sangrado rectal o cambio intestinal después de los 50 años') + c.chk('dc-bhem', 'Hematuria') + c.chk('dc-bedad', 'Inicio después de los 50 años')) +
      c.grupo('2 · Patrón del dolor', c.chk('dc-dism', 'Dismenorrea progresiva') + c.chk('dc-disp', 'Dispareunia profunda') + c.chk('dc-disq', 'Disquecia o disuria cíclicas') + c.chk('dc-inf', 'Infertilidad') +
        c.chk('dc-ut', 'Útero aumentado y doloroso') + c.chk('dc-sang', 'Sangrado menstrual abundante') + c.chk('dc-post', 'Empeora de pie y al final del día, con várices pélvicas o vulvares') +
        c.chk('dc-cir', 'Cirugía abdominal o pélvica previa') + c.chk('dc-epi', 'EPI previa') + c.chk('dc-vej', 'Dolor con el llenado vesical, urgencia y frecuencia con urocultivo negativo') +
        c.chk('dc-int', 'Dolor relacionado con la defecación y cambios del hábito intestinal') + c.chk('dc-carn', 'Signo de Carnett positivo (empeora al tensar la pared abdominal)') + c.chk('dc-gat', 'Puntos gatillo en el suelo pélvico') +
        c.chk('dc-neu', 'Dolor quemante o lancinante en el territorio de un nervio') + c.chk('dc-psi', 'Depresión, ansiedad o antecedente de abuso')) +
      '<div id="dc-o" class="resultados" aria-live="polite"></div></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · ACOG PB 193 (2018) · ACOG CO 783 (2019) · NICE NG126 · CDC 2021 · ACOG PB 218 (2020) · RCOG GTG 41 · Roma IV · AUA IC/BPS 2022 · ESHRE 2022.</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function caus(arr, conCol) { return c.ul(arr.map(function (x) { return '<strong>' + x.c + '</strong>' + (x.p ? ': ' + x.p : ''); })); }
    function act() {
      var a = agudo({ inest: L.c('da-inest'), hcg: L.v('da-hcg'), hcgV: L.n('da-hcgv'), hcg48: L.n('da-hcg48'), saco: L.v('da-saco'), masa: L.c('da-masa'), hemo: L.c('da-hemo'), lcf: L.c('da-lcf'), lact: L.c('da-lact'), contraMtx: L.c('da-cmtx'),
        subito: L.c('da-sub'), vomitos: L.c('da-vom'), masaAnex: L.c('da-manex'), cmt: L.c('da-cmt'), fiebre: L.c('da-fie'), flujo: L.c('da-flu'), masaComp: L.c('da-mcomp'), quiste: L.c('da-quiste'), liquido: L.c('da-liq'),
        mitad: L.c('da-mitad'), fid: L.c('da-fid'), urin: L.c('da-urin'), mioma: L.c('da-mioma'), diu: L.c('da-diu') });
      var h = [];
      if (a.alarma.length) h.push(F('Alarma', c.ul(a.alarma), '', 'rojo'));
      h.push(F('Causas probables', caus(a.causas), '', a.color));
      if (!esFull) h.push(opts.bloqueo('Conducta según el algoritmo en la versión completa'));
      else h.push(F('Conducta', c.ul(a.conducta), 'Sugerencia CaVeSal®.', a.color === 'rojo' ? 'naranja' : 'ambar'));
      cont.querySelector('#da-o').innerHTML = h.join('');
      var k = cronico({ meses: L.n('dc-meses'), bSang: L.c('dc-bsang'), bPeso: L.c('dc-bpeso'), bMasa: L.c('dc-bmasa'), bRect: L.c('dc-brect'), bHem: L.c('dc-bhem'), bEdad: L.c('dc-bedad'),
        dism: L.c('dc-dism'), disp: L.c('dc-disp'), disq: L.c('dc-disq'), infert: L.c('dc-inf'), utGrande: L.c('dc-ut'), sangAbund: L.c('dc-sang'), postural: L.c('dc-post'), cirugia: L.c('dc-cir'), epiPrev: L.c('dc-epi'),
        vejiga: L.c('dc-vej'), intestino: L.c('dc-int'), carnett: L.c('dc-carn'), gatillo: L.c('dc-gat'), neuro: L.c('dc-neu'), psico: L.c('dc-psi') });
      var g = [F('Definición', '<strong>' + k.definicion + '</strong>', '', 'neutro')];
      if (k.banderas.length) g.push(F('Banderas rojas', c.ul(k.banderas), '', 'rojo'));
      g.push(F('Causas probables', caus(k.causas), 'Pueden coexistir varias.', k.color));
      if (!esFull) g.push(opts.bloqueo('Estudios y conducta en la versión completa'));
      else { g.push(F('Estudios', c.ul(k.estudios), '', 'neutro')); g.push(F('Conducta', c.ul(k.conducta), 'Sugerencia CaVeSal®.', 'ambar')); }
      cont.querySelector('#dc-o').innerHTML = g.join('');
    }
    cont.querySelector('#dp-modo').addEventListener('change', function () {
      var t = this.value;
      cont.querySelector('#dp-agudo').hidden = t !== 'agudo'; cont.querySelector('#dp-cronico').hidden = t !== 'cronico';
    });
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.dolor = { agudo: agudo, cronico: cronico, render: render };
})(window);
