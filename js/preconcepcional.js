/* CaVeSal® GYN · Preconcepcional: semáforo de riesgo (MSPBS 2022), ácido fólico y panel hormonal.
   Semáforo: tabla adaptada del Manual Nacional de Normas de Cuidados MSPBS 2022, p. 23; ambigüedades resueltas con
   OMS (IMC; anemia 2024) y ACOG/SMFM OCC 11 (edad). Ácido fólico: MSPBS 2022 · USPSTF 2023 · CDC · ACMG 2013/2020.
   Panel hormonal: Algoritmo propio CaVeSal® · Basado en: ASRM 2020 · ATA 2017 · Guía CaVeSal® "Perfil hormonal femenino en fertilidad".
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  // VALIDAR CON CARLOS: unidades.
  var UNIDADES = { fsh: 'mUI/mL', lh: 'mUI/mL', amh: 'ng/mL', tsh: 'µUI/mL', prl: 'ng/mL', p4: 'ng/mL' };
  var CAMPOS = [
    { id: 'fsh', nombre: 'FSH (día 2 a 5)' },
    { id: 'lh', nombre: 'LH (día 2 a 5)' },
    { id: 'amh', nombre: 'AMH' },
    { id: 'tsh', nombre: 'TSH' },
    { id: 'prl', nombre: 'Prolactina (día 2 a 5)' },
    { id: 'p4', nombre: 'Progesterona (día 21)' }
  ];

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = Number(String(v).replace(',', '.'));
    return isFinite(n) && n >= 0 ? n : null;
  }

  function fsh(v) {
    if (v < 8) return { etq: 'Óptima', color: 'verde' };
    if (v <= 10) return { etq: 'Límite superior del rango óptimo', color: 'ambar' };
    if (v <= 15) return { etq: 'Intermedia, sin categoría en la guía', color: 'ambar' };
    return { etq: 'Baja reserva ovárica', color: 'rojo' };
  }
  function relacion(lh, f) {
    if (lh === null || f === null || f === 0) return null;
    var r = lh / f;
    var o;
    if (r <= 2) o = { etq: 'No sugiere SOMP', color: 'verde' };
    else if (r <= 3) o = { etq: 'Zona de corte de la guía (">2-3")', color: 'ambar' };
    else o = { etq: 'Sugiere SOMP', color: 'rojo' };
    o.valor = Math.round(r * 10) / 10;
    if (r > 2) o.det = 'La relación LH/FSH no es criterio diagnóstico en la guía internacional 2023: confirmar con los criterios del módulo SOMP.';
    return o;
  }
  function amh(v) {
    if (v >= 1.2 && v <= 3.5) return { etq: 'Óptima', color: 'verde' };
    return { etq: 'Fuera del rango óptimo de la guía', color: 'ambar' };
  }
  function p4(v) {
    if (v >= 10) return { etq: 'Óptima', color: 'verde' };
    if (v > 3) return { etq: 'Confirma ovulación, pero por debajo del valor óptimo', color: 'ambar' };
    return { etq: 'No confirma ovulación', color: 'rojo' };
  }
  // TSH preconcepcional: misma tabla que el 1.er trimestre de las guías CaVeSal® (ATA 2017).
  // ctx: { levo: bool, fiv: bool, tpo: 'pos'|'neg'|'', lsup: límite superior del laboratorio (4,0 si no lo informa) }
  function tsh(v, ctx) {
    ctx = ctx || {};
    var ls = num(ctx.lsup) || 4.0, lsTxt = String(ls).replace('.', ',');
    if (ctx.levo) {
      if (v <= 2.5) return { etq: 'Con levotiroxina: dentro de la meta (hasta 2,5)', color: 'verde', det: 'Meta entre el límite inferior del laboratorio y 2,5. Al confirmar el embarazo, aumentar la dosis 25 a 30 %.' };
      return { etq: 'Con levotiroxina: por encima de la meta; ajustar la dosis antes de buscar embarazo', color: 'ambar', det: 'Meta entre el límite inferior del laboratorio y 2,5 (ATA 2017).' };
    }
    if (v <= 2.5) return { etq: 'Dentro de la meta (hasta 2,5)', color: 'verde', det: '' };
    if (v <= ls) {
      if (ctx.tpo === 'pos') return { etq: 'Anti-TPO positivo: considerar levotiroxina', color: 'ambar', det: 'TSH entre 2,5 y ' + lsTxt + ' con anti-TPO positivo (ATA 2017).' };
      if (ctx.tpo === 'neg') return { etq: 'Anti-TPO negativo: no tratar', color: 'verde', det: 'Repetir TSH al confirmar el embarazo.' };
      return { etq: 'Zona gris: pedir anti-TPO', color: 'ambar', det: 'Si es positivo, considerar levotiroxina. El anti-TPO no es universal: se pide en esta zona.' };
    }
    if (ctx.fiv) return { etq: 'Hipotiroidismo subclínico en FIV/ICSI: levotiroxina, meta menor de 2,5', color: 'rojo', det: 'ATA 2017, recomendación 20.' };
    if (ctx.tpo === 'pos' || v >= 10) return { etq: 'Sobre el rango: levotiroxina recomendada antes de buscar embarazo', color: 'rojo', det: v >= 10 ? 'TSH de 10 o más.' : 'Anti-TPO positivo con TSH sobre el rango.' };
    if (ctx.tpo === 'neg') return { etq: 'Sobre el rango con anti-TPO negativo: considerar levotiroxina', color: 'ambar', det: 'TSH entre ' + lsTxt + ' y 10 (ATA 2017).' };
    return { etq: 'Sobre el rango: pedir anti-TPO', color: 'ambar', det: 'Positivo: levotiroxina recomendada. Negativo: considerar levotiroxina (TSH menor de 10).' };
  }
  function prl(v) {
    if (v < 20) return { etq: 'Normal', color: 'verde' };
    if (v <= 25) return { etq: 'Límite', color: 'ambar' };
    return { etq: 'Elevada', color: 'rojo' };
  }

  /* ---------- Anti-Tg y alertas autoinmunes/trombofilia ---------- */
  function antiTg(v, tpo) {
    if (v !== 'pos') return null;
    return { etq: 'Anti-Tg positivo: autoinmunidad tiroidea', color: 'ambar', det: 'La decisión de levotiroxina de la ATA 2017 se basa en anti-TPO' + (tpo ? '' : ' (pedirlo si falta)') + '. Controlar TSH al confirmar el embarazo.' };
  }
  var AUTO = [
    { id: 'les', txt: 'Lupus eritematoso sistémico' },
    { id: 'safo', txt: 'SAF obstétrico (sin trombosis)' },
    { id: 'saft', txt: 'SAF trombótico' },
    { id: 'apl', txt: 'Anticuerpos antifosfolípidos positivos sin criterios clínicos' },
    { id: 'tev', txt: 'Trombosis venosa o embolia previa' },
    { id: 'trf', txt: 'Trombofilia hereditaria conocida o familiar de primer grado con trombofilia de alto riesgo' }
  ];
  // a: {les, safo, saft, apl, tev, trf}
  function autoinmune(a) {
    var r = [];
    if (a.les) r.push({ t: 'Lupus', color: 'rojo', txt: ['Planificar con lupus inactivo o de baja actividad al menos 6 meses, con medicación compatible (ACR 2020).', 'Continuar o iniciar hidroxicloroquina.', 'Suspender micofenolato 6 semanas o más antes, metotrexato 1 a 3 meses antes y ciclofosfamida 3 meses antes.', 'Pedir anticuerpos antifosfolípidos y anti-Ro/La; función renal y proteinuria.', 'Aspirina en dosis baja desde el primer trimestre, idealmente desde las 12 semanas (ACR 2020, SMFM #64).', 'Consejería con medicina materno-fetal y reumatología. Ver guía «Lupus eritematoso sistémico — Planificación preconcepcional».'] });
    if (a.saft) r.push({ t: 'SAF trombótico', color: 'rojo', txt: ['Heparina en dosis terapéutica en el embarazo; cambiar warfarina por heparina antes de la semana 6 (ACR 2020, SMFM #64).', 'Aspirina en dosis baja. Ver guía «Síndrome Antifosfolipídico (SAAF) y trombofilias».'] });
    else if (a.safo) r.push({ t: 'SAF obstétrico', color: 'rojo', txt: ['Aspirina en dosis baja + heparina profiláctica en el embarazo y el puerperio (ACR 2020, SMFM #64).', 'Ver guía «Síndrome Antifosfolipídico (SAAF) y trombofilias».'] });
    else if (a.apl) r.push({ t: 'aPL sin criterios', color: 'ambar', txt: ['Aspirina en dosis baja en el embarazo (ACR 2020).'] });
    if (a.tev || a.trf) r.push({ t: 'Trombofilia', color: 'ambar', txt: ['Estudiar trombofilias solo con TEV personal o familiar de primer grado con trombofilia de alto riesgo (ACOG PB 197); no de rutina en infertilidad (ASRM 2026). No pedir MTHFR.', 'Tromboprofilaxis según el riesgo: derivar a medicina materno-fetal o hematología.'] });
    return r;
  }
  var INTERP = { fsh: fsh, amh: amh, tsh: tsh, prl: prl, p4: p4 };

  /* ---------- Semáforo de riesgo preconcepcional (MSPBS 2022) ---------- */
  var ROJO = [
    { id: 'quim', txt: 'Expuesta a químicos o radiación' },
    { id: 'its', txt: 'ITS activa sin tratamiento (incluye VIH, Zika, hepatitis B)' },
    { id: 'enfsc', txt: 'Enfermedad previa sin control' },
    { id: 'toxicos', txt: 'Consume alcohol, tabaco o drogas' },
    { id: 'violencia', txt: 'Violencia o maltrato anterior o actual' },
    { id: 'malf', txt: 'Malformación congénita mayor previa por enfermedad crónica materna no controlada (epilepsia, lupus, diabetes)' }
  ];
  var AMARILLO = [
    { id: 'enfc', txt: 'Enfermedad previa controlada' },
    { id: 'bucal', txt: 'Problemas de salud bucal' },
    { id: 'obst', txt: 'Muerte perinatal, bajo peso al nacer, prematuro o abortos previos' },
    { id: 'parejas', txt: 'Parejas sexuales múltiples sin protección' },
    { id: 'itst', txt: 'ITS con tratamiento' },
    { id: 'hie', txt: 'HIE o diabetes gestacional previas, hemorragia o complicaciones del parto o puerperio' },
    { id: 'rh', txt: 'Rh sensibilizada' }
  ];
  var CONDUCTA = {
    rojo: ['Orientar sobre planificación familiar: riesgos e importancia de posponer el embarazo o no embarazarse', 'Tratar si es posible o trasladar si es necesario; controlar la enfermedad previa', 'Consejería alimentaria y nutricional', 'Anemia: buscar la causa y tratar con hierro', 'Malformaciones congénitas mayores previas: asegurar consejería genética', 'Desparasitar con albendazol', 'Drogas, alcohol o tabaco: manejo y consejería', 'Violencia: contención, protocolo y denuncia; dar intervención a otras instituciones', 'ITS, VIH, Zika o hepatitis B: tratar según los protocolos nacionales', 'Higiene bucodental y personal'],
    amarillo: ['Hierro y ácido fólico (ver dosis)', 'Desparasitar con albendazol', 'Profilaxis y tratamiento bucodental', 'Estilos de vida saludables y consejería alimentaria', 'Prevención de cáncer de mama y de cuello uterino', 'Planificación familiar', 'ITS: tratar según protocolos y orientar sobre prevención', 'Actualizar vacunas'],
    verde: ['Ácido fólico (ver dosis)', 'Planificación familiar; prevención de ITS, VIH y Zika', 'Higiene bucodental y personal; tratamiento bucodental si hace falta', 'Prevención de cáncer de mama y de cuello uterino', 'Estilos de vida saludables para ambos: nutrición, ejercicio, evitar tóxicos, drogas e infecciones', 'Vacunas al día']
  };
  var NOMBRE = { rojo: 'No se recomienda o se recomienda posponer el embarazo', amarillo: 'En condiciones de embarazarse con factores de riesgo', verde: 'En condiciones de embarazarse', incompleto: 'Sin datos suficientes para clasificar' };

  function imc(peso, talla) {
    var p = num(peso), t = num(talla);
    if (!p || !t) return null;
    if (t > 3) t = t / 100;
    return Math.round(p / (t * t) * 10) / 10;
  }
  function claseOMS(i) {
    if (i < 18.5) return 'Bajo peso';
    if (i < 25) return 'Normal';
    if (i < 30) return 'Sobrepeso';
    if (i < 35) return 'Obesidad clase I';
    if (i < 40) return 'Obesidad clase II';
    return 'Obesidad clase III';
  }

  // d: { edad, peso, talla, hb, palidez: 'no'|'moderada'|'intensa', sifilis: 'nr'|'trat'|'activa'|'', vih: idem, rojo: {id:bool}, amarillo: {id:bool} }
  function semaforo(d) {
    var m = [], faltan = [], rojo = false, amar = false;
    function add(txt, c, nota) { m.push({ txt: txt, color: c, nota: nota || '' }); if (c === 'rojo') rojo = true; if (c === 'amarillo') amar = true; }
    var e = num(d.edad);
    if (e === null) faltan.push('edad');
    else if (e < 20) add('Menor de 20 años', 'rojo');
    else if (e >= 35) add('35 años o más', 'amarillo', 'El MSPBS pone 35 en verde y en amarillo; se toma 35 como amarillo (ACOG/SMFM 2022): baja la fertilidad y sube el riesgo genético.');
    var i = imc(d.peso, d.talla);
    if (i === null) faltan.push('IMC');
    else if (i < 18.5) add('IMC ' + String(i).replace('.', ',') + ' (bajo peso)', 'rojo');
    else if (i >= 30) add('IMC ' + String(i).replace('.', ',') + ' (' + claseOMS(i) + ')', 'rojo', 'El MSPBS pone toda la obesidad (30 o más) en rojo; la OMS la divide en clases I, II y III.');
    else if (i >= 25) add('IMC ' + String(i).replace('.', ',') + ' (sobrepeso)', 'amarillo');
    var hb = num(d.hb);
    if (hb === null) faltan.push('hemoglobina');
    else if (hb < 7) add('Hb ' + String(hb).replace('.', ',') + ' g/dL', 'rojo', 'OMS 2024: anemia grave por debajo de 8 en la mujer no embarazada; el MSPBS pone el rojo por debajo de 7.');
    else if (hb < 11) add('Hb ' + String(hb).replace('.', ',') + ' g/dL (anemia)', 'amarillo', hb < 8 ? 'OMS 2024: anemia grave (menor de 8). El MSPBS la clasifica en amarillo.' : '');
    else if (hb < 12) add('Hb ' + String(hb).replace('.', ',') + ' g/dL (anemia leve)', 'amarillo', 'El MSPBS no da color entre 11 y 12; la OMS 2024 la define como anemia leve en la mujer no embarazada (11 a 11,9).');
    if (d.palidez === 'intensa') add('Palidez palmar intensa', 'rojo');
    else if (d.palidez === 'moderada') add('Palidez palmar moderada', 'amarillo');
    [['sifilis', 'Sífilis'], ['vih', 'VIH']].forEach(function (s) {
      var v = d[s[0]];
      if (!v) faltan.push(s[1].toLowerCase());
      else if (v === 'activa') add(s[1] + ' reactiva sin tratamiento', 'rojo');
      else if (v === 'trat') add(s[1] + ' reactiva con tratamiento', 'amarillo');
    });
    ROJO.forEach(function (c) { if (d.rojo && d.rojo[c.id]) add(c.txt, 'rojo'); });
    AMARILLO.forEach(function (c) { if (d.amarillo && d.amarillo[c.id]) add(c.txt, 'amarillo'); });
    var color = rojo ? 'rojo' : amar ? 'amarillo' : faltan.length ? 'incompleto' : 'verde';
    return { color: color, nombre: NOMBRE[color], motivos: m, faltan: faltan, imc: i, clase: i === null ? '' : claseOMS(i), conducta: CONDUCTA[color] || [] };
  }

  /* ---------- Ácido fólico ---------- */
  // f: { color, dtn, dm, epi, imc, mthfr }
  function acidoFolico(f) {
    var CUANDO = 'Desde 3 meses antes de dejar el anticonceptivo o de buscar el embarazo, hasta el 3.er mes de gestación (MSPBS). Como mínimo, 1 mes antes (USPSTF 2023).';
    var r;
    if (f.dtn) r = { dosis: '5 mg/día', color: 'rojo', motivo: 'Defecto del tubo neural previo (propio, de un hijo o de la pareja)', fuente: 'MSPBS 2022 · NICE/RCOG. ACOG/CDC: 4 mg/día.' };
    else if (f.dm || f.epi || (f.imc !== null && f.imc !== undefined && f.imc >= 30)) r = { dosis: '5 mg/día', color: 'ambar', motivo: [f.dm ? 'diabetes' : '', f.epi ? 'epilepsia o anticonvulsivantes' : '', f.imc >= 30 ? 'IMC de 30 o más' : ''].filter(Boolean).join(', ').replace(/^./, function (c) { return c.toUpperCase(); }), fuente: 'NICE/RCOG: 5 mg/día. ACOG/CDC: 4 mg/día. Guía CaVeSal® de cribado preconcepcional.' };
    else if (f.color === 'amarillo') r = { dosis: '5 mg/día con hierro', color: 'ambar', motivo: 'Semáforo amarillo', fuente: 'MSPBS 2022. Las guías internacionales reservan la dosis alta para DTN previo, diabetes, obesidad o epilepsia; con el resto de los factores amarillos indican 0,4 mg/día (USPSTF 2023).' };
    else r = { dosis: '0,4 mg/día', color: 'verde', motivo: f.color === 'rojo' ? 'Semáforo rojo sin DTN previo: dosis estándar al planificar' : 'Dosis estándar', fuente: 'MSPBS 2022 (verde) · USPSTF 2023: 0,4 a 0,8 mg/día. Comunicación pública del MSPBS: 0,5 mg/día.' };
    r.cuando = CUANDO;
    r.mthfr = f.mthfr ? 'MTHFR: no cambia la dosis ni el tipo; usar ácido fólico (CDC). Es la única forma de folato que demostró prevenir defectos del tubo neural; el metilfolato (5-MTHF) no lo reemplaza. No se recomienda pedir el estudio de MTHFR (ACMG 2013, reafirmado en 2020).' : '';
    return r;
  }


  function interpretar(vals, ctxTsh) {
    var res = [];
    CAMPOS.forEach(function (c) {
      var v = num(vals[c.id]);
      if (v === null || c.id === 'lh') return;
      var o = c.id === 'tsh' ? tsh(v, ctxTsh) : INTERP[c.id](v);
      res.push({ id: c.id, nombre: c.nombre, valor: v, unidad: UNIDADES[c.id], etq: o.etq, color: o.color, det: o.det || '' });
    });
    var r = relacion(num(vals.lh), num(vals.fsh));
    if (r) res.splice(1, 0, { id: 'lhfsh', nombre: 'Relación LH/FSH', valor: r.valor, unidad: '', etq: r.etq, color: r.color, det: r.det || '' });
    return res;
  }

  function sel(id, ops) { return '<select id="' + id + '">' + ops.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>'; }
  function campo(id, txt, u, step) { return '<label class="campo"><span>' + txt + (u ? ' <em class="u">(' + u + ')</em>' : '') + '</span><input id="' + id + '" type="number" inputmode="decimal" min="0" step="' + (step || '0.1') + '"></label>'; }
  var SERO = [['', 'Sin dato'], ['nr', 'No reactiva'], ['trat', 'Reactiva con tratamiento'], ['activa', 'Reactiva sin tratamiento']];

  function render(cont, T) {
    var t = T.preconcepcional, F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<h3 class="sub">Semáforo de riesgo preconcepcional</h3>' +
      '<p class="ayuda">Clasificación del MSPBS 2022. Gana el color más alto; si falta un dato obligatorio, no se clasifica en verde.</p>' +
      '<div class="form">' + campo('s-edad', 'Edad', 'años', '1') + campo('s-peso', 'Peso', 'kg') + campo('s-talla', 'Talla', 'cm', '0.5') + campo('s-hb', 'Hemoglobina', 'g/dL') +
        '<label class="campo"><span>Palidez palmar</span>' + sel('s-pal', [['no', 'Sin palidez'], ['moderada', 'Moderada'], ['intensa', 'Intensa']]) + '</label>' +
        '<label class="campo"><span>Sífilis</span>' + sel('s-sif', SERO) + '</label>' +
        '<label class="campo"><span>VIH</span>' + sel('s-vih', SERO.map(function (o) { return [o[0], o[1].replace('reactiva', 'reactivo').replace('Reactiva', 'Reactivo')]; })) + '</label></div>' +
      '<fieldset class="mrs-grupo"><legend>Criterios rojos</legend>' + ROJO.map(function (c) { return '<label class="chk"><input type="checkbox" data-r="' + c.id + '"> ' + c.txt + '</label>'; }).join('') + '</fieldset>' +
      '<fieldset class="mrs-grupo"><legend>Criterios amarillos</legend>' + AMARILLO.map(function (c) { return '<label class="chk"><input type="checkbox" data-a="' + c.id + '"> ' + c.txt + '</label>'; }).join('') + '</fieldset>' +
      '<fieldset class="mrs-grupo"><legend>Ácido fólico</legend>' +
        '<label class="chk"><input type="checkbox" id="s-dtn"> Defecto del tubo neural previo (propio, de un hijo o de la pareja)</label>' +
        '<label class="chk"><input type="checkbox" id="s-dm"> Diabetes</label>' +
        '<label class="chk"><input type="checkbox" id="s-epi"> Epilepsia o anticonvulsivantes</label>' +
        '<label class="chk"><input type="checkbox" id="s-mthfr"> Variante de MTHFR conocida</label></fieldset>' +
      '<div id="s-out" class="resultados" aria-live="polite"></div>' +
      '<details class="ref"><summary>Laboratorio preconcepcional (MSPBS)</summary><ul><li>Hemoglobina y hematocrito; grupo y factor Rh</li><li>Glucemia, urea, creatinina, TSH y perfil lipídico</li><li>Serologías: rubéola, sífilis, toxoplasma, hepatitis B, VIH y Chagas</li><li>Orina simple y urocultivo; Papanicolaou</li><li>Vacunas a virus vivos: evitar el embarazo por 3 meses</li></ul></details>' +
      '<p class="etiqueta">Tabla adaptada del Manual Nacional de Normas de Cuidados del MSPBS (2022), p. 23 · Ambigüedades resueltas con OMS (IMC; anemia 2024) y ACOG/SMFM (2022) · Ácido fólico: MSPBS 2022, USPSTF 2023, CDC, ACMG 2020</p>' +
      '<h3 class="sub">Panel hormonal</h3>' +
      '<p class="ayuda">' + t.ayuda + '</p><div class="form">' +
      CAMPOS.map(function (c) {
        return '<label class="campo"><span>' + c.nombre + ' <em class="u">(' + UNIDADES[c.id] + ')</em></span>' +
          '<input id="p-' + c.id + '" type="number" inputmode="decimal" min="0" step="0.01"></label>';
      }).join('') +
      campo('p-lsup', 'Límite superior de TSH del laboratorio', 'si no lo informa, 4,0', '0.01') +
      '<label class="campo"><span>Anti-TPO</span>' + sel('p-tpo', [['', 'Sin dato'], ['pos', 'Positivo'], ['neg', 'Negativo']]) + '</label>' +
      '<label class="campo"><span>Anti-Tg</span>' + sel('p-tg', [['', 'Sin dato'], ['pos', 'Positivo'], ['neg', 'Negativo']]) + '</label></div>' +
      '<label class="chk"><input type="checkbox" id="p-levo"> En tratamiento con levotiroxina</label>' +
      '<label class="chk"><input type="checkbox" id="p-fiv"> Va a FIV o ICSI</label>' +
      '<div id="p-out" class="resultados" aria-live="polite"></div>' +
      '<h3 class="sub">Autoinmunidad y trombofilia</h3>' +
      '<fieldset class="mrs-grupo"><legend>Antecedentes</legend>' + AUTO.map(function (c) { return '<label class="chk"><input type="checkbox" data-au="' + c.id + '"> ' + c.txt + '</label>'; }).join('') + '</fieldset>' +
      '<div id="au-out" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: ACR 2020 (Sammaritano LR et al.) · SMFM Consult #64 · ACOG PB 197 · ASRM 2026</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p><p class="etiqueta">' + t.etiqueta + '</p>';
    var q = function (s) { return cont.querySelector(s); };
    function actualizar() {
      var r = {}, a = {};
      cont.querySelectorAll('input[data-r]').forEach(function (c) { r[c.getAttribute('data-r')] = c.checked; });
      cont.querySelectorAll('input[data-a]').forEach(function (c) { a[c.getAttribute('data-a')] = c.checked; });
      var s = semaforo({ edad: q('#s-edad').value, peso: q('#s-peso').value, talla: q('#s-talla').value, hb: q('#s-hb').value, palidez: q('#s-pal').value, sifilis: q('#s-sif').value, vih: q('#s-vih').value, rojo: r, amarillo: a });
      var col = { rojo: 'rojo', amarillo: 'ambar', verde: 'verde', incompleto: 'neutro' }[s.color];
      var h = [F('Semáforo', '<strong>' + s.nombre + '</strong>', s.faltan.length && s.color !== 'rojo' ? 'Falta: ' + s.faltan.join(', ') + '.' : '', col)];
      s.motivos.forEach(function (m) { h.push(F(m.color === 'rojo' ? 'Criterio rojo' : 'Criterio amarillo', m.txt, m.nota, m.color === 'rojo' ? 'rojo' : 'ambar')); });
      if (s.imc !== null && s.motivos.every(function (m) { return m.txt.indexOf('IMC') !== 0; })) h.push(F('IMC', String(s.imc).replace('.', ',') + ' · ' + s.clase, '', 'verde'));
      if (s.conducta.length) h.push(F('Conducta (MSPBS)', '<ul class="lista">' + s.conducta.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>', '', col));
      var f = acidoFolico({ color: s.color, dtn: q('#s-dtn').checked, dm: q('#s-dm').checked, epi: q('#s-epi').checked, imc: s.imc, mthfr: q('#s-mthfr').checked });
      h.push(F('Ácido fólico', '<strong>' + f.dosis + '</strong> · ' + f.motivo, f.cuando + ' ' + f.fuente, f.color));
      if (f.mthfr) h.push(F('MTHFR', f.mthfr, '', 'ambar'));
      q('#s-out').innerHTML = h.join('');
      var vals = {};
      CAMPOS.forEach(function (c) { vals[c.id] = q('#p-' + c.id).value; });
      var ctx = { levo: q('#p-levo').checked, fiv: q('#p-fiv').checked, tpo: q('#p-tpo').value, lsup: q('#p-lsup').value };
      q('#p-out').innerHTML = interpretar(vals, ctx).map(function (x) {
        var v = String(x.valor).replace('.', ',') + (x.unidad ? ' ' + x.unidad : '');
        return F(x.nombre, v + ' · <strong>' + x.etq + '</strong>', x.det, x.color);
      }).join('');
      var tg = antiTg(q('#p-tg').value, q('#p-tpo').value);
      if (tg) q('#p-out').innerHTML += F('Anti-Tg', '<strong>' + tg.etq + '</strong>', tg.det, tg.color);
      var au = {};
      cont.querySelectorAll('input[data-au]').forEach(function (c) { au[c.getAttribute('data-au')] = c.checked; });
      q('#au-out').innerHTML = autoinmune(au).map(function (x) { return F(x.t, '<ul class="lista">' + x.txt.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>', '', x.color); }).join('');
    }
    cont.addEventListener('input', actualizar);
    cont.addEventListener('change', actualizar);
    actualizar();
  }

  w.GYN = w.GYN || {};
  w.GYN.preconcepcional = { semaforo: semaforo, acidoFolico: acidoFolico, imc: imc, claseOMS: claseOMS, interpretar: interpretar, fsh: fsh, relacion: relacion, amh: amh, p4: p4, tsh: tsh, prl: prl, antiTg: antiTg, autoinmune: autoinmune, AUTO: AUTO, UNIDADES: UNIDADES, render: render };
})(window);
