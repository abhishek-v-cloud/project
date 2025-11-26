import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Carousel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trailerLists: [],
      apiStatus: apiStatusConstants.initial,
    }
    this.slideRef = React.createRef()
  }

  componentDidMount() {
    this.getTrailerList()
    this.interval = setInterval(() => {
      this.handleClickNext()
    }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  getTrailerList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = 'http://localhost:3001/trailer'
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
          trailerId: list.trailer_id,
          trailerTitle: list.trailer_title,
          trailerDescribe: list.trailer_describe,
          trailerImageUrl: decodeURIComponent(list.trailer_image),
          trailerVideoUrl: decodeURIComponent(list.trailer_url),
          trailerDescription: list.trailer_description,
        }))

        this.setState({
          trailerLists: updatedData,
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

  handleClickNext = () => {
    const items = this.slideRef.current.querySelectorAll('.item')
    this.slideRef.current.appendChild(items[0])
  }

  handleClickPrev = () => {
    const items = this.slideRef.current.querySelectorAll('.item')
    this.slideRef.current.prepend(items[items.length - 1])
  }

  renderTrailerListView = () => {
    const {trailerLists} = this.state
    return (
      <>
        <h1 className="nickname trailer-main-text">Watch New Trailers</h1>
        <div className="container">
          <div id="slide" ref={this.slideRef}>
            {trailerLists.map(item => (
              <div
                key={item.trailerId}
                className="item"
                style={{
                  backgroundImage: `url(${item.trailerImageUrl})`,
                }}
              >
                <div className="content">
                  <div className="name">{item.trailerTitle}</div>
                  <div className="des">{item.trailerDescribe}</div>

                  <Link to={`/trailer/${item.trailerId}`}>
                    <button type="button">Watch Now</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="buttons">
            <button type="button" id="prev" onClick={this.handleClickPrev}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button type="button" id="next" onClick={this.handleClickNext}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        </div>
      </>
    )
  }

  renderTrailerFailureView = () => (
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
        return this.renderTrailerListView()
      case apiStatusConstants.failure:
        return this.renderTrailerFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Carousel
