const CACHE_NAME = 'ayatobox-v13';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/favicon.png',
  './assets/apple-touch-icon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/logo.png',
  './assets/illust.png',
  './assets/fv.png',
  './assets/fukidashi.png',
  './assets/timer.png',
  './assets/round.png',
  './assets/setting.png',
  './assets/go.png',
  './assets/backbutton.png',
  './assets/skipbutton.png',
  './assets/stopbutton.png',
  './assets/gong-start.mp3',
  './assets/gong-end.mp3',
  './assets/bgm/bgm-01.mp3',
  './assets/bgm/bgm-02.mp3',
  './assets/voice/fight.m4a',
  './assets/voice/finish.m4a',
  './assets/voice/interval.m4a',
  './assets/voice/round01.m4a',
  './assets/voice/round02.m4a',
  './assets/voice/round03.m4a',
  './assets/voice/round04.m4a',
  './assets/voice/round05.m4a',
  './assets/voice/round06.m4a',
  './assets/voice/round07.m4a',
  './assets/voice/round08.m4a',
  './assets/voice/round09.m4a',
  './assets/voice/round10.m4a',
  './assets/voice/round11.m4a',
  './assets/voice/round12.m4a',
  './assets/voice/time-1min.m4a',
  './assets/voice/time-half.m4a',
  './assets/voice/time-last1min.m4a',
  './assets/voice/time-last5sec.m4a',
  './assets/voice/cheer-iiyo.m4a',
  './assets/voice/cheer-ikeike.m4a',
  './assets/voice/cheer-madaikeru.m4a',
  './assets/voice/cheer-nice.m4a',
  './assets/voice/cheer-shuchu.m4a',
  './assets/voice/cheer-shuchushite.m4a',
  './assets/voice/cheer-sokoda.m4a',
  './assets/voice/cheer-sonochoushi.m4a'
];

// インストール時にアセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// キャッシュ優先、なければネットワーク
self.addEventListener('fetch', (event) => {
  // Google Fonts などの外部リソースはネットワーク優先
  if (!event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((response) => {
        // 成功したレスポンスをキャッシュに追加
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
