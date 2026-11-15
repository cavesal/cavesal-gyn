/* CaVeSal® GYN · Mis pacientes: lista, búsqueda, abrir y borrar fichas, backup .json, Google Drive e importación (combinar o reemplazar).
   Solo en la versión completa. Los datos quedan en este dispositivo (localStorage).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w, d) {
  'use strict';
  var KL = 'cavesal_gyn_pacientes', KS = 'cavesal_gyn_ficha_actual';
  function lista() { try { return JSON.parse(localStorage.getItem(KL) || '{}') || {}; } catch (e) { return {}; } }
  function guardarL(o) { try { localStorage.setItem(KL, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function usar(p) { try { sessionStorage.setItem(KS, JSON.stringify(p)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hoy() { return new Date().toISOString().slice(0, 10); }

  // Une dos listas: misma paciente → queda la más reciente y se suman las consultas que falten.
  function combinar(base, nuevas) {
    var r = {}, k;
    for (k in base) r[k] = base[k];
    for (k in nuevas) {
      var q = nuevas[k]; if (!q || !q.id || !q.campos) continue;
      var a = r[q.id];
      if (!a) { r[q.id] = q; continue; }
      var fa = a.actualizada || a.creada || '', fq = q.actualizada || q.creada || '';
      var gana = fq > fa ? q : a, otra = gana === q ? a : q;
      gana.consultas = gana.consultas || {};
      for (var c in (otra.consultas || {})) if (!gana.consultas[c]) gana.consultas[c] = otra.consultas[c];
      r[q.id] = gana;
    }
    return r;
  }
  // Acepta el backup de todas las pacientes o el archivo de una sola (Exportar JSON de la ficha).
  function leerArchivo(o) {
    if (o && o.app === 'cavesal-gyn-pacientes' && o.pacientes && typeof o.pacientes === 'object') {
      var r = {}; (Array.isArray(o.pacientes) ? o.pacientes : Object.keys(o.pacientes).map(function (k) { return o.pacientes[k]; })).forEach(function (p) { if (p && p.id && p.campos) r[p.id] = p; });
      return r;
    }
    var q = o && (o.paciente || o);
    if (q && q.id && q.campos) { var u = {}; u[q.id] = q; return u; }
    return null;
  }
  function backup() { return { app: 'cavesal-gyn-pacientes', version: 1, fecha: new Date().toISOString(), pacientes: lista() }; }
  function descargar() {
    var blob = new Blob([JSON.stringify(backup(), null, 2)], { type: 'application/json' });
    var u = URL.createObjectURL(blob), l = d.createElement('a');
    l.href = u; l.download = 'CaVeSal-GYN_pacientes_' + hoy() + '.json'; d.body.appendChild(l); l.click(); l.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  }

  function render(cont) {
    var full = w.GYN.licencia.esFull();
    if (!full) {
      cont.innerHTML = '<div class="pc-lock"><div class="pc-ic">🔒</div><h3>Mis pacientes</h3>' +
        '<ul class="lista"><li>Lista y búsqueda de pacientes guardadas</li><li>Abrir la ficha y sus consultas</li><li>Backup .json y Google Drive</li><li>Importar en otro equipo (combinar o reemplazar)</li></ul>' +
        '<p class="ayuda">Disponible en la versión completa.</p><button type="button" class="btn-activar" id="pc-up">Activar la versión completa</button></div>';
      cont.querySelector('#pc-up').addEventListener('click', function () { w.GYN.licencia.abrir(); });
      return;
    }
    cont.innerHTML =
      '<div class="pc-top"><input id="pc-buscar" type="search" placeholder="Buscar por código o edad" autocomplete="off"><button type="button" class="btn-activar" id="pc-nueva">+ Nueva</button></div>' +
      '<div id="pc-lista"></div>' +
      '<div class="pq-acciones"><button type="button" class="btn-sec" id="pc-bk">Backup local (.json)</button><button type="button" class="btn-sec" id="pc-imp">Importar backup</button></div>' +
      '<fieldset class="mrs-grupo pc-drive" id="pc-drive"><legend>Tus datos, en tus manos</legend>' +
        '<p class="ayuda">Toda la información se guarda en este dispositivo. Para sincronizar entre PC, celular o tablet, descargá una copia y subila a tu Google Drive. Luego importala donde la necesites.</p>' +
        '<div class="pc-2"><button type="button" class="btn-sec" id="pc-dl"><strong>Descargar .json</strong><br><small>Genera tu backup</small></button>' +
        '<a class="btn-sec" id="pc-gd" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener"><strong>Abrir Google Drive</strong><br><small>Para guardar el archivo</small></a></div>' +
        '<p class="pc-sub"><strong>Importar backup</strong></p>' +
        '<label class="chk"><input type="radio" name="pc-modo" value="combinar" checked> Combinar</label> <label class="chk"><input type="radio" name="pc-modo" value="reemplazar"> Reemplazar todo</label>' +
        '<label class="btn-sec pc-file">Elegir archivo .json<input type="file" id="pc-file" accept=".json,application/json" hidden></label>' +
      '</fieldset>' +
      '<p class="ayuda" id="pc-msg" aria-live="polite"></p>' +
      '<p class="orientativa">Los datos se guardan en este dispositivo, identificados con un código, sin nombre ni documento. Descargá tu backup periódicamente para tenerlo a salvo y poder usarlo en otro equipo.</p>';
    var q = function (s) { return cont.querySelector(s); };
    function msg(t) { q('#pc-msg').textContent = t; }
    function pintar() {
      var L = lista(), f = q('#pc-buscar').value.trim().toLowerCase();
      var ks = Object.keys(L).filter(function (k) { var p = L[k]; return !f || (k + ' ' + (p.campos.edad || '')).toLowerCase().indexOf(f) >= 0; })
        .sort(function (a, b) { return (L[b].actualizada || L[b].creada || '').localeCompare(L[a].actualizada || L[a].creada || ''); });
      q('#pc-lista').innerHTML = ks.length ? '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Código</th><th>Edad</th><th>Consultas</th><th>Actualizada</th><th></th></tr></thead><tbody>' +
        ks.map(function (k) { var p = L[k]; return '<tr><td><strong>' + esc(k) + '</strong></td><td>' + esc(p.campos.edad || '—') + '</td><td>' + Object.keys(p.consultas || {}).length + '</td><td>' + esc(p.actualizada || p.creada || '') + '</td>' +
          '<td><button type="button" class="btn-sec" data-pc="abrir" data-id="' + esc(k) + '">Abrir</button> <button type="button" class="btn-sec" data-pc="borrar" data-id="' + esc(k) + '">Borrar</button></td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="ayuda">' + (Object.keys(L).length ? 'Sin resultados.' : 'Todavía no hay pacientes guardadas. Creá una con + Nueva y guardala desde la ficha.') + '</p>';
    }
    q('#pc-buscar').addEventListener('input', pintar);
    q('#pc-nueva').addEventListener('click', function () { try { sessionStorage.removeItem(KS); } catch (e) {} location.hash = '#ficha'; });
    q('#pc-lista').addEventListener('click', function (e) {
      var b = e.target.closest('[data-pc]'); if (!b) return;
      var id = b.getAttribute('data-id'), L = lista(), p = L[id]; if (!p) return;
      if (b.getAttribute('data-pc') === 'abrir') { p.consultas = p.consultas || {}; usar(p); location.hash = '#ficha'; return; }
      if (!confirm('¿Borrar la paciente ' + id + ' de este dispositivo?')) return;
      delete L[id]; guardarL(L); pintar(); msg('Paciente ' + id + ' borrada.');
    });
    q('#pc-bk').addEventListener('click', function () { descargar(); msg('Backup descargado.'); });
    q('#pc-dl').addEventListener('click', function () { descargar(); msg('Backup descargado. Subilo a tu Google Drive.'); });
    q('#pc-imp').addEventListener('click', function () { q('#pc-drive').scrollIntoView({ behavior: 'smooth' }); });
    q('#pc-file').addEventListener('change', function () {
      var fl = this.files && this.files[0], inp = this; if (!fl) return;
      var rd = new FileReader();
      rd.onload = function () {
        var nuevas = null; try { nuevas = leerArchivo(JSON.parse(rd.result)); } catch (e) {}
        if (!nuevas) { msg('Ese archivo no es un backup de pacientes de CaVeSal® GYN.'); inp.value = ''; return; }
        var modo = (cont.querySelector('input[name="pc-modo"]:checked') || {}).value, n = Object.keys(nuevas).length;
        if (modo === 'reemplazar' && !confirm('Se borran las pacientes de este dispositivo y quedan solo las del archivo. ¿Continuar?')) { inp.value = ''; return; }
        guardarL(modo === 'reemplazar' ? nuevas : combinar(lista(), nuevas));
        pintar(); msg('Backup importado: ' + n + ' paciente' + (n === 1 ? '' : 's') + (modo === 'reemplazar' ? ' (reemplazo total).' : ' (combinado).'));
        inp.value = '';
      };
      rd.readAsText(fl);
    });
    pintar();
  }

  w.GYN = w.GYN || {};
  w.GYN.pacientes = { render: render, combinar: combinar, leerArchivo: leerArchivo, backup: backup };
})(window, document);
