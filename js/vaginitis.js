/* CaVeSal® GYN · Infecciones genitales bajas: vaginosis, candidiasis, tricomoniasis y vaginitis aeróbica.
   Algoritmo propio CaVeSal® · Basado en: CDC. Sexually Transmitted Infections Treatment Guidelines, 2021
   (Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187) · Amsel R et al. Am J Med 1983;74:14-22 ·
   Nugent RP et al. J Clin Microbiol 1991;29:297-301 · Donders GG et al. BJOG 2002;109:34-43.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  function num(v) { if (v === '' || v === null || v === undefined) return null; var n = Number(String(v).replace(',', '.')); return isFinite(n) ? n : null; }

  /* d = { embarazo, inmuno, recurrente, hipoestro, flujo ('normal'|'grumoso'|'homogeneo'|'espumoso'|'purulento'),
           olor, prurito, ardor, severa, fresa, sequedad,
           ph, aminas, clave, levaduras, tricomonas ('si'|'no'|''), noAlbicans, nugent, donders } */
  function calcular(d) {
    var r = { dx: [], sospechas: [], notas: [] };

    // Vaginosis bacteriana: Amsel (3 de 4) o Nugent 7-10.
    var amsel = 0, amselEval = 0;
    if (d.flujo) { amselEval++; if (d.flujo === 'homogeneo') amsel++; }
    if (d.clave) { amselEval++; if (d.clave === 'si') amsel++; }
    if (d.ph !== null) { amselEval++; if (d.ph > 4.5) amsel++; }
    if (d.aminas) { amselEval++; if (d.aminas === 'si') amsel++; }
    r.amsel = amsel; r.amselEval = amselEval;
    r.nugent = d.nugent === null ? null : (d.nugent <= 3 ? 'normal' : d.nugent <= 6 ? 'intermedio' : 'vb');
    if (amsel >= 3 || r.nugent === 'vb') r.dx.push('vb');
    else if (r.nugent === 'intermedio') r.notas.push('nugentIntermedio');

    // Candidiasis: levaduras o pseudohifas en KOH o cultivo.
    if (d.levaduras === 'si') {
      r.dx.push('candida');
      var complicada = [];
      if (d.recurrente) complicada.push('recurrente');
      if (d.severa) complicada.push('severa');
      if (d.noAlbicans) complicada.push('noAlbicans');
      if (d.inmuno) complicada.push('inmuno');
      r.candida = { complicada: complicada.length > 0, motivos: complicada };
      if (d.ph !== null && d.ph > 4.5) r.notas.push('candidaPhAlto');
    } else if (d.levaduras !== 'no' && d.flujo === 'grumoso' && d.prurito) {
      r.sospechas.push('candida');
    }

    // Tricomoniasis: protozoos móviles o NAAT positivo.
    if (d.tricomonas === 'si') r.dx.push('tricomonas');
    else if (d.tricomonas !== 'no' && (d.fresa || (d.flujo === 'espumoso' && d.ph !== null && d.ph > 4.5))) r.sospechas.push('tricomonas');

    // Vaginitis aeróbica: puntaje de Donders.
    if (d.donders !== null && d.donders >= 3) {
      r.dx.push('aerobica');
      r.donders = d.donders <= 4 ? 'leve' : d.donders <= 6 ? 'moderada' : 'severa';
    }

    // Atrofia / síndrome genitourinario: hipoestrogenismo sin agente infeccioso.
    if (!r.dx.length && d.hipoestro && (d.sequedad || (d.ph !== null && d.ph > 4.5))) r.atrofia = true;

    r.mixta = r.dx.length > 1;
    r.sinCriterios = !r.dx.length && !r.sospechas.length && !r.atrofia &&
      (d.ph !== null || d.levaduras || d.clave || d.tricomonas || d.nugent !== null);
    r.embarazo = !!d.embarazo;
    return r;
  }

  // Tratamientos según CDC 2021 (embarazo ajustado).
  function tratamiento(id, r, t) {
    var T = t.tto, emb = r.embarazo;
    if (id === 'vb') return { oral: [T.vb.oral], local: T.vb.local, alt: emb ? T.vb.altEmb : T.vb.alt, nota: emb ? T.vb.notaEmb : '' };
    if (id === 'candida') {
      if (emb) return { oral: [], local: [T.candida.emb], alt: [], nota: T.candida.notaEmb };
      var m = r.candida.motivos;
      if (m.indexOf('noAlbicans') >= 0) return { oral: [], local: [T.candida.noAlbicans], alt: [T.candida.noAlbicansRec], nota: '' };
      if (m.indexOf('recurrente') >= 0) return { oral: [T.candida.recInduccion, T.candida.recMant], local: [T.candida.recLocal], alt: [], nota: '' };
      if (m.indexOf('severa') >= 0) return { oral: [T.candida.severaOral], local: [T.candida.severaLocal], alt: [], nota: '' };
      if (m.indexOf('inmuno') >= 0) return { oral: [], local: [T.candida.inmuno], alt: [], nota: T.candida.notaInmuno };
      return { oral: [T.candida.oral], local: T.candida.local, alt: [], nota: '' };
    }
    if (id === 'tricomonas') return { oral: [T.tricomonas.oral], local: [], alt: emb ? [] : [T.tricomonas.alt], nota: emb ? T.tricomonas.notaEmb + ' ' + T.tricomonas.nota : T.tricomonas.nota };
    if (id === 'aerobica') return { oral: [], local: [], alt: [], nota: T.aerobica };
    return null;
  }

  function render(cont, T) {
    var t = T.vaginitis;
    function chk(id, txt) { return '<label class="chk"><input type="checkbox" id="vg-' + id + '"> ' + txt + '</label>'; }
    function sel(id, etq, ops, ayuda) {
      return '<label class="campo"><span>' + etq + '</span><select id="vg-' + id + '">' +
        ops.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>' + (ayuda ? '<small>' + ayuda + '</small>' : '') + '</label>';
    }
    function nro(id, etq, ayuda, ph, step) {
      return '<label class="campo"><span>' + etq + '</span><input id="vg-' + id + '" type="number" inputmode="decimal" step="' + (step || '1') + '" placeholder="' + ph + '">' + (ayuda ? '<small>' + ayuda + '</small>' : '') + '</label>';
    }
    var sn = [['', t.noRealizado], ['si', t.si], ['no', t.no]];
    cont.innerHTML =
      '<p class="ayuda">' + t.ayuda + '</p>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.paciente + '</legend>' +
        chk('embarazo', t.c.embarazo) + chk('inmuno', t.c.inmuno) + chk('recurrente', t.c.recurrente) + chk('hipoestro', t.c.hipoestro) + '</fieldset>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.clinica + '</legend>' +
        sel('flujo', t.c.flujo, [['', t.noRealizado]].concat(t.flujos)) +
        chk('olor', t.c.olor) + chk('prurito', t.c.prurito) + chk('ardor', t.c.ardor) + chk('severa', t.c.severa) + chk('fresa', t.c.fresa) + chk('sequedad', t.c.sequedad) + '</fieldset>' +
      '<fieldset class="mrs-grupo"><legend>' + t.grupos.lab + '</legend><div class="grid2">' +
        nro('ph', t.c.ph, t.c.phAyuda, '4,5', '0.1') + sel('aminas', t.c.aminas, sn) +
        sel('clave', t.c.clave, sn) + sel('levaduras', t.c.levaduras, sn) +
        sel('tricomonas', t.c.tricomonas, sn) + nro('nugent', t.c.nugent, t.c.nugentAyuda, '0-10') +
        nro('donders', t.c.donders, t.c.dondersAyuda, '0-10') + '</div>' +
        chk('noAlbicans', t.c.noAlbicans) + '</fieldset>' +
      '<div id="vg-out" class="resultados" aria-live="polite"></div>' +
      '<div class="pq-acciones"><button type="button" class="btn-sec" id="vg-copiar">' + t.copiar + '</button>' +
      '<button type="button" class="btn-sec" id="vg-limpiar">' + T.app.limpiar + '</button></div>' +
      '<p class="cita">' + t.cita + '</p>' +
      '<p class="etiqueta">' + t.etiqueta + '</p>';

    var chks = ['embarazo', 'inmuno', 'recurrente', 'hipoestro', 'olor', 'prurito', 'ardor', 'severa', 'fresa', 'sequedad', 'noAlbicans'];
    var sels = ['flujo', 'aminas', 'clave', 'levaduras', 'tricomonas'];
    var nros = ['ph', 'nugent', 'donders'];
    var ultimo = '';
    function $(id) { return cont.querySelector('#vg-' + id); }
    function leer() {
      var d = {};
      chks.forEach(function (k) { d[k] = $(k).checked; });
      sels.forEach(function (k) { d[k] = $(k).value; });
      nros.forEach(function (k) { d[k] = num($(k).value); });
      return d;
    }
    function lista(arr) { return arr.length ? '<ul class="pq-notas">' + arr.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' : ''; }
    function actualizar() {
      var d = leer(), r = calcular(d), out = $('out'), F = w.GYN.fertilidad.fila, h = '', txt = [];
      if (!r.dx.length && !r.sospechas.length && !r.atrofia && !r.sinCriterios) {
        out.innerHTML = '<p class="ayuda">' + t.faltan + '</p>'; ultimo = ''; return;
      }
      if (r.mixta) { h += F(t.resultado, '<strong>' + t.mixta + '</strong>', t.mixtaDet, 'ambar'); txt.push(t.mixta + '.'); }
      r.dx.forEach(function (id) {
        var det = '';
        if (id === 'vb') det = 'Amsel ' + r.amsel + '/4' + (d.nugent !== null ? ' · Nugent ' + d.nugent : '');
        if (id === 'candida') det = r.candida.complicada ? t.complicada + ': ' + r.candida.motivos.map(function (m) { return t.motivos[m]; }).join(', ') : t.noComplicada;
        if (id === 'aerobica') det = 'Donders ' + d.donders + ' · ' + t.gravedad[r.donders];
        h += F(t.dx[id], '<strong>' + t.dx[id] + '</strong>', det, 'naranja');
        var tt = tratamiento(id, r, t), cuerpo = '';
        if (tt.oral.length) cuerpo += '<p><b>' + t.oral + ':</b></p>' + lista(tt.oral);
        if (tt.local.length) cuerpo += '<p><b>' + t.local + ':</b></p>' + lista(tt.local);
        if (tt.alt.length) cuerpo += '<p><b>' + t.alternativas + ':</b></p>' + lista(tt.alt);
        if (tt.nota) cuerpo += '<p class="ayuda">' + tt.nota + '</p>';
        h += '<div class="vg-tto">' + cuerpo + '</div>';
        txt.push(t.dx[id] + (det ? ' (' + det + ')' : '') + '.' +
          (tt.oral.length ? ' ' + t.oral + ': ' + tt.oral.join('; ') + '.' : '') +
          (tt.local.length ? ' ' + t.local + ': ' + tt.local.join('; ') + '.' : '') +
          (tt.nota ? ' ' + tt.nota : ''));
      });
      r.sospechas.forEach(function (id) {
        h += F(t.sospecha, '<strong>' + t.dx[id] + '</strong>', t.confirmar[id], 'ambar');
        txt.push(t.sospecha + ' ' + t.dx[id].toLowerCase() + ': ' + t.confirmar[id]);
      });
      if (r.atrofia) { h += F(t.resultado, '<strong>' + t.atrofia + '</strong>', t.atrofiaDet, 'ambar'); txt.push(t.atrofia + '. ' + t.atrofiaDet); }
      if (r.sinCriterios) { h += F(t.resultado, '<strong>' + t.sinCriterios + '</strong>', t.sinCriteriosDet, 'verde'); txt.push(t.sinCriterios + '.'); }
      var notas = r.notas.map(function (n) { return t.notas[n]; });
      if (r.embarazo) notas.push(t.notas.embarazo);
      h += lista(notas);
      h += '<p class="ayuda">' + T.app.orientativa + '</p>';
      out.innerHTML = h;
      var datos = [];
      if (d.ph !== null) datos.push('pH ' + String(d.ph).replace('.', ','));
      if (d.aminas) datos.push(t.c.aminasCorto + ' ' + (d.aminas === 'si' ? '+' : '−'));
      if (d.clave) datos.push(t.c.claveCorto + ' ' + (d.clave === 'si' ? '+' : '−'));
      if (d.levaduras) datos.push(t.c.levadurasCorto + ' ' + (d.levaduras === 'si' ? '+' : '−'));
      if (d.tricomonas) datos.push(t.c.tricomonasCorto + ' ' + (d.tricomonas === 'si' ? '+' : '−'));
      if (d.nugent !== null) datos.push('Nugent ' + d.nugent);
      if (d.donders !== null) datos.push('Donders ' + d.donders);
      ultimo = t.titulo + (r.embarazo ? ' · ' + t.c.embarazo : '') + (datos.length ? '\n' + datos.join(' · ') : '') + '\n' + txt.join('\n');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    $('copiar').addEventListener('click', function () {
      var b = this;
      if (!ultimo) return;
      var listo = function () { b.textContent = t.copiado; setTimeout(function () { b.textContent = t.copiar; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ultimo).then(listo, listo);
      else { var ta = document.createElement('textarea'); ta.value = ultimo; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); listo(); }
    });
    $('limpiar').addEventListener('click', function () {
      chks.forEach(function (k) { $(k).checked = false; });
      sels.forEach(function (k) { $(k).value = ''; });
      nros.forEach(function (k) { $(k).value = ''; });
      actualizar();
    });
    cont._texto = function () { return ultimo; };
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.vaginitis = { calcular: calcular, tratamiento: tratamiento, render: render };
})(window);
