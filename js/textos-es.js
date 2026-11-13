/* CaVeSal® GYN · Textos en español (separados del código para traducir después).
   © 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence.
   Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna. Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  var TODAS = ['adolescencia', 'edad-fertil', 'climaterio', 'postmenopausia'];

  w.GYN_TEXTOS = {
    app: {
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
          { id: 'orads', nombre: 'Masa anexial: O-RADS / IOTA', estado: 'prox', etapas: TODAS,
            resumen: 'Checklist de hallazgos que devuelve una categoría de riesgo.',
            entra: ['Tamaño, componente sólido, vascularización, septos'],
            sale: ['Categoría O-RADS 2 a 5', 'Reglas simples / grupos IOTA'],
            nota: 'Falta la bibliografía exacta (ACR e IOTA) que el autor quiera usar.' }
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
          { id: 'thm', nombre: 'Candidatura a THM (SEGIRP 2026)', estado: 'prox', etapas: ['climaterio', 'postmenopausia'],
            resumen: 'Árbol de decisión de terapia hormonal con laboratorio y marcas disponibles en Paraguay.',
            entra: ['STRAW+10', 'Contraindicaciones', 'Riesgo cardiovascular y mamario', 'FSH y estradiol'],
            sale: ['Esquema de inicio según útero presente o ausente'],
            nota: 'El autor decide si la candidatura sale solo del puntaje MRS o del árbol completo de SEGIRP.' }
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
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: ASRM 2021 · ATA 2017 · Guía CaVeSal® "Perfil hormonal femenino en fertilidad"'
    },

    mrs: {
      titulo: 'Escala MRS (Menopause Rating Scale)',
      ayuda: 'Marcá cada síntoma de 0 (ninguno) a 4 (muy severo).',
      total: 'Total',
      puntajes: ['0 Ninguno', '1 Leve', '2 Moderado', '3 Severo', '4 Muy severo'],
      dominios: { somatico: 'Somático-vegetativo', psicologico: 'Psicológico', urogenital: 'Urogenital' },
      gravedad: ['Sin o pocos síntomas', 'Leve', 'Moderado', 'Severo'],
      resumen: 'Puntaje por ítem',
      cita: 'Heinemann LAJ, Do MT, Strelow F, Gerbsch S, Schnitker J, Schneider HPG. The Menopause Rating Scale (MRS) as outcome measure for hormone treatment? A validation study. Health Qual Life Outcomes. 2004;2:67.',
      citaUrl: 'https://doi.org/10.1186/1477-7525-2-67',
      etiqueta: 'Algoritmo propio CaVeSal® · Basado en: Heinemann LAJ et al. Health Qual Life Outcomes 2004;2:67'
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
