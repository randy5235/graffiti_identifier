import React from "react";
//import ReactDOM from 'react-dom';
// import logo from "./logo.svg";
import "./App.css";
import UploadForm from "./components/UploadForm";
import MapsPage from "./components/Maps";

class App extends React.Component {
  render() {
    return [<UploadForm></UploadForm>, <MapsPage></MapsPage>];
  }
}

export default App;
