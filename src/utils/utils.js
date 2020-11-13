const React = require("react");
const Peer = require("simple-peer");

// make a new peer for old users
function makeNewPeer(socket, roomName, peers, participants, myName, videoRefs) {
  // find a new peer
  let oldPeers = Object.keys(peers);
  let newPeers = Object.keys(participants);
  let newUser = newPeers.filter(
    (x) => !oldPeers.includes(x) && x !== myName
  )[0];
  // initiate video reference
  let videoRef = React.createRef();
  videoRefs[newUser] = videoRef;
  // make a connection
  let p = new Peer();
  p.on("signal", (data) => {
    socket.emit("RTC_offer", JSON.stringify(data), myName, newUser, roomName);
  });
  p.on("connect", () => {
    console.log("connected");
  });
  p.on("stream", (stream) => {
    if ("srcObject" in videoRef.current) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.src = window.URL.createObjectURL(stream);
    }
  });
  p.on("error", (err) => {
    console.log(err);
  });
  // store it to global variable
  peers[newUser] = p;
}

// make new peers for noob
function makeNewPeers(
  socket,
  roomName,
  peers,
  participants,
  myName,
  videoRefs
) {
  // find receivers
  let newPeers = Object.keys(participants);
  newPeers = newPeers.filter((x) => x !== myName);
  // make peers
  newPeers.forEach((userName) => {
    // initiate video reference
    let videoRef = React.createRef();
    videoRefs[userName] = videoRef;
    // make peer connection
    let p = new Peer({ initiator: true });
    p.on("signal", (data) => {
      socket.emit(
        "RTC_offer",
        JSON.stringify(data),
        myName,
        userName,
        roomName
      );
    });
    p.on("connect", () => {
      console.log("connected");
    });
    p.on("stream", (stream) => {
      if ("srcObject" in videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.src = window.URL.createObjectURL(stream);
      }
    });
    p.on("error", (err) => {
      console.log(err);
    });
    peers[userName] = p;
  });
}

// disconnect peer
function disconnectPeer(peers, peerName) {
  // find a disconnected peer
  delete peers[peerName];
}

module.exports.makeNewPeer = makeNewPeer;
module.exports.makeNewPeers = makeNewPeers;
module.exports.disconnectPeer = disconnectPeer;
