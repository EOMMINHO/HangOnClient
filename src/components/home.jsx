import React, { Component } from "react";
import { io } from "socket.io-client";

class HomePage extends Component {
  socket;
  constructor() {
    super();
    // Set connection
    this.socket = io("http://localhost:5000");
    // IO handler
    this.socket.on("hostReady", (data) => {
      console.log(data);
    });
    this.socket.on("newJoin", (playerName) => {
      console.log(playerName);
    });
    // Binds
    this.handleHostClick = this.handleHostClick.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
  }

  handleHostClick() {
    this.socket.emit("host", "playerName");
  }

  handleJoinClick() {
    this.socket.emit("join", "PlayerName", "room1");
  }

  render() {
    return (
      <div className="container">
        <div>
          <h1 className="is-size-1 has-text-black mt-6">Hang On</h1>
        </div>
        <div>
          <button
            className="button is-size-5 mt-6 px-6"
            onClick={this.handleHostClick}
          >
            Host
          </button>
        </div>
        <div>
          <button
            className="button is-size-5 mt-4 px-6"
            onClick={this.handleJoinClick}
          >
            Join
          </button>
        </div>
      </div>
    );
  }
}

export default HomePage;
