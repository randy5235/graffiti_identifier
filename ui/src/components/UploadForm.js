import React from "react";
import EXIF from "exif-js";

class UploadForm extends React.Component {
  ValidateForm(event) {
    // Convert gps coordinates as presented in exif data to a comma separated decimal pair.
    function GPSDegToDecString(lat, latRef, lon, lonRef) {
      var retLat = 0;
      var latComps = lat.toString().split(",");
      retLat = parseInt(latComps[0]);
      retLat += parseInt(latComps[1]) / 60;
      retLat += parseInt(latComps[2]) / 3600;
      if (latRef === "S") {
        latRef = 0 - latRef;
      }

      var retLon = 0;
      var lonComps = lon.toString().split(",");
      retLon = parseInt(lonComps[0]);
      retLon += parseInt(lonComps[1]) / 60;
      retLon += parseInt(lonComps[2]) / 3600;
      if (latRef === "W") {
        latRef = 0 - latRef;
      }
      console.log(lat, " ", latRef, " ", lon, " ", lonRef);
      console.log(retLat + " " + retLon);
      return retLat + "," + retLon;
    }

    event.preventDefault();
    var uploadForm = document.getElementsByClassName("upload-file")[0];

    var files = document.getElementById("upload-image").files;
    var locInput = document.getElementById("upload-location");

    if (files[0] !== undefined) {
      // file selected
      if (files[0].size > 8 * 1024 * 1024) {
        // 8 MB size limit
        console.log("file too large");
        return false;
      } else if (locInput.value.length > 0) {
        // location manually entered
        // should check for formatting here
        uploadForm.submit();
        return true;
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
            locInput.type = "text";
            return false;
          } // set the location input (Should confirm the formatting)
          else {
            locInput.value = GPSDegToDecString(lat, latRef, lon, lonRef);
            uploadForm.submit();
            return true;
          }
        });
      }
    } else {
      console.log("file not defined");
      return false;
    }

    return false;
  }

  render() {
    return (
      <form
        className="upload-file"
        action="http://localhost:3000/api/upload"
        method="post"
        encType="multipart/form-data"
        onSubmit={this.ValidateForm}
      >
        <div>
          <input id="upload-image" name="image" type="file" accept="image/*" />
          <input
            id="upload-location"
            name="location"
            type="hidden"
            placeholder="no exif, gps coordinates please"
          />
          <input type="submit" value="Upload" />
        </div>
      </form>
    );
  }
}

export default UploadForm;
