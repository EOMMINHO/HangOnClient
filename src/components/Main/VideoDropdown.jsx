import React, { Component } from "react";

class VideoDropdown extends Component {
  render() {
    return (
      <div
        className={
          this.props.isUp
            ? "dropdown is-up is-hoverable"
            : "dropdown is-hoverable"
        }
      >
        <div className="dropdown-trigger">
          <video
            key={this.props.myKey ? this.props.myKey : null}
            ref={this.props.myRef}
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
              {this.props.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoDropdown;
