/* CaVeSal® GYN · Puente GYN → CaVeSal® IA («Analizar con CaVeSal® IA»).
   Mismo contrato que el puente de la Historia Clínica (src/lib/ia-bridge.ts):
   abre https://ia.cavesal.app/chat.html?context=<base64> y chat.html decodifica con
   decodeURIComponent(escape(atob(...))), por eso acá se codifica con el inverso exacto
   btoa(unescape(encodeURIComponent(...))). No viajan nombre ni documento: solo la edad,
   los antecedentes de la ficha, los datos cargados en la pantalla y el resultado con la conducta.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w, d) {
  'use strict';
  var URL_IA = 'https://ia.cavesal.app/chat.html';
  var MAX_RES = 5000, MAX_DATOS = 60;

  function limpio(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function textoEtiqueta(el) {
    var lab = el.closest('label');
    if (!lab && el.id) lab = el.ownerDocument.querySelector('label[for="' + el.id + '"]');
    if (!lab) return '';
    var c = lab.cloneNode(true);
    c.querySelectorAll('input,select,textarea,option').forEach(function (x) { x.remove(); });
    return limpio(c.textContent).replace(/[:·]\s*$/, '');
  }
  function leyenda(el) { var fs = el.closest('fieldset'); var lg = fs && fs.querySelector('legend'); return lg ? limpio(lg.textContent) : ''; }

  // Datos cargados en la pantalla: solo los positivos o completados.
  function datosPantalla(cont) {
    var out = [];
    cont.querySelectorAll('input,select,textarea').forEach(function (e) {
      if (out.length >= MAX_DATOS || e.disabled || e.type === 'file' || e.type === 'button') return;
      if (e.closest('.ia-bar,.ej-barra,.ej-aviso,.cons-bar') || e.id === 'fi-lista' || e.id === 'fi-id') return;
      var etq = textoEtiqueta(e), val = '';
      if (e.type === 'checkbox') { if (!e.checked) return; out.push({ categoria: 'antecedente', descripcion: etq || leyenda(e) }); return; }
      if (e.type === 'radio') { if (!e.checked) return; var lg = leyenda(e); out.push({ categoria: 'dato_clinico', descripcion: (lg ? lg + ': ' : '') + etq }); return; }
      if (e.tagName === 'SELECT') { if (!e.value) return; val = limpio(e.options[e.selectedIndex] && e.options[e.selectedIndex].text); }
      else { if (e.value === '') return; val = limpio(e.value); }
      if (!etq && !val) return;
      out.push({ categoria: e.tagName === 'TEXTAREA' ? 'observacion' : 'dato_clinico', descripcion: etq ? etq + ': ' + val : val });
    });
    return out.filter(function (x) { return x.descripcion; });
  }

  // Resultado y conducta tal como se ven en pantalla.
  function resultado(cont) {
    var partes = [];
    cont.querySelectorAll('.resultados').forEach(function (r) {
      var t = (r.innerText || r.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
      if (t) partes.push(t);
    });
    var s = partes.join('\n\n');
    return s.length > MAX_RES ? s.slice(0, MAX_RES) + '…' : s;
  }

  function antecedentesFicha(esFicha) {
    var F = w.GYN.ficha; if (!F || esFicha) return { edad: null, items: [] };
    var p = F.actual(); if (!p || !p.campos) return { edad: null, items: [] };
    var r = F.derivar(p.campos);
    var items = F.semaforo(p.campos, r).map(function (x) { return { categoria: 'antecedente', descripcion: 'Ficha: ' + x.t }; });
    return { edad: r.edad, items: items };
  }

  function armarContexto(modulo, nombre, cont) {
    var esFicha = modulo === 'ficha';
    var fi = antecedentesFicha(esFicha);
    var edad = fi.edad;
    if (esFicha && w.GYN.ficha) { var p = w.GYN.ficha.actual(); if (p && p.campos) edad = w.GYN.ficha.derivar(p.campos).edad; }
    var res = resultado(cont);
    var ej = cont.querySelector('.ej-aviso');
    var resumen = [nombre, edad !== null && edad !== undefined ? edad + ' años' : null].filter(Boolean).join(' — ');
    if (ej) resumen += ' (ejemplo ilustrativo, paciente ficticia)';
    return {
      source_module: 'gyn',
      scope_authorized: 'calculo_actual',
      patient_summary: resumen,
      gyn_module: { id: modulo, nombre: nombre },
      clinical_findings: datosPantalla(cont).concat(fi.items),
      labs: [],
      ultrasound: [],
      medications: [],
      risk_calculations: res ? [{ nombre: nombre, resultado: res }] : [],
      alerts: []
    };
  }

  function codificar(obj) { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
  function url(ctx) { return URL_IA + '?context=' + encodeURIComponent(codificar(ctx)); }

  function enviar(modulo, nombre, cont) {
    if (!w.GYN.licencia.esFull()) { w.GYN.licencia.abrir(); return; }
    w.open(url(armarContexto(modulo, nombre, cont)), '_blank', 'noopener,noreferrer');
  }

  // Barra al pie de cada pantalla, también con un ejemplo cargado.
  function barra(cont, modulo, nombre) {
    if (!cont || cont.querySelector('.ia-bar')) return;
    var full = w.GYN.licencia.esFull();
    var b = d.createElement('div');
    b.className = 'ia-bar';
    b.innerHTML = '<div><strong>Analizar con CaVeSal® IA</strong><span>' +
      (full ? 'Envía los datos cargados, el resultado y la conducta de esta pantalla, con los antecedentes de la ficha. No viajan nombre ni documento.'
            : 'Disponible en la versión completa de CaVeSal® GYN y requiere una cuenta de CaVeSal® IA.') +
      '</span></div><button type="button" class="btn-ia">' + (full ? 'Analizar con CaVeSal® IA ↗' : 'Activar versión completa') + '</button>';
    b.querySelector('button').addEventListener('click', function () { enviar(modulo, nombre, cont); });
    cont.appendChild(b);
  }

  // Botón violeta de arriba en la versión completa: «Analizar con CaVeSal® IA».
  // Dentro de una pantalla envía esa pantalla; en el inicio abre la IA sin datos.
  function botonSuperior() {
    var a = d.querySelector('.topnav .pill-ia');
    if (!a || !w.GYN.licencia || !w.GYN.licencia.esFull()) return;
    a.textContent = 'Analizar con CaVeSal® IA';
    a.addEventListener('click', function (ev) {
      var pant = d.getElementById('pantalla');
      var btn = pant && !pant.hidden && d.querySelector('#pCuerpo .ia-bar .btn-ia');
      if (btn) { ev.preventDefault(); btn.click(); }
    });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', botonSuperior); else botonSuperior();

  w.GYN = w.GYN || {};
  w.GYN.ia = { barra: barra, armarContexto: armarContexto, codificar: codificar, url: url, URL_IA: URL_IA };
})(window, document);
