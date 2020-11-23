import React, { Component } from "react";
import { io } from "socket.io-client";
import ButtonDropdown from "./ButtonDropdown";
import Chat from "./Chat";
import CopyText from "./CopyText";
import Debug from "../Debug/Debug";
import VideoDropdown from "./VideoDropdown";
import YoutubePlayer from "./YoutubePlayer";
import { MainContainer, MenuBar, Item, Youtube } from "./MainElement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carousel from "react-elastic-carousel";
import ScrollLock from "react-scrolllock";
import Spotlight from "react-spotlight";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {Move1, Move2, Move3} from "./Clink"
import Draggable from "react-draggable";

const Util = require("../../utils/utils");
const { getNamebyNumber } = require("../../utils/utils");
const delay = require("delay");
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 1320, itemsToShow: 2 },
];

class Room extends Component {
  socket;
  noob = true; // noob need to send initiator to old users (RTC).
  peers = {};
  videoRefs = {};
  stream = null;
  peerStreams = {};
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
    chatOpen: false,
    youtubeOpen: false,
    full_screen: false,
    YoutubeInProgress: false,
    youtubeLink: "https://www.youtube.com/watch?v=UkSr9Lw5Gm8",
    youtubeLinkInput: null,
    items: [],
    lockScroll: false,
    spotplay: false,
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
            this.stream,
            this.toastIfVisible,
            this.peerStreams
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
            this.stream,
            this.toastIfVisible,
            this.peerStreams
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
        if (this.state.clinkInProgress) this.setState({ clinkInProgress: false });
        this.setState({ clinkInProgress: true });
        console.log(`${playerName} has requested to clink`);
        toast.info(`🚀 ${playerName} has requested to clink!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
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
        this.setState({
          attention_target: playerName,
          attentionInProgress: true,
        });
        console.log(`${playerName} has requested to get attention`);
        toast.info(`🚀 ${playerName} has requested to get attention!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
    this.socket.on("youtube link", (youtubelink) => {
      this.setState({ youtubeLink: youtubelink });
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
    this.handleAttention = this.handleAttention.bind(this);
    this.handleSeatSwap = this.handleSeatSwap.bind(this);
    this.handleSwapClick = this.handleSwapClick.bind(this);
    this.handleSeatShuffle = this.handleSeatShuffle.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.handleModalOutClick = this.handleModalOutClick.bind(this);
    this.toastIfVisible = this.toastIfVisible.bind(this);
    this.handleFullScreen = this.handleFullScreen.bind(this);
    this.handleChatClose = this.handleChatClose.bind(this);
  }

  getModalClass() {
    if (this.state.modalActive) {
      return "modal is-active";
    } else {
      return "modal";
    }
  }

  handleChatClose() {
    this.setState({ chatOpen: !this.state.chatOpen });
  }

  getModalContent() {
    if (this.state.swapInProgress) {
      return (
        <div>
          <div className="field">
            {Object.keys(this.state.participants).map((userName) => {
              if (userName !== this.state.playerName) {
                return (
                  <button
                    className="button"
                    textvariable={userName}
                    onClick={() => this.handleSwapClick(userName)}
                  >
                    {userName}
                  </button>
                );
              }
              else return null;
            })}
          </div>
        </div>
      );
    } else return null;
  }

  handleSwapClick(swap_target) {
    this.socket.emit(
      "seatSwap",
      this.state.playerName,
      swap_target,
      this.state.roomName
    );
    this.setState({ modalActive: false, swapInProgress: false });
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
    this.socket.emit("clink", this.state.playerName, this.state.roomName);
  }

  handleAttention() {
    this.setState({ spotplay : true });
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
        video: {
          width: { min: 1280, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
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

  handleFullScreen() {
    this.setState({ full_screen: true });
    this.fullscreen();
  }

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

  getAttentionClass() {
    if (this.state.attentionInProgress) {
      return "button is-loading is-large is-white";
    } else if (this.state.playerName === this.state.attention_target) {
      return "button is-large is-black";
    } else {
      return "button is-large is-white";
    }
  }

  toastIfVisible(newText) {
    if (!this.state.chatOpen) {
      toast.success(newText, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  fullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  /*set_attention(){
    Object.keys(this.state.participants).map((userName) => {
      if (this.state.participants[userName].attention) {
        return (this.state.participants[userName].seatNumber);
      }
  })
  }

  handle_attention(num){
    
    }
  }
  */

  handleatenntionclose(){
    this.setState({spotplay : false})
  }

  start() {
  this.setStatePromise({ spotplay: true })
    .then(() => this.sleep(60000))
    .then(() => this.setStatePromise({ spotplay: false }));
  }

/* The following are some convenience methods to make chaining the animation more convenient */

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setStatePromise(state) {
    this.setState(state);
    return Promise.resolve();
  }

  get_video(i) {
    if (Object.keys(this.state.participants).length >= i) {
      if (
        getNamebyNumber(this.state.participants, i) === this.state.playerName
      ) {
        return (
          <VideoDropdown
            key={this.state.playerName}
            myRef={this.localVideoRef}
            description={this.state.playerName}
            isUp={i % 2}
            stream={this.stream}
          />
        );
      } else {
        return (
          <VideoDropdown
            key={getNamebyNumber(this.state.participants, i)}
            myRef={this.videoRefs[getNamebyNumber(this.state.participants, i)]}
            description={getNamebyNumber(this.state.participants, i)}
            isUp={i % 2}
            stream={
              this.peerStreams[getNamebyNumber(this.state.participants, i)]
            }
          />
        );
      }
    }
  }

  settable() {
    if (Object.keys(this.state.participants).length < 5) {
      if (this.state.clinkInProgress) return (
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Item>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <Move1 width="50%" position="absolute" marginLeft="16%" marginTop="6%" contents={this.get_video(1)}></Move1>
                  <Move1 width="50%" position="absolute" marginLeft="0%" marginTop="6%" contents={this.get_video(3)}></Move1>
                </tr>
                <tr>
                  <Move2 width="50%" position="absolute" marginLeft="16%" bottom="8.8%" contents={this.get_video(2)}></Move2>
                  <Move2 width="50%" position="absolute" marginLeft="0%" bottom="8.8%" contents={this.get_video(4)}></Move2>
                </tr>
              </tbody>
            </table>
          </Item>
        </div>
      );
      else return (
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Item>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "16%",
                      marginTop: "6%",
                    }}
                  >
                    {this.get_video(1)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "50%",
                      marginTop: "6%",
                    }}
                    className = "Hello"
                  >
                    {this.get_video(3)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "16%",
                      bottom: "8.8%",
                    }}
                  >
                    {this.get_video(2)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      bottom: "8.8%",
                      marginLeft: "50%",
                    }}
                  >
                    {this.get_video(4)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Item>
        </div>
      );
    } else {
      if (this.state.clinkInProgress) return (
        <Carousel breakPoints={breakPoints}>
          <Item>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <Move3 width="50%" position="absolute" marginLeft="1.5%" marginTop="3.8%" contents={this.get_video(1)}></Move3>
                  <Move3 width="50%" position="absolute" marginLeft="0.8%" marginTop="3.8%" contents={this.get_video(3)}></Move3>
                </tr>
                <tr>
                  <Move4 width="50%" position="absolute" marginLeft="1.5%" marginTop="9.5%" contents={this.get_video(2)}></Move4>
                  <Move4 width="50%" position="absolute" marginLeft="0.8%" marginTop="9.5%" contents={this.get_video(4)}></Move4>
                </tr>
              </tbody>
            </table>
          </Item>
          <Item>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <Move3 width="50%" position="absolute" marginLeft="1.5%" marginTop="3.8%" contents={this.get_video(5)}></Move3>
                  <Move3 width="50%" position="absolute" marginLeft="0.8%" marginTop="3.8%" contents={this.get_video(7)}></Move3>
                </tr>
                <tr>
                  <Move4 width="50%" position="absolute" marginLeft="1.5%" marginTop="9.5%" contents={this.get_video(6)}></Move4>
                  <Move4 width="50%" position="absolute" marginLeft="0.8%" marginTop="9.5%" contents={this.get_video(8)}></Move4>
                </tr>
              </tbody>
            </table>
          </Item>
        </Carousel>
      );
      else return (
        <Carousel breakPoints={breakPoints}>
          <Item>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "1.5%",
                      marginTop: "3.8%",
                    }}
                  >
                    {this.get_video(1)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "25%",
                      marginTop: "3.8%",
                    }}
                  >
                    {this.get_video(3)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "1.5%",
                      marginTop: "9.5%",
                    }}
                  >
                    {this.get_video(2)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "25%",
                      marginTop: "9.5%",
                    }}
                  >
                    {this.get_video(4)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Item>
          <Item>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "1.5%",
                      marginTop: "3.8%",
                    }}
                  >
                    {this.get_video(5)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "25%",
                      marginTop: "3.8%",
                    }}
                  >
                    {this.get_video(7)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "1.5%",
                      marginTop: "9.5%",
                    }}
                  >
                    {this.get_video(6)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "25%",
                      marginTop: "9.5%",
                    }}
                  >
                    {this.get_video(8)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Item>
        </Carousel>
      );
    }
  }

  render() {
    return (
      <ScrollLock>
        <MainContainer>
          <div className={this.getModalClass()}>
            <div
              className="modal-background"
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
            <div>
              <CopyText roomName={this.state.roomName} />
              <Debug
                playerName={this.state.playerName}
                participants={this.state.participants}
              />
              <Draggable>
                <Youtube>
                  <YoutubePlayer visible={this.state.youtubeOpen} />
                </Youtube>
              </Draggable>
              <div>{this.settable()}</div>
              <div className="has-text-centered mt-2" position="absolute">
                <div className="columns">
                  <div className="column is-3 mx-4">
                    <Chat
                      chatBoardRef={this.chatBoardRef}
                      chatRef={this.chatRef}
                      handleChat={this.handleChat}
                      handleClose={this.handleChatClose}
                      open={this.state.chatOpen}
                      playerName={this.state.playerName}
                      peers={this.peers}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {this.state.spotplay &&
            <Spotlight
              x= "50"
              y= "50"
              radius= "180"
              color= "#000000"
              usePercentage
              borderColor="#ffffff"
              borderWidth={10}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '-50px',
                transform: 'translate(-50%, -100%)',
                whiteSpace: 'nowrap'
              }}>
                <div className="has-text-centered has-text-white has-text-weight-medium is-size-3"> 
                  It's Your Turn to Say
                </div>
              </div>
              <div style={{
                position: 'absolute',
                left: '220%',
                top: '-50%',
              }}>
                <AiOutlineCloseCircle
                  size = {40} 
                  color = "#fff"
                />
              </div>
                
            </Spotlight>
          }

          <MenuBar>
            <ButtonDropdown
              buttonClass={
                this.state.videoAvailable
                  ? "button is-large is-white"
                  : "button is-static is-large is-white"
              }
              handler={this.handleVideo}
              fontawesome="fas fa-video-slash"
              description={this.state.videoOn ? "Video Off" : "Video On"}
            />
            <ButtonDropdown
              buttonClass={
                this.state.audioAvailable
                  ? "button is-large is-white"
                  : "button is-static is-large is-white"
              }
              handler={this.handleAudio}
              fontawesome="fas fa-microphone-slash"
              description={this.state.audioOn ? "Audio Off" : "Audio On"}
            />
            <ButtonDropdown
              buttonClass={this.getClinkClass()}
              handler={this.handleClink}
              fontawesome="fas fa-glass-cheers"
              description="Clink"
            />
            <ButtonDropdown
              buttonClass={this.getAttentionClass()}
              handler={this.handleAttention}
              fontawesome="fas fa-bullhorn"
              description="Attention"
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
              buttonClass={
                this.state.chatOpen
                  ? "button is-large is-black"
                  : "button is-large is-white"
              }
              handler={() => {
                this.setState({ chatOpen: !this.state.chatOpen });
              }}
              fontawesome="fas fa-comments"
              description="Chat"
            />
            <ButtonDropdown
              buttonClass={
                this.state.youtubeOpen
                  ? "button is-large is-black"
                  : "button is-large is-white"
              }
              handler={() => {
                this.setState({ youtubeOpen: !this.state.youtubeOpen });
              }}
              fontawesome="fab fa-youtube"
              description="Share Video"
            />
            <ButtonDropdown
              buttonClass="button is-large is-white"
              handler={this.handleFullScreen}
              fontawesome="fas fa-expand"
              description="Full Screen"
            />
          </MenuBar>
        </MainContainer>
      </ScrollLock>
    );
  }
}

export default Room;