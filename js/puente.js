/* CaVeSal® GYN · Puente HC → GYN (fase 1): recibe datos estructurados de la Historia Clínica CaVeSal®
   (sin nombre ni documento) y precarga MRS, MEC, THM, Incretinas y el semáforo preconcepcional.
   Fase 2: Incontinencia (Diario Miccional), IMC, Fertilidad (FUM y ciclo), SOMP, Pareja, Endometriosis (EFI),
   masa anexial y estudios (edad).
   Solo precarga: cada dato queda editable y la conducta la sigue definiendo el profesional.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var KEY = 'cavesal_gyn_hc', datos = null;

  function leerUrl() {
    try {
      var p = new URLSearchParams(w.location.search), raw = p.get('import');
      if (!raw) return;
      var d = JSON.parse(decodeURIComponent(atob(raw)));
      if (d && d.origen === 'hc') sessionStorage.setItem(KEY, JSON.stringify(d));
      p.delete('import');
      var q = p.toString();
      w.history.replaceState(null, '', w.location.pathname + (q ? '?' + q : '') + w.location.hash);
    } catch (e) {}
  }
  function cargar() { try { datos = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { datos = null; } return datos; }
  function descartar() { try { sessionStorage.removeItem(KEY); } catch (e) {} datos = null; }

  function fijar(el, v) {
    if (!el || v === undefined || v === null || v === '') return false;
    if (el.type === 'checkbox' || el.type === 'radio') { if (!v) return false; el.checked = true; }
    else el.value = String(v);
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }
  function selCond(cont, k, v) { return fijar(cont.querySelector('select[data-cond="' + k + '"]'), v); }

  // Devuelve las notas de lo que falta completar a mano en cada módulo.
  var MOD = {
    mrs: function (cont, d) {
      if (!d.mrs || d.mrs.length !== 11) return null;
      // Orden HC: 3.º musculares y 4.º sueño; en GYN es al revés.
      var orden = [0, 1, 3, 2, 4, 5, 6, 7, 8, 9, 10];
      orden.forEach(function (iHc, iGyn) { fijar(cont.querySelector('input[name="m' + (iGyn + 1) + '"][value="' + d.mrs[iHc] + '"]'), true); });
      return 'Escala MRS del ' + (d.mrsFecha || 'último registro') + '.';
    },
    mec: function (cont, d) {
      var falta = [];
      fijar(cont.querySelector('#mc-edad'), d.edad);
      if (d.tabaco) { if (d.edad !== undefined && d.edad < 35) selCond(cont, 'tabaco', 'menor35'); else falta.push('cigarrillos por día (tabaquismo con 35 años o más)'); }
      if ((d.imc !== undefined && d.imc >= 30) || d.p_obesidad) selCond(cont, 'obesidad', d.edad !== undefined && d.edad < 18 ? 'imc30menor18' : 'imc30');
      if (d.p_trombo) selCond(cont, 'trombofilia', 'si');
      if (d.p_migrana_aura) selCond(cont, 'cefalea', 'migranaCon'); else if (d.p_migrana_sinaura) selCond(cont, 'cefalea', 'migranaSin');
      if (d.p_epi) selCond(cont, 'epilepsia', 'si');
      if (d.p_hta) falta.push('grado de control de la hipertensión');
      if (d.p_tvp || d.p_tep) falta.push('detalle de la trombosis o embolia (anticoagulación y riesgo de recurrencia)');
      if (d.p_dm) falta.push('tipo de diabetes y daño de órgano blanco');
      if (d.p_cardio) falta.push('tipo de cardiopatía');
      if (d.p_saf) falta.push('síndrome antifosfolípido (lupus con anticuerpos antifosfolípidos u otra condición)');
      if (d.p_cancer_prev || d.p_cancer_act) falta.push('tipo de cáncer');
      if (d.p_ai) falta.push('enfermedad autoinmune');
      if (typeof d.partoDias === 'number') {
        var dd = d.partoDias;
        if (d.lactancia === true) {
          if (dd < 21) selCond(cont, 'lactancia', 'l21');
          else if (dd < 30) selCond(cont, 'lactancia', 'l21_30');
          else if (dd <= 42) falta.push('lactancia de 30 a 42 días (' + dd + ' días): elegir según otros factores de riesgo de TEV');
          else selCond(cont, 'lactancia', 'l42');
        } else if (d.lactancia === false) {
          if (dd < 21) selCond(cont, 'posparto', 'p21');
          else if (dd <= 42) falta.push('posparto sin lactancia de 21 a 42 días (' + dd + ' días): elegir según otros factores de riesgo de TEV');
          else selCond(cont, 'posparto', 'p42');
        } else falta.push('posparto de ' + dd + ' días: indicar si hay lactancia');
      }
      return falta.length ? 'Completar a mano: ' + falta.join('; ') + '.' : '';
    },
    thm: function (cont, d) {
      fijar(cont.querySelector('#th-edad'), d.edad);
      fijar(cont.querySelector('#th-c-trombofilia'), d.p_trombo || d.p_saf);
      fijar(cont.querySelector('#th-p-obesidad'), (d.imc !== undefined && d.imc > 30) || d.p_obesidad);
      fijar(cont.querySelector('#th-p-hta'), d.p_hta);
      fijar(cont.querySelector('#th-p-tabaco'), d.tabaco);
      fijar(cont.querySelector('#th-p-migrana'), d.p_migrana_aura || d.p_migrana_sinaura);
      fijar(cont.querySelector('#th-p-riesgoTev'), d.p_tvp || d.p_tep);
      var falta = [];
      if (d.p_tvp || d.p_tep) falta.push('si la enfermedad tromboembólica está activa');
      if (d.p_cancer_prev || d.p_cancer_act) falta.push('si el cáncer es de mama o estrógeno-dependiente');
      if (d.p_cardio) falta.push('ACV o IAM previo');
      var trh = d.trh ? 'En la HC figura terapia hormonal en curso' + (d.trhCual ? ' (' + esc(d.trhCual) + ')' : '') + ': revisar indicación, vía, dosis y tiempo de uso. ' : '';
      return trh + (falta.length ? 'Completar a mano: ' + falta.join('; ') + '.' : '');
    },
    incretinas: function (cont, d) {
      fijar(cont.querySelector('#i-talla'), d.talla);
      fijar(cont.querySelector('#i-pa'), d.peso);
      return '';
    },
    preconcepcional: function (cont, d) {
      fijar(cont.querySelector('#s-edad'), d.edad);
      fijar(cont.querySelector('#s-peso'), d.peso);
      fijar(cont.querySelector('#s-talla'), d.talla);
      fijar(cont.querySelector('#s-dm'), d.p_dm);
      fijar(cont.querySelector('#s-epi'), d.p_epi);
      return '';
    },
    imc: function (cont, d) {
      if (!d.peso && !d.talla) return null;
      fijar(cont.querySelector('#imc-peso'), d.peso);
      fijar(cont.querySelector('#imc-talla'), d.talla);
      return '';
    },
    incontinencia: function (cont, d) {
      var x = d.diario, notas = [];
      fijar(cont.querySelector('#u-edad'), d.edad);
      fijar(cont.querySelector('#u-peso'), d.peso);
      fijar(cont.querySelector('#u-imc'), (d.imc !== undefined && d.imc >= 30) || d.p_obesidad);
      if (x) {
        fijar(cont.querySelector('#u-md'), x.micDia);
        fijar(cont.querySelector('#u-mn'), x.micNoche);
        fijar(cont.querySelector('#u-ue'), x.urg);
        fijar(cont.querySelector('#u-pu'), x.pUrg);
        fijar(cont.querySelector('#u-v24'), x.vol24);
        fijar(cont.querySelector('#u-vn'), x.volNoche);
        notas.push('Diario Miccional: promedio de ' + x.dias + (x.dias === 1 ? ' día' : ' días') + ' (' + esc(x.desde) + (x.dias > 1 ? ' a ' + esc(x.hasta) : '') + '). Noche = 22:00 a 05:59: ajustá si el horario de sueño es otro.');
        if (x.dias < 3) notas.push('Se recomiendan 3 días de registro.');
        if (x.vol24 === undefined) notas.push('Volúmenes no cargados: no todas las micciones tienen ml anotados.');
        if (x.pSinUrg) notas.push('Pérdidas sin urgencia: ' + x.pSinUrg + ' por día' + (x.actividades ? ' (' + x.actividades.map(esc).join('; ') + ')' : '') + '. Si fueron por esfuerzo, cargalas en "Pérdidas por esfuerzo".');
      } else notas.push('No hay Diario Miccional en la HC.');
      if (d.p_hta) notas.push('HTA en la HC: indicar si está controlada.');
      return notas.join(' ');
    },
    fertilidad: function (cont, d) {
      if (!d.fum && !d.ciclo) return null;
      fijar(cont.querySelector('#f-fum'), d.fum);
      fijar(cont.querySelector('#f-ciclo'), d.ciclo);
      return d.ciclo ? 'Ciclo: promedio de los últimos ciclos del registro de Kaltenbach.' : (d.ritmo ? 'Ritmo ' + esc(d.ritmo).toLowerCase() + ' en la HC: cargar la duración del ciclo.' : '');
    },
    somp: function (cont, d) {
      fijar(cont.querySelector('#so-peso'), d.peso);
      fijar(cont.querySelector('#so-talla'), d.talla);
      return cicloSel(cont, '#so-ciclo', d);
    },
    pareja: function (cont, d) {
      fijar(cont.querySelector('#pa-edad'), d.edad);
      return cicloSel(cont, '#pa-ciclo', d);
    },
    endometriosis: function (cont, d) {
      fijar(cont.querySelector('#f-edad'), d.edad);
      fijar(cont.querySelector('#f-emb'), d.embPrevio === true);
      return '';
    },
    orads: function (cont, d) { if (d.edad === undefined) return null; fijar(cont.querySelector('#a-edad'), d.edad); return ''; },
    estudios: function (cont, d) {
      if (d.edad === undefined) return null;
      ['#b-edad', '#c-edad', '#e-edad'].forEach(function (s) { fijar(cont.querySelector(s), d.edad); });
      return '';
    }
  };

  // Ritmo de la HC: "Regular" → regulares; "Irregular" no dice de qué tipo, se completa a mano.
  function cicloSel(cont, sel, d) {
    if (d.ritmo === 'Regular' && (!d.ciclo || (d.ciclo >= 21 && d.ciclo <= 35))) { fijar(cont.querySelector(sel), 'reg'); return ''; }
    if (d.ritmo || d.ciclo) return 'En la HC: ritmo ' + (d.ritmo ? esc(d.ritmo).toLowerCase() : 'sin dato') + (d.ciclo ? ', ciclo de ' + d.ciclo + ' días' : '') + '. Elegir el tipo de ciclo a mano.';
    return '';
  }

  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function aviso(cont, nota) {
    if (datos && datos.motivo) nota = 'Motivo de la última consulta ginecológica: ' + esc(datos.motivo) + '.' + (nota ? ' ' + nota : '');
    var div = document.createElement('div');
    div.className = 'fila neutro';
    div.style.marginBottom = '12px';
    div.innerHTML = '<strong>Datos recibidos de la HC CaVeSal®</strong> (sin datos personales). Se precargaron; revisalos antes de usar el resultado.' +
      (nota ? '<br>' + nota : '') + ' <button type="button" class="btn-sec" data-hc-descartar>Descartar datos de la HC</button>';
    cont.insertBefore(div, cont.firstChild);
    div.querySelector('[data-hc-descartar]').addEventListener('click', function () { descartar(); div.remove(); });
  }

  function aplicar(id, cont) {
    if (!cargar() || !MOD[id] || !cont) return;
    if (!cont.querySelector('input,select')) return; // módulo bloqueado
    var nota = MOD[id](cont, datos);
    if (nota === null) return;
    aviso(cont, nota);
  }

  leerUrl();
  w.GYN = w.GYN || {};
  w.GYN.puente = { aplicar: aplicar, cargar: cargar, descartar: descartar, MOD: MOD };
})(window);
