import {Component} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

class EventManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventName: '',
      eventImage: '',
      eventGameName: '',
      eventDate: '',
      eventLastDate: '',
      location: '',
      events: [],
      editing: false,
      currentEventId: null,
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchEvents()
  }

  fetchEvents = async () => {
    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) return

    try {
      const response = await fetch('http://localhost:3001/event', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      this.setState({events: data.reverse()})
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  handleSubmit = async e => {
    e.preventDefault()
    const {
      eventName,
      eventImage,
      eventGameName,
      eventDate,
      eventLastDate,
      location,
      editing,
      currentEventId,
    } = this.state

    if (
      !eventName ||
      !eventImage ||
      !eventGameName ||
      !eventDate ||
      !location
    ) {
      alert('All fields except Last Date are required')
      return
    }

    const jwtToken = Cookies.get('jwt_token')
    const eventData = {
      eventName,
      eventImage,
      eventGameName,
      eventDate,
      eventLastDate,
      location,
    }

    try {
      const endpoint = editing
        ? `http://localhost:3001/event/${currentEventId}/`
        : 'http://localhost:3001/event'
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()
      alert(data.message)
      this.fetchEvents()
      this.resetForm()
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  handleEdit = event => {
    this.setState({
      eventName: event.event_name,
      eventImage: decodeURIComponent(event.event_image),
      eventGameName: event.event_game_name,
      eventDate: event.event_date,
      eventLastDate: event.event_last_date,
      location: event.location,
      editing: true,
      currentEventId: event.event_id,
    })
  }

  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token')
    try {
      const response = await fetch(`http://localhost:3001/event/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      const data = await response.json()
      alert(data.message)
      this.fetchEvents()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  getFilteredEvents = () => {
    const {events, searchTerm} = this.state
    return events.filter(event =>
      event.event_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  resetForm = () => {
    this.setState({
      eventName: '',
      eventImage: '',
      eventGameName: '',
      eventDate: '',
      eventLastDate: '',
      location: '',
      editing: false,
      currentEventId: null,
    })
  }

  render() {
    const {
      eventName,
      eventImage,
      eventGameName,
      eventDate,
      eventLastDate,
      location,
      editing,
      searchTerm,
    } = this.state
    const filteredEvents = this.getFilteredEvents()

    return (
      <>
        <AdminHeader />
        <div className="eventmanage-upload-container">
          <h2>Event Manager</h2>
          <form
            onSubmit={this.handleSubmit}
            className="eventmanage-upload-form"
          >
            <div>
              <label htmlFor="eventName">Event Name:</label>
              <input
                id="eventName"
                type="text"
                value={eventName}
                onChange={e => this.setState({eventName: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="eventImage">Event Image URL:</label>
              <input
                id="eventImage"
                type="text"
                value={eventImage}
                onChange={e => this.setState({eventImage: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="eventGameName">Game Name:</label>
              <input
                id="eventGameName"
                type="text"
                value={eventGameName}
                onChange={e => this.setState({eventGameName: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="eventDate">Event Date:</label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={e => this.setState({eventDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="eventLastDate">Last Date (optional):</label>
              <input
                id="eventLastDate"
                type="date"
                value={eventLastDate}
                onChange={e => this.setState({eventLastDate: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={e => this.setState({location: e.target.value})}
                required
              />
            </div>
            <button type="submit">
              {editing ? 'Update Event' : 'Add Event'}
            </button>
          </form>

          <div className="upload-card-align">
            <h2>Events</h2>
            <div className="upload-input-card">
              <input
                type="text"
                placeholder="Search by name"
                className="upload-input-item"
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
            </div>
          </div>

          <ul className="eventmanage-upload-list">
            {filteredEvents.length === 0 ? (
              <p>No events available.</p>
            ) : (
              filteredEvents.map(event => (
                <li key={event.event_id} className="eventmanage-upload-item">
                  <h3>{event.event_name}</h3>
                  <p>{event.event_game_name}</p>
                  <img
                    src={decodeURIComponent(event.event_image)}
                    alt={event.event_name}
                    width="100"
                  />
                  <p>Date: {event.event_date}</p>
                  <p>Last Date: {event.event_last_date}</p>
                  <p>Location: {event.location}</p>
                  <button type="button" onClick={() => this.handleEdit(event)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => this.handleDelete(event.event_id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    )
  }
}

export default EventManager
