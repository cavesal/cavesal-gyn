/* CaVeSal® GYN · Puerta de licencia (solo versión completa, sin demo).
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

  function gate() { return d.getElementById('license_gate'); }
  function ocultarGate() { var g = gate(); if (g) g.hidden = true; }
  function mostrarGate() { var g = gate(); if (g) g.hidden = false; }

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
        if (data.valido) { w.CVSLic.guardar(LICENSE_STORAGE_KEY, clave); ocultarGate(); }
        else mostrarError(data.mensaje);
      })
      .catch(function () { mostrarError('error'); });
  }

  function iniciar() {
    if (!REQUIERE_LICENCIA) { ocultarGate(); return; }
    if (localStorage.getItem(LICENSE_STORAGE_KEY)) { ocultarGate(); return; }
    mostrarGate();
    w.CVSLic.restaurar(LICENSE_STORAGE_KEY).then(function (c) { if (c) ocultarGate(); });
    w.CVSLic.montarFormulario('lg_reactivar', { api: LICENSE_API, producto: PRODUCTO, claveInputId: 'lg_input', lang: 'es' });
    d.getElementById('lg_btn').addEventListener('click', validarClave);
    d.getElementById('lg_input').addEventListener('keydown', function (e) { if (e.key === 'Enter') validarClave(); });
  }

  w.GYN = w.GYN || {};
  w.GYN.licencia = { iniciar: iniciar, REQUIERE_LICENCIA: REQUIERE_LICENCIA };
})(window, document);
