import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UploadForm from "./UploadForm";
import ImagePage from './Image';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={UploadForm}></Route>
      <Route path="/images/:imageName" component={ImagePage}></Route>
    </Switch>
  </BrowserRouter>
);
export default Router;
