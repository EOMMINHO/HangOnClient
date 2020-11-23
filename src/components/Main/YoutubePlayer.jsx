import React, { Component } from "react";
import ReactPlayer from "react-player/youtube";

class YoutubePlayer extends Component {
  state = { link: "https://www.youtube.com/watch?v=Y633472KofU" };
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

  getVisibility(isVisible) {
    if (isVisible) {
      return "box top-left";
    } else {
      return "is-invisible";
    }
  }

  render() {
    return (
      <div className={this.getVisibility(this.props.visible)}>
        <div>
          <ReactPlayer
            url={this.state.link}
            controls={true}
            width="320px"
            height="180px"
          />
        </div>
        <div>
          <input
            className="input"
            placeholder="Youtube Link"
            ref={this.inputRef}
            onKeyPress={this.handleLink}
          />
        </div>
      </div>
    );
  }
}

export default YoutubePlayer;
