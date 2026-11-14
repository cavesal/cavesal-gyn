/* CaVeSal® GYN · Amenorrea primaria y secundaria: definición, algoritmo diagnóstico, causa probable y conducta.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · ASRM Practice Committee, Current evaluation of amenorrhea (Fertil Steril 2008) ·
   ESHRE, Premature ovarian insufficiency (2016, actualización 2024) · Gordon CM et al., Functional hypothalamic amenorrhea, Endocrine Society (JCEM 2017).
   Los resultados hormonales se cargan como normal, alto o bajo según el laboratorio, salvo FSH (corte ESHRE de 25 UI/L).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  function definicion(d) {
    if (!d.menarca) {
      if (d.edad === null) return { tipo: null, txt: 'Cargá la edad.' };
      if (d.edad >= 15) return { tipo: 'primaria', txt: 'Amenorrea primaria: sin menarca a los 15 años' + (d.mamas ? ' con desarrollo mamario' : '') };
      if (d.edad >= 13 && !d.mamas) return { tipo: 'primaria', txt: 'Amenorrea primaria: sin menarca ni desarrollo mamario a los 13 años' };
      if (d.mamas && d.aniosTelarquia !== null && d.aniosTelarquia >= 3) return { tipo: 'primaria', txt: 'Amenorrea primaria: sin menarca 3 años después de la telarquia' };
      return { tipo: null, txt: 'Todavía no cumple la definición de amenorrea primaria. Controlar la progresión puberal.' };
    }
    if (d.meses === null) return { tipo: null, txt: 'Cargá los meses sin menstruación.' };
    var lim = d.irregPrev ? 6 : 3;
    if (d.meses >= lim) return { tipo: 'secundaria', txt: 'Amenorrea secundaria: ' + d.meses + ' meses sin menstruación (definición: ' + lim + ' meses con ciclos ' + (d.irregPrev ? 'irregulares' : 'regulares') + ' previos)' };
    return { tipo: null, txt: 'Todavía no cumple la definición de amenorrea secundaria (' + lim + ' meses). Si hay oligomenorrea, ver Sangrado uterino anormal o SOMP.' };
  }

  function primaria(d) {
    var r = { causa: '', pasos: [], conducta: [], color: 'ambar' };
    if (!d.mamas) {
      r.pasos.push('Sin desarrollo mamario: medir FSH y LH.');
      if (d.fsh === null) { r.causa = 'Hipogonadismo: completar FSH y LH'; return r; }
      if (d.fsh > 25) {
        r.causa = 'Hipogonadismo hipergonadotrófico (falla gonadal)'; r.color = 'rojo';
        r.pasos.push('FSH ' + d.fsh + ' UI/L: elevada. Pedir cariotipo.');
        if (d.cario === '45x') r.conducta.push('Síndrome de Turner (45,X o mosaico): evaluación cardiológica (ecocardiograma), renal, auditiva, tiroidea y metabólica; inducción puberal con estrógenos en dosis crecientes y luego progestágeno; consejería reproductiva (ovodonación).');
        else if (d.cario === '46xy') r.conducta.push('Disgenesia gonadal 46,XY (Swyer): gonadectomía por el riesgo de gonadoblastoma; inducción puberal y THM.');
        else if (d.cario === '46xx') r.conducta.push('Disgenesia gonadal 46,XX o insuficiencia ovárica temprana: inducción puberal y THM; estudiar premutación FMR1 y autoinmunidad.');
        else r.conducta.push('Cargá el cariotipo para precisar la causa (Turner, disgenesia 46,XX o 46,XY).');
      } else {
        r.causa = 'Hipogonadismo hipogonadotrófico'; r.pasos.push('FSH ' + d.fsh + ' UI/L: normal o baja (origen central).');
        if (d.anosmia) r.conducta.push('Anosmia o hiposmia: sospecha de síndrome de Kallmann; derivar a endocrinología.');
        r.conducta.push('Diferenciar retraso constitucional (talla y edad ósea acordes), causa funcional (peso bajo, ejercicio, estrés, enfermedad crónica) y lesión hipotálamo-hipofisaria: RMN de silla turca si no hay causa clara, cefalea o alteración visual.');
        r.conducta.push('Inducción puberal con estrógenos si no progresa espontáneamente.');
      }
      return r;
    }
    r.pasos.push('Con desarrollo mamario: evaluar la anatomía (examen y ecografía).');
    if (d.utero === 'no') {
      r.pasos.push('Útero ausente: pedir cariotipo y testosterona.');
      if (d.cario === '46xy' || d.testo === 'alto') { r.causa = 'Insensibilidad androgénica completa (46,XY, testosterona en rango masculino)'; r.color = 'rojo'; r.conducta.push('Gonadectomía después de la pubertad (riesgo de tumor gonadal), THM con estrógenos, dilatadores vaginales y apoyo psicológico.'); }
      else if (d.cario === '46xx' || d.testo === 'normal') { r.causa = 'Agenesia mülleriana (síndrome de MRKH)'; r.conducta.push('Evaluar malformaciones renales y esqueléticas; dilatadores vaginales de primera línea o neovagina quirúrgica; ovarios funcionantes (no requiere THM); opciones reproductivas: útero subrogado o trasplante uterino.'); }
      else r.causa = 'Útero ausente: completar cariotipo y testosterona (MRKH frente a insensibilidad androgénica)';
      return r;
    }
    if (d.utero === 'si') {
      if (d.obstruccion) { r.causa = 'Obstrucción del tracto de salida (himen imperforado o septo vaginal transverso)'; r.color = 'rojo'; r.conducta.push('Dolor cíclico o hematocolpos: corrección quirúrgica (himenotomía o resección del septo) en centro con experiencia.'); return r; }
      r.pasos.push('Útero presente sin obstrucción: estudiar como amenorrea secundaria (β-hCG, TSH, prolactina, FSH).');
      var s = secundaria(d); s.pasos = r.pasos.concat(s.pasos); return s;
    }
    r.causa = 'Indicá si el útero está presente en la ecografía'; return r;
  }

  function secundaria(d) {
    var r = { causa: '', pasos: [], conducta: [], color: 'ambar' };
    if (d.hcg === 'pos') { r.causa = 'Embarazo'; r.color = 'rojo'; r.pasos.push('β-hCG positiva.'); return r; }
    if (d.hcg !== 'neg') { r.causa = 'Primer paso: β-hCG'; r.pasos.push('Descartar embarazo antes de seguir.'); return r; }
    r.pasos.push('β-hCG negativa.');
    if (d.tsh === 'alto') { r.causa = 'Hipotiroidismo'; r.pasos.push('TSH elevada.'); r.conducta.push('Tratar el hipotiroidismo y reevaluar; puede elevar la prolactina de forma secundaria.'); return r; }
    if (d.tsh === 'bajo') { r.pasos.push('TSH baja: evaluar hipertiroidismo.'); }
    if (d.prl === 'alto') {
      r.causa = 'Hiperprolactinemia'; r.pasos.push('Prolactina elevada.');
      r.conducta.push('Repetir en ayunas y sin estrés; descartar fármacos (antipsicóticos, metoclopramida, antidepresivos), hipotiroidismo e insuficiencia renal.');
      r.conducta.push('Persistente sin causa: RMN de silla turca (adenoma). Agonista dopaminérgico (cabergolina) según endocrinología.');
      if (d.neuro) r.conducta.push('Cefalea o alteración visual: RMN y campo visual con prioridad.');
      return r;
    }
    if (d.fsh !== null && d.fsh > 25) {
      if (d.edad !== null && d.edad < 40) {
        r.causa = 'Insuficiencia ovárica prematura (IOP)'; r.color = 'rojo';
        r.pasos.push('FSH ' + d.fsh + ' UI/L (más de 25) con menos de 40 años.' + (d.fsh2 ? ' Confirmada en dos determinaciones con más de 4 semanas de diferencia.' : ' Repetir en 4 a 6 semanas para confirmar.'));
        r.conducta.push('Estudiar: cariotipo, premutación FMR1, anticuerpos anti-21-hidroxilasa (adrenal) y anti-TPO; antecedentes de quimio o radioterapia.');
        r.conducta.push('THM (o anticonceptivo combinado) hasta la edad de la menopausia natural, cerca de los 51 años, salvo contraindicación: protege hueso y sistema cardiovascular.');
        r.conducta.push('Densitometría ósea basal; consejería reproductiva (puede haber ovulaciones esporádicas; ovodonación).');
      } else { r.causa = 'Transición a la menopausia o menopausia'; r.pasos.push('FSH ' + d.fsh + ' UI/L con 40 años o más.'); r.conducta.push('Ver módulos MRS y Calculadora de THM. Entre 40 y 45 años se considera menopausia temprana.'); }
      return r;
    }
    if (d.asherman && d.ppTest === 'no' && d.epTest !== 'si') {
      r.causa = 'Sospecha de síndrome de Asherman (sinequias)'; r.pasos.push('Antecedente de legrado o cirugía uterina.');
      if (d.epTest === 'no') r.pasos.push('Sin sangrado con estrógeno-progestágeno: causa uterina confirmada.');
      r.conducta.push('Histeroscopía diagnóstica y adhesiólisis; luego estrógenos para regenerar el endometrio.');
      return r;
    }
    if (d.andro) { r.causa = 'Anovulación con hiperandrogenismo: SOMP probable'; r.pasos.push('Hiperandrogenismo clínico o bioquímico.'); r.conducta.push('Confirmar criterios y conducta en el módulo SOMP (descartar HSC no clásica con 17-OHP).'); return r; }
    if (d.ppTest === 'si') { r.causa = 'Anovulación con estrógenos presentes'; r.pasos.push('Sangró con la prueba de progestágeno: endometrio estrogenizado y tracto permeable.'); r.conducta.push('Causas: SOMP, obesidad, disfunción tiroidea leve. Progestágeno cíclico para proteger el endometrio o anticonceptivo combinado; inducción de ovulación si busca embarazo.'); return r; }
    if (d.ppTest === 'no') {
      r.pasos.push('No sangró con progestágeno: estrógenos bajos o causa uterina.');
      if (d.epTest === 'no') { r.causa = 'Causa uterina o del tracto de salida'; r.pasos.push('Tampoco sangró con estrógeno-progestágeno.'); r.conducta.push('Histeroscopía (Asherman) o evaluación de estenosis cervical.'); return r; }
      if (d.epTest === 'si' || d.e2 === 'bajo') {
        r.pasos.push(d.epTest === 'si' ? 'Sangró con estrógeno-progestágeno: falla de estrógenos.' : 'Estradiol bajo.');
        if (d.fsh === null) { r.causa = 'Hipoestrogenismo: medir FSH y LH'; return r; }
        r.causa = 'Amenorrea hipotalámica funcional o hipogonadismo central'; r.pasos.push('FSH ' + d.fsh + ' UI/L: normal o baja.');
        if (d.funcional) r.conducta.push('Causa funcional (peso bajo, ejercicio intenso, estrés, trastorno alimentario): corregir el balance energético, apoyo nutricional y psicológico; densitometría si dura más de 6 meses; estrógeno transdérmico con progestágeno si no recupera (no usar el anticonceptivo como primera opción para el hueso).');
        r.conducta.push('Sin causa funcional clara, con cefalea o alteración visual: RMN de silla turca.');
        return r;
      }
      r.causa = 'Completar prueba de estrógeno-progestágeno o estradiol'; return r;
    }
    r.causa = 'Siguiente paso: prueba de progestágeno';
    if (d.asherman) r.pasos.push('Antecedente de legrado o cirugía uterina: si no sangra con progestágeno ni con estrógeno-progestágeno, sospechar Asherman.');
    r.pasos.push('TSH y prolactina normales' + (d.fsh !== null ? ', FSH ' + d.fsh + ' UI/L' : '') + '.');
    r.conducta.push('Acetato de medroxiprogesterona 10 mg por día durante 7 a 10 días (o progesterona micronizada 200 mg por día por 10 a 12 días) y observar si hay sangrado en los 7 días siguientes.');
    return r;
  }

  function evaluar(d) {
    var def = definicion(d);
    var r = def.tipo === 'primaria' ? primaria(d) : def.tipo === 'secundaria' ? secundaria(d) : null;
    return { def: def, r: r };
  }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila;
    var HL = [['', 'Sin dato'], ['normal', 'Normal'], ['alto', 'Alto'], ['bajo', 'Bajo']];
    cont.innerHTML =
      '<p class="ayuda">Flujo: definición → β-hCG → TSH y prolactina → FSH → prueba de progestágeno → prueba de estrógeno-progestágeno → causa y conducta. En la primaria: desarrollo mamario y útero.</p>' +
      c.grupo('1 · Definición', '<div class="grid2">' + c.campo('am-edad', 'Edad', 'años', '1') + '</div>' +
        c.chk('am-men', 'Tuvo menarca') +
        '<div class="grid2">' + c.campo('am-meses', 'Meses sin menstruación', 'meses', '1') + '</div>' + c.chk('am-irr', 'Ciclos irregulares antes de la amenorrea') +
        c.chk('am-mam', 'Desarrollo mamario (Tanner M2 o más)') + '<div class="grid2">' + c.campo('am-tel', 'Años desde la telarquia', 'años') + '</div>') +
      c.grupo('2 · Laboratorio', '<div class="grid2">' + c.sel('am-hcg', [['', 'Sin dato'], ['neg', 'Negativa'], ['pos', 'Positiva']], 'β-hCG') + c.sel('am-tsh', HL, 'TSH') + c.sel('am-prl', HL, 'Prolactina') +
        c.campo('am-fsh', 'FSH', 'UI/L') + c.sel('am-e2', HL, 'Estradiol') + c.sel('am-testo', HL, 'Testosterona') + '</div>' + c.chk('am-fsh2', 'FSH elevada confirmada en dos determinaciones (más de 4 semanas)')) +
      c.grupo('3 · Pruebas y anatomía', '<div class="grid2">' + c.sel('am-pp', [['', 'No hecha'], ['si', 'Sangró'], ['no', 'No sangró']], 'Prueba de progestágeno') + c.sel('am-ep', [['', 'No hecha'], ['si', 'Sangró'], ['no', 'No sangró']], 'Prueba de estrógeno-progestágeno') +
        c.sel('am-ut', [['', 'Sin dato'], ['si', 'Presente'], ['no', 'Ausente']], 'Útero en la ecografía') + c.sel('am-cario', [['', 'Sin dato'], ['46xx', '46,XX'], ['46xy', '46,XY'], ['45x', '45,X o mosaico']], 'Cariotipo') + '</div>' +
        c.chk('am-obs', 'Dolor cíclico, hematocolpos, himen imperforado o septo vaginal') ) +
      c.grupo('4 · Clínica', c.chk('am-andro', 'Hiperandrogenismo (hirsutismo, acné, testosterona alta)') + c.chk('am-ash', 'Legrado o cirugía uterina previa') + c.chk('am-fun', 'Peso bajo, ejercicio intenso, estrés o trastorno alimentario') +
        c.chk('am-neuro', 'Cefalea, alteración visual o galactorrea') + c.chk('am-anos', 'Anosmia o hiposmia')) +
      '<div id="am-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · ASRM Practice Committee 2008 · ESHRE POI 2016/2024 · Endocrine Society 2017 (amenorrea hipotalámica funcional).</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function act() {
      var d = { edad: L.n('am-edad'), menarca: L.c('am-men'), meses: L.n('am-meses'), irregPrev: L.c('am-irr'), mamas: L.c('am-mam'), aniosTelarquia: L.n('am-tel'),
        hcg: L.v('am-hcg'), tsh: L.v('am-tsh'), prl: L.v('am-prl'), fsh: L.n('am-fsh'), fsh2: L.c('am-fsh2'), e2: L.v('am-e2'), testo: L.v('am-testo'),
        ppTest: L.v('am-pp'), epTest: L.v('am-ep'), utero: L.v('am-ut'), cario: L.v('am-cario'), obstruccion: L.c('am-obs'),
        andro: L.c('am-andro'), asherman: L.c('am-ash'), funcional: L.c('am-fun'), neuro: L.c('am-neuro'), anosmia: L.c('am-anos') };
      var e = evaluar(d), h = [];
      h.push(F('Definición', '<strong>' + e.def.txt + '</strong>', '', e.def.tipo ? 'ambar' : 'neutro'));
      if (e.r) {
        h.push(F('Algoritmo', c.ul(e.r.pasos), '', 'neutro'));
        if (!esFull) h.push(opts.bloqueo('Causa probable y conducta en la versión completa'));
        else {
          h.push(F('Causa probable', '<strong>' + e.r.causa + '</strong>', '', e.r.color));
          if (e.r.conducta.length) h.push(F('Conducta', c.ul(e.r.conducta), 'Sugerencia CaVeSal®.', e.r.color === 'rojo' ? 'naranja' : 'ambar'));
        }
      }
      cont.querySelector('#am-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.amenorrea = { definicion: definicion, evaluar: evaluar, render: render };
})(window);
