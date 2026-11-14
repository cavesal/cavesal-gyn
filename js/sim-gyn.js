/* CaVeSal® GYN — Simulador: casos clínicos ficticios con fines de entrenamiento.
 * Cada respuesta se respalda en un módulo de la calculadora y en su bibliografía (bibliografia.html).
 * © 2026 Dr. Carlos Vera Salerno · CaVeSal® · Ley N.º 1328/1998 (Paraguay). */
(function (w) {
  var B = 'bibliografia.html#';
  w.SIM_GYN = [
    {
      id: 'ppc', sector: 'Adolescencia', titulo: 'Niña de 6 años y 10 meses con desarrollo mamario',
      resumen: 'Telarquia, aceleración del crecimiento y edad ósea adelantada. ¿Es pubertad precoz central?',
      modulo: 'pubertad',
      relato: 'Niña de 6 años y 10 meses. Telarquia Tanner M3 desde hace 6 meses, vello pubiano P2. Velocidad de crecimiento 8 cm/año. Edad ósea (Greulich y Pyle) 9 años 4 meses. Ecografía: útero de 45 mm con relación cuerpo/cuello 2:1 y línea endometrial visible; ovarios de 3 mL con folículos. LH basal 0,6 mUI/mL.',
      preguntas: [
        { q: '¿Cuál es el diagnóstico más probable?',
          ops: [
            { t: 'Pubertad precoz central', ok: true, fb: 'Correcto. Telarquia antes de los 8 años, edad ósea adelantada más de 1,5 a 2 años, útero puberal y LH basal ≥ 0,3 mUI/mL indican activación del eje.' },
            { t: 'Telarquia prematura aislada', fb: 'No. La telarquia aislada no acelera el crecimiento ni la edad ósea, y el útero sigue prepuberal.' },
            { t: 'Pubertad precoz periférica de origen adrenal', fb: 'No. El cuadro empieza por telarquia y la LH está en rango puberal: es dependiente de GnRH.' }
          ], ref: 'Pubertad precoz · Carel 2009 · Latronico 2016', url: B + 'pubertad' },
        { q: '¿Qué estudio corresponde antes de iniciar el tratamiento?',
          ops: [
            { t: 'RMN de cerebro para descartar lesión del SNC', ok: true, fb: 'Correcto. En la PPC se descartan hamartomas, gliomas o hidrocefalia, sobre todo antes de los 6 años o con evolución rápida.' },
            { t: 'Tomografía de abdomen', fb: 'No. La imagen abdominal se pide en la sospecha periférica (suprarrenal u ovario).' },
            { t: 'Ninguno: iniciar tratamiento directamente', fb: 'No. Antes de frenar el eje se descarta una causa orgánica central.' }
          ], ref: 'Pubertad precoz · Guías CaVeSal®', url: B + 'pubertad' },
        { q: '¿Cuál es la conducta para frenar el eje?',
          ops: [
            { t: 'Agonista de GnRH (leuprolide o triptorelina de depósito)', ok: true, fb: 'Correcto. Objetivo: velocidad de crecimiento menor de 4 a 5 cm/año, regresión o detención de Tanner y LH suprimida.' },
            { t: 'Anticonceptivo oral combinado', fb: 'No. No frena el eje ni protege la talla final.' },
            { t: 'Hidrocortisona', fb: 'No. La hidrocortisona es para la hiperplasia suprarrenal congénita.' }
          ], ref: 'Pubertad precoz · Carel 2009', url: B + 'pubertad' }
      ]
    },
    {
      id: 'adrenarca', sector: 'Adolescencia', titulo: 'Niña de 7 años con vello pubiano',
      resumen: 'Pubarca sin telarquia. ¿Adrenarca idiopática o hiperplasia suprarrenal no clásica?',
      modulo: 'pubertad',
      relato: 'Niña de 7 años. Vello pubiano P2 sin desarrollo mamario (M1), olor axilar. Edad ósea adelantada 0,5 años. Ecografía: útero de 30 mm, relación cuerpo/cuello 1:1, ovarios prepuberales. 17-OHP basal 1,5 ng/mL.',
      preguntas: [
        { q: '¿Cómo interpretás la 17-OHP basal de 1,5 ng/mL?',
          ops: [
            { t: 'Zona gris: requiere test de ACTH', ok: true, fb: 'Correcto. Menos de 1 descarta déficit mayor de 21-hidroxilasa; de 1 a 2 es zona gris; más de 2 es alta sospecha de HSC no clásica.' },
            { t: 'Normal: descarta hiperplasia suprarrenal', fb: 'No. El valor que descarta es menor de 1 ng/mL.' },
            { t: 'Confirma HSC no clásica', fb: 'No. La confirmación es la 17-OHP mayor de 10 ng/mL a los 60 minutos de ACTH.' }
          ], ref: 'Pubertad precoz · Speiser 2018', url: B + 'pubertad' },
        { q: 'La 17-OHP a los 60 minutos de ACTH es 14 ng/mL. ¿Conducta?',
          ops: [
            { t: 'HSC no clásica confirmada: hidrocortisona si hay progresión y adelanto óseo', ok: true, fb: 'Correcto. Más de 10 ng/mL tras ACTH confirma el déficit de 21-hidroxilasa no clásico.' },
            { t: 'Agonista de GnRH', fb: 'No. El origen es suprarrenal, no central. Solo se agrega si la HSC activa secundariamente el eje.' },
            { t: 'Control en un año sin tratamiento', fb: 'No. Con HSC confirmada se evalúa tratamiento según progresión y edad ósea.' }
          ], ref: 'Pubertad precoz · Speiser 2018', url: B + 'pubertad' }
      ]
    },
    {
      id: 'mec-aura', sector: 'Anticoncepción', titulo: 'Mujer de 38 años, fumadora, con migraña con aura',
      resumen: 'Pide la píldora combinada. ¿Qué método es seguro?',
      modulo: 'mec',
      relato: 'Mujer de 38 años, fuma 20 cigarrillos por día y tiene migraña con aura. Pide iniciar anticoncepción oral combinada.',
      preguntas: [
        { q: '¿Qué categoría MEC tiene el anticonceptivo hormonal combinado?',
          ops: [
            { t: 'Categoría 4: riesgo inaceptable', ok: true, fb: 'Correcto. La migraña con aura y el tabaquismo de 15 cigarrillos o más después de los 35 años son, cada uno, categoría 4.' },
            { t: 'Categoría 2: puede usarse', fb: 'No. Ambas condiciones aumentan el riesgo de ACV y trombosis.' },
            { t: 'Categoría 3: requiere seguimiento estrecho', fb: 'No. Las dos condiciones son categoría 4 para combinados.' }
          ], ref: 'Anticoncepción · US MEC 2024 · OMS MEC', url: B + 'mec' },
        { q: '¿Qué opción ofrecés?',
          ops: [
            { t: 'DIU de cobre, DIU-LNG o implante', ok: true, fb: 'Correcto. Los métodos sin estrógeno son elegibles; el DIU de cobre es categoría 1.' },
            { t: 'Anillo vaginal combinado', fb: 'No. El anillo también es combinado: misma categoría 4.' },
            { t: 'Parche combinado en dosis baja', fb: 'No. El parche es combinado: misma categoría 4.' }
          ], ref: 'Anticoncepción · US MEC 2024', url: B + 'mec' }
      ]
    },
    {
      id: 'incretina-ac', sector: 'Anticoncepción', titulo: 'Mujer de 30 años que inicia tirzepatida',
      resumen: 'Usa píldora combinada y planea embarazo en un año.',
      modulo: 'incretinas',
      relato: 'Mujer de 30 años, IMC 33. Inicia tirzepatida 2,5 mg semanal. Usa anticonceptivo oral combinado y desea embarazo dentro de un año.',
      preguntas: [
        { q: '¿Qué indicás sobre la anticoncepción?',
          ops: [
            { t: 'Agregar método de barrera 4 semanas tras el inicio y tras cada escalada de dosis', ok: true, fb: 'Correcto. La tirzepatida puede reducir la eficacia del anticonceptivo oral por el retraso del vaciamiento gástrico.' },
            { t: 'No cambia nada', fb: 'No. El prospecto indica barrera en esos períodos.' },
            { t: 'Suspender la píldora', fb: 'No. Se mantiene y se agrega barrera.' }
          ], ref: 'Incretinas · ZEPBOUND, prescribing information', url: B + 'incretinas' },
        { q: '¿Cuándo suspender antes de buscar el embarazo?',
          ops: [
            { t: 'Al menos 1 mes antes', ok: true, fb: 'Correcto para tirzepatida. Semaglutida: al menos 2 meses antes.' },
            { t: 'Al confirmar el embarazo', fb: 'No. Se suspende antes de la concepción planificada.' },
            { t: '6 meses antes', fb: 'No. El intervalo de la ficha técnica es de al menos 1 mes.' }
          ], ref: 'Incretinas · Mounjaro SmPC 2026', url: B + 'incretinas' }
      ]
    },
    {
      id: 'ovulacion', sector: 'Fertilidad', titulo: 'Pareja que busca embarazo, ciclos de 32 días',
      resumen: '¿Qué día ovula y cuándo pedir la progesterona?',
      modulo: 'fertilidad',
      relato: 'Mujer de 31 años, ciclos regulares de 32 días. Pregunta cuándo es su día fértil y el médico quiere confirmar la ovulación.',
      preguntas: [
        { q: '¿Qué día del ciclo se estima la ovulación?',
          ops: [
            { t: 'Día 18', ok: true, fb: 'Correcto. La fase lútea dura cerca de 14 días: 32 − 14 = día 18.' },
            { t: 'Día 14', fb: 'No. El día 14 vale para ciclos de 28 días.' },
            { t: 'Día 21', fb: 'No. El día 21 es el clásico para la progesterona en ciclos de 28 días.' }
          ], ref: 'Fertilidad · Ovulación y progesterona', url: B + 'fertilidad' },
        { q: '¿Cuándo pedir la progesterona sérica?',
          ops: [
            { t: '7 días después de la ovulación estimada (día 25 aproximado)', ok: true, fb: 'Correcto. Se mide en la fase lútea media, no en un día fijo.' },
            { t: 'Día 21 siempre', fb: 'No. El día 21 solo sirve en ciclos de 28 días.' },
            { t: 'Día 3 del ciclo', fb: 'No. El día 3 es para FSH, LH y estradiol basales.' }
          ], ref: 'Fertilidad · Ovulación y progesterona', url: B + 'fertilidad' }
      ]
    },
    {
      id: 'pareja', sector: 'Fertilidad', titulo: 'Mujer de 36 años, 6 meses sin lograr embarazo',
      resumen: '¿Ya corresponde estudiar? ¿Cómo se lee el espermograma?',
      modulo: 'pareja',
      relato: 'Mujer de 36 años y su pareja de 38. Buscan embarazo desde hace 6 meses con relaciones regulares. Espermograma: volumen 1,2 mL, concentración 12 millones/mL.',
      preguntas: [
        { q: '¿Corresponde estudiar a la pareja?',
          ops: [
            { t: 'Sí: con 35 años o más se estudia a los 6 meses, a ambos en paralelo', ok: true, fb: 'Correcto. Menores de 35: a los 12 meses. Desde los 35: a los 6 meses.' },
            { t: 'No: esperar 12 meses', fb: 'No. Los 12 meses son para menores de 35 años.' },
            { t: 'Solo a la mujer', fb: 'No. Se estudia a ambos en paralelo.' }
          ], ref: 'Pareja infértil · OMS 2025 · ASRM', url: B + 'pareja' },
        { q: '¿Cómo se interpreta el recuento total?',
          ops: [
            { t: 'Bajo: 1,2 × 12 = 14,4 millones por eyaculado (límite 39)', ok: true, fb: 'Correcto. Se repite el estudio y se completa la evaluación andrológica.' },
            { t: 'Normal porque la concentración supera 10 millones/mL', fb: 'No. El límite de concentración es 16 millones/mL y el total por eyaculado es 39 millones.' },
            { t: 'No se puede interpretar sin la movilidad', fb: 'No. El recuento total se calcula con volumen por concentración.' }
          ], ref: 'Pareja infértil · OMS 2021 (laboratorio de semen)', url: B + 'pareja' }
      ]
    },
    {
      id: 'somp-adol', sector: 'Fertilidad', titulo: 'Adolescente de 16 años con ciclos irregulares',
      resumen: 'Menarca a los 12, hirsutismo. ¿Pedís ecografía y AMH?',
      modulo: 'somp',
      relato: 'Adolescente de 16 años, menarca a los 12. Ciclos de 45 a 90 días desde hace 3 años e hirsutismo. IMC 32.',
      preguntas: [
        { q: '¿Usás la ecografía o la AMH para el diagnóstico de SOMP?',
          ops: [
            { t: 'No: con menos de 8 años desde la menarca se diagnostica con disfunción ovulatoria e hiperandrogenismo', ok: true, fb: 'Correcto. La guía internacional 2023 no usa ecografía ni AMH en ese período.' },
            { t: 'Sí: la ecografía es obligatoria', fb: 'No. En la adolescencia la morfología ovárica poliquística es frecuente y no diagnóstica.' },
            { t: 'Solo la AMH', fb: 'No. La AMH tampoco se usa en ese período.' }
          ], ref: 'SOMP · Guía internacional 2023', url: B + 'somp' },
        { q: 'Con IMC 32, ¿qué completa la evaluación?',
          ops: [
            { t: 'Estado glucémico (PTOG o HbA1c) y perfil lipídico', ok: true, fb: 'Correcto. El SOMP aumenta el riesgo de disglucemia; el módulo usa los cortes ADA.' },
            { t: 'Nada más', fb: 'No. Se evalúa el riesgo metabólico en toda paciente con SOMP.' },
            { t: 'Laparoscopía', fb: 'No. No tiene indicación diagnóstica.' }
          ], ref: 'SOMP · Guía internacional 2023 · ADA 2026', url: B + 'somp' }
      ]
    },
    {
      id: 'dm', sector: 'Endocrino', titulo: 'Mujer de 44 años con glucemia de ayunas alterada',
      resumen: 'Ayunas de 134 y HbA1c de 7,1 % en la misma muestra.',
      modulo: 'dm',
      relato: 'Mujer de 44 años, no embarazada, IMC 31, antecedente de diabetes gestacional. Laboratorio en una sola muestra: glucemia en ayunas 134 mg/dL y HbA1c 7,1 %. Sin síntomas.',
      preguntas: [
        { q: '¿Cuál es el diagnóstico?',
          ops: [
            { t: 'Diabetes: dos pruebas en rango en la misma muestra confirman', ok: true, fb: 'Correcto. Para la ADA 2026, dos pruebas distintas en rango de diabetes, en la misma muestra o en dos, confirman sin repetir.' },
            { t: 'Prediabetes', fb: 'No. Ayunas ≥ 126 y HbA1c ≥ 6,5 % están en rango de diabetes.' },
            { t: 'Hay que repetir ambas pruebas', fb: 'No. Repetir corresponde cuando hay un solo valor en rango de diabetes.' }
          ], ref: 'Diabetes · ADA 2026, sección 2', url: B + 'dm' },
        { q: 'Si solo la ayunas hubiera sido 105 mg/dL, ¿qué cambia entre ADA y OMS?',
          ops: [
            { t: 'ADA: prediabetes; OMS: normal (la glucemia en ayunas alterada empieza en 110)', ok: true, fb: 'Correcto. El módulo muestra las dos lecturas.' },
            { t: 'Ambas lo consideran normal', fb: 'No. La ADA usa 100 como corte de prediabetes.' },
            { t: 'Ambas lo consideran diabetes', fb: 'No. Diabetes es ≥ 126 mg/dL.' }
          ], ref: 'Diabetes · ADA 2026 · OMS 2006', url: B + 'dm' }
      ]
    },
    {
      id: 'vaginosis', sector: 'Infecciones', titulo: 'Flujo con mal olor',
      resumen: 'Flujo gris homogéneo y prueba de aminas positiva.',
      modulo: 'vaginitis',
      relato: 'Mujer de 27 años con flujo grisáceo homogéneo y olor a pescado que empeora tras las relaciones. pH vaginal 5,0, prueba de aminas positiva, células clave en el fresco.',
      preguntas: [
        { q: '¿Qué diagnóstico se confirma y con qué criterio?',
          ops: [
            { t: 'Vaginosis bacteriana: Amsel 4/4 (alcanzan 3 de 4)', ok: true, fb: 'Correcto. Flujo homogéneo, pH > 4,5, aminas positivas y células clave.' },
            { t: 'Candidiasis', fb: 'No. La candidiasis tiene pH normal y flujo grumoso.' },
            { t: 'Tricomoniasis segura', fb: 'No. La tricomoniasis requiere ver el parásito o una prueba de amplificación.' }
          ], ref: 'Infecciones genitales bajas · Amsel 1983 · CDC 2021', url: B + 'vaginitis' }
      ]
    },
    {
      id: 'popq', sector: 'Suelo pélvico', titulo: 'Bulto vaginal en una mujer de 63 años',
      resumen: 'Punto Ba a +2 cm. ¿Qué estadio POP-Q?',
      modulo: 'prolapso',
      relato: 'Mujer de 63 años con sensación de bulto vaginal. POP-Q: Aa +1, Ba +2, C −3, longitud vaginal total 9 cm. Pared posterior sin descenso.',
      preguntas: [
        { q: '¿Cuál es el estadio POP-Q?',
          ops: [
            { t: 'Estadio III: más de 1 cm por debajo del himen sin eversión completa', ok: true, fb: 'Correcto. El punto más distal es Ba +2: compartimento anterior (cistocele).' },
            { t: 'Estadio II', fb: 'No. El II llega hasta 1 cm por encima o por debajo del himen.' },
            { t: 'Estadio IV', fb: 'No. El IV es la eversión completa (cerca de la longitud vaginal total).' }
          ], ref: 'Prolapso genital · POP-Q (Bump 1996)', url: B + 'prolapso' }
      ]
    },
    {
      id: 'iu', sector: 'Suelo pélvico', titulo: 'Pérdidas de orina al toser y por urgencia',
      resumen: 'Diario miccional con nicturia y polaquiuria.',
      modulo: 'incontinencia',
      relato: 'Mujer de 55 años. Pierde orina al toser y también con urgencia. Diario: 10 micciones diurnas, 2 nocturnas. Sandvik: pérdidas una o más veces por semana (3) en cantidad mayor que gotas (2).',
      preguntas: [
        { q: '¿Tipo y severidad?',
          ops: [
            { t: 'Incontinencia mixta · Sandvik 6, moderada', ok: true, fb: 'Correcto. Frecuencia 3 × cantidad 2 = 6 (moderada 3 a 6).' },
            { t: 'Incontinencia de esfuerzo leve', fb: 'No. Hay componente de urgencia y el puntaje es 6.' },
            { t: 'Vejiga hiperactiva sin incontinencia', fb: 'No. Hay pérdidas.' }
          ], ref: 'Incontinencia urinaria · Sandvik', url: B + 'incontinencia' },
        { q: '¿Primer escalón terapéutico?',
          ops: [
            { t: 'Entrenamiento muscular del suelo pélvico y medidas conductuales', ok: true, fb: 'Correcto. Es la primera línea en la mixta; luego se trata el componente predominante.' },
            { t: 'Cirugía de cabestrillo de entrada', fb: 'No. La cirugía se reserva para el componente de esfuerzo que no responde.' },
            { t: 'Sonda vesical permanente', fb: 'No tiene indicación.' }
          ], ref: 'Incontinencia urinaria · bibliografía del módulo', url: B + 'incontinencia' }
      ]
    },
    {
      id: 'thm', sector: 'Climaterio', titulo: 'Mujer de 52 años con sofocos intensos',
      resumen: 'FUM hace 3 años, riesgo cardiovascular bajo.',
      modulo: 'thm',
      relato: 'Mujer de 52 años, FUM hace 3 años. Sofocos y trastornos del sueño. MRS 22 (severo). Normotensa, no fuma, sin antecedentes trombóticos ni cáncer de mama. Útero presente.',
      preguntas: [
        { q: '¿Está dentro de la ventana de tratamiento?',
          ops: [
            { t: 'Sí: menos de 60 años y menos de 10 años desde la FUM', ok: true, fb: 'Correcto. Con riesgo cardiovascular bajo, la THM es posible por vía oral o transdérmica.' },
            { t: 'No: ya pasaron más de 2 años', fb: 'No. La ventana es menos de 10 años desde la FUM o menos de 60 años.' },
            { t: 'Solo si el MRS supera 30', fb: 'No. El MRS mide severidad, no define la ventana.' }
          ], ref: 'Climaterio · FIGO/WHF 2026 · EMAS 2026', url: B + 'thm' },
        { q: 'Con útero presente, ¿qué agregás al estrógeno?',
          ops: [
            { t: 'Progestágeno para proteger el endometrio', ok: true, fb: 'Correcto. El estrógeno solo se reserva para histerectomizadas.' },
            { t: 'Nada', fb: 'No. Sin progestágeno aumenta el riesgo de hiperplasia endometrial.' },
            { t: 'Andrógenos', fb: 'No. No protegen el endometrio.' }
          ], ref: 'Climaterio · EMAS 2026', url: B + 'thm' }
      ]
    },
    {
      id: 'birads', sector: 'Oncología', titulo: 'Nódulo mamario sospechoso',
      resumen: 'Mamografía BI-RADS 4. ¿Qué hacés?',
      modulo: 'estudios',
      relato: 'Mujer de 48 años. Mamografía de tamizaje: nódulo de márgenes indistintos, categoría BI-RADS 4.',
      preguntas: [
        { q: '¿Conducta?',
          ops: [
            { t: 'Biopsia percutánea con aguja gruesa guiada por imagen', ok: true, fb: 'Correcto. BI-RADS 4 tiene probabilidad de malignidad de más de 2 % hasta 95 %: requiere histología y concordancia imagen-patología.' },
            { t: 'Control en 6 meses', fb: 'No. El control corto es para BI-RADS 3.' },
            { t: 'Mastectomía directa', fb: 'No. Primero se obtiene el diagnóstico histológico.' }
          ], ref: 'Mama, cérvix y endometrio · ACR BI-RADS', url: B + 'estudios' }
      ]
    },
    {
      id: 'figo', sector: 'Oncología', titulo: 'Carcinoma de cuello uterino de 3 cm',
      resumen: 'Lesión clínica limitada al cuello. ¿Estadio FIGO?',
      modulo: 'onco',
      relato: 'Mujer de 41 años con carcinoma escamoso de cuello uterino. Lesión visible de 3 cm limitada al cuello, sin compromiso de parametrios ni vagina. Sin ganglios por imagen.',
      preguntas: [
        { q: '¿Estadio FIGO 2018?',
          ops: [
            { t: 'IB2: mayor de 2 cm y hasta 4 cm', ok: true, fb: 'Correcto. IB1 hasta 2 cm, IB2 más de 2 hasta 4 cm, IB3 más de 4 cm.' },
            { t: 'IB1', fb: 'No. IB1 es hasta 2 cm.' },
            { t: 'IIA1', fb: 'No. IIA implica compromiso de los dos tercios superiores de la vagina.' }
          ], ref: 'Oncología ginecológica · FIGO 2018', url: B + 'onco' },
        { q: '¿Qué estudio de extensión es necesario?',
          ops: [
            { t: 'RM pélvica con contraste', ok: true, fb: 'Correcto. Evalúa tamaño local y parametrios; derivar a ginecología oncológica y comité.' },
            { t: 'Ninguno', fb: 'No. La RM es obligatoria salvo IA1 sin invasión linfovascular.' },
            { t: 'Solo ecografía transvaginal de rutina', fb: 'No. La estadificación por imagen de elección es la RM.' }
          ], ref: 'Oncología ginecológica · FIGO 2018', url: B + 'onco' }
      ]
    }
    ,{
      id: 'hua-mioma', sector: 'Ginecología', titulo: 'Mujer de 46 años con sangrado menstrual abundante',
      resumen: 'Ciclos de 22 días con 10 días de sangrado y anemia. ¿Qué causa PALM-COEIN y qué conducta?',
      modulo: 'hua',
      relato: 'Mujer de 46 años, β-hCG negativa. Ciclos cada 22 días con 10 días de sangrado abundante que interfiere con su trabajo. Hb 9,4 g/dL. Ecografía: mioma de 3 cm que protruye más del 50 % en la cavidad (FIGO 1).',
      preguntas: [
        { q: '¿Cómo se clasifica el patrón según FIGO 2018?',
          ops: [
            { t: 'Frecuente, prolongado y abundante', ok: true, fb: 'Correcto. Menos de 24 días es frecuente, más de 8 días es prolongado y el volumen lo define la paciente.' },
            { t: 'Normal, porque es regular', fb: 'No. Ser regular no alcanza: la frecuencia y la duración están fuera de rango.' },
            { t: 'Infrecuente', fb: 'No. Infrecuente es más de 38 días.' }
          ], ref: 'Sangrado uterino anormal · Munro 2018', url: B + 'hua' },
        { q: '¿Corresponde la biopsia endometrial?',
          ops: [
            { t: 'Sí, por tener 45 años o más con sangrado anormal', ok: true, fb: 'Correcto. Desde los 45 años con sangrado anormal se toma muestra del endometrio.' },
            { t: 'No, porque la causa es el mioma', fb: 'No. El mioma no descarta una hiperplasia coexistente.' },
            { t: 'Solo si el endometrio mide más de 4 mm', fb: 'No. El corte de 4 mm es para la posmenopausia.' }
          ], ref: 'Sangrado uterino anormal · ACOG PB 128', url: B + 'hua' },
        { q: '¿Cuál es el tratamiento de la causa?',
          ops: [
            { t: 'Miomectomía histeroscópica', ok: true, fb: 'Correcto. Los miomas FIGO 0 a 2 se resecan por histeroscopía; el tipo 2 puede requerir dos tiempos.' },
            { t: 'Solo hierro y control', fb: 'No. Hay que tratar la anemia y también la causa.' },
            { t: 'Ablación endometrial sin tratar el mioma', fb: 'No. El mioma submucoso es la causa y se reseca.' }
          ], ref: 'Sangrado uterino anormal · Guías CaVeSal®', url: B + 'hua' }
      ]
    },
    {
      id: 'amen-iop', sector: 'Endocrinología', titulo: 'Mujer de 32 años con 7 meses sin menstruar',
      resumen: 'β-hCG negativa, TSH y prolactina normales y FSH alta. ¿Qué diagnóstico y qué conducta?',
      modulo: 'amenorrea',
      relato: 'Mujer de 32 años con ciclos regulares hasta hace 7 meses. Sofocos. β-hCG negativa, TSH y prolactina normales. FSH 48 UI/L y, 6 semanas después, 52 UI/L.',
      preguntas: [
        { q: '¿Cuál es el diagnóstico?',
          ops: [
            { t: 'Insuficiencia ovárica prematura', ok: true, fb: 'Correcto. Amenorrea con FSH mayor de 25 UI/L en dos determinaciones con más de 4 semanas de diferencia y menos de 40 años.' },
            { t: 'Amenorrea hipotalámica funcional', fb: 'No. En la hipotalámica la FSH es normal o baja.' },
            { t: 'SOMP', fb: 'No. El SOMP no eleva la FSH a ese nivel.' }
          ], ref: 'Amenorrea · ESHRE POI 2016', url: B + 'amenorrea' },
        { q: '¿Qué estudios corresponden?',
          ops: [
            { t: 'Cariotipo, premutación FMR1 y anticuerpos adrenales y tiroideos', ok: true, fb: 'Correcto. Son las causas que cambian el seguimiento y el consejo familiar.' },
            { t: 'RMN de silla turca', fb: 'No. La falla es ovárica, no central.' },
            { t: 'Ninguno', fb: 'No. Se busca la causa.' }
          ], ref: 'Amenorrea · ESHRE POI 2024', url: B + 'amenorrea' },
        { q: '¿Cuál es la conducta hormonal?',
          ops: [
            { t: 'THM hasta la edad de la menopausia natural, salvo contraindicación', ok: true, fb: 'Correcto. Protege el hueso y el sistema cardiovascular; se mantiene hasta cerca de los 51 años.' },
            { t: 'No dar hormonas por el riesgo de cáncer de mama', fb: 'No. En la IOP la THM reemplaza lo que falta; el riesgo no es el de la posmenopausia.' },
            { t: 'Solo calcio y vitamina D', fb: 'No. Sin estrógenos se pierde hueso.' }
          ], ref: 'Amenorrea · ESHRE POI', url: B + 'amenorrea' }
      ]
    },
    {
      id: 'epi-ato', sector: 'Infecciones', titulo: 'Mujer de 22 años con dolor pélvico y fiebre',
      resumen: 'Dolor a la movilización, fiebre y masa anexial compleja. ¿Ambulatorio o internación?',
      modulo: 'epi',
      relato: 'Mujer de 22 años. Dolor pélvico de 4 días, fiebre de 38,8 °C, flujo mucopurulento, dolor a la movilización del cuello y anexial izquierdo. β-hCG negativa. Ecografía: masa anexial compleja de 6 cm compatible con absceso tubo-ovárico.',
      preguntas: [
        { q: '¿Dónde se trata?',
          ops: [
            { t: 'Internación', ok: true, fb: 'Correcto. El absceso tubo-ovárico es criterio de internación (CDC 2021).' },
            { t: 'Ambulatorio con control a las 72 horas', fb: 'No. Con absceso no corresponde el manejo ambulatorio.' },
            { t: 'Cirugía inmediata en todos los casos', fb: 'No. Se empieza con antibióticos parenterales; drenaje o cirugía si no responde, si es grande o si se rompe.' }
          ], ref: 'EPI · CDC 2021', url: B + 'epi' },
        { q: '¿Qué esquema parenteral es el recomendado?',
          ops: [
            { t: 'Ceftriaxona 1 g IV cada 24 h + doxiciclina + metronidazol', ok: true, fb: 'Correcto. Es el esquema recomendado por el CDC 2021.' },
            { t: 'Ceftriaxona sola', fb: 'No. Falta cobertura de clamidia y anaerobios.' },
            { t: 'Azitromicina dosis única', fb: 'No. No trata la EPI.' }
          ], ref: 'EPI · CDC 2021', url: B + 'epi' },
        { q: '¿Qué se hace con la pareja?',
          ops: [
            { t: 'Evaluar y tratar a las parejas de los últimos 60 días', ok: true, fb: 'Correcto. Tratamiento empírico de gonococo y clamidia.' },
            { t: 'Nada si no tiene síntomas', fb: 'No. La pareja asintomática también se trata.' },
            { t: 'Solo si el cultivo de la paciente es positivo', fb: 'No. Se trata igual.' }
          ], ref: 'EPI · CDC 2021', url: B + 'epi' }
      ]
    },
    {
      id: 'ectopico', sector: 'Ginecología', titulo: 'Dolor pélvico agudo con β-hCG positiva',
      resumen: 'Útero vacío y masa anexial. ¿Metotrexato o cirugía?',
      modulo: 'dolor',
      relato: 'Mujer de 29 años, hemodinámicamente estable, con dolor en fosa ilíaca derecha y atraso de 6 semanas. β-hCG 1800 mUI/mL. Ecografía transvaginal: útero vacío, masa anexial derecha de 2 cm sin actividad cardíaca, sin líquido libre. Sin lactancia ni enfermedad hepática o renal.',
      preguntas: [
        { q: '¿Cuál es el diagnóstico más probable?',
          ops: [
            { t: 'Embarazo ectópico tubario', ok: true, fb: 'Correcto. β-hCG positiva con útero vacío y masa anexial.' },
            { t: 'Quiste de cuerpo lúteo con embarazo intrauterino', fb: 'No. No hay saco intrauterino.' },
            { t: 'Torsión anexial', fb: 'No. La β-hCG positiva orienta a ectópico.' }
          ], ref: 'Dolor pélvico · ACOG PB 193', url: B + 'dolor' },
        { q: '¿Es candidata a metotrexato?',
          ops: [
            { t: 'Sí: estable, sin rotura, β-hCG menor de 5000 y sin actividad cardíaca', ok: true, fb: 'Correcto. Cumple los criterios y puede hacer el seguimiento.' },
            { t: 'No, siempre es quirúrgico', fb: 'No. El metotrexato es opción en casos seleccionados.' },
            { t: 'No, porque la β-hCG es menor de 3500', fb: 'No. La β-hCG baja favorece el metotrexato.' }
          ], ref: 'Dolor pélvico · ACOG PB 193', url: B + 'dolor' },
        { q: '¿Cómo se controla la respuesta?',
          ops: [
            { t: 'β-hCG los días 4 y 7: debe caer 15 % o más entre ambos', ok: true, fb: 'Correcto. Luego semanal hasta que sea negativa.' },
            { t: 'Ecografía diaria', fb: 'No. El control es con β-hCG.' },
            { t: 'No hace falta control', fb: 'No. Puede fallar y romperse.' }
          ], ref: 'Dolor pélvico · ACOG PB 193', url: B + 'dolor' }
      ]
    }
  ];
})(window);
