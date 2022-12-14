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

fetch('./markers.json')
    .then((res) => res.json())
    .then((json) => {
        for(i=0;i<json.length;i++)
        {
            var icon = L.icon({
                iconUrl: 'https://cdn.mapgenie.io/images/games/pokemon-scarlet-violet/markers.png',
                iconSize: [33,44],
                iconAnchor: [16.5,44]
            });
            for(j=0;j<json[i].markers.length;j++)
            {
                var marker = L.marker([json[i].markers[j][0], json[i].markers[j][1]], {
                    icon: icon
                });
                marker.addTo(map);
                marker._icon.classList.add(json[i].css)
                let content;
                if(json[i].markers[j].length == 2) content = `<p>${json[i].type}</p>`;
                else content = `<p>${json[i].markers[j][2]}</p>`;
                var popup = L.popup([json[i].markers[j][0], json[i].markers[j][1]], {
                    content: content
                });
                marker.bindPopup(popup);
            }
        }
    });

var m = L.marker([-256,256], {
    draggable: true
})
m.addTo(map);
m.on("moveend", function(e){
    console.log([m.getLatLng().lat, m.getLatLng().lng])
    navigator.clipboard.writeText(`[${m.getLatLng().lat}, ${m.getLatLng().lng}]`)
});