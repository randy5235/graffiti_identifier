import React from "react";

const UploadForm = () => (
  <form
    className="upload-file"
    action="http://localhost:3000/api/upload"
    method="post"
    encType="multipart/form-data"
  >
    <div>
      <h2>Upload Form</h2>
      <input name="image" type="file" accept="image/*" />
      <input type="submit" value="Upload" />
    </div>
  </form>
);

export default UploadForm;
