/* CaVeSal® GYN · Marcadores tumorales: origen probable, causas de falso positivo y conducta.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) «Tumores de ovario por origen y marcadores tumorales» ·
   OMS 2020 (tumores genitales femeninos) · ESMO no epiteliales (Ray-Coquard I et al. Ann Oncol 2018;29 Suppl 4:iv1-iv18) ·
   ESGO-ESMO-ESP 2024 · RCOG GTG 62 · ACOG PB 174 · Moore RG et al. Gynecol Oncol 2009;112:40-46 (ROMA).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  function coma(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }

  // ROMA (Moore 2009). Cortes del ensayo Abbott Architect: premenopausia 7,4 % · posmenopausia 25,3 %.
  function roma(he4, ca125, post) {
    if (!he4 || !ca125) return null;
    var pi = post ? -8.09 + 1.04 * Math.log(he4) + 0.732 * Math.log(ca125) : -12.0 + 2.38 * Math.log(he4) + 0.0626 * Math.log(ca125);
    var v = Math.exp(pi) / (1 + Math.exp(pi)) * 100;
    return { v: Math.round(v * 10) / 10, alto: v >= (post ? 25.3 : 7.4), corte: post ? '25,3' : '7,4' };
  }

  // d: { edad, post, masa, solida, ca125, he4, cea, ca199, afp, hcg, ldh, inh, amh, e2, testo, ca153 } (los cualitativos: 'a' elevado | 'n' normal | '')
  function evaluar(d) {
    var r = { origen: [], filas: [], conducta: [], pedir: [], falsos: [] };
    var A = function (k) { return d[k] === 'a'; };
    var ca = d.ca125, caAlto = ca !== null && ca > 35;
    var ceaAlto = d.cea !== null && d.cea > 5, c199Alto = d.ca199 !== null && d.ca199 > 37;
    var ro = d.he4 !== null && ca !== null ? roma(d.he4, ca, d.post) : null;

    r.pedir.push('Masa anexial: CA-125 en toda posmenopáusica; en la premenopausia según la imagen (ACOG, RCOG).');
    if (d.edad !== null && d.edad < 40 && d.masa) r.pedir.push('Menos de 40 años con masa compleja o sólida: LDH, AFP y β-hCG (RCOG GTG 62), además de CA-125.');
    if (d.solida || d.masa && d.post) r.pedir.push('HE4 para ROMA, y CEA y CA 19-9 si la masa es mucinosa o multilocular (ESGO/ISUOG/IOTA/ESGE).');
    r.pedir.push('Sospecha de tumor de cordones sexuales (sangrado, hiperestrogenismo o virilización): inhibina B, AMH, estradiol y testosterona.');

    if (ca !== null) r.filas.push(['CA-125', '<strong>' + coma(ca) + ' U/mL' + (caAlto ? ': elevado (más de 35)' : ': normal') + '</strong>', d.post ? 'Posmenopausia: más de 35 U/mL deriva a ginecología oncológica.' : 'Premenopausia: más de 200 U/mL deriva; entre 35 y 200 hay muchas causas benignas.', caAlto ? (d.post || ca > 200 ? 'rojo' : 'ambar') : 'verde']);
    if (d.he4 !== null) r.filas.push(['HE4', coma(d.he4) + ' pmol/L', 'El corte varía según la edad y el método: compararlo con el laboratorio. El HE4 no sube con la endometriosis.', 'neutro']);
    if (ro) r.filas.push(['ROMA', '<strong>' + coma(ro.v) + ' %: ' + (ro.alto ? 'riesgo alto' : 'riesgo bajo') + '</strong>', 'Moore 2009; corte ' + ro.corte + ' % en ' + (d.post ? 'la posmenopausia' : 'la premenopausia') + ' (ensayo Abbott Architect: verificá el de tu laboratorio).', ro.alto ? 'rojo' : 'verde']);
    if (d.cea !== null) r.filas.push(['CEA', coma(d.cea) + ' ng/mL' + (ceaAlto ? ': elevado (más de 5)' : ''), 'Sube con el tabaco.', ceaAlto ? 'ambar' : 'verde']);
    if (d.ca199 !== null) r.filas.push(['CA 19-9', coma(d.ca199) + ' U/mL' + (c199Alto ? ': elevado (más de 37)' : ''), 'Puede subir en el teratoma maduro y en enfermedades biliares y pancreáticas.', c199Alto ? 'ambar' : 'verde']);

    // Origen probable
    if (A('afp') && A('hcg')) r.origen.push(['Germinal', 'Carcinoma embrionario o tumor germinal mixto (AFP + hCG)']);
    else if (A('afp')) r.origen.push(['Germinal', 'Tumor del saco vitelino (AFP); teratoma inmaduro a veces']);
    else if (A('hcg')) r.origen.push(['Germinal', 'Coriocarcinoma no gestacional o disgerminoma con sincitiotrofoblasto (hCG). Descartar primero embarazo y enfermedad trofoblástica']);
    if (A('ldh')) r.origen.push(['Germinal', 'Disgerminoma (LDH)']);
    if (A('inh') || A('amh')) r.origen.push(['Cordones sexuales', 'Tumor de células de la granulosa (inhibina B, AMH' + (A('e2') ? ' y estradiol' : '') + ')']);
    else if (A('e2')) r.origen.push(['Cordones sexuales', 'Tecoma o granulosa (estradiol elevado)']);
    if (A('testo')) r.origen.push(['Cordones sexuales', 'Sertoli-Leydig (testosterona; AFP a veces)']);
    if (ceaAlto || c199Alto) r.origen.push(['Epitelial / metastásico', 'Mucinoso (CEA y CA 19-9, el CA-125 suele ser normal) o metástasis digestiva (Krukenberg): descartar un primario digestivo']);
    if (caAlto && !(d.he4 !== null && ro && !ro.alto && !d.post)) r.origen.push(['Epitelial', 'Seroso, endometrioide o de células claras (CA-125' + (ro && ro.alto ? ' con ROMA alto' : '') + ')']);
    if (caAlto && !d.post && ro && !ro.alto) r.origen.push(['Probable benigno', 'CA-125 elevado con ROMA bajo en la premenopausia: más frecuente en endometriosis, miomas, EPI o menstruación']);
    if (A('ca153')) r.origen.push(['Metastásico', 'Mama (CA 15-3): sirve para seguimiento, no para diagnóstico']);

    r.falsos = ['CA-125: endometriosis, menstruación, embarazo, EPI, miomas, ascitis de cualquier causa, cirrosis, derrame pleural; es normal en cerca de la mitad de los estadios I.',
      'β-hCG: embarazo y enfermedad trofoblástica. AFP: embarazo y enfermedad hepática. CEA: tabaco, enfermedad inflamatoria intestinal. CA 19-9: colestasis, pancreatitis, teratoma maduro.',
      'Ningún marcador solo diferencia benigno de maligno (ESGO-ESMO-ESP 2024).'];

    var germ = A('afp') || A('hcg') || A('ldh');
    if (d.post && caAlto || !d.post && ca !== null && ca > 200) r.conducta.push('Derivar a ginecología oncológica (CA-125 ' + coma(ca) + ' U/mL en ' + (d.post ? 'la posmenopausia' : 'la premenopausia') + ').');
    if (ro && ro.alto) r.conducta.push('ROMA alto: derivar a ginecología oncológica.');
    if (germ) r.conducta.push('Marcador germinal elevado con masa: derivar a ginecología oncológica; en niñas y adolescentes priorizar la cirugía conservadora de la fertilidad (ESMO 2018). Premenárquica con gónada disgenética: cariotipo antes de la cirugía.');
    if (A('inh') || A('amh') || A('e2')) r.conducta.push('Sospecha de granulosa con hiperestrogenismo: biopsia de endometrio (hiperplasia o cáncer asociados).');
    if (ceaAlto || c199Alto) r.conducta.push('CEA o CA 19-9 elevados: endoscopía digestiva o TC para descartar un primario digestivo antes de la cirugía.');
    if (d.masa) r.conducta.push('Clasificar la imagen con O-RADS e IOTA (módulo Masa anexial).');
    if (!r.conducta.length) r.conducta.push('Sin marcadores que deriven: decidir con la imagen (O-RADS/IOTA) y la clínica; repetir el CA-125 fuera de la menstruación si hay duda.');
    return r;
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila;
    var Q = function (id, t) { return c.sel(id, [['', 'Sin dato'], ['n', 'Normal'], ['a', 'Elevado']], t); };
    cont.innerHTML = '<p class="ayuda">Flujo: edad y estado menopáusico → marcadores cargados → origen probable → falsos positivos → conducta y derivación. Para los cualitativos, usá el rango de tu laboratorio.</p>' +
      c.grupo('Datos', '<div class="grid2">' + c.campo('mk-edad', 'Edad', 'años', '1') + c.sel('mk-meno', [['pre', 'Premenopausia'], ['post', 'Posmenopausia']], 'Estado menopáusico') + '</div>' +
        c.chk('mk-masa', 'Masa anexial en la imagen') + c.chk('mk-sol', 'Componente sólido o multilocular')) +
      c.grupo('Epiteliales y digestivos', '<div class="grid2">' + c.campo('mk-ca', 'CA-125', 'U/mL', '0.1') + c.campo('mk-he4', 'HE4', 'pmol/L', '0.1') + c.campo('mk-cea', 'CEA', 'ng/mL', '0.1') + c.campo('mk-199', 'CA 19-9', 'U/mL', '0.1') + Q('mk-153', 'CA 15-3') + '</div>') +
      c.grupo('Germinales y cordones sexuales', '<div class="grid2">' + Q('mk-afp', 'AFP') + Q('mk-hcg', 'β-hCG') + Q('mk-ldh', 'LDH') + Q('mk-inh', 'Inhibina B') + Q('mk-amh', 'AMH') + Q('mk-e2', 'Estradiol') + Q('mk-tt', 'Testosterona') + '</div>') +
      '<div id="mk-o" class="resultados" aria-live="polite"></div>' +
      '<details class="tabla-ref"><summary>Tumores de ovario por origen y marcador</summary><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Origen</th><th>Tipo</th><th>Marcador</th></tr></thead><tbody>' +
      w.GYN.orads.MARC.map(function (m) { return '<tr><td>' + m[0] + '</td><td>' + m[1] + '</td><td>' + m[2] + '</td></tr>'; }).join('') + '</tbody></table></div><p class="etiqueta">Tabla propia CaVeSal®</p></details>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · OMS 2020 · ESMO 2018 · ESGO-ESMO-ESP 2024 · RCOG GTG 62 · ACOG PB 174 · Moore 2009 (ROMA).</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function act() {
      var d = { edad: L.n('mk-edad'), post: L.v('mk-meno') === 'post', masa: L.c('mk-masa'), solida: L.c('mk-sol'), ca125: L.n('mk-ca'), he4: L.n('mk-he4'), cea: L.n('mk-cea'), ca199: L.n('mk-199'),
        ca153: L.v('mk-153'), afp: L.v('mk-afp'), hcg: L.v('mk-hcg'), ldh: L.v('mk-ldh'), inh: L.v('mk-inh'), amh: L.v('mk-amh'), e2: L.v('mk-e2'), testo: L.v('mk-tt') };
      var r = evaluar(d), h = [];
      h.push(F('Qué pedir', c.ul(r.pedir), '', 'neutro'));
      r.filas.forEach(function (f) { h.push(F(f[0], f[1], f[2], f[3])); });
      h.push(F('Origen probable', r.origen.length ? c.ul(r.origen.map(function (o) { return '<strong>' + o[0] + '</strong>: ' + o[1]; })) : 'Sin marcadores elevados cargados.', '', r.origen.length ? 'naranja' : 'neutro'));
      h.push(F('Falsos positivos', c.ul(r.falsos), '', 'neutro'));
      h.push(esFull ? F('Conducta', c.ul(r.conducta), 'Sugerencia CaVeSal®.', 'ambar') : opts.bloqueo('Conducta y derivación en la versión completa'));
      cont.querySelector('#mk-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.marcadores = { roma: roma, evaluar: evaluar, render: render };
})(window);
