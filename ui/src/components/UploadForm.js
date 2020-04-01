import React from "react";
import EXIF from "exif-js";
import '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

class UploadForm extends React.Component {

  constructor(props){
    super(props);
    console.log(this.props);
    this.container = React.createRef();
    this.uploadForm = React.createRef();
    this.uploadFile = React.createRef();
    this.uploadLat = React.createRef();
    this.uploadLon = React.createRef();
    this.uploadButton = React.createRef();
    this.uploadConfirm = React.createRef();
    this.uploadSubmit = React.createRef();
    this.state = {buttonState: 'flex', confirmState: 'none', cancelState: 'none'};
  }

  ValidateForm = (e) => {
    // ==================================================================
    // Convert gps coordinates as presented in exif data to an array pair
    // ==================================================================
    function GPSDegToDec(lat, latRef, lon, lonRef){
      var retLat = 0;
      var latComps = lat.toString().split(",");
      retLat = Number(latComps[0]);
      retLat += Number(latComps[1]) / 60;
      retLat += Number(latComps[2]) / 3600;
      if (latRef === "S") {
        retLat = 0 - retLat;
      }

      var retLon = 0;
      var lonComps = lon.toString().split(",");
      retLon = Number(lonComps[0]);
      retLon += Number(lonComps[1]) / 60;
      retLon += Number(lonComps[2]) / 3600;
      if (lonRef === "W") {
        retLon = 0 - retLon;
      }
      var Coords = [retLat, retLon];
      return Coords;
    } 
    //====================================================

    // Stop submit until verified
    e.preventDefault();
    var parent = this.props.parentMap;

    var files = document.getElementById("upload-image").files;
    if (files[0] !== undefined) {
      // file selected
      if (files[0].size > 8 * 1024 * 1024) {
        // 8 MB size limit
        console.log("file too large");
      }
      else {
        EXIF.getData(files[0], function() {
          var lat = EXIF.getTag(this, "GPSLatitude");
          var latRef = EXIF.getTag(this, "GPSLatitudeRef");
          var lon = EXIF.getTag(this, "GPSLongitude");
          var lonRef = EXIF.getTag(this, "GPSLongitudeRef");

          var coordinates = [0,0];

          // if any gps data is bad or nonexistent, slap it in the middle of the current map view
          if (lat === undefined || latRef === undefined || lon === undefined || lonRef === undefined) 
          {
            // if the marker is not inside current view put it in the center of the view
            if (!parent.map.getBounds().contains(parent.userMarker.getLatLng()))
            {
              coordinates = parent.map.getCenter();
            }
            else
            {
              coordinates = parent.userMarker.getLatLng();
            }
          }
          else // set the marker and view to those given by exif
          {
            coordinates = GPSDegToDec(lat, latRef, lon, lonRef);
          }
          
          parent.map.setView(coordinates, 13);
            
          var src = URL.createObjectURL(files[0]);
          parent.userMarker
            .addTo(parent.userLayer)
            .setLatLng(coordinates)
            .bindPopup()
            .setPopupContent("<img style='height:200px; width:200px;' id='marker-image' src='"+src+"' alt='uploaded-image'></img>")
            .openPopup()
            .dragging.enable();
        });
      }
      parent.placingGraffiti = true;
      this.setState((state) => {
        return {buttonState: 'none', confirmState: 'flex', cancelState: 'flex'}
      });
    } else {
      console.log("file not defined");
    }

  }

  triggerUploadFile = () =>{
    this.uploadFile.current.click();
  };
  triggerSubmit = () => {
    var coordinates = this.props.parentMap.userMarker.getLatLng();
    this.uploadLat.current.value = coordinates['lat'];
    this.uploadLon.current.value = coordinates['lng'];
    this.uploadSubmit.current.click();
    this.clearForm();
  };
  clearForm = () =>
  {
    this.props.parentMap.userLayer.clearLayers();
    this.props.parentMap.userMarker.setLatLng([1,1]);
    this.uploadFile.current.value = "";
    this.uploadLat.current.value = "";
    this.uploadLon.current.value = "";
    this.props.parentMap.placingGraffiti = false;
    this.setState((state) => {
      return {buttonState: 'flex', confirmState: 'none', cancelState: 'none'}
    });
  }

  render() {

    return (
      <div
      id="form-container"
      ref={this.container}
      >
      <form
        ref={this.uploadForm}
        className="upload-file"
        action="http://localhost:3000/api/upload"
        method="post"
        encType="multipart/form-data"
        style={{display:'none'}}
      >
        <div>
          <input
            ref= {this.uploadFile}
            id="upload-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={this.ValidateForm}  
          />
          <input
            ref={this.uploadLat}
            id="upload-lat"
            name="lat"
            type="hidden"
          />
          <input
            ref={this.uploadLon}
            id="upload-lon"
            name="lon"
            type="hidden"
          />
          <input
            ref={this.uploadSubmit}
            type="submit">
          </input>
        </div>
      </form>
      <Button
        ref={this.uploadCancel}
        id="upload-cancel"
        variant="contained"
        color="default"
        style={{position: 'absolute', zIndex: '401', bottom: '2em', left: '2em', display: this.state.cancelState}}
        onClick={this.clearForm}
      >
        Cancel
      </Button>
      <Button
        ref={this.uploadButton}
        id="upload-button"
        variant="contained"
        color="primary"
        style={{position: 'absolute', zIndex: '401', bottom: '2em', left: '2em', display: this.state.buttonState}}
        startIcon={<CloudUploadIcon />}
        onClick={this.triggerUploadFile}
      >
        Add Graffiti
      </Button>
      <Button
        ref={this.uploadConfirm}
        id="upload-confirm"
        variant="contained"
        color="secondary"
        style={{position: 'absolute', zIndex: '401', bottom: '2em', left: '12em', display: this.state.confirmState}}
        onClick={this.triggerSubmit}
      >
        Confirm
      </Button>
    </div>
    );
  }
}

export default UploadForm;
