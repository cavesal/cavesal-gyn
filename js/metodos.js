/* CaVeSal® GYN · Métodos anticonceptivos: catálogo por duración, índice de Pearl, esquemas y elección según el perfil (US MEC 2024).
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var C = function () { return w.GYN.comun; };

  // Pearl: embarazos por 100 mujeres en el primer año, uso perfecto / uso típico.
  // O = OMS, Planificación familiar: manual mundial 2018 (apéndice A). T = Trussell J. Contraception 2011;83:397-404.
  var GRUPOS = [['corta', 'Hormonales de corta duración'], ['larga', 'Larga duración (LARC)'], ['barrera', 'Barrera'], ['natural', 'Naturales (conocimiento de la fertilidad)'], ['mela', 'Lactancia (MELA)'], ['emergencia', 'Emergencia'], ['definitivo', 'Definitivos']];
  var M = [
    { id: 'aoc', g: 'corta', n: 'Píldora combinada (AOC)', mec: 'ahc', p: [0.3, 9, 'T'], dur: 'Diaria', comp: 'Etinilestradiol 20 a 35 µg o estradiol/valerato de estradiol + progestágeno',
      uso: ['Secuencial 21/7: 21 activas y 7 días de descanso.', 'Secuencial 24/4: 24 activas y 4 de descanso o placebo (menos fluctuación hormonal).', 'Extendido: hasta 6 meses seguidos con descanso breve (OMS 2026).', 'Continuo: sin descanso hasta 1 año, luego reevaluar (OMS 2026). Sangrado irregular frecuente al inicio.'] },
    { id: 'pop', g: 'corta', n: 'Píldora de solo progestágeno', mec: 'pop', p: [0.3, 7, 'O'], dur: 'Diaria, sin descanso', comp: 'Desogestrel 75 µg, drospirenona 4 mg, levonorgestrel o linestrenol',
      uso: ['Toma continua sin pausa.', 'De elección en la lactancia y cuando hay contraindicación de estrógenos.', 'Desogestrel y drospirenona inhiben la ovulación y toleran 12 a 24 h de retraso; las de levonorgestrel, solo 3 h.'] },
    { id: 'parche', g: 'corta', n: 'Parche combinado', mec: 'ahc', p: [0.3, 7, 'O'], dur: 'Semanal', comp: 'Etinilestradiol + norelgestromina',
      uso: ['Un parche por semana durante 3 semanas y 1 semana libre.', 'Menor eficacia con peso de 90 kg o más.'] },
    { id: 'anillo', g: 'corta', n: 'Anillo vaginal combinado', mec: 'ahc', p: [0.3, 7, 'O'], dur: 'Mensual', comp: 'Etinilestradiol + etonogestrel',
      uso: ['3 semanas colocado y 1 semana sin anillo.'] },
    { id: 'inymes', g: 'corta', n: 'Inyectable mensual combinado', mec: 'ahc', cic: true, p: [0.05, 3, 'O'], dur: 'Cada 30 días (± 3 días)', comp: 'Mesigyna: enantato de noretisterona 50 mg + valerato de estradiol 5 mg (Bayer, ex Schering). Cyclofem: acetato de medroxiprogesterona 25 mg + cipionato de estradiol 5 mg',
      uso: ['Inyección intramuscular el mismo día de cada mes.', 'No comercializados en Estados Unidos (Lunelle fue retirado); aprobados en América Latina.', 'El US MEC no los evalúa y la OMS los clasifica aparte: se muestra la categoría de los combinados como referencia de precaución.'] },
    { id: 'ampd', g: 'corta', n: 'Inyectable trimestral (AMPD)', mec: 'ampd', p: [0.2, 6, 'T'], dur: 'Cada 13 semanas (hasta 15)', comp: 'Acetato de medroxiprogesterona 150 mg IM o 104 mg SC',
      uso: ['Retorno de la fertilidad demorado (hasta 10 meses).', 'Pérdida de densidad ósea reversible: no es motivo para limitar el uso.'] },
    { id: 'imp1', g: 'larga', n: 'Implante de 1 varilla', mec: 'imp', p: [0.05, 0.05, 'T'], dur: '5 años (FDA 2026; OMS 2026)', comp: 'Etonogestrel 68 mg (Implanon NXT, Nexplanon)',
      uso: ['Inserción subdérmica en el brazo no dominante.', 'El método más eficaz. Sangrado irregular es el efecto más común.'] },
    { id: 'imp2', g: 'larga', n: 'Implante de 2 varillas', mec: 'imp', p: [0.1, 0.1, 'O'], dur: '5 años', comp: 'Levonorgestrel 2 × 75 mg (Jadelle)', uso: ['Menor eficacia con peso de 80 kg o más a partir del cuarto año (OMS).'] },
    { id: 'lng52', g: 'larga', n: 'DIU hormonal 52 mg', mec: 'lng', p: [0.5, 0.7, 'O'], dur: '8 años (FDA; SFP)', comp: 'Levonorgestrel 52 mg (Mirena, Liletta)',
      uso: ['También tratamiento del sangrado menstrual abundante y protección endometrial en la THM (5 años para este fin).', 'DIU de levonorgestrel 19,5 mg (Kyleena): 5 años. 13,5 mg (Jaydess): 3 años.'] },
    { id: 'cu', g: 'larga', n: 'DIU de cobre T380A', mec: 'cu', p: [0.6, 0.8, 'O'], dur: '10 años (FDA) · hasta 12 años (OMS)', comp: 'Cobre 380 mm²',
      uso: ['Sin hormonas. Puede aumentar el sangrado y la dismenorrea.', 'Multiload Cu 375: 5 años.', 'Anticoncepción de emergencia hasta 5 días después del coito.', 'Colocado a los 40 años o más puede quedar hasta la menopausia.'] },
    { id: 'cuag', g: 'larga', n: 'DIU de cobre con plata', mec: 'cu', p: [0.6, 0.8, 'O'], dur: '5 años', comp: 'Hilo de cobre con núcleo de plata (Nova T 380, Novaplus T 380 Ag)',
      uso: ['La plata no es un metal aislado: es el núcleo del hilo de cobre y evita su fragmentación.', 'Efecto bactericida de la plata descrito in vitro y por el fabricante; en la cohorte EURAS-LCS12 (2026) no hubo diferencias en EPI ni en embarazo frente al cobre estándar.', 'Eficacia de la categoría DIU de cobre (sin cifra propia en la tabla OMS).'] },
    { id: 'cuau', g: 'larga', n: 'DIU de cobre con oro', mec: 'cu', p: [0.6, 0.8, 'O'], dur: '5 años', comp: 'Hilo de cobre con núcleo de oro',
      uso: ['Sin ventajas demostradas en EPI ni en embarazo frente al cobre estándar (EURAS-LCS12 2026).', 'Eficacia de la categoría DIU de cobre.'] },
    { id: 'condm', g: 'barrera', n: 'Preservativo masculino', mec: null, p: [2, 18, 'T'], dur: 'Cada relación', comp: 'Látex o poliuretano', uso: ['Único método que protege de las ITS: recomendar doble protección.'] },
    { id: 'condf', g: 'barrera', n: 'Preservativo femenino', mec: null, p: [5, 21, 'T'], dur: 'Cada relación', comp: 'Nitrilo o poliuretano', uso: ['Protege de las ITS.'] },
    { id: 'diaf', g: 'barrera', n: 'Diafragma con espermicida', mec: null, p: [6, 12, 'T'], dur: 'Cada relación', comp: 'Silicona', uso: ['Dejar 6 horas después del coito.'] },
    { id: 'esperm', g: 'barrera', n: 'Espermicidas', mec: null, p: [18, 28, 'T'], dur: 'Cada relación', comp: 'Nonoxinol-9', uso: ['No usar con riesgo alto de VIH (irritación de la mucosa).'] },
    { id: 'calend', g: 'natural', n: 'Calendario (Ogino-Knaus)', mec: null, p: null, dur: 'Cada ciclo', comp: 'Registro de 6 a 12 ciclos',
      uso: ['Primer día fértil = ciclo más corto − 18. Último día fértil = ciclo más largo − 11.', 'La OMS no informa una tasa confiable de eficacia.'] },
    { id: 'collar', g: 'natural', n: 'Días fijos (Collar del Ciclo)', mec: null, p: [5, 12, 'O'], dur: 'Cada ciclo', comp: 'Collar de cuentas de colores',
      uso: ['Solo para ciclos de 26 a 32 días.', 'Días 8 a 19 del ciclo: fértiles, evitar el coito sin protección.'] },
    { id: 'billings', g: 'natural', n: 'Moco cervical (Billings)', mec: null, p: [3, 23, 'O'], dur: 'Diario', comp: 'Observación del moco', uso: ['Fértil desde el primer moco hasta 3 días después del día pico (moco elástico y transparente).'] },
    { id: 'dosdias', g: 'natural', n: 'Método de los Dos Días', mec: null, p: [4, 14, 'O'], dur: 'Diario', comp: 'Secreción hoy o ayer', uso: ['Si hubo secreción hoy o ayer, el día es fértil.'] },
    { id: 'temp', g: 'natural', n: 'Temperatura basal', mec: null, p: null, dur: 'Diario', comp: 'Termómetro al despertar', uso: ['Infértil desde el tercer día de temperatura elevada (0,2 a 0,5 °C) hasta la menstruación. Solo identifica el final de la fase fértil.', 'La OMS no informa una tasa confiable de eficacia aislada.'] },
    { id: 'sinto', g: 'natural', n: 'Sintotérmico', mec: null, p: [0.4, 2, 'T/O'], dur: 'Diario', comp: 'Temperatura + moco + calendario', uso: ['El más eficaz de los naturales con uso correcto.'] },
    { id: 'coito', g: 'natural', n: 'Coito interrumpido', mec: null, p: [4, 20, 'O'], dur: 'Cada relación', comp: '—', uso: ['No protege de ITS.'] },
    { id: 'mela', g: 'mela', n: 'Método de la lactancia y amenorrea (MELA)', mec: null, p: [0.9, 2, 'O'], dur: 'Hasta 6 meses posparto', comp: 'Tres condiciones simultáneas',
      uso: ['1) Amenorrea. 2) Lactancia exclusiva o casi exclusiva, día y noche. 3) Menos de 6 meses posparto.', 'Si falla cualquiera de las tres: iniciar otro método (DIU, implante o solo progestágeno).'] },
    { id: 'ae', g: 'emergencia', n: 'Anticoncepción de emergencia', mec: null, p: null, dur: 'Dosis única', comp: 'Levonorgestrel 1,5 mg · acetato de ulipristal 30 mg · DIU de cobre',
      uso: ['Levonorgestrel 1,5 mg: hasta 72 h (eficacia menor hasta 120 h). Con IMC mayor de 30 puede ser menos eficaz.', 'Ulipristal 30 mg: hasta 120 h; esperar 5 días para reiniciar hormonales.', 'DIU de cobre: hasta 5 días; el más eficaz y queda como método.', 'OMS 2018: con un coito en la segunda o tercera semana del ciclo, 8 embarazos cada 100 sin método; menos de 1 con ulipristal, 1 con levonorgestrel.'] },
    { id: 'ltb', g: 'definitivo', n: 'Ligadura o salpingectomía bilateral', mec: null, p: [0.5, 0.5, 'T'], dur: 'Permanente', comp: 'Laparoscópica o en la cesárea',
      uso: ['Salpingectomía bilateral: preferida por reducir el riesgo de cáncer de ovario seroso (ACOG CO 774).', 'Consentimiento informado y asesoría sobre la irreversibilidad.'] },
    { id: 'vasec', g: 'definitivo', n: 'Vasectomía', mec: null, p: [0.10, 0.15, 'T'], dur: 'Permanente', comp: 'Ambulatoria', uso: ['Usar otro método hasta confirmar azoospermia (espermograma a los 3 meses).'] }
  ];

  var COL = { 1: 'verde', 2: 'ambar', 3: 'naranja', 4: 'rojo' };

  // Perfil → selección del US MEC (mec.js). d: { edad, lact, tabaco, aura, hta, tev, tromb, mama, aaf, obes }
  function perfil(d) {
    var s = {};
    if (d.lact) s.lactancia = d.lact;
    if (d.tabaco) s.tabaco = d.tabaco;
    if (d.aura) s.cefalea = 'migranaCon';
    if (d.hta) s.hta = d.hta;
    if (d.tev) s.tev = d.tev;
    if (d.tromb) s.trombofilia = 'si';
    if (d.mama) s.mama = 'actual';
    if (d.aaf) s.les = 'aaf';
    if (d.obes) s.obesidad = 'imc30';
    return s;
  }

  function evaluar(d) {
    var sel = perfil(d), mec = w.GYN.mec.calcular({ edad: d.edad, uso: 'iniciacion', sel: sel }), cat = {};
    w.GYN.mec.METODOS.forEach(function (k) { cat[k] = mec.metodos[k] ? mec.metodos[k].cat : null; });
    var flags = [];
    if (d.tabaco === 'mayor35mas15') flags.push('35 años o más y 15 o más cigarrillos por día');
    else if (d.tabaco === 'mayor35menos15') flags.push('35 años o más y fumadora (categoría 3)');
    if (d.aura) flags.push('migraña con aura');
    if (d.tev === 'sinAltoRiesgo' || d.tev === 'profAlto') flags.push('tromboembolia venosa con riesgo alto de recurrencia');
    if (d.hta === 'h160' || d.hta === 'vascular') flags.push('hipertensión de 160/100 o más o con enfermedad vascular');
    if (d.lact === 'l21' || d.lact === 'l21_30') flags.push('lactancia en el primer mes');
    if (d.tromb) flags.push('trombofilia conocida');
    if (d.aaf) flags.push('lupus con anticuerpos antifosfolipídicos');
    if (d.mama) flags.push('cáncer de mama actual (contraindica también los hormonales de solo progestágeno)');
    var sinEstrogeno = cat.ahc !== null && cat.ahc >= 3;
    var lista = M.map(function (m) { return { m: m, cat: m.mec ? cat[m.mec] : null }; });
    if (d.sinHormonas) lista = lista.filter(function (x) { return ['aoc', 'pop', 'parche', 'anillo', 'inymes', 'ampd', 'imp1', 'imp2', 'lng52'].indexOf(x.m.id) < 0; });
    if (d.grupo) lista = lista.filter(function (x) { return x.m.g === d.grupo; });
    var sug = [];
    if (sinEstrogeno) sug.push('No usar estrógenos (categoría ' + cat.ahc + ' para los combinados): ' + (flags.length ? flags.join('; ') : 'ver el MEC') + '. Opciones: DIU de cobre, DIU hormonal, implante o píldora de solo progestágeno según su categoría.');
    if (d.lact) sug.push('Lactancia: priorizar métodos sin estrógenos (solo progestágeno, implante, DIU) o MELA si se cumplen las tres condiciones.');
    if (d.vih) sug.push('VIH en tratamiento antirretroviral con carga viral suprimida: la OMS (2025) recomienda ofrecer lactancia materna y sostener la adherencia; revisar interacciones del TAR con implantes y combinados (ver el MEC).');
    if (d.edad !== null && d.edad < 20) sug.push('Adolescente: los LARC son seguros (categoría 1 a 2) y los más eficaces; sumar preservativo.');
    if (!sug.length) sug.push('Sin contraindicaciones en el perfil cargado: elegir según preferencia, priorizando la eficacia (LARC) y sumando preservativo si hay riesgo de ITS.');
    return { cat: cat, lista: lista, flags: flags, sinEstrogeno: sinEstrogeno, sugerencias: sug };
  }

  function pearl(p) { if (!p) return 'Sin dato confiable'; return String(p[0]).replace('.', ',') + ' / ' + String(p[1]).replace('.', ','); }

  function render(cont, T, opts) {
    var c = C(), F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    cont.innerHTML =
      '<p class="ayuda">Catálogo por duración con índice de Pearl (uso perfecto / uso típico) y la categoría US MEC 2024 para el perfil cargado. Para todas las condiciones, abrí <a href="#mec">Elegibilidad de métodos (MEC)</a>.</p>' +
      c.grupo('Perfil', '<div class="grid2">' + c.campo('mt-edad', 'Edad', 'años', '1') +
        c.sel('mt-lact', [['', 'No amamanta'], ['l21', 'Amamanta, menos de 21 días posparto'], ['l21_30', 'Amamanta, 21 a 30 días'], ['l30_42', 'Amamanta, 30 a 42 días'], ['l42', 'Amamanta, más de 42 días']], 'Lactancia') +
        c.sel('mt-tab', [['', 'No fuma'], ['menor35', 'Fuma, menos de 35 años'], ['mayor35menos15', 'Fuma, 35 o más, menos de 15/día'], ['mayor35mas15', 'Fuma, 35 o más, 15 o más/día']], 'Tabaco') +
        c.sel('mt-hta', [['', 'Sin HTA'], ['controlada', 'HTA controlada'], ['h140', '140-159 / 90-99'], ['h160', '160/100 o más'], ['vascular', 'Con enfermedad vascular']], 'Hipertensión') +
        c.sel('mt-tev', [['', 'Sin TEV'], ['sinBajoRiesgo', 'TEV previa, bajo riesgo de recurrencia'], ['sinAltoRiesgo', 'TEV previa, alto riesgo de recurrencia'], ['familiar', 'TEV en familiar de primer grado']], 'Tromboembolia venosa') +
        c.sel('mt-g', [['', 'Todas las categorías']].concat(GRUPOS), 'Mostrar') + '</div>' +
        c.chk('mt-aura', 'Migraña con aura') + c.chk('mt-tro', 'Trombofilia conocida') + c.chk('mt-aaf', 'Lupus con anticuerpos antifosfolipídicos') + c.chk('mt-mama', 'Cáncer de mama actual') +
        c.chk('mt-obe', 'IMC de 30 o más') + c.chk('mt-vih', 'VIH en TAR con carga viral suprimida') + c.chk('mt-sh', 'Prefiere un método sin hormonas')) +
      '<div id="mt-o" class="resultados" aria-live="polite"></div>' +
      '<p class="ayuda">Ventana fértil: 6 días, los 5 previos a la ovulación y el día de la ovulación (Wilcox AJ et al. N Engl J Med 1995;333:1517-21).</p>' +
      '<p class="etiqueta">Tabla propia CaVeSal® · Índice de Pearl: OMS, Planificación familiar: manual mundial para proveedores 2018 (O) · Trussell J. Contraception 2011;83:397-404 (T)</p>' +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: CDC US MEC 2024 (dominio público) · CDC US SPR 2024 · OMS 2026 (uso extendido y continuo de AOC; implante 5 años) · FDA 2026 (Nexplanon 5 años) · SFP 2022 (uso extendido de LARC) · OMS hoja informativa DIU · FSRH 2023 (anticoncepción intrauterina) · EURAS-LCS12 2026 · OMS 2025 (VIH y lactancia) · ACOG CO 774</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = c.lector(cont), q = function (s) { return cont.querySelector(s); };
    function act() {
      var r = evaluar({ edad: L.n('mt-edad'), lact: L.v('mt-lact'), tabaco: L.v('mt-tab'), hta: L.v('mt-hta'), tev: L.v('mt-tev'), aura: L.c('mt-aura'), tromb: L.c('mt-tro'), aaf: L.c('mt-aaf'), mama: L.c('mt-mama'), obes: L.c('mt-obe'), vih: L.c('mt-vih'), sinHormonas: L.c('mt-sh'), grupo: L.v('mt-g') });
      var h = [];
      if (r.flags.length) h.push(F('Alertas para estrógenos', c.ul(r.flags), '', r.sinEstrogeno ? 'rojo' : 'ambar'));
      h.push(esFull ? F('Sugerencia', c.ul(r.sugerencias), 'Sugerencia CaVeSal®.', r.sinEstrogeno ? 'naranja' : 'verde') : opts.bloqueo('Sugerencia de método en la versión completa'));
      GRUPOS.forEach(function (g) {
        var xs = r.lista.filter(function (x) { return x.m.g === g[0]; });
        if (!xs.length) return;
        var filas = xs.map(function (x) {
          var m = x.m, k = x.cat;
          var cel = k ? '<span class="mec-c c' + k + '">' + k + '</span>' : '—';
          return '<tr><td><strong>' + m.n + '</strong><br><small>' + m.comp + '</small></td><td>' + pearl(m.p) + (m.p ? ' <small>(' + m.p[2] + ')</small>' : '') + '</td><td>' + m.dur + '</td><td>' + cel + '</td></tr>' +
            '<tr class="mt-uso"><td colspan="4">' + c.ul(m.uso) + '</td></tr>';
        }).join('');
        h.push('<div class="fila neutro"><div class="f-etq">' + g[1] + '</div><div class="f-val"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Método</th><th>Pearl perfecto / típico</th><th>Duración</th><th>MEC</th></tr></thead><tbody>' + filas + '</tbody></table></div></div></div>');
      });
      q('#mt-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.metodos = { METODOS: M, GRUPOS: GRUPOS, evaluar: evaluar, perfil: perfil, render: render };
})(window);
