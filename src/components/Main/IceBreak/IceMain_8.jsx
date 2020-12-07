import React, { Component } from "react";
import Ice81 from "./Ice8_1";
import Ice82 from "./Ice8_2";
import Ice83 from "./Ice8_3";
import Ice84 from "./Ice8_4";
import Ice85 from "./Ice8_5";
import Ice86 from "./Ice8_6";
import Ice87 from "./Ice8_7";
import Ice88 from "./Ice8_8";

class IceMain8 extends Component {
    render(){
        return(
            <div>
                {this.props.user1 &&
                    <Ice81
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user2 &&
                    <Ice82
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user3 &&
                    <Ice83
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user4 &&
                    <Ice84
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user5 &&
                    <Ice85
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user6 &&
                    <Ice86
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user7 &&
                    <Ice87
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
                {this.props.user8 &&
                    <Ice88
                        participants = {this.props.participants}
                        playerName = {this.props.playerName}
                        localVideoRef = {this.props.localVideoRef}
                        stream = {this.props.stream}
                        videoRefs = {this.props.videoRefs}
                        peerStreams = {this.props.peerStreams}
                        table_idx = {this.props.table_idx}
                    />
                }
            </div>
        )
    }
}

export default IceMain8;

