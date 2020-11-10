import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <div className="container">
        <div>
          <h1 className="is-size-1 has-text-black mt-6">Hang On</h1>
        </div>
        <div>
          <button className="button is-size-5 mt-6 px-6">Host</button>
        </div>
        <div>
          <button className="button is-size-5 mt-4 px-6">Join</button>
        </div>
      </div>
    );
  }
}

export default HomePage;
