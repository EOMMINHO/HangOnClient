import React, { Component } from "react";
import { Item } from "../MainElement";
import VideoDropdown from "../VideoDropdown";
const { getNamebyNumber } = require("../../../utils/utils");



class PartTwo extends Component {

    get_video(i) {
        if (Object.keys(this.props.participants).length >= i) {
          if (
            getNamebyNumber(this.props.participants, i) === this.props.playerName
          ) {
            return (
              <VideoDropdown
                key={this.props.playerName}
                myRef={this.props.localVideoRef}
                description={this.props.playerName}
                isUp={i % 2}
                stream={this.props.stream}
                muted={true}
              />
            );
          } else {
            return (
              <VideoDropdown
                key={getNamebyNumber(this.props.participants, i)}
                myRef={this.props.videoRefs[getNamebyNumber(this.props.participants, i)]}
                description={getNamebyNumber(this.props.participants, i)}
                isUp={i % 2}
                stream={
                  this.props.peerStreams[getNamebyNumber(this.props.participants, i)]
                }
                muted={false}
              />
            );
          }
        }
      }

    render(){
        return (
        <div
            style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Item imgUrl={this.props.table_idx}>
            <table style={{ width: "100%", height: "100%" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "16%",
                      marginTop: "6%",
                    }}
                  >
                    {this.get_video(1)}
                  </td>
                  <td
                    style={{
                      width: "50%",
                      position: "fixed",
                      marginLeft: "50%",
                      marginTop: "6%",
                    }}
                  >
                    {this.get_video(3)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      marginLeft: "16%",
                      bottom: "8.8%",
                    }}
                  ></td>
                  <td
                    style={{
                      width: "50%",
                      position: "absolute",
                      bottom: "8.8%",
                      marginLeft: "50%",
                    }}
                  >
                    {this.get_video(4)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: "-150px",
                marginTop: "-85px",
              }}
            >
              {this.get_video(2)}
            </div>
          </Item>
        </div>
      );
    }
}

export default PartTwo;