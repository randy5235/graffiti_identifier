import React from "react";
//import ReactDOM from 'react-dom';
// import logo from "./logo.svg";
import "./App.css";
import UploadForm from "./components/UploadForm";
import MapsPage from "./components/Maps";

class App extends React.Component {
  render() {
    return [
      <h2
        style={{
          position: 'absolute', 
          top:0, left: 0, 
          zIndex: 401, 
          backgroundColor: '#000000', 
          color:'white', 
          padding:'8px'}}
      >
        graffiti_identifier
      </h2>,
    <MapsPage>
    </MapsPage>];
  }
}

export default App;
