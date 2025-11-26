import {Component} from 'react'
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

  fetchVideos = async () => {
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/video', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }

      const data = await response.json()
      this.setState({videos: data.reverse()})
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

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

    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    const videoData = {
      videoTitle,
      videoDescription,
      videoImage,
      videoUrl,
    }

    if (editing) {
      try {
        const response = await fetch(
          `http://localhost:3001/video/${currentVideoId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(videoData),
          },
        )

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Video updated successfully')
          this.setState({editing: false})
          this.fetchVideos()
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error updating video')
        }
      } catch (error) {
        console.error('Error updating video:', error)
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(videoData),
        })

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Video uploaded successfully')
          this.fetchVideos()
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

  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/video/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Video deleted successfully')
        this.fetchVideos()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting video')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  getFilteredVideos = () => {
    const {videos, searchTerm} = this.state
    return videos.filter(video =>
      video.video_title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

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
              <label htmlFor="videoTitle">Title:</label>
              <input
                id="videoTitle"
                type="text"
                value={videoTitle}
                onChange={e => this.setState({videoTitle: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="videoDescription">Description:</label>
              <input
                id="videoDescription"
                type="text"
                value={videoDescription}
                onChange={e =>
                  this.setState({videoDescription: e.target.value})
                }
                required
              />
            </div>
            <div>
              <label htmlFor="videoImage">Image URL:</label>
              <input
                id="videoImage"
                type="text"
                value={videoImage}
                onChange={e => this.setState({videoImage: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="videoUrl">Video URL:</label>
              <input
                id="videoUrl"
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
                  <button type="button" onClick={() => this.handleEdit(video)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => this.handleDelete(video.video_id)}
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

export default VideoUpload
