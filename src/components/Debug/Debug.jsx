import React, { Component } from "react";

class Debug extends Component {
  render() {
    return (
      <div>
        <h1 className="has-text-centered has-text-white is-size-6">
          playerName : {this.props.playerName}
        </h1>
        <h1 className="has-text-centered has-text-white is-size-6">
          participants: {JSON.stringify(this.props.participants)}
        </h1>
      </div>
    );
  }
}

export default Debug;
