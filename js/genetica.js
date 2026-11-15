/* CaVeSal® GYN · Cáncer hereditario: criterios de derivación a genética (BRCA y síndrome de Lynch) y conducta en portadoras.
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  var PANEL = 'Panel multigén: BRCA1, BRCA2, PALB2, ATM, CHEK2, RAD51C, RAD51D, BRIP1, TP53, PTEN, CDH1, STK11, MLH1, MSH2, MSH6, PMS2 y EPCAM.';

  // d: { mamaEdad, tn, bilateral, ovario, pancreas, prostata, asq, endoEdad, ccrEdad, dmmr, metilMlh1,
  //      fMut, fMama50, fOvario, fMamaVaron, fPancreas, fProstata, f3mama, ams3, ams2gen, ams50, premm, resultado }
  function evaluar(d) {
    var r = { hboc: [], lynch: [], conducta: [], portadora: [], color: 'verde' };
    if (d.fMut) { r.hboc.push('Variante patogénica conocida en la familia: estudiar esa variante (estudio en cascada) (NCCN · MSPBS 2025)'); }
    if (d.mamaEdad !== null) {
      if (d.mamaEdad <= 45) r.hboc.push('Cáncer de mama a los 45 años o antes (MSPBS 2025 · NCCN)');
      else if (d.mamaEdad <= 50) r.hboc.push('Cáncer de mama a los 50 años o antes (NCCN)');
      if (d.tn) r.hboc.push('Cáncer de mama triple negativo (NCCN: a cualquier edad; MSPBS 2025: hasta los 60 años)');
      if (d.bilateral) r.hboc.push('Cáncer de mama bilateral o múltiples primarios (NCCN)');
      if (d.fMama50 || d.fOvario || d.fPancreas || d.fProstata) r.hboc.push('Cáncer de mama con familiar cercano con mama a los 50 o antes, ovario, páncreas o próstata metastásica (NCCN · MSPBS 2025)');
      if (d.asq) r.hboc.push('Cáncer de mama con ascendencia judía asquenazí (NCCN)');
    }
    if (d.ovario) r.hboc.push('Cáncer epitelial de ovario, trompa o peritoneo a cualquier edad (NCCN · ACOG PB 182 · MSPBS 2025)');
    if (d.pancreas) r.hboc.push('Cáncer de páncreas exocrino (NCCN)');
    if (d.prostata) r.hboc.push('Cáncer de próstata metastásico (NCCN)');
    if (d.fMamaVaron) r.hboc.push('Varón con cáncer de mama en la familia (NCCN · MSPBS 2025)');
    if (d.fOvario && d.mamaEdad === null) r.hboc.push('Familiar de primer o segundo grado con cáncer de ovario (NCCN)');
    if (d.f3mama) r.hboc.push('Tres o más familiares del mismo lado con cáncer de mama (NCCN · MSPBS 2025)');
    if (d.fMama50 && d.mamaEdad === null && !d.f3mama) r.hboc.push('Familiar de primer grado con cáncer de mama a los 50 o antes: evaluar con un modelo de riesgo (Tyrer-Cuzick, CanRisk); estudiar si la probabilidad de variante es mayor de 5 % (NCCN)');

    if (d.dmmr) r.lynch.push(d.metilMlh1 ? 'Tumor con pérdida de MLH1 por hipermetilación del promotor: probablemente esporádico; no requiere estudio germinal salvo otros criterios' : 'Tumor (endometrio o colon) con deficiencia de reparación (dMMR) o inestabilidad de microsatélites (NCCN · ACOG)');
    if (d.endoEdad !== null && d.endoEdad < 50) r.lynch.push('Cáncer de endometrio antes de los 50 años (NCCN · ACOG PB 147)');
    if (d.ccrEdad !== null && d.ccrEdad < 50) r.lynch.push('Cáncer colorrectal antes de los 50 años (NCCN · Bethesda revisado)');
    if (d.ams3 && d.ams2gen && d.ams50) r.lynch.push('Criterios de Amsterdam II: 3 o más familiares con cánceres de Lynch, en 2 generaciones, uno antes de los 50');
    else if (d.ams3) r.lynch.push('Tres o más familiares con cánceres del espectro de Lynch (colon, endometrio, ovario, estómago, intestino delgado, urotelio, vía biliar): derivar aunque no cumpla Amsterdam II completo');
    if (d.premm !== null && d.premm >= 2.5) r.lynch.push('PREMM5 de 2,5 % o más (NCCN)');
    if ((d.endoEdad !== null || d.ccrEdad !== null) && !d.dmmr) r.conducta.push('Todo cáncer de endometrio y colorrectal: inmunohistoquímica de MMR o MSI en el tumor (tamizaje universal, NCCN · ACOG).');

    var lyn = r.lynch.filter(function (x) { return x.indexOf('esporádico') < 0; }).length > 0;
    if (r.hboc.length || lyn) {
      r.color = 'naranja';
      r.conducta.unshift('Derivar a asesoramiento genético con consentimiento informado. ' + PANEL);
      r.conducta.push('Un resultado negativo sin variante familiar conocida no descarta riesgo: seguir según la historia familiar. Una variante de significado incierto (VUS) no cambia la conducta.');
    } else if (!r.portadora.length && !d.resultado) r.conducta.push('Sin criterios de derivación con los datos cargados. Recalcular si cambia la historia personal o familiar.');

    var R = d.resultado;
    if (R === 'brca1' || R === 'brca2') {
      r.color = 'rojo';
      r.portadora.push('Mama: autoconocimiento desde los 18; examen clínico cada 6 a 12 meses desde los 25; RM anual desde los 25 y mamografía anual desde los 30 (NCCN). Discutir mastectomía bilateral reductora.');
      r.portadora.push(R === 'brca1' ? 'Salpingo-ooforectomía bilateral reductora entre los 35 y 40 años, al completar la paridad (NCCN · ACOG PB 182).' : 'Salpingo-ooforectomía bilateral reductora entre los 40 y 45 años, al completar la paridad (NCCN).');
      r.portadora.push('Antes de la cirugía: la ecografía transvaginal y el CA-125 no son tamizaje eficaz; pueden usarse a criterio clínico hasta la cirugía.');
      r.portadora.push('Los AOC reducen el riesgo de cáncer de ovario. Tras la ooforectomía antes de la menopausia natural, THM hasta la edad de la menopausia si no tuvo cáncer de mama.');
    } else if (R === 'palb2' || R === 'rad51') {
      r.color = 'rojo';
      r.portadora.push(R === 'palb2' ? 'PALB2: RM anual desde los 30 y mamografía anual desde los 30; considerar salpingo-ooforectomía desde los 45 (NCCN).' : 'RAD51C o RAD51D o BRIP1: salpingo-ooforectomía entre los 45 y 50 años (NCCN).');
    } else if (R === 'lynch1' || R === 'lynch2' || R === 'lynch3') {
      r.color = 'rojo';
      r.portadora.push(R === 'lynch1' ? 'MLH1, MSH2 o EPCAM: colonoscopía cada 1 a 2 años desde los 20 a 25 años (o 2 a 5 años antes del caso más joven).' : R === 'lynch2' ? 'MSH6: colonoscopía cada 1 a 3 años desde los 30 a 35 años.' : 'PMS2: colonoscopía cada 1 a 3 años desde los 30 a 35 años.');
      r.portadora.push(R === 'lynch3' ? 'Endometrio: histerectomía reductora opcional; el riesgo de cáncer de ovario no está claramente aumentado (NCCN).' : 'Endometrio y ovario: histerectomía con salpingo-ooforectomía reductora al completar la paridad, en general alrededor de los 40 años; biopsia endometrial cada 1 a 2 años desde los 30 a 35 es opcional hasta la cirugía.');
      r.portadora.push('Estudiar a los familiares de primer grado (cascada). Considerar aspirina para la prevención colorrectal, individualizada.');
    }
    return r;
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    cont.innerHTML =
      c.grupo('Historia personal', '<div class="grid2">' + c.campo('gn-mama', 'Edad al diagnóstico de cáncer de mama', 'años', '1') + c.campo('gn-endo', 'Edad al diagnóstico de cáncer de endometrio', 'años', '1') + c.campo('gn-ccr', 'Edad al diagnóstico de cáncer colorrectal', 'años', '1') + c.campo('gn-premm', 'PREMM5 (opcional)', '%', '0.1') + '</div>' +
        c.chk('gn-tn', 'Mama triple negativo') + c.chk('gn-bil', 'Mama bilateral o múltiples primarios') + c.chk('gn-ov', 'Cáncer epitelial de ovario, trompa o peritoneo') + c.chk('gn-pan', 'Cáncer de páncreas') + c.chk('gn-pro', 'Cáncer de próstata metastásico (varón)') +
        c.chk('gn-dmmr', 'Tumor con dMMR o MSI alta') + c.chk('gn-met', 'Pérdida de MLH1 con hipermetilación del promotor') + c.chk('gn-asq', 'Ascendencia judía asquenazí')) +
      c.grupo('Historia familiar (primer y segundo grado, mismo lado)', c.chk('gn-fmut', 'Variante patogénica conocida en la familia') + c.chk('gn-fm50', 'Cáncer de mama a los 50 o antes') + c.chk('gn-fov', 'Cáncer de ovario') + c.chk('gn-fmv', 'Varón con cáncer de mama') +
        c.chk('gn-fpan', 'Cáncer de páncreas') + c.chk('gn-fpro', 'Cáncer de próstata metastásico') + c.chk('gn-f3', 'Tres o más con cáncer de mama') +
        c.chk('gn-a3', 'Tres o más con cánceres del espectro de Lynch, uno de primer grado de los otros') + c.chk('gn-a2', 'En dos generaciones sucesivas') + c.chk('gn-a50', 'Uno diagnosticado antes de los 50')) +
      c.grupo('Resultado genético (si ya lo tiene)', c.sel('gn-res', [['', 'Sin estudio o negativo'], ['brca1', 'BRCA1'], ['brca2', 'BRCA2'], ['palb2', 'PALB2'], ['rad51', 'RAD51C, RAD51D o BRIP1'], ['lynch1', 'Síndrome de Lynch: MLH1, MSH2 o EPCAM'], ['lynch2', 'Síndrome de Lynch: MSH6'], ['lynch3', 'Síndrome de Lynch: PMS2']], 'Variante patogénica')) +
      '<div id="gn-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: NCCN Genetic/Familial High-Risk Assessment: Breast, Ovarian, Pancreatic and Prostate · NCCN Genetic/Familial High-Risk Assessment: Colorectal, Endometrial and Gastric · ACOG PB 182 (2017, reafirmado) · ACOG PB 147 (síndrome de Lynch) · Criterios de Amsterdam II (1999) · MSPBS Paraguay, Manual Nacional de Normas de Atención de Patologías Ginecológicas 2025</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function act() {
      var r = evaluar({ mamaEdad: L.n('gn-mama'), endoEdad: L.n('gn-endo'), ccrEdad: L.n('gn-ccr'), premm: L.n('gn-premm'), tn: L.c('gn-tn'), bilateral: L.c('gn-bil'), ovario: L.c('gn-ov'), pancreas: L.c('gn-pan'), prostata: L.c('gn-pro'),
        dmmr: L.c('gn-dmmr'), metilMlh1: L.c('gn-met'), asq: L.c('gn-asq'), fMut: L.c('gn-fmut'), fMama50: L.c('gn-fm50'), fOvario: L.c('gn-fov'), fMamaVaron: L.c('gn-fmv'), fPancreas: L.c('gn-fpan'), fProstata: L.c('gn-fpro'), f3mama: L.c('gn-f3'),
        ams3: L.c('gn-a3'), ams2gen: L.c('gn-a2'), ams50: L.c('gn-a50'), resultado: L.v('gn-res') });
      var h = [];
      h.push(F('Mama y ovario hereditario (BRCA y otros)', r.hboc.length ? c.ul(r.hboc) : 'Sin criterios cargados.', '', r.hboc.length ? 'naranja' : 'verde'));
      h.push(F('Síndrome de Lynch', r.lynch.length ? c.ul(r.lynch) : 'Sin criterios cargados.', '', r.lynch.length ? 'naranja' : 'verde'));
      h.push(esFull ? F('Conducta', c.ul(r.conducta), 'Sugerencia CaVeSal®.', r.color) : opts.bloqueo('Derivación y panel en la versión completa'));
      if (r.portadora.length) h.push(esFull ? F('Seguimiento y cirugía reductora', c.ul(r.portadora), 'Sugerencia CaVeSal®.', 'rojo') : opts.bloqueo('Seguimiento de portadoras en la versión completa'));
      q('#gn-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.genetica = { evaluar: evaluar, render: render };
})(window);
