import React, { Component } from "react";
import ReactPlayer from "react-player/youtube";
import { io } from "socket.io-client";
import ButtonDropdown from "./ButtonDropdown";
import Chat from "./Chat";
import { MainContainer, Table, MenuBar } from "./MainElement";
import VideoDropdown from "./VideoDropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Util = require("../../utils/utils");
const delay = require("delay");

class Room extends Component {
  socket;
  noob = true; // noob need to send initiator to old users (RTC).
  peers = {};
  videoRefs = {};
  clinkRefs = {};
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
    swapInProgress: false,
    videoOn: false,
    audioOn: false,
    videoAvailable: false,
    audioAvailable: false,
    chatOpen: true,
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
            this.clinkRefs,
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
            this.clinkRefs,
            this.chatBoardRef,
            this.stream
          );
          toast.info("🚀 New Member Joined!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
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
        this.setState({
          clink_participants: [...this.state.clink_participants, playerName],
        });
      }
    });
    this.socket.on("clinkAgreeResponse", (playerName) => {
      this.setState({ clinkInProgress: false });
      console.log(`${playerName} has agreed to clink`);
      if (playerName === this.state.playerName) {
        this.setState({ clinked: true, modalActive: true });
      }
      this.setState({
        clink_participants: [...this.state.clink_participants, playerName],
      });
    });
    this.socket.on("attentionResponse", (isSuccess, playerName) => {
      if (isSuccess) {
        console.log(playerName);
        this.setState({ attention_target: playerName });
        this.setState({ attentionInProgress: true });
        console.log(`${playerName} has requested to get attention`);
      }
    });
    this.socket.on("attentionAgreeResponse", (participants) => {
      this.setState({ participants: participants });
    });
    this.socket.on("attentionOn", (participants) => {
      this.setState({
        participants: participants,
        attentionInProgress: false,
        attended: true,
      });
    });
    this.socket.on("seatSwapResponse", (participants) => {
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
    this.handleModalOutClick = this.handleModalOutClick.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleYoutubeVideo = this.handleYoutubeVideo.bind(this);
    this.handleChatClose = this.handleChatClose.bind(this);
  }

  getModalClass() {
    if (this.state.modalActive) {
      return "modal is-active";
    } else {
      return "modal";
    }
  }

  async handleCopy() {
    await navigator.clipboard.writeText(this.state.roomName);
    this.setState({ isCopied: true });
  }

  getModalContent() {
    if (this.state.clinked) {
      return (
        <div>
          <div className="field">{this.getClinkVideos()}</div>
        </div>
      );
    } else if (this.state.swapInProgress) {
      return (
        <div>
          <div className="field">{this.getParticipantsList()}</div>
        </div>
      );
    } else {
      return null;
    }
  }

  getParticipantsList() {
    return Object.keys(this.state.participants).map((userName) => {
      if (userName !== this.state.playerName) {
        return (
          <button
            className="button"
            textvariable={userName}
            onClick={this.handleSwapClick(userName)}
          >
            {userName}
          </button>
        );
      }
      return null;
    });
  }

  handleSwapClick(swap_target) {
    this.socket.emit(
      "seatSwap",
      this.state.playerName,
      swap_target,
      this.state.roomName
    );
  }

  handleModalOutClick() {
    this.setState({ modalActive: false });
    if (this.state.clinked) {
      this.setState({
        clink_participants: this.state.clink_participants.filter((user) => {
          return user !== this.state.playerName;
        }),
      });
    }
    this.setState({ clinked: false, swapInProgress: false });
  }

  handleClink() {
    this.setState({ clinked: true });
    this.socket.emit("clink", this.state.playerName, this.state.roomName);
  }

  handleClinkAgree() {
    this.socket.emit("clinkAgree", this.state.playerName, this.state.roomName);
  }

  handleAttention() {
    if (this.state.attended) {
      this.setState({ attention_target: "", attended: false });
    } else {
      this.setState({ attentionInProgress: true });
      this.socket.emit("attention", this.state.playerName, this.state.roomName);
    }
  }

  handleAttentionAgree() {
    this.socket.emit(
      "attentionAgree",
      this.state.playerName,
      this.state.roomName
    );
  }

  handleSeatSwap() {
    this.setState({ modalActive: true, swapInProgress: true });
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

  handleChatClose() {
    this.setState({ chatOpen: !this.state.chatOpen });
  }

  handleYoutubeVideo() {}

  getClinkClass() {
    if (
      this.state.clinkInProgress &&
      this.state.clink_participants.length !== 0
    ) {
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

  getAttentionClass() {
    if (this.state.attentionInProgress) {
      return "button is-loading is-large is-white";
    } else {
      return "button is-large is-white";
    }
  }

  getAttentionAgreeClass() {
    if (this.state.attentionInProgress && !this.state.attended) {
      return "button is-large is-white";
    } else {
      return "button is-static is-large is-white";
    }
  }

  getVideoButtonClass() {
    // Make button clickable only if the device has video/audio input,
    // and when video is turned off.
    if (this.state.videoAvailable) {
      return "button is-large is-white";
    } else {
      return "button is-static is-large is-white";
    }
  }

  getAudioButtonClass() {
    // Make button clickable only if the device has audio input,
    // and when audio is turned off.
    if (this.state.audioAvailable) {
      return "button is-large is-white";
    } else {
      return "button is-static is-large is-white";
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
      if (this.state.clinked) {
        if (this.state.participants[userName].clinked) {
          return (
            <VideoDropdown
              key={userName}
              myRef={this.videoRefs[userName]}
              description={userName}
            />
          );
        } else return null;
      } else if (userName !== this.state.playerName) {
        if (this.state.attention_target === userName) {
          return (
            // TODO: attention target video featured
            <VideoDropdown
              key={userName}
              myRef={this.videoRefs[userName]}
              description={userName}
            />
          );
        } else {
          return (
            <VideoDropdown
              key={userName}
              myRef={this.videoRefs[userName]}
              description={userName}
            />
          );
        }
      } else
        return (
          <div>
            <VideoDropdown
              ref={this.localVideoRef}
              description={this.state.playerName}
            />
          </div>
        );
    });
  }

  getClinkVideos() {
    return Object.keys(this.state.clink_participants).map((userName) => {
      if (userName !== this.state.playerName) {
        return (
          <div className="dropdown is-hoverable">
            <div className="dropdown-trigger">
              <video
                ref={this.clinkRefs[userName]}
                width="300"
                height="150"
                poster="/video-not-working.png"
                autoPlay
                muted
                style={{
                  WebkitTransform: "scaleX(-1)",
                  transform: "scaleX(-1)",
                }}
              ></video>
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-content">
                <div className="dropdown-item has-text-link has-text-weight-medium">
                  {userName}
                </div>
              </div>
            </div>
          </div>
        );
      }
      return null;
    });
  }

  getCopyClass() {
    if (this.state.isCopied) {
      return "fas fa-clipboard";
    } else {
      return "far fa-clipboard";
    }
  }

  render() {
    return (
      <MainContainer>
        <Table />
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div>
          <h1 className="has-text-centered" style={{ color: "white" }}>
            Room Name : {this.state.roomName}
            <span
              className="icon is-small mx-2 has-text-info"
              onClick={this.handleCopy}
            >
              <i className={this.getCopyClass()}></i>
            </span>
          </h1>
          <h1 className="has-text-centered" style={{ color: "white" }}>
            Player Name : {this.state.playerName}
          </h1>
          <h1 className="has-text-centered" style={{ color: "white" }}>
            Participants: {JSON.stringify(this.state.participants)}
          </h1>
        </div>

        <div className="has-text-centered mt-2">
          <div className="columns">
            <div className="column is-2 mx-4">
              <Chat
                chatBoardRef={this.chatBoardRef}
                chatRef={this.chatRef}
                handleChat={this.handleChat}
                handleClose={this.handleChatClose}
                open={this.state.chatOpen}
              />
              <div className="my-6">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=UkSr9Lw5Gm8"
                  controls={true}
                  width="320px"
                  height="180px"
                />
              </div>
            </div>
            <div className="column is-9">{this.getVideos()}</div>
            <div className="column is-2"></div>
          </div>
        </div>

        <MenuBar>
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
            handler={this.handleChatClose}
            fontawesome="fas fa-comments"
            description="Chat"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={this.handleYoutubeVideo}
            fontawesome="fab fa-youtube"
            description="Share Video"
          />
        </MenuBar>
      </MainContainer>
    );
  }
}

export default Room;
