import React, { Component } from "react";
import { io } from "socket.io-client";

class Room extends Component {
  socket;
  state = {
    playerName: "",
    roomName: "",
    participants: null,
    clinked: false,
    clinkInProgress: false,
    attentionInProgress: false,
  };

  constructor() {
    super();
    // Set connection
    this.socket = io("http://localhost:5000");
    // IO handler
    this.socket.on("hostResponse", (roomName, participants) => {
      this.setState({ roomName: roomName });
      this.setState({ participants: participants });
    });
    this.socket.on("joinResponse", (isSuccess, participants) => {
      if (isSuccess) {
        this.setState({ participants: participants });
      } else {
        alert("There is no such room");
        window.location.href = "/";
      }
    });
    this.socket.on("disconnectResponse", (participants) => {
      this.setState({ participants: participants });
    });
    this.socket.on("clinkResponse", (isSuccess, playerName) => {
      if (isSuccess) {
        this.setState({ clinkInProgress: true });
        console.log(`${playerName} has requested to clink`);
      }
    });
    this.socket.on("clinkAgreeResponse", (playerName) => {
      this.setState({ clinkInProgress: false, clinked: false });
      console.log(`${playerName} has agreed to clink`);
    });
    this.socket.on("attentionResponse", (isSuccess, participants) => {
      if (isSuccess) {
        this.setState({ participants: participants });
      }
    });
    this.socket.on("attentionAgreeResponse", (participants) => {
      this.setState({ participants: participants });
    });
    // Initialize room
    let entryType = sessionStorage.getItem("entryType");
    let playerName = sessionStorage.getItem("playerName");
    this.state.playerName = playerName;
    if (entryType === "host") {
      this.socket.emit("host", playerName);
    } else {
      let roomName = sessionStorage.getItem("roomName");
      this.state.roomName = roomName;
      this.socket.emit("join", playerName, roomName);
    }
    // binding
    this.handleClink = this.handleClink.bind(this);
    this.handleClinkAgree = this.handleClinkAgree.bind(this);
    this.handleAttention = this.handleAttention.bind(this);
    this.handleAttentionAgree = this.handleAttentionAgree.bind(this);
  }

  handleClink() {
    this.setState({ clinked: true });
    this.socket.emit("clink", this.state.playerName, this.state.roomName);
  }

  handleClinkAgree() {
    this.socket.emit("clinkAgree", this.state.playerName, this.state.roomName);
  }

  handleAttention() {
    this.setState({ attentionInProgress: true });
    this.socket.emit("attention", this.state.playerName, this.state.roomName);
  }

  handleAttentionAgree() {
    this.socket.emit(
      "attentionAgree",
      this.state.playerName,
      this.state.roomName
    );
  }

  getClinkClass() {
    if (this.state.clinkInProgress) {
      return "button is-loading";
    } else {
      return "button";
    }
  }

  getClinkAgreeClass() {
    if (this.state.clinkInProgress && !this.state.clinked) {
      return "button";
    } else {
      return "button is-static";
    }
  }

  render() {
    return (
      <div className="container my-6">
        <h1 className="has-text-centered">Room Name : {this.state.roomName}</h1>
        <h1 className="has-text-centered">
          Player Name : {this.state.playerName}
        </h1>
        <h1 className="has-text-centered">
          Participants: {JSON.stringify(this.state.participants)}
        </h1>
        <div className="has-text-centered mt-6">
          <button className={this.getClinkClass()} onClick={this.handleClink}>
            Clink
          </button>
          <button
            className={this.getClinkAgreeClass()}
            onClick={this.handleClinkAgree}
          >
            Clink Agree
          </button>
        </div>
        <div className="has-text-centered mt-2">
          <button className="button" onClick={this.handleAttention}>
            Attention
          </button>
        </div>
        <div className="has-text-centered mt-2">
          <button className="button" onClick={this.handleAttentionAgree}>
            Attention Agree
          </button>
        </div>
      </div>
    );
  }
}

export default Room;
