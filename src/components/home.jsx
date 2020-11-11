import React, { Component } from "react";

class HomePage extends Component {
  state = {
    modalActive: false,
    hostActive: false,
    joinActive: false,
    roomName: null,
    playerName: null,
  };

  constructor(props) {
    super(props);
    // Binds
    this.handleHostClick = this.handleHostClick.bind(this);
    this.handleHostEnter = this.handleHostEnter.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.handleJoinEnter = this.handleJoinEnter.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
    this.handlePlayerName = this.handlePlayerName.bind(this);
    this.handleRoomName = this.handleRoomName.bind(this);
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
              <input
                className="input"
                placeholder="Player Name"
                onChange={this.handlePlayerName}
              />
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
              <input
                className="input"
                placeholder="player Name"
                onChange={this.handlePlayerName}
              />
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
              <input
                className="input"
                placeholder="Room Name"
                onChange={this.handleRoomName}
              />
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

  handlePlayerName(event) {
    this.setState({ playerName: event.target.value });
  }

  handleRoomName(event) {
    this.setState({ roomName: event.target.value });
  }

  handleHostClick() {
    this.handleModalClick();
    this.setState({ hostActive: true });
  }

  handleHostEnter() {
    sessionStorage.setItem("entryType", "host");
    sessionStorage.setItem("playerName", this.state.playerName);
    window.location.href = "/room";
  }

  handleJoinClick() {
    this.handleModalClick();
    this.setState({ joinActive: true });
  }

  handleJoinEnter() {
    sessionStorage.setItem("entryType", "join");
    sessionStorage.setItem("playerName", this.state.playerName);
    sessionStorage.setItem("roomName", this.state.roomName);
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
