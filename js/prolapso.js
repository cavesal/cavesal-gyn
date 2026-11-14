/* CaVeSal® GYN · Prolapso genital: estadificación POP-Q por compartimento.
   Algoritmo propio CaVeSal® · Basado en: Bump RC et al. Am J Obstet Gynecol 1996;175:10-17 ·
   Haylen BT et al. (IUGA/ICS) Int Urogynecol J 2016;27:165-194 · Conducta: ACOG/AUGS Practice Bulletin 214 (2019) · NICE NG123 (2019) · FDA 2019.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  var COLORES = ['verde', 'ambar', 'naranja', 'rojo', 'rojo'];
  function num(v) { if (v === '' || v === null || v === undefined) return null; var n = Number(String(v).replace(',', '.')); return isFinite(n) ? n : null; }

  // Estadio de un punto o grupo de puntos según su valor más distal (cm respecto al himen).
  function estadioPorValor(m, tvl) {
    if (m >= tvl - 2) return 4;
    if (m > 1) return 3;
    if (m >= -1) return 2;
    return 1;
  }

  /* d = {aa, ba, c, d, ap, bp, tvl, gh, pb, histerectomia} */
  function validar(d) {
    var e = [];
    ['aa', 'ba', 'c', 'ap', 'bp', 'tvl'].forEach(function (k) { if (d[k] === null) e.push('falta'); });
    if (e.length) return { ok: false, faltan: true, avisos: [] };
    var av = [];
    if (d.tvl <= 2 || d.tvl > 15) av.push('tvl');
    if (d.aa < -3 || d.aa > 3) av.push('aa');
    if (d.ap < -3 || d.ap > 3) av.push('ap');
    if (d.ba < d.aa) av.push('ba');
    if (d.bp < d.ap) av.push('bp');
    if (d.c < -d.tvl || d.c > d.tvl) av.push('c');
    if (!d.histerectomia && d.d !== null && (d.d > d.c)) av.push('d');
    return { ok: true, faltan: false, avisos: av };
  }

  function calcular(d) {
    var v = validar(d);
    if (!v.ok) return { ok: false, faltan: true };
    var tvl = d.tvl, lim0 = -(tvl - 2);
    var antM = Math.max(d.aa, d.ba), posM = Math.max(d.ap, d.bp);
    var ant = (d.aa <= -3 && d.ba <= -3) ? 0 : estadioPorValor(antM, tvl);
    var pos = (d.ap <= -3 && d.bp <= -3) ? 0 : estadioPorValor(posM, tvl);
    var apiM = d.c;
    var api = (d.c <= lim0) ? 0 : estadioPorValor(apiM, tvl);
    var global = Math.max(ant, pos, api);
    var elong = (!d.histerectomia && d.d !== null) ? Math.round((d.c - d.d) * 10) / 10 : null;
    var punto = [['Aa', d.aa], ['Ba', d.ba], ['C', d.c], ['Ap', d.ap], ['Bp', d.bp]];
    if (!d.histerectomia && d.d !== null) punto.push(['D', d.d]);
    var distal = punto.reduce(function (a, b) { return b[1] > a[1] ? b : a; });
    return { ok: true, avisos: v.avisos, global: global, anterior: ant, apical: api, posterior: pos,
      antM: antM, posM: posM, apiM: apiM, distal: distal, cMenosD: elong,
      hiato: (d.gh !== null && d.pb !== null) ? Math.round((d.gh + d.pb) * 10) / 10 : null };
  }


  /* Conducta (Full). o: { r (resultado POP-Q), sint, quiereCir, riesgoAlto, sexual, preservarUtero, atrofia, iue, histerectomia } */
  function conducta(o) {
    var r = o.r, b = [];
    function bloque(t, arr, color) { b.push({ t: t, l: arr.filter(Boolean), color: color || 'neutro' }); }
    if (!o.sint) {
      bloque('Sin síntomas', [
        'Conducta expectante: el prolapso sin síntomas no se trata (ACOG/AUGS 2019).',
        r.global >= 1 ? 'Ejercicios del suelo pélvico y control según evolución.' : '',
        r.global >= 3 ? 'Estadio III o más: revisar el vaciado vesical y el residuo posmiccional.' : ''
      ], 'verde');
      return b;
    }
    bloque('Conservador', [
      r.global <= 2 ? 'Entrenamiento del suelo pélvico supervisado por al menos 16 semanas (NICE NG123).' : 'Suelo pélvico como complemento.',
      'Pesario en cualquier estadio, sobre todo si no quiere o no puede operarse: anillo con soporte de primera elección; Gellhorn o cubo si no se retiene. Controles periódicos por erosión.',
      o.atrofia ? 'Posmenopausia o atrofia: estrógeno vaginal para tolerar el pesario, estriol crema 0,5 mg 2 veces por semana.' : '',
      'Tratar la constipación, la tos crónica y bajar de peso si hace falta.'
    ], 'verde');
    if (o.quiereCir) {
      var cir = [];
      if (r.anterior >= 2) cir.push('Anterior (cistocele): colporrafia anterior con tejido propio.');
      if (r.apical >= 2) cir.push(o.histerectomia ? 'Apical (cúpula): sacrocolpopexia laparoscópica o abdominal (mejor resultado anatómico) o suspensión vaginal al sacroespinoso o a los uterosacros.'
        : 'Apical (útero): histerectomía vaginal con suspensión al sacroespinoso o a los uterosacros' + (o.preservarUtero ? ', o histeropexia si desea conservar el útero.' : '.') + ' Sacrocolpopexia o sacrohisteropexia como alternativa.');
      if (r.posterior >= 2) cir.push('Posterior (rectocele): colporrafia posterior con tejido propio.');
      if (!cir.length) cir.push('Estadio I: la cirugía rara vez está indicada; priorizar el tratamiento conservador.');
      if (!o.sexual && o.riesgoAlto) cir.push('Sin actividad sexual y riesgo quirúrgico alto: colpocleisis.');
      cir.push('Malla transvaginal para prolapso: no como primera línea (la FDA ordenó retirarla del mercado de EE. UU. en 2019).');
      cir.push(o.iue ? 'Con incontinencia de esfuerzo: valorar un cabestrillo en el mismo acto (ver Incontinencia).'
        : 'Antes de operar: test de esfuerzo con el prolapso reducido para buscar incontinencia oculta.');
      bloque('Cirugía por compartimento', cir, 'naranja');
    }
    return b;
  }

  var ROMANO = ['0', 'I', 'II', 'III', 'IV'];
  function fmt(n) { return n === null ? '—' : (n > 0 ? '+' : '') + String(n).replace('.', ','); }

  function render(cont, T, opts) {
    var t = T.prolapso, esFull = !opts || opts.esFull !== false;
    function campo(id, etq, ayuda, ph) {
      return '<label class="campo"><span>' + etq + ' <i class="u">cm</i></span><input id="pq-' + id + '" type="number" inputmode="decimal" step="0.5" placeholder="' + ph + '">' + (ayuda ? '<small>' + ayuda + '</small>' : '') + '</label>';
    }
    cont.innerHTML =
      '<p class="ayuda">' + t.ayuda + '</p>' +
      '<label class="chk"><input type="checkbox" id="pq-hx"> ' + t.histerectomia + '</label>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.anterior + '</legend><div class="grid2">' +
        campo('aa', 'Aa', t.ayudas.aa, '-3') + campo('ba', 'Ba', t.ayudas.ba, '-3') + '</div></fieldset>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.apical + '</legend><div class="grid2">' +
        campo('c', 'C', t.ayudas.c, '-8') + '<div id="pq-dwrap">' + campo('d', 'D', t.ayudas.d, '-10') + '</div></div></fieldset>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.posterior + '</legend><div class="grid2">' +
        campo('ap', 'Ap', t.ayudas.ap, '-3') + campo('bp', 'Bp', t.ayudas.bp, '-3') + '</div></fieldset>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.medidas + '</legend><div class="grid3">' +
        campo('tvl', 'LVT', t.ayudas.tvl, '10') + campo('gh', 'gh', t.ayudas.gh, '3') + campo('pb', 'pb', t.ayudas.pb, '3') + '</div></fieldset>' +
      '<div id="pq-out" class="resultados" aria-live="polite"></div>' +
      '<div class="pq-acciones"><button type="button" class="btn-sec" id="pq-copiar">' + t.copiar + '</button>' +
      '<button type="button" class="btn-sec" id="pq-limpiar">' + T.app.limpiar + '</button></div>' +
      '<h3 class="sub">Conducta</h3>' +
      '<div id="pq-condW"><fieldset class="mrs-grupo"><legend>Datos para la conducta</legend>' +
        ['sint|Síntomas (bulto, sensación de peso, dificultad para orinar o defecar)', 'cir|Desea o acepta cirugía', 'riesgo|Riesgo quirúrgico alto',
         'sexual|Actividad sexual vaginal o desea conservarla', 'utero|Desea conservar el útero', 'atr|Posmenopausia o atrofia vaginal', 'iue|Incontinencia de esfuerzo asociada']
          .map(function (x) { x = x.split('|'); return '<label class="chk"><input type="checkbox" id="pq-k-' + x[0] + '"> ' + x[1] + '</label>'; }).join('') +
      '</fieldset><div id="pq-cond" class="resultados" aria-live="polite"></div></div>' +
      '<p class="cita">' + t.cita + '</p>' +
      '<p class="etiqueta">' + t.etiqueta + '</p>';

    var ids = ['aa', 'ba', 'c', 'd', 'ap', 'bp', 'tvl', 'gh', 'pb'];
    var ultimo = '';
    function leer() {
      var d = {}; ids.forEach(function (k) { d[k] = num(cont.querySelector('#pq-' + k).value); });
      d.histerectomia = cont.querySelector('#pq-hx').checked;
      if (d.histerectomia) d.d = null;
      return d;
    }
    function grilla(d) {
      var c = function (etq, v, sinSigno) { var s = fmt(v); if (sinSigno) s = s.replace('+', ''); return '<div class="pq-celda"><span>' + etq + '</span><b>' + s + '</b></div>'; };
      return '<div class="pq-grilla" aria-label="' + t.grilla + '">' +
        c('Aa', d.aa) + c('Ba', d.ba) + c('C', d.c) + c('gh', d.gh, 1) + c('pb', d.pb, 1) + c('LVT', d.tvl, 1) +
        c('Ap', d.ap) + c('Bp', d.bp) + c('D', d.histerectomia ? null : d.d) + '</div>';
    }
    function actualizar() {
      var d = leer(), r = calcular(d), out = cont.querySelector('#pq-out');
      cont.querySelector('#pq-dwrap').style.display = d.histerectomia ? 'none' : '';
      if (!r.ok) { out.innerHTML = '<p class="ayuda">' + t.faltan + '</p>'; cont.querySelector('#pq-cond').innerHTML = ''; ultimo = ''; return; }
      var F = w.GYN.fertilidad.fila;
      var apiNom = d.histerectomia ? t.nombres.cupula : t.nombres.utero;
      var h = F(t.global, '<strong>' + t.estadio + ' ' + ROMANO[r.global] + '</strong>', t.desc[r.global] + ' · ' + t.puntoDistal + ': ' + r.distal[0] + ' ' + fmt(r.distal[1]) + ' cm', COLORES[r.global]);
      h += F(t.grupos.anterior, t.nombres.cistocele + ': <strong>' + t.estadio + ' ' + ROMANO[r.anterior] + '</strong>', t.distal + ' ' + fmt(r.antM) + ' cm', COLORES[r.anterior]);
      h += F(t.grupos.apical, apiNom + ': <strong>' + t.estadio + ' ' + ROMANO[r.apical] + '</strong>', 'C ' + fmt(d.c) + ' cm' + (r.cMenosD !== null ? ' · C − D = ' + fmt(r.cMenosD) + ' cm' : ''), COLORES[r.apical]);
      h += F(t.grupos.posterior, t.nombres.rectocele + ': <strong>' + t.estadio + ' ' + ROMANO[r.posterior] + '</strong>', t.distal + ' ' + fmt(r.posM) + ' cm', COLORES[r.posterior]);
      h += grilla(d);
      var notas = [];
      if (r.hiato !== null) notas.push(t.hiato + ' (gh + pb): ' + String(r.hiato).replace('.', ',') + ' cm.');
      r.avisos.forEach(function (a) { notas.push(t.avisos[a]); });
      if (notas.length) h += '<ul class="pq-notas">' + notas.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>';
      h += '<p class="ayuda">' + T.app.orientativa + '</p>';
      out.innerHTML = h;
      var kc = cont.querySelector('#pq-cond');
      if (!esFull) kc.innerHTML = opts.bloqueo('Conducta en la versión completa');
      else {
        var kk = function (id) { return cont.querySelector('#pq-k-' + id).checked; };
        kc.innerHTML = conducta({ r: r, sint: kk('sint'), quiereCir: kk('cir'), riesgoAlto: kk('riesgo'), sexual: kk('sexual'), preservarUtero: kk('utero'), atrofia: kk('atr'), iue: kk('iue'), histerectomia: d.histerectomia })
          .map(function (x) { return F(x.t, '<ul class="lista">' + x.l.map(function (y) { return '<li>' + y + '</li>'; }).join('') + '</ul>', '', x.color); }).join('');
      }
      ultimo = 'POP-Q (Bump 1996): Aa ' + fmt(d.aa) + ' · Ba ' + fmt(d.ba) + ' · C ' + fmt(d.c) +
        (d.histerectomia ? '' : ' · D ' + fmt(d.d)) + ' · Ap ' + fmt(d.ap) + ' · Bp ' + fmt(d.bp) +
        ' · LVT ' + fmt(d.tvl).replace('+', '') + (d.gh !== null ? ' · gh ' + fmt(d.gh).replace('+', '') : '') + (d.pb !== null ? ' · pb ' + fmt(d.pb).replace('+', '') : '') + ' cm.\n' +
        t.estadio + ' global ' + ROMANO[r.global] + ' (' + t.puntoDistal.toLowerCase() + ' ' + r.distal[0] + '). ' +
        t.nombres.cistocele + ' ' + ROMANO[r.anterior] + ' · ' + apiNom + ' ' + ROMANO[r.apical] + ' · ' + t.nombres.rectocele + ' ' + ROMANO[r.posterior] + '.' +
        (d.histerectomia ? ' ' + t.conHx : '');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    cont.querySelector('#pq-copiar').addEventListener('click', function () {
      var b = this;
      if (!ultimo) return;
      var listo = function () { b.textContent = t.copiado; setTimeout(function () { b.textContent = t.copiar; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ultimo).then(listo, listo);
      else { var ta = document.createElement('textarea'); ta.value = ultimo; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); listo(); }
    });
    cont.querySelector('#pq-limpiar').addEventListener('click', function () {
      ids.forEach(function (k) { cont.querySelector('#pq-' + k).value = ''; });
      cont.querySelector('#pq-hx').checked = false; actualizar();
    });
    cont._texto = function () { return ultimo; };
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.prolapso = { calcular: calcular, conducta: conducta, estadioPorValor: estadioPorValor, validar: validar, render: render };
})(window);
