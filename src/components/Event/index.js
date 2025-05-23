import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
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
    searchQuery: '', // State for search input
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

        const updatedData = fetchedData
          .map(list => ({
            eventId: list.event_id,
            eventTitle: list.event_name,
            eventImageUrl: decodeURIComponent(list.event_image),
            eventGame: list.event_game_name,
            eventDate: this.formatDate(list.event_date), // Format event date
            eventLastDate: this.formatDate(list.event_last_date), // Format last date
            location: list.location,
            eventLastDateTime: list.event_last_date, // Use the exact date-time
          }))
          .filter(event => {
            // Get current date-time
            const currentDate = new Date()

            // Convert event last date to Date object
            const eventLastDate = new Date(event.eventLastDateTime)

            // Only show events if the eventLastDate is after the current date and time
            return eventLastDate > currentDate
          })
          .map(event => ({
            ...event,
            remainingTime: this.calculateRemainingTime(event.eventLastDateTime),
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

  // Helper function to calculate remaining time
  calculateRemainingTime = eventLastDate => {
    const currentDate = new Date()
    const lastDate = new Date(eventLastDate)

    // Calculate the difference in milliseconds
    const timeDifference = lastDate - currentDate
    if (timeDifference <= 0) {
      return 'Event has ended'
    }

    // If 1 day or less remaining, calculate hours, minutes, and seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    )
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

    if (days === 0) {
      // If no days left, show hours, minutes, and seconds
      return `${hours} hours ${minutes} minutes ${seconds} seconds remaining`
    } else {
      // Otherwise, show days and hours
      return `${days} days ${hours} hours remaining`
    }
  }

  // Helper function to format date to "2 June 2025"
  formatDate = date => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'}
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options)

    // Custom formatting to match "2 June 2025"
    const [day, month, year] = formattedDate.split(' ')

    // We want the date as "2 June 2025"
    return `${parseInt(day, 10)} ${month} ${year}`
  }

  // Handler for search input
  handleSearchChange = event => {
    this.setState({searchQuery: event.target.value})
  }

  renderEventListView = () => {
    const {eventLists, searchQuery} = this.state

    // Filter events by search query (event title)
    const filteredEventLists = eventLists.filter(event =>
      event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
      <>
        <Header />
        <div className="event-container">
          <div className="event-list-align ">
            <h1>Upcoming Events</h1>
            <div className="event-search-input-container">
              <input
                className="event-search-input"
                type="text"
                placeholder="Search for a event..."
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
              <BsSearch className="event-search-icon" />
            </div>
          </div>

          <div className="events">
            {filteredEventLists.length > 0 ? (
              filteredEventLists.map(list => (
                <div key={list.eventId} className="event-card">
                  <img
                    className="event-card-logo-img"
                    src={list.eventImageUrl}
                    alt={list.eventGame}
                  />
                  <h2>{list.eventTitle}</h2>
                  <p>
                    <strong>Date:</strong> {list.eventDate}
                  </p>
                  <p>
                    <strong>Location:</strong> {list.location}
                  </p>
                  <p>
                    <strong>Last Date:</strong> {list.eventLastDate}
                  </p>
                  <p>
                    <strong>Time Left:</strong> {list.remainingTime}
                  </p>
                  <Link to={`/eventform/${list.eventId}`}>
                    <button type="button">Participate Now</button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="empty-list-msg">No Upcoming Events</p>
            )}
          </div>
        </div>
      </>
    )
  }

  renderEventFailureView = () => (
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
