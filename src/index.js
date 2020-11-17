import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bulma/css/bulma.css";
import Room from "./components/room";
import Intro from "./components/Intro/IntroIndex";
import HomePage from "./components/home";
import Navbar from "./components/NavBar/NavbarIndex";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/room" component = {Room} />
      <Route path="/choose" component = {HomePage}/>
      <Route path="/" component = {Intro}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
