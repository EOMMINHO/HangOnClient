// DOM elements.
const roomSelectionContainer = document.getElementById('room-selection-container')
const roomInput = document.getElementById('room-input')
const nameInput = document.getElementById('name-input')
const connectButton = document.getElementById('connect-button')

const clinkButton = document.getElementById('clink-button')
const clinkYesButton = document.getElementById('clink-yes-button')
const clinkNoButton = document.getElementById('clink-no-button')

const gameListButton = document.getElementById('game-list-button')
const gameYesButton = document.getElementById('game-yes-button')
const gameNoButton = document.getElementById('game-no-button')

const attentionButton = document.getElementById('attention-button')
const stopAttentionButton = document.getElementById('stop-attention-button')

const videoChatContainer = document.getElementById('video-chat-container')
const localVideoComponent = document.getElementById('local-video')
const remoteVideoComponent = document.getElementById('remote-video')

// Variables.
const socket = io();
const mediaConstraints = {
  audio: true,
  video: { width: 1280, height: 720 },
}
let localStream;
let remoteStream;
let isRoomCreator = false;
let rtcPeerConnection;
let roomId;

// Free public STUN servers provided by Google.
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
}

// BUTTON LISTENER ============================================================
connectButton.addEventListener('click', () => {
  joinRoom(roomInput.value)
})

clinkButton.addEventListener('click', () => {
  clinkRequest()
})
clinkYesButton.addEventListener('click', () => {
  joinClink()
})
clinkNoButton.addEventListener('click', () => {
  refuseClink()
})

gameListButton.addEventListener('click', () => {
  gameList()
})

attentionButton.addEventListener('click', () => {
  attentionRequest()
})

// SOCKET EVENT CALLBACKS =====================================================
socket.on('hostResponse', async () => {
  console.log('Socket event callback: room_created')
  await setLocalStream(mediaConstraints)
  isRoomCreator = true;
})

socket.on('joinResponse', async (success) => {
  if (success) {
    console.log('Socket event callback: room_joined')
    await setLocalStream(mediaConstraints)
    socket.emit('start_call', roomId)
  } else {
    console.log('Socket event callback: full_room')
    alert('The room is full, please try another one')
  }
})

socket.on('clinkResponse', (playerName) => {
  console.log('clink requested by '+playerName)
  if (playerName != nameInput.value) {
    // 오버레이 띄움(clink 요청 안내, clinkYesButton, clinkNoButton)
  } else {
    // 오버레이 띄움(clink 시작 버튼)
  }
})
socket.on('clinkFail', (playerName) => {
  console.log('clink fail: '+playerName)
  if (playerName == nameInput.value) alert('The clink feature is already in use')
})

socket.on('gameResponse', (playerName, gameName) => {
  console.log('game "'+gameName+'" requested by '+playerName)
  if (playerName != nameInput.value) {
    // 오버레이 띄움(game 요청 안내, gameYesButton, gameNoButton)
  } else {
    // 오버레이 띄움(game 시작 버튼)
  }
})
socket.on('gameFail', (playerName) => {
  console.log('game fail: '+playerName)
  if (playerName == nameInput.value) alert('The game feature is already in use')
})

socket.on('attentionResponse', (playerName) => {
  console.log('attention requested by '+playerName)
  if (playerName != nameInput.value) {
    // playerName 이름의 사용자의 캠을 내 화면 정가운데에 확대해서 둠
  } else {
    // 오버레이 띄움(자신이 attention 사용 중임을 안내, stopAttentionButton)
  }
})
socket.on('attentionFail', (playerName) => {
  console.log('attention fail: '+playerName)
  if (playerName == nameInput.value) alert('The attention feature is already in use')
})

socket.on('seatSwapResponse', (participants) => {
  console.log('seat swap occurred')
  // participants 리스트대로 좌석배치도 다시 출력
})

socket.on('seatShuffleResponse', (participants) => {
  console.log('seat shuffle occurred')
  // participants 리스트대로 좌석배치도 다시 출력
})

// WebRTC ==================================================================
socket.on('start_call', async () => {
  console.log('Socket event callback: start_call')

  if (isRoomCreator) {
    rtcPeerConnection = new RTCPeerConnection(iceServers)
    addLocalTracks(rtcPeerConnection)
    rtcPeerConnection.ontrack = setRemoteStream
    rtcPeerConnection.onicecandidate = sendIceCandidate
    await createOffer(rtcPeerConnection)
  }
})

socket.on('webrtc_offer', async (event) => {
  console.log('Socket event callback: webrtc_offer')

  if (!isRoomCreator) {
    rtcPeerConnection = new RTCPeerConnection(iceServers)
    addLocalTracks(rtcPeerConnection)
    rtcPeerConnection.ontrack = setRemoteStream
    rtcPeerConnection.onicecandidate = sendIceCandidate
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
    await createAnswer(rtcPeerConnection)
  }
})

socket.on('webrtc_answer', (event) => {
  console.log('Socket event callback: webrtc_answer')

  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
})

socket.on('webrtc_ice_candidate', (event) => {
  console.log('Socket event callback: webrtc_ice_candidate')

  // ICE candidate configuration.
  var candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  })
  rtcPeerConnection.addIceCandidate(candidate)
})

// FUNCTIONS ==================================================================
function clinkRequest() {
  socket.emit('clink', (nameInput.value, roomId))
}
function joinClink() {
  // 오버레이 닫고 화면에 clink 띄움
  // 서버에 수락했다고 알림
}
function refuseClink() {
  // 오버레이 닫음
  // 서버에 거절했다고 알림
}

function gameList() {
  // 화면에 이용 가능한 게임 목록 띄움
}

function attentionRequest() {
  socket.emit('attention', (nameInput.value, roomId))
}

// WebRTC FUNCTIONS ==================================================================
function joinRoom(room) {
  if (room === '') {
    alert('Please type a room ID')
  } else {
    roomId = room
    socket.emit('join', (nameInput.value, room))
    showVideoConference()
  }
}

function showVideoConference() {
  roomSelectionContainer.style = 'display: none'
  videoChatContainer.style = 'display: block'
}

async function setLocalStream(mediaConstraints) {
  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
  } catch (error) {
    console.error('Could not get user media', error)
  }

  localStream = stream
  localVideoComponent.srcObject = stream
}

function addLocalTracks(rtcPeerConnection) {
  localStream.getTracks().forEach((track) => {
    rtcPeerConnection.addTrack(track, localStream)
  })
}

async function createOffer(rtcPeerConnection) {
  let sessionDescription
  try {
    sessionDescription = await rtcPeerConnection.createOffer()
    rtcPeerConnection.setLocalDescription(sessionDescription)
  } catch (error) {
    console.error(error)
  }

  socket.emit('webrtc_offer', {
    type: 'webrtc_offer',
    sdp: sessionDescription,
    roomId,
  })
}

async function createAnswer(rtcPeerConnection) {
  let sessionDescription
  try {
    sessionDescription = await rtcPeerConnection.createAnswer()
    rtcPeerConnection.setLocalDescription(sessionDescription)
  } catch (error) {
    console.error(error)
  }

  socket.emit('webrtc_answer', {
    type: 'webrtc_answer',
    sdp: sessionDescription,
    roomId,
  })
}

function setRemoteStream(event) {
  remoteVideoComponent.srcObject = event.streams[0]
  remoteStream = event.stream
}

function sendIceCandidate(event) {
  if (event.candidate) {
    socket.emit('webrtc_ice_candidate', {
      roomId,
      label: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate,
    })
  }
}