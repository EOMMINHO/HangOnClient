import React, { Component } from "react";
import { Move3, Move4 } from "./Clink";
import { Item } from "./MainElement";
import VideoDropdown from "./VideoDropdown";
import Carousel from "react-elastic-carousel";

const { getNamebyNumber } = require("../../utils/utils");

const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 1320, itemsToShow: 2 },
  ];

class ClinkEight extends Component {

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
            <Carousel breakPoints={breakPoints} width="100" style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}>
              <Item imgUrl={this.props.table_idx}>
                <table style={{ width: "100%", height: "100%" }}>
                  <tbody>
                    <tr>
                      <Move3
                        width="50%"
                        position="absolute"
                        marginLeft="1.5%"
                        marginTop="3.8%"
                        contents={this.get_video(1)}
                      ></Move3>
                      <Move3
                        width="50%"
                        position="absolute"
                        marginLeft="0.8%"
                        marginTop="3.8%"
                        contents={this.get_video(3)}
                      ></Move3>
                    </tr>
                    <tr>
                      <Move4
                        width="50%"
                        position="absolute"
                        marginLeft="1.5%"
                        marginTop="9.5%"
                        contents={this.get_video(2)}
                      ></Move4>
                      <Move4
                        width="50%"
                        position="absolute"
                        marginLeft="0.8%"
                        marginTop="9.5%"
                        contents={this.get_video(4)}
                      ></Move4>
                    </tr>
                  </tbody>
                </table>
              </Item>
              <Item imgUrl={this.props.table_idx}>
                <table style={{ width: "100%", height: "100%" }}>
                  <tbody>
                    <tr>
                      <Move3
                        width="50%"
                        position="absolute"
                        marginLeft="1.5%"
                        marginTop="3.8%"
                        contents={this.get_video(5)}
                      ></Move3>
                      <Move3
                        width="50%"
                        position="absolute"
                        marginLeft="0.8%"
                        marginTop="3.8%"
                        contents={this.get_video(7)}
                      ></Move3>
                    </tr>
                    <tr>
                      <Move4
                        width="50%"
                        position="absolute"
                        marginLeft="1.5%"
                        marginTop="9.5%"
                        contents={this.get_video(6)}
                      ></Move4>
                      <Move4
                        width="50%"
                        position="absolute"
                        marginLeft="0.8%"
                        marginTop="9.5%"
                        contents={this.get_video(8)}
                      ></Move4>
                    </tr>
                  </tbody>
                </table>
              </Item>
            </Carousel>
          );
        
    }
}

export default ClinkEight;