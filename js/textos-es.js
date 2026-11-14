/* CaVeSal® GYN · Textos en español (separados del código para traducir después).
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var TODAS = ['adolescencia', 'edad-fertil', 'climaterio', 'postmenopausia'];

  w.GYN_TEXTOS = {
    app: {
      bloqTitulo: 'Función de la versión completa',
      bloqTexto: 'Esta función se habilita con la clave de CaVeSal® GYN. En la Demo quedan abiertas la escala MRS, el día de ovulación y la Calculadora de THM con el algoritmo SEGIRP 2026.',
      activar: 'Activar versión completa',
      comprarTarjeta: 'Comprar con tarjeta',
      comprarTransf: 'Comprar por transferencia',
      soloFull: 'Versión completa',
      nombre: 'CaVeSal® GYN',
      bajada: 'Calculadora gineco-endocrinológica para el profesional',
      aviso: 'Herramienta de apoyo a la decisión clínica. No reemplaza el criterio del profesional.',
      volver: '← Volver',
      tema: 'Cambiar tema claro u oscuro',
      conLogica: 'Con lógica en v1',
      proximamente: 'Próximamente',
      filtroEtapa: 'Etapa de vida',
      todas: 'Todas',
      vacio: 'Ninguna función de esta categoría aplica a la etapa elegida. Probá con otra etapa o con "Todas".',
      abrir: 'Abrir',
      verDetalle: 'Ver detalle',
      queCarga: 'Qué cargaría el médico',
      queDevuelve: 'Qué devolvería',
      nota: 'Nota',
      prox: 'Esta función todavía no calcula nada. Se programa cuando estén definidos sus criterios clínicos.',
      orientativa: 'Interpretación orientativa. Confirmar con el contexto clínico.',
      limpiar: 'Limpiar'
    },

    etapas: [
      { id: 'adolescencia', nombre: 'Adolescencia', rango: '10 a 19 años' },
      { id: 'edad-fertil', nombre: 'Edad fértil', rango: '20 a 40 años' },
      { id: 'climaterio', nombre: 'Climaterio y menopausia', rango: '40 a 55 años' },
      { id: 'postmenopausia', nombre: 'Postmenopausia', rango: 'desde los 55 años' }
    ],

    categorias: [
      { id: 'adolescencia', nombre: 'Adolescencia', intro: 'Evaluación de la pubertad en la paciente adolescente.',
        funciones: [
          { id: 'pubertad', nombre: 'Pubertad precoz', estado: 'prox', etapas: ['adolescencia'],
            resumen: 'Evaluación de pubertad precoz a partir de datos cargados por el médico.',
            entra: ['Edad de telarca y pubarca', 'Velocidad de crecimiento', 'Edad ósea, si se solicitó'],
            sale: ['Sugerencia de estudio o derivación'],
            nota: 'Las variables definitivas y el umbral que dispara la derivación los dicta el autor. No se programa hasta entonces.' }
        ] },
      { id: 'anticoncepcion', nombre: 'Anticoncepción', intro: 'Elegibilidad de métodos según criterios médicos, con las dos guías lado a lado cuando divergen.',
        funciones: [
          { id: 'mec', nombre: 'Elegibilidad de métodos (MEC)', estado: 'prox', etapas: ['adolescencia', 'edad-fertil', 'climaterio'],
            resumen: 'Categoría 1 a 4 por método y condición, con OMS MEC 2025 y US MEC 2024 lado a lado.',
            entra: ['Edad, tabaquismo, antecedentes y factores de riesgo', 'Método a evaluar'],
            sale: ['Categoría MEC 1 a 4 explícita', 'Ambas guías cuando difieren; el médico elige cuál aplicar', 'Alertas de interacción con GLP-1/tirzepatida'],
            nota: 'Hoy CaVeSal® Mujer cubre unas 9 condiciones; nivel profesional necesita 80 a 90. La lista de condiciones la valida el autor antes de programar.' }
        ] },
      { id: 'salud-gin', nombre: 'Salud Ginecológica', intro: 'Estudios por imágenes y clasificación de hallazgos.',
        funciones: [
          { id: 'estudios', nombre: 'Ecografía ginecológica y estudios', estado: 'prox', etapas: TODAS,
            resumen: 'Carga de hallazgos y conducta sugerida, con puente a CaVeSal® IA.',
            entra: ['Hallazgos ecográficos', 'HSG, HyFoSy y otros estudios del catálogo'],
            sale: ['Conducta sugerida', 'Resumen para CaVeSal® IA'],
            nota: 'El catálogo exacto de estudios está abierto.' },
          { id: 'prolapso', nombre: 'Prolapso genital: POP-Q', estado: 'v1', etapas: ['edad-fertil', 'climaterio', 'postmenopausia'],
            resumen: 'Estadio POP-Q global y por compartimento: anterior, apical (C y D) y posterior.' },
          { id: 'orads', nombre: 'Masa anexial: O-RADS / IOTA', estado: 'prox', etapas: TODAS,
            resumen: 'Checklist de hallazgos que devuelve una categoría de riesgo.',
            entra: ['Tamaño, componente sólido, vascularización, septos'],
            sale: ['Categoría O-RADS 2 a 5', 'Reglas simples / grupos IOTA'],
            nota: 'Falta la bibliografía exacta (ACR e IOTA) que el autor quiera usar.' }
        ] },
      { id: 'infecciones', nombre: 'Infecciones genitales', intro: 'Flujo vaginal: diagnóstico por clínica y laboratorio, con tratamiento oral y local sugerido.',
        funciones: [
          { id: 'vaginitis', nombre: 'Infecciones genitales bajas', estado: 'v1', etapas: TODAS,
            resumen: 'Vaginosis, candidiasis, tricomoniasis y vaginitis aeróbica, con tratamiento oral y local.' }
        ] },
      { id: 'fertilidad', nombre: 'Fertilidad y Reproducción', intro: 'Ciclo, ovulación y estudio preconcepcional de la paciente en edad fértil.',
        funciones: [
          { id: 'fertilidad', nombre: 'Fertilidad', estado: 'v1', etapas: ['edad-fertil'],
            resumen: 'Día de ovulación, ventana de progesterona y tamaño folicular para el trigger.' },
          { id: 'preconcepcional', nombre: 'Preconcepcional: panel hormonal', estado: 'v1', etapas: ['edad-fertil'],
            resumen: 'Valores del día 2 y del día 21 con su interpretación.' },
          { id: 'semaforo', nombre: 'Semáforo de riesgo preconcepcional', estado: 'prox', etapas: ['edad-fertil'],
            resumen: 'Tres niveles (leve, moderado, severo) según factores previos al embarazo.',
            entra: ['Exposición a GLP-1', 'Ácido fólico', 'Antecedentes familiares', 'Malformaciones y preeclampsia previas', 'Cirugías previas'],
            sale: ['Nivel leve, moderado o severo'],
            nota: 'La combinación de factores que da cada nivel la dicta el autor antes de programar.' }
        ] },
      { id: 'climaterio', nombre: 'Climaterio', intro: 'Síntomas climatéricos y decisión sobre terapia hormonal.',
        funciones: [
          { id: 'mrs', nombre: 'Escala MRS', estado: 'v1', etapas: ['climaterio', 'postmenopausia'],
            resumen: 'Once ítems, subtotales por dominio y total con su gravedad.' },
          { id: 'thm', nombre: 'Calculadora de THM', estado: 'v1', etapas: ['edad-fertil', 'climaterio', 'postmenopausia'],
            resumen: 'Conducta de terapia hormonal según etapa, síntomas, contraindicaciones y riesgo cardiovascular y mamario. Algoritmo SEGIRP 2026 en la Demo y algoritmo combinado en la versión completa.' }
        ] },
      { id: 'endocrino', nombre: 'Endocrinología', intro: 'Seguimiento metabólico de la paciente no embarazada.',
        funciones: [
          { id: 'glp1', nombre: 'Seguimiento GLP-1 y metformina', estado: 'prox', etapas: ['edad-fertil', 'climaterio'],
            resumen: 'Peso y dosis en el tiempo para detectar falta de respuesta al tratamiento.',
            entra: ['Peso y dosis actual en cada control', 'Glicemia'],
            sale: ['Si la baja de peso es la esperada para esa dosis'],
            nota: 'Esquemas de dosis y escalada quedan como texto de guía, no como calculadora.' },
          { id: 'dm', nombre: 'Diabetes fuera del embarazo', estado: 'prox', etapas: ['edad-fertil', 'climaterio'],
            resumen: 'Prediabetes y diabetes tipo 2 con criterio para no gestante.',
            entra: ['Glucemia en ayunas, PTOG, HbA1c'],
            sale: ['Normal, prediabetes o diabetes'],
            nota: 'Hay que confirmar que el criterio es ADA/OMS y no los cortes IADPSG de la gestante.' }
        ] }
    ],

    fertilidad: {
      titulo: 'Fertilidad',
      ciclo: 'Duración del ciclo menstrual (días)',
      cicloAyuda: 'Del primer día de una menstruación al primer día de la siguiente. No son los días de sangrado.',
      fum: 'Primer día de la última menstruación (opcional)',
      esquema: 'Esquema de inducción',
      esquemas: { ninguno: 'Ninguno', letrozol: 'Letrozol', clomifeno: 'Clomifeno', gonadotropinas: 'HMG o FSH' },
      foliculo: 'Diámetro del folículo líder (mm)',
      ovulacion: 'Día de ovulación estimado',
      progesterona: 'Dosaje de progesterona',
      dia: 'día',
      diaDel: 'del ciclo',
      cicloFuera: 'Ciclo fuera del rango habitual: revisar la historia menstrual',
      cicloInvalido: 'Ingresá una duración de ciclo entre 15 y 60 días.',
      trigger: 'Trigger según tamaño folicular',
      sinEsquema: 'Elegí un esquema de inducción para interpretar el folículo.',
      estados: {
        noAlcanza: 'Aún no alcanza el rango',
        rango: 'Rango de trigger',
        tolerancia: 'Tolerancia',
        encima: 'Por encima del rango'
      },
      triggerBloq: 'Trigger según tamaño folicular · versión completa',
      esquemasTitulo: 'Referencia de esquemas posológicos (solo informativo)',
      esquemasTexto: [
        'Letrozol: 2,5 mg/día VO por 5 días desde el día 2 a 5; escalar a 5,0 mg y máximo 7,5 mg.',
        'Clomifeno: 50 mg/día por 5 días desde el día 2 a 5; luego 100 mg y máximo habitual 150 mg; límite de 6 ciclos ovulatorios.',
        'Gonadotropinas, protocolo low-dose step-up: inicio 37,5 a 75 UI/día desde el día 2 a 3, dosis fija 7 a 14 días; si a los 14 días no hay folículo de 10 mm o más, aumentar 50% semanal.'
      ],
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: ASRM Practice Committee, Fertil Steril 2013;100:341-348 y 2020;113:66-70 · ESHRE 2023 y 2025 · MSPyBS Paraguay Res. S.G. N.º 050/2025 · Palatnik A et al. Fertil Steril 2012;97:1089-1094 · Shalom-Paz E et al. Gynecol Endocrinol 2014;30:107-110 · Ling L et al. Eur J Med Res 2024;29:184 · Van Oirschot M et al. Fertil Steril 2025'
    },

    preconcepcional: {
      titulo: 'Preconcepcional: panel hormonal',
      ayuda: 'Todos los valores son opcionales. FSH, LH, AMH, TSH y prolactina del día 2 a 5 del ciclo; progesterona del día 21.',
      relacion: 'Relación LH/FSH',
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: ASRM 2020 (reserva ovárica) · ATA 2017 · Guía CaVeSal® "Perfil hormonal femenino en fertilidad"'
    },

    mrs: {
      titulo: 'Escala MRS (Menopause Rating Scale)',
      ayuda: 'Marcá cada síntoma de 0 (ninguno) a 4 (muy severo).',
      total: 'Total',
      puntajes: ['0 Ninguno', '1 Leve', '2 Moderado', '3 Severo', '4 Muy severo'],
      dominios: { somatico: 'Somático-vegetativo', psicologico: 'Psicológico', urogenital: 'Urogenital' },
      gravedad: ['Sin o pocos síntomas', 'Leve', 'Moderado', 'Severo'],
      resumen: 'Puntaje por ítem',
      esquema: 'Esquema de lectura',
      esquemas: { nams: 'NAMS / Heinemann', socheg: 'SOCHEG (por dominio)' },
      severa: 'Alteración severa', noSevera: 'Sin alteración severa', corte: 'corte ≥',
      aThm: 'Usar en Calculadora de THM',
      citaSocheg: 'Sociedad Chilena de Climaterio (SOCHEG). Manual para Manejo de la Mujer en Edad del Climaterio, 2.ª ed. 2020.',
      cita: 'Heinemann LAJ, Do MT, Strelow F, Gerbsch S, Schnitker J, Schneider HPG. The Menopause Rating Scale (MRS) as outcome measure for hormone treatment? A validation study. Health Qual Life Outcomes. 2004;2:67.',
      citaUrl: 'https://doi.org/10.1186/1477-7525-2-67',
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: Heinemann LAJ et al. Health Qual Life Outcomes 2004;2:67 · SOCHEG 2020'
    },

    prolapso: {
      titulo: 'Prolapso genital: POP-Q',
      ayuda: 'Cargá cada punto en centímetros respecto al himen, con la paciente haciendo pujo máximo: negativo por encima del himen, positivo por debajo.',
      histerectomia: 'Histerectomía previa (no hay cuello: C es la cúpula y no se mide D)',
      grupos: { anterior: 'Compartimento anterior', apical: 'Compartimento apical', posterior: 'Compartimento posterior', medidas: 'Medidas' },
      ayudas: {
        aa: 'Pared anterior a 3 cm del meato. De -3 a +3.',
        ba: 'Punto más bajo de la pared anterior por encima de Aa. Sin prolapso: -3.',
        c: 'Borde del cuello o cúpula vaginal.',
        d: 'Fondo de saco posterior. Solo con cuello.',
        ap: 'Pared posterior a 3 cm del himen. De -3 a +3.',
        bp: 'Punto más bajo de la pared posterior por encima de Ap. Sin prolapso: -3.',
        tvl: 'Longitud vaginal total, en reposo.',
        gh: 'Hiato genital (opcional).',
        pb: 'Cuerpo perineal (opcional).'
      },
      faltan: 'Completá Aa, Ba, C, Ap, Bp y LVT para ver el estadio.',
      global: 'Estadio POP-Q global',
      estadio: 'Estadio',
      puntoDistal: 'Punto más distal',
      distal: 'Punto más bajo:',
      desc: ['Sin prolapso', 'Más de 1 cm por encima del himen', 'Entre 1 cm por encima y 1 cm por debajo del himen', 'Más de 1 cm por debajo del himen, sin eversión completa', 'Eversión completa o casi completa (≥ LVT − 2 cm)'],
      nombres: { cistocele: 'Cistocele', utero: 'Histerocele (prolapso uterino)', cupula: 'Prolapso de cúpula vaginal', rectocele: 'Rectocele o enterocele' },
      grilla: 'Grilla POP-Q 3 × 3',
      hiato: 'Hiato genital más cuerpo perineal',
      avisos: {
        tvl: 'Revisar LVT: valor fuera de lo habitual.',
        aa: 'Aa va de -3 a +3 cm.',
        ap: 'Ap va de -3 a +3 cm.',
        ba: 'Ba no puede quedar por encima de Aa: revisar.',
        bp: 'Bp no puede quedar por encima de Ap: revisar.',
        c: 'C no puede superar la LVT: revisar.',
        d: 'D quedó más bajo que C: revisar la medición.'
      },
      conHx: 'Con histerectomía previa.',
      copiar: 'Copiar resultado',
      copiado: 'Copiado',
      cita: 'Bump RC, Mattiasson A, Bø K, et al. The standardization of terminology of female pelvic organ prolapse and pelvic floor dysfunction. Am J Obstet Gynecol. 1996;175:10-17 · Haylen BT, Maher CF, Barber MD, et al. An International Urogynecological Association (IUGA)/International Continence Society (ICS) joint report on the terminology for female pelvic organ prolapse (POP). Int Urogynecol J. 2016;27:165-194.',
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: Bump 1996 (POP-Q) · IUGA/ICS 2016'
    },

    vaginitis: {
      titulo: 'Infecciones genitales bajas',
      ayuda: 'Cargá lo que tengas: características del flujo, pH y laboratorio. El resultado se arma con los datos disponibles; lo que no se realizó queda sin evaluar.',
      grupos: { paciente: 'Paciente', clinica: 'Clínica', lab: 'Laboratorio' },
      noRealizado: 'No realizado', si: 'Positivo', no: 'Negativo',
      flujos: [['normal', 'Fisiológico, sin cambios'], ['grumoso', 'Blanco grumoso (tipo leche cortada)'], ['homogeneo', 'Gris-blanquecino, fino y homogéneo'], ['espumoso', 'Amarillo-verdoso, espumoso'], ['purulento', 'Amarillento purulento']],
      c: {
        embarazo: 'Embarazo', inmuno: 'Diabetes mal controlada, inmunosupresión o corticoides', recurrente: '3 o más episodios en el último año',
        hipoestro: 'Posmenopausia o hipoestrogenismo', flujo: 'Flujo', olor: 'Olor a pescado', prurito: 'Prurito', ardor: 'Ardor, disuria o dispareunia',
        severa: 'Eritema y edema vulvar extensos, excoriaciones o fisuras', fresa: 'Cérvix en fresa', sequedad: 'Sequedad vaginal',
        ph: 'pH vaginal', phAyuda: 'Normal ≤ 4,5', aminas: 'Prueba de aminas (KOH 10%)', aminasCorto: 'Aminas',
        clave: 'Células clave > 20%', claveCorto: 'Células clave', levaduras: 'Levaduras o pseudohifas (KOH o cultivo)', levadurasCorto: 'Levaduras',
        tricomonas: 'Tricomonas (móviles o NAAT)', tricomonasCorto: 'Tricomonas', nugent: 'Nugent (Gram)', nugentAyuda: '0-3 normal · 4-6 intermedio · 7-10 vaginosis',
        donders: 'Puntaje de Donders', dondersAyuda: 'Vaginitis aeróbica: 3 o más', noAlbicans: 'Cultivo con especie no albicans'
      },
      faltan: 'Cargá el flujo, el pH o algún dato de laboratorio para ver el resultado.',
      resultado: 'Resultado', sospecha: 'Sospecha clínica',
      dx: { vb: 'Vaginosis bacteriana', candida: 'Candidiasis vulvovaginal', tricomonas: 'Tricomoniasis', aerobica: 'Vaginitis aeróbica' },
      confirmar: { candida: 'Confirmar con KOH o cultivo antes de tratar.', tricomonas: 'Pedir NAAT o examen en fresco inmediato.' },
      complicada: 'Complicada', noComplicada: 'No complicada',
      motivos: { recurrente: 'recurrente', severa: 'severa', noAlbicans: 'no albicans', inmuno: 'huésped comprometido' },
      gravedad: { leve: 'leve', moderada: 'moderada', severa: 'severa' },
      mixta: 'Infección mixta', mixtaDet: 'Tratar cada agente.',
      atrofia: 'Probable atrofia o síndrome genitourinario', atrofiaDet: 'Sin agente infeccioso: valorar terapia local (ver Climaterio).',
      sinCriterios: 'Sin criterios de vaginitis infecciosa', sinCriteriosDet: 'Con los datos cargados.',
      oral: 'Vía oral', local: 'Vía local', alternativas: 'Alternativas',
      tto: {
        vb: {
          oral: 'Metronidazol 500 mg cada 12 h por 7 días',
          local: ['Metronidazol gel 0,75%, 1 aplicador (5 g) por día, 5 días', 'Clindamicina crema 2%, 1 aplicador (5 g) al acostarse, 7 noches'],
          alt: ['Clindamicina 300 mg cada 12 h por 7 días', 'Clindamicina óvulos 100 mg al acostarse, 3 noches', 'Tinidazol 2 g por día, 2 días; o 1 g por día, 5 días', 'Secnidazol 2 g en dosis única'],
          altEmb: ['Clindamicina 300 mg cada 12 h por 7 días', 'Clindamicina óvulos 100 mg al acostarse, 3 noches'],
          notaEmb: 'Embarazo: evitar tinidazol y secnidazol.'
        },
        candida: {
          oral: 'Fluconazol 150 mg en dosis única',
          local: ['Clotrimazol crema 1%, 5 g por día, 7 a 14 días; o crema 2%, 5 g por día, 3 días', 'Miconazol óvulo 100 mg por día, 7 días; 200 mg, 3 días; o 1200 mg, 1 día'],
          severaOral: 'Fluconazol 150 mg, 2 dosis separadas por 72 h',
          severaLocal: 'Azol vaginal por 7 a 14 días',
          recInduccion: 'Inducción: fluconazol 100, 150 o 200 mg los días 1, 4 y 7',
          recMant: 'Mantenimiento: fluconazol 100, 150 o 200 mg por semana, 6 meses',
          recLocal: 'Inducción alternativa: azol vaginal por 7 a 14 días',
          noAlbicans: 'Azol distinto del fluconazol, oral o local, por 7 a 14 días',
          noAlbicansRec: 'Si recidiva: ácido bórico 600 mg en cápsula vaginal por día, 3 semanas; si persiste, derivar',
          inmuno: 'Tratamiento convencional prolongado, 7 a 14 días',
          notaInmuno: 'Corregir el factor modificable (glucemia, corticoides).',
          emb: 'Azol vaginal por 7 días',
          notaEmb: 'Embarazo: solo azoles locales por 7 días. No usar fluconazol.'
        },
        tricomonas: {
          oral: 'Metronidazol 500 mg cada 12 h por 7 días',
          alt: 'Tinidazol 2 g en dosis única',
          nota: 'Tratar a la pareja, rastrear otras ITS (HIV, sífilis, gonorrea, clamidia) y repetir la prueba a los 3 meses. El gel de metronidazol no sirve para tricomonas.',
          notaEmb: 'Embarazo: evitar tinidazol.'
        },
        aerobica: 'Vaginitis aeróbica: sin esquema en la guía CDC 2021. Definir el tratamiento según la gravedad y el cultivo.'
      },
      notas: {
        nugentIntermedio: 'Nugent 4-6: flora intermedia. Correlacionar con la clínica.',
        candidaPhAlto: 'Candidiasis con pH > 4,5: descartar infección mixta.',
        embarazo: 'Embarazo: esquemas ajustados según CDC 2021.'
      },
      copiar: 'Copiar resultado', copiado: 'Copiado',
      cita: 'Workowski KA, Bachmann LH, Chan PA, et al. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recomm Rep. 2021;70(4):1-187 · Amsel R, Totten PA, Spiegel CA, et al. Nonspecific vaginitis. Am J Med. 1983;74:14-22 · Nugent RP, Krohn MA, Hillier SL. J Clin Microbiol. 1991;29:297-301 · Donders GG, Vereecken A, Bosmans E, et al. Definition of a type of abnormal vaginal flora that is distinct from bacterial vaginosis: aerobic vaginitis. BJOG. 2002;109:34-43.',
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: CDC STI 2021 · Amsel 1983 · Nugent 1991 · Donders 2002'
    },

    thm: {
      titulo: 'Calculadora de THM',
      ayuda: 'Elegí el modo y cargá los datos. Cada bloque muestra su propio resultado y al final aparece la conducta.',
      g: { modo: 'Modo de cálculo', etapa: 'Etapa y útero', objetivo: 'Objetivo del tratamiento', mrs: 'Escala MRS', oste: 'Prevención de osteoporosis',
        contra: 'Contraindicaciones de THM', cv: 'Riesgo cardiovascular', mama: 'Riesgo mamario', pato: 'Patologías que orientan la vía', ventana: 'Ventana de tratamiento' },
      modos: { segirp: 'Algoritmo SEGIRP 2026', combinado: 'Algoritmo combinado CaVeSal®' },
      modoAyuda: {
        segirp: 'Sigue el algoritmo de la Sociedad Paraguaya de Ginecología Endocrina y Reproductiva (SEGIRP) 2026.',
        combinado: 'Integra SEGIRP con FIGO/WHF, EMAS, ACOG, ACP y NAMS, la FDA y ESHRE, con selectores donde las guías difieren.'
      },
      bloqComb: 'El algoritmo combinado es de la versión completa',
      elegir: 'Elegir',
      etapas: { transicion: 'Transición a la menopausia temprana o tardía (STRAW+10 -2 / -1)', posmeno: 'Posmenopausia', iop: 'Insuficiencia ovárica prematura (IOP)' },
      c: {
        etapa: 'Etapa reproductiva (STRAW+10)', edad: 'Edad (años)', anosFum: 'Años desde la FUM', anosFumAyuda: 'Solo en posmenopausia',
        utero: 'Útero', conUtero: 'Con útero', sinUtero: 'Sin útero (histerectomía)',
        anticoncepcion: 'Necesita anticoncepción o tiene sangrado uterino anormal', deseoEmbarazo: 'Deseo de embarazo',
        svm: 'Síntomas vasomotores', oste: 'Prevención de osteoporosis', sgum: 'Síndrome genitourinario (SGUM)', tdsh: 'Trastorno del deseo sexual hipoactivo (TDSH, por DSDS)',
        mrsS: 'Somático', mrsP: 'Psicológico', mrsU: 'Urogenital', mrsAyuda: 'Se completa solo si antes usaste la escala MRS. Podés editarlo.',
        fractura: 'Riesgo de fractura (FRAX)', fracBajo: 'Bajo', fracAlto: 'Alto', fracturaAyuda: 'Según FRAX y Davis 2023', tscore: 'T-score',
        hearts: 'HEARTS OPS (%)', figo: 'FIGO/WHF (categoría)',
        cvHearts: 'Riesgo CV a 10 años, HEARTS OPS (%)', cvHeartsAyuda: 'Menos de 5 bajo · 5 a 10 intermedio · más de 10 alto',
        cvFigo: 'Categoría FIGO/WHF', cac: 'Calcio coronario (CAC-CT)', cacNo: 'No realizado', cacHasta10: 'CAC 0 a 10', cacMas10: 'CAC más de 10', cacAyuda: 'Reclasifica el riesgo intermedio',
        gailCat: 'Riesgo mamario (Gail)', gail: 'Gail a 5 años (%)', gailAyuda: 'Menos de 1,67 bajo · 1,67 a 2,99 moderado · 3 o más alto'
      },
      cat: { bajo: 'Riesgo bajo', intermedio: 'Riesgo intermedio', moderado: 'Riesgo moderado', alto: 'Riesgo alto' },
      contra: {
        sangrado: 'Sangrado vaginal inexplicado no investigado', mama: 'Cáncer de mama o neoplasia estrógeno-dependiente activa',
        tev: 'Enfermedad tromboembólica arterial o venosa activa', trombofilia: 'Riesgo aumentado de trombosis (trombofilia, lupus)',
        hepatica: 'Enfermedad hepática aguda', acv: 'ACV o IAM', porfiria: 'Porfiria aguda'
      },
      pato: { obesidad: 'Obesidad (IMC > 30)', hta: 'Hipertensión', tg: 'Hipertrigliceridemia', riesgoTev: 'Riesgo de TEV', tabaco: 'Tabaquismo', migrana: 'Migraña', glp1: 'En tratamiento con GLP-1 o tirzepatida', cerebro: 'Alto riesgo cerebrovascular' },
      osteo: { manejoOsteo: 'Manejo de osteoporosis', thm: 'THM indicada para prevención', control: 'Control periódico', faltaFractura: 'Falta el riesgo de fractura', faltaT: 'Falta el T-score' },
      hayContra: 'Hay contraindicación',
      cv: {
        hearts: { bajo: 'THM posible, oral o transdérmica según preferencia', intermedio: 'THM posible, preferir vía transdérmica', alto: 'Evitar THM sistémica; considerar opciones no hormonales' },
        figo: { bajo: 'Sin restricción de tipo, dosis ni vía', intermedio: 'Vía transdérmica; pedir CAC-CT si es factible', alto: 'Estrógeno transdérmico en dosis baja con progesterona micronizada o didrogesterona' }
      },
      reclasificado: 'reclasificado por CAC',
      mama: { bajo: 'THM posible', moderado: 'Discutir riesgos y beneficios; THM posible', alto: 'La THM no es de primera línea; valorar opción no hormonal' },
      dentro: 'Dentro de la ventana', fuera: 'Fuera de la ventana', ventanaDef: 'Menos de 60 años y menos de 10 años desde la FUM',
      conducta: 'Conducta',
      cond: {
        anticoncepcion: 'Anticoncepción: AOC o anticonceptivo solo de progestágeno', anticoncepcionDet: 'Elegir el método con la elegibilidad MEC. La THM se plantea cuando ya no haga falta anticoncepción.',
        tra: 'Derivar a técnicas de reproducción asistida', sinIndicacion: 'Sin indicación de THM con los datos cargados',
        noHormonal: 'Tratamiento no hormonal', thm: 'Iniciar THM', soloLocal: 'Sin THM sistémica'
      },
      motivo: { contra: 'Motivo: contraindicación de THM.', cv: 'Motivo: riesgo cardiovascular alto.', mama: 'Motivo: riesgo mamario alto.' },
      noHormonalSegirp: ['Fezolinetant', 'ISRS o IRSN', 'Gabapentina'],
      noHormonalComb: ['2.ª línea (ACP 2026): IRSN, desvenlafaxina o venlafaxina', '3.ª línea: ISRS (escitalopram o paroxetina), gabapentina o antagonistas NK (fezolinetant o elinzanetant)'],
      esq: { estrogeno: 'estrógeno solo', ciclica: 'terapia cíclica de estrógeno y progestágeno', continua: 'terapia continua de estrógeno y progestágeno' },
      faltaUtero: 'indicar si tiene útero para definir el esquema',
      via: { libre: 'Vía oral o transdérmica, según preferencia', transdermica: 'Vía transdérmica' },
      dosisBaja: 'dosis baja',
      progSeguro: 'Progestágeno: progesterona micronizada o didrogesterona (menor riesgo trombótico).',
      sinTibolona: 'Evitar tibolona: aumenta el riesgo de ACV.',
      porPato: 'Vía transdérmica por',
      avisos: {
        mamaModerado: 'Riesgo mamario moderado: discutir riesgos y beneficios.',
        fueraVentana: 'Fuera de la ventana: discutir riesgos y beneficios. No iniciar con fin cardioprotector (FIGO/WHF 2026).',
        mrsLeve: 'MRS sin síntomas moderados a severos: la indicación aprobada de THM sistémica es para síntomas vasomotores moderados a severos (FDA 2025).',
        iopHasta: 'IOP: mantener la terapia al menos hasta la edad promedio de la menopausia (ESHRE 2024).'
      },
      presentaciones: 'Presentaciones disponibles en Paraguay (Fuente: SEGIRP 2026)',
      prod: {
        ginoderm: 'Ginoderm gel 0,06% (estradiol 0,6 mg/g), transdérmico',
        femoston: 'Femoston 1/10 (estradiol 1 mg; con didrogesterona 10 mg en la fase combinada), oral',
        ginodermP4ciclica: 'Ginoderm gel + progesterona micronizada (Progelle, Progendo, Gynprogest) en forma cíclica',
        angeliq: 'Angeliq o Gadofem (estradiol 1 mg + drospirenona 2 mg), oral',
        femostonConti: 'Femoston Conti 1/5 (estradiol 1 mg + didrogesterona 5 mg), oral',
        tibolona: 'Tibolona 2,5 mg (Tobe), oral',
        ginodermP4continua: 'Ginoderm gel + progesterona micronizada (Progelle, Progendo, Gynprogest) en forma continua',
        diuLng: 'Ginoderm gel + DIU-LNG 52 mg (Mirena, Asertia) como protección endometrial',
        androlone: 'Androlone 1% crema, transdérmica'
      },
      dosisRef: 'Dosis de referencia (guías de la HC): gel de estradiol 0,75-1,25 g/día · progesterona micronizada 200 mg/día 10-14 días por mes (cíclica) o 100 mg/día (continua) · didrogesterona 10-20 mg/día · DIU-LNG: recambio a los 5 años cuando se usa para protección endometrial.',
      terapiaLocal: 'Terapia local',
      localSi: 'Estrógeno o prasterona vaginal.', localNo: 'Con contraindicación, SEGIRP indica opciones no hormonales.',
      localBaja: 'Terapia local de baja dosis posible aun con contraindicación sistémica.', localOnco: 'Con cáncer de mama, decidir la terapia local junto con oncología.',
      prodLocal: ['Estriol óvulos o crema vaginal (Colpoestriol, Vacidox)', 'Promestrieno crema vaginal 10 mg (Antrofi)', 'Prasterona (DHEA) vaginal'],
      testosterona: 'Testosterona transdérmica',
      faltan: 'Elegí la etapa reproductiva para ver la conducta.',
      copiar: 'Copiar resultado', copiado: 'Copiado',
      tablaTitulo: 'Presentaciones disponibles en Paraguay (SEGIRP 2026)',
      tabla: '<ul class="pq-notas"><li>Estrógeno solo: Ginoderm gel 0,06% (estradiol 0,6 mg/g), transdérmico.</li><li>Combinado continuo: Angeliq y Gadofem (estradiol 1 mg + drospirenona 2 mg); Femoston Conti 1/5 (estradiol 1 mg + didrogesterona 5 mg), orales.</li><li>Combinado secuencial: Femoston 1/10 (estradiol 1 mg; didrogesterona 10 mg en la fase combinada), oral.</li><li>Progesterona micronizada: Progelle, Progendo, Gynprogest 100-200 mg, oral o vaginal.</li><li>Tibolona: Tobe 2,5 mg, oral.</li><li>Testosterona: Androlone 1% crema (tubo 15 g, sobre 5 g), transdérmica.</li><li>DIU-LNG 52 mg: Mirena, Asertia, protección endometrial.</li><li>Local vaginal: estriol (Colpoestriol, Vacidox) óvulos o crema; promestrieno (Antrofi) crema 10 mg; prasterona (DHEA).</li></ul><p class="ayuda">Fuente: SEGIRP 2026.</p>',
      citaSegirp: 'Sociedad Paraguaya de Ginecología Endocrina y Reproductiva (SEGIRP). Manejo de los síntomas en la peri y posmenopausia con terapia hormonal. Algoritmo 2026 · Davis SR et al. The 2023 Practitioner’s Toolkit for Managing Menopause. Climacteric. 2023;26:517-536 · Piasta J, Zewail A. Hormonal Options for Perimenopause: A Clinician Toolkit. Obstet Gynecol. 2026 · Panay N et al. ESHRE/ASRM/CREWHIRL/IMS. Premature ovarian insufficiency. Climacteric. 2024;27:510-520 · OPS. HEARTS · NCI. Breast Cancer Risk Assessment Tool (Gail).',
      citaComb: 'SEGIRP 2026 · Benedetto C, Gulati M, Khadilkar SS, et al. (FIGO/WHF). Int J Gynecol Obstet. 2026. doi:10.1002/ijgo.71356 · Stute P, et al. (EMAS). Maturitas. 2026;212:109060 · ACOG Clinical Practice Guideline No. 13. Obstet Gynecol. 2026;148(5):e345-e364 · Qaseem A, et al. (ACP). Ann Intern Med. 2026 · The Menopause Society (NAMS). The 2022 hormone therapy position statement. Menopause. 2022;29:767-794 · FDA. Labeling changes for menopausal hormone therapy, 2025-2026 · Panay N et al. (ESHRE). Climacteric. 2024;27:510-520 · USPSTF. Medication use to reduce risk of breast cancer. JAMA. 2019;322:857-867 · Heinemann 2004 · SOCHEG 2020.',
      etqSegirp: 'Algoritmo propio CaVeSal® · Basado en: SEGIRP 2026',
      etqComb: 'Algoritmo propio CaVeSal® · Basado en: SEGIRP 2026 · FIGO/WHF 2026 · EMAS 2026 · ACOG 2026 · ACP 2026 · NAMS 2022 · FDA 2025-2026 · ESHRE 2024 · USPSTF 2019'
    },

    legal: {
      propiedad: 'CaVeSal® implementa algoritmos propios, desarrollados e integrados de forma original a partir de las referencias bibliográficas citadas. No reproduce tablas con copyright de terceros.',
      ley: 'El software, el diseño, la interfaz, los textos, los gráficos y la lógica de esta aplicación son propiedad de Dr. Carlos Vera Salerno y están protegidos por la Ley N.º 1328/1998 de Paraguay y los tratados internacionales aplicables (Convenio de Berna). CaVeSal® es una marca registrada. Queda prohibido copiar, reproducir, distribuir, modificar, descompilar, realizar ingeniería inversa, divulgar por cualquier medio o crear obras derivadas de esta aplicación o de sus componentes, total o parcialmente, sin autorización previa y por escrito del titular.',
      atribucion: 'La mención de guías, sociedades científicas o instituciones (ASRM, ESHRE, ATA, MSPyBS, OMS, entre otras) tiene fines exclusivamente de atribución bibliográfica. Ninguna de estas instituciones patrocina, avala ni certifica CaVeSal®.',
      contacto: 'Contacto: drverasalerno@gmail.com',
      copyright: '© 2026 CaVeSal® · Dr. Carlos Vera Salerno · Todos los derechos reservados'
    }
  };
})(window);
