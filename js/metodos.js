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
    { id: 'aoc', g: 'corta', n: 'Píldora combinada (AOC)', mec: 'ahc', p: [0.3, 9, 'T'], dur: 'Diaria', comp: 'Etinilestradiol 15 a 35 µg + progestágeno (levonorgestrel, norgestimato, desogestrel, gestodeno, drospirenona, dienogest, acetato de ciproterona, clormadinona)',
      uso: ['Secuencial 21/7: 21 activas y 7 días de descanso.', 'Secuencial 24/4: 24 activas y 4 de descanso o placebo (menos fluctuación hormonal).', 'Extendido: hasta 6 meses seguidos con descanso breve (OMS 2026).', 'Continuo: sin descanso hasta 1 año, luego reevaluar (OMS 2026). Sangrado irregular frecuente al inicio.'] },
    { id: 'aoce2', g: 'corta', n: 'Píldora combinada con estradiol', mec: 'ahc', p: [0.3, 9, 'T'], dur: 'Diaria', comp: 'Valerato de estradiol + dienogest (régimen dinámico 26/2) o 17β-estradiol 1,5 mg + acetato de nomegestrol 2,5 mg (24/4)',
      uso: ['Estrógeno idéntico al natural: menor impacto hepático que el etinilestradiol.', 'Eficacia de la categoría AOC (tabla de Trussell).', 'Mismas categorías del US MEC que cualquier combinado.'] },
    { id: 'aoce4', g: 'corta', n: 'Píldora combinada con estetrol (E4)', mec: 'ahc', pt: '1,52 combinado (IC 1,04–2,16) · 0,47 Europa y Rusia · 2,65 EE. UU. y Canadá', dur: 'Diaria, 24/4', comp: 'Estetrol 15 mg + drospirenona 3 mg (24 activas + 4 placebo)',
      uso: ['Estetrol: estrógeno natural fetal, el primero con acción selectiva en tejidos (NEST). Vida media de unas 24 h; se elimina sobre todo por glucuronidación y, a diferencia del etinilestradiol, casi no depende del citocromo P450.',
        'Menor impacto hepático y sobre la coagulación: la SHBG sube 55 % con E4/drospirenona, 74 % con EE/levonorgestrel y 251 % con EE/drospirenona (Douxfils 2020).',
        'Ensayos de fase 3: Pearl 0,47 en Europa y Rusia, 18 a 35 años (Gemzell-Danielsson 2022) y 2,65 en EE. UU. y Canadá, 16 a 35 años (Creinin 2021); análisis combinado de ambos: 1,52 (Jensen 2022).',
        'Todavía no hay datos epidemiológicos de TEV: el US MEC lo clasifica como cualquier combinado.'] },
    { id: 'pop', g: 'corta', n: 'Píldora de solo progestágeno', mec: 'pop', p: [0.3, 7, 'O'], dur: 'Diaria, sin descanso', comp: 'Desogestrel 75 µg, drospirenona 4 mg, levonorgestrel o linestrenol',
      uso: ['Toma continua sin pausa.', 'De elección en la lactancia y cuando hay contraindicación de estrógenos.', 'Desogestrel y drospirenona inhiben la ovulación y toleran 12 a 24 h de retraso; las de levonorgestrel, solo 3 h.'] },
    { id: 'parche', g: 'corta', n: 'Parche combinado', mec: 'ahc', p: [0.3, 7, 'O'], dur: 'Semanal', comp: 'Etinilestradiol + norelgestromina',
      uso: ['Un parche por semana durante 3 semanas y 1 semana libre.', 'Menor eficacia con peso de 90 kg o más.'] },
    { id: 'anillo', g: 'corta', n: 'Anillo vaginal combinado', mec: 'ahc', p: [0.3, 7, 'O'], dur: 'Mensual', comp: 'Etinilestradiol + etonogestrel',
      uso: ['3 semanas colocado y 1 semana sin anillo.'] },
    { id: 'annov', g: 'corta', n: 'Anillo vaginal anual (Annovera)', mec: 'ahc', pt: '2,98 (IC 2,13–4,06) · FDA 2018', dur: '1 año: 13 ciclos con el mismo anillo', comp: 'Acetato de segesterona (Nestorona) 0,15 mg/día + etinilestradiol 0,013 mg/día',
      uso: ['21 días colocado y 7 días fuera; se lava y se vuelve a colocar. Un solo anillo para 13 ciclos.', 'Aprobado por la FDA en 2018; no estudiado de forma adecuada con IMC mayor de 29.', 'Mismas categorías del US MEC que los combinados.'] },
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
    { id: 'aecu', g: 'emergencia', n: 'DIU de cobre de emergencia', mec: null, p: null, pt: 'El más eficaz: menos de 1 embarazo cada 1000', dur: 'Hasta 5 días después del coito', comp: 'DIU de cobre T380A',
      uso: ['Queda como método de larga duración.', 'También rige la categoría del DIU de cobre de la tabla general (sugerencia CaVeSal®).'] },
    { id: 'aeupa', g: 'emergencia', n: 'Ulipristal 30 mg', mec: null, p: null, pt: 'Menos de 1 embarazo cada 100 (OMS 2018)', dur: 'Hasta 120 h, dosis única', comp: 'Acetato de ulipristal 30 mg',
      uso: ['Esperar 5 días para iniciar o reiniciar un método hormonal y usar barrera mientras tanto.'] },
    { id: 'aelng', g: 'emergencia', n: 'Levonorgestrel 1,5 mg', mec: null, p: null, pt: 'Alrededor de 1 embarazo cada 100 (OMS 2018)', dur: 'Hasta 72 h (menos eficaz hasta 120 h)', comp: 'Levonorgestrel 1,5 mg',
      uso: ['Con IMC de 30 o más puede ser menos eficaz.', 'Puede iniciar un método hormonal enseguida.'] },
    { id: 'aeyuzpe', g: 'emergencia', n: 'Método de Yuzpe', mec: null, p: null, pt: 'Menos eficaz que levonorgestrel y ulipristal', dur: 'Hasta 72 h, 2 tomas cada 12 h', comp: 'Píldoras combinadas: 100 µg de EE + 0,5 mg de levonorgestrel por toma',
      uso: ['Más náuseas y vómitos. Usar solo si no hay otra opción.', 'Píldoras por toma según la marca: <a href="#aemergencia">Anticoncepción de emergencia</a>.'] },
    { id: 'aemife', g: 'emergencia', n: 'Mifepristona 10 a 50 mg', mec: null, p: null, pt: 'Opción nueva de la OMS 2026', dur: 'Hasta 5 días después del coito', comp: 'Mifepristona 10 a 50 mg',
      uso: ['Incorporada por la OMS en septiembre de 2026 como opción de emergencia.', 'Sin categoría en el US MEC 2024.'] },
    { id: 'ltb', g: 'definitivo', n: 'Ligadura o salpingectomía bilateral', mec: null, p: [0.5, 0.5, 'T'], dur: 'Permanente', comp: 'Laparoscópica o en la cesárea',
      uso: ['Salpingectomía bilateral: preferida por reducir el riesgo de cáncer de ovario seroso (ACOG CO 774).', 'Consentimiento informado y asesoría sobre la irreversibilidad.'] },
    { id: 'vasec', g: 'definitivo', n: 'Vasectomía', mec: null, p: [0.10, 0.15, 'T'], dur: 'Permanente', comp: 'Ambulatoria', uso: ['Usar otro método hasta confirmar azoospermia (espermograma a los 3 meses).'] }
