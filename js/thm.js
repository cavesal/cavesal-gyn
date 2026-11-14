/* CaVeSal® GYN · Calculadora de THM con dos modos: algoritmo SEGIRP 2026 (Demo) y algoritmo combinado (Full).
   Algoritmo propio CaVeSal® · Basado en: SEGIRP 2026 · Benedetto C et al. (FIGO/WHF) Int J Gynecol Obstet 2026 ·
   Stute P et al. (EMAS) Maturitas 2026;212:109060 · ACOG CPG No. 13, 2026 · Qaseem A et al. (ACP) Ann Intern Med 2026 ·
   NAMS 2022 · FDA 2025-2026 · Panay N et al. (ESHRE/ASRM/IMS, IOP) Climacteric 2024 · Davis SR et al. Climacteric 2023 ·
   USPSTF 2019 (Gail) · Heinemann 2004 · SOCHEG 2020.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  function num(v) { if (v === '' || v === null || v === undefined) return null; var n = Number(String(v).replace(',', '.')); return isFinite(n) ? n : null; }
  var CONTRA = ['sangrado', 'mama', 'tev', 'trombofilia', 'hepatica', 'acv', 'porfiria'];
  var PATO = ['obesidad', 'hta', 'tg', 'riesgoTev', 'tabaco', 'migrana', 'glp1', 'cerebro'];

  // Bloques: cada uno devuelve su propio resultado.
  function bloqueMrs(d) {
    if (d.mrsS === null && d.mrsP === null && d.mrsU === null) return null;
    var s = d.mrsS || 0, p = d.mrsP || 0, u = d.mrsU || 0, tot = s + p + u;
    if (d.esqMrs === 'socheg') {
      var S = w.GYN.mrs.SOCHEG;
      var sev = { somatico: s >= S.somatico, psicologico: p >= S.psicologico, urogenital: u >= S.urogenital, total: tot >= S.total };
      return { esquema: 'socheg', total: tot, severa: sev.total || sev.somatico || sev.psicologico || sev.urogenital, dominios: sev, moderadaOMas: sev.total || sev.somatico };
    }
    var n = w.GYN.mrs.nivel('total', tot);
    return { esquema: 'nams', total: tot, nivel: n, moderadaOMas: n >= 2 };
  }

  function bloqueOsteo(d) {
    if (!d.oste) return null;
    if (d.fractura === 'alto') return { conducta: 'manejoOsteo' };
    if (d.fractura !== 'bajo') return { conducta: 'faltaFractura' };
    if (d.svm) return { conducta: 'thm' };
    if (d.tscore === null) return { conducta: 'faltaT' };
    if (d.tscore <= -2.5) return { conducta: 'manejoOsteo' };
    if (d.tscore <= -1.8) return { conducta: 'thm' };
    return { conducta: 'control' };
  }

  function bloqueCv(d) {
    if (d.modo === 'combinado' && d.cvHerr === 'figo') {
      if (!d.cvFigo) return null;
      var cat = d.cvFigo;
      if (cat === 'intermedio' && d.cac === 'hasta10') cat = 'bajo';
      if (cat === 'intermedio' && d.cac === 'mas10') cat = 'alto';
      var r = { herramienta: 'figo', categoria: cat, reclasificado: cat !== d.cvFigo };
      r.via = cat === 'bajo' ? 'libre' : 'transdermica';
      r.progSeguro = cat !== 'bajo';
      r.dosisBaja = cat === 'alto';
      r.evitar = false;
      return r;
    }
    if (d.cvHearts === null) return null;
    var c = d.cvHearts < 5 ? 'bajo' : d.cvHearts <= 10 ? 'intermedio' : 'alto';
    return { herramienta: 'hearts', categoria: c, via: c === 'bajo' ? 'libre' : 'transdermica', evitar: c === 'alto', progSeguro: d.modo === 'combinado' && c !== 'bajo', dosisBaja: false };
  }

  function bloqueMama(d) {
    if (d.modo === 'combinado') {
      if (d.gail === null) return null;
      return { categoria: d.gail < 1.67 ? 'bajo' : d.gail < 3 ? 'moderado' : 'alto', valor: d.gail };
    }
    return d.gailCat ? { categoria: d.gailCat } : null;
  }

  function bloqueVentana(d) {
    if (d.etapa !== 'posmeno') return d.etapa ? { dentro: true, noAplica: true } : null;
    if (d.edad === null || d.anosFum === null) return null;
    return { dentro: d.edad < 60 && d.anosFum < 10 };
  }

  function calcular(d) {
    var r = { modo: d.modo, avisos: [] };
    r.contra = CONTRA.filter(function (k) { return d.contra[k]; });
    r.pato = d.modo === 'combinado' ? PATO.filter(function (k) { return d.pato[k]; }) : [];
    r.mrs = bloqueMrs(d);
    r.osteo = bloqueOsteo(d);
    r.cv = bloqueCv(d);
    r.mama = bloqueMama(d);
    r.ventana = bloqueVentana(d);
    if (!d.etapa) { r.faltan = true; return r; }

    // Ramas que no llevan a THM.
    if (d.etapa === 'transicion' && d.anticoncepcion) { r.conducta = 'anticoncepcion'; return r; }
    if (d.etapa === 'iop' && d.deseoEmbarazo) { r.conducta = 'tra'; return r; }

    var sistemica = d.svm || (r.osteo && r.osteo.conducta === 'thm') || d.etapa === 'iop';
    r.local = !!d.sgum; r.tdsh = !!d.tdsh;
    if (!sistemica && !r.local && !r.tdsh) {
      r.conducta = (r.osteo && r.osteo.conducta !== 'thm') ? 'osteo' : 'sinIndicacion';
      return r;
    }

    // Contraindicaciones, riesgo CV alto (HEARTS) o mamario alto → no hormonal.
    var motivoNoHormonal = null;
    if (r.contra.length) motivoNoHormonal = 'contra';
    else if (r.cv && r.cv.evitar) motivoNoHormonal = 'cv';
    else if (r.mama && r.mama.categoria === 'alto') motivoNoHormonal = 'mama';
    r.sistemica = sistemica && !motivoNoHormonal;
    r.noHormonal = sistemica && !!motivoNoHormonal;
    r.motivo = motivoNoHormonal;
    if (r.local && r.contra.length) r.localCondicion = d.modo === 'combinado' ? (d.contra.mama ? 'oncologia' : 'baja') : 'no';
    if (r.tdsh && r.contra.length) r.tdsh = false;

    if (r.sistemica) {
      var trans = (r.cv && r.cv.via === 'transdermica') || r.pato.some(function (k) { return k !== 'cerebro'; });
      r.via = trans ? 'transdermica' : 'libre';
      r.progSeguro = !!(r.cv && r.cv.progSeguro) || (d.modo === 'combinado' && (d.pato.riesgoTev));
      r.dosisBaja = !!(r.cv && r.cv.dosisBaja);
      r.sinTibolona = d.modo === 'combinado' && (d.pato.cerebro || (r.cv && r.cv.categoria === 'alto'));
      if (d.utero === 'no') r.esquema = 'estrogeno';
      else if (d.utero === 'si') r.esquema = (d.etapa === 'posmeno') ? 'continua' : 'ciclica';
      else r.esquema = null;
      if (r.mama && r.mama.categoria === 'moderado') r.avisos.push('mamaModerado');
      if (r.ventana && !r.ventana.dentro) r.avisos.push('fueraVentana');
      if (d.modo === 'combinado' && r.mrs && !r.mrs.moderadaOMas && d.svm) r.avisos.push('mrsLeve');
      if (d.modo === 'combinado' && d.etapa === 'iop') r.avisos.push('iopHasta');
    }
    r.conducta = r.sistemica ? 'thm' : (r.noHormonal ? 'noHormonal' : 'soloLocal');
    return r;
  }

  // Presentaciones (Fuente: SEGIRP 2026) según esquema y vía.
  function presentaciones(r, t) {
    var P = t.prod, l = [];
    if (r.esquema === 'estrogeno') l.push(P.ginoderm);
    if (r.esquema === 'ciclica') {
      if (r.via !== 'transdermica') l.push(P.femoston);
      l.push(P.ginodermP4ciclica);
    }
    if (r.esquema === 'continua') {
      if (r.via !== 'transdermica') {
        if (!r.progSeguro) l.push(P.angeliq);
        l.push(P.femostonConti);
        if (!r.sinTibolona) l.push(P.tibolona);
      }
      l.push(P.ginodermP4continua);
      l.push(P.diuLng);
    }
    return l;
  }

  function render(cont, T, opts) {
    var t = T.thm, esFull = opts && opts.esFull, F = t.flujo, vistaIni = 'completa';
    try { if (localStorage.getItem('cavesal_gyn_thm_vista') === 'pasos') vistaIni = 'pasos'; } catch (e) {}
    function chk(id, txt) { return '<label class="chk"><input type="checkbox" id="th-' + id + '"> ' + txt + '</label>'; }
    function sel(id, etq, ops, ayuda) {
      return '<label class="campo"><span>' + etq + '</span><select id="th-' + id + '">' + ops.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>' + (ayuda ? '<small>' + ayuda + '</small>' : '') + '</label>';
    }
    function nro(id, etq, ayuda, ph, step) { return '<label class="campo"><span>' + etq + '</span><input id="th-' + id + '" type="number" inputmode="decimal" step="' + (step || '1') + '" placeholder="' + ph + '">' + (ayuda ? '<small>' + ayuda + '</small>' : '') + '</label>'; }
    function seg(name, ops, def) {
      return '<div class="seg" role="radiogroup">' + ops.map(function (o) { return '<label class="opt-seg"><input type="radio" name="' + name + '" value="' + o[0] + '"' + (o[0] === def ? ' checked' : '') + '><span>' + o[1] + '</span></label>'; }).join('') + '</div>';
    }
    cont.innerHTML =
      '<p class="ayuda">' + t.ayuda + '</p>' +
      '<div class="th-vista"><span class="ayuda">' + F.vista + ':</span> ' + seg('th-vista', [['completa', F.completa], ['pasos', F.pasos]], vistaIni) + '</div>' +
      '<div id="th-nav" class="th-nav" hidden><p class="th-paso" id="th-pasoTit"></p><small class="ayuda" id="th-pasoAyuda"></small><p class="ayuda" id="th-pasoAviso" hidden></p></div>' +
      '<fieldset class="mrs-grupo" data-paso="1"><legend>' + t.g.modo + '</legend>' + seg('th-modo', [['segirp', t.modos.segirp], ['combinado', t.modos.combinado + (esFull ? '' : ' · ' + T.app.soloFull)]], esFull ? 'combinado' : 'segirp') +
        '<small class="ayuda" id="th-modoAyuda"></small></fieldset>' +
      '<fieldset class="mrs-grupo" data-paso="1"><legend>' + t.g.etapa + '</legend>' +
        sel('etapa', t.c.etapa, [['', t.elegir], ['transicion', t.etapas.transicion], ['posmeno', t.etapas.posmeno], ['iop', t.etapas.iop]]) +
        '<div class="grid2">' + nro('edad', t.c.edad, '', '52') + nro('anosFum', t.c.anosFum, t.c.anosFumAyuda, '3') + '</div>' +
        '<div data-paso="3" data-paso-suelto>' + sel('utero', t.c.utero, [['', t.elegir], ['si', t.c.conUtero], ['no', t.c.sinUtero]]) + '</div>' +
        '<div id="th-wTrans">' + chk('anticoncepcion', t.c.anticoncepcion) + '</div>' +
        '<div id="th-wIop">' + chk('deseoEmbarazo', t.c.deseoEmbarazo) + '</div></fieldset>' +
      '<fieldset class="mrs-grupo" data-paso="4"><legend>' + t.g.objetivo + '</legend>' +
        chk('svm', t.c.svm) + chk('oste', t.c.oste) + chk('sgum', t.c.sgum) + chk('tdsh', t.c.tdsh) + '</fieldset>' +
      '<fieldset class="mrs-grupo" data-paso="4"><legend>' + t.g.mrs + '</legend>' + seg('th-esq', [['nams', T.mrs.esquemas.nams], ['socheg', T.mrs.esquemas.socheg]], 'nams') +
        '<div class="grid3">' + nro('mrsS', t.c.mrsS, '0-16', '0') + nro('mrsP', t.c.mrsP, '0-16', '0') + nro('mrsU', t.c.mrsU, '0-12', '0') + '</div>' +
        '<small class="ayuda">' + t.c.mrsAyuda + '</small></fieldset>' +
      '<fieldset class="mrs-grupo" id="th-wOste" data-paso="4"><legend>' + t.g.oste + '</legend><div class="grid2">' +
        sel('fractura', t.c.fractura, [['', t.elegir], ['bajo', t.c.fracBajo], ['alto', t.c.fracAlto]], t.c.fracturaAyuda) + nro('tscore', t.c.tscore, '', '-2,0', '0.1') + '</div></fieldset>' +
      '<fieldset class="mrs-grupo" data-paso="2"><legend>' + t.g.contra + '</legend>' + CONTRA.map(function (k) { return chk('c-' + k, t.contra[k]); }).join('') + '</fieldset>' +
      '<fieldset class="mrs-grupo" data-paso="5"><legend>' + t.g.cv + '</legend>' +
        '<div id="th-wCvHerr">' + seg('th-cvHerr', [['hearts', t.c.hearts], ['figo', t.c.figo]], 'hearts') + '</div>' +
        '<div id="th-wHearts">' + nro('cvHearts', t.c.cvHearts, t.c.cvHeartsAyuda, '4', '0.1') + '</div>' +
        '<div id="th-wFigo" class="grid2">' + sel('cvFigo', t.c.cvFigo, [['', t.elegir], ['bajo', t.cat.bajo], ['intermedio', t.cat.intermedio], ['alto', t.cat.alto]]) +
          sel('cac', t.c.cac, [['', t.c.cacNo], ['hasta10', t.c.cacHasta10], ['mas10', t.c.cacMas10]], t.c.cacAyuda) + '</div></fieldset>' +
      '<fieldset class="mrs-grupo" data-paso="6"><legend>' + t.g.mama + '</legend>' +
        '<div id="th-wGailCat">' + sel('gailCat', t.c.gailCat, [['', t.elegir], ['bajo', t.cat.bajo], ['moderado', t.cat.moderado], ['alto', t.cat.alto]]) + '</div>' +
        '<div id="th-wGail">' + nro('gail', t.c.gail, t.c.gailAyuda, '1,2', '0.01') + '</div></fieldset>' +
      '<fieldset class="mrs-grupo" id="th-wPato" data-paso="7"><legend>' + t.g.pato + '</legend>' + PATO.map(function (k) { return chk('p-' + k, t.pato[k]); }).join('') + '</fieldset>' +
      '<div id="th-out" class="resultados" aria-live="polite" data-paso="8"></div>' +
      '<div class="pq-acciones th-navbtn" id="th-navBtn" hidden><button type="button" class="btn-sec" id="th-ant">' + F.anterior + '</button>' +
      '<button type="button" class="btn" id="th-sig">' + F.siguiente + '</button>' +
      '<button type="button" class="btn-sec" id="th-imprimir">' + F.imprimir + '</button>' +
      '<button type="button" class="btn-sec" id="th-abrirCompleta">' + F.abrirCompleta + '</button></div>' +
      '<div class="pq-acciones" data-paso="8"><button type="button" class="btn-sec" id="th-copiar">' + t.copiar + '</button>' +
      '<button type="button" class="btn-sec" id="th-limpiar">' + T.app.limpiar + '</button></div>' +
      '<details class="ref" data-paso="8"><summary>' + t.tablaTitulo + '</summary>' + t.tabla + '</details>' +
      '<p class="cita" id="th-cita" data-paso="8"></p><p class="etiqueta" id="th-etq" data-paso="8"></p>';

    var $ = function (id) { return cont.querySelector('#th-' + id); };
    var radio = function (n) { var r = cont.querySelector('input[name=th-' + n + ']:checked'); return r ? r.value : ''; };
    var ultimo = '';
    // Precarga desde la escala MRS.
    try {
      var m = JSON.parse(localStorage.getItem('cavesal_gyn_mrs') || 'null');
      if (m) { $('mrsS').value = m.somatico; $('mrsP').value = m.psicologico; $('mrsU').value = m.urogenital;
        if (m.esquema === 'socheg') cont.querySelector('input[name=th-esq][value=socheg]').checked = true; }
    } catch (e) {}

    function leer() {
      var d = { modo: radio('modo'), esqMrs: radio('esq'), cvHerr: radio('cvHerr'), contra: {}, pato: {} };
      ['etapa', 'utero', 'fractura', 'cvFigo', 'cac', 'gailCat'].forEach(function (k) { d[k] = $(k).value; });
      ['edad', 'anosFum', 'mrsS', 'mrsP', 'mrsU', 'tscore', 'cvHearts', 'gail'].forEach(function (k) { d[k] = num($(k).value); });
      ['anticoncepcion', 'deseoEmbarazo', 'svm', 'oste', 'sgum', 'tdsh'].forEach(function (k) { d[k] = $(k).checked; });
      CONTRA.forEach(function (k) { d.contra[k] = $('c-' + k).checked; });
      PATO.forEach(function (k) { d.pato[k] = $('p-' + k).checked; });
      if (d.etapa !== 'transicion') d.anticoncepcion = false;
      if (d.etapa !== 'iop') d.deseoEmbarazo = false;
      if (d.modo !== 'combinado') d.cvHerr = 'hearts';
      return d;
    }
    function li(a) { return a.length ? '<ul class="pq-notas">' + a.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' : ''; }

    function actualizar() {
      var d = leer(), comb = d.modo === 'combinado', F = w.GYN.fertilidad.fila;
      $('modoAyuda').textContent = t.modoAyuda[d.modo];
      $('wTrans').style.display = d.etapa === 'transicion' ? '' : 'none';
      $('wIop').style.display = d.etapa === 'iop' ? '' : 'none';
      $('wOste').style.display = d.oste ? '' : 'none';
      $('wCvHerr').style.display = comb ? '' : 'none';
      $('wHearts').style.display = d.cvHerr === 'hearts' ? '' : 'none';
      $('wFigo').style.display = d.cvHerr === 'figo' ? '' : 'none';
      $('wGailCat').style.display = comb ? 'none' : '';
      $('wGail').style.display = comb ? '' : 'none';
      $('wPato').style.display = comb ? '' : 'none';
      $('cita').textContent = comb ? t.citaComb : t.citaSegirp;
      $('etq').textContent = comb ? t.etqComb : t.etqSegirp;
      var out = $('out');
      if (comb && !esFull) { out.innerHTML = opts.bloqueo(t.bloqComb); ultimo = ''; return; }
      var r = calcular(d), h = '', txt = [];
      if (r.faltan) { out.innerHTML = '<p class="ayuda">' + t.faltan + '</p>'; ultimo = ''; return; }

      // Bloques propios
      if (r.mrs) {
        var mv = r.mrs.esquema === 'socheg' ? (r.mrs.severa ? T.mrs.severa : T.mrs.noSevera) : T.mrs.gravedad[r.mrs.nivel];
        h += F('MRS', '<strong>' + r.mrs.total + ' / 44 · ' + mv + '</strong>', T.mrs.esquemas[r.mrs.esquema], r.mrs.moderadaOMas ? 'naranja' : 'verde');
        txt.push('MRS ' + r.mrs.total + '/44 (' + T.mrs.esquemas[r.mrs.esquema] + '): ' + mv + '.');
      }
      if (r.osteo) { h += F(t.g.oste, '<strong>' + t.osteo[r.osteo.conducta] + '</strong>', '', r.osteo.conducta === 'thm' ? 'neutro' : 'ambar'); txt.push(t.g.oste + ': ' + t.osteo[r.osteo.conducta] + '.'); }
      if (r.contra.length) { h += F(t.g.contra, '<strong>' + t.hayContra + '</strong>', r.contra.map(function (k) { return t.contra[k]; }).join(' · '), 'rojo'); txt.push(t.hayContra + ': ' + r.contra.map(function (k) { return t.contra[k]; }).join(', ') + '.'); }
      if (r.cv) {
        var cvT = t.cv[r.cv.herramienta][r.cv.categoria] + (r.cv.reclasificado ? ' · ' + t.reclasificado : '');
        h += F(t.g.cv, '<strong>' + t.cat[r.cv.categoria] + '</strong>', cvT, r.cv.categoria === 'bajo' ? 'verde' : r.cv.categoria === 'intermedio' ? 'ambar' : 'rojo');
        txt.push(t.g.cv + ': ' + t.cat[r.cv.categoria] + '. ' + cvT + '.');
      }
      if (r.mama) {
        h += F(t.g.mama, '<strong>' + t.cat[r.mama.categoria] + '</strong>', t.mama[r.mama.categoria] + (r.mama.valor !== undefined ? ' · Gail ' + String(r.mama.valor).replace('.', ',') + '%' : ''), r.mama.categoria === 'bajo' ? 'verde' : r.mama.categoria === 'moderado' ? 'ambar' : 'rojo');
        txt.push(t.g.mama + ': ' + t.cat[r.mama.categoria] + '. ' + t.mama[r.mama.categoria] + '.');
      }
      if (r.ventana && !r.ventana.noAplica) { h += F(t.g.ventana, '<strong>' + (r.ventana.dentro ? t.dentro : t.fuera) + '</strong>', t.ventanaDef, r.ventana.dentro ? 'verde' : 'ambar'); txt.push(t.g.ventana + ': ' + (r.ventana.dentro ? t.dentro : t.fuera) + '.'); }

      // Conducta
      var cond = '', det = [], col = 'neutro';
      if (r.conducta === 'anticoncepcion') { cond = t.cond.anticoncepcion; det.push(t.cond.anticoncepcionDet); }
      else if (r.conducta === 'tra') { cond = t.cond.tra; }
      else if (r.conducta === 'osteo') { cond = t.osteo[r.osteo.conducta]; }
      else if (r.conducta === 'sinIndicacion') { cond = t.cond.sinIndicacion; }
      else if (r.conducta === 'noHormonal') { cond = t.cond.noHormonal; col = 'rojo'; det.push(t.motivo[r.motivo]); det = det.concat(comb ? t.noHormonalComb : t.noHormonalSegirp); }
      else if (r.conducta === 'thm') {
        cond = t.cond.thm + ': ' + (r.esquema ? t.esq[r.esquema] : t.faltaUtero); col = 'verde';
        det.push(t.via[r.via] + (r.dosisBaja ? ' · ' + t.dosisBaja : ''));
        if (r.progSeguro && r.esquema && r.esquema !== 'estrogeno') det.push(t.progSeguro);
        if (r.sinTibolona) det.push(t.sinTibolona);
        if (comb && r.pato.length) det.push(t.porPato + ': ' + r.pato.map(function (k) { return t.pato[k]; }).join(', ') + '.');
        r.avisos.forEach(function (a) { det.push(t.avisos[a]); });
      }
      else if (r.conducta === 'soloLocal') { cond = t.cond.soloLocal; }
      h += F(t.conducta, '<strong>' + cond + '</strong>', '', col);
      if (det.length) h += li(det);
      txt.push(t.conducta + ': ' + cond + '.' + (det.length ? ' ' + det.join(' ') : ''));

      if (r.conducta === 'thm' && r.esquema) {
        var pr = presentaciones(r, t);
        h += '<div class="vg-tto"><p><b>' + t.presentaciones + '</b></p>' + li(pr) + (comb ? '<p class="ayuda">' + t.dosisRef + '</p>' : '') + '</div>';
        txt.push(t.presentaciones + ': ' + pr.join('; ') + '.');
      }
      if (r.local) {
        var lt = r.localCondicion === 'no' ? t.localNo : r.localCondicion === 'oncologia' ? t.localOnco : r.localCondicion === 'baja' ? t.localBaja : t.localSi;
        h += F(t.c.sgum, '<strong>' + t.terapiaLocal + '</strong>', lt, r.localCondicion === 'no' ? 'rojo' : 'neutro');
        if (r.localCondicion !== 'no') h += '<div class="vg-tto">' + li(t.prodLocal) + '</div>';
        txt.push(t.c.sgum + ': ' + lt + (r.localCondicion !== 'no' ? ' ' + t.prodLocal.join('; ') + '.' : ''));
      }
      if (r.tdsh) { h += F(t.c.tdsh, '<strong>' + t.testosterona + '</strong>', t.prod.androlone, 'neutro'); txt.push(t.c.tdsh + ': ' + t.testosterona + ' (' + t.prod.androlone + ').'); }
      h += '<p class="ayuda">' + T.app.orientativa + '</p>';
      out.innerHTML = h;
      ultimo = t.titulo + ' · ' + t.modos[d.modo] + '\n' + txt.join('\n');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    $('copiar').addEventListener('click', function () {
      var b = this; if (!ultimo) return;
      var listo = function () { b.textContent = t.copiado; setTimeout(function () { b.textContent = t.copiar; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ultimo).then(listo, listo);
      else { var ta = document.createElement('textarea'); ta.value = ultimo; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); listo(); }
    });
    $('limpiar').addEventListener('click', function () {
      cont.querySelectorAll('input[type=checkbox]').forEach(function (c) { c.checked = false; });
      cont.querySelectorAll('select').forEach(function (s) { s.value = ''; });
      cont.querySelectorAll('input[type=number]').forEach(function (i) { i.value = ''; });
      actualizar();
    });
    // Paso a paso: muestra un bloque por vez sobre el mismo formulario y reutiliza calcular(d).
    var paso = 1;
    function secuencia(d) {
      var q = [1];
      if ((d.etapa === 'transicion' && d.anticoncepcion) || (d.etapa === 'iop' && d.deseoEmbarazo)) return q.concat(8);
      q.push(2);
      if (CONTRA.some(function (k) { return d.contra[k]; })) return q.concat(4, 8);
      q.push(3, 4);
      var objetivo = d.svm || d.oste || d.tdsh || d.etapa === 'iop';
      if (!objetivo) return q.concat(8);
      q.push(5);
      var r = calcular(d);
      if (r.cv && r.cv.evitar) return q.concat(8);
      q.push(6);
      if (r.mama && r.mama.categoria === 'alto') return q.concat(8);
      if (d.modo === 'combinado') q.push(7);
      return q.concat(8);
    }
    function vistaPasos() { return radio('vista') === 'pasos'; }
    function mostrarPaso() {
      var on = vistaPasos(), d = leer(), q = secuencia(d);
      if (q.indexOf(paso) < 0) { var p0 = 1; q.forEach(function (x) { if (x < paso) p0 = x; }); paso = p0; }
      $('nav').hidden = !on; $('navBtn').hidden = !on;
      cont.querySelectorAll('[data-paso]').forEach(function (el) {
        if (!on) { el.classList.remove('th-oculto'); return; }
        var n = Number(el.getAttribute('data-paso'));
        el.classList.toggle('th-oculto', n !== paso);
      });
      if (on) {
        // El útero está dentro del bloque de etapa: en el paso 3 se muestra solo ese campo.
        var fsEtapa = $('etapa').closest('fieldset');
        if (paso === 3) { fsEtapa.classList.remove('th-oculto'); fsEtapa.classList.add('th-solo3'); } else fsEtapa.classList.remove('th-solo3');
        var i = q.indexOf(paso);
        $('pasoTit').textContent = F.paso + ' ' + (i + 1) + ' ' + F.de + ' ' + q.length + ': ' + F.titulos[paso];
        $('pasoAyuda').textContent = F.ayudas[paso] || '';
        $('ant').disabled = i === 0;
        $('sig').hidden = paso === 8;
        $('imprimir').hidden = paso !== 8;
      }
    }
    function mover(dir) {
      var d = leer(), q = secuencia(d), i = q.indexOf(paso);
      if (dir > 0 && paso === 1 && !d.etapa) { $('pasoAviso').textContent = F.faltaEtapa; $('pasoAviso').hidden = false; return; }
      $('pasoAviso').hidden = true;
      var j = Math.max(0, Math.min(q.length - 1, i + dir));
      paso = q[j]; mostrarPaso();
      var top = $('nav'); if (top && top.scrollIntoView) top.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    cont.querySelectorAll('input[name=th-vista]').forEach(function (r) {
      r.addEventListener('change', function () { try { localStorage.setItem('cavesal_gyn_thm_vista', radio('vista')); } catch (e) {} paso = 1; mostrarPaso(); });
    });
    $('ant').addEventListener('click', function () { mover(-1); });
    $('sig').addEventListener('click', function () { mover(1); });
    $('imprimir').addEventListener('click', function () { w.print(); });
    $('abrirCompleta').addEventListener('click', function () {
      cont.querySelector('input[name=th-vista][value=completa]').checked = true;
      try { localStorage.setItem('cavesal_gyn_thm_vista', 'completa'); } catch (e) {}
      mostrarPaso();
    });
    cont.addEventListener('change', mostrarPaso);
    cont._texto = function () { return ultimo; };
    actualizar();
    mostrarPaso();
  }

  w.GYN = w.GYN || {};
  w.GYN.thm = { calcular: calcular, presentaciones: presentaciones, render: render, CONTRA: CONTRA, PATO: PATO };
})(window);
