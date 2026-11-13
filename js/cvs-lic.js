/* CaVeSal® — resguardo de licencia y pedido de reactivación (fase 1, 2026-11-10).
   1) La clave se guarda en 3 lugares (localStorage + IndexedDB + cookie) y se pide
      almacenamiento persistente; al abrir, se restaura desde el que haya quedado.
   2) Código de dispositivo: id aleatorio + huella del equipo. Se manda al activar;
      si la misma clave vuelve desde el mismo equipo, el servidor la reactiva sola.
   3) Formulario "¿Ya habías activado tu clave…?" → accion=pedir_reactivacion
      (mail + Telegram a CaVeSal). Sin conexión o si falla: mailto. */
(function (w) {
  var DB = 'cavesal-lic', ST = 'kv', ID_KEY = 'cavesal_disp_id', MAIL = 'drverasalerno@gmail.com';
  function idb() {
    return new Promise(function (res, rej) {
      try {
        var r = indexedDB.open(DB, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore(ST); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      } catch (e) { rej(e); }
    });
  }
  function idbGet(k) {
    return idb().then(function (db) {
      return new Promise(function (res) {
        var q = db.transaction(ST, 'readonly').objectStore(ST).get(k);
        q.onsuccess = function () { res(q.result || null); };
        q.onerror = function () { res(null); };
      });
    }).catch(function () { return null; });
  }
  function idbSet(k, v) {
    return idb().then(function (db) {
      return new Promise(function (res) {
        var tx = db.transaction(ST, 'readwrite');
        tx.objectStore(ST).put(v, k);
        tx.oncomplete = function () { res(true); };
        tx.onerror = function () { res(false); };
      });
    }).catch(function () { return false; });
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ckGet(k) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function ckSet(k, v) {
    try { document.cookie = k + '=' + encodeURIComponent(v) + '; max-age=315360000; path=/; SameSite=Lax; Secure'; } catch (e) {}
  }
  function persistir() {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  }
  function guardar(k, v) { lsSet(k, v); ckSet(k, v); persistir(); return idbSet(k, v); }
  // Devuelve {valor, desde}: desde = 'local' | 'respaldo' | null
  function leer(k) {
    var v = lsGet(k);
    if (v) { if (!ckGet(k)) ckSet(k, v); idbGet(k).then(function (x) { if (!x) idbSet(k, v); }); return Promise.resolve({ valor: v, desde: 'local' }); }
    var c = ckGet(k);
    return idbGet(k).then(function (x) {
      var r = x || c;
      if (r) { guardar(k, r); return { valor: r, desde: 'respaldo' }; }
      return { valor: null, desde: null };
    });
  }
  function fnv(s, seed) {
    var h = seed >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function huella() {
    var n = navigator, s = screen, gl = '', tz = '';
    try {
      var c = document.createElement('canvas').getContext('webgl');
      var d = c && c.getExtension('WEBGL_debug_renderer_info');
      gl = d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : '';
    } catch (e) {}
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    var str = [n.platform, Math.min(s.width, s.height) + 'x' + Math.max(s.width, s.height),
      w.devicePixelRatio, n.hardwareConcurrency, n.deviceMemory, n.maxTouchPoints, tz, gl].join('|');
    return fnv(str, 2166136261) + fnv(str, 33554467);
  }
  function uuid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) {
      var r = Math.random() * 16 | 0; return (ch === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }
  function dispositivo() {
    return leer(ID_KEY).then(function (r) {
      var id = r.valor;
      if (!id) { id = uuid(); guardar(ID_KEY, id); }
      return { id: id, fp: huella() };
    });
  }
  function paramsDisp() {
    return dispositivo().then(function (d) {
      return '&disp=' + encodeURIComponent(d.id) + '&fp=' + encodeURIComponent(d.fp);
    }).catch(function () { return ''; });
  }
  // Al abrir: si la clave falta en localStorage pero quedó en un respaldo, la
  // repone y recarga UNA vez para que toda la app la vea.
  function restaurar(k) {
    return leer(k).then(function (r) {
      if (r.valor && r.desde === 'respaldo') {
        try {
          if (!sessionStorage.getItem('cvs_lic_rest')) { sessionStorage.setItem('cvs_lic_rest', '1'); location.reload(); }
        } catch (e) {}
      }
      return r.valor;
    });
  }

  var TXT = {
    es: { link: '¿Ya habías activado tu clave y te la vuelve a pedir? Escribinos y la reactivamos.',
      nombre: 'Nombre y apellido', mail: 'Correo electrónico', wa: 'WhatsApp (con código de país)',
      clave: 'Clave (si la tenés)', enviar: 'Enviar pedido', enviando: 'Enviando…',
      ok: 'Recibimos tu pedido. Te avisamos por correo o WhatsApp cuando la clave esté reactivada; después ingresala de nuevo acá.',
      falta: 'Completá nombre, correo y WhatsApp.', error: 'No se pudo enviar. Tocá el enlace para mandarnos el pedido por correo:',
      mailLink: 'Enviar por correo a ' + MAIL },
    en: { link: 'Already activated your key and it asks for it again? Write to us and we will reactivate it.',
      nombre: 'Full name', mail: 'Email', wa: 'WhatsApp (with country code)',
      clave: 'Key (if you have it)', enviar: 'Send request', enviando: 'Sending…',
      ok: 'We received your request. We will let you know by email or WhatsApp when the key is reactivated; then enter it here again.',
      falta: 'Fill in name, email and WhatsApp.', error: 'It could not be sent. Tap the link to send us the request by email:',
      mailLink: 'Send by email to ' + MAIL },
    pt: { link: 'Você já tinha ativado sua chave e ela é pedida de novo? Escreva para nós e nós a reativamos.',
      nombre: 'Nome completo', mail: 'E-mail', wa: 'WhatsApp (com código do país)',
      clave: 'Chave (se você tiver)', enviar: 'Enviar pedido', enviando: 'Enviando…',
      ok: 'Recebemos seu pedido. Avisaremos por e-mail ou WhatsApp quando a chave for reativada; depois digite-a aqui de novo.',
      falta: 'Preencha nome, e-mail e WhatsApp.', error: 'Não foi possível enviar. Toque no link para nos mandar o pedido por e-mail:',
      mailLink: 'Enviar por e-mail para ' + MAIL }
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mailto(producto, d) {
    var cuerpo = 'Pedido de reactivación de clave CaVeSal\n\nApp: ' + producto + '\nNombre: ' + d.nombre +
      '\nCorreo: ' + d.email + '\nWhatsApp: ' + d.whatsapp + '\nClave: ' + (d.clave || '(no la tengo)');
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Reactivación de clave — ' + producto) + '&body=' + encodeURIComponent(cuerpo);
  }
  function pedirReactivacion(api, producto, d) {
    return paramsDisp().then(function (pd) {
      var q = '?accion=pedir_reactivacion&producto=' + encodeURIComponent(producto) +
        '&nombre=' + encodeURIComponent(d.nombre) + '&email=' + encodeURIComponent(d.email) +
        '&whatsapp=' + encodeURIComponent(d.whatsapp) + '&clave=' + encodeURIComponent(d.clave || '') + pd;
      return fetch(api + q).then(function (r) { return r.json(); });
    });
  }
  // Monta el enlace + formulario dentro del elemento indicado.
  function montarFormulario(contId, opts) {
    var cont = document.getElementById(contId);
    if (!cont) return;
    var t = TXT[opts.lang] || TXT.es;
    var inp = 'width:100%;box-sizing:border-box;padding:9px 10px;border:1.5px solid #d0d7de;border-radius:8px;font-size:.82rem;margin-bottom:7px';
    cont.innerHTML =
      '<a href="#" data-cvs="abrir" style="display:block;font-size:.76rem;color:#0EA5B7;text-decoration:underline;margin:4px 0 10px;line-height:1.4">' + esc(t.link) + '</a>' +
      '<div data-cvs="form" style="display:none;text-align:left;background:#f4f8fb;border:1px solid #d0d7de;border-radius:10px;padding:12px;margin-bottom:12px">' +
      '<input data-cvs="nombre" placeholder="' + esc(t.nombre) + '" style="' + inp + '">' +
      '<input data-cvs="email" type="email" placeholder="' + esc(t.mail) + '" style="' + inp + '">' +
      '<input data-cvs="whatsapp" type="tel" placeholder="' + esc(t.wa) + '" style="' + inp + '">' +
      '<input data-cvs="clave" placeholder="' + esc(t.clave) + '" style="' + inp + ';text-transform:uppercase;font-family:monospace">' +
      '<button type="button" data-cvs="enviar" style="width:100%;padding:10px;background:#0EA5B7;color:#fff;border:none;border-radius:8px;font-size:.84rem;font-weight:700;cursor:pointer">' + esc(t.enviar) + '</button>' +
      '<div data-cvs="msg" style="display:none;font-size:.78rem;line-height:1.45;margin-top:8px"></div></div>';
    function $(n) { return cont.querySelector('[data-cvs="' + n + '"]'); }
    $('abrir').addEventListener('click', function (e) {
      e.preventDefault();
      var f = $('form'); f.style.display = f.style.display === 'none' ? 'block' : 'none';
      var ci = opts.claveInputId && document.getElementById(opts.claveInputId);
      if (ci && ci.value && !$('clave').value) $('clave').value = ci.value.trim().toUpperCase();
    });
    $('enviar').addEventListener('click', function () {
      var d = { nombre: $('nombre').value.trim(), email: $('email').value.trim(),
        whatsapp: $('whatsapp').value.trim(), clave: $('clave').value.trim().toUpperCase() };
      var msg = $('msg'), btn = $('enviar');
      msg.style.display = 'block';
      if (!d.nombre || !d.email || !d.whatsapp) { msg.style.color = '#c0392b'; msg.textContent = t.falta; return; }
      function fallo() {
        msg.style.color = '#c0392b';
        msg.innerHTML = esc(t.error) + '<br><a href="' + mailto(opts.producto, d) + '" style="color:#0EA5B7;font-weight:700">' + esc(t.mailLink) + '</a>';
        btn.disabled = false; btn.textContent = t.enviar;
      }
      btn.disabled = true; btn.textContent = t.enviando; msg.style.display = 'none';
      if (navigator.onLine === false) { msg.style.display = 'block'; fallo(); return; }
      pedirReactivacion(opts.api, opts.producto, d).then(function (r) {
        msg.style.display = 'block';
        if (r && r.ok) { msg.style.color = '#2e7d32'; msg.textContent = t.ok; btn.style.display = 'none'; }
        else fallo();
      }).catch(function () { msg.style.display = 'block'; fallo(); });
    });
  }

  w.CVSLic = { guardar: guardar, leer: leer, restaurar: restaurar, paramsDisp: paramsDisp, montarFormulario: montarFormulario };
})(window);
