import React, { Component } from "react";

class Music extends Component {
    constructor(props) {
    super(props);
    this.state = {
      play: false,
      pause: true,
    }
    this.url = "https://drive.google.com/u/0/uc?id=16G1D1WdUuFfzdsdkBBrmNmUBJJlWorop";
    this.audio = new Audio(this.url);
    this.audio.addEventListener('play', () => {
      this.setState({
        play: true,
        pause: false,
      })
    });
    this.audio.addEventListener('pause', () => {
      this.setState({
        play: false,
        pause: true,
      })
    });
  }

  play() {
  this.setState({ play: true, pause: false })
    this.audio.play();
  }
  
  pause() {
  this.setState({ play: false, pause: true })
    this.audio.pause();
  }
  
  render() {
    
  return (
    <div>
      <button onClick={this.play}>Play</button>
      <button onClick={this.pause}>Pause</button>
    </div>
    );
  }
}

ReactDOM.render(
  <Music />,
  document.getElementById('container')
);