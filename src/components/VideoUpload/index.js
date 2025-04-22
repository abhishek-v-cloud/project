import React, {Component} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

class VideoUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoTitle: '',
      videoDescription: '',
      videoImage: '',
      videoUrl: '',
      videos: [],
      editing: false,
      currentVideoId: null,
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchVideos()
  }

  // Fetching the videos from the backend
  fetchVideos = async () => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/video', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Send token here
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }

      const data = await response.json()
      this.setState({videos: data.reverse()}) // Reversing the order to show the newest video first
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  // Handling the video submit (either add or update)
  handleSubmit = async e => {
    e.preventDefault()

    const {
      videoTitle,
      videoDescription,
      videoImage,
      videoUrl,
      editing,
      currentVideoId,
    } = this.state

    if (!videoTitle || !videoDescription || !videoImage || !videoUrl) {
      alert('All fields are required')
      return
    }

    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    const videoData = {
      videoTitle: videoTitle,
      videoDescription: videoDescription,
      videoImage: videoImage,
      videoUrl: videoUrl,
    }

    if (editing) {
      // Update existing video
      try {
        const response = await fetch(
          `http://localhost:3001/video/${currentVideoId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`, // Include the token in the header
            },
            body: JSON.stringify(videoData),
          },
        )

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Video updated successfully')
          this.setState({editing: false})
          this.fetchVideos() // Re-fetch videos after update
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error updating video')
        }
      } catch (error) {
        console.error('Error updating video:', error)
      }
    } else {
      // Insert new video
      try {
        const response = await fetch('http://localhost:3001/video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`, // Include the token in the header
          },
          body: JSON.stringify(videoData),
        })

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Video uploaded successfully')
          this.fetchVideos() // Re-fetch videos after adding new one
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error uploading video')
        }
      } catch (error) {
        console.error('Error inserting video:', error)
      }
    }

    this.resetForm()
  }

  // Handling the editing of an existing video
  handleEdit = video => {
    this.setState({
      videoTitle: video.video_title,
      videoDescription: video.video_description,
      videoImage: video.video_image,
      videoUrl: video.video_url,
      editing: true,
      currentVideoId: video.video_id,
    })
  }

  // Handling the deletion of a video
  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/video/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Include the token in the header
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Video deleted successfully')
        this.fetchVideos() // Re-fetch videos after delete
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting video')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  // Handling the search input change
  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  // Filtering the videos based on the search term
  getFilteredVideos = () => {
    const {videos, searchTerm} = this.state
    return videos.filter(video =>
      video.video_title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Resetting the form after adding or updating a video
  resetForm = () => {
    this.setState({
      videoTitle: '',
      videoDescription: '',
      videoImage: '',
      videoUrl: '',
    })
  }

  render() {
    const {
      videoTitle,
      videoDescription,
      videoImage,
      videoUrl,
      editing,
      searchTerm,
    } = this.state
    const filteredVideos = this.getFilteredVideos()

    return (
      <>
        <AdminHeader />
        <div className="video-upload-container">
          <h2>Video Upload</h2>
          <form onSubmit={this.handleSubmit} className="video-upload-form">
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={videoTitle}
                onChange={e => this.setState({videoTitle: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={videoDescription}
                onChange={e =>
                  this.setState({videoDescription: e.target.value})
                }
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={videoImage}
                onChange={e => this.setState({videoImage: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Video URL:</label>
              <input
                type="text"
                value={videoUrl}
                onChange={e => this.setState({videoUrl: e.target.value})}
                required
              />
            </div>
            <button type="submit">
              {editing ? 'Update Video' : 'Upload Video'}
            </button>
          </form>

          <div className="upload-card-align">
            <h2>Videos</h2>
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
          <ul className="video-upload-list">
            {filteredVideos.length === 0 ? (
              <p>No videos available.</p>
            ) : (
              filteredVideos.map(video => (
                <li key={video.video_id} className="video-upload-item">
                  <h3>{video.video_title}</h3>
                  <p>{video.video_description}</p>
                  <img
                    src={decodeURIComponent(video.video_image)}
                    alt={video.video_title}
                    width="100"
                  />
                  <p>{video.video_url}</p>
                  <button onClick={() => this.handleEdit(video)}>Edit</button>
                  <button onClick={() => this.handleDelete(video.video_id)}>
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

export default VideoUpload
