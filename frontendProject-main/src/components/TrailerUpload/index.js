import {Component} from 'react'
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
      trailerDescription: '',
      trailers: [],
      editing: false,
      currentTrailerId: null,
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchTrailers()
  }

  fetchTrailers = async () => {
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/trailer', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trailers')
      }

      const data = await response.json()
      this.setState({trailers: data.reverse()})
    } catch (error) {
      console.error('Error fetching trailers:', error)
    }
  }

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

    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    const trailerData = {
      trailerTitle,
      trailerDescribe,
      trailerImage,
      trailerUrl,
      trailerDescription,
    }

    if (editing) {
      try {
        const response = await fetch(
          `http://localhost:3001/trailer/${currentTrailerId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(trailerData),
          },
        )

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Trailer updated successfully')
          this.setState({editing: false})
          this.fetchTrailers()
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error updating trailer')
        }
      } catch (error) {
        console.error('Error updating trailer:', error)
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/trailer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(trailerData),
        })

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Trailer uploaded successfully')
          this.fetchTrailers()
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

  handleEdit = trailer => {
    this.setState({
      trailerTitle: trailer.trailer_title,
      trailerDescribe: trailer.trailer_describe,
      trailerImage: trailer.trailer_image,
      trailerUrl: trailer.trailer_url,
      trailerDescription: trailer.trailer_description,
      editing: true,
      currentTrailerId: trailer.trailer_id,
    })
  }

  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/trailer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Trailer deleted successfully')
        this.fetchTrailers()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting trailer')
      }
    } catch (error) {
      console.error('Error deleting trailer:', error)
    }
  }

  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  getFilteredTrailers = () => {
    const {trailers, searchTerm} = this.state
    return trailers.filter(trailer =>
      trailer.trailer_title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  resetForm = () => {
    this.setState({
      trailerTitle: '',
      trailerDescribe: '',
      trailerImage: '',
      trailerUrl: '',
      trailerDescription: '',
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
              <label htmlFor="trailerTitle">Title:</label>
              <input
                id="trailerTitle"
                type="text"
                value={trailerTitle}
                onChange={e => this.setState({trailerTitle: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="trailerDescribe">Description:</label>
              <input
                id="trailerDescribe"
                type="text"
                value={trailerDescribe}
                onChange={e => this.setState({trailerDescribe: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="trailerDescription">Trailer Description:</label>
              <textarea
                id="trailerDescription"
                value={trailerDescription}
                onChange={e =>
                  this.setState({trailerDescription: e.target.value})
                }
                required
              />
            </div>
            <div>
              <label htmlFor="trailerImage">Image URL:</label>
              <input
                id="trailerImage"
                type="text"
                value={trailerImage}
                onChange={e => this.setState({trailerImage: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="trailerUrl">Trailer URL:</label>
              <input
                id="trailerUrl"
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
                  <button
                    type="button"
                    onClick={() => this.handleEdit(trailer)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => this.handleDelete(trailer.trailer_id)}
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

export default TrailerUpload
