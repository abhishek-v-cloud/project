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

class WatchTrailer extends Component {
  state = {
    trailerIdList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrailerIdList()
  }

  getTrailerIdList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {trailerId} = params

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = `http://localhost:3001/trailer/${trailerId}`
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
          trailerId: list.trailer_id,
          trailerTitle: list.trailer_title,
          trailerDescribe: list.trailer_describe,
          trailerImageUrl: decodeURIComponent(list.trailer_image),
          trailerVideoUrl: decodeURIComponent(list.trailer_url),
          trailerDescription: list.trailer_description,
        }))

        this.setState({
          trailerIdList: updatedData,
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

  renderTrailerIdListView = () => {
    const {trailerIdList} = this.state
    return (
      <>
        <Header />
        {trailerIdList.map(item => (
          <div key={item.trailerId} className="watch-trailer-player-container">
            <ReactPlayer
              url={item.trailerVideoUrl}
              controls
              width="100%"
              height="800px"
            />
            <h1>{item.trailerTitle}</h1>
            <p>{item.trailerDescription}</p>
            <Link to="/">
              <button type="button">Back</button>
            </Link>
          </div>
        ))}
      </>
    )
  }

  renderTrailerIdFailureView = () => (
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
        return this.renderTrailerIdListView()
      case apiStatusConstants.failure:
        return this.renderTrailerIdFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default withRouter(WatchTrailer)
