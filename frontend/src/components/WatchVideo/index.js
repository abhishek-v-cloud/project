import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class WatchVideo extends Component {
  state = {
    videoIdList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVideoIdList()
  }

  getVideoIdList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {videoId} = params

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = `http://localhost:3001/video/${videoId}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const fetchedData = await response.json()
        console.log(fetchedData)

        const updatedData = fetchedData.map(list => ({
          videoId: list.video_id,
          videoTitle: list.video_title,
          videoUrl: decodeURIComponent(list.video_url),
          videoDescription: list.video_description,
        }))

        this.setState({
          videoIdList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 401) {
        const {history} = this.props
        Cookies.remove('jwt_token')
        history.push('/login')
      } else {
        throw new Error('Something went wrong while fetching events.')
      }
    } catch (error) {
      console.error('Error fetching event list:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderVideoIdListView = () => {
    const {videoIdList} = this.state
    return (
      <>
        <Header />
        {videoIdList.map(item => (
          <div key={item.videoId} className="watch-video-player-container">
            <ReactPlayer
              url={item.videoUrl}
              controls
              width="100%"
              height="800px"
            />
            <h1>{item.videoTitle}</h1>
            <p>{item.videoDescription}</p>
            <Link to="/video">
              <button type="button">Back</button>
            </Link>
          </div>
        ))}
      </>
    )
  }

  renderVideoIdFailureView = () => (
    <img
      src="https://cdni.iconscout.com/illustration/premium/thumb/man-thinking-about-something-went-wrong-error-illustration-download-in-svg-png-gif-file-formats--result-page-message-empty-states-pack-design-development-illustrations-3780060.png"
      alt="something went wrong"
      className="register-prime-img"
    />
  )

  renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideoIdListView()
      case apiStatusConstants.failure:
        return this.renderVideoIdFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default withRouter(WatchVideo)
