import React, { Component } from "react";
import { io } from "socket.io-client";
const Util = require("../utils/utils");
const delay = require("delay");

class Room extends Component {
  socket;
  noob = true; // noob need to send initiator to old users (RTC).
  peers = {};
  videoRefs = {};
  stream = null;
  state = {
    playerName: "",
    roomName: "",
    participants: {},
    clink_participants: [],
    clinked: false,
    clinkInProgress: false,
    attention_target: "",
    attended: false,
    attentionInProgress: false,
    videoOn: false,
    audioOn: false,
    videoAvailable: false,
    audioAvailable: false,
  };

  constructor() {
    super();
    // set reference to local video
    this.localVideoRef = React.createRef();
    // set the availableness of media devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      let types = devices.map((x) => x.kind);
      this.state.videoAvailable = types.includes("videoinput");
      this.state.audioAvailable = types.includes("audioinput");
    });

    // set reference to chatting
    this.chatRef = React.createRef();
    this.chatBoardRef = React.createRef();

    // Set connection
    this.socket = io("https://hangonserver.minhoeom.com");
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
            this.videoRefs,
            this.chatBoardRef,
            this.stream
          );
        } else {
          Util.makeNewPeer(
            this.socket,
            this.state.roomName,
            this.peers,
            participants,
            this.state.playerName,
            this.videoRefs,
            this.chatBoardRef,
            this.stream
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
        if (playerName === this.state.playerName) {
          this.setState({ clinked: true, modalActive: true });
        }
        this.setState({ clinkInProgress: true });
        console.log(`${playerName} has requested to clink`);
        this.setState({ clink_participants: [playerName] });
      }
    });
    this.socket.on("clinkAgreeResponse", (playerName) => {
      this.setState({ clinkInProgress: false });
      console.log(`${playerName} has agreed to clink`);
      if (playerName === this.state.playerName) {
        this.setState({ clinked: true, modalActive: true });
      }
      this.setState({ clink_participants: this.state.clink_participants.concat(playerName) })
    });
    this.socket.on("attentionResponse", (isSuccess, playerName) => {
      if (isSuccess) {
        this.setState({ attentionInProgress: true });
        console.log(`${playerName} has requested to get attention`);
        this.setState({ attention_target: playerName });
      }
    });
    this.socket.on("attentionAgreeResponse", (isSuccess) => {
      if (isSuccess) {
        this.setState({attended: true});
      }
    });
    this.socket.on("seatShuffleResponse", (participants) => {
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
    this.handleSeatSwap = this.handleSeatSwap.bind(this);
    this.handleSeatShuffle = this.handleSeatShuffle.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.handleModalOutClick = this.handleModalOutClick.bind(this);
  }
  
  getModalClass() {
    if (this.state.modalActive) {
      return "modal is-active";
    } else {
      return "modal";
    }
  }

  getModalContent() {
    if (this.state.clinked) {
      return (
        <div>
          <div className="field">
            {this.getClinkVideos()}
          </div>
        </div>
      );
    }
    else if (this.state.attended) {
      return (
        <div>
          <div className="field">
            {this.getAttentionVideo()}
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }

  handleModalOutClick() {
    this.setState({ modalActive: !this.state.modalActive });
    if (this.state.clinked) {
      const idx = this.state.clink_participants.indexOf(this.state.playerName);
      this.state.clink_participants.splice(idx, 1);
    }
    this.setState({ clinked: false });
    this.setState({ attended: false });
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

  handleSeatSwap() {
    alert("currently unavailable");
  }

  handleSeatShuffle() {
    this.socket.emit("seatShuffle", this.state.roomName);
  }

  async handleVideo() {
    if (this.state.videoOn) {
      this.setState({ videoOn: false });
      Util.stopVideo(this.stream);
      this.localVideoRef.current.srcObject = null;
    } else {
      this.setState({ videoOn: true });
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: this.state.audioOn,
      });
      this.localVideoRef.current.srcObject = this.stream;
      Object.values(this.peers).forEach((p) => {
        p.addStream(this.stream);
      });
    }
  }

  async handleAudio() {
    if (this.state.audioOn) {
      this.setState({ audioOn: false });
      Util.stopAudio(this.stream);
    } else {
      this.setState({ audioOn: true });
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.state.videoOn,
        audio: true,
      });
      this.localVideoRef.current.srcObject = this.stream;
      Object.values(this.peers).forEach((p) => {
        p.addStream(this.stream);
      });
    }
  }

  handleChat(e) {
    if (e.key === "Enter" && this.chatRef.current.value !== "") {
      // send to peers
      let newmsg = this.state.playerName + ": " + this.chatRef.current.value;
      Object.values(this.peers).forEach((p) => {
        p.send(newmsg);
      });
      this.chatRef.current.value = "";
      this.chatBoardRef.current.value =
        this.chatBoardRef.current.value + `${newmsg}\n`;
      this.chatBoardRef.current.scrollTop = this.chatBoardRef.current.scrollHeight;
    }
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

  getAttentionClass() {
    if (this.state.attentionInProgress) {
      return "button is-loading";
    } else {
      return "button";
    }
  }

  getAttentionAgreeClass() {
    if (this.state.attentionInProgress && !this.state.attended) {
      return "button";
    } else {
      return "button is-static";
    }
  }

  getVideoButtonClass() {
    // Make button clickable only if the device has video/audio input,
    // and when video is turned off.
    if (this.state.videoAvailable) {
      return "button";
    } else {
      return "button is-static";
    }
  }

  getAudioButtonClass() {
    // Make button clickable only if the device has audio input,
    // and when audio is turned off.
    if (this.state.audioAvailable) {
      return "button";
    } else {
      return "button is-static";
    }
  }

  getVideoInnerHTML() {
    if (this.state.videoOn) {
      return "Video Off";
    } else {
      return "Video On";
    }
  }

  getAudioInnerHTML() {
    if (this.state.audioOn) {
      return "Audio Off";
    } else {
      return "Audio On";
    }
  }

  getVideos() {
    return Object.keys(this.state.participants).map((userName) => {
      if (userName !== this.state.playerName && !this.state.clinked) {
        return (
          <video
            key={userName}
            ref={this.videoRefs[userName]}
            width="300"
            height="150"
            poster="/video-not-working.png"
            autoPlay
            style={{
              "-webkit-transform": "scaleX(-1)",
              transform: "scaleX(-1)",
            }}
          ></video>
        );
      }
      return null;
    });
  }

  getClinkVideos() {
    return Object.keys(this.state.clink_participants).map((userName) => {
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

  getAttentionVideo() {
    return Object.keys(this.state.participants).map((userName) => {
      if (userName === this.state.attention_target) {
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
        <div className={this.getModalClass()}>
          <div
            className="modal-background"
            // onClick={this.handleModalClick}
          ></div>
          <div className="modal-content box">{this.getModalContent()}</div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={this.handleModalOutClick}
          ></button>
        </div>
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
          <button className="button" onClick={this.handleSeatSwap}>
            Seat Swap
          </button>
        </div>
        <div className="has-text-centered mt-2">
          <button className="button" onClick={this.handleSeatShuffle}>
            Seat Shuffle
          </button>
        </div>
        <div className="has-text-centered mt-2">
          <div className="control">
            <textarea
              className="textarea has-fixed-size"
              readOnly
              rows="10"
              ref={this.chatBoardRef}
            ></textarea>
          </div>
          <input
            className="input"
            type="text"
            placeholder="text"
            ref={this.chatRef}
            onKeyPress={(e) => this.handleChat(e)}
          />
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
            {this.getVideoInnerHTML()}
          </button>
          <button
            className={this.getAudioButtonClass()}
            onClick={this.handleAudio}
          >
            {this.getAudioInnerHTML()}
          </button>
        </div>
        <div className="has-text-centered">{this.getVideos()}</div>
      </div>
    );
  }
}

export default Room;
