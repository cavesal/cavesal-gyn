/* CaVeSal® GYN · Pubertad precoz: Tanner, edad ósea, ecografía pélvica (útero, relación cuerpo/cuello, ovarios, folículos),
   perfil hormonal, origen probable y conducta (freno del eje).
   Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® (HC) · MSPyBS Paraguay (2025) · Carel JC et al. Pediatrics 2009;123:e752-e762 ·
   Latronico AC et al. Lancet Diabetes Endocrinol 2016;4:265-274 · Marshall WA, Tanner JM. Arch Dis Child 1969;44:291-303 ·
   Greulich & Pyle (1959) · Calcaterra V et al. 2021 · Kim et al., Korean CPP Guideline 2023 · Nguyen et al. 2021 · Eugster EA 2015 ·
   Speiser PW et al. JCEM 2018;103:4043-4088.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';

  var TANNER_M = [['', 'Elegí'], ['1', 'M1 · prepuberal (solo pezón)'], ['2', 'M2 · botón mamario (telarquia)'], ['3', 'M3 · mayor aumento sin separación de contornos'], ['4', 'M4 · areola en montículo secundario'], ['5', 'M5 · maduro']];
  var TANNER_P = [['', 'Elegí'], ['1', 'P I · sin vello'], ['2', 'P II · escaso y fino'], ['3', 'P III · más oscuro y rizado'], ['4', 'P IV · tipo adulto en área reducida'], ['5', 'P V · tipo adulto completo']];

  function coma(n) { return String(n).replace('.', ','); }
  function r1(n) { return Math.round(n * 10) / 10; }
  function vol(l, ap, t) { return l && ap && t ? r1(l * ap * t * 0.523 / 1000) : null; } // mm → mL

  // Definición: caracteres sexuales secundarios antes de los 8 años o menarca antes de los 9.
  function definicion(d) {
    if (d.edad === null) return null;
    var m = +d.m || 0, p = +d.p || 0, signos = m >= 2 || p >= 2;
    if (d.menarca && d.edad < 9) return { precoz: true, txt: 'Menarca antes de los 9 años' };
    if (signos && d.edad < 8) return { precoz: true, txt: (m >= 2 ? 'Telarquia' : 'Adrenarca') + ' antes de los 8 años' };
    if (signos || d.menarca) return { precoz: false, txt: 'Desarrollo puberal a edad no precoz según la definición' };
    return { precoz: false, txt: 'Sin caracteres sexuales secundarios (prepuberal)' };
  }

  // Edad ósea (Greulich & Pyle): adelanto mayor de 1,5–2 años confirma impacto biológico.
  function edadOsea(edad, eo) {
    if (edad === null || eo === null) return null;
    var dif = r1(eo - edad);
    return { dif: dif, adelantada: dif > 1.5, txt: (dif >= 0 ? '+' : '') + coma(dif) + ' años' };
  }

  // Ecografía pélvica: 0 prepuberal, 1 zona gris, 2 puberal (signo de estrogenización).
  function ecografia(e) {
    var s = [], volU = e.volU !== null ? e.volU : vol(e.long, e.ap, e.tr);
    function add(etq, nivel, txt) { s.push({ etq: etq, nivel: nivel, txt: txt }); }
    if (e.long !== null) add('Longitud uterina', e.long >= 40 ? 2 : e.long >= 35 ? 1 : 0, coma(e.long) + ' mm (prepuberal < 35–40 · puberal ≥ 40–45)');
    if (volU !== null) add('Volumen uterino', volU >= 3 ? 2 : volU >= 2 ? 1 : 0, coma(volU) + ' mL (prepuberal < 2–3 · puberal ≥ 3–4)');
    if (e.rel) add('Relación cuerpo/cuello', e.rel === '2:1' || e.rel === '3:1' ? 2 : 0, e.rel + ' (prepuberal 1:2 o 1:1 · puberal 2:1 o 3:1)');
    if (e.conf) add('Configuración', e.conf === 'piriforme' ? 2 : 0, e.conf === 'piriforme' ? 'Piriforme' : 'Tubular');
    if (e.endo) add('Línea endometrial', e.endo === 'visible' && (e.endoMm === null || e.endoMm > 2) ? 2 : e.endo === 'visible' ? 1 : 0, e.endo === 'visible' ? 'Visible' + (e.endoMm !== null ? ', ' + coma(e.endoMm) + ' mm' : '') : 'No visible');
    var ov = [e.ovD, e.ovI].filter(function (x) { return x !== null; });
    if (ov.length) { var mx = Math.max.apply(null, ov); add('Volumen ovárico (el mayor)', mx > 3 ? 2 : mx > 1.5 ? 1 : 0, coma(mx) + ' mL (prepuberal < 1,5–2 · puberal > 2–3)'); }
    if (e.fol !== null || e.folMax !== null) {
      var pub = (e.fol !== null && e.fol >= 6) || (e.folMax !== null && e.folMax > 10);
      add('Folículos', pub ? 2 : 0, (e.fol !== null ? e.fol + ' de 4–8 mm' : '') + (e.folMax !== null ? (e.fol !== null ? ', ' : '') + 'mayor ' + coma(e.folMax) + ' mm' : '') + ' (puberal: 6 o más de 4–8 mm, o dominante > 10 mm)');
    }
    if (!s.length) return null;
    var p = s.filter(function (x) { return x.nivel === 2; }).length, g = s.filter(function (x) { return x.nivel === 1; }).length;
    var uteroPuberal = s.some(function (x) { return (x.etq === 'Relación cuerpo/cuello' || x.etq === 'Línea endometrial') && x.nivel === 2; });
    var concl = p >= 2 || uteroPuberal ? 'Con signos ecográficos de estrogenización' : p === 1 || g ? 'Signos ecográficos aislados o en zona gris' : 'Sin signos ecográficos evidentes de estrogenización';
    return { signos: s, puberales: p, gris: g, volU: volU, uteroPuberal: uteroPuberal, estrogenizada: p >= 2 || uteroPuberal, concl: concl };
  }

  // Perfil hormonal y origen probable.
  function origen(d, eco, eo) {
    var notas = [], tit = '', color = 'neutro', tipo = '';
    var m = +d.m || 0, p = +d.p || 0;
    if (d.virilizacion) notas.push('Virilización (contrasexual): orienta a pubertad precoz periférica; descartar origen adrenal u ovárico androgénico.');
    if (d.lh !== null) {
      if (d.lh >= 0.3) {
        if (d.e2alto || (eco && eco.estrogenizada)) {
          tipo = 'ppc'; tit = 'Pubertad precoz central probable'; color = 'rojo';
          notas.push('LH basal ≥ 0,3 mUI/mL con ' + (d.e2alto ? 'estradiol elevado' : 'útero estrogenizado') + ': eje activado.');
          if (d.lhPico === null) notas.push('Confirmar con test de GnRH (pico de LH > 5 mUI/mL).');
        } else { tit = 'LH basal ≥ 0,3 mUI/mL'; color = 'ambar'; notas.push('Correlacionar con estradiol y ecografía; confirmar con test de GnRH.'); }
      } else {
        tit = 'Eje inhibido (LH basal < 0,3 mUI/mL): evaluar periférica'; color = 'ambar';
      }
    }
    if (d.lhPico !== null) {
      if (d.lhPico > 5) { tipo = 'ppc'; tit = 'Pubertad precoz central confirmada (pico de LH > 5 mUI/mL)'; color = 'rojo'; }
      else notas.push('Pico de LH tras GnRH ' + coma(d.lhPico) + ' mUI/mL: no confirma activación central.');
    }
    var ohp = d.ohp, ohpTxt = '';
    if (ohp !== null) {
      ohpTxt = ohp < 1 ? 'descarta déficit mayor de 21-hidroxilasa' : ohp <= 2 ? 'zona gris: requiere test de ACTH' : ohp <= 10 ? 'alta sospecha de HSC no clásica' : 'HSC prácticamente inequívoca, o sospecha de neoplasia adrenal (agregar imagen suprarrenal)';
      notas.push('17-OHP basal ' + coma(ohp) + ' ng/mL: ' + ohpTxt + '.');
    }
    if (d.ohpActh !== null) notas.push('17-OHP a los 60 min de ACTH ' + coma(d.ohpActh) + ' ng/mL: ' + (d.ohpActh > 10 ? 'confirma HSC no clásica por déficit de 21-hidroxilasa.' : 'no confirma HSC no clásica.'));
    if (tipo !== 'ppc' && (d.lh === null || d.lh < 0.3)) {
      if ((ohp !== null && ohp > 2) || d.ohpActh > 10 || (d.dheasAlto && ohp !== null && ohp > 1)) { tipo = 'adrenal'; tit = 'Pubertad precoz periférica de origen adrenal probable'; color = 'rojo'; }
      else if (d.dheasAlto && ohp === null) { tipo = 'adrenal?'; tit = 'DHEA-S elevada: completar 17-OHP'; color = 'ambar'; }
      else if (d.e2alto && (ohp === null || ohp < 1)) { tipo = 'ovarico'; tit = 'Pubertad precoz periférica de origen ovárico probable'; color = 'rojo'; notas.push('Estradiol elevado con 17-OHP normal: quiste folicular autónomo, tumor de células de la granulosa o McCune-Albright.'); }
    }
    // Variantes no progresivas.
    var eoNo = !eo || !eo.adelantada, ecoPre = !eco || (!eco.estrogenizada && eco.puberales === 0);
    if (!tipo && m >= 2 && p <= 1 && !d.menarca && eoNo && ecoPre && (d.lh === null || d.lh < 0.3)) {
      tipo = 'telarquia'; tit = 'Compatible con telarquia prematura aislada'; color = 'ambar';
      notas.push('Sin adelanto de edad ósea ni estrogenización uterina: variante no progresiva. Control clínico de la progresión.');
    }
    if (!tipo && p >= 2 && m <= 1 && !d.menarca && ecoPre && (ohp === null || ohp < 1) && !d.virilizacion) {
      tipo = 'adrenarca'; tit = 'Compatible con adrenarca prematura idiopática'; color = 'ambar';
      notas.push('Útero y ovarios prepuberales con adrenarca aislada: descarta origen gonadal y orienta a la suprarrenal. Confirmar DHEA-S acorde a Tanner II–III y 17-OHP basal normal.');
    }
    if (!tit && !notas.length) return null;
    return { tipo: tipo, tit: tit || 'Completar el perfil hormonal', color: color, notas: notas };
  }

  function conducta(d, or, eo, eco) {
    var c = [];
    if (!or) return c;
    if (or.tipo === 'ppc') {
      c.push('<strong>RMN cerebral obligatoria</strong>' + (d.edad !== null && d.edad < 6 ? ' (menor de 6 años: mayor riesgo de lesión del SNC: hamartoma, glioma, hidrocefalia).' : ' para descartar lesión del SNC.'));
      if (d.lhPico === null) c.push('Test de GnRH: pico de LH > 5 mUI/mL confirma.');
      c.push('Derivar a endocrinología pediátrica.');
      c.push('<strong>Freno del eje con agonistas de GnRH depot:</strong> leuprolide 3,75–7,5 mg IM/SC cada 28 días o 11,25 mg cada 84 días; triptorelina 3,75 mg IM cada 28 días o 11,25 mg cada 12 semanas.');
      c.push('Objetivo: velocidad de crecimiento < 4–5 cm/año, estabilizar Tanner y preservar la talla adulta. Suspender al alcanzar edad ósea de 11,0–11,5 años.');
    } else if (or.tipo === 'adrenal' || or.tipo === 'adrenal?') {
      if (d.ohp !== null && d.ohp >= 1 && d.ohp <= 2 && d.ohpActh === null) c.push('Test de estímulo con ACTH (250 µg IV/IM, 17-OHP a los 60 min): > 10 ng/mL confirma HSC no clásica.');
      if (d.ohp !== null && d.ohp > 10) c.push('17-OHP > 10–20 ng/mL: agregar ecografía, TC o RMN suprarrenal para descartar neoplasia.');
      c.push('Derivar a endocrinología pediátrica.');
      c.push('<strong>HSC no clásica, freno adrenal:</strong> hidrocortisona 8–12 mg/m²/día en 2–3 tomas orales, la mayor dosis nocturna. Indicada ante adrenarca acelerada sintomática, edad ósea adelantada > 1,5–2 años, virilización o compromiso de la talla pronosticada.');
      c.push('Seguimiento: velocidad de crecimiento, edad ósea anual y 17-OHP, androstenediona y DHEA-S periódicos; evitar hipercortisolismo iatrogénico.');
    } else if (or.tipo === 'ovarico') {
      c.push('Ecografía pélvica dirigida: quiste folicular autónomo o tumor de células de la granulosa; buscar manchas café con leche y lesiones óseas (McCune-Albright).');
      c.push('Derivar a endocrinología y ginecología infanto-juvenil.');
    } else if (or.tipo === 'telarquia' || or.tipo === 'adrenarca') {
      c.push('Control clínico seriado de Tanner y velocidad de crecimiento. Reevaluar si progresa, se adelanta la edad ósea o aparece estrogenización uterina.');
    } else {
      c.push('Completar LH basal, estradiol y, según la clínica, 17-OHP y DHEA-S; edad ósea por Rx de mano y muñeca izquierda.');
    }
    if (eo && eo.adelantada && or.tipo !== 'ppc' && or.tipo !== 'adrenal') c.push('Edad ósea adelantada ' + eo.txt + ': confirma impacto biológico.');
    if (d.edad !== null && d.edad >= 8 && d.edad < 9 && eco) c.push('Niña de 8 a 9 años: superposición entre patrón prepuberal y puberal temprano; no concluir "eje no activado" con la ecografía sola.');
    return c;
  }

  function informe(e, eco) {
    function v(x, u) { return x !== null && x !== undefined && x !== '' ? coma(x) + (u || '') : '___'; }
    var rel = e.rel || '___', conf = e.conf === 'piriforme' ? 'piriforme' : e.conf === 'tubular' ? 'tubular' : 'tubular/piriforme';
    var endo = e.endo === 'visible' ? 'visible' + (e.endoMm !== null ? ', espesor ' + coma(e.endoMm) + ' mm' : '') : e.endo === 'no' ? 'no visible' : 'no visible / visible, espesor ___ mm';
    return 'Ecografía pélvica transabdominal\n' +
      'Útero: en anteversión, de ' + v(e.long) + ' × ' + v(e.ap) + ' × ' + v(e.tr) + ' mm (longitud × AP × transverso), volumen ' + v(eco && eco.volU) + ' mL. Morfología ' + conf + '. Relación cuerpo/cuello ' + rel + '. Miometrio homogéneo.\n' +
      'Endometrio: ' + endo + '.\n' +
      'Ovario derecho: volumen ' + v(e.ovD) + ' mL. Ovario izquierdo: volumen ' + v(e.ovI) + ' mL. Folículos: ' + v(e.fol) + ' de 4–8 mm, el mayor de ' + v(e.folMax) + ' mm, distribución periférica/difusa.\n' +
      'Fondo de saco: sin líquido libre.\n' +
      'Conclusión: ' + (eco ? (eco.estrogenizada ? 'útero y ovarios con signos ecográficos de estrogenización e inicio de desarrollo puberal.' : eco.puberales || eco.gris ? 'signos ecográficos aislados o en zona gris de estrogenización.' : 'útero y ovarios sin signos ecográficos evidentes de estrogenización puberal significativa.') : '___') + '\n' +
      'Correlacionar con estadio de Tanner y evaluación hormonal (LH, FSH, estradiol) según contexto clínico, especialmente en niñas de 8 a 9 años.';
  }

  function render(cont, T, opts) {
    var c = w.GYN.comun, F = w.GYN.fertilidad.fila;
    cont.innerHTML =
      '<p class="ayuda">Definición: caracteres sexuales secundarios antes de los 8 años (telarquia o adrenarca) o menarca antes de los 9 años.</p>' +
      '<h3 class="sub">1 · Clínica y estadios de Tanner</h3>' +
      '<div class="form">' + c.campo('pp-edad', 'Edad', 'años') + c.sel('pp-m', TANNER_M, 'Tanner mamario') + c.sel('pp-p', TANNER_P, 'Tanner vello púbico') +
        c.campo('pp-vc', 'Velocidad de crecimiento', 'cm/año') + '</div>' +
      c.chk('pp-men', 'Menarca') + c.chk('pp-vir', 'Signos de virilización (clitoromegalia, voz grave, hirsutismo marcado)') +
      '<p class="ayuda">Tanner (Marshall y Tanner 1969): evaluar mamas y vello por separado. La telarquia precede a la menarca en unos 2,5 años.</p>' +
      '<div id="pp-o1" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">2 · Edad ósea</h3>' +
      '<div class="form">' + c.campo('pp-eo', 'Edad ósea (Rx mano y muñeca izquierda, Greulich y Pyle)', 'años') + '</div>' +
      '<div id="pp-o2" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">3 · Ecografía pélvica transabdominal</h3>' +
      c.grupo('Útero', '<div class="grid2">' + c.campo('pp-ul', 'Longitud', 'mm', '1') + c.campo('pp-uap', 'Anteroposterior', 'mm', '1') + c.campo('pp-ut', 'Transverso', 'mm', '1') + c.campo('pp-uv', 'Volumen (si no cargás los 3 diámetros)', 'mL') +
        c.sel('pp-rel', [['', 'Elegí'], ['1:2', '1:2'], ['1:1', '1:1'], ['2:1', '2:1'], ['3:1', '3:1']], 'Relación cuerpo/cuello') +
        c.sel('pp-conf', [['', 'Elegí'], ['tubular', 'Tubular'], ['piriforme', 'Piriforme']], 'Configuración') +
        c.sel('pp-endo', [['', 'Elegí'], ['no', 'No visible'], ['visible', 'Visible']], 'Línea endometrial') + c.campo('pp-em', 'Espesor endometrial', 'mm') + '</div>') +
      c.grupo('Ovarios', '<div class="grid2">' + c.campo('pp-od', 'Volumen ovario derecho', 'mL') + c.campo('pp-oi', 'Volumen ovario izquierdo', 'mL') +
        c.campo('pp-fn', 'Folículos de 4–8 mm (el ovario con más)', 'n', '1') + c.campo('pp-fm', 'Folículo mayor', 'mm') + '</div>') +
      '<div id="pp-o3" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">4 · Perfil hormonal</h3>' +
      '<div class="grid2">' + c.campo('pp-lh', 'LH basal', 'mUI/mL', '0.01') + c.campo('pp-lhp', 'Pico de LH tras GnRH', 'mUI/mL', '0.1') +
        c.campo('pp-ohp', '17-OHP basal', 'ng/mL', '0.01') + c.campo('pp-ohpa', '17-OHP a los 60 min de ACTH', 'ng/mL', '0.1') + '</div>' +
      c.chk('pp-e2', 'Estradiol elevado para la edad según el laboratorio') + c.chk('pp-dhea', 'DHEA-S elevada para la edad (por encima de Tanner II–III)') +
      '<div id="pp-o4" class="resultados" aria-live="polite"></div>' +

      '<h3 class="sub">5 · Conducta</h3>' +
      '<div id="pp-o5" class="resultados" aria-live="polite"></div>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: Guías CaVeSal® · MSPyBS Paraguay (2025) · Carel et al. Pediatrics 2009 · Latronico et al. Lancet Diabetes Endocrinol 2016 · Marshall y Tanner, Arch Dis Child 1969 · Greulich y Pyle 1959 · Calcaterra et al. 2021 · Kim et al., Korean CPP Guideline 2023 · Nguyen et al. 2021 · Eugster 2015 · Speiser et al. JCEM 2018.</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';

    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    var esFull = !opts || opts.esFull !== false;
    function act() {
      var d = { edad: L.n('pp-edad'), m: L.v('pp-m'), p: L.v('pp-p'), menarca: L.c('pp-men'), virilizacion: L.c('pp-vir'), vc: L.n('pp-vc'),
        lh: L.n('pp-lh'), lhPico: L.n('pp-lhp'), ohp: L.n('pp-ohp'), ohpActh: L.n('pp-ohpa'), e2alto: L.c('pp-e2'), dheasAlto: L.c('pp-dhea') };
      var e = { long: L.n('pp-ul'), ap: L.n('pp-uap'), tr: L.n('pp-ut'), volU: L.n('pp-uv'), rel: L.v('pp-rel'), conf: L.v('pp-conf'), endo: L.v('pp-endo'), endoMm: L.n('pp-em'),
        ovD: L.n('pp-od'), ovI: L.n('pp-oi'), fol: L.n('pp-fn'), folMax: L.n('pp-fm') };
      var df = definicion(d), eo = edadOsea(d.edad, L.n('pp-eo')), eco = ecografia(e), or = origen(d, eco, eo);
      var h1 = [];
      if (df) h1.push(F('Definición', '<strong>' + df.txt + '</strong>', '', df.precoz ? 'rojo' : 'verde'));
      else h1.push(F('', 'Cargá la edad y los estadios de Tanner.', '', 'neutro'));
      if (d.vc !== null) h1.push(F('Velocidad de crecimiento', coma(d.vc) + ' cm/año', 'Bajo freno del eje, el objetivo es menos de 4–5 cm/año.', 'neutro'));
      q('#pp-o1').innerHTML = h1.join('');
      q('#pp-o2').innerHTML = eo ? F('Adelanto de edad ósea', '<strong>' + eo.txt + '</strong>', eo.adelantada ? 'Mayor de 1,5–2 años: confirma impacto biológico.' : 'Sin adelanto significativo (umbral 1,5–2 años).', eo.adelantada ? 'rojo' : 'verde') : '<p class="ayuda">Cargá la edad ósea.</p>';
      if (eco) {
        var col = ['verde', 'ambar', 'naranja'];
        q('#pp-o3').innerHTML = eco.signos.map(function (x) { return F(x.etq, x.txt, x.nivel === 2 ? 'Puberal' : x.nivel === 1 ? 'Zona gris' : 'Prepuberal', col[x.nivel]); }).join('') +
          F('Conclusión ecográfica', '<strong>' + eco.concl + '</strong>', 'La ecografía es auxiliar: se interpreta con Tanner y perfil hormonal. Longitud uterina de 3,2 cm: sensibilidad 81,8 % y especificidad 82 % frente a telarquia prematura (Nguyen 2021), referencia y no frontera absoluta. Folículos pequeños aislados no equivalen a activación puberal.', eco.estrogenizada ? 'naranja' : eco.puberales || eco.gris ? 'ambar' : 'verde') +
          F('Informe ecográfico', '<pre class="informe" style="white-space:pre-wrap;font-family:inherit;margin:0">' + informe(e, eco).replace(/</g, '&lt;') + '</pre>', '', 'neutro');
      } else q('#pp-o3').innerHTML = '<p class="ayuda">Cargá las medidas de útero y ovarios.</p>';
      q('#pp-o4').innerHTML = or ? F('Origen probable', '<strong>' + or.tit + '</strong>', or.notas.length ? c.ul(or.notas) : '', or.color) : '<p class="ayuda">Cargá LH basal, estradiol y, si corresponde, 17-OHP y DHEA-S.</p>';
      if (!esFull) { q('#pp-o5').innerHTML = opts.bloqueo('Conducta en la versión completa'); return; }
      var k = conducta(d, or, eo, eco);
      q('#pp-o5').innerHTML = k.length ? F('Conducta', c.ul(k), 'Sugerencia CaVeSal®. La conducta la define el profesional tratante.', or && or.color === 'rojo' ? 'rojo' : 'ambar') : '<p class="ayuda">Definí la clínica y el perfil hormonal para ver la conducta.</p>';
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.pubertad = { definicion: definicion, edadOsea: edadOsea, ecografia: ecografia, origen: origen, conducta: conducta, volumen: vol, render: render };
})(window);
