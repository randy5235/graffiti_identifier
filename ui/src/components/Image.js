import React from "react";

const ImagePage = (props) => (
  <div>
    <div>
      <h2>Image Page</h2>
        <img src={`http://localhost:3000/${props.match.params.imageName}`} />
    </div>
  </div>
);

export default ImagePage;

