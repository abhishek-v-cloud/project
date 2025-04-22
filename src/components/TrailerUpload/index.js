import React, {Component} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

class TrailerUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trailerTitle: '',
      trailerDescribe: '',
      trailerImage: '',
      trailerUrl: '',
      trailerDescription: '', // Added state for trailer_description
      trailers: [],
      editing: false,
      currentTrailerId: null,
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchTrailers()
  }

  // Fetching the trailers from the backend
  fetchTrailers = async () => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/trailer', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Send token here
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trailers')
      }

      const data = await response.json()
      this.setState({trailers: data.reverse()}) // Reversing the order to show the newest trailer first
    } catch (error) {
      console.error('Error fetching trailers:', error)
    }
  }

  // Handling the trailer submit (either add or update)
  handleSubmit = async e => {
    e.preventDefault()

    const {
      trailerTitle,
      trailerDescribe,
      trailerImage,
      trailerUrl,
      trailerDescription,
      editing,
      currentTrailerId,
    } = this.state

    if (
      !trailerTitle ||
      !trailerDescribe ||
      !trailerImage ||
      !trailerUrl ||
      !trailerDescription
    ) {
      alert('All fields are required')
      return
    }

    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    const trailerData = {
      trailerTitle: trailerTitle,
      trailerDescribe: trailerDescribe,
      trailerImage: trailerImage,
      trailerUrl: trailerUrl,
      trailerDescription: trailerDescription, // Added trailer_description field
    }

    if (editing) {
      // Update existing trailer
      try {
        const response = await fetch(
          `http://localhost:3001/trailer/${currentTrailerId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`, // Include the token in the header
            },
            body: JSON.stringify(trailerData),
          },
        )

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Trailer updated successfully')
          this.setState({editing: false})
          this.fetchTrailers() // Re-fetch trailers after update
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error updating trailer')
        }
      } catch (error) {
        console.error('Error updating trailer:', error)
      }
    } else {
      // Insert new trailer
      try {
        const response = await fetch('http://localhost:3001/trailer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`, // Include the token in the header
          },
          body: JSON.stringify(trailerData),
        })

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Trailer uploaded successfully')
          this.fetchTrailers() // Re-fetch trailers after adding new one
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error uploading trailer')
        }
      } catch (error) {
        console.error('Error inserting trailer:', error)
      }
    }

    this.resetForm()
  }

  // Handling the editing of an existing trailer
  handleEdit = trailer => {
    this.setState({
      trailerTitle: trailer.trailer_title,
      trailerDescribe: trailer.trailer_describe,
      trailerImage: trailer.trailer_image,
      trailerUrl: trailer.trailer_url,
      trailerDescription: trailer.trailer_description, // Added trailer_description for editing
      editing: true,
      currentTrailerId: trailer.trailer_id,
    })
  }

  // Handling the deletion of a trailer
  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/trailer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Include the token in the header
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Trailer deleted successfully')
        this.fetchTrailers() // Re-fetch trailers after delete
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting trailer')
      }
    } catch (error) {
      console.error('Error deleting trailer:', error)
    }
  }

  // Handling the search input change
  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  // Filtering the trailers based on the search term
  getFilteredTrailers = () => {
    const {trailers, searchTerm} = this.state
    return trailers.filter(trailer =>
      trailer.trailer_title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Resetting the form after adding or updating a trailer
  resetForm = () => {
    this.setState({
      trailerTitle: '',
      trailerDescribe: '',
      trailerImage: '',
      trailerUrl: '',
      trailerDescription: '', // Resetting trailer_description
    })
  }

  render() {
    const {
      trailerTitle,
      trailerDescribe,
      trailerImage,
      trailerUrl,
      trailerDescription,
      editing,
      searchTerm,
    } = this.state
    const filteredTrailers = this.getFilteredTrailers()

    return (
      <>
        <AdminHeader />
        <div className="trailer-upload-container">
          <h2>Trailer Upload</h2>
          <form onSubmit={this.handleSubmit} className="trailer-upload-form">
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={trailerTitle}
                onChange={e => this.setState({trailerTitle: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={trailerDescribe}
                onChange={e => this.setState({trailerDescribe: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Trailer Description:</label>
              <textarea
                value={trailerDescription}
                onChange={e =>
                  this.setState({trailerDescription: e.target.value})
                }
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={trailerImage}
                onChange={e => this.setState({trailerImage: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Trailer URL:</label>
              <input
                type="text"
                value={trailerUrl}
                onChange={e => this.setState({trailerUrl: e.target.value})}
                required
              />
            </div>
            <button type="submit">
              {editing ? 'Update Trailer' : 'Upload Trailer'}
            </button>
          </form>

          <div className="upload-card-align">
            <h2>Trailers</h2>
            <div className="upload-input-card">
              <input
                type="text"
                placeholder="Search by title"
                className="upload-input-item"
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
            </div>
          </div>

          <ul className="trailer-upload-list">
            {filteredTrailers.length === 0 ? (
              <p>No trailers available.</p>
            ) : (
              filteredTrailers.map(trailer => (
                <li key={trailer.trailer_id} className="trailer-upload-item">
                  <h3>{trailer.trailer_title}</h3>
                  <p>{trailer.trailer_describe}</p>
                  <p>{trailer.trailer_description}</p>{' '}
                  {/* Display trailer description */}
                  <img
                    src={decodeURIComponent(trailer.trailer_image)}
                    alt={trailer.trailer_title}
                    width="100"
                  />
                  <p>{trailer.trailer_url}</p>
                  <button onClick={() => this.handleEdit(trailer)}>Edit</button>
                  <button onClick={() => this.handleDelete(trailer.trailer_id)}>
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

export default TrailerUpload
