/* CaVeSal® GYN · Navegación (buscador, motivo de consulta, etapa de vida, capítulo, ficha y pantallas por hash).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w, d) {
  'use strict';
  var T = w.GYN_TEXTOS;
  var NAVK = 'cavesal_gyn_nav';
  var estado = { tab: 'motivo', sel: 'tumor', q: '' };
  try { var g = JSON.parse(sessionStorage.getItem(NAVK) || 'null'); if (g && g.tab) estado = g; } catch (e) {}
  function guardarNav() { try { sessionStorage.setItem(NAVK, JSON.stringify(estado)); } catch (e) {} }
  var $ = function (id) { return d.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function todasLasFunciones() {
    var l = [];
    T.capitulos.forEach(function (c) { c.funciones.forEach(function (f) { l.push({ f: f, c: c }); }); });
    return l;
  }
  function buscar(id) {
    var l = todasLasFunciones();
    for (var i = 0; i < l.length; i++) if (l[i].f.id === id) return l[i];
    return null;
  }
  function capsDe(r) { return [r.c.id].concat(r.f.caps || []); }
  function nombresEtapas(ids) {
    if (ids.length === T.etapas.length) return 'Todas las etapas';
    return ids.map(function (i) { for (var k = 0; k < T.etapas.length; k++) if (T.etapas[k].id === i) return T.etapas[k].nombre; return i; }).join(' · ');
  }
  function nombreMotivo(id) { for (var i = 0; i < T.motivos.length; i++) if (T.motivos[i].id === id) return T.motivos[i].nombre; return id; }

  var TABS = [['motivo', 'Motivo de consulta'], ['etapa', 'Etapa de vida'], ['cap', 'Capítulo']];
  function filtrar() {
    var l = todasLasFunciones();
    if (estado.q) {
      var q = norm(estado.q).split(/\s+/).filter(Boolean);
      return l.filter(function (r) {
        var t = norm([r.f.nombre, r.f.resumen, r.f.kw, r.c.nombre, (r.f.motivos || []).map(nombreMotivo).join(' ')].join(' '));
        return q.every(function (p) { return t.indexOf(p) >= 0; });
      });
    }
    if (estado.tab === 'motivo') return l.filter(function (r) { return (r.f.motivos || []).indexOf(estado.sel) >= 0; });
    if (estado.tab === 'etapa') return l.filter(function (r) { return r.f.etapas.indexOf(estado.sel) >= 0; });
    return l.filter(function (r) { return capsDe(r).indexOf(estado.sel) >= 0; });
  }
  function cuenta(tab, id) {
    return todasLasFunciones().filter(function (r) {
      return tab === 'motivo' ? (r.f.motivos || []).indexOf(id) >= 0 : tab === 'etapa' ? r.f.etapas.indexOf(id) >= 0 : capsDe(r).indexOf(id) >= 0;
    }).length;
  }

  function renderInicio() {
    if (d.activeElement !== $('buscar')) $('buscar').value = estado.q;
    $('tabs').innerHTML = TABS.map(function (t) { return '<button type="button" class="tab" role="tab" data-tab="' + t[0] + '" aria-selected="' + (!estado.q && estado.tab === t[0]) + '">' + t[1] + '</button>'; }).join('');
    var sub = '', intro = '';
    if (estado.tab === 'motivo') {
      var gr = T.motivos.filter(function (m) { return m.grande; }), ch = T.motivos.filter(function (m) { return !m.grande; });
      sub = '<div class="tiles">' + gr.map(function (m) { return '<button type="button" class="tile" data-sel="' + m.id + '" aria-pressed="' + (!estado.q && estado.sel === m.id) + '"><b>' + esc(m.nombre) + '</b><small>' + esc(m.desc || '') + '</small></button>'; }).join('') + '</div>' +
        ch.map(function (m) { return '<button type="button" class="chip" data-sel="' + m.id + '" aria-pressed="' + (!estado.q && estado.sel === m.id) + '">' + esc(m.nombre) + '<span class="c-n">' + cuenta('motivo', m.id) + '</span></button>'; }).join('');
    } else if (estado.tab === 'etapa') {
      sub = T.etapas.map(function (e) { return '<button type="button" class="chip" data-sel="' + e.id + '" aria-pressed="' + (!estado.q && estado.sel === e.id) + '" title="' + esc(e.rango) + '">' + esc(e.nombre) + '<span class="c-n">' + cuenta('etapa', e.id) + '</span></button>'; }).join('');
      T.etapas.forEach(function (e) { if (e.id === estado.sel) intro = e.nombre + ': ' + e.rango + '.'; });
    } else {
      sub = T.capitulos.filter(function (c) { return cuenta('cap', c.id) > 0; }).map(function (c) { return '<button type="button" class="chip" data-sel="' + c.id + '" aria-pressed="' + (!estado.q && estado.sel === c.id) + '">' + esc(c.nombre) + '<span class="c-n">' + cuenta('cap', c.id) + '</span></button>'; }).join('');
      T.capitulos.forEach(function (c) { if (c.id === estado.sel) intro = c.intro; });
    }
    $('sub').innerHTML = sub;
    var lista = filtrar();
    $('catIntro').textContent = estado.q ? lista.length + ' resultado' + (lista.length === 1 ? '' : 's') + ' para "' + estado.q + '"' : intro;
    $('vacio').hidden = lista.length > 0;
    $('grid').innerHTML = lista.map(function (r) {
      var f = r.f, bl = bloqueada(f), ej = w.GYN.ejemplos && w.GYN.ejemplos.de(f.id);
      return '<a class="card v1' + (bl ? ' bloq' : '') + '" href="#' + f.id + '"' + (bl && ej ? ' data-card-ej="' + f.id + '"' : '') + '>' +
        (bl ? '<span class="lock">🔒 ' + esc(T.app.soloFull) + '</span>' : '') +
        '<h3>' + esc(f.nombre) + '</h3><p>' + esc(f.resumen) + '</p><span class="etapas">' + esc(nombresEtapas(f.etapas)) + '</span>' +
        '<span class="ir">' + (bl ? (ej ? 'Ver ejemplo' : 'Ver') : T.app.abrir) + ' →</span></a>';
    }).join('');
    var rs = w.GYN.ficha && w.GYN.ficha.resumen();
    $('fichaChip').textContent = rs && (rs.edad !== null || rs.total) ? rs.id + (rs.edad !== null ? ' · ' + rs.edad + ' años' : '') + ' · ' + rs.total + ' factor' + (rs.total === 1 ? '' : 'es') + (rs.n ? ' (' + rs.n + ' de alto riesgo)' : '') : 'Antecedentes y factores de riesgo con semáforo';
  }

  function bloqueada(f) { return f.estado === 'v1' && !w.GYN.licencia.esFull() && !w.GYN.licencia.abiertaEnDemo(f.id); }

  function htmlBloqueo(titulo) {
    return '<div class="bloqueo"><h3>' + esc(titulo || T.app.bloqTitulo) + '</h3><p>' + esc(T.app.bloqTexto) + '</p>' +
      '<button type="button" class="btn-activar" data-activar>' + esc(T.app.activar) + '</button>' +
      '<div class="compra"><a href="https://cavesal.gumroad.com/l/cavesal" target="_blank" rel="noopener">' + esc(T.app.comprarTarjeta) + ' ↗</a>' +
      '<a href="https://cavesal.app/comprar.html?producto=gyn" target="_blank" rel="noopener">' + esc(T.app.comprarTransf) + ' ↗</a></div></div>';
  }

  var ejSel = null, pendEj = null;
  function barraEjemplos(ejs, bloq) {
    return '<div class="ej-barra"><span class="ej-etq">' + (bloq ? 'Mirá cómo funciona con un caso de ejemplo:' : 'Cargar ejemplo:') + '</span>' +
      ejs.map(function (e, i) { return '<button type="button" class="btn-sec ej-btn" data-ej="' + i + '">' + esc(e.t) + '</button>'; }).join('') + '</div>';
  }

  var actual = null; // módulo en pantalla, para guardar la consulta al salir
  function capturarActual() {
    if (actual && w.GYN.ficha) { var c = $('pCuerpo'); if (c) w.GYN.ficha.capturar(actual, c); }
    actual = null;
  }

  function router() {
    var id = (location.hash || '').replace('#', '');
    // Métodos quedó unificado con la elegibilidad (opción A).
    if (id === 'metodos') { history.replaceState(null, '', '#mec'); id = 'mec'; }
    var viejo = $('pCuerpo'), cont = viejo.cloneNode(false);
    if (id === 'ficha' && w.GYN.ficha) {
      $('inicio').hidden = true; $('pantalla').hidden = false;
      $('pTitulo').textContent = 'Ficha de la paciente';
      $('pSub').textContent = 'Antecedentes, factores de riesgo y anticoncepción · libre en la Demo';
      viejo.parentNode.replaceChild(cont, viejo);
      w.GYN.ficha.render(cont, T, {});
      if (w.GYN.puente) w.GYN.puente.aplicar('ficha', cont);
      if (w.GYN.ia) w.GYN.ia.barra(cont, 'ficha', 'Ficha de la paciente');
      w.scrollTo(0, 0); $('pTitulo').focus({ preventScroll: true });
      return;
    }
    if (id === 'pacientes' && w.GYN.pacientes) {
      capturarActual();
      $('inicio').hidden = true; $('pantalla').hidden = false;
      $('pTitulo').textContent = 'Mis pacientes';
      $('pSub').textContent = 'Lista, backup y Google Drive · versión completa';
      viejo.parentNode.replaceChild(cont, viejo);
      w.GYN.pacientes.render(cont, T, {});
      w.scrollTo(0, 0); $('pTitulo').focus({ preventScroll: true });
      return;
    }
    var r = id ? buscar(id) : null;
    if (!r) {
      $('inicio').hidden = false; $('pantalla').hidden = true;
      renderInicio();
      return;
    }
    $('inicio').hidden = true; $('pantalla').hidden = false;
    $('pTitulo').textContent = r.f.nombre;
    $('pSub').textContent = r.c.nombre + ' · ' + nombresEtapas(r.f.etapas);
    // Contenedor nuevo en cada pantalla: evita que los oyentes de un módulo anterior sigan activos.
    viejo.parentNode.replaceChild(cont, viejo);
    var ejs = w.GYN.ejemplos ? w.GYN.ejemplos.de(r.f.id) : null;
    var iEj = ejSel && ejSel.id === r.f.id && ejs && ejs[ejSel.i] ? ejSel.i : null;
    var full = w.GYN.licencia.esFull(), soloLectura = iEj !== null && !full;
    if (bloqueada(r.f) && iEj === null) cont.innerHTML = htmlBloqueo() + (ejs ? barraEjemplos(ejs, true) : '');
    else if (w.GYN[r.f.id] && w.GYN[r.f.id].render) w.GYN[r.f.id].render(cont, T, { bloqueo: htmlBloqueo, esFull: full || soloLectura });
    if (iEj !== null) {
      w.GYN.ejemplos.aplicar(cont, ejs[iEj]); w.GYN.ejemplos.aplicar(cont, ejs[iEj]);
      var cab = d.createElement('div');
      cab.className = 'ej-aviso';
      cab.innerHTML = '<strong>Ejemplo ilustrativo:</strong> ' + esc(ejs[iEj].t) + '. Paciente ficticia.' +
        (soloLectura ? '<br>Así funciona la versión completa. Para cargar los datos de tus pacientes, activá tu clave.' +
          '<div class="ej-acc"><button type="button" class="btn-activar" data-activar>' + esc(T.app.activar) + '</button>' +
          '<a class="btn-sec" href="https://cavesal.app/comprar.html?producto=gyn" target="_blank" rel="noopener">' + esc(T.app.comprarTransf) + ' ↗</a></div>' : '') +
        ' <button type="button" class="btn-sec" data-ej-salir>' + (soloLectura ? 'Salir del ejemplo' : 'Limpiar y cargar mis datos') + '</button>';
      cont.insertBefore(cab, cont.firstChild);
      if (soloLectura) cont.querySelectorAll('input,select,textarea').forEach(function (e) { e.disabled = true; });
    } else if (ejs && !bloqueada(r.f)) {
      var bar = d.createElement('div');
      bar.innerHTML = barraEjemplos(ejs, false);
      cont.insertBefore(bar.firstChild, cont.firstChild);
    }
    if (w.GYN.puente && !bloqueada(r.f) && iEj === null) w.GYN.puente.aplicar(r.f.id, cont);
    if (w.GYN.ia && !bloqueada(r.f) && iEj === null) w.GYN.ia.barra(cont, r.f.id, r.f.nombre);
    if (iEj === null && !bloqueada(r.f)) {
      if (full) actual = r.f.id;
      var cs = w.GYN.ficha && w.GYN.ficha.consulta(r.f.id), fp = w.GYN.ficha && w.GYN.ficha.actual();
      if (cs && full) {
        var cb = d.createElement('div');
        cb.className = 'fila neutro cons-bar';
        cb.innerHTML = '<strong>Consulta guardada de ' + esc(fp.id) + '</strong> (' + esc(cs.fecha) + '). <button type="button" class="btn-sec" data-cons>Restaurar</button>';
        cont.insertBefore(cb, cont.firstChild);
        cb.querySelector('[data-cons]').addEventListener('click', function () { w.GYN.ejemplos.aplicar(cont, cs); w.GYN.ejemplos.aplicar(cont, cs); cb.remove(); });
      }
    }
    w.scrollTo(0, 0);
    $('pTitulo').focus({ preventScroll: true });
  }

  function tema() {
    var root = d.documentElement;
    var guardado = null;
    try { guardado = localStorage.getItem('cavesal_gyn_tema'); } catch (e) {}
    if (guardado) root.setAttribute('data-theme', guardado);
    $('btnTema').addEventListener('click', function () {
      var oscuro = root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark' : w.matchMedia('(prefers-color-scheme: dark)').matches;
      var nuevo = oscuro ? 'light' : 'dark';
      root.setAttribute('data-theme', nuevo);
      try { localStorage.setItem('cavesal_gyn_tema', nuevo); } catch (e) {}
    });
  }

  function legal() {
    var L = T.legal;
    $('pie').innerHTML = '<p class="aviso">' + esc(T.app.aviso) + '</p><p>' + esc(L.propiedad) + '</p><p>' + esc(L.ley) + '</p><p>' + esc(L.atribucion) + '</p>' +
      '<p><a href="mailto:drverasalerno@gmail.com">' + esc(L.contacto) + '</a> · <a href="https://cavesal.app/terminos.html" target="_blank" rel="noopener">Términos</a> · <a href="https://cavesal.app/privacidad.html" target="_blank" rel="noopener">Privacidad</a></p>' +
      '<p class="copy">' + esc(L.copyright) + '</p>';

    /* Clave propia de GYN y por versión: las apps CaVeSal® comparten el dominio cavesal.app,
       y con la clave común el aviso no aparecía si ya se había aceptado en otra app o en la otra versión. */
    var MODO = /\/full\//.test(location.pathname) ? 'full' : (/\/demo\//.test(location.pathname) ? 'demo' : 'inicio');
    var KEY = 'cavesal_gyn_legal_accept_' + MODO, VERSION = '1.1';
    var ok = false;
    try { var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); ok = raw && raw.version === VERSION; } catch (e) {}
    var ov = $('cavesal-legal-overlay'), chk = $('cavesal-legal-checkbox'), btn = $('cavesal-legal-accept');
    if (ok) { ov.hidden = true; return; }
    ov.hidden = false; d.body.style.overflow = 'hidden';
    chk.addEventListener('change', function () { btn.disabled = !chk.checked; });
    btn.addEventListener('click', function () {
      if (!chk.checked) return;
      try { localStorage.setItem(KEY, JSON.stringify({ version: VERSION, timestamp: new Date().toISOString() })); } catch (e) {}
      ov.hidden = true; d.body.style.overflow = '';
    });
  }

  d.addEventListener('DOMContentLoaded', function () {
    var PRIMERO = { motivo: 'tumor', etapa: 'edad-fertil', cap: 'gin' };
    $('tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]'); if (!b) return;
      var t = b.getAttribute('data-tab');
      if (t !== estado.tab) { estado.tab = t; estado.sel = PRIMERO[t]; }
      estado.q = ''; guardarNav(); renderInicio();
    });
    $('sub').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sel]'); if (!b) return;
      estado.sel = b.getAttribute('data-sel'); estado.q = ''; guardarNav(); renderInicio();
    });
    $('buscar').addEventListener('input', function () { estado.q = this.value.trim(); guardarNav(); renderInicio(); var i = $('buscar'); i.focus(); });
    $('grid').addEventListener('click', function (e) { var a = e.target.closest('[data-card-ej]'); if (a) pendEj = a.getAttribute('data-card-ej'); });
    w.addEventListener('gyn:ficha', function () {});
    $('volver').addEventListener('click', function () { location.hash = ''; });
    tema(); legal();
    w.GYN.licencia.iniciar();
    d.addEventListener('click', function (e) { if (e.target.closest('[data-activar]')) w.GYN.licencia.abrir(); });
    function banner() { $('demoBanner').hidden = w.GYN.licencia.esFull(); }
    w.addEventListener('gyn:licencia', function () { banner(); router(); });
    banner();
    w.addEventListener('hashchange', function () {
      capturarActual();
      var nid = (location.hash || '').replace('#', '');
      ejSel = pendEj && pendEj === nid ? { id: nid, i: 0 } : null; pendEj = null;
      router();
    });
    w.addEventListener('pagehide', capturarActual);
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ej]');
      if (b) { actual = null; ejSel = { id: (location.hash || '').replace('#', ''), i: +b.getAttribute('data-ej') }; router(); return; }
      if (e.target.closest('[data-ej-salir]')) { actual = null; ejSel = null; router(); }
    });
    router();
  });
})(window, document);
