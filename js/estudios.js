/* CaVeSal® GYN · Mama, cérvix y endometrio: BI-RADS v2025, tamizaje de cuello uterino y grosor endometrial, con conducta.
   Algoritmo propio CaVeSal® · Basado en: ACR BI-RADS v2025 · ACR Appropriateness Criteria, masas palpables (2022) ·
   USPSTF 2024 · ACOG PB 179/CPU 2024 · ASCCP 2019 (Perkins RB et al. J Low Genit Tract Dis 2020;24:102-131), actualizaciones 2024
   y guías permanentes 2024-2025 · ACOG CO 734 (2018) · ACOG CO 601 · ACOG PB 128 · IETA (Leone 2010) · Guías CaVeSal® de HC.
   No reproduce las tablas de riesgo de la ASCCP ni el manual del ACR.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };

  /* ---------- BI-RADS ---------- */
  var BIRADS = [
    ['', 'Elegí la categoría'], ['0i', '0 · Incompleto: necesita imagen adicional'], ['0c', '0 · Incompleto: necesita estudios previos para comparar'],
    ['1', '1 · Negativo'], ['2', '2 · Benigno'], ['3', '3 · Probablemente benigno'], ['4A', '4A · Sospecha baja'], ['4B', '4B · Sospecha moderada'],
    ['4C', '4C · Sospecha alta'], ['5', '5 · Altamente sugestivo de malignidad'], ['6', '6 · Malignidad comprobada por biopsia']
  ];
  var BR_RIESGO = { '1': '0 %', '2': '0 %', '3': 'más de 0 y hasta 2 %', '4A': 'más de 2 y hasta 10 %', '4B': 'más de 10 y hasta 50 %', '4C': 'más de 50 y menos de 95 %', '5': '95 % o más' };
  // d: { cat, edad, densidad: 'a'|'b'|'c'|'d'|'', modalidad: 'mx'|'eco'|'rm', palpable, altoRiesgo }
  function birads(d) {
    if (!d.cat) return null;
    var e = d.edad, con = [], color = 'verde', tit = '';
    switch (d.cat) {
      case '0i':
        tit = 'Incompleto: completar la evaluación'; color = 'ambar';
        if (d.modalidad === 'rm') con.push('En RM el 0 se usa poco: completar con ecografía dirigida (segunda mirada) o mamografía según el hallazgo.');
        else if (e !== null && e < 30) con.push('Menor de 30 años: ecografía mamaria dirigida (ACR).');
        else if (e !== null && e < 40) con.push('30 a 39 años: ecografía dirigida o mamografía diagnóstica, según el hallazgo (ACR).');
        else con.push('Mamografía diagnóstica (proyecciones adicionales o tomosíntesis) y ecografía mamaria dirigida (ACR).');
        con.push('Con el estudio completo, reclasificar en BI-RADS 1 a 5.');
        break;
      case '0c':
        tit = 'Incompleto: falta comparar'; color = 'ambar';
        con.push('Conseguir los estudios previos y comparar.');
        con.push('Si no aparecen a tiempo, completar con estudio diagnóstico (mamografía y ecografía).');
        break;
      case '1': case '2':
        tit = d.cat === '1' ? 'Negativo' : 'Hallazgo benigno';
        con.push('Tamizaje habitual: cada 2 años de 40 a 74 años (USPSTF 2024). ACOG 2024: desde los 40, cada 1 o 2 años.');
        break;
      case '3':
        tit = 'Probablemente benigno: control a corto plazo'; color = 'ambar';
        con.push('Control de la mama afectada a los 6 meses, luego a los 12 y 24 meses (2 años en total). Estable 2 años: pasa a BI-RADS 2.');
        con.push('Si crece o cambia en el control: biopsia.');
        con.push('Puede preferirse la biopsia si es palpable, si hay alto riesgo o si el control no es confiable.');
        break;
      case '4A': case '4B': case '4C':
        tit = 'Sospechoso: biopsia'; color = d.cat === '4A' ? 'naranja' : 'rojo';
        con.push('Biopsia percutánea con aguja gruesa guiada por imagen (ecografía o estereotaxia).');
        con.push('Verificar la concordancia entre imagen y patología. Discordante: repetir la biopsia o hacer biopsia quirúrgica.');
        if (d.cat === '4A') con.push('Benigna y concordante: control por imagen a los 6 meses.');
        break;
      case '5':
        tit = 'Altamente sugestivo: biopsia y derivación'; color = 'rojo';
        con.push('Biopsia con aguja gruesa guiada por imagen.');
        con.push('Derivar a mastología y oncología. Si se confirma: estadificación (ver guías).');
        break;
      case '6':
        tit = 'Cáncer confirmado'; color = 'rojo';
        con.push('Tratamiento por equipo multidisciplinario de mama.');
        con.push('RM para extensión según el caso; estadificación en las guías.');
        break;
    }
    if (d.palpable && (d.cat === '1' || d.cat === '2' || d.cat === '3')) con.push('Masa palpable sospechosa al examen: una imagen negativa o benigna no la descarta; valorar biopsia (ACR).');
    var dens = '';
    if (d.densidad === 'c' || d.densidad === 'd') dens = 'Mama ' + (d.densidad === 'c' ? 'heterogéneamente densa (C)' : 'extremadamente densa (D)') + ': informar a la paciente (FDA, 2024). Imagen complementaria (ecografía o RM) según el riesgo: el ACR la sugiere; el USPSTF 2024 considera la evidencia insuficiente.';
    var ar = d.altoRiesgo ? 'Alto riesgo (BRCA, radioterapia de tórax antes de los 30 o riesgo de vida de 20 % o más): RM anual con contraste además de la mamografía (ACR 2023, NCCN).' : '';
    return { tit: tit, color: color, riesgo: BR_RIESGO[d.cat] || '', con: con, dens: dens, ar: ar };
  }

  /* ---------- Tamizaje de cuello uterino ---------- */
  var CITO = [['', 'Sin citología'], ['nilm', 'NILM (negativa)'], ['ascus', 'ASC-US'], ['lsil', 'LSIL'], ['asch', 'ASC-H'], ['hsil', 'HSIL'], ['agc', 'AGC'], ['agcn', 'AGC a favor de neoplasia'], ['ais', 'AIS'], ['ca', 'Carcinoma']];
  var VPH = [['', 'Sin prueba de VPH'], ['neg', 'Negativo'], ['16', 'Positivo VPH 16'], ['18', 'Positivo VPH 18'], ['otros', 'Positivo otros de alto riesgo (sin genotipo 16/18)']];
  // d: { edad, cito, vph, autotoma, doble: ''|'pos'|'neg', inmuno, previoOk }
  function cervix(d) {
    var e = d.edad, con = [], color = 'verde', tit = '';
    var m25 = e !== null && e < 25;
    if (!d.cito && !d.vph) {
      if (e === null) return null;
      if (d.inmuno) return { tit: 'Inmunosuprimida o con VIH', color: 'ambar', con: ['Seguir el esquema de poblaciones especiales (ASCCP 2019): intervalos más cortos y sin suspender a los 65 años.'] };
      if (e < 21) return { tit: 'No tamizar', color: 'verde', con: ['Menor de 21 años: no se recomienda tamizaje.'] };
      if (e < 30) return { tit: 'Tamizaje con citología', color: 'verde', con: ['21 a 29 años: citología cada 3 años.'] };
      if (e <= 65) return { tit: 'Tamizaje con VPH', color: 'verde', con: ['30 a 65 años: prueba primaria de VPH cada 5 años (preferida); alternativas: co-test cada 5 años o citología cada 3.', 'La autotoma vaginal de VPH es válida (ASCCP 2025): si es negativa, repetir a los 3 años.'] };
      return d.previoOk
        ? { tit: 'Suspender el tamizaje', color: 'verde', con: ['Mayor de 65 con tamizaje previo adecuado y sin CIN 2 o más en los últimos 25 años: suspender.'] }
        : { tit: 'Continuar el tamizaje', color: 'ambar', con: ['Mayor de 65 sin tamizaje previo adecuado: continuar hasta completarlo.'] };
    }
    var v = d.vph, ci = d.cito, v1618 = v === '16' || v === '18';
    // Autotoma positiva sin citología
    if (d.autotoma && v && v !== 'neg' && !ci) {
      if (v1618) return { tit: 'Autotoma VPH ' + v + ' positiva', color: 'rojo', con: ['Colposcopía (ASCCP 2025).'] };
      return { tit: 'Autotoma positiva para otros tipos', color: 'ambar', con: ['Tomar una muestra por el profesional para citología (triaje) (ASCCP 2025).'] };
    }
    if (d.autotoma && v === 'neg' && !ci) return { tit: 'Autotoma negativa', color: 'verde', con: ['Repetir a los 3 años (ASCCP 2025).'] };
    switch (ci) {
      case 'ca': return { tit: 'Carcinoma en la citología', color: 'rojo', con: ['Colposcopía con biopsia y derivación a ginecología oncológica.', 'Con el diagnóstico: estadificación FIGO (módulo Oncología).'] };
      case 'ais': return { tit: 'AIS', color: 'rojo', con: ['Escisión diagnóstica (conización) con muestreo endocervical.'] };
      case 'agcn': return { tit: 'AGC a favor de neoplasia', color: 'rojo', con: ['Escisión diagnóstica (conización) si la colposcopía no explica el hallazgo.', 'Biopsia endometrial si tiene 35 años o más, o riesgo de neoplasia endometrial.'] };
      case 'agc': return { tit: 'AGC', color: 'rojo', con: ['Colposcopía con muestreo endocervical, sin importar el VPH.', 'Biopsia endometrial si tiene 35 años o más, o riesgo de neoplasia endometrial (sangrado anormal, obesidad, anovulación).'] };
      case 'hsil':
        if (m25) return { tit: 'HSIL en menor de 25', color: 'rojo', con: ['Colposcopía con biopsia. No escisión directa.'] };
        return { tit: 'HSIL', color: 'rojo', con: ['Tratamiento escisional inmediato (LEEP) o colposcopía con biopsia. El inmediato es de elección si además es VPH 16 positivo.'] };
      case 'asch': return { tit: 'ASC-H', color: 'rojo', con: ['Colposcopía siempre, sin importar el VPH.'] };
      case 'lsil':
        if (m25) return { tit: 'LSIL en menor de 25', color: 'ambar', con: ['Repetir la citología en 1 año.'] };
        if (v === 'neg') return { tit: 'LSIL con VPH negativo', color: 'ambar', con: ['Repetir la prueba basada en VPH en 1 año (aceptable). Colposcopía si persiste.'] };
        return { tit: 'LSIL', color: 'naranja', con: ['Colposcopía.'] };
      case 'ascus':
        if (v === 'neg') return { tit: 'ASC-US con VPH negativo', color: 'verde', con: ['Repetir la prueba basada en VPH en 3 años.'] };
        if (v && v !== 'neg') return m25 ? { tit: 'ASC-US con VPH positivo en menor de 25', color: 'ambar', con: ['Repetir la citología en 1 año.'] } : { tit: 'ASC-US con VPH positivo', color: 'naranja', con: ['Colposcopía.'] };
        if (m25) return { tit: 'ASC-US en menor de 25', color: 'ambar', con: ['Repetir la citología en 1 año.'] };
        return { tit: 'ASC-US sin VPH', color: 'ambar', con: ['VPH refleja (preferida) o repetir la citología en 1 año.'] };
    }
    // NILM o sin citología
    if (v === 'neg') return { tit: ci === 'nilm' ? 'Co-test negativo' : 'VPH negativo', color: 'verde', con: ['Control de rutina a los 5 años.'] };
    if (v1618) return { tit: 'VPH ' + v + ' positivo' + (ci === 'nilm' ? ' con NILM' : ''), color: 'rojo', con: ['Colposcopía, aunque la citología sea negativa.'] };
    if (v === 'otros') {
      if (!ci) {
        if (d.doble === 'pos') return { tit: 'VPH positivo con doble tinción positiva', color: 'naranja', con: ['Colposcopía (ASCCP 2024).'] };
        if (d.doble === 'neg') return { tit: 'VPH positivo con doble tinción negativa', color: 'ambar', con: ['Repetir la prueba de VPH en 1 año (ASCCP 2024).'] };
        return { tit: 'VPH positivo, otros tipos', color: 'ambar', con: ['Citología refleja o doble tinción p16/Ki-67 como triaje.'] };
      }
      return { tit: 'VPH positivo, otros tipos, con NILM', color: 'ambar', con: ['Repetir la prueba basada en VPH en 1 año.', 'Con genotipado extendido, seguir la app de la ASCCP.'] };
    }
    if (ci === 'nilm') return { tit: 'Citología negativa', color: 'verde', con: [e !== null && e >= 30 ? 'Sin VPH: citología cada 3 años o pasar a VPH primario cada 5 años.' : 'Citología cada 3 años.'] };
    return null;
  }

  /* ---------- Grosor endometrial ---------- */
  // d: { etapa: 'adol'|'fertil'|'post', edad, grosor, sangrado: 'no'|'si'|'persiste', thm: 'no'|'continua'|'secuencial', tamox, fr, falla, noVisible, ieta: {nouni, irreg, multi, unico} }
  function endometrio(d) {
    var g = d.grosor, con = [], color = 'verde', tit = '', ieta = d.ieta || {};
    if (!d.etapa) return null;
    var sospechaIeta = ieta.nouni || ieta.irreg || ieta.multi;
    if (d.etapa === 'post') {
      if (d.sangrado !== 'no') {
        if (d.noVisible) { tit = 'Endometrio no evaluable'; color = 'rojo'; con.push('Si el endometrio no se ve bien, pasar a biopsia, histerosonografía o histeroscopía (ACOG CO 734).'); }
        else if (g === null) return { falta: 'grosor' };
        else if (g <= 4 && d.sangrado === 'si') { tit = 'Sangrado posmenopáusico con endometrio de 4 mm o menos'; con.push('Riesgo muy bajo: puede no biopsiarse de entrada (ACOG CO 734).'); con.push('Si el sangrado persiste o recurre: biopsia.'); }
        else if (g <= 4) { tit = 'Sangrado persistente con endometrio fino'; color = 'rojo'; con.push('Sangrado persistente o recurrente: biopsia, aunque el endometrio sea fino (ACOG CO 734).'); }
        else { tit = 'Sangrado posmenopáusico con endometrio mayor de 4 mm'; color = 'rojo'; con.push('Biopsia endometrial (ACOG CO 734). Histeroscopía si la biopsia no es concluyente o hay lesión focal.'); }
      } else {
        if (g === null) return { falta: 'grosor' };
        if (d.thm === 'continua') { tit = 'THM continua'; color = g <= 5 ? 'verde' : 'ambar'; con.push(g <= 5 ? 'Dentro de la meta (4 a 5 mm o menos).' : 'Por encima de la meta de 4 a 5 mm: revisar el progestágeno y valorar estudio.'); }
        else if (g <= 11) { tit = 'Asintomática, 11 mm o menos'; con.push('Sin biopsia de rutina (SOGC; guía CaVeSal®).'); }
        else { tit = 'Asintomática, más de 11 mm'; color = 'ambar'; con.push('Individualizar: valorar biopsia o histeroscopía según factores de riesgo (obesidad, diabetes, Lynch, tamoxifeno).'); }
      }
      if (d.tamox) con.push('Tamoxifeno: no hacer ecografía de rutina sin síntomas; cualquier sangrado se estudia (ACOG CO 601).');
    } else if (d.etapa === 'fertil') {
      if (d.sangrado === 'no') { tit = 'Sin sangrado anormal'; con.push('El grosor varía con el ciclo: proliferativo 4 a 8 mm, periovulatorio 8 a 12, secretor hasta 14 a 16. No se biopsia por el grosor solo.'); }
      else if (d.edad !== null && d.edad >= 45) { tit = 'Sangrado uterino anormal, 45 años o más'; color = 'rojo'; con.push('Biopsia endometrial (ACOG PB 128).'); }
      else if (d.fr || d.falla) { tit = 'Sangrado anormal con factores de riesgo o falla del tratamiento'; color = 'rojo'; con.push('Biopsia endometrial: obesidad, anovulación crónica o SOP, Lynch, o sangrado que no responde (ACOG PB 128).'); }
      else if (d.edad === null) return { falta: 'edad' };
      else { tit = 'Sangrado anormal, menor de 45 sin factores de riesgo'; color = 'ambar'; con.push('Tratamiento médico: progestágenos o anticonceptivos combinados. Biopsia si falla.'); }
    } else {
      tit = 'Adolescente'; con.push('Casi siempre funcional (anovulación). Ecografía transabdominal.');
      con.push('La biopsia y el legrado no son de primera línea. Progestágenos en la segunda mitad del ciclo.');
      con.push('Si sangra mucho desde la menarca: descartar coagulopatía (von Willebrand).');
    }
    var extra = [];
    if (sospechaIeta) { extra.push('Patrón IETA sospechoso (ecogenicidad no uniforme, interfase irregular o vasos múltiples): histeroscopía con biopsia dirigida.'); if (color === 'verde') color = 'ambar'; }
    else if (ieta.unico) extra.push('Vaso único dominante: sugiere pólipo. Histeroscopía con polipectomía si hay sangrado o es posmenopáusica.');
    return { tit: tit, color: color, con: con.concat(extra) };
  }

  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<h3 class="sub">Mama · BI-RADS v2025</h3>' +
      '<div class="form">' + c.campo('b-edad', 'Edad', 'años', '1') + c.sel('b-cat', BIRADS, 'Categoría BI-RADS') +
        c.sel('b-mod', [['mx', 'Mamografía o tomosíntesis'], ['eco', 'Ecografía'], ['rm', 'RM']], 'Estudio') +
        c.sel('b-den', [['', 'Sin dato'], ['a', 'A · Casi toda grasa'], ['b', 'B · Densidades fibroglandulares dispersas'], ['c', 'C · Heterogéneamente densa'], ['d', 'D · Extremadamente densa']], 'Densidad') + '</div>' +
      c.chk('b-pal', 'Masa palpable') + c.chk('b-ar', 'Alto riesgo (BRCA, radioterapia de tórax antes de los 30, riesgo de vida de 20 % o más)') +
      '<div id="b-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ACR BI-RADS v2025 · ACR Appropriateness Criteria, masas palpables (2022) · USPSTF 2024 · ACOG 2024 · FDA MQSA 2024 · ACR 2023 (alto riesgo y mama densa)</p>' +

      '<h3 class="sub">Cuello uterino · tamizaje y conducta</h3>' +
      '<p class="ayuda">Sin resultados, devuelve el esquema por edad. Con resultados, la conducta. Es una versión simplificada: para el riesgo exacto, usar la app de la ASCCP.</p>' +
      '<div class="form">' + c.campo('c-edad', 'Edad', 'años', '1') + c.sel('c-cito', CITO, 'Citología') + c.sel('c-vph', VPH, 'VPH') +
        c.sel('c-dob', [['', 'Sin dato'], ['pos', 'Positiva'], ['neg', 'Negativa']], 'Doble tinción p16/Ki-67') + '</div>' +
      c.chk('c-auto', 'La prueba de VPH fue por autotoma') + c.chk('c-inm', 'Inmunosuprimida o con VIH') + c.chk('c-prev', 'Mayor de 65: tamizaje previo adecuado y sin CIN 2 o más en 25 años') +
      '<div id="c-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ASCCP 2019 (Perkins RB et al. J Low Genit Tract Dis 2020;24:102-131) · actualizaciones ASCCP 2024 (J Low Genit Tract Dis 2024;28:3-6) · guías permanentes ASCCP 2024-2025 (doble tinción, autotoma, genotipado extendido) · Guía CaVeSal® de HC</p>' +

      '<h3 class="sub">Endometrio · grosor y conducta</h3>' +
      '<div class="form">' + c.sel('e-eta', [['', 'Elegí'], ['adol', 'Adolescente'], ['fertil', 'Edad fértil'], ['post', 'Posmenopausia']], 'Etapa') +
        c.campo('e-edad', 'Edad', 'años', '1') + c.campo('e-gro', 'Grosor endometrial (doble capa)', 'mm') +
        c.sel('e-san', [['no', 'Sin sangrado'], ['si', 'Sangrado'], ['persiste', 'Sangrado persistente o recurrente']], 'Sangrado') +
        c.sel('e-thm', [['no', 'Sin THM'], ['continua', 'THM combinada continua'], ['secuencial', 'THM secuencial']], 'THM') + '</div>' +
      c.chk('e-nov', 'Endometrio no visible o mal definido') + c.chk('e-tam', 'Toma tamoxifeno') +
      c.chk('e-fr', 'Factores de riesgo: obesidad, anovulación crónica o SOP, Lynch') + c.chk('e-fal', 'Falla del tratamiento médico') +
      c.grupo('Hallazgos IETA (opcional)', c.chk('e-i1', 'Ecogenicidad no uniforme') + c.chk('e-i2', 'Interfase endometrio-miometrio irregular') + c.chk('e-i3', 'Vasos múltiples desorganizados') + c.chk('e-i4', 'Vaso único dominante')) +
      '<div id="e-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ACOG CO 734 (2018) · ACOG PB 128 · ACOG CO 601 · SOGC 249/390 · IETA (Leone FP et al. UOG 2010) · Epstein E et al. UOG 2018 · Guía CaVeSal® de HC</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function actualizar() {
      var b = birads({ cat: L.v('b-cat'), edad: L.n('b-edad'), densidad: L.v('b-den'), modalidad: L.v('b-mod'), palpable: L.c('b-pal'), altoRiesgo: L.c('b-ar') });
      var h = [];
      if (!b) h.push(F('BI-RADS', 'Elegí la categoría.', '', 'neutro'));
      else {
        h.push(F('BI-RADS', '<strong>' + b.tit + '</strong>' + (b.riesgo ? ' · probabilidad de malignidad ' + b.riesgo : ''), '', b.color));
        h.push(F('Conducta', c.ul(b.con), '', b.color));
        if (b.dens) h.push(F('Densidad', b.dens, '', 'ambar'));
        if (b.ar) h.push(F('Alto riesgo', b.ar, '', 'naranja'));
      }
      q('#b-out').innerHTML = h.join('');

      var cx = cervix({ edad: L.n('c-edad'), cito: L.v('c-cito'), vph: L.v('c-vph'), autotoma: L.c('c-auto'), doble: L.v('c-dob'), inmuno: L.c('c-inm'), previoOk: L.c('c-prev') });
      q('#c-out').innerHTML = cx ? F('Resultado', '<strong>' + cx.tit + '</strong>', '', cx.color) + F('Conducta', c.ul(cx.con), '', cx.color) : F('Cuello uterino', 'Ingresá la edad o los resultados.', '', 'neutro');

      var en = endometrio({ etapa: L.v('e-eta'), edad: L.n('e-edad'), grosor: L.n('e-gro'), sangrado: L.v('e-san'), thm: L.v('e-thm'), tamox: L.c('e-tam'), fr: L.c('e-fr'), falla: L.c('e-fal'), noVisible: L.c('e-nov'), ieta: { nouni: L.c('e-i1'), irreg: L.c('e-i2'), multi: L.c('e-i3'), unico: L.c('e-i4') } });
      if (!en) q('#e-out').innerHTML = F('Endometrio', 'Elegí la etapa.', '', 'neutro');
      else if (en.falta) q('#e-out').innerHTML = F('Endometrio', 'Falta: ' + en.falta + '.', '', 'neutro');
      else q('#e-out').innerHTML = F('Resultado', '<strong>' + en.tit + '</strong>', '', en.color) + F('Conducta', c.ul(en.con), '', en.color);
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.estudios = { birads: birads, cervix: cervix, endometrio: endometrio, render: render };
})(window);
