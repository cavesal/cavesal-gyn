/* CaVeSal® GYN · Eco ginecológica: reserva ovárica, ovario poliquístico, trompas (HSG / HyFoSy) y cavidad (histeroscopía).
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };

  // Reserva ovárica. Bologna (ESHRE 2011): RFA < 5-7 o AMH < 0,5-1,1 ng/mL = reserva baja.
  // ASRM 2024 (SHO): AMH > 3,4 ng/mL o RFA > 24 = riesgo de hiperrespuesta. ASRM 2020: no predicen la fertilidad espontánea.
  function reserva(d) {
    var r = { filas: [], conducta: [], color: 'verde' }, k = function (x) { return String(x).replace('.', ','); };
    if (d.rfa === null && d.amh === null) return null;
    var baja = false, alta = false;
    if (d.rfa !== null) {
      if (d.rfa < 5) { r.filas.push(['Recuento de folículos antrales', d.rfa + ': muy bajo (menos de 5)', 'rojo']); baja = true; }
      else if (d.rfa <= 7) { r.filas.push(['Recuento de folículos antrales', d.rfa + ': bajo (5 a 7)', 'naranja']); baja = true; }
      else if (d.rfa > 24) { r.filas.push(['Recuento de folículos antrales', d.rfa + ': alto (más de 24)', 'ambar']); alta = true; }
      else r.filas.push(['Recuento de folículos antrales', d.rfa + ': esperable (8 a 24)', 'verde']);
    }
    if (d.amh !== null) {
      if (d.amh < 0.5) { r.filas.push(['AMH', k(d.amh) + ' ng/mL: muy baja (menos de 0,5)', 'rojo']); baja = true; }
      else if (d.amh < 1.1) { r.filas.push(['AMH', k(d.amh) + ' ng/mL: baja (0,5 a 1,1)', 'naranja']); baja = true; }
      else if (d.amh > 3.4) { r.filas.push(['AMH', k(d.amh) + ' ng/mL: alta (más de 3,4)', 'ambar']); alta = true; }
      else r.filas.push(['AMH', k(d.amh) + ' ng/mL: esperable', 'verde']);
    }
    if (d.fsh !== null && d.fsh > 10) r.filas.push(['FSH día 2 a 3', k(d.fsh) + ' UI/L: elevada (más de 10), sugiere reserva disminuida; confirmar con estradiol basal menor de 80 pg/mL', 'naranja']);
    r.baja = baja; r.alta = alta;
    if (baja) {
      r.color = 'naranja';
      r.conducta.push('Reserva ovárica disminuida (criterios de Bologna): predice baja respuesta a la estimulación, no la fertilidad espontánea (ASRM 2020).');
      r.conducta.push(d.edad !== null && d.edad >= 35 ? 'Con 35 años o más: no demorar; derivar a reproducción asistida y discutir FIV.' : 'Derivar a reproducción para evaluar estimulación y, si no busca embarazo ahora, asesorar sobre preservación de la fertilidad.');
      r.conducta.push('Buscar causa si es joven: cirugía ovárica previa, endometriosis, quimioterapia o radioterapia, premutación FMR1, autoinmunidad.');
    }
    if (alta) {
      r.color = baja ? 'naranja' : 'ambar';
      r.conducta.push('Riesgo de hiperrespuesta y de síndrome de hiperestimulación ovárica (ASRM 2024): preferir letrozol, dosis bajas de gonadotropinas y control ecográfico estricto.');
      r.conducta.push('Descartar SOMP (ver el módulo SOMP y la pestaña de ovario poliquístico).');
    }
    if (!baja && !alta) r.conducta.push('Reserva esperable para la edad. Si busca embarazo, seguir el estudio de la pareja.');
    return r;
  }

  // Morfología de ovario poliquístico (SOMP 2023): ≥ 20 folículos de 2 a 9 mm por ovario con transductor ≥ 8 MHz,
  // o volumen ovárico ≥ 10 mL en al menos un ovario (sin cuerpo lúteo, quiste ni folículo dominante). AMH puede reemplazar la eco en adultas.
  // No usar la eco para el diagnóstico dentro de los 8 años de la menarca.
  function pcom(d) {
    if (d.fd === null && d.fi === null && d.vd === null && d.vi === null && !d.amhAlta) return null;
    var r = { criterios: [], color: 'verde', conducta: [] };
    if (d.menarca8) { r.adolescente = true; r.color = 'neutro'; r.conducta.push('Dentro de los 8 años posteriores a la menarca la ecografía no se usa para el diagnóstico (SOMP 2023): basarse en hiperandrogenismo y disfunción ovulatoria, y reevaluar más adelante.'); return r; }
    var maxF = Math.max(d.fd || 0, d.fi || 0), maxV = Math.max(d.vd || 0, d.vi || 0);
    if (d.dominante) r.conducta.push('Hay folículo dominante, cuerpo lúteo o quiste: el volumen no es válido; repetir la ecografía en fase folicular temprana.');
    if (d.mhz && maxF >= 20) r.criterios.push('20 o más folículos de 2 a 9 mm en un ovario (' + maxF + ')');
    if (!d.mhz && maxF >= 20) r.conducta.push('El recuento de 20 o más solo es válido con transductor de 8 MHz o más; con equipos de menor frecuencia usar el volumen.');
    if (!d.dominante && maxV >= 10) r.criterios.push('Volumen ovárico de 10 mL o más (' + maxV + ' mL)');
    if (d.amhAlta) r.criterios.push('AMH elevada para la edad según el laboratorio (puede reemplazar la ecografía en adultas)');
    r.mop = r.criterios.length > 0;
    r.color = r.mop ? 'ambar' : 'verde';
    if (r.mop) r.conducta.push('Morfología de ovario poliquístico presente: es un criterio de Rotterdam. Completar en el módulo SOMP (hiperandrogenismo, disfunción ovulatoria y exclusión de otras causas).');
    else r.conducta.push('Sin morfología de ovario poliquístico con los datos cargados.');
    return r;
  }

  // Trompas y cavidad: HSG o HyFoSy (equivalentes, FOAM: van Welie 2022), con conducta ASRM 2021 y 2015.
  function tubas(d) {
    if (!d.der && !d.izq && !d.cav) return null;
    var r = { filas: [], conducta: [], color: 'verde' }, L = { perm: 'permeable', prox: 'obstrucción proximal', dist: 'obstrucción distal', hidro: 'hidrosálpinx', ne: 'no evaluable' };
    if (d.der) r.filas.push('Trompa derecha: ' + L[d.der]);
    if (d.izq) r.filas.push('Trompa izquierda: ' + L[d.izq]);
    var obs = function (x) { return x === 'prox' || x === 'dist' || x === 'hidro'; };
    var bil = obs(d.der) && obs(d.izq), uni = (obs(d.der) || obs(d.izq)) && !bil, hidro = d.der === 'hidro' || d.izq === 'hidro';
    var proxBil = d.der === 'prox' && d.izq === 'prox';
    if (d.der === 'perm' && d.izq === 'perm') r.conducta.push('Ambas trompas permeables: seguir el estudio de la pareja (ovulación, semen) y la conducta según la causa.');
    if (uni) { r.color = 'ambar'; r.conducta.push('Obstrucción unilateral: no excluye el embarazo espontáneo ni la IIU con estimulación del lado permeable; si fracasa o hay otros factores, FIV.'); }
    if (proxBil) { r.color = 'naranja'; r.conducta.push('Obstrucción proximal bilateral: puede ser espasmo o tapón; confirmar (repetir, salpingografía selectiva o laparoscopía con cromotubación). Canalización tubaria selectiva o FIV.'); }
    else if (bil) { r.color = 'naranja'; r.conducta.push('Obstrucción bilateral: FIV como tratamiento de elección.'); }
    if (hidro) { r.color = 'naranja'; r.conducta.push('Hidrosálpinx: antes de la FIV, salpingectomía u oclusión tubaria proximal del lado afectado (mejora la tasa de nacidos vivos).'); }
    if (d.der === 'ne' || d.izq === 'ne') r.conducta.push('Trompa no evaluable: repetir el estudio o confirmar por laparoscopía con cromotubación si cambia la conducta.');
    if (d.cav === 'normal') r.filas.push('Cavidad uterina normal');
    if (d.cav === 'defecto') { r.filas.push('Defecto de llenado en la cavidad'); r.color = r.color === 'verde' ? 'ambar' : r.color; r.conducta.push('Defecto de llenado: histeroscopía diagnóstica y operatoria (pólipo, mioma submucoso, sinequias).'); }
    if (d.cav === 'anomalia') { r.filas.push('Forma anómala de la cavidad'); r.color = r.color === 'verde' ? 'ambar' : r.color; r.conducta.push('Sospecha de anomalía mülleriana: ecografía 3D o RM para clasificar (tabique, bicorne, unicorne) antes de decidir la histeroscopía.'); }
    if (d.estudio === 'hysfosy') r.filas.push('HyFoSy: concordancia con la HSG y resultados reproductivos equivalentes (estudio FOAM), sin radiación ni contraste yodado.');
    return r;
  }

  // Histeroscopía: hallazgo → conducta (AAGL 2012 pólipos; ASRM 2016 tabique; AAGL-ESGE 2017 sinequias).
  var HISTERO = {
    normal: ['Cavidad normal', 'Sin conducta histeroscópica. Seguir según el motivo del estudio.', 'verde'],
    polipo: ['Pólipo endometrial', 'Polipectomía histeroscópica si hay sangrado, infertilidad, posmenopausia, pólipo de 15 mm o más, o factores de riesgo; enviar a anatomía patológica. Pólipo pequeño asintomático en premenopausia: puede observarse.', 'ambar'],
    mioma: ['Mioma submucoso', 'Miomectomía histeroscópica en FIGO 0 y 1; FIGO 2 según tamaño y experiencia (puede requerir dos tiempos). Ver el módulo Útero.', 'ambar'],
    tabique: ['Tabique uterino', 'Metroplastia histeroscópica razonable en infertilidad o pérdida gestacional recurrente, luego de confirmar la anomalía con ecografía 3D o RM.', 'ambar'],
    sinequias: ['Sinequias (síndrome de Asherman)', 'Adhesiólisis histeroscópica con tijera; prevención de recurrencia (estrógenos, balón o gel según la evidencia disponible) y control histeroscópico posterior.', 'naranja'],
    endometritis: ['Sospecha de endometritis crónica', 'Biopsia con inmunohistoquímica para CD138 (células plasmáticas). Si se confirma: doxiciclina 100 mg cada 12 h por 14 días; la evidencia sobre el beneficio reproductivo es limitada.', 'ambar'],
    restos: ['Restos ovulares retenidos', 'Resección histeroscópica dirigida (menos sinequias que el legrado a ciegas).', 'ambar'],
    atipia: ['Endometrio de aspecto atípico o sospechoso', 'Biopsia dirigida obligatoria; si hay hiperplasia atípica o cáncer, ver los módulos de sangrado y estadificación.', 'rojo']
  };

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    cont.innerHTML =
      '<p class="ayuda">Elegí qué evaluar. Los hallazgos de masa anexial se clasifican en O-RADS e IOTA; los miomas y la adenomiosis, en el módulo Útero.</p>' +
      '<div class="form">' + c.sel('eg-modo', [['reserva', 'Reserva ovárica (RFA y AMH)'], ['pcom', 'Ovario poliquístico (morfología)'], ['tubas', 'Trompas y cavidad: HSG o HyFoSy'], ['histero', 'Histeroscopía: hallazgo y conducta']], 'Evaluar') + '</div>' +
      '<div id="eg-reserva" class="eg-p">' + c.grupo('Reserva ovárica', '<div class="grid2">' + c.campo('eg-edad', 'Edad', 'años', '1') + c.campo('eg-rfa', 'Recuento de folículos antrales (ambos ovarios, 2 a 10 mm)', 'n', '1') +
        c.campo('eg-amh', 'AMH', 'ng/mL', '0.01') + c.campo('eg-fsh', 'FSH día 2 a 3', 'UI/L', '0.1') + '</div>') + '</div>' +
      '<div id="eg-pcom" class="eg-p" hidden>' + c.grupo('Ovario poliquístico', '<div class="grid2">' + c.campo('eg-fd', 'Folículos de 2 a 9 mm, ovario derecho', 'n', '1') + c.campo('eg-fi', 'Folículos de 2 a 9 mm, ovario izquierdo', 'n', '1') +
        c.campo('eg-vd', 'Volumen ovario derecho', 'mL', '0.1') + c.campo('eg-vi', 'Volumen ovario izquierdo', 'mL', '0.1') + '</div>' +
        c.chk('eg-mhz', 'Transductor transvaginal de 8 MHz o más') + c.chk('eg-dom', 'Hay folículo dominante, cuerpo lúteo o quiste') + c.chk('eg-amha', 'AMH elevada para la edad según el laboratorio') + c.chk('eg-men', 'Menos de 8 años desde la menarca')) + '</div>' +
      '<div id="eg-tubas" class="eg-p" hidden>' + c.grupo('Trompas y cavidad', '<div class="grid2">' + c.sel('eg-est', [['hsg', 'Histerosalpingografía'], ['hysfosy', 'HyFoSy (histerosonografía con espuma)'], ['lap', 'Laparoscopía con cromotubación']], 'Estudio') +
        c.sel('eg-der', [['', 'Sin dato'], ['perm', 'Permeable'], ['prox', 'Obstrucción proximal'], ['dist', 'Obstrucción distal'], ['hidro', 'Hidrosálpinx'], ['ne', 'No evaluable']], 'Trompa derecha') +
        c.sel('eg-izq', [['', 'Sin dato'], ['perm', 'Permeable'], ['prox', 'Obstrucción proximal'], ['dist', 'Obstrucción distal'], ['hidro', 'Hidrosálpinx'], ['ne', 'No evaluable']], 'Trompa izquierda') +
        c.sel('eg-cav', [['', 'Sin dato'], ['normal', 'Normal'], ['defecto', 'Defecto de llenado'], ['anomalia', 'Forma anómala']], 'Cavidad') + '</div>' +
        '<p class="ayuda">Hacerlo entre los días 6 y 11 del ciclo, con β-hCG negativa y sin EPI activa.</p>') + '</div>' +
      '<div id="eg-histero" class="eg-p" hidden>' + c.grupo('Histeroscopía', c.sel('eg-hi', [['', 'Elegí'], ['normal', 'Normal'], ['polipo', 'Pólipo endometrial'], ['mioma', 'Mioma submucoso'], ['tabique', 'Tabique'], ['sinequias', 'Sinequias'], ['endometritis', 'Endometritis crónica (sospecha)'], ['restos', 'Restos ovulares'], ['atipia', 'Endometrio atípico o sospechoso']], 'Hallazgo')) + '</div>' +
      '<div id="eg-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ESHRE, criterios de Bologna 2011 · ASRM 2020 (pruebas de reserva ovárica) · ASRM 2024 (SHO) · Guía internacional SOMP 2023 · ASRM 2021 (evaluación de la infertilidad) · ASRM 2015 (hidrosálpinx) · van Welie N et al. Lancet 2022 (FOAM) · AAGL 2012 (pólipos) · ASRM 2016 (tabique) · AAGL-ESGE 2017 (sinequias)</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function act() {
      var m = L.v('eg-modo'), h = [];
      ['reserva', 'pcom', 'tubas', 'histero'].forEach(function (k) { q('#eg-' + k).hidden = k !== m; });
      var con = null;
      if (m === 'reserva') {
        var r = reserva({ edad: L.n('eg-edad'), rfa: L.n('eg-rfa'), amh: L.n('eg-amh'), fsh: L.n('eg-fsh') });
        if (!r) h.push(F('Reserva', 'Ingresá el recuento de folículos antrales o la AMH.', '', 'neutro'));
        else { r.filas.forEach(function (f) { h.push(F(f[0], f[1], '', f[2])); }); con = [r.conducta, r.color]; }
      } else if (m === 'pcom') {
        var p = pcom({ fd: L.n('eg-fd'), fi: L.n('eg-fi'), vd: L.n('eg-vd'), vi: L.n('eg-vi'), mhz: L.c('eg-mhz'), dominante: L.c('eg-dom'), amhAlta: L.c('eg-amha'), menarca8: L.c('eg-men') });
        if (!p) h.push(F('Ovario poliquístico', 'Ingresá los folículos o el volumen.', '', 'neutro'));
        else { if (!p.adolescente) h.push(F('Morfología de ovario poliquístico', '<strong>' + (p.mop ? 'Presente' : 'Ausente') + '</strong>' + (p.criterios.length ? c.ul(p.criterios) : ''), '', p.color)); con = [p.conducta, p.color]; }
      } else if (m === 'tubas') {
        var t = tubas({ estudio: L.v('eg-est'), der: L.v('eg-der'), izq: L.v('eg-izq'), cav: L.v('eg-cav') });
        if (!t) h.push(F('Trompas y cavidad', 'Cargá el resultado.', '', 'neutro'));
        else { h.push(F('Hallazgos', c.ul(t.filas), '', t.color)); con = [t.conducta, t.color]; }
      } else {
        var x = HISTERO[L.v('eg-hi')];
        if (!x) h.push(F('Histeroscopía', 'Elegí el hallazgo.', '', 'neutro'));
        else { h.push(F('Hallazgo', '<strong>' + x[0] + '</strong>', '', x[2])); con = [[x[1]], x[2]]; }
      }
      if (con && con[0].length) h.push(esFull ? F('Conducta', c.ul(con[0]), 'Sugerencia CaVeSal®.', con[1]) : opts.bloqueo('Conducta en la versión completa'));
      q('#eg-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.ecogin = { reserva: reserva, pcom: pcom, tubas: tubas, HISTERO: HISTERO, render: render };
})(window);
