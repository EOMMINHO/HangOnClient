import React, { Component } from "react";

class VideoDropdown extends Component {
  render() {
    return (
      <div className="dropdown is-hoverable">
        <div className="dropdown-trigger">
          <video
            ref={this.props.myRef}
            width="300"
            height="400"
            poster="/video-not-working.png"
            autoPlay
            muted
            style={{
            }}
          ></video>
        </div>
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <div className="dropdown-item has-text-link has-text-weight-medium">
              {this.props.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoDropdown;
