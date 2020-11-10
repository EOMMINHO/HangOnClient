import React, { Component } from "react";
import { io } from "socket.io-client";

class HomePage extends Component {
  socket;
  state = {
    modalActive: false,
    hostActive: false,
    joinActive: false,
  };

  constructor(props) {
    super(props);
    // Set connection
    this.socket = io("http://localhost:5000");
    // IO handler
    this.socket.on("hostReady", (data) => {
      console.log(data);
    });
    this.socket.on("newJoin", (playerName) => {
      console.log(playerName);
    });
    // Binds
    this.handleHostClick = this.handleHostClick.bind(this);
    this.handleHostEnter = this.handleHostEnter.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
  }

  getModalClass() {
    if (this.state.modalActive) {
      return "modal is-active";
    } else {
      return "modal";
    }
  }

  getModalContent() {
    if (this.state.hostActive) {
      return (
        <div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" placeholder="Name" />
              <span className="icon is-small is-left">
                <i className="fas fa-signature"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div className="has-text-centered">
            <button className="button" onClick={this.handleHostEnter}>
              Enter
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" placeholder="Name" />
              <span className="icon is-small is-left">
                <i className="fas fa-signature"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" placeholder="Room Name" />
              <span className="icon is-small is-left">
                <i className="fab fa-chromecast"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div className="has-text-centered">
            <button className="button" onClick={this.handleJoinEnter}>
              Enter
            </button>
          </div>
        </div>
      );
    }
  }

  handleHostClick() {
    this.handleModalClick();
    this.setState({ hostActive: true });
  }

  handleHostEnter() {
    window.location.href = "/room";
  }

  handleJoinClick() {
    this.handleModalClick();
    this.setState({ joinActive: true });
  }

  handleJoinEnter() {
    window.location.href = "/room";
  }

  handleModalClick() {
    this.setState({ modalActive: !this.state.modalActive });
    this.setState({ hostActive: false });
    this.setState({ joinActive: false });
  }

  render() {
    return (
      <div className="container">
        <div className={this.getModalClass()}>
          <div
            className="modal-background"
            onClick={this.handleModalClick}
          ></div>
          <div className="modal-content box">{this.getModalContent()}</div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={this.handleModalClick}
          ></button>
        </div>
        <div>
          <h1 className="is-size-1 has-text-black has-text-centered mt-6">
            Hang On
          </h1>
        </div>
        <div className="has-text-centered">
          <button
            className="button is-size-5 mt-6 px-6"
            onClick={this.handleHostClick}
          >
            Host
          </button>
        </div>
        <div className="has-text-centered">
          <button
            className="button is-size-5 mt-4 px-6"
            onClick={this.handleJoinClick}
          >
            Join
          </button>
        </div>
      </div>
    );
  }
}

export default HomePage;
