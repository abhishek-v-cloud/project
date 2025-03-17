import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Event extends Component {
  state = {
    eventLists: [],
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

      const apiUrl = 'http://localhost:3001/event'
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
          eventId: list.event_id,
          eventTitle: list.event_name,
          eventImageUrl: decodeURIComponent(list.event_image),
          eventGame: list.event_game_name,
          eventDate: list.event_date,
          location: list.location,
        }))

        this.setState({
          eventLists: updatedData,
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

  renderEventListView = () => {
    const {eventLists} = this.state
    return (
      <>
        <Header />
        <div className="event-list">
          <h1>Upcoming Events</h1>
          <div className="events">
            {eventLists.map(list => (
              <div key={list.eventId} className="event-card">
                <img src={list.eventImageUrl} alt={list.eventGame} />
                <h2>{list.eventTitle}</h2>
                <p>
                  <strong>Date:</strong> {list.eventDate}
                </p>
                <p>
                  <strong>Location:</strong> {list.location}
                </p>
                <Link to={`/eventform/${list.eventId}`}>
                  <button type="button">Participate Now</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  renderEventFailureView = () => (
    <img src="" alt="Register Prime" className="register-prime-image" />
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
        return this.renderEventListView()
      case apiStatusConstants.failure:
        return this.renderEventFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Event
