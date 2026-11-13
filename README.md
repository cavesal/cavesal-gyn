# CaVeSal® GYN v1

Calculadora gineco-endocrinológica para profesionales de la salud. Sitio estático (HTML, CSS y JavaScript sin dependencias).

© 2026 Dr. Carlos Vera Salerno · CaVeSal® Maternal Fetal Intelligence. Todos los derechos reservados. Protegido por la Ley N.º 1328/1998 de Paraguay y el Convenio de Berna.

## Qué incluye v1

Con lógica:
- Fertilidad: día de ovulación (ciclo − 14), dosaje de progesterona (ovulación + 7 a + 10), fechas si se carga la FUM, y clasificación del folículo líder para el trigger según esquema (letrozol, clomifeno, HMG/FSH).
- Preconcepcional: panel hormonal (FSH, LH, relación LH/FSH, AMH, TSH, prolactina, progesterona día 21).
- Escala MRS (Heinemann 2004): 11 ítems, total sobre 44 y subescalas somática, psicológica y urogenital.

Próximamente (sin cálculo, solo ficha): el resto de las funciones del catálogo del boceto.

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
boceto/               boceto original de referencia
assets/               logo (pendiente)
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
5. Colocar el logo en `assets/logo-gyn.png`.

## Pendiente de validación clínica (VALIDAR CON CARLOS)

- `js/fertilidad.js`: ventana de progesterona (+7 a +10) y umbrales de folículo para el trigger, tomados de la literatura.
- `js/preconcepcional.js`: unidades de cada hormona.

## Precio

Igual que la Calculadora Prenatal y Emergencias, con los mismos planes anuales desde 2027. Se suma un Mega Combo de 4 apps (precio a definir). No se publica precio en esta versión.
