/* CaVeSal® GYN · Oncología ginecológica: estadificación FIGO de cérvix (2018), endometrio (2023, con grupo molecular) y ovario (2014),
   con estudios de extensión, derivación y conducta general. Sin dosis.
   Algoritmo propio CaVeSal® · Basado en: FIGO 2018 cérvix (Bhatla N et al. IJGO 2019;145:129-135) · FIGO 2023 endometrio
   (Berek JS et al. IJGO 2023;162:383-394) · FIGO 2014 ovario (Prat J. IJGO 2014;124:1-5) · ESGO-ESTRO-ESP 2023 cérvix
   (Cibula D et al. Int J Gynecol Cancer 2023) · ESGO-ESTRO-ESP 2025 endometrio (Concin N et al. Lancet Oncol 2025) ·
   ESGO-ESMO-ESP 2024 ovario (Ledermann JA et al. Ann Oncol 2024;35:248-266) · ESGO/ESHRE/ESGE 2023 preservación de fertilidad.
   No reproduce las tablas de la FIGO: la lógica y los textos son propios.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  var DERIVAR = 'Derivar a ginecología oncológica y presentar en comité multidisciplinario.';

  /* ---------- Cérvix FIGO 2018 ---------- */
  // d: { micro (bool), prof (mm), tam (cm), ext: 'cervix'|'vagsup'|'param'|'vaginf'|'pared'|'mucosa'|'dist', gang: 'no'|'pelv'|'pa', metodo: 'r'|'p' }
  function cervix(d) {
    if (d.ext === 'dist') return 'IVB';
    if (d.ext === 'mucosa') return 'IVA';
    if (d.gang === 'pa') return 'IIIC2' + (d.metodo || 'r');
    if (d.gang === 'pelv') return 'IIIC1' + (d.metodo || 'r');
    if (d.ext === 'pared') return 'IIIB';
    if (d.ext === 'vaginf') return 'IIIA';
    if (d.ext === 'param') return 'IIB';
    if (d.ext === 'vagsup') { if (d.tam === null) return null; return d.tam <= 4 ? 'IIA1' : 'IIA2'; }
    if (d.micro) {
      if (d.prof === null) return null;
      if (d.prof <= 3) return 'IA1';
      if (d.prof <= 5) return 'IA2';
    }
    if (d.tam === null) return null;
    return d.tam <= 2 ? 'IB1' : d.tam <= 4 ? 'IB2' : 'IB3';
  }
  function cervixConducta(e, o) {
    var im = [], tto = [];
    im.push('RM pélvica con contraste para tamaño local y parametrios (obligatoria salvo IA1 sin LVSI).');
    if (/^(IB3|IIA2|IIB|III|IV)/.test(e) || o.sospechaGang) im.push('PET-TC (o TC de tórax, abdomen y pelvis) para ganglios y metástasis.');
    if (e === 'IA1') tto.push(o.lvsi ? 'IA1 con LVSI: conización o histerectomía simple con ganglio centinela.' : 'IA1 sin LVSI: conización con márgenes libres o histerectomía simple con paridad cumplida.');
    else if (e === 'IA2') tto.push('IA2: conización o histerectomía simple con ganglio centinela; radical modificada si hay LVSI.');
    else if (e === 'IB1' || e === 'IB2' || e === 'IIA1') {
      tto.push('Histerectomía radical con estadificación ganglionar pélvica (centinela más linfadenectomía), por vía abierta.');
      if (o.fertilidad && e === 'IB1') tto.push('Deseo de embarazo y tumor de 2 cm o menos: traquelectomía radical en centro de referencia.');
    } else if (/^(IB3|IIA2|IIB|III|IVA)/.test(e)) tto.push('Quimiorradioterapia concurrente con platino más braquiterapia.');
    else if (e === 'IVB') tto.push('Tratamiento sistémico; radioterapia paliativa según el caso.');
    return { im: im, tto: tto };
  }

  /* ---------- Endometrio FIGO 2023 ---------- */
  // d: { agresivo, mio: 'no'|'menos50'|'50omas', estroma, lvsi: 'no'|'focal'|'sust', ovario, ovarioIA3, serosa, vagpar, peritPelv,
  //      mucosa, peritAbd, dist, gang: 'no'|'p-mic'|'p-mac'|'pa-mic'|'pa-mac', mol: ''|'pole'|'mmrd'|'nsmp'|'p53' }
  function endometrio(d) {
    var e;
    if (d.dist) e = 'IVC';
    else if (d.peritAbd) e = 'IVB';
    else if (d.mucosa) e = 'IVA';
    else if (d.gang === 'pa-mac') e = 'IIIC2ii';
    else if (d.gang === 'pa-mic') e = 'IIIC2i';
    else if (d.gang === 'p-mac') e = 'IIIC1ii';
    else if (d.gang === 'p-mic') e = 'IIIC1i';
    else if (d.peritPelv) e = 'IIIB2';
    else if (d.vagpar) e = 'IIIB1';
    else if (d.serosa) e = 'IIIA2';
    else if (d.ovario && !(d.ovarioIA3 && !d.agresivo && d.mio !== '50omas' && d.lvsi !== 'sust' && !d.estroma)) e = 'IIIA1';
    else if (d.agresivo) e = d.mio === 'no' && !d.estroma ? 'IC' : 'IIC';
    else if (d.lvsi === 'sust') e = 'IIB';
    else if (d.estroma) e = 'IIA';
    else if (d.ovario) e = 'IA3';
    else e = d.mio === '50omas' ? 'IB' : d.mio === 'menos50' ? 'IA2' : 'IA1';
    var anat = e, mol = '';
    if (/^(I|II)[ABC]/.test(e)) {
      if (d.mol === 'pole') { e = 'IAm POLEmut'; mol = 'POLEmut baja el estadio I a II a IAm.'; }
      else if (d.mol === 'p53' && d.mio !== 'no') { e = 'IICm p53abn'; mol = 'p53abn con invasión miometrial sube el estadio I a II a IICm.'; }
      else if (d.mol) mol = 'Grupo molecular registrado (' + { mmrd: 'MMRd', nsmp: 'NSMP', p53: 'p53abn' }[d.mol] + '): no modifica el estadio.';
    } else if (d.mol) mol = 'En estadios III y IV el grupo molecular no modifica el estadio; se registra.';
    return { estadio: e, anat: anat, mol: mol };
  }
  function endometrioConducta(r, d) {
    var e = r.estadio, im = [], tto = [], gen = [];
    im.push('RM pélvica o ecografía experta para invasión miometrial y estroma cervical.');
    if (d.agresivo || /^(II|III|IV)/.test(r.anat)) im.push('TC de tórax, abdomen y pelvis con contraste (o PET-TC) por alto riesgo.');
    gen.push('Clasificación molecular en todos los casos (POLE, MMR, p53).');
    if (d.mol === 'mmrd') gen.push('MMRd: asesoramiento genético y estudio de síndrome de Lynch.');
    if (/^IV[BC]/.test(e)) tto.push('Tratamiento sistémico (quimioterapia con inmunoterapia, sobre todo en MMRd); cirugía o radioterapia paliativa según el caso.');
    else {
      tto.push('Histerectomía total con salpingooforectomía bilateral y ganglio centinela, por vía mínimamente invasiva si no hay enfermedad extrauterina.');
      if (e === 'IAm POLEmut') tto.push('IAm POLEmut: sin tratamiento adyuvante.');
      else if (e === 'IICm p53abn') tto.push('IICm p53abn: quimioterapia con o sin radioterapia.');
      else if (e === 'IA1' || e === 'IA2' || e === 'IA3') tto.push('Bajo riesgo: sin adyuvancia o braquiterapia vaginal según el grupo de riesgo.');
      else if (/^(IB|IC|IIA|IIB|IIC)$/.test(e)) tto.push('Riesgo intermedio a alto: braquiterapia o radioterapia pélvica; quimioterapia en los de alto riesgo.');
      else if (/^III|IVA/.test(e)) tto.push('Cirugía más tratamiento sistémico (inmunoterapia, sobre todo en MMRd) con o sin radioterapia.');
      if (d.fertilidad && !d.agresivo && (e === 'IA1' || e === 'IA2') && d.mio === 'no') tto.push('Deseo de embarazo con IA1 de bajo grado: preservación de fertilidad en centro de referencia (ESGO/ESHRE/ESGE 2023).');
    }
    return { im: im, tto: tto, gen: gen };
  }

  /* ---------- Ovario FIGO 2014 ---------- */
  // d: { lado: 'uno'|'ambos', ic1, ic2, ic3, pelv: 'no'|'utero'|'otros', gang: 'no'|'hasta10'|'mas10', perit: 'no'|'micro'|'hasta2'|'mas2', pleura, dist }
  function ovario(d) {
    if (d.dist) return 'IVB';
    if (d.pleura) return 'IVA';
    if (d.perit === 'mas2') return 'IIIC';
    if (d.perit === 'hasta2') return 'IIIB';
    if (d.perit === 'micro') return 'IIIA2';
    if (d.gang === 'mas10') return 'IIIA1(ii)';
    if (d.gang === 'hasta10') return 'IIIA1(i)';
    if (d.pelv === 'otros') return 'IIB';
    if (d.pelv === 'utero') return 'IIA';
    if (d.ic3) return 'IC3';
    if (d.ic2) return 'IC2';
    if (d.ic1) return 'IC1';
    if (!d.lado) return null;
    return d.lado === 'ambos' ? 'IB' : 'IA';
  }
  function ovarioConducta(e, o) {
    var im = ['TC de tórax, abdomen y pelvis con contraste; marcadores CA-125 y CEA (CA 19-9 si es mucinoso).'], tto = [], gen = [];
    if (o.histo === 'ag') gen.push('Alto grado no mucinoso: estudio de BRCA germinal y somático en cualquier estadio, con asesoramiento genético.');
    if (o.histo === 'ag' && /^(III|IV)/.test(e)) gen.push('BRCA sin mutación en estadio III o IV: estudio de HRD.');
    if (/^(I|II)[ABC]/.test(e) && !/^III/.test(e)) {
      tto.push('Cirugía de estadificación completa: histerectomía, anexectomía bilateral, omentectomía, biopsias peritoneales, lavado y ganglios.');
      if (o.fertilidad && /^(IA|IC1|IC2|IC3)$/.test(e) && o.lado !== 'ambos') tto.push('Deseo de embarazo y enfermedad unilateral: cirugía con preservación de fertilidad en casos seleccionados (bajo grado o según histología).');
      tto.push(o.histo === 'bg' && (e === 'IA' || e === 'IB') ? 'Bajo grado IA o IB: sin quimioterapia adyuvante.' : 'Quimioterapia adyuvante con platino.');
    } else {
      tto.push('Citorreducción primaria con objetivo de no dejar enfermedad residual, o quimioterapia neoadyuvante y cirugía de intervalo si no es resecable o no es operable.');
      tto.push('Mantenimiento según BRCA y HRD (inhibidores de PARP, bevacizumab).');
      im.push('La imagen sola no decide la resecabilidad: evaluación por ginecología oncológica (laparoscopía diagnóstica según el caso).');
    }
    return { im: im, tto: tto, gen: gen };
  }

  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">Cargá los hallazgos clínicos, de imagen y de anatomía patológica. Devuelve el estadio FIGO, los estudios de extensión y la conducta general. Sin dosis.</p>' +
      '<h3 class="sub">Cérvix · FIGO 2018</h3>' +
      '<div class="form">' + c.sel('cx-ext', [['cervix', 'Limitado al cuello'], ['vagsup', 'Dos tercios superiores de vagina'], ['param', 'Parametrios, sin pared pélvica'], ['vaginf', 'Tercio inferior de vagina'], ['pared', 'Pared pélvica o hidronefrosis'], ['mucosa', 'Mucosa de vejiga o recto (biopsia)'], ['dist', 'Metástasis a distancia']], 'Extensión') +
        c.campo('cx-tam', 'Tamaño tumoral mayor', 'cm') + c.campo('cx-prof', 'Profundidad de invasión (solo microscópica)', 'mm') +
        c.sel('cx-gang', [['no', 'Sin ganglios positivos'], ['pelv', 'Pélvicos'], ['pa', 'Paraaórticos']], 'Ganglios') +
        c.sel('cx-met', [['r', 'Por imagen (r)'], ['p', 'Por patología (p)']], 'Ganglios confirmados') + '</div>' +
      c.chk('cx-mic', 'Lesión solo microscópica') + c.chk('cx-lvsi', 'Invasión linfovascular (LVSI)') + c.chk('cx-fer', 'Deseo de embarazo') +
      '<div id="cx-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: FIGO 2018 (Bhatla N et al. Int J Gynaecol Obstet 2019;145:129-135) · ESGO-ESTRO-ESP 2023 (Cibula D et al. Int J Gynecol Cancer 2023)</p>' +

      '<h3 class="sub">Endometrio · FIGO 2023 con grupo molecular</h3>' +
      '<div class="form">' + c.sel('en-his', [['no', 'No agresivo: endometrioide grado 1 o 2'], ['si', 'Agresivo: endometrioide G3, seroso, células claras, carcinosarcoma, indiferenciado, mixto, otros']], 'Histología') +
        c.sel('en-mio', [['no', 'Sin invasión miometrial (endometrio o pólipo)'], ['menos50', 'Menos del 50 %'], ['50omas', '50 % o más']], 'Invasión miometrial') +
        c.sel('en-lvsi', [['no', 'Sin LVSI'], ['focal', 'LVSI focal'], ['sust', 'LVSI sustancial (5 vasos o más)']], 'LVSI') +
        c.sel('en-gang', [['no', 'Sin ganglios positivos'], ['p-mic', 'Pélvicos, micrometástasis'], ['p-mac', 'Pélvicos, macrometástasis'], ['pa-mic', 'Paraaórticos, micrometástasis'], ['pa-mac', 'Paraaórticos, macrometástasis']], 'Ganglios') +
        c.sel('en-mol', [['', 'Sin dato molecular'], ['pole', 'POLEmut'], ['mmrd', 'MMRd'], ['nsmp', 'NSMP'], ['p53', 'p53abn']], 'Grupo molecular') + '</div>' +
      c.grupo('Extensión', c.chk('en-est', 'Estroma cervical') + c.chk('en-ova', 'Ovario o trompa') +
        c.chk('en-ia3', 'Ovario: unilateral, limitado al ovario, sin rotura (criterios IA3)') + c.chk('en-ser', 'Serosa uterina') +
        c.chk('en-vag', 'Vagina o parametrios') + c.chk('en-pp', 'Peritoneo pélvico') + c.chk('en-muc', 'Mucosa de vejiga o intestino') +
        c.chk('en-pa', 'Peritoneo abdominal fuera de la pelvis') + c.chk('en-dis', 'Metástasis a distancia (incluye ganglios por encima de los vasos renales)')) +
      c.chk('en-fer', 'Deseo de embarazo') +
      '<div id="en-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: FIGO 2023 (Berek JS et al. Int J Gynaecol Obstet 2023;162:383-394) · ESGO-ESTRO-ESP 2025 (Concin N et al. Lancet Oncol 2025) · ESGO/ESHRE/ESGE 2023</p>' +

      '<h3 class="sub">Ovario, trompa y peritoneo · FIGO 2014</h3>' +
      '<div class="form">' + c.sel('ov-lado', [['', 'Elegí'], ['uno', 'Un ovario o trompa'], ['ambos', 'Ambos']], 'Compromiso') +
        c.sel('ov-pelv', [['no', 'Sin extensión pélvica'], ['utero', 'Útero o trompas'], ['otros', 'Otros tejidos pélvicos']], 'Extensión pélvica') +
        c.sel('ov-gang', [['no', 'Sin ganglios retroperitoneales'], ['hasta10', 'Ganglios positivos, 10 mm o menos'], ['mas10', 'Ganglios positivos, más de 10 mm']], 'Ganglios') +
        c.sel('ov-per', [['no', 'Sin peritoneo extrapélvico'], ['micro', 'Microscópico'], ['hasta2', 'Macroscópico, 2 cm o menos'], ['mas2', 'Macroscópico, más de 2 cm']], 'Peritoneo fuera de la pelvis') +
        c.sel('ov-his', [['ag', 'Alto grado no mucinoso'], ['bg', 'Bajo grado'], ['muc', 'Mucinoso'], ['otro', 'Otra']], 'Histología') + '</div>' +
      c.grupo('Estadio I', c.chk('ov-ic1', 'Derrame quirúrgico (IC1)') + c.chk('ov-ic2', 'Rotura antes de la cirugía o tumor en superficie (IC2)') + c.chk('ov-ic3', 'Células malignas en ascitis o lavado (IC3)')) +
      c.chk('ov-ple', 'Derrame pleural con citología positiva') + c.chk('ov-dis', 'Metástasis parenquimatosas o extraabdominales (incluye ganglios inguinales)') + c.chk('ov-fer', 'Deseo de embarazo') +
      '<div id="ov-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: FIGO 2014 (Prat J. Int J Gynaecol Obstet 2014;124:1-5) · ESGO-ESMO-ESP 2024 (Ledermann JA et al. Ann Oncol 2024;35:248-266)</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function bloque(est, cd, extra) {
      return F('Estadio FIGO', '<strong>' + est + '</strong>', extra || '', 'rojo') + F('Derivación', DERIVAR, '', 'rojo') +
        (cd.gen && cd.gen.length ? F('Estudio genético', c.ul(cd.gen), '', 'naranja') : '') +
        F('Estudios de extensión', c.ul(cd.im), '', 'naranja') + F('Conducta general', c.ul(cd.tto), '', 'neutro');
    }
    function actualizar() {
      var ex = cervix({ micro: L.c('cx-mic'), prof: L.n('cx-prof'), tam: L.n('cx-tam'), ext: L.v('cx-ext'), gang: L.v('cx-gang'), metodo: L.v('cx-met') });
      q('#cx-out').innerHTML = ex ? bloque(ex, cervixConducta(ex, { lvsi: L.c('cx-lvsi'), fertilidad: L.c('cx-fer'), sospechaGang: L.v('cx-gang') !== 'no' }))
        : F('Cérvix', L.c('cx-mic') ? 'Ingresá la profundidad de invasión.' : 'Ingresá el tamaño tumoral.', '', 'neutro');

      var de = { agresivo: L.v('en-his') === 'si', mio: L.v('en-mio'), estroma: L.c('en-est'), lvsi: L.v('en-lvsi'), ovario: L.c('en-ova'), ovarioIA3: L.c('en-ia3'),
        serosa: L.c('en-ser'), vagpar: L.c('en-vag'), peritPelv: L.c('en-pp'), mucosa: L.c('en-muc'), peritAbd: L.c('en-pa'), dist: L.c('en-dis'),
        gang: L.v('en-gang'), mol: L.v('en-mol'), fertilidad: L.c('en-fer') };
      var re = endometrio(de);
      q('#en-out').innerHTML = bloque(re.estadio, endometrioConducta(re, de), (re.estadio !== re.anat ? 'Anatómico: ' + re.anat + '. ' : '') + re.mol);

      var dov = { lado: L.v('ov-lado'), ic1: L.c('ov-ic1'), ic2: L.c('ov-ic2'), ic3: L.c('ov-ic3'), pelv: L.v('ov-pelv'), gang: L.v('ov-gang'), perit: L.v('ov-per'), pleura: L.c('ov-ple'), dist: L.c('ov-dis') };
      var eo = ovario(dov);
      q('#ov-out').innerHTML = eo ? bloque(eo, ovarioConducta(eo, { histo: L.v('ov-his'), fertilidad: L.c('ov-fer'), lado: dov.lado })) : F('Ovario', 'Elegí el compromiso ovárico.', '', 'neutro');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.onco = { cervix: cervix, endometrio: endometrio, ovario: ovario, cervixConducta: cervixConducta, endometrioConducta: endometrioConducta, ovarioConducta: ovarioConducta, render: render };
})(window);
