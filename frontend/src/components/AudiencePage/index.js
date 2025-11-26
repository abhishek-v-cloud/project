import React, {Component} from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import {withRouter} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class AudiencePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: 'ffsh2322', // Room ID
      roleStr: 'audience', // Default role for audience
    }
    this.containerRef = React.createRef()
    this.appID = 609074249
    this.serverSecret = '2ae1636036c180e4b3162094911f077e'
  }

  componentDidMount() {
    const {location} = this.props
    const searchParams = new URLSearchParams(location.search)
    const roleStr = searchParams.get('role') || 'audience'
    this.setState({roleStr}, () => {
      this.initializeMeeting()
    })
  }

  initializeMeeting() {
    const {roleStr, roomId} = this.state

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      this.appID,
      this.serverSecret,
      roomId,
      Date.now().toString(),
      'audience',
    )

    const role =
      roleStr === 'audience'
        ? ZegoUIKitPrebuilt.Audience
        : ZegoUIKitPrebuilt.Host

    if (this.containerRef.current) {
      const zp = ZegoUIKitPrebuilt.create(kitToken)
      zp.joinRoom({
        container: this.containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role,
          },
        },
      })
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="user-live-conatiner">
          <h1>Live Streaming</h1>
          <div className="user-streaming-card" ref={this.containerRef} />
        </div>
      </>
    )
  }
}

export default withRouter(AudiencePage)
