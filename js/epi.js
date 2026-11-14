/* CaVeSal® GYN · Enfermedad pélvica inflamatoria (EPI): diagnóstico, internación, tratamiento y seguimiento.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · CDC, Sexually Transmitted Infections Treatment Guidelines 2021 (Workowski KA et al., MMWR Recomm Rep 2021;70(4):1-187).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  function evaluar(d) {
    var minimo = d.cmt || d.utero || d.anexo;
    var adic = [d.fiebre && 'fiebre de más de 38,3 °C', d.muco && 'flujo cervical mucopurulento o friabilidad', d.leuco && 'leucocitos abundantes en el fresco', d.vsg && 'VSG o PCR elevada', d.gc && 'gonococo o clamidia positivos'].filter(Boolean);
    var esp = [d.biopsia && 'endometritis en la biopsia', d.imagen && 'trompas engrosadas con líquido, absceso tubo-ovárico o hiperemia en Doppler', d.lap && 'hallazgos laparoscópicos'].filter(Boolean);
    var r = { minimo: minimo, adic: adic, esp: esp, dx: '', color: 'neutro', internar: [], trat: [], seg: [] };
    if (d.hcg === 'pos') { r.dx = 'β-hCG positiva: descartar embarazo ectópico primero (ver Dolor pélvico)'; r.color = 'rojo'; }
    if (!minimo) { if (!r.dx) r.dx = 'Sin criterio mínimo: la EPI es poco probable. Buscar otra causa de dolor.'; return r; }
    r.dx = (r.dx ? r.dx + '. ' : '') + 'EPI: criterio mínimo presente' + (adic.length ? ', con ' + adic.length + ' criterio(s) adicional(es) que aumentan la especificidad' : '') + (esp.length ? ' y criterio específico' : '') + '. Iniciar tratamiento empírico.';
    r.color = 'naranja';
    if (!d.muco && !d.leuco && !d.fiebre) r.seg.push('Sin flujo mucopurulento ni leucocitos en el fresco: el diagnóstico de EPI es poco probable; considerar otras causas.');
    if (d.urg) r.internar.push('No se puede descartar una urgencia quirúrgica (apendicitis, ectópico)');
    if (d.ato || (d.imagen && d.atoImg)) r.internar.push('Absceso tubo-ovárico');
    if (d.hcg === 'pos') r.internar.push('Embarazo');
    if (d.grave) r.internar.push('Enfermedad grave, náuseas y vómitos o fiebre alta');
    if (d.oral) r.internar.push('No tolera o no puede cumplir el tratamiento oral');
    if (d.falla) r.internar.push('Sin respuesta clínica al tratamiento oral a las 72 horas');
    if (r.internar.length) {
      r.color = 'rojo';
      r.trat.push('Esquema parenteral recomendado: ceftriaxona 1 g IV cada 24 h + doxiciclina 100 mg VO o IV cada 12 h + metronidazol 500 mg VO o IV cada 12 h.');
      r.trat.push('Alternativas: cefoxitina 2 g IV cada 6 h o cefotetán 2 g IV cada 12 h + doxiciclina 100 mg cada 12 h; o clindamicina 900 mg IV cada 8 h + gentamicina (carga 2 mg/kg y luego 1,5 mg/kg cada 8 h, o dosis única diaria de 3 a 5 mg/kg).');
      r.trat.push('Pasar a vía oral 24 a 48 h después de la mejoría clínica y completar 14 días de doxiciclina + metronidazol.');
      if (d.ato || d.atoImg) r.trat.push('Absceso tubo-ovárico: internación al menos 24 h; agregar cobertura anaerobia (metronidazol o clindamicina); drenaje guiado por imagen o cirugía si no responde, si mide 7 a 8 cm o más o si hay sospecha de rotura (urgencia quirúrgica).');
      if (d.hcg === 'pos') r.trat.push('Embarazo: internar y tratar por vía parenteral; la doxiciclina está contraindicada en el embarazo: ajustar el esquema con el equipo obstétrico.');
    } else {
      r.trat.push('Esquema ambulatorio: ceftriaxona 500 mg IM dosis única (1 g si pesa 150 kg o más) + doxiciclina 100 mg VO cada 12 h por 14 días + metronidazol 500 mg VO cada 12 h por 14 días.');
      r.trat.push('Alternativa: cefoxitina 2 g IM + probenecid 1 g VO dosis única, con doxiciclina y metronidazol por 14 días.');
      r.trat.push('Alergia grave a cefalosporinas: consultar con infectología (levofloxacina o moxifloxacina solo si hay bajo riesgo de gonococo resistente y con cultivo).');
    }
    if (d.diu) r.seg.push('Usuaria de DIU: no es necesario retirarlo; si no mejora en 48 a 72 h, considerar retirarlo.');
    r.seg.push('Reevaluar a las 72 horas: debe haber mejoría clínica (fiebre, dolor a la movilización y anexial). Si no mejora: internar, estudiar con imagen y considerar laparoscopía.');
    r.seg.push('Parejas sexuales de los últimos 60 días (o la última si fue antes): evaluar y tratar empíricamente gonococo y clamidia. Abstinencia hasta completar el tratamiento de ambos y que no haya síntomas.');
    r.seg.push('Ofrecer VIH, sífilis, hepatitis B y C. Volver a testear gonococo y clamidia a los 3 meses.');
    r.seg.push('Secuelas para informar: infertilidad tubaria, embarazo ectópico y dolor pélvico crónico.');
    return r;
  }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">Flujo: β-hCG → criterio mínimo (basta uno) → criterios adicionales y específicos → criterios de internación → esquema → seguimiento a las 72 horas y pareja.</p>' +
      c.grupo('1 · Criterio mínimo (CDC 2021): mujer joven o con riesgo de ITS, con dolor pélvico o abdominal bajo y sin otra causa', '<div class="grid2">' + c.sel('ep-hcg', [['', 'Sin dato'], ['neg', 'Negativa'], ['pos', 'Positiva']], 'β-hCG') + '</div>' +
        c.chk('ep-cmt', 'Dolor a la movilización del cuello uterino') + c.chk('ep-ut', 'Dolor a la palpación uterina') + c.chk('ep-an', 'Dolor a la palpación anexial')) +
      c.grupo('2 · Criterios adicionales', c.chk('ep-fie', 'Temperatura oral de más de 38,3 °C') + c.chk('ep-muco', 'Flujo cervical mucopurulento o friabilidad cervical') + c.chk('ep-leu', 'Leucocitos abundantes en el examen en fresco') +
        c.chk('ep-vsg', 'VSG o PCR elevada') + c.chk('ep-gc', 'Gonococo o clamidia confirmados en el cuello')) +
      c.grupo('3 · Criterios específicos', c.chk('ep-bio', 'Endometritis en la biopsia endometrial') + c.chk('ep-img', 'Ecografía o RMN: trompas engrosadas con líquido, hiperemia o complejo tubo-ovárico') + c.chk('ep-atoimg', 'Absceso tubo-ovárico en la imagen') + c.chk('ep-lap', 'Laparoscopía compatible')) +
      c.grupo('4 · Criterios de internación', c.chk('ep-urg', 'No se descarta una urgencia quirúrgica') + c.chk('ep-ato', 'Absceso tubo-ovárico (clínica)') + c.chk('ep-grave', 'Enfermedad grave, náuseas y vómitos o fiebre alta') + c.chk('ep-oral', 'No tolera el tratamiento oral') + c.chk('ep-falla', 'Sin respuesta al tratamiento oral a las 72 horas')) +
      c.grupo('5 · Otros', c.chk('ep-diu', 'Usuaria de DIU')) +
      '<div id="ep-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · CDC STI Treatment Guidelines 2021 (MMWR Recomm Rep 2021;70(4)).</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function act() {
      var d = { hcg: L.v('ep-hcg'), cmt: L.c('ep-cmt'), utero: L.c('ep-ut'), anexo: L.c('ep-an'), fiebre: L.c('ep-fie'), muco: L.c('ep-muco'), leuco: L.c('ep-leu'), vsg: L.c('ep-vsg'), gc: L.c('ep-gc'),
        biopsia: L.c('ep-bio'), imagen: L.c('ep-img') || L.c('ep-atoimg'), atoImg: L.c('ep-atoimg'), lap: L.c('ep-lap'), urg: L.c('ep-urg'), ato: L.c('ep-ato'), grave: L.c('ep-grave'), oral: L.c('ep-oral'), falla: L.c('ep-falla'), diu: L.c('ep-diu') };
      var r = evaluar(d), h = [];
      h.push(F('Diagnóstico', '<strong>' + r.dx + '</strong>' + (r.adic.length ? c.ul(r.adic) : ''), '', r.color));
      if (r.minimo) {
        if (!esFull) h.push(opts.bloqueo('Internación, esquema y seguimiento en la versión completa'));
        else {
          h.push(F('Lugar de tratamiento', '<strong>' + (r.internar.length ? 'Internación' : 'Ambulatorio') + '</strong>' + (r.internar.length ? c.ul(r.internar) : ''), '', r.internar.length ? 'rojo' : 'verde'));
          h.push(F('Esquema', c.ul(r.trat), 'Sugerencia CaVeSal®. CDC 2021.', 'ambar'));
          h.push(F('Seguimiento', c.ul(r.seg), '', 'neutro'));
        }
      } else if (r.seg.length) h.push(F('Nota', c.ul(r.seg), '', 'neutro'));
      cont.querySelector('#ep-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.epi = { evaluar: evaluar, render: render };
})(window);
