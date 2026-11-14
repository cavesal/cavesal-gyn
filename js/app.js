/* CaVeSal® GYN · Navegación (categorías, filtro de etapa y pantallas por hash).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w, d) {
  'use strict';
  var T = w.GYN_TEXTOS;
  var estado = { cat: 'fertilidad', etapa: 'todas' };
  var $ = function (id) { return d.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function todasLasFunciones() {
    var l = [];
    T.categorias.forEach(function (c) { c.funciones.forEach(function (f) { l.push({ f: f, c: c }); }); });
    return l;
  }
  function buscar(id) {
    var l = todasLasFunciones();
    for (var i = 0; i < l.length; i++) if (l[i].f.id === id) return l[i];
    return null;
  }
  function nombresEtapas(ids) {
    if (ids.length === T.etapas.length) return 'Todas las etapas';
    return ids.map(function (i) { for (var k = 0; k < T.etapas.length; k++) if (T.etapas[k].id === i) return T.etapas[k].nombre; return i; }).join(' · ');
  }

  function renderInicio() {
    $('cats').innerHTML = T.categorias.map(function (c) {
      return '<button type="button" class="cat" data-cat="' + c.id + '" aria-pressed="' + (c.id === estado.cat) + '">' + esc(c.nombre) + '<span class="c-n">' + c.funciones.length + '</span></button>';
    }).join('');
    $('filtro').innerHTML = [{ id: 'todas', nombre: T.app.todas }].concat(T.etapas).map(function (e) {
      return '<button type="button" class="chip" data-etapa="' + e.id + '" aria-pressed="' + (e.id === estado.etapa) + '"' + (e.rango ? ' title="' + esc(e.rango) + '"' : '') + '>' + esc(e.nombre) + '</button>';
    }).join('');
    var et = null;
    T.etapas.forEach(function (e) { if (e.id === estado.etapa) et = e; });
    $('rango').textContent = et ? et.rango : '';
    var cat = null;
    T.categorias.forEach(function (c) { if (c.id === estado.cat) cat = c; });
    $('catIntro').textContent = cat.intro;
    var lista = cat.funciones.filter(function (f) { return estado.etapa === 'todas' || f.etapas.indexOf(estado.etapa) >= 0; });
    $('vacio').hidden = lista.length > 0;
    $('grid').innerHTML = lista.map(function (f) {
      var v1 = f.estado === 'v1', bl = bloqueada(f);
      return '<a class="card' + (v1 ? ' v1' : '') + '" href="#' + f.id + '"><span class="badge ' + (v1 ? 'b-v1' : 'b-prox') + '">' + (v1 ? T.app.conLogica : T.app.proximamente) + '</span>' +
        (bl ? ' <span class="badge b-full">' + esc(T.app.soloFull) + '</span>' : '') +
        '<h3>' + esc(f.nombre) + '</h3><p>' + esc(f.resumen) + '</p><span class="etapas">' + esc(nombresEtapas(f.etapas)) + '</span>' +
        '<span class="ir">' + (v1 ? T.app.abrir : T.app.verDetalle) + ' →</span></a>';
    }).join('');
  }

  function bloqueada(f) { return f.estado === 'v1' && !w.GYN.licencia.esFull() && !w.GYN.licencia.abiertaEnDemo(f.id); }

  function htmlBloqueo(titulo) {
    return '<div class="bloqueo"><h3>' + esc(titulo || T.app.bloqTitulo) + '</h3><p>' + esc(T.app.bloqTexto) + '</p>' +
      '<button type="button" class="btn-activar" data-activar>' + esc(T.app.activar) + '</button>' +
      '<div class="compra"><a href="https://cavesal.gumroad.com/l/cavesal" target="_blank" rel="noopener">' + esc(T.app.comprarTarjeta) + ' ↗</a>' +
      '<a href="https://cavesal.app/comprar.html?producto=gyn" target="_blank" rel="noopener">' + esc(T.app.comprarTransf) + ' ↗</a></div></div>';
  }

  var ejSel = null;
  function barraEjemplos(ejs, bloq) {
    return '<div class="ej-barra"><span class="ej-etq">' + (bloq ? 'Mirá cómo funciona con un caso de ejemplo:' : 'Cargar ejemplo:') + '</span>' +
      ejs.map(function (e, i) { return '<button type="button" class="btn-sec ej-btn" data-ej="' + i + '">' + esc(e.t) + '</button>'; }).join('') + '</div>';
  }

  function renderProx(cont, f) {
    cont.innerHTML = '<p class="prox-aviso">' + esc(T.app.prox) + '</p>' +
      '<h3>' + esc(T.app.queCarga) + '</h3><ul>' + f.entra.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<h3>' + esc(T.app.queDevuelve) + '</h3><ul>' + f.sale.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<h3>' + esc(T.app.nota) + '</h3><p>' + esc(f.nota) + '</p>';
  }

  function router() {
    var id = (location.hash || '').replace('#', '');
    var r = id ? buscar(id) : null;
    if (!r) {
      $('inicio').hidden = false; $('pantalla').hidden = true;
      renderInicio();
      return;
    }
    estado.cat = r.c.id;
    $('inicio').hidden = true; $('pantalla').hidden = false;
    $('pTitulo').textContent = r.f.nombre;
    $('pSub').textContent = r.c.nombre + ' · ' + nombresEtapas(r.f.etapas);
    $('pBadge').className = 'badge ' + (r.f.estado === 'v1' ? 'b-v1' : 'b-prox');
    $('pBadge').textContent = r.f.estado === 'v1' ? T.app.conLogica : T.app.proximamente;
    // Contenedor nuevo en cada pantalla: evita que los oyentes de un módulo anterior sigan activos.
    var viejo = $('pCuerpo'), cont = viejo.cloneNode(false);
    viejo.parentNode.replaceChild(cont, viejo);
    var ejs = w.GYN.ejemplos ? w.GYN.ejemplos.de(r.f.id) : null;
    var iEj = ejSel && ejSel.id === r.f.id && ejs && ejs[ejSel.i] ? ejSel.i : null;
    var full = w.GYN.licencia.esFull(), soloLectura = iEj !== null && !full;
    if (bloqueada(r.f) && iEj === null) cont.innerHTML = htmlBloqueo() + (ejs ? barraEjemplos(ejs, true) : '');
    else if (r.f.estado === 'v1' && w.GYN[r.f.id] && w.GYN[r.f.id].render) w.GYN[r.f.id].render(cont, T, { bloqueo: htmlBloqueo, esFull: full || soloLectura });
    else renderProx(cont, r.f);
    if (iEj !== null) {
      w.GYN.ejemplos.aplicar(cont, ejs[iEj]);
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

    var KEY = 'cavesal_legal_accept', VERSION = '1.1';
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
    $('cats').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]'); if (!b) return;
      estado.cat = b.getAttribute('data-cat'); renderInicio();
    });
    $('filtro').addEventListener('click', function (e) {
      var b = e.target.closest('[data-etapa]'); if (!b) return;
      estado.etapa = b.getAttribute('data-etapa'); renderInicio();
    });
    $('volver').addEventListener('click', function () { location.hash = ''; });
    tema(); legal();
    w.GYN.licencia.iniciar();
    d.addEventListener('click', function (e) { if (e.target.closest('[data-activar]')) w.GYN.licencia.abrir(); });
    function banner() { $('demoBanner').hidden = w.GYN.licencia.esFull(); }
    w.addEventListener('gyn:licencia', function () { banner(); router(); });
    banner();
    w.addEventListener('hashchange', function () { ejSel = null; router(); });
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ej]');
      if (b) { ejSel = { id: (location.hash || '').replace('#', ''), i: +b.getAttribute('data-ej') }; router(); return; }
      if (e.target.closest('[data-ej-salir]')) { ejSel = null; router(); }
    });
    router();
  });
})(window, document);
