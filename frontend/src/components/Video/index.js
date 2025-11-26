import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Video extends Component {
  state = {
    searchTerm: '',
    videoLists: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getEventList()
  }

  getEventList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = 'http://localhost:3001/video'
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

        const updatedData = fetchedData.map(list => ({
          videoId: list.video_id,
          videoTitle: list.video_title,
          videoImageUrl: decodeURIComponent(list.video_image),
          videoDescription: list.video_description,
        }))

        this.setState({
          videoLists: updatedData,
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

  renderVideoListView = () => {
    const {videoLists, searchTerm} = this.state

    const filteredVideos = videoLists.filter(video =>
      video.videoTitle.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
      <>
        <Header />
        <div className="video-container">
          <div className="join-stream-container">
            <h1>Watch Gaming Live Stream</h1>
            <Link to="/livegame/audience">
              <div className="clickable-container">
                <p className="join-text">Click here to join the live stream</p>
              </div>
            </Link>
          </div>
          <div className="video-list-align">
            <h1> Gaming Videos </h1>
            <div className="video-search-input-container">
              <input
                className="video-search-input"
                type="text"
                placeholder="Search for a video..."
                value={searchTerm}
                onChange={e => this.setState({searchTerm: e.target.value})}
              />
              <BsSearch className="video-search-icon" />
            </div>
          </div>
          <div className="videos">
            {filteredVideos.length > 0 ? (
              filteredVideos.map(item => (
                <div key={item.videoId} className="video-card">
                  <img
                    className="video-card-img-logo "
                    src={item.videoImageUrl}
                    alt={item.videoTitle}
                  />
                  <h2>{item.videoTitle}</h2>
                  <p>
                    <strong>Description:</strong> {item.videoDescription}
                  </p>
                  <Link to={`/video/${item.videoId}`}>
                    <button type="button">Watch Now</button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="empty-list-msg">No Videos To Watch</p>
            )}
          </div>
        </div>
      </>
    )
  }

  renderVideoFailureView = () => (
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
        return this.renderVideoListView()
      case apiStatusConstants.failure:
        return this.renderVideoFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Video
