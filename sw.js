
importScripts('js/sw-util.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-util.js'
];

const  APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
];

self.addEventListener('install', (e) =>{

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable =  caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE));


    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', (e) => {
    const resp = caches.keys().then(keys => {
        keys.forEach(key=>{
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
            if(key !== DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(resp);
});

self.addEventListener('fetch', (e) => {

    if (!e.request.url.startsWith('http')){
        const resp =  caches.match(e.request).then(cache => {
            if(cache) {
                return cache;
            }else{
                return fetch(e.request).then(newResp => {
                    return updateCacheDynamic( DYNAMIC_CACHE, e.request, newResp );
                });
            }
        });

        e.respondWith(resp);
    };



});
