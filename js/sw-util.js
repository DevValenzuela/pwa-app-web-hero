
function updateCacheDynamic(dynamicCache, req, res) {
    if (res.ok) {
        caches.open(dynamicCache).then((cache) => {
            cache.put(req, res.clone());
            return res;
        });
    } else {
        return res;
    }
}
