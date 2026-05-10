const CACHE = 'bong-eats-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/bef.css',
  '/bef.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/1777834721676_image.png',
  '/sorshe_ilish.jpg',
  '/kasha_mangsho.jpg',
  '/chingri_malaikari.jpg',
  '/mutton_biryani.jpg',
  '/rui_kalia.jpg',
  '/egg_devil.jpg',
  '/veg_chop.jpg',
  '/basanti_polao-kasha_mangsho.jpg',
  '/veg_fried_rice-chiili_chicken.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});