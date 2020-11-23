import React, { Component } from "react";
import ReactPlayer from "react-player/youtube";

class YoutubePlayer extends Component {
  state = {
    youtubeOpen: false,
  };
  constructor() {
    super();
    this.inputRef = React.createRef();
    this.handleLink = this.handleLink.bind(this);
  }

  handleLink(e) {
    if (e.key === "Enter") {
      console.log(this.inputRef.current.value);
      this.setState({ link: this.inputRef.current.value });
    }
  }

  render() {
    return (
      <div className={this.state.youtubeOpen ? "box" : "is-invisible"}>
        <div>
          <ReactPlayer
            url={this.props.youtubeLink}
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
            ref={this.inputRef}
            onKeyPress={this.handleLink}
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
}

export default YoutubePlayer;
