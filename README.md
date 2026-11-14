# CaVeSal® GYN v1

Calculadora gineco-endocrinológica para profesionales de la salud. Sitio estático (HTML, CSS y JavaScript sin dependencias).

© 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence. Todos los derechos reservados. Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna.

## Qué incluye v1

Con lógica:
- Fertilidad: día de ovulación (ciclo − 14), dosaje de progesterona (ovulación + 7 a + 10), fechas si se carga la FUM, y clasificación del folículo líder para el trigger según esquema (letrozol, clomifeno, HMG/FSH).
- Preconcepcional: panel hormonal (FSH, LH, relación LH/FSH, AMH, TSH, prolactina, progesterona día 21).
- Escala MRS (Heinemann 2004): 11 ítems, total sobre 44 y subescalas somática, psicológica y urogenital.

Próximamente (sin cálculo, solo ficha): el resto de las funciones del catálogo del boceto.

## Demo y versión completa

- Demo: abiertas la escala MRS, el día de ovulación con la ventana de progesterona y la Calculadora de THM en modo SEGIRP 2026 (el modo combinado es Full) (`ABIERTAS_DEMO` en `js/licencia.js`).
- Versión completa: trigger por esquema, panel hormonal y todas las funciones nuevas.
- Mientras `REQUIERE_LICENCIA = false` todo queda abierto; `?demo=1` muestra la Demo para revisarla.
- La clave activada se guarda en `cavesal_gyn_full_unlocked`, que también abre Academy (`?desde=gyn`).

## Estructura

```
index.html            aviso legal, compuerta de licencia y app
css/estilos.css       paleta, modo claro y oscuro
js/textos-es.js       catálogo, textos de interfaz, legales y etiquetas
js/fertilidad.js      ciclo y trigger
js/preconcepcional.js panel hormonal
js/mrs.js             escala MRS
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
