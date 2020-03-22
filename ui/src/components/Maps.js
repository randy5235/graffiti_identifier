import React from "react";
import L from "leaflet";
import LCG from 'leaflet-control-geocoder';
import "../styles/Leaflet.css";
import "../styles/OpenCage.css";
import iconImg from "../styles/images/marker-icon.png";
import iconShadow from "../styles/images/marker-shadow.png";

class MapsPage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef;
  }

  /*global componentDidMount L, map:true*/ 
  componentDidMount() {

    //default coordinates to roughly Los Angeles
    var lat = 34;
    var lon = -118;
    var map = {};
    var mapZoom = 8;

    // render default on browser location denial
    const error = error => {
      renderMap();
      console.log(`ERROR: `,error);
    };

    // Acquire browser location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // render map to browser location
        function(position) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          mapZoom = 13;
          renderMap();
        },
        error,
        { enableHighAccuracy: true }
      );
    }

    //Load us up a map
    function renderMap() {

      var mapOptions = {
        center: [lat, lon],
        zoom: mapZoom
      };
        
        map =  new L.map("map", mapOptions);
        
        var layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
          
        map.addLayer(layer);
          
        // define a custom marker icon as leaflet's default image pathing is broken...
         var markerIcon = L.icon({
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
        const control = L.Control.GeoCoder
            
          const geocoder = L.Control.Geocoder.nominatim();
          let marker;
            
            map.on('click', e => {
              geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), results => {
                var r = results[0];
                if (r) {
                  if (marker) {
                    marker.
                    setLatLng(r.center).
                    setPopupContent(r.html || r.name).
                    openPopup();
                  } else {
                    marker = L.marker(r.center)
                    .bindPopup(r.name)
                    .addTo(map)
                    .openPopup();
                  }
                }
              })
            })
            
          }
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
