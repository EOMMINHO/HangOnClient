import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class CopyText extends Component {
  state = {};

  async handleCopy(roomName) {
    await navigator.clipboard.writeText(roomName);
    toast.success("📝 Copied!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  render() {
    return (
      <div className="has-text-centered has-text-white has-text-weight-medium">
        <span>Room Name : {this.props.roomName}</span>
        <span
          className="icon is-small mx-2 has-text-info"
          onClick={() => this.handleCopy(this.props.roomName)}
        >
          <i className="far fa-clipboard"></i>
        </span>
      </div>
    );
  }
}

export default CopyText;
