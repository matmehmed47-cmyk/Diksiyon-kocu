// Çevrimdışı çalışma: önce ağdan dene (güncel sürüm gelsin), olmazsa önbellekten aç.
var ONBELLEK = 'diksiyon-v30';
var DOSYALAR = [
  './', './index.html', './style.css', './app.js', './metinler.js', './calismalar.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(ONBELLEK).then(function (c) { return c.addAll(DOSYALAR.map(function (u) { return new Request(u, { cache: 'reload' }); })); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.filter(function (a) { return a !== ONBELLEK; }).map(function (a) { return caches.delete(a); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var istek = e.request;
  if (istek.method !== 'GET') return;
  var url = new URL(istek.url);
  var ayniKaynak = url.origin === self.location.origin;
  var yaziTipi = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!ayniKaynak && !yaziTipi) return;

  e.respondWith(
    // no-cache: tarayıcının HTTP önbelleğindeki eski kopyayı kullanma, sunucuya sor
    fetch(ayniKaynak ? new Request(istek.url, { cache: 'no-cache' }) : istek).then(function (yanit) {
      if (yanit && (yanit.ok || yanit.type === 'opaque')) {
        var kopya = yanit.clone();
        caches.open(ONBELLEK).then(function (c) { c.put(istek, kopya); });
      }
      return yanit;
    }).catch(function () {
      return caches.match(istek, { ignoreSearch: true }).then(function (k) { return k || caches.match('./index.html'); });
    })
  );
});
