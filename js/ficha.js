/* CaVeSal® GYN · Ficha de la paciente: antecedentes, factores de riesgo con semáforo y resumen de elegibilidad anticonceptiva.
   La ficha es libre en la Demo (tildar factores y ver el semáforo). Guardar, abrir, exportar e importar pacientes es de la versión completa.
   Los datos se guardan solo en este dispositivo (localStorage), identificados con un código, sin nombre ni documento.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · US MEC 2024 · OMS MEC 2025 (notas) · NCCN Genetic/Familial High-Risk Assessment 2025 (criterios de derivación) · OMS (IMC).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w, d) {
  'use strict';
  var KS = 'cavesal_gyn_ficha_actual', KL = 'cavesal_gyn_pacientes';
  var MEC_COND = ['hta', 'diabetes', 'tev', 'trombofilia', 'isquemica', 'acv', 'cefalea', 'epilepsia', 'les', 'mama'];

  function nuevoId() { var t = new Date(); return 'GYN-' + t.getFullYear().toString().slice(2) + ('0' + (t.getMonth() + 1)).slice(-2) + ('0' + t.getDate()).slice(-2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(); }
  function hoy() { return new Date().toISOString().slice(0, 10); }
  function leerS() { try { return JSON.parse(sessionStorage.getItem(KS) || 'null'); } catch (e) { return null; } }
  function guardarS(p) { try { sessionStorage.setItem(KS, JSON.stringify(p)); } catch (e) {} }
  function lista() { try { return JSON.parse(localStorage.getItem(KL) || '{}'); } catch (e) { return {}; } }
  function guardarL(o) { try { localStorage.setItem(KL, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function actual() { return leerS(); }
  function vacia() { return { id: nuevoId(), creada: hoy(), campos: {}, consultas: {} }; }
  function n(v) { return w.GYN.comun.num(v); }

  // Datos derivados de la ficha.
  function derivar(c) {
    var r = { edad: n(c.edad), peso: n(c.peso), talla: n(c.talla), imc: null, paq: null, cig: n(c.cig), sel: {} };
    if (r.peso && r.talla) r.imc = Math.round(r.peso / Math.pow(r.talla / 100, 2) * 10 + 1e-9) / 10;
    if (r.cig && n(c.anosFuma)) r.paq = Math.round(r.cig / 20 * n(c.anosFuma) * 10) / 10;
    MEC_COND.forEach(function (k) { if (c['m_' + k]) r.sel[k] = c['m_' + k]; });
    if (c.tevFam && !r.sel.tev) r.sel.tev = 'familiar';
    if (c.famMama && !r.sel.mama) r.sel.mama = 'familiar';
    if (r.cig) r.sel.tabaco = r.edad !== null && r.edad < 35 ? 'menor35' : r.cig >= 15 ? 'mayor35mas15' : 'mayor35menos15';
    if (r.imc !== null && r.imc >= 30) r.sel.obesidad = r.edad !== null && r.edad < 18 ? 'imc30menor18' : 'imc30';
    if (c.endometriosis) r.sel.endometriosis = 'si';
    if (c.depresion) r.sel.depresion = 'si';
    var pd = n(c.partoDias);
    if (pd !== null) {
      if (c.lactancia) r.sel.lactancia = pd < 21 ? 'l21' : pd < 30 ? 'l21_30' : pd <= 42 ? 'l30_42' : 'l42';
      else r.sel.posparto = pd < 21 ? 'p21' : pd <= 42 ? 'p21_42' : 'p42';
    }
    var par = n(c.p) || 0, ces = n(c.c) || 0;
    if (c.g !== undefined && c.g !== '') r.sel.paridad = (par + ces) > 0 ? 'multipara' : 'nulipara';
    if (n(c.ect)) r.sel.ectopico = 'si';
    return r;
  }

  function semaforo(c, r) {
    var f = [];
    function add(col, t) { f.push({ col: col, t: t }); }
    if (r.edad !== null && r.edad >= 35 && r.cig) add('rojo', 'Fuma con 35 años o más (' + r.cig + ' cigarrillos por día): combinados categoría ' + (r.cig >= 15 ? '4' : '3'));
    else if (r.cig) add('ambar', 'Tabaquismo: ' + r.cig + ' cigarrillos por día');
    if (r.paq !== null) add(r.paq >= 20 ? 'naranja' : 'ambar', 'Índice paquetes-año: ' + String(r.paq).replace('.', ',') + (r.paq >= 20 ? ' (20 o más: considerar tamizaje de cáncer de pulmón según guía local)' : ''));
    if (r.imc !== null) {
      var cl = r.imc < 18.5 ? ['ambar', 'bajo peso'] : r.imc < 25 ? ['verde', 'normal'] : r.imc < 30 ? ['ambar', 'sobrepeso'] : r.imc < 35 ? ['naranja', 'obesidad clase I'] : r.imc < 40 ? ['naranja', 'obesidad clase II'] : ['rojo', 'obesidad clase III'];
      add(cl[0], 'IMC ' + String(r.imc).replace('.', ',') + ': ' + cl[1]);
    }
    var T = w.GYN_TEXTOS.mec.cond;
    MEC_COND.forEach(function (k) {
      var v = c['m_' + k]; if (!v) return;
      var grave = { hta: v === 'h160' || v === 'vascular', tev: v !== 'familiar', isquemica: true, acv: true, cefalea: v === 'migranaCon', les: v === 'aaf', mama: v === 'actual' || v === 'previo5', diabetes: v === 'organoBlanco' || v === 'vasc20', trombofilia: true }[k];
      add(grave ? 'rojo' : 'ambar', T[k].n + (T[k].o && T[k].o[v] ? ': ' + T[k].o[v] : ''));
    });
    if (n(c.perd) >= 2) add('naranja', 'Pérdidas recurrentes (' + n(c.perd) + '): estudio de SAF, trombofilia y causas uterinas');
    if (n(c.ect)) add('ambar', 'Embarazo ectópico previo');
    if (c.acne) add('neutro', 'Acné o hirsutismo: preferir progestágeno antiandrogénico (drospirenona, ciproterona, dienogest, clormadinona) si no hay contraindicación');
    if (c.endometriosis) add('neutro', 'Endometriosis: dienogest, DIU-LNG o anticonceptivo continuo');
    var hf = [c.famMama && 'mama', c.famOvario && 'ovario', c.famColon && 'colon o endometrio'].filter(Boolean);
    if (c.brca) add('rojo', 'Mutación BRCA u otra conocida: consejo genético y vigilancia de alto riesgo');
    else if (c.famOvario || (c.famMama && c.famMamaJoven)) add('naranja', 'Antecedente familiar de cáncer de ' + hf.join(', ') + (c.famMamaJoven ? ' (mama antes de los 50 años)' : '') + ': derivar a consejo genético');
    else if (hf.length) add('ambar', 'Antecedente familiar de cáncer de ' + hf.join(', ') + (c.famColon ? ': evaluar síndrome de Lynch si hay varios casos o edad temprana' : ''));
    if (c.dmFam) add('ambar', 'Diabetes en familiar de primer grado: tamizaje glucémico');
    if (c.utero === 'no') add('neutro', 'Sin útero: THM con estrógeno solo, sin progestágeno');
    if (c.meno) add('neutro', 'Posmenopausia');
    return f;
  }

  function campoT(id, txt, tipo, extra) { return '<label class="campo"><span>' + txt + '</span><input id="' + id + '" type="' + (tipo || 'text') + '"' + (extra || '') + '></label>'; }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila, M = T.mec.cond, full = w.GYN.licencia.esFull();
    var p = actual() || vacia(); guardarS(p);
    function selMec(k) { var o = M[k].o ? Object.keys(M[k].o).map(function (s) { return [s, M[k].o[s]]; }) : [['si', 'Sí']]; return c.sel('fi-m_' + k, [['', 'No']].concat(o), M[k].n); }
    var cand = full ? '' : ' 🔒';
    cont.innerHTML =
      '<p class="ayuda">Cargá los antecedentes una sola vez: el semáforo se actualiza al tildar y los datos se precargan en los módulos (MEC, THM, IMC, preconcepcional y otros). Sin nombre ni documento: la paciente se identifica con un código.</p>' +
      '<div class="pq-acciones fi-acc">' +
        '<button type="button" class="btn-sec" data-fi="guardar">Guardar paciente' + cand + '</button>' +
        '<button type="button" class="btn-sec" data-fi="nueva">Nueva paciente</button>' +
        '<button type="button" class="btn-sec" data-fi="exportar">Exportar JSON' + cand + '</button>' +
        '<label class="btn-sec fi-imp">Importar JSON' + cand + '<input type="file" id="fi-file" accept="application/json,.json" hidden></label></div>' +
      '<div class="grid2">' + '<label class="campo"><span>Pacientes guardadas' + cand + '</span><select id="fi-lista"><option value="">Elegir…</option></select></label></div>' +
      '<p class="ayuda" id="fi-msg" aria-live="polite"></p>' +
      c.grupo('1 · Datos', '<div class="grid2">' + campoT('fi-id', 'Código de la paciente') + c.campo('fi-edad', 'Edad', 'años', '1') + c.campo('fi-peso', 'Peso', 'kg') + c.campo('fi-talla', 'Talla', 'cm', '1') + '</div>') +
      c.grupo('2 · Gineco-obstétricos', '<div class="grid2">' + c.campo('fi-menarca', 'Menarca', 'años', '1') + campoT('fi-fum', 'Fecha de última menstruación', 'date') +
        c.campo('fi-ciclo', 'Duración del ciclo', 'días', '1') + c.sel('fi-ritmo', [['', 'Sin dato'], ['reg', 'Regular'], ['irr', 'Irregular']], 'Ritmo') +
        c.campo('fi-g', 'Gestas', '', '1') + c.campo('fi-p', 'Partos', '', '1') + c.campo('fi-c', 'Cesáreas', '', '1') + c.campo('fi-a', 'Abortos', '', '1') +
        c.campo('fi-ect', 'Ectópicos', '', '1') + c.campo('fi-perd', 'Pérdidas de embarazo', '', '1') + c.campo('fi-partoDias', 'Días desde el último parto (si es puérpera)', 'días', '1') +
        c.sel('fi-utero', [['si', 'Sí'], ['no', 'No (histerectomía)']], 'Útero') +
        c.sel('fi-metodo', [['', 'Ninguno o sin dato'], ['barrera', 'Barrera'], ['cu', 'DIU de cobre'], ['lng', 'DIU-LNG'], ['imp', 'Implante'], ['ampd', 'Inyectable trimestral'], ['pop', 'Píldora solo progestágeno'], ['ahc', 'Combinado']], 'Método actual') + '</div>' +
        c.chk('fi-lactancia', 'Lactancia') + c.chk('fi-meno', 'Posmenopausia (12 meses sin menstruación)') + c.chk('fi-deseo', 'Desea embarazo')) +
      c.grupo('3 · Tabaco', '<div class="grid2">' + c.campo('fi-cig', 'Cigarrillos por día', '', '1') + c.campo('fi-anosFuma', 'Años fumando', 'años', '1') + '</div><p class="ayuda">Paquetes-año = cigarrillos por día ÷ 20 × años.</p>') +
      c.grupo('4 · Antecedentes personales (con categoría MEC)', '<div class="grid2">' + MEC_COND.map(selMec).join('') + '</div>' +
        c.chk('fi-acne', 'Acné o hirsutismo') + c.chk('fi-endometriosis', 'Endometriosis') + c.chk('fi-depresion', 'Depresión')) +
      c.grupo('5 · Antecedentes familiares', c.chk('fi-famMama', 'Cáncer de mama') + c.chk('fi-famMamaJoven', 'Cáncer de mama antes de los 50 años o bilateral') + c.chk('fi-famOvario', 'Cáncer de ovario') +
        c.chk('fi-famColon', 'Cáncer de colon o endometrio') + c.chk('fi-brca', 'Mutación BRCA u otra conocida') + c.chk('fi-tevFam', 'Trombosis en familiar de primer grado') + c.chk('fi-dmFam', 'Diabetes en familiar de primer grado')) +
      '<div id="fi-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · US MEC 2024 · OMS MEC 2025 (notas) · NCCN 2025 (derivación genética) · OMS (IMC).</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var CAMPOS = [].slice.call(cont.querySelectorAll('[id^="fi-"]')).filter(function (e) { return /^(INPUT|SELECT)$/.test(e.tagName) && e.id !== 'fi-lista' && e.id !== 'fi-file'; });
    function volcar() {
      CAMPOS.forEach(function (e) { var k = e.id.slice(3), v = p.campos[k]; if (e.type === 'checkbox') e.checked = !!v; else e.value = v === undefined ? (k === 'id' ? p.id : (k === 'utero' ? 'si' : '')) : v; });
    }
    function leer() {
      CAMPOS.forEach(function (e) { var k = e.id.slice(3); p.campos[k] = e.type === 'checkbox' ? e.checked : e.value; });
      if (p.campos.id) p.id = p.campos.id;
      guardarS(p);
    }
    function msg(t) { cont.querySelector('#fi-msg').textContent = t; }
    function llenarLista() {
      var L = lista(), s = cont.querySelector('#fi-lista');
      s.innerHTML = '<option value="">' + (Object.keys(L).length ? 'Elegir…' : 'Sin pacientes guardadas') + '</option>' + Object.keys(L).sort().map(function (k) { return '<option value="' + k + '">' + k + ' · ' + (L[k].campos.edad ? L[k].campos.edad + ' años · ' : '') + (L[k].actualizada || L[k].creada) + '</option>'; }).join('');
    }
    function act() {
      leer();
      var r = derivar(p.campos), f = semaforo(p.campos, r), h = [];
      var orden = { rojo: 0, naranja: 1, ambar: 2, neutro: 3, verde: 4 };
      f.sort(function (a, b) { return orden[a.col] - orden[b.col]; });
      var peor = f.length ? f[0].col : 'verde';
      h.push(F('Semáforo de factores de riesgo', f.length ? '<ul class="lista">' + f.map(function (x) { return '<li><span class="fi-dot fi-' + x.col + '"></span> ' + x.t + '</li>'; }).join('') + '</ul>' : '<strong>Sin factores de riesgo cargados</strong>', '', peor === 'neutro' ? 'verde' : peor));
      if (w.GYN.mec && r.edad !== null) {
        var m = w.GYN.mec.calcular({ edad: r.edad, uso: 'iniciacion', sel: r.sel }), TM = T.mec;
        var li = w.GYN.mec.METODOS.map(function (k) {
          var x = m.metodos[k]; if (x.cat === null) return '';
          var txt = x.cat === 4 ? 'no puede' : x.cat === 3 ? 'no recomendado salvo sin alternativa' : x.cat === 2 ? 'puede, con control' : 'puede';
          return '<li><span class="fi-dot fi-' + (x.cat === 4 ? 'rojo' : x.cat === 3 ? 'ambar' : 'verde') + '"></span> ' + TM.metodos[k] + ': categoría ' + x.txt + ' · ' + txt + '</li>';
        }).join('');
        var ahc = m.metodos.ahc.cat, solo = ahc >= 3 && [m.metodos.pop.cat, m.metodos.imp.cat, m.metodos.lng.cat].some(function (z) { return z !== null && z <= 2; });
        h.push(F('Anticoncepción según la ficha (MEC, iniciación)', '<ul class="lista">' + li + '</ul>' + (solo ? '<p><strong>Combinados no indicados: usar solo progestágeno (DIU-LNG, implante o píldora) o DIU de cobre.</strong></p>' : ''), 'Detalle y más condiciones en el módulo Elegibilidad de métodos (MEC), que se precarga con esta ficha.', ahc === 4 ? 'rojo' : ahc === 3 ? 'ambar' : 'verde'));
      } else h.push(F('Anticoncepción según la ficha', 'Cargá la edad para ver la categoría MEC de cada método.', '', 'neutro'));
      var cons = Object.keys(p.consultas || {});
      if (cons.length) h.push(F('Consultas guardadas', c.ul(cons.map(function (k) { return '<a href="#' + k + '">' + k + '</a> · ' + p.consultas[k].fecha; })), 'Al abrir el módulo podés restaurar la última consulta.', 'neutro'));
      cont.querySelector('#fi-o').innerHTML = h.join('');
      w.dispatchEvent(new Event('gyn:ficha'));
    }
    function bloqueado() { if (w.GYN.licencia.esFull()) return false; w.GYN.licencia.abrir(); return true; }
    cont.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fi]'); if (!b) return;
      var a = b.getAttribute('data-fi');
      if (a === 'nueva') { p = vacia(); guardarS(p); volcar(); act(); msg('Ficha nueva: ' + p.id); return; }
      if (bloqueado()) return;
      if (a === 'guardar') { leer(); var L = lista(); p.actualizada = hoy(); L[p.id] = p; msg(guardarL(L) ? 'Paciente ' + p.id + ' guardada en este dispositivo.' : 'No se pudo guardar.'); llenarLista(); }
      if (a === 'exportar') { leer(); var blob = new Blob([JSON.stringify({ app: 'cavesal-gyn', version: 1, paciente: p }, null, 2)], { type: 'application/json' }); var u = URL.createObjectURL(blob), l = d.createElement('a'); l.href = u; l.download = p.id + '.json'; d.body.appendChild(l); l.click(); l.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000); msg('Archivo ' + p.id + '.json descargado.'); }
    });
    cont.querySelector('.fi-imp').addEventListener('click', function (e) { if (!w.GYN.licencia.esFull()) { e.preventDefault(); w.GYN.licencia.abrir(); } });
    cont.querySelector('#fi-file').addEventListener('change', function () {
      var fl = this.files && this.files[0]; if (!fl) return;
      var rd = new FileReader();
      rd.onload = function () { try { var o = JSON.parse(rd.result), q = o.paciente || o; if (!q.id || !q.campos) throw 0; p = q; p.consultas = p.consultas || {}; guardarS(p); var L = lista(); L[p.id] = p; guardarL(L); llenarLista(); volcar(); act(); msg('Paciente ' + p.id + ' importada.'); } catch (e) { msg('El archivo no es una ficha de CaVeSal® GYN.'); } };
      rd.readAsText(fl);
    });
    cont.querySelector('#fi-lista').addEventListener('change', function () {
      if (!this.value) return;
      if (bloqueado()) { this.value = ''; return; }
      var q = lista()[this.value]; if (!q) return;
      p = q; p.consultas = p.consultas || {}; guardarS(p); volcar(); act(); msg('Paciente ' + p.id + ' abierta.');
    });
    cont.addEventListener('input', function (e) { if (e.target.id !== 'fi-lista') act(); });
    cont.addEventListener('change', function (e) { if (e.target.id !== 'fi-lista' && e.target.id !== 'fi-file') act(); });
    if (full) llenarLista(); else cont.querySelector('#fi-lista').innerHTML = '<option value="">Versión completa</option>';
    volcar(); act();
  }

  // Ficha en el formato que usa el puente (mismas claves que la HC) + condiciones MEC directas.
  function comoHC() {
    var p = actual(); if (!p || !p.campos) return null;
    var c = p.campos, r = derivar(c), o = {};
    var tiene = Object.keys(c).some(function (k) { return k !== 'id' && k !== 'utero' && c[k] !== '' && c[k] !== false && c[k] !== undefined; });
    if (!tiene) return null;
    if (r.edad !== null) o.edad = r.edad;
    if (r.peso) o.peso = r.peso;
    if (r.talla) o.talla = r.talla;
    if (r.imc !== null) o.imc = r.imc;
    if (r.cig) { o.tabaco = true; o.cigDia = r.cig; }
    if (c.fum) o.fum = c.fum;
    if (n(c.ciclo)) o.ciclo = n(c.ciclo);
    if (c.ritmo) o.ritmo = c.ritmo === 'reg' ? 'Regular' : 'Irregular';
    if ((n(c.p) || 0) + (n(c.c) || 0) > 0) o.embPrevio = true;
    if (n(c.partoDias) !== null) { o.partoDias = n(c.partoDias); o.lactancia = !!c.lactancia; }
    if (c.m_hta) o.p_hta = true;
    if (c.m_diabetes && c.m_diabetes !== 'gestacional') o.p_dm = true;
    if (c.m_trombofilia || c.m_les === 'aaf') o.p_trombo = true;
    if (c.m_tev && c.m_tev !== 'familiar') o.p_tvp = true;
    if (c.m_cefalea === 'migranaCon') o.p_migrana_aura = true;
    if (c.m_cefalea === 'migranaSin') o.p_migrana_sinaura = true;
    if (c.m_epilepsia) o.p_epi = true;
    if (c.m_isquemica || c.m_acv) o.p_cardio = true;
    if (c.m_mama === 'actual') o.p_cancer_act = true;
    if (c.m_mama === 'previo5') o.p_cancer_prev = true;
    if (r.imc !== null && r.imc >= 30) o.p_obesidad = true;
    o.utero = c.utero || 'si';
    o.mecSel = r.sel;
    o.origen = 'ficha';
    return o;
  }

  // Consultas: valores de un módulo guardados en la ficha (solo versión completa).
  function capturar(id, cont) {
    var p = actual(); if (!p || !cont || !w.GYN.licencia.esFull()) return;
    var v = {}, k = 0;
    cont.querySelectorAll('input,select,textarea').forEach(function (e) {
      if (e.disabled || e.type === 'file') return;
      if (e.type === 'radio') { if (e.checked && e.name) { v['r:' + e.name + '=' + e.value] = true; k++; } return; }
      if (e.type === 'checkbox') { if (e.checked && e.id) { v['#' + e.id] = true; k++; } return; }
      if (e.value === '') return;
      if (e.getAttribute('data-cond')) { v['c:' + e.getAttribute('data-cond')] = e.value; k++; return; }
      if (e.id) { v['#' + e.id] = e.value; k++; }
    });
    if (!k) return;
    p.consultas = p.consultas || {}; p.consultas[id] = { fecha: hoy(), v: v }; guardarS(p);
    var L = lista(); if (L[p.id]) { L[p.id] = p; guardarL(L); }
  }
  function consulta(id) { var p = actual(); return p && p.consultas && p.consultas[id] ? p.consultas[id] : null; }
  function resumen() {
    var p = actual(); if (!p || !p.campos) return null;
    var r = derivar(p.campos), f = semaforo(p.campos, r);
    return { id: p.id, edad: r.edad, n: f.filter(function (x) { return x.col === 'rojo' || x.col === 'naranja'; }).length, total: f.length };
  }

  w.GYN = w.GYN || {};
  w.GYN.ficha = { render: render, actual: actual, comoHC: comoHC, derivar: derivar, semaforo: semaforo, capturar: capturar, consulta: consulta, resumen: resumen };
})(window, document);
