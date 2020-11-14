import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bulma/css/bulma.css";
import HomePage from "./components/home";
import Room from "./components/room";
import Intro from "./components/Intro/IntroIndex";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/room">
        <Room />
      </Route>
      <Route path="/">
        <Intro />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
