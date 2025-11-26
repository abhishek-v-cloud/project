import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

class EventFormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullname: '',
      email: '',
      phone: '',
      showModal: false,
      loading: false,
      errorMessage: '',
      eventIdList: [],
    }
  }

  componentDidMount() {
    this.getEventIdData()
  }

  getEventIdData = async () => {
    const {match} = this.props
    const {params} = match
    const {eventId} = params

    this.setState({loading: true})

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = `http://localhost:3001/event/${eventId}`
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
          eventImageUrl: list.event_image
            ? decodeURIComponent(list.event_image)
            : '',
          eventGame: list.event_game_name,
          eventDate: list.event_date,
          location: list.location,
        }))

        this.setState({eventIdList: updatedData})
      } else {
        throw new Error('Something went wrong while fetching events.')
      }
    } catch (error) {
      console.error('Error fetching event list:', error)
      this.setState({errorMessage: error.message})
    } finally {
      this.setState({loading: false})
    }
  }

  validateFullName = fullname => /^[A-Za-z ]+$/.test(fullname)

  validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())

  validatePhone = phone => /^\d{10}$/.test(phone)

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({loading: true, errorMessage: ''})

    const {eventIdList, fullname, email, phone} = this.state

    if (eventIdList.length === 0) {
      this.setState({
        errorMessage: 'Event data not loaded. Please try again.',
        loading: false,
      })
      return
    }

    const {eventId, eventTitle, eventGame, location} = eventIdList[0]

    if (!fullname || !email || !phone) {
      this.setState({errorMessage: 'All fields are required.', loading: false})
      return
    }

    if (!this.validateFullName(fullname)) {
      this.setState({
        errorMessage: 'Full Name must contain only alphabets.',
        loading: false,
      })
      return
    }

    if (!this.validateEmail(email)) {
      this.setState({errorMessage: 'Invalid email format.', loading: false})
      return
    }

    if (!this.validatePhone(phone)) {
      this.setState({errorMessage: 'Invalid phone number.', loading: false})
      return
    }

    const formData = {
      eventId,
      eventTitle,
      eventGame,
      location,
      fullname,
      email,
      phone,
    }

    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) {
      throw new Error('Token not found. Please log in.')
    }

    const url = 'http://localhost:3001/event/register'
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }

    try {
      const response = await fetch(url, options)

      if (response.ok) {
        this.setState({
          showModal: true,
          fullname: '',
          email: '',
          phone: '',
        })
      } else if (response.status === 400) {
        const errorMessage = await response.text()
        this.setState({errorMessage})
      } else {
        const errorData = await response.json()
        this.setState({errorMessage: errorData.message})
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      this.setState({
        errorMessage: error.message,
      })
    } finally {
      this.setState({loading: false})
    }
  }

  handleCloseModal = () => {
    const {history} = this.props
    this.setState({showModal: false})
    history.push('/event')
  }

  render() {
    const {
      eventIdList,
      fullname,
      email,
      phone,
      showModal,
      loading,
      errorMessage,
    } = this.state

    const eventTitle =
      eventIdList.length > 0 ? eventIdList[0].eventTitle : 'Loading...'

    return (
      <>
        <Header />
        <div className="blurred-container">
          <div className="event-form-container">
            <h2>Register for {eventTitle}</h2>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={fullname}
                onChange={this.handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={phone}
                onChange={this.handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Thank You!</h2>
                  <p>Thank you for participating in {eventTitle}!</p>
                  <button
                    type="button"
                    className="modal-close-button"
                    onClick={this.handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(EventFormPage)
