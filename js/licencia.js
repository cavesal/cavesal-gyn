/* CaVeSal® GYN · Licencia: una sola app con modo Demo y versión completa.
   Demo: abiertos la escala MRS y el día de ovulación. El resto se habilita con la clave.
   Mismo patrón que CaVeSal® Emergencias: activación de clave contra el Apps Script de licencias,
   con resguardo de la clave y pedido de reactivación (js/cvs-lic.js, fase 1).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w, d) {
  'use strict';

  // En false mientras el repo es privado y el backend no reconoce producto=gyn.
  // Antes de publicar: poner en true (ver README, "Antes de publicar").
  var REQUIERE_LICENCIA = false;

  var LICENSE_API = 'https://script.google.com/macros/s/AKfycbzMHJG48y5W0sIadQxrrFx78Toge2FRBIMRDqKe5GQmvmnpDory1ftALVfJCvZX2WK6/exec';
  var LICENSE_STORAGE_KEY = 'cavesal_gyn_full_unlocked';
  var PRODUCTO = 'gyn';

  // Funciones abiertas en la Demo (la Fertilidad abre solo el ciclo; el trigger queda en la completa).
  var ABIERTAS_DEMO = ['mrs', 'fertilidad'];

  function gate() { return d.getElementById('license_gate'); }
  function ocultarGate() { var g = gate(); if (g) g.hidden = true; d.body.style.overflow = ''; }
  function mostrarGate() { var g = gate(); if (g) { g.hidden = false; d.body.style.overflow = 'hidden'; var i = d.getElementById('lg_input'); if (i) i.focus(); } }

  function claveGuardada() { try { return !!localStorage.getItem(LICENSE_STORAGE_KEY); } catch (e) { return false; } }
  // Sin REQUIERE_LICENCIA (repo privado, en pruebas) todo queda abierto, salvo ?demo=1 para revisar la Demo.
  function esFull() {
    if (/[?&]demo=1/.test(location.search)) return false;
    if (!REQUIERE_LICENCIA) return true;
    return claveGuardada();
  }
  function abiertaEnDemo(id) { return ABIERTAS_DEMO.indexOf(id) >= 0; }
  function activada() { ocultarGate(); w.dispatchEvent(new Event('gyn:licencia')); }

  function mostrarError(tipo) {
    var err = d.getElementById('lg_error'), btn = d.getElementById('lg_btn');
    btn.disabled = false; btn.textContent = 'Activar';
    var m = {
      ya_usada: 'Esta clave ya fue activada en otro dispositivo. Cada clave es válida para un solo dispositivo. Si ya la habías activado en este equipo, usá el formulario de abajo para pedir la reactivación.',
      no_es_producto_gyn: 'Esta clave es para otra app de CaVeSal®, no para CaVeSal® GYN. Activala en la app que corresponde.',
      no_existe: 'Esa clave no existe. Revisá que la copiaste correctamente (sin espacios extra).'
    };
    err.textContent = m[tipo] || 'Ocurrió un error al validar. Intentá nuevamente en unos segundos.';
    err.hidden = false;
  }

  function validarClave() {
    var input = d.getElementById('lg_input'), btn = d.getElementById('lg_btn'), err = d.getElementById('lg_error');
    var clave = input.value.trim().toUpperCase();
    if (!clave) { mostrarError('no_existe'); return; }
    err.hidden = true; btn.disabled = true; btn.textContent = 'Validando...';
    w.CVSLic.paramsDisp()
      .then(function (pd) { return fetch(LICENSE_API + '?clave=' + encodeURIComponent(clave) + '&accion=activar&producto=' + PRODUCTO + pd); })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.valido) { w.CVSLic.guardar(LICENSE_STORAGE_KEY, clave); activada(); }
        else mostrarError(data.mensaje);
      })
      .catch(function () { mostrarError('error'); });
  }

  function iniciar() {
    ocultarGate();
    d.getElementById('lg_cerrar').addEventListener('click', ocultarGate);
    w.CVSLic.montarFormulario('lg_reactivar', { api: LICENSE_API, producto: PRODUCTO, claveInputId: 'lg_input', lang: 'es' });
    d.getElementById('lg_btn').addEventListener('click', validarClave);
    d.getElementById('lg_input').addEventListener('keydown', function (e) { if (e.key === 'Enter') validarClave(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') ocultarGate(); });
    if (REQUIERE_LICENCIA && !claveGuardada()) {
      w.CVSLic.restaurar(LICENSE_STORAGE_KEY).then(function (c) { if (c) activada(); });
    }
  }

  w.GYN = w.GYN || {};
  w.GYN.licencia = { iniciar: iniciar, esFull: esFull, abiertaEnDemo: abiertaEnDemo, abrir: mostrarGate, REQUIERE_LICENCIA: REQUIERE_LICENCIA, CLAVE: LICENSE_STORAGE_KEY };
})(window, document);
