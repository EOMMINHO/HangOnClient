import React, { Component } from "react";
import Draggable from "react-draggable";
import "react-toastify/dist/ReactToastify.css";

class Chat extends Component {
  getVisibility() {
    if (this.props.open) {
      return "box";
    } else {
      return "is-invisible box";
    }
  }

  render() {
    return (
      <Draggable>
        <div className={this.getVisibility()}>
          <div className="has-text-right">
            <button
              className="button is-white is-small"
              onClick={this.props.handleClose}
            >
              <span className="icon has-text-danger is-small">
                <i className="fas fa-times"></i>
              </span>
            </button>
          </div>
          <div className="control">
            <textarea
              className="textarea has-fixed-size"
              readOnly
              rows="10"
              ref={this.props.chatBoardRef}
            ></textarea>
          </div>
          <input
            className="input"
            type="text"
            placeholder="text"
            ref={this.props.chatRef}
            onKeyPress={(e) => this.props.handleChat(e)}
          />
        </div>
      </Draggable>
    );
  }
}

export default Chat;
