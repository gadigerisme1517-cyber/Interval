const V="interval-v58";
const SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./fonts/archivo-latin.woff2","./fonts/archivo-latin-ext.woff2","./fonts/intertight-latin.woff2","./fonts/intertight-latin-ext.woff2","./fonts/instrumentserif.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(/geojs\.io$|bigdatacloud\.net$/.test(u.hostname))return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put("./index.html",cp));return res}).catch(()=>caches.match("./index.html")));
    return;
  }
  // fonts, posters, same-origin files: show cached instantly, refresh in background
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>hit);
    return hit||net;
  }));
});
