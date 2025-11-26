import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import AdminHeader from '../AdminHeader'

import './index.css'

class HostPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: 'ffsh2322',
      roleStr: 'HeavenGame02',
    }
    this.containerRef = React.createRef()
    this.appID = 609074249
    this.serverSecret = '2ae1636036c180e4b3162094911f077e'
    this.sharedLinks = []
  }

  componentDidMount() {
    const {location} = this.props
    const searchParams = new URLSearchParams(location.search)
    const roleStr = searchParams.get('role') || 'HeavenGame02'
    this.setState({roleStr}, () => {
      this.initializeMeeting()
    })
  }

  initializeMeeting() {
    const {roomId} = this.state

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      this.appID,
      this.serverSecret,
      roomId,
      Date.now().toString(),
      'host',
    )

    const role = ZegoUIKitPrebuilt.Host

    if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
      this.sharedLinks.push({
        name: 'Join as co-host',
        url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomId=${roomId}&role=Cohost`,
      })
    }

    this.sharedLinks.push({
      name: 'Join as audience',
      url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomId=${roomId}&role=Audience`,
    })

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
        sharedLinks: this.sharedLinks,
      })
    }
  }

  render() {
    return (
      <>
        <AdminHeader />
        <div className="host-live-conatiner">
          <h1>Live Streaming</h1>
          <div className="streaming-card" ref={this.containerRef} />
        </div>
      </>
    )
  }
}

export default withRouter(HostPage)
