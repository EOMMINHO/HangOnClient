import React, { Component } from "react";
import Ice1 from "./Ice1";
import Ice3 from "./Ice3";
import Ice2 from "./Ice2";
import Ice4 from "./Ice4";


class IceMain extends Component {
    render(){
        return(
            <div>
                {this.props.user1 &&
                    <Ice1
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
                    <Ice2
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
                    <Ice3
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
                    <Ice4
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

export default IceMain;

