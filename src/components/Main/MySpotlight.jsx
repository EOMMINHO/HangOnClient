import React, { Component } from "react";
import Spotlight from "react-spotlight";
import { Button } from "./MainElement";
const { getNamebyAttention } = require("../../utils/utils");

class MySpotlight extends Component {
  render() {
    if (this.props.attentionInProgress) {
      return (
        <Spotlight
          x={50}
          y={50}
          radius={180}
          color="#000000"
          usePercentage
          borderColor="#ffffff"
          borderWidth={10}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "-50px",
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
            }}
          >
            {this.props.attention ? (
            <div className="has-text-centered has-text-white has-text-weight-medium is-size-3">
              It's Your Turn to Say
            </div>):(
            <div className="has-text-centered has-text-white has-text-weight-medium is-size-3">
              Introduce Yourself. You Have 20 Seconds
            </div>)
            }
            
          </div>
          {getNamebyAttention(this.props.participants) ===
          this.props.playerName ? (
            <div
              style={{
                position: "absolute",
                left: "100vh",
                top: "-25vh",
              }}
            >
              <Button
                className="button is-large"
                onClick={this.props.handleAttention}
              >
                <span className="icon is-large is-white">
                  <i className={"fas fa-times-circle"}></i>
                </span>
              </Button>
            </div>
          ) : null}
        </Spotlight>
      );
    } else {
      return null;
    }
  }
}

export default MySpotlight;
