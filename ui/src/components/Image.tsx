import React from "react";

interface Props {
  match: {
    params: {
      imageName: string;
    }
  }
}

const ImagePage = (props: Props) => (
  <div>
    <div>
      <h2>Image Page</h2>
        <img src={`http://localhost:3000/${props.match.params.imageName}`} />
    </div>
  </div>
);

export default ImagePage;

