import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "../App";
import ImagePage from './Image';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App}></Route>
      <Route path="/images/:imageName" component={ImagePage}></Route>
    </Switch>
  </BrowserRouter>
);
export default Router;
