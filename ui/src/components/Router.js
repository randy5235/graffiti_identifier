import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UploadForm from "./UploadForm";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={UploadForm}></Route>
    </Switch>
  </BrowserRouter>
);
export default Router;
