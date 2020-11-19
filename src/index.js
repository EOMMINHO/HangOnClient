import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bulma/css/bulma.css";
import Intro from "./components/Intro/IntroIndex";
import Room from "./components/Main/room";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/room" component = {Room} />
      <Route exact path="/" component = {Intro}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
