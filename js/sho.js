/* CaVeSal® GYN · Síndrome de hiperestimulación ovárica: riesgo, gravedad (RCOG), signos de alarma y conducta.
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };

  // Riesgo: ASRM 2024. Gravedad: RCOG Green-top 5 (2016).
  function evaluar(d) {
    var r = { riesgo: [], grado: null, criterios: [], conducta: [], alarma: [], color: 'verde' };
    if (d.amh !== null && d.amh > 3.4) r.riesgo.push('AMH mayor de 3,4 ng/mL');
    if (d.rfa !== null && d.rfa > 24) r.riesgo.push('Recuento de folículos antrales mayor de 24');
    if (d.somp) r.riesgo.push('SOMP');
    if (d.previo) r.riesgo.push('SHO previo');
    if (d.fol !== null && d.fol > 17) r.riesgo.push('Más de 17 folículos de más de 10 mm');
    if (d.e2 !== null && d.e2 > 3500) r.riesgo.push('Estradiol mayor de 3500 pg/mL');
    if (d.ovo !== null && d.ovo > 15) r.riesgo.push('Más de 15 ovocitos recuperados');
    var s = d.sint || {}, ov = d.ovario;
    var critico = s.tension || s.anuria || s.tev || s.sdra || (d.hto !== null && d.hto > 55) || (d.gb !== null && d.gb > 25000);
    var severo = s.ascitisCli || s.hidrotorax || s.oliguria || (d.hto !== null && d.hto > 45) || (d.na !== null && d.na < 135) || (d.k !== null && d.k > 5) || (d.alb !== null && d.alb < 3.5) || (ov !== null && ov > 12);
    var moderado = s.nauseas || s.ascitisEco || (ov !== null && ov >= 8);
    var leve = s.distension || s.dolor;
    if (critico) r.grado = 'Crítico'; else if (severo) r.grado = 'Severo'; else if (moderado) r.grado = 'Moderado'; else if (leve) r.grado = 'Leve';
    if (d.hto !== null) r.criterios.push('Hematocrito ' + String(d.hto).replace('.', ',') + ' %' + (d.hto > 55 ? ' (crítico, más de 55)' : d.hto > 45 ? ' (severo, más de 45)' : ''));
    if (d.gb !== null && d.gb > 25000) r.criterios.push('Leucocitos ' + d.gb + ' /mm³ (crítico, más de 25 000)');
    if (d.na !== null && d.na < 135) r.criterios.push('Sodio ' + d.na + ' mmol/L (hiponatremia)');
    if (d.k !== null && d.k > 5) r.criterios.push('Potasio ' + String(d.k).replace('.', ',') + ' mmol/L (hiperpotasemia)');
    if (d.alb !== null && d.alb < 3.5) r.criterios.push('Albúmina ' + String(d.alb).replace('.', ',') + ' g/dL (hipoproteinemia)');
    if (ov !== null) r.criterios.push('Ovario de ' + String(ov).replace('.', ',') + ' cm' + (ov > 12 ? ' (más de 12)' : ov >= 8 ? ' (8 a 12)' : ' (menos de 8)'));
    r.alarma = ['Dolor o distensión abdominal que aumenta', 'Falta de aire o dolor torácico', 'Orina escasa u oscura', 'Aumento de peso de 1 kg o más por día', 'Vómitos que impiden beber', 'Dolor o hinchazón de una pierna', 'Mareos o desmayo'];
    if (!r.grado) {
      r.color = r.riesgo.length ? 'ambar' : 'verde';
      if (r.riesgo.length) {
        r.conducta.push('Riesgo aumentado de SHO: en inducción de la ovulación, si hay más de 17 folículos de más de 10 mm o estradiol mayor de 3500 pg/mL, no aplicar hCG y cancelar el ciclo.');
        r.conducta.push('En FIV: protocolo con antagonista de GnRH, trigger con agonista de GnRH, criopreservar todos los embriones (freeze-all) y cabergolina desde el día del trigger (ASRM 2024). Metformina en SOMP.');
      } else r.conducta.push('Sin factores de riesgo ni síntomas cargados.');
      return r;
    }
    r.color = { Leve: 'ambar', Moderado: 'naranja', Severo: 'rojo', 'Crítico': 'rojo' }[r.grado];
    if (r.grado === 'Leve' || r.grado === 'Moderado') {
      r.conducta.push('Manejo ambulatorio con control cada 2 a 3 días: peso y perímetro abdominal diarios, balance de líquidos (beber según la sed, no forzar), paracetamol (evitar AINE), reposo relativo sin sexo con penetración.');
      r.conducta.push('Hemograma, hematocrito, ionograma, función renal y hepática; ecografía para ascitis y tamaño ovárico.');
      r.conducta.push('Evaluar tromboprofilaxis con HBPM según los factores de riesgo.');
    } else {
      r.conducta.push('Internación' + (r.grado === 'Crítico' ? ' en cuidados intensivos' : '') + ': balance hídrico estricto, diuresis horaria, cristaloides y albúmina si hay hipovolemia o hemoconcentración.');
      r.conducta.push('HBPM profiláctica hasta el alta y, si hay embarazo, hasta el final del primer trimestre (RCOG).');
      r.conducta.push('Paracentesis guiada por ecografía (abdominal o transvaginal) si hay ascitis a tensión, oliguria persistente o compromiso respiratorio; toracocentesis si hay hidrotórax.');
      r.conducta.push('Hemograma, ionograma, función renal y hepática, coagulación y gases diarios; no usar diuréticos con hipovolemia.');
      if (r.grado === 'Crítico') r.conducta.push('Criterio de cuidados intensivos: tromboembolia, SDRA, anuria o insuficiencia renal, hematocrito mayor de 55 % o leucocitos mayores de 25 000.');
    }
    if (d.embarazo) r.conducta.push('Con embarazo, el SHO tardío puede durar más y empeorar con el aumento de la hCG: seguimiento estrecho.');
    r.conducta.push('Descartar torsión anexial si el dolor es súbito y unilateral.');
    return r;
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    cont.innerHTML =
      c.grupo('Factores de riesgo', '<div class="grid2">' + c.campo('sh-amh', 'AMH', 'ng/mL', '0.01') + c.campo('sh-rfa', 'Recuento de folículos antrales', 'n', '1') + c.campo('sh-fol', 'Folículos de más de 10 mm', 'n', '1') + c.campo('sh-e2', 'Estradiol', 'pg/mL', '1') + c.campo('sh-ovo', 'Ovocitos recuperados (FIV)', 'n', '1') + '</div>' +
        c.chk('sh-somp', 'SOMP') + c.chk('sh-prev', 'SHO previo') + c.chk('sh-emb', 'Embarazo en curso')) +
      c.grupo('Síntomas y signos', c.chk('sh-dis', 'Distensión abdominal') + c.chk('sh-dol', 'Dolor abdominal') + c.chk('sh-nau', 'Náuseas o vómitos') + c.chk('sh-ae', 'Ascitis en la ecografía') + c.chk('sh-ac', 'Ascitis clínica') +
        c.chk('sh-hid', 'Hidrotórax') + c.chk('sh-oli', 'Oliguria') + c.chk('sh-ten', 'Ascitis a tensión o hidrotórax grande') + c.chk('sh-anu', 'Anuria') + c.chk('sh-tev', 'Tromboembolia') + c.chk('sh-sdra', 'SDRA') +
        '<div class="grid2">' + c.campo('sh-ov', 'Diámetro ovárico mayor', 'cm', '0.1') + '</div>') +
      c.grupo('Laboratorio', '<div class="grid2">' + c.campo('sh-hto', 'Hematocrito', '%', '0.1') + c.campo('sh-gb', 'Leucocitos', '/mm³', '1') + c.campo('sh-na', 'Sodio', 'mmol/L', '1') + c.campo('sh-k', 'Potasio', 'mmol/L', '0.1') + c.campo('sh-alb', 'Albúmina', 'g/dL', '0.1') + '</div>') +
      '<div id="sh-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: RCOG Green-top Guideline 5 (2016) · ASRM 2024 (prevención del SHO moderado y severo)</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function act() {
      var r = evaluar({ amh: L.n('sh-amh'), rfa: L.n('sh-rfa'), fol: L.n('sh-fol'), e2: L.n('sh-e2'), ovo: L.n('sh-ovo'), somp: L.c('sh-somp'), previo: L.c('sh-prev'), embarazo: L.c('sh-emb'), ovario: L.n('sh-ov'),
        hto: L.n('sh-hto'), gb: L.n('sh-gb'), na: L.n('sh-na'), k: L.n('sh-k'), alb: L.n('sh-alb'),
        sint: { distension: L.c('sh-dis'), dolor: L.c('sh-dol'), nauseas: L.c('sh-nau'), ascitisEco: L.c('sh-ae'), ascitisCli: L.c('sh-ac'), hidrotorax: L.c('sh-hid'), oliguria: L.c('sh-oli'), tension: L.c('sh-ten'), anuria: L.c('sh-anu'), tev: L.c('sh-tev'), sdra: L.c('sh-sdra') } });
      var h = [];
      h.push(F('Factores de riesgo', r.riesgo.length ? c.ul(r.riesgo) : 'Ninguno cargado.', '', r.riesgo.length ? 'ambar' : 'verde'));
      if (r.grado) h.push(F('Gravedad (RCOG)', '<strong>SHO ' + r.grado.toLowerCase() + '</strong>' + (r.criterios.length ? c.ul(r.criterios) : ''), '', r.color));
      h.push(esFull ? F('Conducta', c.ul(r.conducta), 'Sugerencia CaVeSal®.', r.color) : opts.bloqueo('Conducta e internación en la versión completa'));
      h.push(F('Signos de alarma: consultar de inmediato', c.ul(r.alarma), '', 'naranja'));
      q('#sh-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.sho = { evaluar: evaluar, render: render };
})(window);
