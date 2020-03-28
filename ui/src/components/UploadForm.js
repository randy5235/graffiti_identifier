import React from "react";
import EXIF from "exif-js";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

class UploadForm extends React.Component {

  constructor(props){
    super(props);
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
    // ====================================================================================
    // Convert gps coordinates as presented in exif data to a comma separated decimal pair.
    // ====================================================================================
    function GPSDegToDec(lat, latRef, lon, lonRef){
      var retLat = 0;
      var latComps = lat.toString().split(",");
      retLat = Number(latComps[0]);
      retLat += Number(latComps[1]) / 60;
      retLat += Number(latComps[2]) / 3600;
      if (latRef === "S") {
        latRef = 0 - latRef;
      }

      var retLon = 0;
      var lonComps = lon.toString().split(",");
      retLon = Number(lonComps[0]);
      retLon += Number(lonComps[1]) / 60;
      retLon += Number(lonComps[2]) / 3600;
      if (latRef === "W") {
        latRef = 0 - latRef;
      }
      var Coords = [retLat, retLon];
      return Coords;
    } 
    //====================================================

    // Stop submit until verified
    e.preventDefault();
    var uploadForm = this;

    var files = document.getElementById("upload-image").files;
    var latInput = document.getElementById("upload-lat");
    var lonInput = document.getElementById("upload-lon");
    if (files[0] !== undefined) {
      // file selected
      console.log(files);
      if (files[0].size > 8 * 1024 * 1024) {
        // 8 MB size limit
        console.log("file too large");
      } else if (latInput.value.length > 0) {
        // location manually entered
        // should check for formatting here
        this.uploadForm.submit();
      } else {
        EXIF.getData(files[0], function() {
          var lat = EXIF.getTag(this, "GPSLatitude");
          var latRef = EXIF.getTag(this, "GPSLatitudeRef");
          var lon = EXIF.getTag(this, "GPSLongitude");
          var lonRef = EXIF.getTag(this, "GPSLongitudeRef");

          // if any gps data is bad or nonexistent, request it manually
          if (
            lat === undefined ||
            latRef === undefined ||
            lon === undefined ||
            lonRef === undefined
          ) {
          } // set the location input (Should confirm the formatting)
          else {
            var coordinates = GPSDegToDec(lat, latRef, lon, lonRef);
            latInput.value = coordinates[0];
            lonInput.value = coordinates[1];
            uploadForm.props.AdjustMap(latInput.value, lonInput.value, 8);
          }
        });
      }
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
    this.uploadSubmit.current.click();
    this.clearForm();
  };
  clearForm = () =>
  {
    this.uploadFile.current.value = "";
    this.uploadLat.current.value = "";
    this.uploadLon.current.value = "";
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
