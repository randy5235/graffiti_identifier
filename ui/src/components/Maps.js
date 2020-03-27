import React from 'react';
import L from 'leaflet';
import LCG from 'leaflet-control-geocoder';
import '../styles/Leaflet.css';
import '../styles/OpenCage.css';
import iconImg from '../styles/images/marker-icon.png';
import iconShadow from '../styles/images/marker-shadow.png';

class MapsPage extends React.Component {
  //default coordinates to roughly Los Angeles
  lat = 34;
  lon = -118;
  map = {};
  mapZoom = 8;
  constructor(props) {
    super(props);
    this.myRef = React.createRef;
  }

  renderMap() {
    let mapOptions = {
      center: [this.lat, this.lon],
      zoom: this.mapZoom
    };

    this.map = new L.map('map', mapOptions);

    let layer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    );

    this.map.addLayer(layer);

    // define a custom marker icon as leaflet's default image pathing is broken...
    let markerIcon = L.icon({
      iconUrl: iconImg,
      shadowUrl: iconShadow,
      iconSize: [20, 30], // size of the icon
      shadowSize: [20, 30], // size of the shadow
      iconAnchor: [10, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 0], // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    // template for adding a marker

    //var marker = L.marker([lat, lon], {icon: markerIcon});
    //marker.addTo(map);

    // Search for location information based on Map click and add a popup marker
    const control = L.Control.GeoCoder;

    const geocoder = L.Control.Geocoder.nominatim();
    let marker;

    this.map.on('click', e => {
      geocoder.reverse(
        e.latlng,
        this.map.options.crs.scale(this.map.getZoom()),
        results => {
          let r = results[0];
          if (r) {
            if (marker) {
              marker
                .setLatLng(r.center)
                .setPopupContent(r.html || r.name)
                .openPopup();
            } else {
              marker = L.marker(r.center)
                .bindPopup(r.name)
                .addTo(this.map)
                .openPopup();
            }
          }
        }
      );
    });
  }

  componentDidMount() {
    // render default on browser location denial
    const error = error => {
      this.renderMap();
      console.log(`ERROR: `, error);
    };

    // Acquire browser location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // render map to browser location
        position => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          this.mapZoom = 13;
          this.renderMap();
        },
        error,
        {enableHighAccuracy: true}
      );
    }
  }

  render() {
    return (
      <div
        ref={this.myRef}
        id="map"
        style={{width: 400 + 'px', height: 400 + 'px'}}
        className="map"
      ></div>
    );
  }
}

export default MapsPage;
