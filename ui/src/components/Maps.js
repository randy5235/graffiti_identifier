import React from "react";
import L from "leaflet";
import LCG from "leaflet-control-geocoder";
import "../styles/Leaflet.css";
import "../styles/leaflet-control-geocoder.css";
import iconImg from "../styles/images/marker-icon.png";
import iconShadow from "../styles/images/marker-shadow.png";
import UploadForm from "./UploadForm"

class MapsPage extends React.Component {
  //default coordinates to roughly Los Angeles
  lat = 34;
  lon = -118;
  map = {};
  userLayer = {}; // layer for storing markers added by user
  userMarker = {};
  lRef = L;
  mapZoom = 8;
  placingGraffiti = false;

  // define a custom marker icon as leaflet's default image pathing is broken...
  markerIcon = L.icon({
    iconUrl: iconImg,
    shadowUrl: iconShadow,
    iconSize: [20, 30], // size of the icon
    shadowSize: [20, 30], // size of the shadow
    iconAnchor: [10, 30], // point of the icon which will correspond to marker's location
    shadowAnchor: [5, 30], // the same for the shadow
    popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
  });


  constructor(props) {
    super(props);
    this.myRef = React.createRef;
  }

  renderMap() {
    let mapOptions = {
      center: [this.lat, this.lon],
      zoom: this.mapZoom,
      zoomControl: false
    };

    this.map = new L.map('map', mapOptions);

    let mapLayer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    );

    this.map.addLayer(mapLayer);

    this.userMarker = L.marker([1, 1], {icon: this.markerIcon});

    this.userLayer = L.layerGroup().addTo(this.map);

    const control = L.Control.GeoCoder;

    const geocoder = L.Control.Geocoder.nominatim();

    L.Control.geocoder().addTo(this.map);

    this.map.on("click", e => {
        this.userLayer.clearLayers();
        geocoder.reverse(
          e.latlng,
          this.map.options.crs.scale(this.map.getZoom()+7),//+7 sets higher zoom definition for more precise results
          results => {
            let r = results[0];
            if (r) {
              if (this.userMarker) {
                this.userMarker
                  .setLatLng(e.latlng)
                  .bindPopup();
                  if(!this.placingGraffiti)
                  {
                    this.userMarker.setPopupContent(r.html || r.name);
                  }
                  this.userMarker
                  .openPopup()
                  .dragging.enable();
              }
            }
          }
        );
        this.userMarker.addTo(this.userLayer);
    });

    this.userMarker.on('dragend', e => {
      this.userMarker
        .bindPopup()
        .openPopup();
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

  // Function to pass to children for setting map view
  MoveMapTo=(x, y, zoom)=>{
    this.map.setView([x, y], zoom);
    var marker = L.marker([x, y], {icon: this.markerIcon});
    marker.addTo(this.userLayer);
  }

  render() {
    return (
      <div>
        <div
          ref={this.myRef}
          id="map"
          style={{width: "100%", height: "100%", position: 'absolute' }}
          className="map"
        >
        </div>
        <UploadForm parentMap={this}>
        </UploadForm>
        <form>
          <input name="locationSearch" type="text"></input>
        </form>
        </div>
    );
  }
}

export default MapsPage;
