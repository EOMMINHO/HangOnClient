import React, { Component } from "react";

class ButtonDropdown extends Component {
  render() {
    return (
      <div className="dropdown is-up is-hoverable">
        <div className="dropdown-trigger">
          <button
            className={this.props.buttonClass}
            onClick={this.props.handler}
          >
            <span className="icon is-medium">
              <i className={this.props.fontawesome}></i>
            </span>
          </button>
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

export default ButtonDropdown;
