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
  mapZoom = 8;

  // define a custom marker icon as leaflet's default image pathing is broken...
  markerIcon = L.icon({
    iconUrl: iconImg,
    shadowUrl: iconShadow,
    iconSize: [20, 30], // size of the icon
    shadowSize: [20, 30], // size of the shadow
    iconAnchor: [10, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [5, 0], // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
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

    let layer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    );

    this.map.addLayer(layer);

    const control = L.Control.GeoCoder;

    const geocoder = L.Control.Geocoder.nominatim();

    L.Control.geocoder().addTo(this.map);
    
    let marker;

    this.map.on("click", e => {
        geocoder.reverse(
          e.latlng,
          this.map.options.crs.scale(this.map.getZoom()+3),//+3 sets higher zoom definition for more precise results
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

  // Function to pass to children for setting map view
  MoveMapTo=(x, y, zoom)=>{
    console.log(x, y, zoom);
    this.map.setView([x, y], zoom);
    var marker = L.marker([x, y], {icon: this.markerIcon});
    marker.addTo(this.map);
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
        <UploadForm AdjustMap={this.MoveMapTo.bind(this)}>
        </UploadForm>
        <form>
          <input name="locationSearch" type="text"></input>
        </form>
        </div>
    );
  }
}

export default MapsPage;
