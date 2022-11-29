var map = L.map('map', {
    minZoom:0,
    maxZoom:3,
    center:[-256, 256],
    zoom:0,
    crs: L.CRS.Simple,
});

L.tileLayer('https://www.serebii.net/pokearth/paldea/map/tile_{z}-{x}-{y}.png', {
    minZoom:0,
    maxZoom:3,
}).addTo(map);