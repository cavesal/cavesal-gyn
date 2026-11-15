/* CaVeSal® GYN · Seguimiento de inducción de la ovulación: folículos, endometrio, hCG, cancelación y próximo control.
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  var NOMBRE = { letrozol: 'Letrozol', clomifeno: 'Clomifeno', gonadotropinas: 'Gonadotropinas (FSH o HMG)', combinado: 'Letrozol o clomifeno con gonadotropinas' };

  function lista(s) {
    return String(s || '').split(/[^0-9.,]+/).map(function (x) { return Number(x.replace(',', '.')); }).filter(function (x) { return isFinite(x) && x > 0 && x < 80; });
  }
  function sumarDias(fecha, n) {
    if (!fecha) return null;
    var p = fecha.split('-'); if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2] + n);
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
  }

  // d: { farmaco, der:'18, 14', izq:'', endo, e2, edad, somp, fecha, postHcg, persiste, ciclos, sinRespuesta, diaEst }
  function evaluar(d) {
    var F = w.GYN.fertilidad, esq = d.farmaco === 'combinado' ? 'gonadotropinas' : d.farmaco;
    var fol = lista(d.der).concat(lista(d.izq)).sort(function (a, b) { return b - a; });
    var r = { fol: fol, filas: [], conducta: [], color: 'neutro', hcg: null, cancelar: false };
    if (!d.farmaco) return null;
    if (d.postHcg) {
      if (d.persiste) { r.color = 'ambar'; r.hcg = 'luf'; r.conducta.push('Folículo que persiste sin colapsar y sin líquido libre 48 a 72 h después de la hCG: probable folículo luteinizado no roto (LUF). Confirmar con progesterona en fase lútea media; si se repite, considerar IIU con hCG en el ciclo siguiente o pasar a FIV.'); }
      else { r.color = 'verde'; r.hcg = 'ovulo'; r.conducta.push('Folículo colapsado o cuerpo lúteo visible: ovulación probable. Progesterona 7 días después de la hCG para confirmar; β-hCG 14 días después.'); }
      return r;
    }
    if (!fol.length) {
      r.color = 'neutro';
      if (d.sinRespuesta) { r.color = 'ambar'; r.conducta.push(d.farmaco === 'letrozol' ? 'Sin respuesta: subir el letrozol al ciclo siguiente (2,5 → 5 → 7,5 mg/día por 5 días).' : d.farmaco === 'clomifeno' ? 'Sin respuesta: subir el clomifeno al ciclo siguiente (50 → 100 → 150 mg/día por 5 días). Resistencia a 150 mg: pasar a letrozol o gonadotropinas.' : 'Sin respuesta con gonadotropinas: protocolo de dosis baja creciente (step-up), con aumentos de 37,5 UI luego de 7 días sin folículo de más de 10 mm.'); }
      else r.conducta.push('Cargá los folículos en mm (por ejemplo: 18, 14, 11).');
      return r;
    }
    var lead = fol[0], n10 = fol.filter(function (x) { return x >= 10; }).length, n14 = fol.filter(function (x) { return x >= 14; }).length, n16 = fol.filter(function (x) { return x >= 16; }).length;
    var n14mas = fol.filter(function (x) { return x > 14; }).length, inter = fol.filter(function (x) { return x > 10 && x < 16; }).length;
    r.lead = lead; r.n10 = n10; r.n14 = n14; r.n16 = n16;
    r.filas.push(['Folículos', fol.length + ' folículo(s) · líder ' + String(lead).replace('.', ',') + ' mm · de 10 mm o más: ' + n10 + ' · de 14 mm o más: ' + n14 + ' · de 16 mm o más: ' + n16, '', 'neutro']);
    var u = F.TRIGGER[esq], cl = F.clasificarFoliculo(esq, lead);
    // Cancelación por riesgo de embarazo múltiple (ASRM 2022: > 2 de 16 mm o más, o > 3 de 14 mm o más, en menores de 40).
    var motivos = [];
    if (n16 > 2) motivos.push('más de 2 folículos de 16 mm o más (ASRM 2022)');
    if (n14 > 3) motivos.push('más de 3 folículos de 14 mm o más (ASRM 2022)');
    if (d.somp && esq === 'gonadotropinas' && n14mas > 2) motivos.push('SOMP con gonadotropinas y más de 2 folículos de más de 14 mm (SOMP 2023)');
    if (esq === 'gonadotropinas' && n16 >= 1 && inter >= 3) motivos.push('3 o más folículos intermedios de más de 10 mm además del líder (ASRM 2020)');
    // SHO (ASRM 2024): > 17 folículos de más de 10 mm o estradiol > 3500 pg/mL.
    var sho = fol.filter(function (x) { return x > 10; }).length > 17 || (d.e2 !== null && d.e2 > 3500);
    if (sho) motivos.push('riesgo alto de síndrome de hiperestimulación (más de 17 folículos de más de 10 mm o estradiol mayor de 3500 pg/mL, ASRM 2024)');
    if (motivos.length) {
      r.cancelar = true; r.hcg = 'no'; r.color = 'rojo';
      r.filas.push(['hCG', '<strong>No aplicar hCG</strong>', '', 'rojo']);
      r.conducta.push('Cancelar el ciclo: ' + motivos.join('; ') + '.');
      r.conducta.push('Indicar abstinencia o preservativo hasta la menstruación. Alternativa con equipo de reproducción: aspiración de folículos excedentes o conversión a FIV con trigger con agonista de GnRH.');
      if (sho) r.conducta.push('Evaluar síntomas de hiperestimulación (ver el módulo SHO).');
      if (d.edad !== null && d.edad >= 40) r.conducta.push('En 40 años o más, el umbral de cancelación puede individualizarse (ASRM 2022).');
    } else if (cl === 'noAlcanza') {
      r.hcg = 'esperar'; r.color = 'ambar';
      var falta = u.rango[0] - lead, dias = Math.max(1, Math.min(4, Math.round(falta / 2)));
      if (lead < 10) dias = Math.max(dias, 3);
      r.filas.push(['hCG', 'Todavía no: el líder no llega a ' + u.rango[0] + ' mm (' + NOMBRE[d.farmaco] + ': ' + u.rango[0] + ' a ' + u.rango[1] + ' mm)', '', 'ambar']);
      r.dias = dias; r.proxima = sumarDias(d.fecha, dias);
      r.conducta.push('Próxima ecografía en ' + dias + ' día(s)' + (r.proxima ? ' (' + r.proxima + ')' : '') + '. Estimación con un crecimiento habitual del folículo dominante de 1,5 a 2 mm por día.');
      if (lead < 10 && d.diaEst !== null && d.diaEst >= 10) r.conducta.push('Sin folículo de 10 mm o más luego de 10 días de estimulación: respuesta pobre; valorar subir la dosis en el próximo ciclo.');
    } else if (cl === 'rango') {
      r.hcg = 'si'; r.color = 'verde';
      r.filas.push(['hCG', '<strong>Aplicar hCG</strong>: folículo líder en rango (' + u.rango[0] + ' a ' + u.rango[1] + ' mm para ' + NOMBRE[d.farmaco].toLowerCase() + ')', '', 'verde']);
      r.conducta.push('hCG recombinante 250 µg o urinaria 5000 a 10 000 UI. Relaciones o IIU a las 24 a 36 horas.');
    } else if (cl === 'tolerancia') {
      r.hcg = 'si'; r.color = 'ambar';
      r.filas.push(['hCG', '<strong>Aplicar hCG hoy</strong>: el líder supera el rango pero está dentro de la tolerancia (hasta ' + u.tolerancia + ' mm)', '', 'ambar']);
      r.conducta.push('No demorar: aplicar hoy y programar relaciones o IIU a las 24 a 36 horas.');
    } else {
      r.hcg = 'no'; r.color = 'naranja';
      r.filas.push(['hCG', '<strong>No aplicar hCG</strong>: folículo sobremadurado (más de ' + (u.tolerancia || u.rango[1]) + ' mm)', '', 'naranja']);
      r.conducta.push('Probable folículo persistente o quiste folicular: ciclo no útil. Control ecográfico al inicio del próximo ciclo; si persiste un quiste con estradiol elevado, postergar la nueva estimulación hasta su resolución.');
    }
    if (d.endo !== null) {
      if (d.endo < 7) { r.filas.push(['Endometrio', String(d.endo).replace('.', ',') + ' mm: delgado (menos de 7 mm), menor tasa de embarazo', '', 'ambar']); if (d.farmaco === 'clomifeno') r.conducta.push('Endometrio delgado con clomifeno (efecto antiestrogénico): considerar letrozol en el próximo ciclo.'); }
      else r.filas.push(['Endometrio', String(d.endo).replace('.', ',') + ' mm: adecuado', '', 'verde']);
    }
    if (d.ciclos !== null && d.ciclos >= 6 && !r.cancelar) r.conducta.push('Seis ciclos ovulatorios sin embarazo con el mismo fármaco: cambiar de estrategia (gonadotropinas, IIU o FIV) y completar el estudio de la pareja.');
    return r;
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    var hoy = new Date(), iso = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
    var tx = function (id, t) { return '<label class="campo"><span>' + t + '</span><input id="' + id + '" type="text" inputmode="decimal" placeholder="ej. 18, 14, 11"></label>'; };
    cont.innerHTML =
      c.grupo('Ciclo', '<div class="grid2">' + c.sel('in-f', [['', 'Elegí'], ['letrozol', 'Letrozol'], ['clomifeno', 'Clomifeno'], ['gonadotropinas', 'Gonadotropinas (FSH o HMG)'], ['combinado', 'Letrozol o clomifeno + gonadotropinas']], 'Fármaco de inducción') +
        '<label class="campo"><span>Fecha de esta ecografía</span><input id="in-fecha" type="date" value="' + iso + '"></label>' +
        c.campo('in-dia', 'Día de estimulación', 'día', '1') + c.campo('in-edad', 'Edad', 'años', '1') + c.campo('in-cic', 'Ciclos ovulatorios previos con este fármaco', 'n', '1') + '</div>' +
        c.chk('in-somp', 'SOMP')) +
      c.grupo('Ecografía de seguimiento', '<div class="grid2">' + tx('in-der', 'Folículos ovario derecho (mm)') + tx('in-izq', 'Folículos ovario izquierdo (mm)') +
        c.campo('in-endo', 'Endometrio', 'mm', '0.1') + c.campo('in-e2', 'Estradiol (opcional)', 'pg/mL', '1') + '</div>' +
        c.chk('in-sr', 'Sin respuesta al final del esquema')) +
      c.grupo('Después de la hCG', c.chk('in-post', 'Control 48 a 72 h después de la hCG') + c.chk('in-per', 'El folículo persiste sin colapsar y sin líquido libre')) +
      '<div id="in-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: umbrales de hCG del módulo Fertilidad (aprobados por el autor) · ASRM 2022 (gestación múltiple) · ASRM 2020 (gonadotropinas en anovulación) · ASRM 2024 (SHO) · Guía internacional SOMP 2023 · ASRM 2013 (clomifeno)</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function act() {
      var r = evaluar({ farmaco: L.v('in-f'), der: L.v('in-der'), izq: L.v('in-izq'), endo: L.n('in-endo'), e2: L.n('in-e2'), edad: L.n('in-edad'), somp: L.c('in-somp'), fecha: L.v('in-fecha'), postHcg: L.c('in-post'), persiste: L.c('in-per'), ciclos: L.n('in-cic'), sinRespuesta: L.c('in-sr'), diaEst: L.n('in-dia') });
      var h = [];
      if (!r) h.push(F('Inducción', 'Elegí el fármaco.', '', 'neutro'));
      else {
        r.filas.forEach(function (f) { h.push(F(f[0], f[1], f[2], f[3])); });
        if (r.conducta.length) h.push(esFull ? F('Conducta', c.ul(r.conducta), 'Sugerencia CaVeSal®.', r.color) : opts.bloqueo('hCG, cancelación y próximo control en la versión completa'));
      }
      q('#in-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.induccion = { evaluar: evaluar, lista: lista, render: render };
})(window);
