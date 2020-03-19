import React, {Component} from "react";
//import ReactDOM from 'react-dom';
import logo from "./logo.svg";
import "./App.css";
import UploadForm from "./components/UploadForm";
import OLMap from "./components/OpenLayerMap"

class App extends React.Component{

    render()
    {
      return ([
        <UploadForm></UploadForm>,
        /*<OLMap></OLMap>*/
      ]);
    }
}

export default App;
