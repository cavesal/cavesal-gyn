/* CaVeSal® GYN · Puente HC → GYN (fase 1): recibe datos estructurados de la Historia Clínica CaVeSal®
   (sin nombre ni documento) y precarga MRS, MEC, THM, Incretinas y el semáforo preconcepcional.
   Fase 2: Incontinencia (Diario Miccional), IMC, Fertilidad (FUM y ciclo), SOMP, Pareja, Endometriosis (EFI),
   masa anexial y estudios (edad).
   Fase 3: Métodos anticonceptivos, Elección del progestágeno, Anticoncepción de emergencia, Ficha de la paciente,
   Densitometría y Sangrado uterino anormal.
   Solo precarga: cada dato queda editable y la conducta la sigue definiendo el profesional.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var KEY = 'cavesal_gyn_hc', datos = null, hcSolo = null;

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
  var origenHC = false;
  // Datos de la HC sobre los de la ficha de la paciente (la HC manda si ambos traen el mismo dato).
  function cargar() {
    var hc = null, fi = null;
    try { hc = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { hc = null; }
    try { fi = w.GYN && w.GYN.ficha ? w.GYN.ficha.comoHC() : null; } catch (e) { fi = null; }
    origenHC = !!hc; hcSolo = hc;
    if (!hc && !fi) { datos = null; return null; }
    datos = {};
    [fi, hc].forEach(function (o) { if (o) Object.keys(o).forEach(function (k) { datos[k] = o[k]; }); });
    return datos;
  }
  function descartar() { try { sessionStorage.removeItem(KEY); sessionStorage.removeItem(KEY + '_ficha'); } catch (e) {} datos = null; }

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
      if (d.mecSel) {
        // Ficha de la paciente: condiciones con código MEC directo.
        Object.keys(d.mecSel).forEach(function (k) { selCond(cont, k, d.mecSel[k]); });
        return '';
      }
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
      if (d.utero) fijar(cont.querySelector('#th-utero'), d.utero);
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
    },
    metodos: function (cont, d) {
      var falta = [], q = function (s) { return cont.querySelector(s); }, ms = d.mecSel || {};
      fijar(q('#mt-edad'), d.edad);
      // Lactancia
      if (ms.lactancia) fijar(q('#mt-lact'), ms.lactancia);
      else if (typeof d.partoDias === 'number' && d.lactancia === true) {
        var dd = d.partoDias; fijar(q('#mt-lact'), dd < 21 ? 'l21' : dd < 30 ? 'l21_30' : dd <= 42 ? 'l30_42' : 'l42');
      } else if (typeof d.partoDias === 'number' && d.lactancia === undefined) falta.push('posparto de ' + d.partoDias + ' días: indicar si hay lactancia');
      // Tabaco
      if (ms.tabaco) fijar(q('#mt-tab'), ms.tabaco);
      else if (d.tabaco) {
        if (d.edad !== undefined && d.edad < 35) fijar(q('#mt-tab'), 'menor35');
        else if (d.edad !== undefined && d.cigDia) fijar(q('#mt-tab'), d.cigDia >= 15 ? 'mayor35mas15' : 'mayor35menos15');
        else falta.push('cigarrillos por día (tabaquismo con 35 años o más)');
      }
      // HTA y TEV: la HC no informa el grado; la ficha sí.
      if (ms.hta) fijar(q('#mt-hta'), ms.hta); else if (d.p_hta) falta.push('grado de control de la hipertensión');
      if (ms.tev && q('#mt-tev option[value="' + ms.tev + '"]')) fijar(q('#mt-tev'), ms.tev);
      else if (d.p_tvp || d.p_tep) falta.push('tipo de trombosis o embolia previa (riesgo de recurrencia o anticoagulación)');
      fijar(q('#mt-aura'), d.p_migrana_aura || ms.cefalea === 'migranaCon');
      fijar(q('#mt-tro'), d.p_trombo || ms.trombofilia === 'si');
      fijar(q('#mt-aaf'), ms.les === 'aaf');
      fijar(q('#mt-mama'), ms.mama === 'actual');
      fijar(q('#mt-obe'), (d.imc !== undefined && d.imc >= 30) || d.p_obesidad);
      if (d.p_saf && ms.les !== 'aaf') falta.push('síndrome antifosfolípido: marcar si corresponde a lupus con anticuerpos antifosfolipídicos');
      if ((d.p_cancer_act || d.p_cancer_prev) && !ms.mama) falta.push('tipo de cáncer (marcar si es cáncer de mama actual)');
      if (d.p_dm) falta.push('diabetes: ver detalle en Elegibilidad de métodos (MEC)');
      if (d.p_cardio) falta.push('cardiopatía: ver detalle en Elegibilidad de métodos (MEC)');
      return falta.length ? 'Completar a mano: ' + falta.join('; ') + '.' : '';
    },
    progestagenos: function (cont, d) {
      var falta = [], q = function (s) { return cont.querySelector(s); };
      if (d.trh) fijar(q('#pg-uso'), 'thm');
      fijar(q('#pg-edad'), d.edad);
      fijar(q('#pg-sinut'), d.utero === 'no');
      fijar(q('#pg-hta'), d.p_hta);
      fijar(q('#pg-tev'), d.p_tvp || d.p_tep || d.p_trombo || d.p_saf);
      fijar(q('#pg-cmama'), d.mecSel && d.mecSel.mama === 'previo5');
      fijar(q('#pg-endo'), d.mecSel && d.mecSel.endometriosis === 'si');
      if ((d.p_cancer_prev || d.p_cancer_act) && !(d.mecSel && d.mecSel.mama)) falta.push('tipo de cáncer (marcar si es cáncer de mama previo)');
      if (d.utero === undefined) falta.push('útero conservado o histerectomía');
      var trh = d.trh ? 'En la HC figura terapia hormonal en curso' + (d.trhCual ? ' (' + esc(d.trhCual) + ')' : '') + '. ' : '';
      return trh + (falta.length ? 'Completar a mano: ' + falta.join('; ') + '.' : '');
    },
    aemergencia: function (cont, d) {
      if (d.peso === undefined && d.imc === undefined) return null;
      fijar(cont.querySelector('#ae-peso'), d.peso);
      fijar(cont.querySelector('#ae-imc'), d.imc);
      var n = ['Completar las horas desde la relación.'];
      if (d.lactancia === true) n.push('Lactancia en la HC.');
      if (d.p_epi) n.push('Epilepsia en la HC: marcar si usa inductores enzimáticos.');
      return n.join(' ');
    },
    ficha: function (cont, d) {
      var h = hcSolo; if (!h) return null; // la ficha solo se precarga desde la HC
      // No mezclar con una ficha que ya tiene datos de otra paciente.
      var ya = sessionStorage.getItem(KEY + '_ficha') === '1';
      if (!ya && w.GYN.ficha && w.GYN.ficha.comoHC()) return 'La ficha abierta ya tiene datos: no se mezcló con la HC. Abrí una ficha nueva para precargarla.';
      var q = function (s) { return cont.querySelector(s); }, falta = [];
      var vac = function (s, v) { var el = q(s); if (el && (el.type === 'checkbox' ? !el.checked : el.value === '')) fijar(el, v); };
      try { sessionStorage.setItem(KEY + '_ficha', '1'); } catch (e) {}
      vac('#fi-edad', h.edad); vac('#fi-peso', h.peso); vac('#fi-talla', h.talla);
      vac('#fi-fum', h.fum); vac('#fi-ciclo', h.ciclo);
      if (h.ritmo) vac('#fi-ritmo', h.ritmo === 'Regular' ? 'reg' : 'irr');
      if (typeof h.partoDias === 'number') { vac('#fi-partoDias', h.partoDias); if (h.lactancia === true) vac('#fi-lactancia', true); }
      if (h.p_trombo) vac('#fi-m_trombofilia', 'si');
      if (h.p_migrana_aura) vac('#fi-m_cefalea', 'migranaCon'); else if (h.p_migrana_sinaura) vac('#fi-m_cefalea', 'migranaSin');
      if (h.p_epi) vac('#fi-m_epilepsia', 'si');
      if (h.tabaco) falta.push('cigarrillos por día y años fumando');
      if (h.p_hta) falta.push('grado de control de la hipertensión');
      if (h.p_dm) falta.push('tipo de diabetes');
      if (h.p_tvp || h.p_tep) falta.push('tipo de trombosis o embolia');
      if (h.p_cardio) falta.push('cardiopatía isquémica o ACV');
      if (h.p_saf || h.p_ai) falta.push('lupus o enfermedad autoinmune');
      if (h.p_cancer_prev || h.p_cancer_act) falta.push('tipo de cáncer (enfermedad mamaria)');
      if (h.embPrevio) falta.push('gestas, partos, cesáreas y abortos');
      falta.push('código de la paciente (sin nombre)');
      return 'Completar a mano: ' + falta.join('; ') + '.';
    },
    densitometria: function (cont, d) {
      if (d.edad === undefined) return null;
      fijar(cont.querySelector('#dx-edad'), d.edad);
      var f = [];
      if (d.peso) f.push('peso ' + d.peso + ' kg');
      if (d.talla) f.push('talla ' + d.talla + ' cm');
      if (d.tabaco) f.push('tabaquismo actual');
      return f.length ? 'Para el FRAX, en la HC: ' + f.join(', ') + '.' : '';
    },
    hua: function (cont, d) {
      if (d.edad === undefined && !d.ciclo) return null;
      fijar(cont.querySelector('#hu-edad'), d.edad);
      fijar(cont.querySelector('#hu-frec'), d.ciclo);
      fijar(cont.querySelector('#hu-eso'), (d.imc !== undefined && d.imc >= 30) || d.p_obesidad);
      return d.ritmo === 'Irregular' ? 'Ritmo irregular en la HC: cargar la diferencia entre el ciclo más corto y el más largo.' : '';
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
    div.innerHTML = (origenHC ? '<strong>Datos recibidos de la HC CaVeSal®</strong> (sin datos personales)' : '<strong>Datos de la ficha de la paciente</strong>') + '. Se precargaron; revisalos antes de usar el resultado.' +
      (nota ? '<br>' + nota : '') + ' <button type="button" class="btn-sec" data-hc-descartar>' + (origenHC ? 'Descartar datos de la HC' : 'Ocultar aviso') + '</button>';
    cont.insertBefore(div, cont.firstChild);
    div.querySelector('[data-hc-descartar]').addEventListener('click', function () { if (origenHC) descartar(); div.remove(); });
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
