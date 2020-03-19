import React from "react";
import "../styles/maps.css";

class MapsPage extends React.Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.2.1/build/ol.js";
    script.async = true;

    document.body.appendChild(script);
    const test = document.createElement("script");

    const func = `new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    })`;
    test.innerHTML = func;
    document.body.appendChild(test);
  }

  render() {
    return (
      <div>
        <div>
          <h2>My Map</h2>

          <div id="map" className="map"></div>
        </div>
      </div>
    );
  }
}

export default MapsPage;
