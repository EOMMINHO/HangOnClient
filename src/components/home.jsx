import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <div className="container">
        <h1>Hang On</h1>
        <div>
          <button className="button">Host</button>
        </div>
        <div>
          <button className="button">Join</button>
        </div>
      </div>
    );
  }
}

export default HomePage;
