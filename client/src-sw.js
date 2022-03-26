const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
// StaleWhileRevalidate checks the cache first for a response and if it finds one, it will return it. Caching js and css requires workbox-strategies to be installed and to actually respond to requests with a cached response, we need to use a strategy called StaleWhileRevalidate.
const { StaleWhileRevalidate, CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// the precacheAndRoute() method takes an array of urls to precache. the self._WB_MANIFEST is an array that contains the list of urls to precache.
precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching

// set up asset cache.
registerRoute(
  // here we define the callback function that will filter the request we want to cache (in this case, js and css files).
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // this plugin will cache responses with these headers to a max-age of 30 days.
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);