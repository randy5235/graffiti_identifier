import React from "react";
import "../styles/Leaflet.css"
class MapsPage extends React.Component {
  constructor(props)
  {
    super(props)
    this.myRef = React.createRef;
  }
  /*global componentDidMount L, map, ol:true*/ // stop eslint from throwing errors/warnings since ol depends on the following external script
  componentDidMount(){
    const script = document.createElement("script");
    script.src = "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js";
    script.async = true;
    document.head.appendChild(script);


    script.onload = function()
    { // onload not supported by older IE TODO: add readystate functionality
        // =================
        // Map functionality
        // =================
        var lat = 37.41;
        var lon = 8.82;
        if(navigator.geolocation)
        {
          navigator.geolocation.getCurrentPosition(function(position){
            lat = position.coords.latitude;
            lon = position.coords.longitude;
          });
        }

        var mapOptions = {
          center: [45.6652, -122.521],
          zoom: 10
        }
        var map = new L.map('map', mapOptions);

        var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

        map.addLayer(layer);

        var marker = L.marker([45.6652, -122.5215]);

        marker.addTo(map);
      }
  }

  render() {
    return (
          <div ref={this.myRef} id="map" style={{width: 400+'px', height: 400+'px'}} className="map"></div>
    );
  }
}

export default MapsPage;
