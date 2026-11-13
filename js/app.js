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
      var v1 = f.estado === 'v1';
      return '<a class="card' + (v1 ? ' v1' : '') + '" href="#' + f.id + '"><span class="badge ' + (v1 ? 'b-v1' : 'b-prox') + '">' + (v1 ? T.app.conLogica : T.app.proximamente) + '</span>' +
        '<h3>' + esc(f.nombre) + '</h3><p>' + esc(f.resumen) + '</p><span class="etapas">' + esc(nombresEtapas(f.etapas)) + '</span>' +
        '<span class="ir">' + (v1 ? T.app.abrir : T.app.verDetalle) + ' →</span></a>';
    }).join('');
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
    var cont = $('pCuerpo');
    if (r.f.estado === 'v1' && w.GYN[r.f.id] && w.GYN[r.f.id].render) w.GYN[r.f.id].render(cont, T);
    else renderProx(cont, r.f);
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
    w.addEventListener('hashchange', router);
    router();
  });
})(window, document);
