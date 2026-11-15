/* CaVeSal® GYN · Laboratorio por cuadro: qué pedir, interpretación, causa probable y conducta.
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · OMS 2024 (anemia) · OMS 2020 (ferritina) · ADA Standards of Care ·
   ATA 2017 · ASRM 2020/2021/2026 · ESHRE POI 2024 · ESHRE Bologna 2011 · Guía internacional SOMP 2023 ·
   Endocrine Society: hirsutismo 2018 (Martin KA), HSC 2018 (Speiser PW), hiperprolactinemia 2011 (Melmed S), vitamina D 2011 y 2024 ·
   IOM 2011 · NICE NG23 · ESHRE RPL 2017 y 2022 · ACOG PB 197 · ACR 2020 · SMFM #64 · CDC STI 2021 · Horner PJ et al. 2018 (IUSTI) ·
   ACOG CO 797 (2020) · ASH/ISTH/NHF/WFH 2021 (von Willebrand) · Lee PA et al. Pediatrics 2006 (consenso DSD).
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };
  function coma(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

  var CUADROS = [
    ['rutina', 'Rutina y preconcepcional'], ['sangrado', 'Sangrado (SUA) y anemia'], ['fertilidad', 'Ciclo, ovulación y fertilidad'],
    ['andro', 'Hiperandrogenismo y metabólico'], ['clima', 'Climaterio'], ['pubertad', 'Pubertad y adolescencia'],
    ['inmuno', 'Perfil inmunológico, trombofilia y abortos a repetición'], ['secrecion', 'Secreción vaginal y endocervical']
  ];

  /* ---------- Intérpretes compartidos ---------- */
  // OMS 2024: anemia en mujer no embarazada de 15 años o más, Hb < 12 g/dL. Ferritina OMS 2020.
  function anemia(d) {
    var f = [];
    if (d.hb !== null) {
      var g = d.hb < 8 ? 'grave' : d.hb < 11 ? 'moderada' : d.hb < 12 ? 'leve' : null;
      f.push(['Hemoglobina', '<strong>' + coma(d.hb) + ' g/dL: ' + (g ? 'anemia ' + g : 'sin anemia') + '</strong>', 'OMS 2024: anemia con menos de 12 g/dL (no embarazada); leve 11 a 11,9 · moderada 8 a 10,9 · grave menos de 8.', g === 'grave' ? 'rojo' : g ? 'naranja' : 'verde']);
    }
    if (d.vcm !== null) f.push(['VCM', coma(d.vcm) + ' fL: ' + (d.vcm < 80 ? 'microcitosis: déficit de hierro o rasgo talasémico' : d.vcm > 100 ? 'macrocitosis: pedir vitamina B12 y folatos' : 'normocítico'), '', d.vcm < 80 || d.vcm > 100 ? 'ambar' : 'verde']);
    if (d.ferr !== null) f.push(['Ferritina', '<strong>' + coma(d.ferr) + ' µg/L: ' + (d.ferr < 15 ? 'depósitos de hierro agotados' : 'sin déficit por este criterio') + '</strong>', 'OMS 2020: menos de 15 µg/L en adultas sanas; con infección o inflamación el corte es menos de 70.', d.ferr < 15 ? 'rojo' : 'verde']);
    return f;
  }
  // ACC/AHA 2018 (LDL ≥ 190) · criterios armonizados de síndrome metabólico (Alberti 2009): TG ≥ 150, HDL < 50 en la mujer.
  function lipidos(d) {
    var t = [], col = 'verde';
    if (d.ldl !== null) { t.push('LDL ' + coma(d.ldl) + ' mg/dL' + (d.ldl >= 190 ? ': hipercolesterolemia grave (190 o más)' : '')); if (d.ldl >= 190) col = 'rojo'; }
    if (d.hdl !== null) { t.push('HDL ' + coma(d.hdl) + ' mg/dL' + (d.hdl < 50 ? ': bajo (menos de 50)' : '')); if (d.hdl < 50 && col === 'verde') col = 'ambar'; }
    if (d.tg !== null) { t.push('Triglicéridos ' + coma(d.tg) + ' mg/dL' + (d.tg >= 150 ? ': elevados (150 o más)' : '')); if (d.tg >= 150 && col === 'verde') col = 'ambar'; }
    return t.length ? ['Perfil lipídico', C().ul(t), 'ACC/AHA 2018 · criterios armonizados de síndrome metabólico (Alberti 2009).', col] : null;
  }
  function glucemia(d) {
    var g = w.GYN.somp.glucemia({ ay: d.glu, h2: d.h2, a1c: d.a1c });
    return g ? ['Glucemia (ADA, fuera del embarazo)', C().ul(g.items), g.nota, g.color] : null;
  }
  // TSH fuera del embarazo: rango habitual 0,4 a 4,0 µUI/mL (usar el del laboratorio).
  function tshGen(v, ctx) {
    if (v === null) return null;
    if (ctx && ctx.preco) { var p = w.GYN.preconcepcional.tsh(v, { tpo: ctx.tpo }); return ['TSH (preconcepcional, ATA 2017)', '<strong>' + coma(v) + ' µUI/mL: ' + p.etq + '</strong>', p.det || '', p.color]; }
    if (v > 4) return ['TSH', '<strong>' + coma(v) + ' µUI/mL: elevada</strong>', 'Pedir T4 libre y anti-TPO: hipotiroidismo subclínico (T4L normal) o clínico (T4L baja).', 'ambar'];
    if (v < 0.4) return ['TSH', '<strong>' + coma(v) + ' µUI/mL: baja</strong>', 'Pedir T4 libre (y T3): descartar hipertiroidismo.', 'ambar'];
    return ['TSH', coma(v) + ' µUI/mL: dentro del rango habitual (0,4 a 4,0; usá el de tu laboratorio)', '', 'verde'];
  }
  function prlInt(v) {
    if (v === null) return null;
    var p = w.GYN.preconcepcional.prl(v);
    return ['Prolactina', '<strong>' + coma(v) + ' ng/mL: ' + p.etq + '</strong>', v > 25 ? 'Repetir en ayunas por la mañana, descartar fármacos, hipotiroidismo y macroprolactina; RMN de silla turca si supera 100 (Endocrine Society 2011).' : '', p.color];
  }

  /* ---------- Cuadros ---------- */
  function rutina(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    r.pedir = ['Hemograma y ferritina', 'Glucemia en ayunas o HbA1c (ADA: desde los 35 años, o antes con sobrepeso y otro factor de riesgo); PTOG 75 g si hay SOMP y planifica embarazo',
      'Perfil lipídico', 'TSH (anti-TPO si la TSH está en zona gris al planificar embarazo)', 'Orina simple', 'Serologías: sífilis, VIH, hepatitis B y C',
      d.preco ? 'Planifica embarazo: grupo y factor Rh, rubéola y varicela IgG (vacunar si es negativa), ácido fólico; ver el módulo Preconcepcional' : '',
      'Tamizaje de cuello uterino y mama según edad: ver el módulo Mama, cérvix y endometrio'];
    r.filas = anemia(d).concat([glucemia(d), lipidos(d), tshGen(d.tsh, { preco: d.preco, tpo: d.tpo })]).filter(Boolean);
    if (d.hb !== null && d.hb < 12) r.conducta.push('Anemia: buscar la causa (sangrado menstrual abundante, dieta, parásitos) y reponer hierro si la ferritina es baja; ver el cuadro Sangrado.');
    if (d.vcm !== null && d.vcm < 80 && d.ferr !== null && d.ferr >= 15) r.conducta.push('Microcitosis con ferritina normal: pedir electroforesis de hemoglobina (rasgo talasémico).');
    if (d.glu !== null && d.glu >= 100 || d.a1c !== null && d.a1c >= 5.7) r.conducta.push('Glucemia alterada: ver el módulo Diabetes y prediabetes.');
    return r;
  }

  function sangrado(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    r.pedir = ['β-hCG (siempre en edad fértil)', 'Hemograma con plaquetas y ferritina', 'TSH; prolactina si hay oligo-anovulación',
      'Tamizaje de coagulopatía positivo: TP, TTPa, fibrinógeno, factor de von Willebrand (antígeno y actividad) y factor VIII, con hematología', 'Clasificar con PALM-COEIN en el módulo SUA'];
    r.filas = anemia(d);
    if (d.hcg === 'pos') r.filas.unshift(['β-hCG', '<strong>Positiva: no es SUA</strong>', 'Descartar aborto, embarazo ectópico y enfermedad trofoblástica (ver Dolor pélvico).', 'rojo']);
    if (d.plaq !== null) r.filas.push(['Plaquetas', coma(d.plaq) + ' /mm³' + (d.plaq < 150000 ? ': plaquetopenia; estudiar con hematología' : ''), '', d.plaq < 150000 ? 'naranja' : 'verde']);
    var t = tshGen(d.tsh); if (t) r.filas.push(t);
    var p = prlInt(d.prl); if (p) r.filas.push(p);
    if (d.coag) r.filas.push(['Coagulopatía', '<strong>Tamizaje positivo</strong>', 'La enfermedad de von Willebrand es la más frecuente: el factor de von Willebrand sube con estrógenos, embarazo y estrés; repetir si sale límite (ASH/ISTH/NHF/WFH 2021).', 'naranja']);
    if (d.ferr !== null && d.ferr < 15 || d.hb !== null && d.hb < 12) r.conducta.push('Reponer hierro y tratar la causa del sangrado. Hb menor de 8 g/dL, síntomas o intolerancia oral: evaluar hierro intravenoso o transfusión según la estabilidad. Sugerencia CaVeSal®.');
    if (d.coag) r.conducta.push('Derivar a hematología antes de procedimientos; los antifibrinolíticos y los hormonales siguen siendo opciones (ver SUA).');
    return r;
  }

  function fertilidad(d) {
    var P = w.GYN.preconcepcional, r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    r.pedir = ['Día 2 a 3 del ciclo: FSH, LH y estradiol', 'AMH: cualquier día del ciclo (los anticonceptivos hormonales la bajan)', 'Progesterona en fase lútea media (día 21 en ciclo de 28; 7 días antes de la regla esperada)',
      'TSH y prolactina solo con indicación clínica: ciclos irregulares, galactorrea, síntomas (ASRM 2026)', 'Clamidia por NAAT (ver Secreciones) y rubéola IgG',
      'Permeabilidad tubaria (HSG o HyFoSy) y espermiograma de la pareja (módulo Pareja)'];
    var fl = [];
    if (d.fsh !== null) { var f = P.fsh(d.fsh); fl.push(['FSH día 2 a 3', '<strong>' + coma(d.fsh) + ' mUI/mL: ' + f.etq + '</strong>', '', f.color]); }
    if (d.fsh !== null && d.e2 !== null && d.e2 > 80) fl.push(['Estradiol día 2 a 3', '<strong>' + coma(d.e2) + ' pg/mL: elevado</strong>', 'Un estradiol basal alto (más de 60 a 80 pg/mL) puede bajar la FSH y ocultar una reserva disminuida (ASRM 2020).', 'ambar']);
    else if (d.e2 !== null) fl.push(['Estradiol día 2 a 3', coma(d.e2) + ' pg/mL', '', 'neutro']);
    var rel = P.relacion(d.lh, d.fsh); if (rel) fl.push(['LH/FSH', coma(rel.valor) + ': ' + rel.etq, rel.det || '', rel.color]);
    if (d.amh !== null) {
      var a = d.amh < 1.1 ? ['Reserva ovárica disminuida (menos de 1,1: criterio de Bologna)', 'rojo'] : d.amh < 1.2 ? ['Límite', 'ambar'] : d.amh <= 3.5 ? ['Óptima (1,2 a 3,5)', 'verde'] : ['Alta: se asocia a SOMP y a mayor respuesta a la estimulación (riesgo de hiperestimulación)', 'ambar'];
      fl.push(['AMH', '<strong>' + coma(d.amh) + ' ng/mL: ' + a[0] + '</strong>', 'La AMH predice la respuesta a la estimulación, no la fertilidad espontánea (ASRM 2020). ESHRE Bologna 2011.', a[1]]);
    }
    if (d.p4 !== null) { var q = P.p4(d.p4); fl.push(['Progesterona lútea', '<strong>' + coma(d.p4) + ' ng/mL: ' + q.etq + '</strong>', 'Más de 3 ng/mL confirma ovulación; 10 o más es el valor óptimo de la guía.', q.color]); }
    var t = tshGen(d.tsh, { preco: true }); if (t) fl.push(t);
    var p = prlInt(d.prl); if (p) fl.push(p);
    r.filas = fl;
    if (d.edad !== null && d.edad < 40 && d.fsh !== null && d.fsh > 25) r.conducta.push('<strong>Insuficiencia ovárica prematura probable</strong> (menos de 40 años, FSH mayor de 25 UI/L' + (d.amen4 ? ' y oligo/amenorrea de 4 meses o más' : '; confirmar oligo/amenorrea de 4 meses o más') + '; ESHRE 2024). Cariotipo, premutación FMR1 y anticuerpos antiadrenales; consejería: ovodonación y terapia hormonal hasta la edad de la menopausia natural.');
    else if (d.fsh !== null && d.fsh > 15 || d.amh !== null && d.amh < 1.1) r.conducta.push('Reserva ovárica disminuida: no demorar el estudio ni el tratamiento; derivar a medicina reproductiva.');
    if (d.hipo) r.conducta.push('FSH y LH bajas con estradiol bajo: hipogonadismo hipogonadotrófico (hipotalámico o hipofisario). Ver Amenorrea; RMN si hay cefalea, alteraciones visuales o prolactina alta.');
    if (d.p4 !== null && d.p4 <= 3) r.conducta.push('Anovulación: buscar la causa (SOMP, prolactina, tiroides, peso, estrés) e inducir la ovulación (módulo Ovulación).');
    if (d.prl !== null && d.prl > 25) r.conducta.push('Hiperprolactinemia confirmada: cabergolina como primera línea; bromocriptina si busca embarazo (Endocrine Society 2011).');
    return r;
  }

  function andro(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    r.pedir = ['Testosterona total (ideal por LC-MS/MS) y SHBG para el índice de andrógenos libres o testosterona libre calculada', 'Si la testosterona total y la libre son normales: androstenediona y DHEA-S',
      '17-OH progesterona en fase folicular, por la mañana', 'Prolactina y TSH; β-hCG si hay amenorrea', 'PTOG 75 g (o glucemia en ayunas/HbA1c) y perfil lipídico',
      'Sin anticonceptivos hormonales los 3 meses previos (guía SOMP 2023)', 'Signos de Cushing: cortisol libre urinario, cortisol salival nocturno o prueba con 1 mg de dexametasona'];
    var fl = [];
    if (d.tt !== null) fl.push(['Testosterona total', '<strong>' + coma(d.tt) + ' ng/dL' + (d.tt >= 150 ? ': muy elevada' : d.ttAlta ? ': elevada según el laboratorio' : '') + '</strong>', d.tt >= 150 ? 'Más de 150 a 200 ng/dL obliga a descartar un tumor (Endocrine Society 2018).' : '', d.tt >= 150 ? 'rojo' : d.ttAlta ? 'ambar' : 'neutro']);
    if (d.tt !== null && d.shbg) { var fai = Math.round(d.tt * 0.0347 * 100 / d.shbg * 10) / 10; fl.push(['Índice de andrógenos libres', '<strong>' + coma(fai) + ' %</strong>', 'Testosterona (nmol/L) × 100 / SHBG (nmol/L). Comparar con el rango del laboratorio: el corte varía según el método.', 'neutro']); }
    if (d.dheas !== null) fl.push(['DHEA-S', '<strong>' + coma(d.dheas) + ' µg/dL' + (d.dheas > 700 ? ': muy elevada, origen suprarrenal' : '') + '</strong>', d.dheas > 700 ? 'Más de 700 µg/dL: descartar tumor suprarrenal con TC o RMN.' : 'La DHEA-S es el marcador de la suprarrenal; la DHEA libre varía mucho en el día.', d.dheas > 700 ? 'rojo' : 'neutro']);
    if (d.ohp !== null) fl.push(['17-OH progesterona', '<strong>' + coma(d.ohp) + ' ng/mL: ' + (d.ohp < 2 ? 'descarta HSC no clásica' : d.ohp <= 10 ? 'zona de estímulo con ACTH' : 'compatible con HSC no clásica') + '</strong>', 'Speiser 2018: menos de 2 descarta; 2 a 10 → ACTH 250 µg y 17-OHP a los 60 min (más de 10 confirma); más de 10 basal es compatible.', d.ohp < 2 ? 'verde' : d.ohp <= 10 ? 'ambar' : 'rojo']);
    var p = prlInt(d.prl); if (p) fl.push(p);
    var t = tshGen(d.tsh); if (t) fl.push(t);
    var g = glucemia(d); if (g) fl.push(g);
    var h = w.GYN.somp.homa(d.glu, d.ins); if (h !== null) fl.push(['HOMA-IR', coma(h), 'Dato descriptivo: no hay corte universal y la guía SOMP 2023 no lo recomienda de rutina.', 'neutro']);
    r.filas = fl;
    var tumor = d.viril || (d.tt !== null && d.tt >= 150) || (d.dheas !== null && d.dheas > 700);
    if (tumor) r.conducta.push('<strong>Descartar tumor secretor de andrógenos</strong>: virilización rápida o valores muy altos. Ecografía transvaginal o RMN de ovarios; TC o RMN suprarrenal si la DHEA-S es muy alta. Derivar.');
    if (d.ohp !== null && d.ohp > 10) r.conducta.push('HSC no clásica (déficit de 21-hidroxilasa): endocrinología; consejería genética si busca embarazo.');
    else if (d.ohp !== null && d.ohp >= 2) r.conducta.push('Pedir prueba de estímulo con ACTH.');
    if (d.cushing) r.conducta.push('Signos de Cushing: completar el estudio de hipercortisolismo antes de diagnosticar SOMP.');
    if (!tumor && (d.ttAlta || d.tlAlta) && !(d.ohp !== null && d.ohp >= 2) && !(d.prl !== null && d.prl > 25) && !(d.tsh !== null && (d.tsh > 4 || d.tsh < 0.4)))
      r.conducta.push('Hiperandrogenismo bioquímico con exclusiones normales: compatible con SOMP si cumple los criterios (módulo SOMP).');
    return r;
  }

  function clima(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    var mas45 = d.edad !== null && d.edad > 45;
    r.pedir = [mas45 ? 'Más de 45 años con síntomas: el diagnóstico es clínico, no hace falta FSH (NICE NG23)' : 'FSH (y estradiol) si tiene de 40 a 45 años con síntomas o menos de 40 (sospecha de IOP)',
      'Perfil lipídico, glucemia o HbA1c, hemograma', 'TSH si hay síntomas que se superponen', 'Calcemia; vitamina D solo con riesgo (osteoporosis, malabsorción, poca exposición solar): la Endocrine Society 2024 no recomienda medirla de rutina',
      'Vitamina B12 si toma metformina, es vegetariana, tiene anemia macrocítica o neuropatía; folatos con anemia macrocítica', 'Vitamina B6: sin indicación de rutina en las guías revisadas; solo según la clínica',
      'Mamografía y densitometría (módulos de imágenes)'];
    if (d.chc) r.noPedir.push('FSH con anticonceptivos combinados: no es válida para el diagnóstico.');
    var fl = [];
    if (d.fsh !== null) fl.push(['FSH', '<strong>' + coma(d.fsh) + ' UI/L' + (d.fsh > 25 ? ': elevada' : '') + '</strong>', d.edad !== null && d.edad < 40 ? 'Menos de 40 años: FSH mayor de 25 con oligo/amenorrea de 4 meses o más es IOP (ESHRE 2024).' : 'En la perimenopausia la FSH fluctúa: un valor normal no descarta la transición.', d.fsh > 25 ? 'ambar' : 'neutro']);
    if (d.vitd !== null) {
      var es = d.vitd < 20 ? 'déficit' : d.vitd < 30 ? 'insuficiencia' : 'suficiente', io = d.vitd < 12 ? 'riesgo de deficiencia' : d.vitd < 20 ? 'posiblemente insuficiente' : 'suficiente';
      fl.push(['Vitamina D (25-OH)', '<strong>' + coma(d.vitd) + ' ng/mL</strong>' + C().ul(['Endocrine Society 2011: ' + es, 'IOM 2011: ' + io]), 'No hay un umbral único; de 20 a 29 es zona gris (Tabla propia CaVeSal®).', d.vitd < 20 ? 'naranja' : d.vitd < 30 ? 'ambar' : 'verde']);
    }
    if (d.ca) fl.push(['Calcemia', d.ca === 'alto' ? '<strong>Elevada: pedir PTH (hiperparatiroidismo primario)</strong>' : d.ca === 'bajo' ? '<strong>Baja: corregir por albúmina; pedir vitamina D y PTH</strong>' : 'Normal', '', d.ca === 'normal' ? 'verde' : 'ambar']);
    if (d.b12 !== null) fl.push(['Vitamina B12', '<strong>' + coma(d.b12) + ' pg/mL: ' + (d.b12 < 200 ? 'déficit' : d.b12 < 300 ? 'límite: pedir ácido metilmalónico' : 'normal') + '</strong>', 'BSH 2014: menos de 200 pg/mL déficit; 200 a 300 indeterminado.', d.b12 < 200 ? 'rojo' : d.b12 < 300 ? 'ambar' : 'verde']);
    if (d.fol !== null) fl.push(['Folato sérico', coma(d.fol) + ' ng/mL' + (d.fol < 4 ? ': déficit' : ''), 'OMS: menos de 4 ng/mL (10 nmol/L).', d.fol < 4 ? 'rojo' : 'verde']);
    var g = glucemia(d); if (g) fl.push(g);
    var l = lipidos(d); if (l) fl.push(l);
    var t = tshGen(d.tsh); if (t) fl.push(t);
    r.filas = fl;
    if (d.edad !== null && d.edad < 40 && d.fsh !== null && d.fsh > 25) r.conducta.push('IOP probable: terapia hormonal hasta la edad de la menopausia natural, salvo contraindicación (ESHRE 2024); ver THM.');
    if (d.vitd !== null && d.vitd < 20) r.conducta.push('Vitamina D baja: suplementar con calcio dietario adecuado (ver la guía de vitamina D).');
    if (d.b12 !== null && d.b12 < 200) r.conducta.push('Déficit de B12: reponer y buscar la causa (metformina, gastritis atrófica, dieta).');
    if (d.ca === 'alto') r.conducta.push('Hipercalcemia: no indicar suplementos de calcio ni vitamina D hasta aclarar la causa.');
    r.conducta.push('Síntomas vasomotores o genitourinarios: Calculadora de THM y escala MRS.');
    return r;
  }

  function pubertad(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    r.pedir = ['LH basal (ultrasensible) y FSH; estradiol', 'Testosterona total y libre', 'DHEA-S (marcador suprarrenal; la DHEA libre varía en el día) y DHEA si el laboratorio la ofrece',
      '17-OH progesterona basal por la mañana (HSC no clásica)', 'TSH; prolactina si hay galactorrea', 'Edad ósea (Rx de mano y muñeca izquierda) y ecografía pélvica'];
    if (d.edad !== null) {
      if (d.edad < 8 && (d.telarquia || d.pubarca) || d.edad < 9 && d.menarca) r.filas.push(['Clínica', '<strong>Pubertad precoz</strong>', 'Telarquia o pubarca antes de los 8 años, o menarca antes de los 9 (Guías CaVeSal®).', 'rojo']);
      else if (d.edad >= 13 && !d.telarquia) r.filas.push(['Clínica', '<strong>Sin telarquia a los 13 años: retraso puberal</strong>', 'Estudiar como amenorrea primaria (FSH, LH, estradiol, cariotipo).', 'naranja']);
      else if (d.edad >= 15 && !d.menarca) r.filas.push(['Clínica', '<strong>Sin menarca a los 15 años: amenorrea primaria</strong>', '', 'naranja']);
      else r.filas.push(['Clínica', 'Desarrollo acorde a la edad por estos datos', '', 'verde']);
    }
    r.conducta.push('Pubertad precoz: cargar Tanner, LH, 17-OHP y ecografía en el módulo Pubertad (origen central, periférico ovárico o suprarrenal).');
    r.conducta.push('Retraso o amenorrea primaria: módulo Amenorrea.');
    r.conducta.push('Amenorrea primaria con cariotipo 46,XY y virilización en la pubertad: considerar déficit de 5α-reductasa (relación testosterona/DHT elevada, idealmente tras estímulo con hCG; confirmar con estudio del gen SRD5A2). Derivar a un equipo de diferencias del desarrollo sexual (consenso DSD, Lee 2006).');
    return r;
  }

  function inmuno(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    var prr = d.perd !== null && d.perd >= 2;
    var indAPL = d.tev || d.morb || prr || d.les;
    var indTrf = d.tev || d.famAlto;
    r.pedir.push('<strong>Antifosfolípidos</strong>' + (indAPL ? ' (indicados)' : ' (con trombosis, morbilidad obstétrica, 2 o más pérdidas o lupus)') + ': anticoagulante lúpico, anticardiolipinas IgG e IgM, anti-β2 glicoproteína I IgG e IgM. Positivo: repetir a las 12 semanas; tras una pérdida, esperar unas 6 semanas.');
    r.pedir.push('<strong>Trombofilia hereditaria</strong>' + (indTrf ? ' (indicada)' : ' (solo con TEV personal o familiar de primer grado con trombofilia de alto riesgo)') + ': factor V Leiden, protrombina G20210A, antitrombina, proteína C y proteína S (actividad). Lejos de la trombosis aguda, de la anticoagulación, del embarazo y de los estrógenos; 6 semanas después de una pérdida.');
    r.pedir.push('<strong>Lupus</strong> (con sospecha clínica): ANA, anti-DNA doble cadena, anti-Sm, C3 y C4, anti-Ro/SSA y anti-La/SSB, hemograma y orina.');
    r.noPedir.push('MTHFR ni homocisteína (ACOG PB 197; ESHRE RPL).');
    if (!indTrf) r.noPedir.push('Trombofilia hereditaria sin TEV personal ni familiar de alto riesgo (ACOG PB 197); tampoco de rutina en infertilidad (ASRM 2026) ni en abortos a repetición sin factores adicionales (ESHRE 2022).');
    if (prr) {
      r.filas.push(['Abortos a repetición', '<strong>' + d.perd + ' pérdidas: pérdida recurrente de embarazo (2 o más; ESHRE 2022)</strong>', 'Excluye ectópico y mola.', 'naranja']);
      r.pedir.push('<strong>Abortos a repetición (ESHRE)</strong>: anticoagulante lúpico y anticardiolipinas IgG/IgM (recomendado), anti-β2GPI (puede considerarse), TSH y anti-TPO (con T4 si salen alterados), anatomía uterina (ecografía, idealmente 3D; descartar adenomiosis), cariotipo de los padres tras evaluación individual y fragmentación del ADN espermático (puede considerarse).');
      r.noPedir.push('En abortos a repetición (ESHRE 2017): prolactina sin síntomas, reserva ovárica, andrógenos, insulina y glucemia para el pronóstico, vitamina D y HLA.');
    }
    var aplPos = d.al === 'pos' || d.acl === 'alto' || d.b2 === 'alto', aplBajo = d.acl === 'bajo' || d.b2 === 'bajo';
    var triple = d.al === 'pos' && d.acl === 'alto' && d.b2 === 'alto';
    if (d.al || d.acl || d.b2) {
      var txt = aplPos ? (d.dos ? 'Positivos persistentes (2 tomas con 12 semanas o más): criterio de laboratorio de SAF' : 'Positivos en una toma: repetir a las 12 semanas') : aplBajo ? 'Títulos bajos: no cumplen el criterio de laboratorio' : 'Negativos';
      r.filas.push(['Antifosfolípidos', '<strong>' + txt + '</strong>' + (triple ? '<br>Triple positividad: perfil de alto riesgo.' : ''), 'Miyakis 2006: anticardiolipinas o anti-β2GPI en título medio o alto (más de 40 o percentil 99).', aplPos ? 'rojo' : aplBajo ? 'ambar' : 'verde']);
    }
    var clin = d.tev || d.morb || (d.perd !== null && d.perd >= 3);
    if (aplPos && d.dos) {
      if (d.tev) r.conducta.push('<strong>SAF trombótico</strong>: heparina en dosis terapéutica en el embarazo; cambiar warfarina por heparina antes de la semana 6; aspirina en dosis baja (ACR 2020, SMFM #64).');
      else if (clin) r.conducta.push('<strong>SAF obstétrico</strong>: aspirina 75 a 100 mg/día desde antes de la concepción + heparina profiláctica desde la prueba de embarazo positiva, hasta 6 semanas posparto (ESHRE 2022 con 3 o más pérdidas; ACR 2020).');
      else if (prr) r.conducta.push('Antifosfolípidos positivos con 2 pérdidas: la anticoagulación solo se ofrece en investigación (ESHRE 2022); aspirina en dosis baja en el embarazo (ACR 2020).');
      else r.conducta.push('Antifosfolípidos positivos sin criterios clínicos: aspirina en dosis baja en el embarazo (ACR 2020).');
      r.conducta.push('Anticoncepción: los métodos combinados con estrógenos son MEC 4 con antifosfolípidos positivos; usar progestágeno solo o DIU de cobre (ver MEC).');
    }
    var alto = d.fvl === 'homo' || d.pt === 'homo' || (d.fvl === 'hetero' && d.pt === 'hetero') || d.at;
    var bajo = !alto && (d.fvl === 'hetero' || d.pt === 'hetero' || d.pc || d.ps);
    if (d.fvl || d.pt || d.at || d.pc || d.ps) {
      r.filas.push(['Trombofilia hereditaria', '<strong>' + (alto ? 'Alto riesgo' : bajo ? 'Bajo riesgo' : 'Sin trombofilia en lo estudiado') + '</strong>', 'ACOG PB 197: alto riesgo = factor V Leiden o protrombina homocigotas, doble heterocigota o déficit de antitrombina; bajo riesgo = heterocigotas o déficit de proteína C o S. La proteína S baja en el embarazo y con estrógenos.', alto ? 'rojo' : bajo ? 'ambar' : 'verde']);
      if (alto) r.conducta.push('Trombofilia de alto riesgo: tromboprofilaxis anteparto y posparto; con TEV previa, dosis intermedia o terapéutica (ACOG PB 197). Hematología.');
      else if (bajo) r.conducta.push(d.tev ? 'Trombofilia de bajo riesgo con TEV previa: tromboprofilaxis anteparto y posparto (ACOG PB 197).' : 'Trombofilia de bajo riesgo sin TEV: vigilancia en el embarazo; profilaxis posparto si se suman otros factores de riesgo (ACOG PB 197).');
      if (alto || bajo) r.conducta.push('Anticoncepción: mutación trombogénica conocida = métodos combinados MEC 4 (ver MEC).');
    }
    if (d.ana || d.ro) {
      var l = [];
      if (d.ana === 'pos') l.push(d.dna === 'pos' || d.c34 ? 'ANA positivo con anti-DNA positivo o complemento bajo: sospecha de lupus; derivar a reumatología' : 'ANA positivo aislado: no es diagnóstico (hasta 1 de cada 5 mujeres sanas); interpretar con la clínica');
      if (d.ro === 'pos') l.push('Anti-Ro/SSA o anti-La/SSB positivos: riesgo de bloqueo cardíaco congénito y lupus neonatal');
      if (l.length) r.filas.push(['Perfil lúpico', C().ul(l), 'EULAR/ACR 2019: ANA de 1:80 o más es el criterio de entrada.', d.dna === 'pos' || d.c34 || d.ro === 'pos' ? 'naranja' : 'ambar']);
      if (d.ro === 'pos') r.conducta.push('Anti-Ro positivo y deseo de embarazo: hidroxicloroquina y ecocardiografía fetal seriada desde la semana 16 a 18 (ACR 2020).');
      if (d.les) r.conducta.push('Lupus: planificar con enfermedad inactiva al menos 6 meses y medicación compatible (ver Preconcepcional).');
    }
    if (prr && d.tpo === 'pos' && d.tsh !== null && d.tsh <= 4) r.conducta.push('Abortos a repetición con anti-TPO positivo y eutiroidea: no indicar levotiroxina (ESHRE 2022: TABLET y T4LIFE sin beneficio).');
    return r;
  }

  function secrecion(d) {
    var r = { pedir: [], filas: [], conducta: [], noPedir: [] };
    r.pedir = ['Flujo vaginal: pH, prueba de aminas (KOH), examen en fresco (células guía, tricomonas, leucocitos, lactobacilos) y KOH (levaduras o pseudohifas)',
      'Gram con puntaje de Nugent (flora: lactobacilos, Gardnerella/Mobiluncus); Donders si se sospecha vaginitis aeróbica', 'Cultivo de hongos solo si es recurrente o no responde (especies no albicans)',
      'Endocervical: NAAT de clamidia y gonococo (menores de 25 años sexualmente activas o con riesgo, cervicitis, EPI)', 'NAAT de tricomonas con flujo',
      'Mycoplasma genitalium: cervicitis persistente o recurrente; considerar en EPI'];
    r.noPedir = ['Ureaplasma (urealyticum, parvum) ni Mycoplasma hominis, tampoco en fertilidad: la colonización es frecuente y tratarla no demostró beneficio (CDC 2021; IUSTI, Horner 2018).',
      'Cultivo de Gardnerella: no es diagnóstico de vaginosis (CDC 2021).', 'Cultivo genital de estreptococo grupo B fuera del embarazo (CDC 2021).', 'Tamizaje de M. genitalium en asintomáticas.'];
    var V = w.GYN.vaginitis.calcular({ embarazo: d.emb, inmuno: false, recurrente: d.recur, hipoestro: d.hipo, flujo: d.flujo, olor: false, prurito: d.prur, ardor: false, severa: false, fresa: false, sequedad: false,
      ph: d.ph, aminas: d.aminas, clave: d.clave, levaduras: d.lev, tricomonas: d.tv, noAlbicans: false, nugent: d.nugent, donders: d.donders });
    var NOM = { vb: 'Vaginosis bacteriana', candida: 'Candidiasis vulvovaginal', tricomonas: 'Tricomoniasis', aerobica: 'Vaginitis aeróbica' };
    var dx = V.dx.map(function (k) { return NOM[k]; });
    var hall = [];
    if (d.ph !== null) hall.push('pH ' + coma(d.ph) + (d.ph > 4.5 ? ': elevado (más de 4,5)' : ': normal (4,5 o menos)'));
    if (d.clave === 'si') hall.push('Células guía presentes');
    if (V.amselEval) hall.push('Amsel ' + V.amsel + ' de ' + V.amselEval + ' evaluados (3 de 4 = vaginosis)');
    if (d.nugent !== null) hall.push('Nugent ' + d.nugent + ': ' + (d.nugent <= 3 ? 'flora normal' : d.nugent <= 6 ? 'intermedia' : 'vaginosis'));
    if (d.lacto) hall.push('Lactobacilos ' + (d.lacto === 'abund' ? 'abundantes: flora normal' : d.lacto === 'escasos' ? 'escasos: flora alterada' : 'ausentes: flora alterada'));
    if (d.lev === 'si') hall.push('Levaduras o pseudohifas presentes');
    if (d.leuco === 'abund') hall.push('Leucocitos abundantes');
    r.filas.push(['Secreción vaginal', (dx.length ? '<strong>' + dx.join(' + ') + '</strong>' : V.atrofia ? '<strong>Compatible con atrofia (síndrome genitourinario)</strong>' : '<strong>Sin diagnóstico infeccioso con estos datos</strong>') + (hall.length ? C().ul(hall) : ''), V.mixta ? 'Infección mixta: tratar cada agente.' : '', dx.length ? 'naranja' : 'verde']);
    if (d.gard === 'si' && V.dx.indexOf('vb') < 0) r.filas.push(['Gardnerella', '<strong>Informada sin criterios de vaginosis</strong>', 'Forma parte de la flora de muchas mujeres sanas: el diagnóstico es por Amsel o Nugent. No tratar sin criterios (CDC 2021).', 'ambar']);
    if ((d.lacto === 'escasos' || d.lacto === 'ausentes') && !dx.length) r.filas.push(['Flora', '<strong>Lactobacilos disminuidos sin diagnóstico</strong>', d.hipo ? 'Con hipoestrogenismo es esperable (atrofia).' : 'Completar Amsel y Nugent; Nugent 4 a 6 es flora intermedia.', 'ambar']);
    if (d.leuco === 'abund' && !V.dx.some(function (k) { return k === 'tricomonas' || k === 'aerobica'; })) r.conducta.push('Leucocitos abundantes sin causa vaginal: pedir NAAT de clamidia, gonococo y tricomonas (cervicitis) y evaluar vaginitis aeróbica.');
    if (d.sgb === 'pos') r.filas.push(['Estreptococo grupo B', '<strong>Positivo</strong>', d.emb ? 'Embarazada: profilaxis antibiótica intraparto; el tamizaje universal es entre las 36 0/7 y 37 6/7 semanas (ACOG CO 797).' : 'Fuera del embarazo es colonización: no tratar en la mujer asintomática.', d.emb ? 'naranja' : 'ambar']);
    var its = [];
    if (d.ct === 'pos') { its.push('Clamidia'); r.conducta.push('Clamidia: doxiciclina 100 mg cada 12 h por 7 días (embarazo: azitromicina 1 g dosis única). Nuevo test a los 3 meses' + (d.emb ? ' y prueba de curación a las 4 semanas en el embarazo' : '') + '.'); }
    if (d.ng === 'pos') { its.push('Gonococo'); r.conducta.push('Gonococo: ceftriaxona 500 mg IM dosis única (1 g con 150 kg o más); si no se descartó clamidia, sumar doxiciclina 7 días.'); }
    if (d.tvn === 'pos' || V.dx.indexOf('tricomonas') >= 0) { its.push('Tricomonas'); r.conducta.push('Tricomoniasis: metronidazol 500 mg cada 12 h por 7 días; tratar a la pareja; nuevo test a los 3 meses.'); }
    if (d.mg === 'pos') { its.push('M. genitalium'); r.conducta.push('M. genitalium: doxiciclina 100 mg cada 12 h por 7 días seguida de moxifloxacino 400 mg/día por 7 días; con test de resistencia a macrólidos negativo, doxiciclina seguida de azitromicina 1 g y luego 500 mg/día por 3 días.'); }
    if (its.length) { r.filas.push(['Endocervical', '<strong>' + its.join(', ') + ' positivo(s)</strong>', 'CDC 2021.', 'rojo']); r.conducta.push('ITS: tratar a las parejas de los últimos 60 días, abstinencia hasta completar el tratamiento, ofrecer VIH, sífilis y hepatitis B y C.'); }
    if (d.uu === 'pos') r.filas.push(['Ureaplasma / M. hominis', '<strong>Positivo: no tratar por este resultado</strong>', 'Colonización frecuente sin beneficio demostrado del tratamiento, también en fertilidad. Buscar y tratar las ITS verdaderas y la vaginosis (CDC 2021; Horner 2018).', 'ambar']);
    if (dx.length) r.conducta.push('Tratamiento de ' + dx.join(', ').toLowerCase() + ': ver el módulo Vaginitis.');
    return r;
  }

  var EVAL = { rutina: rutina, sangrado: sangrado, fertilidad: fertilidad, andro: andro, clima: clima, pubertad: pubertad, inmuno: inmuno, secrecion: secrecion };
  function evaluar(cuadro, d) { return EVAL[cuadro](d); }

  /* ---------- Formulario ---------- */
  var SN = [['', 'Sin dato'], ['neg', 'Negativo'], ['pos', 'Positivo']];
  function form(c) {
    var g2 = function (h) { return '<div class="grid2">' + h + '</div>'; };
    var met = function (p) { return c.campo(p + 'glu', 'Glucemia en ayunas', 'mg/dL', '1') + c.campo(p + 'a1c', 'HbA1c', '%', '0.1'); };
    var lip = function (p) { return c.campo(p + 'ldl', 'LDL', 'mg/dL', '1') + c.campo(p + 'hdl', 'HDL', 'mg/dL', '1') + c.campo(p + 'tg', 'Triglicéridos', 'mg/dL', '1'); };
    var hem = function (p) { return c.campo(p + 'hb', 'Hemoglobina', 'g/dL', '0.1') + c.campo(p + 'vcm', 'VCM', 'fL', '1') + c.campo(p + 'ferr', 'Ferritina', 'µg/L', '1'); };
    return {
      rutina: c.grupo('Datos', g2(c.chk('lr-preco', 'Planifica embarazo') + c.sel('lr-tpo', SN, 'Anti-TPO'))) + c.grupo('Resultados', g2(hem('lr-') + met('lr-') + c.campo('lr-h2', 'PTOG 2 h', 'mg/dL', '1') + lip('lr-') + c.campo('lr-tsh', 'TSH', 'µUI/mL', '0.01'))),
      sangrado: c.grupo('Resultados', g2(c.sel('ls-hcg', SN, 'β-hCG') + hem('ls-') + c.campo('ls-plaq', 'Plaquetas', '/mm³', '1000') + c.campo('ls-tsh', 'TSH', 'µUI/mL', '0.01') + c.campo('ls-prl', 'Prolactina', 'ng/mL', '0.1')) + c.chk('ls-coag', 'Tamizaje de coagulopatía positivo (ver SUA)')),
      fertilidad: c.grupo('Datos', g2(c.campo('lf-edad', 'Edad', 'años', '1')) + c.chk('lf-amen', 'Oligo/amenorrea de 4 meses o más') + c.chk('lf-hipo', 'FSH y LH bajas con estradiol bajo')) +
        c.grupo('Día 2 a 3 y AMH', g2(c.campo('lf-fsh', 'FSH', 'mUI/mL', '0.1') + c.campo('lf-lh', 'LH', 'mUI/mL', '0.1') + c.campo('lf-e2', 'Estradiol', 'pg/mL', '1') + c.campo('lf-amh', 'AMH', 'ng/mL', '0.01') + c.campo('lf-prl', 'Prolactina', 'ng/mL', '0.1') + c.campo('lf-tsh', 'TSH', 'µUI/mL', '0.01'))) +
        c.grupo('Fase lútea', g2(c.campo('lf-p4', 'Progesterona (día 21)', 'ng/mL', '0.1'))),
      andro: c.grupo('Clínica', c.chk('la-viril', 'Virilización rápida (clitoromegalia, voz grave, calvicie)') + c.chk('la-cush', 'Signos de Cushing')) +
        c.grupo('Andrógenos', g2(c.campo('la-tt', 'Testosterona total', 'ng/dL', '1') + c.sel('la-tta', [['', 'Según el laboratorio'], ['n', 'Normal'], ['a', 'Elevada']], 'Testosterona total') + c.sel('la-tla', [['', 'Sin dato'], ['n', 'Normal'], ['a', 'Elevada']], 'Testosterona libre') +
          c.campo('la-shbg', 'SHBG', 'nmol/L', '1') + c.campo('la-dheas', 'DHEA-S', 'µg/dL', '1') + c.campo('la-ohp', '17-OH progesterona', 'ng/mL', '0.01') + c.campo('la-prl', 'Prolactina', 'ng/mL', '0.1') + c.campo('la-tsh', 'TSH', 'µUI/mL', '0.01'))) +
        c.grupo('Metabólico', g2(met('la-') + c.campo('la-h2', 'PTOG 2 h', 'mg/dL', '1') + c.campo('la-ins', 'Insulina en ayunas', 'µU/mL', '0.1'))),
      clima: c.grupo('Datos', g2(c.campo('lc-edad', 'Edad', 'años', '1')) + c.chk('lc-chc', 'Usa anticonceptivos combinados')) +
        c.grupo('Resultados', g2(c.campo('lc-fsh', 'FSH', 'UI/L', '0.1') + c.sel('lc-ca', [['', 'Sin dato'], ['normal', 'Normal'], ['bajo', 'Baja'], ['alto', 'Alta']], 'Calcemia') + c.campo('lc-vitd', 'Vitamina D (25-OH)', 'ng/mL', '0.1') +
          c.campo('lc-b12', 'Vitamina B12', 'pg/mL', '1') + c.campo('lc-fol', 'Folato sérico', 'ng/mL', '0.1') + met('lc-') + lip('lc-') + c.campo('lc-tsh', 'TSH', 'µUI/mL', '0.01'))),
      pubertad: c.grupo('Datos', g2(c.campo('lp-edad', 'Edad', 'años', '0.1')) + c.chk('lp-tel', 'Telarquia') + c.chk('lp-pub', 'Pubarca o adrenarca') + c.chk('lp-men', 'Menarca')),
      inmuno: c.grupo('Indicaciones', g2(c.campo('li-perd', 'Pérdidas de embarazo', 'n.º', '1')) + c.chk('li-tev', 'Trombosis venosa o arterial previa') + c.chk('li-morb', 'Morbilidad obstétrica (muerte fetal, preeclampsia grave o insuficiencia placentaria antes de las 34 semanas)') +
          c.chk('li-fam', 'Familiar de primer grado con trombofilia de alto riesgo') + c.chk('li-les', 'Lupus conocido o sospechado')) +
        c.grupo('Antifosfolípidos', g2(c.sel('li-al', SN, 'Anticoagulante lúpico') + c.sel('li-acl', [['', 'Sin dato'], ['neg', 'Negativas'], ['bajo', 'Título bajo'], ['alto', 'Título medio o alto']], 'Anticardiolipinas') +
          c.sel('li-b2', [['', 'Sin dato'], ['neg', 'Negativos'], ['bajo', 'Título bajo'], ['alto', 'Título medio o alto']], 'Anti-β2GPI')) + c.chk('li-dos', 'Confirmados en 2 tomas con 12 semanas o más')) +
        c.grupo('Trombofilia hereditaria', g2(c.sel('li-fvl', [['', 'Sin dato'], ['no', 'No'], ['hetero', 'Heterocigota'], ['homo', 'Homocigota']], 'Factor V Leiden') + c.sel('li-pt', [['', 'Sin dato'], ['no', 'No'], ['hetero', 'Heterocigota'], ['homo', 'Homocigota']], 'Protrombina G20210A')) +
          c.chk('li-at', 'Déficit de antitrombina') + c.chk('li-pc', 'Déficit de proteína C') + c.chk('li-ps', 'Déficit de proteína S')) +
        c.grupo('Perfil lúpico y tiroides', g2(c.sel('li-ana', SN, 'ANA') + c.sel('li-dna', SN, 'Anti-DNA') + c.sel('li-ro', SN, 'Anti-Ro / anti-La') + c.sel('li-tpo', SN, 'Anti-TPO') + c.campo('li-tsh', 'TSH', 'µUI/mL', '0.01')) + c.chk('li-c34', 'C3 o C4 bajos')),
      secrecion: c.grupo('Datos', c.chk('lx-emb', 'Embarazada') + c.chk('lx-hipo', 'Hipoestrogenismo (posmenopausia, lactancia)') + c.chk('lx-rec', 'Candidiasis recurrente (4 o más por año)') + c.chk('lx-prur', 'Prurito')) +
        c.grupo('Secreción vaginal', g2(c.sel('lx-flujo', [['', 'Sin dato'], ['normal', 'Normal'], ['grumoso', 'Blanco grumoso'], ['homogeneo', 'Homogéneo grisáceo'], ['espumoso', 'Espumoso amarillo-verdoso'], ['purulento', 'Purulento']], 'Flujo') +
          c.campo('lx-ph', 'pH vaginal', '', '0.1') + c.sel('lx-am', [['', 'Sin dato'], ['no', 'Negativa'], ['si', 'Positiva']], 'Prueba de aminas') + c.sel('lx-cg', [['', 'Sin dato'], ['no', 'Ausentes'], ['si', 'Presentes']], 'Células guía') +
          c.sel('lx-lac', [['', 'Sin dato'], ['abund', 'Abundantes'], ['escasos', 'Escasos'], ['ausentes', 'Ausentes']], 'Lactobacilos') + c.sel('lx-gar', [['', 'Sin dato'], ['no', 'No informada'], ['si', 'Informada']], 'Gardnerella') +
          c.campo('lx-nug', 'Puntaje de Nugent', '0 a 10', '1') + c.campo('lx-don', 'Puntaje de Donders', '0 a 10', '1') + c.sel('lx-lev', [['', 'Sin dato'], ['no', 'No'], ['si', 'Sí']], 'Levaduras o pseudohifas') +
          c.sel('lx-tv', [['', 'Sin dato'], ['no', 'No'], ['si', 'Sí']], 'Tricomonas en el fresco') + c.sel('lx-leu', [['', 'Sin dato'], ['escasos', 'Escasos'], ['abund', 'Abundantes']], 'Leucocitos') + c.sel('lx-sgb', SN, 'Estreptococo grupo B'))) +
        c.grupo('Endocervical (NAAT)', g2(c.sel('lx-ct', SN, 'Clamidia') + c.sel('lx-ng', SN, 'Gonococo') + c.sel('lx-tvn', SN, 'Tricomonas') + c.sel('lx-mg', SN, 'M. genitalium') + c.sel('lx-uu', SN, 'Ureaplasma / M. hominis')))
    };
  }

  function leer(cuadro, L) {
    var n = L.n, v = L.v, k = L.c;
    switch (cuadro) {
      case 'rutina': return { preco: k('lr-preco'), tpo: v('lr-tpo'), hb: n('lr-hb'), vcm: n('lr-vcm'), ferr: n('lr-ferr'), glu: n('lr-glu'), a1c: n('lr-a1c'), h2: n('lr-h2'), ldl: n('lr-ldl'), hdl: n('lr-hdl'), tg: n('lr-tg'), tsh: n('lr-tsh') };
      case 'sangrado': return { hcg: v('ls-hcg'), hb: n('ls-hb'), vcm: n('ls-vcm'), ferr: n('ls-ferr'), plaq: n('ls-plaq'), tsh: n('ls-tsh'), prl: n('ls-prl'), coag: k('ls-coag') };
      case 'fertilidad': return { edad: n('lf-edad'), amen4: k('lf-amen'), hipo: k('lf-hipo'), fsh: n('lf-fsh'), lh: n('lf-lh'), e2: n('lf-e2'), amh: n('lf-amh'), prl: n('lf-prl'), tsh: n('lf-tsh'), p4: n('lf-p4') };
      case 'andro': return { viril: k('la-viril'), cushing: k('la-cush'), tt: n('la-tt'), ttAlta: v('la-tta') === 'a', tlAlta: v('la-tla') === 'a', shbg: n('la-shbg'), dheas: n('la-dheas'), ohp: n('la-ohp'), prl: n('la-prl'), tsh: n('la-tsh'), glu: n('la-glu'), a1c: n('la-a1c'), h2: n('la-h2'), ins: n('la-ins') };
      case 'clima': return { edad: n('lc-edad'), chc: k('lc-chc'), fsh: n('lc-fsh'), ca: v('lc-ca'), vitd: n('lc-vitd'), b12: n('lc-b12'), fol: n('lc-fol'), glu: n('lc-glu'), a1c: n('lc-a1c'), h2: null, ldl: n('lc-ldl'), hdl: n('lc-hdl'), tg: n('lc-tg'), tsh: n('lc-tsh') };
      case 'pubertad': return { edad: n('lp-edad'), telarquia: k('lp-tel'), pubarca: k('lp-pub'), menarca: k('lp-men') };
      case 'inmuno': return { perd: n('li-perd'), tev: k('li-tev'), morb: k('li-morb'), famAlto: k('li-fam'), les: k('li-les'), al: v('li-al'), acl: v('li-acl'), b2: v('li-b2'), dos: k('li-dos'),
        fvl: v('li-fvl') === 'no' ? '' : v('li-fvl'), pt: v('li-pt') === 'no' ? '' : v('li-pt'), at: k('li-at'), pc: k('li-pc'), ps: k('li-ps'), ana: v('li-ana'), dna: v('li-dna'), ro: v('li-ro'), c34: k('li-c34'), tpo: v('li-tpo'), tsh: n('li-tsh') };
      default: return { emb: k('lx-emb'), hipo: k('lx-hipo'), recur: k('lx-rec'), prur: k('lx-prur'), flujo: v('lx-flujo'), ph: n('lx-ph'), aminas: v('lx-am'), clave: v('lx-cg'), lacto: v('lx-lac'), gard: v('lx-gar'),
        nugent: n('lx-nug'), donders: n('lx-don'), lev: v('lx-lev'), tv: v('lx-tv'), leuco: v('lx-leu'), sgb: v('lx-sgb'), ct: v('lx-ct'), ng: v('lx-ng'), tvn: v('lx-tvn'), mg: v('lx-mg'), uu: v('lx-uu') };
    }
  }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, fs = form(c);
    cont.innerHTML = '<p class="ayuda">Flujo: elegí el cuadro → qué pedir según el cuadro → cargá los resultados → interpretación, causa probable y conducta. Usá siempre el rango de referencia de tu laboratorio.</p>' +
      '<div class="form">' + c.sel('lb-cuadro', CUADROS, 'Cuadro clínico') + '</div>' +
      CUADROS.map(function (q) { return '<div id="lb-s-' + q[0] + '" data-lb="' + q[0] + '" hidden>' + fs[q[0]] + '</div>'; }).join('') +
      '<div id="lb-o" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · OMS 2024 · ADA · ATA 2017 · ASRM 2020/2026 · ESHRE (IOP 2024, RPL 2022) · Guía internacional SOMP 2023 · Endocrine Society · NICE NG23 · ACOG PB 197 · ACR 2020 · CDC STI 2021.</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), esFull = !opts || opts.esFull !== false;
    function act() {
      var q = L.v('lb-cuadro') || 'rutina';
      cont.querySelectorAll('[data-lb]').forEach(function (s) { s.hidden = s.getAttribute('data-lb') !== q; });
      var r = evaluar(q, leer(q, L)), h = [];
      h.push(F('Qué pedir', c.ul(r.pedir), '', 'neutro'));
      r.filas.forEach(function (f) { h.push(F(f[0], f[1], f[2], f[3])); });
      if (r.noPedir.length) h.push(F('No pedir de rutina', c.ul(r.noPedir), '', 'neutro'));
      if (r.conducta.length) h.push(esFull ? F('Conducta', c.ul(r.conducta), 'Sugerencia CaVeSal®.', 'ambar') : opts.bloqueo('Conducta en la versión completa'));
      cont.querySelector('#lb-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.laboratorio = { CUADROS: CUADROS, evaluar: evaluar, anemia: anemia, render: render };
})(window);