,
    { id: 'anprog', g: 'mela', n: 'Anillo vaginal de progesterona', mec: null, p: null, pt: 'Tan eficaz como el DIU de cobre mientras la lactancia siga (Sivin 1997; Massai 1999)', dur: '90 días por anillo, hasta 4 anillos seguidos (1 año)', comp: 'Progesterona natural 10 mg/día (Progering)',
      uso: ['Solo con lactancia activa, al menos 4 veces por día.', 'Se coloca entre las 4 y las 9 semanas posparto.', 'Incluido en el MEC de la OMS desde 2015 y en su lista de medicamentos esenciales; aprobado en unos 8 a 9 países de América Latina (ISP Chile).', 'Sin categoría en el US MEC 2024.'] },
    { id: 'spray', g: 'mela', n: 'Spray transdérmico de Nestorona', mec: null, p: null, pt: 'En investigación', dur: 'Diario', comp: 'Acetato de segesterona (Nestorona) en spray sobre la piel',
      uso: ['En investigación: sin aprobación ni categoría de elegibilidad.', 'Progestágeno que no pasa a la leche en forma activa por vía oral: por eso se estudia en la lactancia.'] }
  ];

  // Familias de la vista unificada y fuente de la categoría de cada método.
  var FAMILIAS = [['diu', 'DIU'], ['sp', 'Solo progestágeno'], ['comb', 'Combinados'], ['lact', 'Lactancia'], ['barrera', 'Barrera'], ['emerg', 'Emergencia'], ['ester', 'Esterilización'], ['natural', 'Naturales (conocimiento de la fertilidad)']];
  var FUENTE = {
    cu: 'diu', cuag: 'diu', cuau: 'diu', lng52: 'diu',
    pop: 'sp', imp1: 'sp', imp2: 'sp', ampd: 'sp',
    aoc: 'comb', aoce2: 'comb', aoce4: 'comb', parche: 'comb', anillo: 'comb', annov: 'comb', inymes: 'comb',
    mela: 'lact', anprog: 'lact', spray: 'lact',
    condm: ['barrera', 'bar', 'condon'], condf: ['barrera', 'bar', 'condonInt'], diaf: ['barrera', 'bar', 'diaf'], esperm: ['barrera', 'bar', 'esperm'],
    aecu: ['emerg', 'ae', 'cu'], aeupa: ['emerg', 'ae', 'upa'], aelng: ['emerg', 'ae', 'lng'], aeyuzpe: ['emerg', 'ae', 'yuzpe'], aemife: 'emerg',
    ltb: ['ester', 'est'], vasec: 'ester',
    calend: ['natural', 'fab', 'cal'], collar: ['natural', 'fab', 'cal'], billings: ['natural', 'fab', 'sin'], dosdias: ['natural', 'fab', 'sin'], temp: ['natural', 'fab', 'sin'], sinto: ['natural', 'fab', 'sin'], coito: 'natural'
  };
  var HORM = ['aoc', 'aoce2', 'aoce4', 'pop', 'parche', 'anillo', 'annov', 'inymes', 'ampd', 'imp1', 'imp2', 'lng52', 'anprog', 'spray', 'aeupa', 'aelng', 'aeyuzpe', 'aemife'];
  var LARC = ['cu', 'cuag', 'cuau', 'lng52', 'imp1', 'imp2'];
  var ORAL = ['aoc', 'aoce2', 'aoce4', 'pop'];
  var CICLO = ['aoc', 'aoce2', 'aoce4', 'parche', 'anillo', 'annov', 'inymes'];
  M.forEach(function (m) {
    var f = FUENTE[m.id] || 'natural', a = typeof f === 'string' ? [f] : f;
    m.f = a[0]; m.src = a[1] || (m.mec ? 'mec' : null); m.k = a[2] || m.mec || null;
    m.horm = HORM.indexOf(m.id) >= 0; m.larc = LARC.indexOf(m.id) >= 0; m.oral = ORAL.indexOf(m.id) >= 0; m.ciclo = CICLO.indexOf(m.id) >= 0;
  });

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
    if (d.sinHormonas) lista = lista.filter(function (x) { return !x.m.horm; });
    if (d.grupo) lista = lista.filter(function (x) { return x.m.g === d.grupo; });
    var sug = [];
    if (sinEstrogeno) sug.push('No usar estrógenos (categoría ' + cat.ahc + ' para los combinados): ' + (flags.length ? flags.join('; ') : 'ver el MEC') + '. Opciones: DIU de cobre, DIU hormonal, implante o píldora de solo progestágeno según su categoría.');
    if (d.lact) sug.push('Lactancia: priorizar métodos sin estrógenos (solo progestágeno, implante, DIU) o MELA si se cumplen las tres condiciones.');
    if (d.vih) sug.push('VIH en tratamiento antirretroviral con carga viral suprimida: la OMS (2025) recomienda ofrecer lactancia materna y sostener la adherencia; revisar interacciones del TAR con implantes y combinados (ver el MEC).');
    if (d.edad !== null && d.edad < 20) sug.push('Adolescente: los LARC son seguros (categoría 1 a 2) y los más eficaces; sumar preservativo.');
    if (!sug.length) sug.push('Sin contraindicaciones en el perfil cargado: elegir según preferencia, priorizando la eficacia (LARC) y sumando preservativo si hay riesgo de ITS.');
    return { cat: cat, lista: lista, flags: flags, sinEstrogeno: sinEstrogeno, sugerencias: sug };
  }

  function pearl(p, m) { if (m && m.pt) return m.pt; if (!p) return 'Sin dato confiable'; return String(p[0]).replace('.', ',') + ' / ' + String(p[1]).replace('.', ','); }

  // La vista de métodos quedó unificada con la elegibilidad (opción A): #metodos abre el mismo módulo.
  function render(cont, T, opts) { return w.GYN.mec.render(cont, T, opts); }

  w.GYN = w.GYN || {};
  w.GYN.metodos = { METODOS: M, GRUPOS: GRUPOS, FAMILIAS: FAMILIAS, evaluar: evaluar, perfil: perfil, pearl: pearl, render: render };
})(window);
