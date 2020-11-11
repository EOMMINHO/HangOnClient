import React, { Component } from "react";
import { io } from "socket.io-client";

class Room extends Component {
  socket;
  state = {
    playerName: "",
    roomName: "",
    participants: null,
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
  }

  render() {
    return (
      <div className="container">
        <h1>Room Name : {this.state.roomName}</h1>
        <h1>Player Name : {this.state.playerName}</h1>
        <h1>Participants: {JSON.stringify(this.state.participants)}</h1>
      </div>
    );
  }
}

export default Room;
