import React, { Component } from "react";
import ReactPlayer from "react-player/youtube";
import { io } from "socket.io-client";
import ButtonDropdown from "./ButtonDropdown";
import Chat from "./Chat";
import CopyText from "./CopyText";
import { MainContainer, MenuBar, Youtube } from "./MainElement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Draggable from "react-draggable";
import MySpotlight from "./MySpotlight";
import Spotlight from 'react-spotlight';
import FourTable from "./Four_Table";
import ClinkFour from "./Clink_Four";
import EightTable from "./Eight_Table";
import ClinkEight from "./Clink_Eight";
import PartOne from "./Attention_Four/Part_One";
import PartTwo from "./Attention_Four/Part_Two";
import PartFour from "./Attention_Four/Part_Four";
import PartThree from "./Attention_Four/Part_Three";
import Part1 from "./Attention_Eight/Part1";
import Part2 from "./Attention_Eight/Part2";
import Part3 from "./Attention_Eight/Part3";
import Part4 from "./Attention_Eight/Part4";
import Part5 from "./Attention_Eight/Part5";
import Part6 from "./Attention_Eight/Part6";
import Part7 from "./Attention_Eight/Part7";
import Part8 from "./Attention_Eight/Part8";
import IceMain from "./IceBreak/IceMain";
import IceMain8 from "./IceBreak/IceMain_8";

