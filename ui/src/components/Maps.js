import React from "react";
import L from "leaflet";
import "../styles/Leaflet.css";
import "../styles/OpenCage.css";
import iconImg from "../styles/images/marker-icon.png";
import iconShadow from "../styles/images/marker-shadow.png";

class MapsPage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef;
  } /*eslint no-undef: "warn"*/ // stop eslint from throwing errors/warnings since ol depends on the following external script

  /*global componentDidMount L, map, ol:true*/ componentDidMount() {
    // const leafletScript = document.createElement("script");
    const openCageScript = document.createElement("script");
    // leafletScript.async = true;
    openCageScript.async = true;
    // leafletScript.src = "https://unpkg.com/leaflet@1.6.0/dist/leaflet.js";
    openCageScript.src =
      "https://cdn.jsdelivr.net/gh/opencagedata/leaflet-opencage-search@1.3.0/dist/js/L.Control.OpenCageSearch.min.js";

    //document.head.appendChild(leafletScript);
    //leafletScript.onload = function() {
    document.head.appendChild(openCageScript);
    //};
    var lat = 37.41;
    var lon = 8.82;
    const error = error => console.log(error);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          console.log(lat, lon);
        },
        error,
        { enableHighAccuracy: true }
      );
    }
    openCageScript.onload = function() {
      // onload not supported by older IE TODO: add readystate functionality
      // =================
      // Map functionality
      // =================
      var mapOptions = {
        center: [lat, lon],
        zoom: 20
      };
      const openCageKey = process.env.REACT_APP_OPENCAGE_API_KEY;
      console.log(`key value`, openCageKey);
      var geocodeOptions = {
        key: "bf942964c7504d93987e3decca324bc6", // Testing level api key, 2500 requests per day, prefferably less than 1 per second.
        limit: 10,
        proximity: lat + ", " + lon
      };

      var map = new L.map("map", mapOptions);

      var layer = new L.TileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      );

      map.addLayer(layer);

      var markerIcon = L.icon({
        iconUrl: iconImg,
        shadowUrl: iconShadow,

        iconSize: [20, 30], // size of the icon
        shadowSize: [20, 30], // size of the shadow
        iconAnchor: [10, 0], // point of the icon which will correspond to marker's location
        shadowAnchor: [5, 0], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      });

      var marker = L.marker([lat, lon], { icon: markerIcon });

      marker.addTo(map);

      var control = L.Control.openCageSearch(geocodeOptions).addTo(map);
    };
  }

  render() {
    return (
      <div
        ref={this.myRef}
        id="map"
        style={{ width: 400 + "px", height: 400 + "px" }}
        className="map"
      ></div>
    );
  }
}

export default MapsPage;
