/* CaVeSal® · Plan anual de las apps (NUEVO 2026-11-18).
   Guarda plan y vencimiento de la clave activada, los consulta al script de
   licencias (accion=verificar, lic=2) cada 12 h con internet y avisa:
   - desde 15 días antes del vencimiento: aviso amarillo con la fecha;
   - vencida: 7 días de gracia con aviso rojo, todo sigue funcionando;
   - después: vuelve a la Demo con "Renovar" y "Ya renové, verificar".
   Las claves de por vida no ven nada. Nunca se borran datos ni la clave.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). */
(function (w, d) {
  'use strict';
  var DIA = 86400000, AVISO = 15, GRACIA = 7, CADA = 12 * 3600000;
  var COMPRAR = 'https://cavesal.app/comprar.html';
  var TXT = {
    es: { aviso: 'Tu plan anual vence el {f} ({n}).', gracia: 'Tu plan anual venció el {f}. Te quedan {n} de gracia: renová para no perder la versión completa.',
      venc: 'Tu plan anual venció el {f}', vencSub: 'La app volvió a la Demo. Tus datos y tu clave se conservan: al renovar, todo vuelve a funcionar con la misma clave.',
      renovar: 'Renovar mi plan', verificar: 'Ya renové, verificar', verificando: 'Verificando…', demo: 'Seguir en la Demo',
      sigue: 'Todavía figura vencido. Si ya pagaste, esperá la confirmación por email y volvé a tocar "Ya renové, verificar".',
      sinRed: 'Necesitás internet para verificar.', dia: 'día', dias: 'días', hoy: 'vence hoy', cerrar: 'Cerrar' },
    en: { aviso: 'Your annual plan expires on {f} ({n}).', gracia: 'Your annual plan expired on {f}. You have {n} of grace left: renew to keep the full version.',
      venc: 'Your annual plan expired on {f}', vencSub: 'The app is back to the Demo. Your data and your key are kept: once you renew, everything works again with the same key.',
      renovar: 'Renew my plan', verificar: 'I renewed, verify', verificando: 'Verifying…', demo: 'Continue with the Demo',
      sigue: 'It still shows as expired. If you already paid, wait for the confirmation email and tap "I renewed, verify" again.',
      sinRed: 'You need internet to verify.', dia: 'day', dias: 'days', hoy: 'expires today', cerrar: 'Close' },
    pt: { aviso: 'Seu plano anual vence em {f} ({n}).', gracia: 'Seu plano anual venceu em {f}. Restam {n} de carência: renove para não perder a versão completa.',
      venc: 'Seu plano anual venceu em {f}', vencSub: 'O app voltou para a Demo. Seus dados e sua chave são mantidos: ao renovar, tudo volta a funcionar com a mesma chave.',
      renovar: 'Renovar meu plano', verificar: 'Já renovei, verificar', verificando: 'Verificando…', demo: 'Continuar na Demo',
      sigue: 'Ainda aparece vencido. Se você já pagou, aguarde a confirmação por e-mail e toque de novo em "Já renovei, verificar".',
      sinRed: 'Você precisa de internet para verificar.', dia: 'dia', dias: 'dias', hoy: 'vence hoje', cerrar: 'Fechar' }
  };
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function leer(lic) { try { return JSON.parse(ls(lic + '_plan') || 'null'); } catch (e) { return null; } }
  function guardar(lic, data) {
    var m = { plan: (data && data.plan) || 'vida', vence: (data && data.vence) || null, chk: Date.now() };
    ls(lic + '_plan', JSON.stringify(m));
    return m;
  }
  function estado(lic) {
    var m = leer(lic);
    if (!m || m.plan !== 'anual' || !m.vence) return { estado: 'ok', m: m };
    var vence = new Date(m.vence), dias = Math.ceil((vence.getTime() - Date.now()) / DIA);
    var e = dias > AVISO ? 'ok' : dias > 0 ? 'aviso' : dias > -GRACIA ? 'gracia' : 'vencida';
    return { estado: e, dias: dias, vence: vence, m: m };
  }
  function bloqueada(lic) { return !!ls(lic) && estado(lic).estado === 'vencida'; }
  function verificar(o) {
    var clave = ls(o.lic);
    if (!clave) return Promise.resolve(null);
    var url = o.api + '?accion=verificar&lic=2&producto=' + encodeURIComponent(o.producto) + '&clave=' + encodeURIComponent(clave);
    return fetch(url).then(function (r) { return r.json(); }).then(function (r) {
      if (r && r.valido) guardar(o.lic, r);
      return r;
    });
  }
  function fecha(v, lang) { try { return v.toLocaleDateString(lang === 'en' ? 'en-GB' : lang === 'pt' ? 'pt-BR' : 'es-PY'); } catch (e) { return String(v).slice(0, 10); } }
  function plural(n, t) { return n + ' ' + (n === 1 ? t.dia : t.dias); }
  function urlRenovar(o) {
    return COMPRAR + '?plan=anual&producto=' + encodeURIComponent(o.comprar || o.producto) + '&clave_renovar=' + encodeURIComponent(ls(o.lic) || '');
  }
  function quitar(id) { var x = d.getElementById(id); if (x) x.parentNode.removeChild(x); }
  var BTN = 'display:inline-block;padding:9px 14px;border-radius:9px;font:700 .85rem system-ui,sans-serif;cursor:pointer;text-decoration:none;border:none;margin:4px';

  function pintar(o) {
    var t = TXT[o.lang] || TXT.es, s = estado(o.lic);
    quitar('cvs-plan-aviso'); quitar('cvs-plan-venc');
    if (!ls(o.lic) || s.estado === 'ok') return;
    var f = fecha(s.vence, o.lang);
    if (s.estado === 'vencida') {
      if (o.cerrado) return;
      var ov = d.createElement('div');
      ov.id = 'cvs-plan-venc';
      ov.setAttribute('role', 'dialog');
      ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.82);display:flex;align-items:center;justify-content:center;padding:18px';
      ov.innerHTML = '<div style="background:#fff;color:#1f2937;max-width:420px;width:100%;border-radius:16px;padding:22px;text-align:center;font:400 .92rem/1.5 system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.35)">' +
        '<div style="font-weight:800;font-size:1.05rem;color:#b91c1c;margin-bottom:8px">' + t.venc.replace('{f}', f) + '</div>' +
        '<p style="margin:0 0 14px">' + t.vencSub + '</p>' +
        '<a data-p="renovar" href="' + urlRenovar(o) + '" target="_blank" rel="noopener" style="' + BTN + ';background:#0EA5B7;color:#fff">' + t.renovar + '</a>' +
        '<button type="button" data-p="verificar" style="' + BTN + ';background:#0f766e;color:#fff">' + t.verificar + '</button><br>' +
        (o.demo ? '<a data-p="demo" href="' + o.demo + '" style="' + BTN + ';background:#e5e7eb;color:#1f2937">' + t.demo + '</a>'
                : '<button type="button" data-p="demo" style="' + BTN + ';background:#e5e7eb;color:#1f2937">' + t.demo + '</button>') +
        '<div data-p="msg" style="display:none;font-size:.8rem;color:#b91c1c;margin-top:8px"></div></div>';
      d.body.appendChild(ov);
      if (!o.demo) ov.querySelector('[data-p="demo"]').addEventListener('click', function () { o.cerrado = true; quitar('cvs-plan-venc'); });
      conectarVerificar(o, ov, t);
      return;
    }
    var roja = s.estado === 'gracia';
    var n = roja ? plural(GRACIA + s.dias, t) : (s.dias <= 0 ? t.hoy : plural(s.dias, t));
    var txt = (roja ? t.gracia : t.aviso).replace('{f}', f).replace('{n}', n);
    if (o.cerradoAviso) return;
    var b = d.createElement('div');
    b.id = 'cvs-plan-aviso';
    b.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:2147482000;border-radius:12px;padding:10px 12px;font:600 .82rem/1.4 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.2);' +
      (roja ? 'background:#fee2e2;color:#7f1d1d;border:1.5px solid #ef4444' : 'background:#fef3c7;color:#78350f;border:1.5px solid #f59e0b');
    b.innerHTML = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;justify-content:center">' +
      '<span style="flex:1 1 220px">' + txt + '</span>' +
      '<a href="' + urlRenovar(o) + '" target="_blank" rel="noopener" style="' + BTN + ';padding:6px 10px;background:#0EA5B7;color:#fff">' + t.renovar + '</a>' +
      '<button type="button" data-p="verificar" style="' + BTN + ';padding:6px 10px;background:#0f766e;color:#fff">' + t.verificar + '</button>' +
      '<button type="button" data-p="x" aria-label="' + t.cerrar + '" style="' + BTN + ';padding:6px 10px;background:transparent;color:inherit">✕</button></div>' +
      '<div data-p="msg" style="display:none;font-size:.76rem;margin-top:4px;text-align:center"></div>';
    d.body.appendChild(b);
    b.querySelector('[data-p="x"]').addEventListener('click', function () { o.cerradoAviso = true; quitar('cvs-plan-aviso'); });
    conectarVerificar(o, b, t);
  }

  function conectarVerificar(o, cont, t) {
    var btn = cont.querySelector('[data-p="verificar"]'), msg = cont.querySelector('[data-p="msg"]');
    btn.addEventListener('click', function () {
      if (navigator.onLine === false) { msg.textContent = t.sinRed; msg.style.display = 'block'; return; }
      var antes = estado(o.lic).estado;
      btn.disabled = true; btn.textContent = t.verificando;
      verificar(o).then(function () {
        var ahora = estado(o.lic).estado;
        if (ahora === 'ok' || (antes === 'vencida' && ahora !== 'vencida')) { location.reload(); return; }
        btn.disabled = false; btn.textContent = t.verificar;
        msg.textContent = t.sigue; msg.style.display = 'block';
      }).catch(function () { btn.disabled = false; btn.textContent = t.verificar; msg.textContent = t.sinRed; msg.style.display = 'block'; });
    });
  }

  // o = { api, producto, lic, lang, demo (URL o null), comprar (producto para comprar.html), alCambiar }
  function iniciar(o) {
    if (!ls(o.lic)) return;
    function listo(fn) { if (d.body) fn(); else d.addEventListener('DOMContentLoaded', fn); }
    listo(function () { pintar(o); });
    var m = leer(o.lic);
    if (navigator.onLine === false || (m && Date.now() - (m.chk || 0) < CADA)) return;
    var antes = bloqueada(o.lic);
    verificar(o).then(function () {
      listo(function () { pintar(o); });
      if (bloqueada(o.lic) !== antes && typeof o.alCambiar === 'function') o.alCambiar();
    }).catch(function () {});
  }

  w.CVSPlan = { iniciar: iniciar, guardar: guardar, leer: leer, estado: estado, bloqueada: bloqueada, verificar: verificar };
})(window, document);
