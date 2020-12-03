import React, { Component } from "react";
import { Item } from "../MainElement";
import VideoDropdown from "../VideoDropdown";
import Carousel from "react-elastic-carousel";

const { getNamebyNumber } = require("../../../utils/utils");

const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 1320, itemsToShow: 2 },
  ];

class Part1 extends Component {

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
            <div>
          <Carousel breakPoints={breakPoints} width="1620">
            <Item imgUrl={this.props.table_idx}>
              <table style={{ width: "100%", height: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "1.5%",
                        marginTop: "3.8%",
                      }}
                    ></td>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "25%",
                        marginTop: "3.8%",
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
                        marginLeft: "1.5%",
                        marginTop: "9.5%",
                      }}
                    >
                      {this.get_video(2)}
                    </td>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "25%",
                        marginTop: "9.5%",
                      }}
                    >
                      {this.get_video(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Item>
            <Item imgUrl={this.props.table_idx}>
              <table style={{ width: "100%", height: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "1.5%",
                        marginTop: "3.8%",
                      }}
                    >
                      {this.get_video(5)}
                    </td>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "25%",
                        marginTop: "3.8%",
                      }}
                    >
                      {this.get_video(7)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "1.5%",
                        marginTop: "9.5%",
                      }}
                    >
                      {this.get_video(6)}
                    </td>
                    <td
                      style={{
                        width: "50%",
                        position: "absolute",
                        marginLeft: "25%",
                        marginTop: "9.5%",
                      }}
                    >
                      {this.get_video(8)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Item>
          </Carousel>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: "-150px",
              marginTop: "-85px",
            }}
          >
            {this.get_video(1)}
          </div>
        </div>
        );
        
    }
}

export default Part1;