// Function Clean Caches
function cleanCaches(cacheName, numberItems) {
    caches.open(cacheName).then(cache => {
        cache.keys()
            .then(keys => {
                if (keys.length > numberItems) {
                    cache.delete(keys[0])
                        .then(cleanCaches(cacheName, numberItems));
                }
            });
    });

}

function updateCacheDynamic(dynamicCache, req, res) {
    if (res.ok) {
        caches.open(dynamicCache).then((cache) => {
            cache.put(req, res.clone()).then(() => {
                cleanCaches(dynamicCache, 50);
            });
            return res;
        });
    } else {
        return res;
    }
}
