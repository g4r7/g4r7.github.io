// based on https://dev.to/stefnotch/enabling-coop-coep-without-touching-the-server-2d3n

if (typeof window !== 'undefined') {

  // ---------------------------------------------------------------------------
  // in main thread (initial load via `<script>`): register sw globally

  const verPage = window.document.currentScript.src.match(/(\w+)\.sw\.js/)[1];
  console.log(verPage, '[page.sw]');

  function condReload(reg) {
    // in some environments it becomes active with a short delay (e.g. Chrome incognito)
    if (reg.active) {
      console.warn("[page.sw] active (reloading):", navigator.serviceWorker.controller);
      setTimeout(_ => window.location.reload(), 1000);
      // window.alert('reloading from service worker');
      return true;
    }
  }

  function register() {
    navigator.serviceWorker
      .register(window.document.currentScript.src, {scope: "/"})
      .then(reg => {
        let status;
        if      (reg.installing) status = "installing";
        else if (reg.waiting)    status = "installed";
        else if (reg.active)     status = "active";
        console.warn(verPage, '[page.sw] sw registered &', status, navigator.serviceWorker.controller);

        // NOTE: sw takes control even w/o reload (via clients.claim) but it
        // ensures all resources were loaded through sw and cached for offline use
        condReload(reg) || setTimeout(_ => condReload(reg), 100);
      });
  }

  if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
      const verActive = navigator.serviceWorker.controller.scriptURL.match(/(\w+)\.sw\.js/)[1];
      if (verPage == verActive) {
        console.log(verPage, '[page.sw] sw in control.', window.document.currentScript.src);
      } else {
        console.warn(verPage, '[page.sw] sw stale, re-registering', window.document.currentScript.src);
        register();
      }
    } else {
      console.warn(verPage, '[page.sw] sw register...', window.document.currentScript.src);
      register();
    }
  } else {
    console.warn(verPage, "[page.sw] service workers not supported");
  }

} else {
  // ---------------------------------------------------------------------------
  // in SW context (subsequent load via `register`): install & activate for page

  const verActive = self.location.pathname.match(/(\w+)\.sw\.js/)[1];
  console.log(verActive, '[sw] init');

  function revalidateVersion(_verClient) {
    fetch('/_/version')
      .then(res => {
        if (res.status !== 200) {
          throw res;
        } else {
          return res.text();
        }
      })
      .then(verServer => {
        console.log(verActive, '[sw] verServer', verServer, 'verClient', _verClient);
        if (verServer === verActive) {
          console.log(verActive, '[sw] cache is fresh');
        } else {
          console.warn(verActive, '[sw] cache is stale, deleting', verActive, '& loading', verServer, 'in 10s...');
          setTimeout(_ => {
            console.warn(verActive, '[sw] deleting', verActive, '& reloading', verServer);
            caches.keys().then(kk => {
              console.warn(verActive, '[sw] deleting caches.keys', kk);
              for (const k of kk) {
                console.warn(verActive, '[sw] deleting', k);
                caches.delete(k);
              }
              self.clients.matchAll().then(clients => {
                console.warn(verActive, '[sw] reloading clients', clients);
                clients.forEach(client =>
                  client.postMessage('[:F.sw/reload {:verActive ' + verActive + ' :verServer ' + verServer + '}]')
                )
              });
            });
          },10000);
        }
      })
      .catch(err => console.error(verActive, '[sw] version validation failed', err));
  }

  const putInCache = async (req, res) => {
    await caches.open(verActive).then(C => C.put(req, res));
  };

  const cacheFirst = async (ctx, req, urlOrig) => {
    const resCached = await caches.open(verActive).then(C => C.match(req));
    const ctxBlock = "{" + ctx + "}";
    if (resCached) {
      console.log(verActive, '[sw] GET [cache]', ctxBlock, urlOrig.pathname, resCached);
      return resCached;
    } else {
      console.log(verActive, '[sw] GET [fetch]', ctxBlock, urlOrig.pathname, "->", req);
      const resFetched = await fetch(req);
      console.log(verActive, '[sw] GET [fetched]', resFetched.status, resFetched.redirected);
      if (resFetched.status == 200
          && (! resFetched.redirected)
          && verActive !== "CURRENT"
          )
        putInCache(req, resFetched.clone());
      return resFetched;
    }
  };

  function add_coep_coop(res) {
    if (res.status == 0) {
      console.error(verActive, "[sw] invalid response:", res);
      return res;
    } else {
      const hdrs = new Headers(res.headers);
      hdrs.set("Cross-Origin-Embedder-Policy", "require-corp")
      hdrs.set("Cross-Origin-Opener-Policy", "same-origin");
      return new Response(res.body, {
        headers: hdrs,
        status: res.status,
        statusText: res.statusText
      });
    }
  }

  self.addEventListener("install", _ev => {
    console.log(verActive, '[sw] install');
    self.skipWaiting();
  });

  self.addEventListener("activate", ev => {
    console.log(verActive, '[sw] activate');
    ev.waitUntil(self.clients.claim())
  });

  // replaces error 'Uncaught (in promise) TypeError: Failed to fetch'
  // with warning 'The FetchEvent for ... resulted in a network error response:
  // an object that was not a Response was passed to respondWith().'
  const errIdentity = err => err

  const isCOR    = url => url.host !== self.location.host;
  const hasVPre  = url => url.pathname.match(RegExp("^/(\\d+|CURRENT)[/\.]")); // != verActive during upgrade
  const isRoot   = url => url.pathname.match(/^\/?$/);
  const isWorker = url => url.pathname.match(/^\/\w+\/static\/js\/worker.js/);
  const isImg    = url => url.pathname.match(/^\/\w+\/static\/img\//);
  const isJsLib  = url => url.pathname.match(/^\/static\/js-lib\//);
  const isSW     = url => url.pathname.match(/^\/\w+\.sw.js/);
  const is_      = url => url.pathname.match(/^\/_/);
  const isView   = url => url.pathname.match(/^\/view\//);
  const isHtml   = url => url.pathname.endsWith(".html");

  self.addEventListener("message", ev => {
    console.warn(verActive, '[sw] APP MESSAGE', ev.data);
    self.clients.matchAll().then(clients =>
      clients.forEach(client => client.postMessage('[:F.sw/hi]'))
    );
    revalidateVersion(ev.data.verClient);
  })

  self.addEventListener("fetch", ev => {

    const url = new URL(ev.request.url);

    // console.log(url);

    // console.log(verActive, '[sw] FETCH', url.pathname);

    // if (ev.request.cache === "only-if-cached"
    //  && ev.request.mode  !== "same-origin")
    //   return;

    if (isCOR(url)) {
      console.log(verActive, "[sw] EXT", url.href);
      return; // NOP
    } else if (isRoot(url)) {
      ev.respondWith(cacheFirst("ROOT", ev.request, url).then(add_coep_coop, errIdentity));
    } else if (hasVPre(url)) {
      if (isWorker(url)) {
        ev.respondWith(cacheFirst("/V/static/js/worker.js", ev.request, url).then(add_coep_coop, errIdentity));
      } else if (isImg(url)) {
        ev.respondWith(cacheFirst("/V/static/img/", ev.request, url));
      } else if (isSW(url)) {
        console.log(verActive, "[sw] GET /V.sw.js");
        return; // NOP (this file; cached automatically; allow update attempt)
      } else {
        ev.respondWith(cacheFirst("/V/*", ev.request, url));
      }
    } else if (isJsLib(url)) {
      ev.respondWith(cacheFirst("/static/js-lib/", ev.request, url).then(add_coep_coop, errIdentity));
    } else if (is_(url)) {
      console.log(verActive, "[sw] GET {/_/*}");
      return; // NOP
    } else if (isHtml(url)) {
      console.log(verActive, "[sw] GET {/*.html}");
      return; // NOP
    } else if (isView(url)) {
      ev.respondWith(cacheFirst("/view/* -> ROOT", self.location.origin, url));
    } else {
      ev.respondWith(cacheFirst("* -> ROOT", self.location.origin, url));
    }
  });
}
