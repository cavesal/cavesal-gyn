/* CaVeSal® GYN · Casos de ejemplo por módulo. Pacientes ficticias, con fines de demostración.
   En la Demo se pueden ver todos (también los módulos de la versión completa) en modo solo lectura.
   Claves: '#id' campo o casilla · 'r:nombre=valor' opción · 'c:cond' selector de condición del MEC.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  function hoyMenos(dias) { var d = new Date(); d.setDate(d.getDate() - dias); return d.toISOString().slice(0, 10); }

  var EJ = {
    hua: [{ t: 'Mujer de 46 años con sangrado abundante, mioma submucoso y anemia', v: { '#hu-edad': 46, '#hu-hcg': 'neg', '#hu-frec': 22, '#hu-dur': 10, '#hu-var': 5, '#hu-hb': 9.4, '#hu-abund': true, '#hu-pl': true, '#hu-pls': true } },
      { t: 'Adolescente de 15 años con sangrado abundante desde la menarca', v: { '#hu-edad': 15, '#hu-hcg': 'neg', '#hu-frec': 26, '#hu-dur': 9, '#hu-hb': 10.2, '#hu-abund': true, '#hu-virgen': true, '#hu-cmen': true, '#hu-cepi': true, '#hu-cenc': true } }],
    amenorrea: [{ t: 'Mujer de 32 años con 7 meses de amenorrea y FSH alta', v: { '#am-edad': 32, '#am-men': true, '#am-meses': 7, '#am-mam': true, '#am-hcg': 'neg', '#am-tsh': 'normal', '#am-prl': 'normal', '#am-fsh': 48, '#am-fsh2': true } },
      { t: 'Joven de 16 años sin menarca, con mamas y sin útero', v: { '#am-edad': 16, '#am-mam': true, '#am-ut': 'no', '#am-cario': '46xx', '#am-testo': 'normal' } }],
    epi: [{ t: 'Mujer de 22 años con dolor pélvico, fiebre y absceso tubo-ovárico', v: { '#ep-hcg': 'neg', '#ep-cmt': true, '#ep-an': true, '#ep-fie': true, '#ep-muco': true, '#ep-vsg': true, '#ep-atoimg': true } },
      { t: 'Dolor a la movilización y flujo mucopurulento, sin criterios de internación', v: { '#ep-hcg': 'neg', '#ep-cmt': true, '#ep-ut': true, '#ep-muco': true, '#ep-leu': true, '#ep-diu': true } }],
    dolor: [{ t: 'Dolor agudo con β-hCG 1800 y masa anexial con útero vacío', v: { '#dp-modo': 'agudo', '#da-hcg': 'pos', '#da-hcgv': 1800, '#da-saco': 'nada', '#da-masa': true } },
      { t: 'Dolor pélvico crónico de 14 meses con dismenorrea y dispareunia', v: { '#dp-modo': 'cronico', '#dc-meses': 14, '#dc-dism': true, '#dc-disp': true, '#dc-int': true, '#dc-gat': true } }],
    pubertad: [{ t: 'Niña de 6 años y medio con telarquia', v: { '#pp-edad': 6.5, '#pp-m': '3', '#pp-p': '2', '#pp-vc': 8, '#pp-eo': 9, '#pp-ul': 46, '#pp-uap': 14, '#pp-ut': 18, '#pp-rel': '2:1', '#pp-conf': 'piriforme', '#pp-endo': 'visible', '#pp-em': 3, '#pp-od': 3.4, '#pp-oi': 2.8, '#pp-fn': 7, '#pp-fm': 9, '#pp-lh': 0.8, '#pp-e2': true } },
      { t: 'Niña de 7 años con vello púbico aislado', v: { '#pp-edad': 7, '#pp-m': '1', '#pp-p': '2', '#pp-eo': 7.5, '#pp-ul': 30, '#pp-rel': '1:1', '#pp-conf': 'tubular', '#pp-endo': 'no', '#pp-od': 1.1, '#pp-oi': 1, '#pp-lh': 0.1, '#pp-ohp': 0.6 } }],
    mec: [{ t: 'Puérpera de 28 años, 25 días, con lactancia', v: { '#mc-edad': 28, 'r:mc-uso=iniciacion': true, 'c:paridad': 'multipara', 'c:lactancia': 'l21_30' } },
      { t: 'Mujer de 38 años, fumadora de 20 cigarrillos y con migraña con aura', v: { '#mc-edad': 38, 'r:mc-uso=iniciacion': true, 'c:tabaco': 'mayor35mas15', 'c:cefalea': 'migranaCon' } }],
    imc: [{ t: 'Peso 82 kg, talla 160 cm', v: { '#imc-peso': 82, '#imc-talla': 160 } }],
    estudios: [{ t: 'Mamografía BI-RADS 4A, citología ASC-US con VPH positivo y sangrado posmenopáusico', v: { '#b-edad': 52, '#b-mod': 'mx', '#b-cat': '4A', '#b-den': 'c', '#c-edad': 35, '#c-cito': 'ascus', '#c-vph': 'otros', '#e-eta': 'post', '#e-edad': 58, '#e-gro': 6, '#e-san': 'si' } },
      { t: 'Norma MSPBS 2025: VPH positivo, colposcopía normal y LEC negativo', v: { '#c-norma': 'mspbs', '#c-edad': 38, '#c-irs': 20, '#c-vph': 'otros', '#c-col': 'normal', '#c-lec': 'neg' } }],
    utero: [{ t: 'Mioma FIGO 2 con sangrado y anemia', v: { '#f-tipo': '2', '#f-sin': true, '#f-ane': true, '#s-tam': '1', '#s-topo': '0', '#s-base': '1' } }],
    endometriosis: [{ t: 'Dismenorrea intensa, dispareunia y nódulo profundo', v: { '#e-s-dism': true, '#e-s-disp': true, '#e-s-dpc': true, '#i-endo': true, '#i-slide': true, '#i-nod': true, 'r:ez-m=u': true, '#ez-oi': '2', '#ez-bi': '1', '#ez-c': '1', '#k-obj': 'dolor' } }],
    prolapso: [{ t: 'Cistocele sintomático en posmenopausia', v: { '#pq-aa': 1, '#pq-ba': 2, '#pq-c': -6, '#pq-d': -8, '#pq-ap': -2, '#pq-bp': -2, '#pq-tvl': 9, '#pq-gh': 4, '#pq-pb': 3, '#pq-k-sint': true, '#pq-k-atr': true, '#pq-k-sexual': true } }],
    incontinencia: [{ t: 'Incontinencia mixta con predominio de urgencia', v: { '#u-esf': true, '#u-urgP': true, '#u-frec': true, '#u-noct': true, '#u-pred': 'urg', '#u-sf': '3', '#u-sc': '2', '#u-md': 10, '#u-mn': 2, '#u-ue': 4, '#u-pe': 1, '#u-pu': 2, '#u-edad': 58, '#u-peso': 78, '#u-atr': true, '#u-res': 40 } }],
    orads: [{ t: 'Posmenopáusica con quiste unilocular con sólido de 6 cm', v: { '#a-edad': 58, '#a-meno': 'post1', '#a-ca': 60, '#o-tipo': 'unisol', '#o-tam': 6, '#o-cs': '3' } }],
    onco: [{ t: 'Cáncer de cuello de 3 cm limitado al cuello', v: { '#cx-ext': 'cervix', '#cx-tam': 3, '#cx-gang': 'no' } }],
    vaginitis: [{ t: 'Flujo homogéneo con olor a pescado', v: { '#vg-flujo': 'homogeneo', '#vg-olor': true, '#vg-ph': 5.2, '#vg-aminas': 'si', '#vg-clave': 'si' } }],
    fertilidad: [{ t: 'Ciclo de 32 días con letrozol', v: { '#f-ciclo': 32, '#f-fum': hoyMenos(12), '#f-esq': 'letrozol', '#f-fol': 19 } }],
    preconcepcional: [{ t: 'Mujer de 36 años con anemia y anti-TPO positivo', v: { '#s-edad': 36, '#s-peso': 70, '#s-talla': 160, '#s-hb': 10.8, '#s-pal': 'moderada', '#s-sif': 'nr', '#s-vih': 'nr', '#p-tsh': 3.1, '#p-tpo': 'pos' } }],
    pareja: [{ t: 'Pareja con 14 meses de búsqueda y espermiograma alterado', v: { '#pa-edad': 37, '#pa-meses': 14, '#pa-vol': 1.2, '#pa-conc': 12, '#pa-mot': 35, '#pa-prog': 25, '#pa-morf': 3, '#pa-ciclo': 'reg', '#pa-amh': 0.9, '#pa-prueba': 'hsg', '#pa-res': 'perm' } }],
    somp: [{ t: 'Ciclos irregulares, hirsutismo y PTOG alterada', v: { '#so-men': 6, '#so-ciclo': 'irreg', '#so-hirs': true, '#so-rfa': 24, '#so-vol': 11, '#so-tsh': true, '#so-prl': true, '#so-ohp': true, '#so-peso': 84, '#so-talla': 162, '#so-glu': 104, '#so-h2': 150, '#so-emb': true } }],
    mrs: [{ t: 'Climaterio con síntomas moderados', v: { 'r:m1=3': true, 'r:m2=2': true, 'r:m3=3': true, 'r:m4=2': true, 'r:m5=2': true, 'r:m6=1': true, 'r:m7=2': true, 'r:m8=2': true, 'r:m9=1': true, 'r:m10=2': true, 'r:m11=2': true } }],
    thm: [{ t: 'Mujer de 52 años con sofocos y síndrome genitourinario', v: { '#th-etapa': 'posmeno', '#th-edad': 52, '#th-anosFum': 2, '#th-utero': 'si', '#th-svm': true, '#th-sgum': true, '#th-fractura': 'bajo', '#th-gailCat': 'bajo', 'r:th-cvHerr=hearts': true, '#th-cvHearts': 4 } }],
    incretinas: [{ t: 'Semaglutida 1 mg a las 12 semanas', v: { '#i-obj': 'peso', '#i-mol': 'sema', '#i-dosis': '2', '#i-semd': 4, '#i-semt': 12, '#i-tol': 'leve', '#i-pi': 98, '#i-pa': 90, '#i-talla': 165, '#i-met': 'oral', '#i-com': true } }],
    laboratorio: [{ t: 'Tres abortos con anticoagulante lúpico positivo', v: { '#lb-cuadro': 'inmuno', '#li-perd': 3, '#li-al': 'pos', '#li-acl': 'alto', '#li-dos': true, '#li-tpo': 'pos', '#li-tsh': 2.1 } },
      { t: 'Flujo con olor, células guía y Ureaplasma positivo', v: { '#lb-cuadro': 'secrecion', '#lx-flujo': 'homogeneo', '#lx-ph': 5.0, '#lx-am': 'si', '#lx-cg': 'si', '#lx-lac': 'escasos', '#lx-gar': 'si', '#lx-uu': 'pos' } },
      { t: 'Hirsutismo con 17-OH progesterona de 4,5', v: { '#lb-cuadro': 'andro', '#la-tt': 68, '#la-tta': 'a', '#la-shbg': 22, '#la-dheas': 280, '#la-ohp': 4.5, '#la-prl': 14, '#la-tsh': 1.9, '#la-glu': 98, '#la-ins': 18 } }],
    marcadores: [{ t: 'Adolescente con masa sólida y AFP elevada', v: { '#mk-edad': 17, '#mk-masa': true, '#mk-sol': true, '#mk-afp': 'a', '#mk-ldh': 'n', '#mk-hcg': 'n' } },
      { t: 'Posmenopáusica con CA-125 de 180 y HE4 de 210', v: { '#mk-edad': 62, '#mk-meno': 'post', '#mk-masa': true, '#mk-sol': true, '#mk-ca': 180, '#mk-he4': 210 } }],
    ecogin: [{ t: 'Mujer de 37 años con RFA 5 y AMH 0,7: reserva baja', v: { '#eg-modo': 'reserva', '#eg-edad': 37, '#eg-rfa': 5, '#eg-amh': 0.7 } },
      { t: 'HSG con hidrosálpinx derecho y trompa izquierda permeable', v: { '#eg-modo': 'tubas', '#eg-est': 'hsg', '#eg-der': 'hidro', '#eg-izq': 'perm', '#eg-cav': 'normal' } }],
    densitometria: [{ t: 'Mujer de 62 años con T-score de -2,7 en columna', v: { '#dx-edad': 62, '#dx-post': 'si', '#dx-tcol': '-2,7', '#dx-tcue': '-2,1' } },
      { t: 'Osteopenia con FRAX de cadera 3,4 %', v: { '#dx-edad': 68, '#dx-post': 'si', '#dx-tcue': '-2,2', '#dx-fxm': 14, '#dx-fxc': 3.4 } }],
    induccion: [{ t: 'Letrozol, folículo líder de 16 mm: cuándo volver', v: { '#in-f': 'letrozol', '#in-dia': 9, '#in-edad': 29, '#in-der': '16, 11', '#in-endo': 8 } },
      { t: 'Gonadotropinas en SOMP con tres folículos mayores de 14 mm', v: { '#in-f': 'gonadotropinas', '#in-somp': true, '#in-edad': 27, '#in-der': '18, 15', '#in-izq': '16, 12', '#in-endo': 9, '#in-e2': 1400 } }],
    sho: [{ t: 'SHO moderado tras inducción: ascitis en la eco y náuseas', v: { '#sh-somp': true, '#sh-amh': 6, '#sh-nau': true, '#sh-ae': true, '#sh-dis': true, '#sh-ov': 9 } },
      { t: 'SHO severo: hematocrito 48 % y sodio 132', v: { '#sh-dol': true, '#sh-ac': true, '#sh-oli': true, '#sh-hto': 48, '#sh-na': 132, '#sh-emb': true } }],
    metodos: [{ t: 'Mujer de 38 años, fuma 20 cigarrillos y tiene migraña con aura', v: { '#mt-edad': 38, '#mt-tab': 'mayor35mas15', '#mt-aura': true } },
      { t: 'Puérpera de 5 semanas que amamanta, con VIH suprimida', v: { '#mt-edad': 26, '#mt-lact': 'l30_42', '#mt-vih': true, '#mt-g': 'larga' } }],
    genetica: [{ t: 'Cáncer de mama a los 41 años y madre con cáncer de ovario', v: { '#gn-mama': 41, '#gn-fov': true } },
      { t: 'Cáncer de endometrio a los 46 con dMMR y familia Amsterdam II', v: { '#gn-endo': 46, '#gn-dmmr': true, '#gn-a3': true, '#gn-a2': true, '#gn-a50': true } }],
    dm: [{ t: 'Glucemia en ayunas de 112 y HbA1c 6,0 %', v: { '#dm-ay': 112, '#dm-a1c': 6.0, '#dm-edad': 40, '#dm-imc': 36 } },
      { t: 'Dos valores en rango de diabetes', v: { '#dm-ay': 134, '#dm-a1c': 7.1, '#dm-edad': 46, '#dm-imc': 31, '#dm-plan': true } }]
  };

  function elemento(cont, k) {
    if (k.indexOf('r:') === 0) { var p = k.slice(2).split('='); return cont.querySelector('input[name="' + p[0] + '"][value="' + p[1] + '"]'); }
    if (k.indexOf('c:') === 0) return cont.querySelector('select[data-cond="' + k.slice(2) + '"]');
    return cont.querySelector(k);
  }
  function aplicar(cont, ej) {
    Object.keys(ej.v).forEach(function (k) {
      var el = elemento(cont, k), v = ej.v[k];
      if (!el) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!v; else el.value = String(v);
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
  function de(id) { return EJ[id] || null; }

  w.GYN = w.GYN || {};
  w.GYN.ejemplos = { de: de, aplicar: aplicar, EJ: EJ };
})(window);
