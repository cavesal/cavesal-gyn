/* CaVeSal® GYN · Masa anexial: O-RADS US v2022, reglas simples IOTA y GI-RADS, con conducta por resultado.
   Algoritmo propio CaVeSal® · Basado en: ACR O-RADS US v2022 (Strachowski MJ et al. Radiology 2023;308:e230685) ·
   IOTA, reglas simples (Timmerman D et al. UOG 2008;31:681-690) · GI-RADS (Amor F et al. J Ultrasound Med 2009;28:285-291;
   UOG 2011;38:450-455) · ACOG PB 174 (2016) · RCOG GTG 62 (2011) · ESGO/ISUOG/IOTA/ESGE (2021).
   No reproduce las tablas del ACR: la lógica y los textos son propios.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };

  var RIESGO = {
    0: 'Evaluación incompleta', 1: 'Ovario normal', 2: 'Casi seguramente benigna (<1 %)',
    3: 'Bajo riesgo (1 a <10 %)', 4: 'Riesgo intermedio (10 a <50 %)', 5: 'Alto riesgo (≥50 %)'
  };
  var COLOR = { 0: 'neutro', 1: 'verde', 2: 'verde', 3: 'ambar', 4: 'naranja', 5: 'rojo' };

  var TIPOS = [
    ['', 'Elegí el tipo de lesión'],
    ['incompleta', 'No se puede caracterizar (técnica)'],
    ['fisio', 'Folículo o cuerpo lúteo (hasta 3 cm)'],
    ['simple', 'Quiste simple (anecoico, pared fina y lisa)'],
    ['unisuave', 'Unilocular liso no simple (ecos internos o septos incompletos)'],
    ['bisuave', 'Bilocular liso, sin componente sólido'],
    ['uniirreg', 'Unilocular de pared irregular (relieve menor de 3 mm)'],
    ['biirreg', 'Bilocular irregular, sin componente sólido'],
    ['multisuave', 'Multilocular liso, sin componente sólido'],
    ['multiirreg', 'Multilocular irregular, sin componente sólido'],
    ['unisol', 'Unilocular con componente sólido (3 mm o más)'],
    ['multisol', 'Bi o multilocular con componente sólido'],
    ['solidosuave', 'Sólido (80 % o más), contorno liso'],
    ['solidoirreg', 'Sólido, contorno irregular'],
    ['clasica', 'Lesión benigna típica']
  ];
  var CLASICAS = [
    ['hemorragico', 'Quiste hemorrágico típico'], ['dermoide', 'Dermoide típico'], ['endometrioma', 'Endometrioma típico'],
    ['paraovarico', 'Quiste paraovárico'], ['inclusion', 'Quiste de inclusión peritoneal'], ['hidrosalpinx', 'Hidrosálpinx']
  ];

  // d: { meno: 'pre'|'post1'|'post2', tipo, clasica, tam (cm), cs (1-4), sombra (bool), pp4 (bool), ascitis (bool) }
  function orads(d) {
    var post = d.meno === 'post1' || d.meno === 'post2', t = d.tam, cs = d.cs || 1;
    function r(cat, img, extra) { return { cat: cat, riesgo: RIESGO[cat], color: COLOR[cat], img: img || '', aviso: extra || '' }; }
    if (d.ascitis) return r(5, '', 'Ascitis o nódulos peritoneales: descartar antes otras causas de ascitis.');
    if (!d.tipo) return null;
    if (d.tipo === 'incompleta') return r(0, 'Repetir la ecografía o pedir RM.');
    if (d.tipo === 'fisio') return post ? r(2, 'Recategorizar: en la posmenopausia no se esperan folículos ni cuerpo lúteo.') : r(1, 'Sin seguimiento.');
    var necesitaTam = ['simple', 'unisuave', 'bisuave', 'multisuave', 'clasica'];
    if (necesitaTam.indexOf(d.tipo) >= 0 && t === null) return { falta: 'tamaño' };
    switch (d.tipo) {
      case 'simple':
        if (t >= 10) return r(3, IMG3(false));
        if (t <= 3) return post ? r(2, 'Sin seguimiento.') : r(1, 'Folículo: sin seguimiento.');
        if (t <= 5) return r(2, post ? 'Ecografía de control a los 12 meses.' : 'Sin seguimiento.');
        return r(2, 'Ecografía de control a los 12 meses.');
      case 'unisuave':
      case 'bisuave':
        if (t >= 10) return r(3, IMG3(false));
        if (t <= 3) return r(2, post ? 'Ecografía de control a los 12 meses.' : 'Sin seguimiento.');
        return r(2, 'Ecografía de control a los 6 meses.');
      case 'uniirreg': return r(3, IMG3(false));
      case 'biirreg': return r(4, IMG4);
      case 'multisuave':
        if (cs >= 4) return r(4, IMG4);
        if (t === null) return { falta: 'tamaño' };
        return t >= 10 ? r(4, IMG4) : r(3, IMG3(false));
      case 'multiirreg': return r(4, IMG4);
      case 'unisol': return d.pp4 ? r(5, IMG5) : r(4, IMG4);
      case 'multisol': return cs >= 3 ? r(5, IMG5) : r(4, IMG4);
      case 'solidoirreg': return r(5, IMG5);
      case 'solidosuave':
        if (cs >= 4) return r(5, IMG5);
        if (cs === 1) return r(3, IMG3(true));
        return d.sombra ? r(3, IMG3(true)) : r(4, IMG4);
      case 'clasica': return clasica(d, post, t);
    }
    return null;
  }
  function IMG3(solida) {
    return 'Si no se extirpa: ecografía de control dentro de los 6 meses.' + (solida ? ' Por ser sólida: ecografista experto o RM con contraste (puntaje O-RADS RM).' : '');
  }
  var IMG4 = 'Ecografista experto o RM con contraste (puntaje O-RADS RM), o según el protocolo de ginecología oncológica.';
  var IMG5 = 'Según el protocolo de ginecología oncológica.';
  function clasica(d, post, t) {
    var k = d.clasica || '';
    if (!k) return { falta: 'tipo de lesión típica' };
    function r2(img) { return { cat: 2, riesgo: RIESGO[2], color: 'verde', img: img, aviso: '' }; }
    if (k === 'paraovarico' || k === 'inclusion' || k === 'hidrosalpinx') return r2('Sin seguimiento por imagen.');
    if (k === 'hemorragico' && d.meno === 'post2') return { cat: null, aviso: 'Un quiste hemorrágico no se espera 5 años o más después de la menopausia: recategorizar con los otros descriptores.' };
    if (t >= 10) return { cat: 3, riesgo: RIESGO[3], color: 'ambar', img: IMG3(false), aviso: '' };
    var confirmar = 'Confirmar con ecografía a los 2 a 3 meses, ecografista experto o RM.';
    if (k === 'hemorragico') return r2(post ? confirmar : (t <= 5 ? 'Sin seguimiento.' : 'Ecografía de control a los 2 a 3 meses.'));
    if (k === 'dermoide') return r2(t <= 3 ? 'Puede considerarse ecografía de control a los 12 meses.' : 'Si no se opera: ecografía de control a los 12 meses.');
    if (k === 'endometrioma') return r2(post ? confirmar + ' Después, si no se opera, control a los 12 meses.' : 'Si no se opera: ecografía de control a los 12 meses.');
    return null;
  }

  /* ---------- Reglas simples IOTA ---------- */
  var IOTA_B = [
    ['b1', 'B1 · Unilocular'], ['b2', 'B2 · Componente sólido menor de 7 mm'], ['b3', 'B3 · Sombra acústica'],
    ['b4', 'B4 · Multilocular liso, menor de 10 cm'], ['b5', 'B5 · Sin flujo (puntaje color 1)']
  ];
  var IOTA_M = [
    ['m1', 'M1 · Tumor sólido irregular'], ['m2', 'M2 · Ascitis'], ['m3', 'M3 · 4 o más proyecciones papilares'],
    ['m4', 'M4 · Multilocular sólido irregular, 10 cm o más'], ['m5', 'M5 · Flujo muy intenso (puntaje color 4)']
  ];
  function iota(sel) {
    var b = IOTA_B.filter(function (x) { return sel[x[0]]; }).length, m = IOTA_M.filter(function (x) { return sel[x[0]]; }).length;
    if (!b && !m) return { res: 'vacio', b: 0, m: 0 };
    if (m && !b) return { res: 'maligno', b: b, m: m };
    if (b && !m) return { res: 'benigno', b: b, m: m };
    return { res: 'inconcluso', b: b, m: m };
  }

  /* ---------- GI-RADS ---------- */
  var GIR_RASGOS = [
    ['g1', 'Proyecciones papilares gruesas (7 mm o más)'], ['g2', 'Tabiques gruesos (3 mm o más)'], ['g3', 'Áreas sólidas'],
    ['g4', 'Ascitis'], ['g5', 'Vascularización central (Doppler)'], ['g6', 'Índice de resistencia menor de 0,5']
  ];
  var GIR_PROB = { 1: '0 %', 2: 'menor de 1 %', 3: '1 a 4 %', 4: '5 a 20 %', 5: 'más de 20 %' };
  // base: '1'|'2'|'3'|'otra'  · rasgos: {g1..g6}
  function girads(base, rasgos) {
    if (!base) return null;
    if (base !== 'otra') { var k = Number(base); return { cat: k, prob: GIR_PROB[k], n: 0 }; }
    var n = GIR_RASGOS.filter(function (x) { return rasgos[x[0]]; }).length;
    if (!n) return { cat: null, n: 0 };
    var cat = n >= 3 ? 5 : 4;
    return { cat: cat, prob: GIR_PROB[cat], n: n };
  }

  /* ---------- Tumores de ovario por origen y marcadores (Tabla propia CaVeSal®) ---------- */
  var MARC = [
    ['Epitelial', 'Seroso de alto grado', 'CA-125 (HE4 de apoyo)'], ['Epitelial', 'Seroso de bajo grado', 'CA-125'],
    ['Epitelial', 'Endometrioide y células claras', 'CA-125 (HE4)'], ['Epitelial', 'Mucinoso', 'CEA y CA 19-9; descartar primario digestivo'],
    ['Epitelial', 'Brenner', 'Sin marcador propio'],
    ['Germinal', 'Disgerminoma', 'LDH (hCG si tiene sincitiotrofoblasto)'], ['Germinal', 'Saco vitelino', 'AFP'],
    ['Germinal', 'Carcinoma embrionario', 'AFP y hCG'], ['Germinal', 'Coriocarcinoma no gestacional', 'hCG'],
    ['Germinal', 'Teratoma inmaduro', 'AFP a veces'], ['Germinal', 'Teratoma maduro (dermoide)', 'Sin marcador; CA 19-9 puede subir'],
    ['Cordones sexuales', 'Células de la granulosa', 'Inhibina B, AMH, estradiol'], ['Cordones sexuales', 'Sertoli-Leydig', 'Testosterona; AFP a veces'],
    ['Cordones sexuales', 'Tecoma / fibroma', 'Estrógenos (tecoma); CA-125 puede subir en Meigs'],
    ['Metastásico', 'Digestivo (Krukenberg)', 'CEA y CA 19-9'], ['Metastásico', 'Mama', 'CA 15-3']
  ];
  var MARC_NOTAS = [
    'CA-125 sube también con endometriosis, menstruación, embarazo, EPI, miomas, ascitis de cualquier causa y cirrosis; es normal en cerca de la mitad de los estadios I.',
    'β-hCG elevada: descartar siempre embarazo y enfermedad trofoblástica. AFP: también hígado y embarazo. CEA: sube con el tabaco.',
    'CA 15-3 sirve para el seguimiento del cáncer de mama metastásico, no para tamizaje ni diagnóstico. SCC: seguimiento del carcinoma escamoso de cérvix.',
    'Ningún marcador solo diferencia benigno de maligno (ESGO-ESMO-ESP 2024). Gonadoblastoma sospechado en premenárquica: cariotipo antes de la cirugía (ESMO).'
  ];

  /* ---------- Conducta común: marcadores, imagen, derivación ---------- */
  // nivel: 'bajo' | 'intermedio' | 'alto'; p: { edad, meno, ca125, solida, fija, meta }
  function conducta(nivel, p) {
    var post = p.meno === 'post1' || p.meno === 'post2', edad = p.edad, menor40 = edad !== null && edad < 40;
    var marc = [], img = [], deriv = [], alerta = false;
    if (nivel === 'bajo') {
      if (post) marc.push('CA-125 (en la posmenopausia toda masa anexial lleva CA-125: ACOG, RCOG).');
      else marc.push('Sin marcadores de rutina si la lesión es simple o típicamente benigna (RCOG).');
      if (!post && menor40 && p.solida) marc.push('Menor de 40 con masa compleja o sólida: AFP, hCG y LDH por posible tumor germinal (RCOG, ACOG).');
    } else {
      marc.push('CA-125 y CEA (ESGO/ISUOG/IOTA/ESGE 2021).');
      marc.push('CA 19-9 si el aspecto es mucinoso o se sospecha origen digestivo; si CEA o CA 19-9 salen altos, buscar un primario digestivo o pancreático.');
      if (menor40 || (!post && edad === null)) marc.push('Menor de 40: AFP, hCG y LDH por posible tumor germinal (RCOG, ACOG).');
      marc.push('HE4 o ROMA son opcionales: no superan a los modelos IOTA (ESGO 2021).');
    }
    if (nivel === 'intermedio') img.push('RM pelviana con contraste (puntaje O-RADS RM) o ecografista experto, como segundo paso.');
    if (nivel === 'alto') {
      img.push('TC de tórax, abdomen y pelvis con contraste antes de la cirugía (obligatoria ante sospecha de malignidad: ESGO 2021).');
      img.push('RM con difusión si se plantea preservar la fertilidad.');
    }
    var ca = p.ca125;
    if (ca !== null) {
      if (post && ca > 35) { deriv.push('CA-125 ' + C().coma(ca) + ' U/mL en la posmenopausia (mayor de 35): derivar a ginecología oncológica (ACOG).'); alerta = true; }
      else if (!post && ca > 200) { deriv.push('CA-125 ' + C().coma(ca) + ' U/mL en la premenopausia (mayor de 200): derivar a ginecología oncológica (ACOG, RCOG).'); alerta = true; }
      else if (!post && ca > 35) deriv.push('CA-125 ' + C().coma(ca) + ' U/mL: en la premenopausia hay muchos falsos positivos (endometriosis, miomas, EPI, menstruación). Interpretar con la imagen.');
    }
    if (p.fija) { deriv.push('Masa nodular o fija: derivar a ginecología oncológica (ACOG).'); alerta = true; }
    if (p.meta) { deriv.push('Metástasis abdominales o a distancia: derivar a ginecología oncológica (ACOG).'); alerta = true; }
    if (nivel === 'alto') { deriv.unshift('Derivar a ginecología oncológica. La cirugía la hace un equipo entrenado en estadificación y citorreducción, con biopsia por congelación (ACOG/SGO).'); alerta = true; }
    else if (nivel === 'intermedio') deriv.unshift('Ginecólogo con interconsulta a ginecología oncológica, o manejo directo por ginecología oncológica.');
    else if (!alerta) deriv.unshift('Ginecólogo general. Cirugía solo si hay síntomas, crecimiento o cambios en el control.');
    return { marc: marc, img: img, deriv: deriv, alerta: alerta };
  }

  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    var MENO = [['pre', 'Premenopausia'], ['post1', 'Posmenopausia temprana (menos de 5 años)'], ['post2', 'Posmenopausia tardía (5 años o más)']];
    cont.innerHTML =
      '<h3 class="sub">Datos de la paciente</h3>' +
      '<p class="ayuda">Se usan en la conducta de los tres bloques. Posmenopausia: 1 año o más de amenorrea; si no se sabe o no tiene útero, usar la edad (más de 50).</p>' +
      '<div class="form">' + c.campo('a-edad', 'Edad', 'años', '1') + c.sel('a-meno', MENO, 'Estado menopáusico') + c.campo('a-ca', 'CA-125, si lo tiene', 'U/mL', '1') + '</div>' +
      c.chk('a-fija', 'Masa nodular o fija al examen') + c.chk('a-meta', 'Metástasis abdominales o a distancia en la imagen') +

      '<h3 class="sub">O-RADS US v2022</h3>' +
      '<p class="ayuda">Elegí el tipo de lesión y completá lo que pida. Componente sólido: sobresale 3 mm o más. Puntaje color: 1 sin flujo, 2 mínimo, 3 moderado, 4 muy intenso.</p>' +
      '<div class="form">' + c.sel('o-tipo', TIPOS, 'Tipo de lesión') +
        '<span id="o-wcla" hidden>' + c.sel('o-cla', [['', 'Elegí']].concat(CLASICAS), 'Lesión típica') + '</span>' +
        c.campo('o-tam', 'Diámetro mayor', 'cm') +
        c.sel('o-cs', [['1', '1 · Sin flujo'], ['2', '2 · Flujo mínimo'], ['3', '3 · Flujo moderado'], ['4', '4 · Flujo muy intenso']], 'Puntaje color') + '</div>' +
      '<span id="o-wsom" hidden>' + c.chk('o-som', 'Sombra acústica difusa o amplia') + '</span>' +
      '<span id="o-wpp" hidden>' + c.chk('o-pp4', '4 o más proyecciones papilares') + '</span>' +
      c.chk('o-asc', 'Ascitis o nódulos peritoneales') +
      '<div id="o-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ACR O-RADS US v2022 (Strachowski MJ et al. Radiology 2023;308:e230685) · ACOG PB 174 · RCOG GTG 62 · ESGO/ISUOG/IOTA/ESGE 2021. No reproduce las tablas del ACR.</p>' +

      '<h3 class="sub">Reglas simples IOTA</h3>' +
      '<p class="ayuda">Marcá los signos presentes. Solo B: benigna. Solo M: maligna. Ambos o ninguno: no concluyente.</p>' +
      c.grupo('Signos B (benignidad)', IOTA_B.map(function (x) { return c.chk('i-' + x[0], x[1]); }).join('')) +
      c.grupo('Signos M (malignidad)', IOTA_M.map(function (x) { return c.chk('i-' + x[0], x[1]); }).join('')) +
      '<div id="i-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Timmerman D et al. UOG 2008;31:681-690 · Timmerman D et al. AJOG 2016;214:424-437 · RCOG GTG 62 · ESGO/ISUOG/IOTA/ESGE 2021. El modelo ADNEX se usa en la app oficial de IOTA.</p>' +

      '<h3 class="sub">GI-RADS</h3>' +
      '<p class="ayuda">Si la lesión entra en las categorías 1 a 3 por su diagnóstico, elegila. Si no, elegí "Otra lesión" y marcá los rasgos de malignidad.</p>' +
      '<div class="form">' + c.sel('g-base', [['', 'Elegí'], ['1', '1 · Ovarios normales, sin masa'], ['2', '2 · Funcional: folículo, cuerpo lúteo, quiste hemorrágico'], ['3', '3 · Neoplasia benigna probable: endometrioma, teratoma, quiste simple, hidrosálpinx, paraovárico, seudoquiste peritoneal, mioma pediculado'], ['otra', 'Otra lesión anexial (contar rasgos)']], 'Lesión') + '</div>' +
      '<span id="g-wr" hidden>' + c.grupo('Rasgos de malignidad', GIR_RASGOS.map(function (x) { return c.chk('g-' + x[0], x[1]); }).join('')) + '</span>' +
      '<div id="g-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Amor F et al. J Ultrasound Med 2009;28:285-291 · Amor F et al. UOG 2011;38:450-455 · ACOG PB 174 · RCOG GTG 62</p>' +
      '<h3 class="sub">Tumores de ovario por origen y marcadores</h3>' +
      '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Origen</th><th>Tumor</th><th>Marcador</th></tr></thead><tbody>' +
      MARC.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      C().ul(MARC_NOTAS) +
      '<p class="etiqueta">Tabla propia CaVeSal® · Basada en: OMS 2020 · ESMO no epiteliales (Ray-Coquard I et al. Ann Oncol 2018;29 Suppl 4:iv1-iv18) · ESGO-ESMO-ESP 2024 · RCOG GTG 62 · ACOG PB 174</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function bloqueConducta(nivel, p) {
      var k = conducta(nivel, p), h = [];
      h.push(F('Derivación', c.ul(k.deriv), '', k.alerta ? 'rojo' : nivel === 'intermedio' ? 'naranja' : 'verde'));
      h.push(F('Marcadores tumorales', c.ul(k.marc), '', 'neutro'));
      if (k.img.length) h.push(F('Imagen complementaria', c.ul(k.img), '', 'neutro'));
      return h.join('');
    }
    function actualizar() {
      var p = { edad: L.n('a-edad'), meno: L.v('a-meno'), ca125: L.n('a-ca'), fija: L.c('a-fija'), meta: L.c('a-meta') };
      var tipo = L.v('o-tipo');
      q('#o-wcla').hidden = tipo !== 'clasica';
      q('#o-wsom').hidden = tipo !== 'solidosuave';
      q('#o-wpp').hidden = tipo !== 'unisol';
      // O-RADS
      var o = orads({ meno: p.meno, tipo: tipo, clasica: L.v('o-cla'), tam: L.n('o-tam'), cs: Number(L.v('o-cs')), sombra: L.c('o-som'), pp4: L.c('o-pp4'), ascitis: L.c('o-asc') });
      var h = [];
      if (!o) h.push(F('O-RADS', 'Elegí el tipo de lesión.', '', 'neutro'));
      else if (o.falta) h.push(F('O-RADS', 'Falta: ' + o.falta + '.', '', 'neutro'));
      else if (o.cat === null) h.push(F('O-RADS', o.aviso, '', 'ambar'));
      else {
        h.push(F('O-RADS', '<strong>O-RADS ' + o.cat + '</strong> · ' + o.riesgo, o.aviso, o.color));
        if (o.img) h.push(F('Seguimiento por imagen (ACR)', o.img, '', o.color));
        if (o.cat >= 2) {
          var solida = ['unisol', 'multisol', 'solidosuave', 'solidoirreg', 'multisuave', 'multiirreg', 'biirreg'].indexOf(tipo) >= 0;
          p.solida = solida;
          h.push(bloqueConducta(o.cat >= 5 ? 'alto' : o.cat === 4 ? 'intermedio' : 'bajo', p));
        }
      }
      q('#o-out').innerHTML = h.join('');
      // IOTA
      var s = {};
      IOTA_B.concat(IOTA_M).forEach(function (x) { s[x[0]] = L.c('i-' + x[0]); });
      var r = iota(s);
      h = [];
      if (r.res === 'vacio') h.push(F('IOTA', 'Marcá los signos presentes.', '', 'neutro'));
      else if (r.res === 'benigno') {
        h.push(F('IOTA', '<strong>Benigna</strong> · ' + r.b + ' signo(s) B, sin signos M', '', 'verde'));
        p.solida = s.b2; h.push(bloqueConducta('bajo', p));
      } else if (r.res === 'maligno') {
        h.push(F('IOTA', '<strong>Maligna</strong> · ' + r.m + ' signo(s) M, sin signos B', 'Con cualquier signo M: derivar a ginecología oncológica (RCOG GTG 62).', 'rojo'));
        h.push(bloqueConducta('alto', p));
      } else {
        h.push(F('IOTA', '<strong>No concluyente</strong> · signos B y M a la vez', 'Segundo paso: ecografista experto (evaluación subjetiva, el mejor desempeño), modelo ADNEX o RM con contraste (ESGO 2021).', 'naranja'));
        h.push(bloqueConducta('intermedio', p));
      }
      q('#i-out').innerHTML = h.join('');
      // GI-RADS
      var base = L.v('g-base'), rs = {};
      q('#g-wr').hidden = base !== 'otra';
      GIR_RASGOS.forEach(function (x) { rs[x[0]] = L.c('g-' + x[0]); });
      var g = girads(base, rs);
      h = [];
      if (!g) h.push(F('GI-RADS', 'Elegí la lesión.', '', 'neutro'));
      else if (g.cat === null) h.push(F('GI-RADS', 'Sin rasgos de malignidad marcados.', 'Reclasificar en 1 a 3 o evaluar con O-RADS o IOTA.', 'neutro'));
      else {
        var col = { 1: 'verde', 2: 'verde', 3: 'verde', 4: 'naranja', 5: 'rojo' }[g.cat];
        h.push(F('GI-RADS', '<strong>GI-RADS ' + g.cat + '</strong> · probabilidad de malignidad ' + g.prob, (g.n ? g.n + ' rasgo(s) de malignidad. ' : '') + (g.cat >= 4 ? 'GI-RADS 4 y 5: derivar a ginecología oncológica (Amor 2009).' : ''), col));
        var seg = { 1: 'Sin seguimiento.', 2: 'Control ecográfico según el caso; suele resolverse sola.', 3: 'Ginecólogo general: control o cirugía según síntomas y tamaño.' }[g.cat];
        if (seg) h.push(F('Seguimiento', seg, '', col));
        if (g.cat >= 3) h.push(bloqueConducta(g.cat === 5 ? 'alto' : g.cat === 4 ? 'intermedio' : 'bajo', (p.solida = false, p)));
      }
      q('#g-out').innerHTML = h.join('');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.orads = { MARC: MARC, orads: orads, iota: iota, girads: girads, conducta: conducta, render: render, TIPOS: TIPOS };
})(window);
