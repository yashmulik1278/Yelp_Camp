mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [75.7139, 19.7515],
    zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
map.addSource('campgrounds', {
    type: 'geojson',
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50 
});

map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
            'circle-color': [
            'step',
            ['get', 'point_count'],
            '#E7E5DF',
            10,
            '#767267',
            30,
            '#655B36'],
            'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10,
            20,
            30,
            25]
    }
});

map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
    }
});

map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
    }
});

map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point,
    {
        layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('campgrounds').getClusterExpansionZoom(clusterId,(err, zoom) => {
        if (err) return;
        map.easeTo(
            {
                center: features[0].geometry.coordinates,zoom: zoom
            }
            );
    });
});
map.on('click', 'unclustered-point', (e) => {
    const {popUpMarkup} = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180)
            {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
    new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popUpMarkup)
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    });
