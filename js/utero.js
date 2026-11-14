/* CaVeSal® GYN · Útero: adenomiosis por MUSA revisado y miomas FIGO con STEP-W, con conducta.
   Algoritmo propio CaVeSal® · Basado en: MUSA revisado (Harmsen MJ et al. UOG 2022;60:118-131) ·
   FIGO PALM-COEIN (Munro MG et al. IJGO 2018;143:393-408) · STEP-W (Lasmar RB et al. Fertil Steril 2011; guía ISGE de
   miomectomía histeroscópica 2023) · ACOG PB 228 (2021) · ASRM 2017 (miomas e infertilidad) · Guías CaVeSal® de HC.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };

  var DIRECTOS = [['quistes', 'Quistes miometriales'], ['islas', 'Islas hiperecogénicas'], ['lineas', 'Líneas o brotes subendometriales ecogénicos']];
  var INDIRECTOS = [['globular', 'Útero globular'], ['asim', 'Engrosamiento asimétrico de paredes'], ['sombras', 'Sombras en abanico'],
    ['vasos', 'Vascularización translesional'], ['zuirreg', 'Zona de unión irregular'], ['zuint', 'Zona de unión interrumpida']];

  // d: { directos: [], indirectos: [], extension, sintomas, fertilidad }
  function musa(d) {
    var nd = d.directos.length, ni = d.indirectos.length;
    if (!nd && !ni) return { dx: 'sin', tit: 'Sin rasgos MUSA de adenomiosis', color: 'verde', con: ['No se diagnostica adenomiosis.'] };
    var con = [], dx, tit, color;
    if (nd) { dx = 'si'; tit = 'Adenomiosis: diagnóstico ecográfico'; color = 'naranja'; con.push('Al menos un rasgo directo confirma el diagnóstico (MUSA 2022).'); }
    else { dx = 'indet'; tit = 'Solo rasgos indirectos: no concluyente'; color = 'ambar'; con.push('Los rasgos indirectos solos no confirman (MUSA 2022). RM si cambia la conducta.'); }
    con.push('No diagnosticar por el grosor de la zona de unión en ecografía (MUSA 2022).');
    if (dx === 'si' && d.extension) con.push('Extensión informada: ' + { leve: 'menos del 25 %', mod: '25 a 50 %', sev: 'más del 50 %' }[d.extension] + ' del volumen uterino.');
    var tto = [];
    if (dx !== 'sin' && d.sintomas) {
      tto.push('Primera línea: DIU de levonorgestrel, progestágenos (dienogest) o anticonceptivos combinados; AINE para el dolor.');
      tto.push('Sin respuesta: análogos de GnRH, embolización o adenomiomectomía en casos seleccionados; histerectomía con paridad cumplida.');
    }
    if (dx !== 'sin' && d.fertilidad) tto.push('Deseo reproductivo: derivar a medicina reproductiva. Valorar agonista de GnRH previo a la transferencia.');
    return { dx: dx, tit: tit, color: color, con: con, tto: tto };
  }

  // STEP-W: tam 0/1/2, topo 0/1/2, base 0/1/2, pen 0/1/2, lateral bool
  function stepw(d) {
    var p = d.tam + d.topo + d.base + d.pen + (d.lateral ? 1 : 0);
    var g = p <= 4 ? 1 : p <= 6 ? 2 : 3;
    var txt = g === 1 ? 'Grupo I (0 a 4): baja complejidad, resección histeroscópica completa probable.'
      : g === 2 ? 'Grupo II (5 a 6): compleja. Valorar análogos de GnRH previos o cirugía en dos tiempos.'
      : 'Grupo III (7 a 9): valorar alternativas a la histeroscopía (laparoscopía o laparotomía).';
    return { puntos: p, grupo: g, txt: txt };
  }

  var TIPOS_FIGO = [['', 'Elegí el tipo'], ['0', '0 · Submucoso pediculado'], ['1', '1 · Submucoso, menos del 50 % intramural'], ['2', '2 · Submucoso, 50 % o más intramural'],
    ['3', '3 · Contacta el endometrio, 100 % intramural'], ['4', '4 · Intramural'], ['5', '5 · Subseroso, 50 % o más intramural'], ['6', '6 · Subseroso, menos del 50 % intramural'],
    ['7', '7 · Subseroso pediculado'], ['8', '8 · Otro (cervical, parasitario)'], ['2-5', '2-5 · Submucoso y subseroso (transmural)']];

  // d: { tipo, sintomas, infertilidad, anemia, sarcoma }
  function mioma(d) {
    if (!d.tipo) return null;
    var t = d.tipo, con = [], color = 'verde';
    if (d.sarcoma) return { color: 'rojo', con: ['Sospecha de sarcoma (crecimiento rápido en la posmenopausia, sangrado, aspecto heterogéneo con necrosis): RM pélvica con contraste y difusión.', 'Evitar la morcelación no contenida. Derivar a ginecología oncológica (ACOG PB 228).'] };
    var sub = t === '0' || t === '1' || t === '2';
    if (!d.sintomas && !d.infertilidad) { con.push('Asintomático: conducta expectante con control clínico y ecográfico.'); if (sub) con.push('Submucoso: valorar resección si aparece sangrado o deseo de embarazo.'); }
    else {
      color = 'ambar';
      if (sub) con.push('Submucoso: miomectomía histeroscópica. Calcular STEP-W para planificar.');
      else if (t === '3' || t === '4' || t === '5' || t === '2-5') con.push('Tipos 3 a 5: tratamiento médico (DIU de levonorgestrel para el sangrado, antagonistas de GnRH con add-back, ácido tranexámico), miomectomía, embolización o histerectomía con paridad cumplida (ACOG PB 228).');
      else if (t === '6' || t === '7') con.push('Tipos 6 y 7: miomectomía laparoscópica si da síntomas compresivos o hay torsión del pedículo.');
      else con.push('Tipo 8: individualizar según la localización.');
    }
    if (d.infertilidad) con.push(sub ? 'Infertilidad: resecar los tipos 0 a 2 (ASRM 2017).' : 'Infertilidad: los intramurales que no deforman la cavidad no se resecan de rutina; individualizar si son grandes (ASRM 2017).');
    if (d.anemia) con.push('Anemia: hierro oral o intravenoso antes de la cirugía.');
    return { color: color, con: con };
  }

  function render(cont, T) {
    var c = C(), F = w.GYN.fertilidad.fila;
    function lista(pref, arr) { return arr.map(function (x) { return c.chk(pref + x[0], x[1]); }).join(''); }
    var p3 = function (id, etq, ops) { return c.sel(id, ops.map(function (o, i) { return [String(i), o]; }), etq); };
    cont.innerHTML =
      '<h3 class="sub">Adenomiosis · MUSA revisado (2022)</h3>' +
      c.grupo('Rasgos directos', lista('m-d-', DIRECTOS)) + c.grupo('Rasgos indirectos', lista('m-i-', INDIRECTOS)) +
      '<div class="form">' + c.sel('m-ext', [['', 'Sin dato'], ['leve', 'Menos del 25 %'], ['mod', '25 a 50 %'], ['sev', 'Más del 50 %']], 'Extensión') +
        c.sel('m-loc', [['', 'Sin dato'], ['ant', 'Anterior'], ['post', 'Posterior'], ['fondo', 'Fúndica'], ['lat', 'Lateral'], ['glob', 'Global']], 'Localización') +
        c.sel('m-tipo', [['', 'Sin dato'], ['difusa', 'Difusa'], ['focal', 'Focal'], ['adenomioma', 'Adenomioma']], 'Patrón') + '</div>' +
      c.chk('m-sin', 'Síntomas (sangrado abundante, dismenorrea, dolor)') + c.chk('m-fer', 'Deseo de embarazo') +
      '<div id="m-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: MUSA revisado (Harmsen MJ et al. Ultrasound Obstet Gynecol 2022;60:118-131) · ESHRE 2022 · Sugerencia CaVeSal® para el tratamiento</p>' +

      '<h3 class="sub">Miomas · FIGO y STEP-W</h3>' +
      '<div class="form">' + c.sel('f-tipo', TIPOS_FIGO, 'Tipo FIGO del mioma dominante') + '</div>' +
      c.chk('f-sin', 'Síntomas (sangrado, compresión, dolor)') + c.chk('f-inf', 'Infertilidad o deseo de embarazo') + c.chk('f-ane', 'Anemia') +
      c.chk('f-sar', 'Sospecha de sarcoma (crecimiento rápido posmenopáusico, heterogéneo, necrosis)') +
      '<div id="f-sw" hidden>' + c.grupo('STEP-W (submucosos)',
        '<div class="form">' + p3('s-tam', 'Tamaño', ['2 cm o menos', 'Más de 2 a 5 cm', 'Más de 5 cm']) +
        p3('s-topo', 'Topografía', ['Tercio inferior', 'Tercio medio', 'Tercio superior']) +
        p3('s-base', 'Extensión de la base', ['Un tercio o menos de la pared', 'Más de un tercio a dos tercios', 'Más de dos tercios']) +
        '</div>' + '<p class="ayuda">La penetración la toma del tipo FIGO: 0 = 0, 1 = 1, 2 = 2 puntos.</p>' + c.chk('s-lat', 'En pared lateral (+1)')) + '</div>' +
      '<div id="f-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: FIGO PALM-COEIN (Munro MG et al. Int J Gynaecol Obstet 2018;143:393-408) · STEP-W (Lasmar RB et al. Fertil Steril 2011; guía ISGE 2023) · ACOG PB 228 (2021) · ASRM 2017</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function actualizar() {
      var dir = DIRECTOS.filter(function (x) { return L.c('m-d-' + x[0]); }).map(function (x) { return x[0]; });
      var ind = INDIRECTOS.filter(function (x) { return L.c('m-i-' + x[0]); }).map(function (x) { return x[0]; });
      var m = musa({ directos: dir, indirectos: ind, extension: L.v('m-ext'), sintomas: L.c('m-sin'), fertilidad: L.c('m-fer') });
      var h = [F('MUSA', '<strong>' + m.tit + '</strong>', '', m.color), F('Conducta', c.ul(m.con), '', m.color)];
      if (m.tto && m.tto.length) h.push(F('Sugerencia CaVeSal®', c.ul(m.tto), '', 'neutro'));
      q('#m-out').innerHTML = h.join('');

      var t = L.v('f-tipo'), sub = t === '0' || t === '1' || t === '2';
      q('#f-sw').hidden = !sub;
      var r = mioma({ tipo: t, sintomas: L.c('f-sin'), infertilidad: L.c('f-inf'), anemia: L.c('f-ane'), sarcoma: L.c('f-sar') });
      var g = [];
      if (!r) g.push(F('Mioma', 'Elegí el tipo FIGO.', '', 'neutro'));
      else {
        g.push(F('Conducta', c.ul(r.con), '', r.color));
        if (sub && !L.c('f-sar')) {
          var s = stepw({ tam: +L.v('s-tam'), topo: +L.v('s-topo'), base: +L.v('s-base'), pen: +t, lateral: L.c('s-lat') });
          g.push(F('STEP-W', '<strong>' + s.puntos + ' puntos</strong>', s.txt, s.grupo === 1 ? 'verde' : s.grupo === 2 ? 'ambar' : 'naranja'));
        }
      }
      q('#f-out').innerHTML = g.join('');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.utero = { musa: musa, stepw: stepw, mioma: mioma, render: render };
})(window);
