import React, { Component } from "react";
import { io } from "socket.io-client";
import ButtonDropdown from "./ButtonDropdown";
import { MainContainer } from "./MainElement";
import Navbar from "../NavBar/NavbarIndex";
import VideoDropdown from "./VideoDropdown";
const Util = require("../../utils/utils");
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
    clinked: false,
    clinkInProgress: false,
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
    this.socket.on("hostResponse", (isSuccess, roomName, participants) => {
      if (!isSuccess) {
        alert(roomName);
        return (window.location.href = "/");
      }
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
    this.socket.on("videoOffResponse", (userName) => {
      let videoRef = this.videoRefs[userName];
      if ("srcObject" in videoRef.current) {
        videoRef.current.srcObject = null;
      } else {
        videoRef.current.src = null;
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
      this.socket.emit("videoOff", this.state.playerName, this.state.roomName);
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
      return "button is-loading is-large is-white";
    } else {
      return "button is-large is-white";
    }
  }

  getClinkAgreeClass() {
    if (this.state.clinkInProgress && !this.state.clinked) {
      return "button is-large is-white";
    } else {
      return "button is-static is-large is-white";
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
      if (userName !== this.state.playerName) {
        return (
          <video
            key={userName}
            ref={this.videoRefs[userName]}
            width="300"
            height="150"
            poster="/video-not-working.png"
            autoPlay
            style={{
              WebkitTransform: "scaleX(-1)",
              transform: "scaleX(-1)",
            }}
          ></video>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <MainContainer>
        <Navbar/>
        <h1 className="has-text-centered" style={{ color: 'white' }}>
          Room Name : {this.state.roomName}
        </h1>
        <h1 className="has-text-centered" style={{ color: 'white' }}>
          Player Name : {this.state.playerName}
        </h1>
        <h1 className="has-text-centered" style={{ color: 'white' }}>
          Participants: {JSON.stringify(this.state.participants)}
        </h1>
        <div className="box has-text-centered mt-3">
          <ButtonDropdown
            buttonClass={this.getClinkClass()}
            handler={this.handleClink}
            fontawesome="fas fa-glass-cheers"
            description="Clink"
          />
          <ButtonDropdown
            buttonClass={this.getClinkAgreeClass()}
            handler={this.handleClinkAgree}
            fontawesome="fas fa-check-circle"
            description="Clink Agree"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleAttention}
            fontawesome="fas fa-bullhorn"
            description="Attention"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleAttentionAgree}
            fontawesome="fas fa-check-circle"
            description="Attention Agree"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleSeatSwap}
            fontawesome="fas fa-exchange-alt"
            description="Seat Swap"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleSeatShuffle}
            fontawesome="fas fa-random"
            description="Seat Shuffle"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleSeatShuffle}
            fontawesome="fas fa-comments"
            description="Chat"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleSeatShuffle}
            fontawesome="fab fa-youtube"
            description="Share Video"
          />
          <ButtonDropdown
            buttonClass={this.getVideoButtonClass()}
            handler={this.handleVideo}
            fontawesome="fas fa-video-slash"
            description={this.getVideoInnerHTML()}
          />
          <ButtonDropdown
            buttonClass={this.getAudioButtonClass()}
            handler={this.handleAudio}
            fontawesome="fas fa-microphone-slash"
            description={this.getAudioInnerHTML()}
          />

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
          <VideoDropdown
            ref={this.localVideoRef}
            description={this.state.playerName}
          />
        </div>
        <div className="has-text-centered">{this.getVideos()}</div>
      </MainContainer>
    );
  }
}

export default Room;