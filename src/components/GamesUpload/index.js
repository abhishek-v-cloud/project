import React, {Component} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

class GamesUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameName: '',
      gameDescription: '',
      gameLogoUrl: '',
      gameFile: null,
      games: [],
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchGames()
  }

  // Fetching the games from the backend
  fetchGames = async () => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/games', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Send token here
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch games')
      }

      const data = await response.json()
      this.setState({games: data.reverse()}) // Reversing the order to show the newest game first
    } catch (error) {
      console.error('Error fetching games:', error)
    }
  }

  // Handling the game submit (only for adding new games)
  handleSubmit = async e => {
    e.preventDefault()

    const {gameName, gameDescription, gameLogoUrl, gameFile} = this.state

    if (!gameName || !gameDescription || !gameLogoUrl || !gameFile) {
      alert('All fields are required')
      return
    }

    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    const formData = new FormData()
    formData.append('game_name', gameName)
    formData.append('game_description', gameDescription)
    formData.append('game_logo_url', gameLogoUrl)
    formData.append('file', gameFile)

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Game uploaded successfully')
        this.fetchGames() // Re-fetch games after adding new one
      } else {
        const errorData = await response.json()
        console.error('Error Response:', errorData)
        alert(errorData.message || 'Error uploading game')
      }
    } catch (error) {
      console.error('Error inserting game:', error)
    }

    this.resetForm()
  }

  // Handling the deletion of a game
  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/games/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Include the token in the header
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Game deleted successfully')
        this.fetchGames() // Re-fetch games after delete
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting game')
      }
    } catch (error) {
      console.error('Error deleting game:', error)
    }
  }

  // Handling the search input change
  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  // Filtering the games based on the search term
  getFilteredGames = () => {
    const {games, searchTerm} = this.state
    return games.filter(game =>
      game.game_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Resetting the form after adding a game
  resetForm = () => {
    this.setState({
      gameName: '',
      gameDescription: '',
      gameLogoUrl: '',
      gameFile: null,
    })
  }

  render() {
    const {gameName, gameDescription, gameLogoUrl, searchTerm} = this.state
    const filteredGames = this.getFilteredGames()

    return (
      <>
        <AdminHeader />
        <div className="games-upload-container">
          <h2>Game Upload</h2>
          <form
            onSubmit={this.handleSubmit}
            className="games-upload-form"
            encType="multipart/form-data"
          >
            <div>
              <label>Game Name:</label>
              <input
                type="text"
                value={gameName}
                onChange={e => this.setState({gameName: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Game Description:</label>
              <input
                type="text"
                value={gameDescription}
                onChange={e => this.setState({gameDescription: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Game Logo URL:</label>
              <input
                type="text"
                value={gameLogoUrl}
                onChange={e => this.setState({gameLogoUrl: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Game File:</label>
              <input
                type="file"
                onChange={e => this.setState({gameFile: e.target.files[0]})}
                required
              />
            </div>
            <button type="submit">Upload Game</button>
          </form>

          {/* Search Bar */}
          <div className="upload-card-align">
            <h2>Games</h2>
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

          {/* Displaying Games in Table-like Layout */}
          <ul className="games-upload-list">
            {filteredGames.length === 0 ? (
              <p>No games available.</p>
            ) : (
              filteredGames.map(game => (
                <li key={game.id} className="games-upload-item">
                  <div className="games-upload-logo-column">
                    <img
                      src={decodeURIComponent(game.game_logo_url)}
                      alt={game.game_name}
                      width="100"
                    />
                  </div>
                  <div className="game-title-column">
                    <h3>{game.game_name}</h3>
                  </div>
                  <div className="game-description-column">
                    <p>{game.game_description}</p>
                  </div>
                  <div className="game-action-column">
                    <button onClick={() => this.handleDelete(game.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    )
  }
}

export default GamesUpload