const Util = require("../../utils/utils");
const delay = require("delay");
const { Howl } = require("howler");

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
    clinkInProgress: 0,
    attentionResponse: false,
    attentionInProgress: false,
    swapInProgress: false,
    videoOn: false,
    audioOn: false,
    videoAvailable: false,
    audioAvailable: false,
    chatOpen: false,
    youtubeOpen: false,
    full_screen: false,
    youtubeLink:
      "https://www.youtube.com/watch?v=k7YzgZf-V5U&t=250s&ab_channel=%EC%86%8C%EB%A6%AC%EC%97%B0%EA%B5%AC%EC%86%8C-S.LAB",
    youtubeLinkInput: null,
    items: [],
    countdown: false,
    countdown_text: "",
    background_idx: 0,
    table_idx: 0,
    icebreak: false,
    user1: false,
    user2: false,
    user3: false,
    user4: false,
    user5: false,
    user6: false,
    user7: false,
    user8: false,
  };

  constructor() {
    super();
    // set references
    this.localVideoRef = React.createRef();
    this.chatRef = React.createRef();
    this.chatBoardRef = React.createRef();
    // set the availableness of media devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      let types = devices.map((x) => x.kind);
      this.state.videoAvailable = types.includes("videoinput");
      this.state.audioAvailable = types.includes("audioinput");
    });
    // set sound
    this.clinkSoud = new Howl({
      src: ["clinkSound.mp3"],
      volume: 0.2,
    });

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
    });
    this.socket.on("clinkResponse", async (isSuccess, playerName) => {
      if (isSuccess) {
        console.log(`${playerName} has requested to clink`);
        toast.info(`🚀 ${playerName} has requested to clink!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.start();
        new Promise((resolve) => setTimeout(resolve, 3200)).then(() =>{
        this.setState({ clinkInProgress: true });
      })
      new Promise((resolve) => setTimeout(resolve, 3900)).then(() => {
        this.clinkSoud.play();
      })
    }
  });

    this.socket.on(
      "attentionResponse",
      (isSuccess, playerName, participants) => {
        if (isSuccess) {
          toast.info(`🚀 ${playerName} has requested to get attention!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.start();
          new Promise((resolve) => setTimeout(resolve, 3000)).then(() =>{
            if (this.state.attentionInProgress) {
              this.setState({
                attentionInProgress: false,
                participants: participants,
              });
            } else {
              this.setState({
                attentionInProgress: true,
                participants: participants,
              });
          }})
        } else {
          this.setState({
            attentionInProgress: false,
            participants: participants,
          });
        }
      }
    );
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
    this.socket.on("emojiResponse", (sender, num) => {
      var message;
      switch(num) {
        case 1:
          message = sender + ': 😊';
          break;
        case 2:
          message = sender + ': 😢';
          break;
        case 3:
          message = sender + ': 🤣';
          break;
        case 4:
          message = sender + ': 😵';
          break;
        default:
          break;
      }
      if (sender !== this.state.playerName) {
        toast(message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
    this.socket.on("icebreakResponse", async (playerName) => {
      toast.info(`🚀 ${playerName} has requested for an icebreak!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.start();
      new Promise((resolve) => setTimeout(resolve, 3200)).then(() =>{
        this.start_icebreak();
      });
    });
    this.socket.on("youtube link", (youtubelink) => {
      this.setState({ youtubeLink: youtubelink });
    });
    this.socket.on("youtubeLinkResponse", (youtubeLink) => {
      this.setState({ youtubeLink: youtubeLink });
    });
    // P2P for video conference
    this.socket.on("RTC_answer", async (offerer, receiver, data) => {
      // if receiver is me, signal it to offerer.
      try {
        if (receiver === this.state.playerName) {
          while (!Object.keys(this.peers).includes(offerer)) {
            await delay(100);
          }
          this.peers[offerer].signal(data);
        }
      } catch (error) {
        console.log(error);
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
      this.socket.emit("youtubeLinkRequest", this.state.roomName);
    }

    // binding
    this.handleSwapClick = this.handleSwapClick.bind(this);
    this.handleVideo = this.handleVideo.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.handleModalOutClick = this.handleModalOutClick.bind(this);
    this.toastIfVisible = this.toastIfVisible.bind(this);
    this.handleFullScreen = this.handleFullScreen.bind(this);
    this.handleAttention = this.handleAttention.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.start = this.start.bind(this);
    this.setStatePromise = this.setStatePromise.bind(this);
    this.start_icebreak = this.start_icebreak.bind(this);
  }

  componentDidUpdate(prevState) {
    if (this.state.clinkInProgress !== 0)
      new Promise((resolve) => setTimeout(resolve, 2550)).then(() =>
        this.setState({ clinkInProgress: 0 })
      );
  }

  getVideoButtonClass() {
    if (!this.state.videoAvailable) {
      return "button is-static is-large is-white";
    } else if (this.state.videoOn) {
      return "button is-large is-black";
    } else {
      return "button is-large is-white";
    }
  }

  getAudioButtonClass() {
    if (!this.state.audioAvailable) {
      return "button is-static is-large is-white";
    } else if (this.state.audioOn) {
      return "button is-large is-black";
    } else {
      return "button is-large is-white";
    }
  }

  getModalContent() {
    if (this.state.swapInProgress) {
      return (
        <div>
          <center>
            <text>Choose the person to change seats with:</text>
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
                } else return null;
              })}
            </div>
          </center>
        </div>
      );
    } else if (this.state.backgroundInProgress) {
      return (
        <div>
          <center>
            <text>Choose the background image:</text>
            <div>
              <button onClick={() => this.setState({ background_idx : 0 })}>1</button>
              <button onClick={() => this.setState({ background_idx : 1 })}>2</button>
              <button onClick={() => this.setState({ background_idx : 2 })}>3</button>
              <button onClick={() => this.setState({ background_idx : 3 })}>4</button>
            </div>
            <text>Choose the table image:</text>
            <div>
              <button onClick={() => this.setState({ table_idx : 0 })}>1</button>
              <button onClick={() => this.setState({ table_idx : 1 })}>2</button>
              <button onClick={() => this.setState({ table_idx : 2 })}>3</button>
              <button onClick={() => this.setState({ table_idx : 3 })}>4</button>
            </div>
          </center>
        </div>
      );
    } else return null;
  }

  handleChat(e) {
    if (e.key === "Enter" && this.chatRef.current.value !== "") {
      // send to peers
      let newmsg = this.state.playerName + ": " + this.chatRef.current.value;
      Object.values(this.peers).forEach((p) => {
        try {
          p.send(newmsg);
        } catch (error) {
          console.log(error);
        }
      });
      this.chatRef.current.value = "";
      this.chatBoardRef.current.value =
        this.chatBoardRef.current.value + `${newmsg}\n`;
      this.chatBoardRef.current.scrollTop = this.chatBoardRef.current.scrollHeight;
    }
  }

  handleEmoji(num) {
    this.socket.emit("emoji", this.state.playerName, this.state.roomName, num);
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

  handleAttention() {
    this.socket.emit("attention", this.state.playerName, this.state.roomName);
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
        try {
          p.addStream(this.stream);
        } catch (error) {
          console.log(error);
        }
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
        try {
          p.addStream(this.stream);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  getYoutubeVideo() {
    return (
      <div className={this.state.youtubeOpen ? "box" : "is-invisible"}>
        <div>
          <ReactPlayer
            url={this.state.youtubeLink}
            controls={true}
            width="340px"
            height="200px"
            playing={true}
            onStart={() => console.log("new play starts")}
          />
        </div>
        <div>
          <input
            style={{ width: 260, height: 40 }}
            className="input"
            placeholder="Youtube Link"
            onChange={(e) => {
              this.setState({ youtubeLinkInput: e.target.value });
            }}
          />
          <button
            style={{ width: 80, height: 40 }}
            className="button has-text-centered"
            onClick={() => {
              this.socket.emit(
                "youtube link",
                this.state.youtubeLinkInput,
                this.state.roomName
              );
            }}
          >
            Share
          </button>
        </div>
      </div>
    );
  }

  handleFullScreen() { // to support several browsers
    var docElm = document.documentElement;
    if (!this.state.full_screen) {
      if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      }
    }
    this.setState({ full_screen : !this.state.full_screen });
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

  start() {
    this.setStatePromise({ countdown_text: 3, countdown: true })
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 2 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 1 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown: false }));
  }

  count20() {
    this.setStatePromise({ countdown_text: 20 })
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 19 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 18 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 17 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 16 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 15 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 14 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 13 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 12 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 11 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 10 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 9 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 8 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 7 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 6 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 5 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 4 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 3 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 2 }))
      .then(() => this.sleep(1000))
      .then(() => this.setStatePromise({ countdown_text: 1 }));
  }

  async start_icebreak() {
    this.setState({ user1: true, icebreak: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 1){
      this.setState({ user1: false, icebreak: false });
      return;
    }
    this.setState({ user1: false, user2: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 2){
      this.setState({ user2: false, icebreak: false });
      return;
    }
    this.setState({ user2: false, user3: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 3){
      this.setState({ user3: false, icebreak: false });
      return;
    }    
    this.setState({ user3: false, user4: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 4){
      this.setState({ user4: false, icebreak: false });
      return;
    }    
    this.setState({ user4: false, user5: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 5){
      this.setState({ user5: false, icebreak: false });
      return;
    }
    this.setState({ user5: false, user6: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 6){
      this.setState({ user6: false, icebreak: false });
      return;
    }
    this.setState({ user6: false, user7: true});
    this.count20();
    await delay(21000);
    if (Object.keys(this.state.participants).length === 7){
      this.setState({ user7: false, icebreak: false });
      return;
    }
    this.setState({ user7: false, user8: true});
    this.count20();
    await delay(21000);
    this.setState({ user8: false, icebreak: false});
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setStatePromise(state) {
    this.setState(state);
    return Promise.resolve();
  }

  countdown_3(){
    return (
      <div>
        {this.state.countdown && (
        <Spotlight
            x={50}
            y={50}
            radius={0}
            color="#000000"
            usePercentage
            borderColor="#ffffff"
            borderWidth={185}
        >
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: "200px",
                color: "#000000"
            }}>
                <div>{this.state.countdown_text}</div>
            </div>
        </Spotlight>
        )}
      </div>
    );
  }

  set_4_table() {
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(1)
    )
      return (
        <PartOne
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(2)
    )
      return (
        <PartTwo
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(3)
    )
      return (
        <PartThree
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(4)
    )
      return (
        <PartFour
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
  }

  set_8_table() {
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(1)
    )
      return (
        <Part1
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(2)
    )
      return (
        <Part2
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(3)
    )
      return (
        <Part3
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(4)
    )
      return (
        <Part4
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(5)
    )
      return (
        <Part5
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(6)
    )
      return (
        <Part6
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(7)
    )
      return (
        <Part7
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
    if (
      Object.keys(this.state.participants)
        .map((userName) => {
          if (this.state.participants[userName].attention) {
            return this.state.participants[userName].seatNumber;
          }
          return null;
        })
        .includes(8)
    )
      return (
        <Part8
          participants = {this.state.participants}
          playerName = {this.state.playerName}
          localVideoRef = {this.state.localVideoRef}
          stream = {this.stream}
          videoRefs = {this.videoRefs}
          peerStreams = {this.peerStreams}
          table_idx = {this.state.table_idx}
        />
      );
  }

  settable() {
    if (Object.keys(this.state.participants).length < 5) {
      if (this.state.clinkInProgress) {
        return (
          <ClinkFour
            participants = {this.state.participants}
            playerName = {this.state.playerName}
            localVideoRef = {this.localVideoRef}
            stream = {this.stream}
            videoRefs = {this.videoRefs}
            peerStreams = {this.peerStreams}
            table_idx = {this.state.table_idx}
          />
        );
      } 
      else if (this.state.attentionInProgress){
        return this.set_4_table();
      }
      else if (this.state.icebreak){
        return(
          <IceMain
            participants = {this.state.participants}
            playerName = {this.state.playerName}
            localVideoRef = {this.localVideoRef}
            stream = {this.stream}
            videoRefs = {this.videoRefs}
            peerStreams = {this.peerStreams}
            table_idx = {this.state.table_idx}
            user1 = {this.state.user1}
            user2 = {this.state.user2}
            user3 = {this.state.user3}
            user4 = {this.state.user4}
          />
        )
      }
      else{
        return (
          <FourTable
            participants = {this.state.participants}
            playerName = {this.state.playerName}
            localVideoRef = {this.localVideoRef}
            stream = {this.stream}
            videoRefs = {this.videoRefs}
            peerStreams = {this.peerStreams}
            table_idx = {this.state.table_idx}
          />
        );
      }
    } 
    else {
      if (this.state.clinkInProgress) {
        return (
          <ClinkEight
            participants = {this.state.participants}
            playerName = {this.state.playerName}
            localVideoRef = {this.localVideoRef}
            stream = {this.stream}
            videoRefs = {this.videoRefs}
            peerStreams = {this.peerStreams}
            table_idx = {this.state.table_idx}
          />
        );
      }
      else if (this.state.attentionInProgress) 
        return this.set_8_table();
      else if (this.state.icebreak){
        return(
          <IceMain8
            participants = {this.state.participants}
            playerName = {this.state.playerName}
            localVideoRef = {this.localVideoRef}
            stream = {this.stream}
            videoRefs = {this.videoRefs}
            peerStreams = {this.peerStreams}
            table_idx = {this.state.table_idx}
            user1 = {this.state.user1}
            user2 = {this.state.user2}
            user3 = {this.state.user3}
            user4 = {this.state.user4}
            user5 = {this.state.user5}
            user6 = {this.state.user6}
            user7 = {this.state.user7}
            user8 = {this.state.user8}
          />
        )
      }
      else {
        return (
          <EightTable
            participants = {this.state.participants}
            playerName = {this.state.playerName}
            localVideoRef = {this.localVideoRef}
            stream = {this.stream}
            videoRefs = {this.videoRefs}
            peerStreams = {this.peerStreams}
            table_idx = {this.state.table_idx}
          />
        );
      }
    }
  }

  render() {
    return (
      <MainContainer imgUrl={this.state.background_idx}>
        <div className={this.state.modalActive ? "modal is-active" : "modal"}>
          <div className="modal-background"></div>
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
          <CopyText roomName={this.state.roomName} />
          <div>{this.settable()}{this.countdown_3()}</div>
          <div className="has-text-centered mt-2" position="absolute">
            <div className="columns">
              <div className="column is-3 mx-4">
                <Chat
                  chatBoardRef={this.chatBoardRef}
                  chatRef={this.chatRef}
                  handleClose={() => {
                    this.setState({ chatOpen: !this.state.chatOpen });
                  }}
                  handleChat={this.handleChat}
                  open={this.state.chatOpen}
                />
              </div>
            </div>
          </div>
        </div>
        <Draggable>
          <Youtube>{this.getYoutubeVideo()}</Youtube>
        </Draggable>
        <MySpotlight
          attentionInProgress={this.state.attentionInProgress}
          attention = {true}
          participants={this.state.participants}
          playerName={this.state.playerName}
          handleAttention={this.handleAttention}
          countdown_text = {this.state.countdown_text}
        />
        <MySpotlight
          attentionInProgress={this.state.icebreak}
          participants={this.state.participants}
          attention = {false}
          playerName={this.state.playerName}
          handleAttention={this.handleAttention}
          countdown_text = {this.state.countdown_text}
        />
        <MenuBar>
          <ButtonDropdown
            buttonClass={this.getVideoButtonClass()}
            handler={this.handleVideo}
            fontawesome="fas fa-video"
            description={this.state.videoOn ? "Video Off" : "Video On"}
          />
          <ButtonDropdown
            buttonClass={this.getAudioButtonClass()}
            handler={this.handleAudio}
            fontawesome="fas fa-microphone"
            description={this.state.audioOn ? "Audio Off" : "Audio On"}
          />
          <ButtonDropdown
            buttonClass={
              this.state.clinkInProgress &&
              this.state.clink_participants.length !== 0
                ? "button is-loading is-large is-white"
                : "button is-large is-white"
            }
            handler={() => {
              if (Object.keys(this.state.participants).length === 1) {
                return alert("cannot toast when solo");
              }            
              this.socket.emit(
                "clink",
                this.state.playerName,
                this.state.roomName
              )          
            }}
            fontawesome="fas fa-glass-cheers"
            description="Clink!"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={() => {
              if (Object.keys(this.state.participants).length === 1) {
                return alert("cannot get attention when solo");
              }
              this.socket.emit(
                "attention",
                this.state.playerName,
                this.state.roomName
              )
            }}
            fontawesome="fas fa-bullhorn"
            description="Attention"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={() => {
              if (Object.keys(this.state.participants).length === 1) {
                return alert("cannot swap when solo");
              }
              this.setState({ modalActive: true, swapInProgress: true });
            }}
            fontawesome="fas fa-exchange-alt"
            description="Seat Swap"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={() => {
              if (Object.keys(this.state.participants).length === 1) {
                return alert("cannot shuffle when solo");
              }
              this.socket.emit("seatShuffle", this.state.roomName);
            }}
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
            buttonClass="button is-large is-white"
            fontawesome="far fa-meh-blank"
            description={
              <>
                <button className="button is-medium is-white" onClick={() => {this.handleEmoji(1);}}>
                  😊
                </button>
                <button className="button is-medium is-white" onClick={() => {this.handleEmoji(2);}}>
                  😢
                </button>
                <button className="button is-medium is-white" onClick={() => {this.handleEmoji(3);}}>
                  🤣
                </button>
                <button className="button is-medium is-white" onClick={() => {this.handleEmoji(4);}}>
                  😵
                </button>
              </>
            }
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
            handler={() =>{
              this.socket.emit("icebreak", this.state.playerName, this.state.roomName)
            }}
            fontawesome="fas fa-users"
            description="Icebreak"
          />
          <ButtonDropdown
            buttonClass="button is-large is-white"
            handler={() => {
              this.setState({ modalActive: true, backgroundInProgress: true });
            }}
            fontawesome="far fa-image"
            description="Image Changer"
          />
          <ButtonDropdown
            buttonClass={
              this.state.full_screen
                ? "button is-large is-black"
                : "button is-large is-white"
            }
            handler={this.handleFullScreen}
            fontawesome="fas fa-expand"
            description="Full Screen"
          />
        </MenuBar>
      </MainContainer>
    );
  }
}

export default Room;