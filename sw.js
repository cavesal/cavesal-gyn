/* CaVeSal® GYN — service worker. Subir VERSION en cada publicación. */
const VERSION = "cavesal-gyn-v27";
const PRECACHE = [
  "./",
  "./acerca.html",
  "./demo/",
  "./demo/manifest.json",
  "./full/",
  "./full/manifest.json",
  "./assets/apple-touch-icon.png",
  "./assets/favicon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/logo-gyn-icono.png",
  "./assets/logo-gyn.jpg",
  "./bibliografia.html",
  "./css/acerca.css",
  "./css/estilos.css",
  "./img/cavesal-academy.png",
  "./img/cavesal-emblema.png",
  "./img/manual/01-aviso.jpg",
  "./img/manual/11-pacientes.jpg",
  "./img/manual/12-progestagenos.jpg",
  "./img/manual/13-aemergencia.jpg",
  "./img/manual/02-inicio-demo.jpg",
  "./img/manual/03-bloqueo.jpg",
  "./img/manual/04-activar.jpg",
  "./img/manual/05-fertilidad-demo.jpg",
  "./img/manual/06-fertilidad.jpg",
  "./img/manual/07-panel.jpg",
  "./img/manual/08-mrs.jpg",
  "./img/manual/09-proximamente.jpg",
  "./img/manual/10-acerca.jpg",
  "./img/qr-ecosistema.png",
  "./img/qr-mama.png",
  "./img/qr-mujer.png",
  "./index.html",
  "./js/app.js",
  "./js/comun.js",
  "./js/cvs-lic.js",
  "./js/dm.js",
  "./js/ejemplos.js",
  "./js/endometriosis.js",
  "./js/estudios.js",
  "./js/fertilidad.js",
  "./js/amenorrea.js",
  "./js/dolor.js",
  "./js/epi.js",
  "./js/laboratorio.js",
  "./js/marcadores.js",
  "./js/ecogin.js",
  "./js/densitometria.js",
  "./js/induccion.js",
  "./js/sho.js",
  "./js/metodos.js",
  "./js/genetica.js",
  "./js/progestagenos.js",
  "./js/aemergencia.js",
  "./js/pacientes.js",
  "./js/ficha.js",
  "./js/hua.js",
  "./js/imc.js",
  "./js/incontinencia.js",
  "./js/incretinas.js",
  "./js/licencia.js",
  "./js/mec.js",
  "./js/mrs.js",
  "./js/onco.js",
  "./js/orads.js",
  "./js/pareja.js",
  "./js/preconcepcional.js",
  "./js/prolapso.js",
  "./js/pubertad.js",
  "./js/ia.js",
  "./js/puente.js",
  "./js/pwa.js",
  "./js/sim-gyn.js",
  "./js/somp.js",
  "./js/textos-es.js",
  "./js/thm.js",
  "./js/utero.js",
  "./js/vaginitis.js",
  "./manifest.json",
  "./manual.html",
  "./manual-en.html",
  "./manual-pt.html",
  "./simulador.html",
  "./og-cover-gyn.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => /^cavesal-gyn-v\d+$/.test(k) && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // licencias, IA y pagos: siempre red
  if (req.mode === "navigate" || /\.(html|js|css|json)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req, { cache: "no-cache" }).then(r => {
        if (r && r.status === 200) { const c = r.clone(); caches.open(VERSION).then(ca => ca.put(req, c)); }
        return r;
      }).catch(() => caches.match(req).then(m => m || caches.match(req, { ignoreSearch: true })).then(m => m || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => {
      const net = fetch(req).then(r => {
        if (r && r.status === 200) { const c = r.clone(); caches.open(VERSION).then(ca => ca.put(req, c)); }
        return r;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
