import React, {Component} from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import AdminHeader from '../AdminHeader'
import {withRouter} from 'react-router-dom'

import './index.css'

class HostPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: 'ffsh2322', // Room ID
      role_str: 'HeavenGame02', // Host role by default
    }
    this.containerRef = React.createRef()
    this.appID = 609074249
    this.serverSecret = '2ae1636036c180e4b3162094911f077e'
    this.sharedLinks = []
  }

  componentDidMount() {
    const {location} = this.props
    const searchParams = new URLSearchParams(location.search)
    const role_str = searchParams.get('role') || 'HeavenGame02' // Default role for host
    this.setState({role_str}, () => {
      this.initializeMeeting()
    })
  }

  initializeMeeting() {
    const {role_str} = this.state
    const roomId = this.state.roomId

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      this.appID,
      this.serverSecret,
      roomId,
      Date.now().toString(),
      'host',
    )

    const role = ZegoUIKitPrebuilt.Host // Always set the role as Host for the host page

    // Set up shared links for joining as co-host and audience
    if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
      this.sharedLinks.push({
        name: 'Join as co-host',
        url:
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          '?roomId=' +
          roomId +
          '&role=Cohost',
      })
    }

    this.sharedLinks.push({
      name: 'Join as audience',
      url:
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?roomId=' +
        roomId +
        '&role=Audience',
    })

    // Start the meeting for the host
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
        sharedLinks: this.sharedLinks, // Allow others to join as co-host or audience
      })
    }
  }

  render() {
    return (
      <>
        <AdminHeader />
        <div className="host-live-conatiner">
          <h1>Live Streaming</h1>
          <div className="streaming-card" ref={this.containerRef}></div>
        </div>
      </>
    )
  }
}

export default withRouter(HostPage)
