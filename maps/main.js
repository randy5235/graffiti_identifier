import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import sync from 'ol-hashed';
import {fromLonLat} from 'ol/proj';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import GeometryType from 'ol/geom/GeometryType';

const source = new VectorSource({
  format: new GeoJSON(),
  url: './data/countries.json'
});

const download = document.getElementById('download');

const layer = new VectorLayer({
  source: source
});

const map = new Map({
  target: 'map-container',
  layers: [/*
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './data/countries.json'
      })
    }),*/
    layer/*,
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
      })
    })*/
  ],
  view: new View({
    //center: fromLonLat([-122.7, 45.5]),
    center: [0, 0],
    zoom: 11
  })
});

map.addInteraction(new Draw({
  type: GeometryType.MULTI_POINT,
  source: source
}));

map.addInteraction(new Snap({
  source: source
}));

const clear = document.getElementById('clear');
clear.addEventListener('click', function() {
  source.clear();
});

sync(map);
