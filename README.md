# CaVeSal® GYN v1

Calculadora gineco-endocrinológica para profesionales de la salud. Sitio estático (HTML, CSS y JavaScript sin dependencias).

© 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence. Todos los derechos reservados. Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna.

## Qué incluye v1

Con lógica:
- Fertilidad: día de ovulación (ciclo − 14), dosaje de progesterona (ovulación + 7 a + 10), fechas si se carga la FUM, y clasificación del folículo líder para el trigger según esquema (letrozol, clomifeno, HMG/FSH).
- Preconcepcional: semáforo de riesgo del MSPBS 2022 (ambigüedades de edad, Hb e IMC resueltas con OMS y ACOG), ácido fólico (dosis, momento, MTHFR) y panel hormonal (FSH, LH, relación LH/FSH, AMH, TSH con anti-TPO, levotiroxina y FIV, prolactina, progesterona día 21), anti-Tg y alertas de lupus, SAF y trombofilia.
- Estudio de la pareja (solo Full): cuándo estudiar, espermograma OMS 2021 y REM, ovulación, reserva (RFA/AMH), útero-trompas y siguiente paso.
- SOMP (solo Full): criterios 2023 con adolescentes y fenotipos, exclusiones, IMC, HOMA-IR y glucemia ADA.
- Escala MRS (Heinemann 2004): 11 ítems, total sobre 44 y subescalas somática, psicológica y urogenital.
- Incretinas (solo Full): semaglutida y tirzepatida con indicación por IMC, contraindicaciones y precauciones, escalada cada 4 semanas con fecha, respuesta a 12 semanas (<5 % insuficiente), washout por molécula, anticoncepción, estudios basales y signos de alarma.
- Masa anexial (solo Full): O-RADS US v2022, reglas simples IOTA y GI-RADS, con marcadores, imagen complementaria y derivación.
- Mama, cérvix y endometrio (solo Full): BI-RADS v2025, tamizaje ASCCP con conducta por resultado y grosor endometrial con IETA.
- Útero (solo Full): MUSA revisado 2022 y miomas FIGO con STEP-W.
- Endometriosis (solo Full): sospecha clínica, IDEA, #Enzian 2021, rASRM, EFI y conducta ESHRE 2022.
- Prolapso: POP-Q abierto en la Demo; conducta (pesario, cirugía por compartimento) solo Full.
- Incontinencia (solo Full): tipo, Stamey, Sandvik, diario miccional y conducta con dosis.
- Oncología (solo Full): estadificación FIGO de cérvix 2018, endometrio 2023 con grupo molecular y ovario 2014, con estudios de extensión y conducta sin dosis.

Próximamente (sin cálculo, solo ficha): el resto de las funciones del catálogo del boceto.

## Demo y versión completa

- Demo: abiertas la escala MRS, el día de ovulación con la ventana de progesterona , la Calculadora de THM en modo SEGIRP 2026 (el modo combinado es Full), el POP-Q y el IMC (`ABIERTAS_DEMO` en `js/licencia.js`).
- Versión completa: trigger por esquema, panel hormonal y todas las funciones nuevas.
- Mientras `REQUIERE_LICENCIA = false` todo queda abierto; `?demo=1` muestra la Demo para revisarla.
- La clave activada se guarda en `cavesal_gyn_full_unlocked`, que también abre Academy (`?desde=gyn`).

## Estructura

```
index.html            aviso legal, compuerta de licencia y app
css/estilos.css       paleta, modo claro y oscuro
js/textos-es.js       catálogo, textos de interfaz, legales y etiquetas
js/fertilidad.js      ciclo y trigger
js/preconcepcional.js semáforo MSPBS, ácido fólico y panel hormonal
js/pareja.js          estudio de la pareja infértil
js/somp.js            SOMP: criterios, fenotipo y HOMA-IR
js/mrs.js             escala MRS
js/incretinas.js      incretinas: escalada, contraindicaciones y alarma
js/comun.js           ayudantes de formulario de imágenes y oncología
js/orads.js           O-RADS, IOTA y GI-RADS
js/estudios.js        BI-RADS, tamizaje de cuello uterino y grosor endometrial
js/utero.js           MUSA y miomas FIGO con STEP-W
js/endometriosis.js   Sospecha, IDEA, #Enzian, rASRM, EFI y conducta
js/incontinencia.js   Tipo, Stamey, Sandvik, diario miccional y conducta
js/imc.js             IMC con clase OMS (Demo)
js/onco.js            estadificación FIGO
js/licencia.js        licencia (producto gyn)
js/cvs-lic.js         persistencia y reactivación de la clave
js/app.js             rutas, filtros y pantallas
tests.html            pruebas obligatorias
acerca.html           autoría, ecosistema, QR, tutoriales, bases y aviso legal
manual.html           tutorial en español (EN y PT cuando se traduzca la app)
bibliografia.html     referencias completas por función
css/acerca.css        estilos de Acerca y bibliografía
img/                  emblema, Academy, QR e imágenes del tutorial
boceto/               boceto original de referencia
assets/               logo del landing e ícono
```

## Probar localmente

```
python3 -m http.server 8000
```

Abrir `http://localhost:8000/` y `http://localhost:8000/tests.html` (debe decir "Todas aprobadas").

## Antes de publicar

1. En `js/licencia.js`, poner `REQUIERE_LICENCIA = true`.
2. Confirmar la URL del script de licencias y agregar el producto `gyn` en el backend.
3. Activar GitHub Pages y el dominio.
4. Manifest y PWA, si se quieren.
5. Logo: `assets/logo-gyn.jpg` (el del landing) y `assets/logo-gyn-icono.png` (recorte para encabezado e ícono).

## Pendiente de validación clínica (VALIDAR CON CARLOS)

- `js/fertilidad.js`: ventana de progesterona (+7 a +10).
- `js/preconcepcional.js`: unidades de cada hormona.

## Precio

Igual que la Calculadora Prenatal y Emergencias: USD 19.90 de por vida en el lanzamiento; desde 2027, USD 59.90 de por vida o USD 11.90 al año.

Mega Combo (Calculadora + Historia Clínica + Emergencias + GYN), aprobado el 13/11/2026: USD 49.90 de lanzamiento; desde 2027, USD 149.90 de por vida o USD 29.90 al año. No se publica hasta que salga GYN.
