import React, { Component } from "react";
import { io } from "socket.io-client";
const Util = require("../utils/utils");
const delay = require("delay");

class Room extends Component {
  socket;
  noob = true; // noob need to send initiator to old users (RTC).
  peers = {};
  videoRefs = {};
  state = {
    playerName: "",
    roomName: "",
    participants: {},
    clinked: false,
    clinkInProgress: false,
    attentionInProgress: false,
    videoOn: false,
    videoAvailable: false,
  };

  constructor() {
    super();
    // set reference to local video
    this.localVideoRef = React.createRef();
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      let types = devices.map((x) => x.kind);
      if (types.includes("videoinput") && types.includes("audioinput")) {
        this.state.videoAvailable = true;
      }
    });

    // Set connection
    this.socket = io("http://192.168.0.15:5000");
    // IO handler
    this.socket.on("hostResponse", (roomName, participants) => {
      this.setState({ roomName: roomName });
      this.setState({ participants: participants });
      this.noob = false;
    });
    this.socket.on("joinResponse", (isSuccess, participants) => {
      if (isSuccess) {
        // send initiator
        if (this.noob) {
          Util.makeNewPeers(
            this.socket,
            this.state.roomName,
            this.peers,
            participants,
            this.state.playerName,
            this.videoRefs
          );
        } else {
          Util.makeNewPeer(
            this.socket,
            this.state.roomName,
            this.peers,
            participants,
            this.state.playerName,
            this.videoRefs
          );
        }
        this.noob = false;
        this.setState({ participants: participants });
      } else {
        alert("There is no such room");
        window.location.href = "/";
      }
    });
    this.socket.on("disconnectResponse", (participants, userName) => {
      this.setState({ participants: participants });
      Util.disconnectPeer(this.peers, userName);
      console.log(this.peers);
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
    // P2P for video conference
    this.socket.on("RTC_answer", async (offerer, receiver, data) => {
      // if receiver is me, signal it to offerer.
      if (receiver === this.state.playerName) {
        while (!Object.keys(this.peers).includes(offerer)) {
          await delay(100);
        }
        this.peers[offerer].signal(data);
      }
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
    this.handleVideo = this.handleVideo.bind(this);
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

  async handleVideo() {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.localVideoRef.current.srcObject = stream;
    Object.values(this.peers).forEach((p) => {
      p.addStream(stream);
    });
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

  getVideoButtonClass() {
    if (this.state.videoAvailable) {
      return "button";
    } else {
      return "button is-static";
    }
  }

  getVideos() {
    return Object.keys(this.state.participants).map((userName) => {
      if (userName !== this.state.playerName) {
        return (
          <video
            key={userName}
            ref={this.videoRefs[userName]}
            width="300"
            height="150"
            poster="/video-not-working.png"
            autoPlay
          ></video>
        );
      }
      return null;
    });
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
        <div className="has-text-centered mt-2">
          <video
            ref={this.localVideoRef}
            width="300"
            height="150"
            poster="/video-not-working.png"
            autoPlay
            muted
          ></video>
          <button
            className={this.getVideoButtonClass()}
            onClick={this.handleVideo}
          >
            Video On
          </button>
        </div>
        <div className="has-text-centered">{this.getVideos()}</div>
      </div>
    );
  }
}

export default Room;
