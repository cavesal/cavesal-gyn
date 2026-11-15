/* CaVeSal® GYN · Densitometría ósea: T-score, Z-score, FRAX y conducta.
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  function sn(v) { if (v === null || v === undefined || String(v).trim() === '') return null; var n = Number(String(v).replace(',', '.').replace('−', '-')); return isFinite(n) ? n : null; }

  // OMS 1994 / ISCD 2023: T-score en posmenopausia y varones ≥ 50; Z-score en premenopausia (≤ -2,0 = por debajo de lo esperado).
  // Tratamiento: BHOF 2022 / AACE 2020. Muy alto riesgo: AACE 2020. Tamizaje: USPSTF 2025.
  function evaluar(d) {
    var r = { filas: [], conducta: [], seguimiento: [], color: 'verde', clase: null };
    var ts = [d.tCol, d.tCue, d.tCad].filter(function (x) { return x !== null; });
    var usaZ = !d.post && (d.edad === null || d.edad < 50);
    if (d.edad !== null && d.post !== true && d.edad < 65) r.tamizaje = 'USPSTF 2025: tamizaje con DXA desde los 65 años y antes en posmenopáusicas con riesgo aumentado (FRAX, bajo peso, fractura previa, glucocorticoides, tabaquismo, alcohol).';
    if (!ts.length && d.z === null && !d.fxCad && !d.fxVert) return r.tamizaje ? { soloTamizaje: true, tamizaje: r.tamizaje } : null;
    var tmin = ts.length ? Math.min.apply(null, ts) : null;
    if (usaZ) {
      if (d.z !== null) {
        if (d.z <= -2) { r.clase = 'Densidad mineral ósea por debajo del rango esperado para la edad'; r.color = 'naranja'; r.conducta.push('Z-score de -2,0 o menos: no usar "osteoporosis" por densitometría sola en premenopausia (ISCD). Buscar causa secundaria: amenorrea hipotalámica, insuficiencia ovárica prematura, glucocorticoides, celiaquía, hipertiroidismo, hiperparatiroidismo, anorexia.'); }
        else { r.clase = 'Densidad mineral ósea dentro del rango esperado para la edad'; r.color = 'verde'; }
        r.filas.push(['Z-score', String(d.z).replace('.', ','), r.color]);
      } else r.filas.push(['Premenopausia', 'Usar el Z-score; el T-score no clasifica en menores de 50 años premenopáusicas.', 'neutro']);
      if (d.fxCad || d.fxVert) { r.color = 'rojo'; r.conducta.push('Fractura por fragilidad en premenopausia: derivar a metabolismo óseo y estudiar causas secundarias.'); }
      return r;
    }
    if (tmin !== null) {
      if (tmin <= -2.5) { r.clase = 'Osteoporosis'; r.color = 'rojo'; }
      else if (tmin < -1) { r.clase = 'Osteopenia (baja masa ósea)'; r.color = 'ambar'; }
      else { r.clase = 'Normal'; r.color = 'verde'; }
      r.filas.push(['T-score más bajo', String(tmin).replace('.', ',') + ' (columna, cuello femoral o cadera total)', r.color]);
    }
    var fx = d.fxCad || d.fxVert, frax = (d.fraxM !== null && d.fraxM >= 20) || (d.fraxC !== null && d.fraxC >= 3);
    if (fx && r.clase !== 'Osteoporosis') { r.clase = 'Osteoporosis (por fractura de cadera o vértebra por fragilidad)'; r.color = 'rojo'; }
    var tratar = fx || (tmin !== null && tmin <= -2.5) || (r.clase && r.clase.indexOf('Osteopenia') === 0 && frax);
    if (r.clase && r.clase.indexOf('Osteopenia') === 0) {
      if (d.fraxM === null && d.fraxC === null) r.filas.push(['FRAX', 'Calcular el FRAX a 10 años para decidir el tratamiento.', 'neutro']);
      else r.filas.push(['FRAX', 'Fractura mayor ' + (d.fraxM === null ? '—' : String(d.fraxM).replace('.', ',') + ' %') + ' · cadera ' + (d.fraxC === null ? '—' : String(d.fraxC).replace('.', ',') + ' %') + (frax ? ': supera el umbral (20 % o 3 %)' : ': por debajo del umbral'), frax ? 'naranja' : 'verde']);
    }
    var muyAlto = d.fxReciente || d.fxMult || (tmin !== null && tmin < -3) || (d.fraxM !== null && d.fraxM > 30) || (d.fraxC !== null && d.fraxC > 4.5) || (d.gc && fx);
    if (tratar) {
      r.conducta.push(muyAlto ? 'Muy alto riesgo de fractura (AACE 2020): considerar primero un anabólico (teriparatida, abaloparatida o romosozumab) y luego un antirresortivo; derivar a metabolismo óseo.' : 'Indicación de tratamiento farmacológico: bisfosfonato oral o intravenoso como primera línea; denosumab como alternativa (no suspender sin pasar a bisfosfonato).');
      r.conducta.push('Antes de tratar: calcio, 25-OH vitamina D, creatinina, fosfatasa alcalina; corregir la deficiencia de vitamina D. Control dental antes de bisfosfonato intravenoso o denosumab.');
      if (d.edad !== null && d.edad < 60) r.conducta.push('Menor de 60 años o menos de 10 años de menopausia con síntomas vasomotores: la THM previene fracturas y es una opción (ver la Calculadora de THM).');
    } else if (r.clase && r.clase.indexOf('Osteopenia') === 0) r.conducta.push('Osteopenia sin criterio de tratamiento: calcio dietario, vitamina D, ejercicio con carga y de equilibrio, evitar tabaco y alcohol, prevención de caídas.');
    else if (r.clase === 'Normal') r.conducta.push('Densidad normal: medidas generales.');
    if (d.ia) r.conducta.push('Inhibidores de aromatasa: DXA basal y cada 1 a 2 años; tratar con T-score de -2,0 o menos o con riesgo alto.');
    if (d.gc) r.conducta.push('Glucocorticoides (2,5 mg o más de prednisona por 3 meses o más): ajustar el FRAX hacia arriba y considerar tratamiento con osteopenia.');
    r.seguimiento.push(tratar ? 'DXA de control a 1 a 2 años de iniciado el tratamiento.' : (r.clase === 'Normal' ? 'Repetir DXA según riesgo, en general a los 5 años o más.' : 'Repetir DXA en 2 años.'));
    r.muyAlto = muyAlto; r.tratar = !!tratar; r.tmin = tmin;
    if (r.tamizaje) r.seguimiento.push(r.tamizaje);
    return r;
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    var tx = function (id, t) { return '<label class="campo"><span>' + t + '</span><input id="' + id + '" type="text" inputmode="decimal" placeholder="ej. -2,1"></label>'; };
    cont.innerHTML =
      c.grupo('Datos', '<div class="grid2">' + c.campo('dx-edad', 'Edad', 'años', '1') + c.sel('dx-post', [['si', 'Posmenopausia'], ['no', 'Premenopausia']], 'Estado menopáusico') + '</div>') +
      c.grupo('Densitometría (DXA)', '<div class="grid2">' + tx('dx-tcol', 'T-score columna lumbar') + tx('dx-tcue', 'T-score cuello femoral') + tx('dx-tcad', 'T-score cadera total') + tx('dx-z', 'Z-score (premenopausia)') + '</div>') +
      c.grupo('Fracturas y FRAX', c.chk('dx-fc', 'Fractura de cadera por fragilidad') + c.chk('dx-fv', 'Fractura vertebral (clínica o morfométrica)') + c.chk('dx-fr', 'Fractura en los últimos 12 meses') + c.chk('dx-fm', 'Fracturas múltiples') +
        '<div class="grid2">' + c.campo('dx-fxm', 'FRAX fractura mayor a 10 años', '%', '0.1') + c.campo('dx-fxc', 'FRAX cadera a 10 años', '%', '0.1') + '</div>') +
      c.grupo('Fármacos', c.chk('dx-gc', 'Glucocorticoides crónicos') + c.chk('dx-ia', 'Inhibidores de aromatasa')) +
      '<div id="dx-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: OMS 1994 (definición densitométrica) · ISCD Official Positions 2023 · BHOF Clinician\'s Guide 2022 · AACE/ACE 2020 · USPSTF 2025 · The Menopause Society 2022 (THM)</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); }, vs = function (id) { return sn(L.v(id)); };
    function act() {
      var r = evaluar({ edad: L.n('dx-edad'), post: L.v('dx-post') === 'si', tCol: vs('dx-tcol'), tCue: vs('dx-tcue'), tCad: vs('dx-tcad'), z: vs('dx-z'), fxCad: L.c('dx-fc'), fxVert: L.c('dx-fv'), fxReciente: L.c('dx-fr'), fxMult: L.c('dx-fm'), fraxM: L.n('dx-fxm'), fraxC: L.n('dx-fxc'), gc: L.c('dx-gc'), ia: L.c('dx-ia') });
      var h = [];
      if (!r) h.push(F('Densitometría', 'Ingresá el T-score o el Z-score.', '', 'neutro'));
      else if (r.soloTamizaje) h.push(F('Tamizaje', r.tamizaje, '', 'neutro'));
      else {
        if (r.clase) h.push(F('Clasificación', '<strong>' + r.clase + '</strong>', '', r.color));
        r.filas.forEach(function (f) { h.push(F(f[0], f[1], '', f[2])); });
        var con = r.conducta.concat(r.seguimiento || []);
        if (con.length) h.push(esFull ? F('Conducta', c.ul(con), 'Sugerencia CaVeSal®.', r.color) : opts.bloqueo('Conducta en la versión completa'));
      }
      q('#dx-o').innerHTML = h.join('');
      try { if (r && !r.soloTamizaje && r.tmin !== null && r.tmin !== undefined) localStorage.setItem('cavesal_gyn_dxa', JSON.stringify({ t: r.tmin, muyAlto: !!r.muyAlto, tratar: !!r.tratar })); } catch (e) {}
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.densitometria = { evaluar: evaluar, render: render };
})(window);
