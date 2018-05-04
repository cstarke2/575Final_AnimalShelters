var map = L.map('map',{
			center: [39.8283, -98.5795],
			zoom: 5,
            minZoom: 4,
            maxZoom: 10
		});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
        
var catIcon = L.icon({
            iconUrl: 'cat.png',
            
            iconSize: [25, 33],
            iconAnchor: [12, 30],
            popupAnchor: [6, -20]
        });

function ShelterOne (feature, layer) {
    layer.bindPopup("<h3 class='headinfo'>Shelters 2011: "+feature.properties.shel11+"</h3><h3 class='headinfo'>Shelters 2012: "+feature.properties.shel12+"</h3><h3 class='headinfo'>Shelters 2013: "+feature.properties.shel13+"</h3><h3 class='headinfo'>Shelters 2014: "+feature.properties.shel14+"</h3><h3 class='headinfo'>Shelters 2015: "+feature.properties.shel15+"</h3><h3 class='headinfo'>Shelters 2016: "+feature.properties.shel16+"</h3><h3 class='headinfo'>Shelters 2017: "+feature.properties.shel17+"</h3>")
    layer.setIcon(catIcon);
}
L.geoJson(statesData).addTo(map);
L.geoJson(shelters,{
    onEachFeature: ShelterOne
    
}).addTo(map);

function getColor(d) {
    return d > 1000 ? '#708090' :
           d > 500  ? '#4682B4' :
           d > 200  ? '#008B8B' :
           d > 100  ? '#5F9EA0' :
           d > 50   ? '#ADD8E6' :
           d > 20   ? '#AFEEEE' :
           d > 10   ? '#E0FFFF' :
                      '#DCDCDC';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.shel17),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
}

L.geoJson(statesData, {style: style}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.6
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update();
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

var geojson;

geojson = L.geoJson(statesData);

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>2017 Shelter Count</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.shel17 + ' people / mi<sup>2</sup>'
        : '<h4>Hover over a state<h4>');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

