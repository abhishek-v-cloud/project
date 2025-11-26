import {Component} from 'react'
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

class Downloads extends Component {
  state = {
    gameDownloadLists: [],
    apiStatus: apiStatusConstants.initial,
    searchQuery: '',
  }

  componentDidMount() {
    this.getGamesDownloadList()
  }

  getGamesDownloadList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = 'http://localhost:3001/games'
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
          gameId: list.id,
          gameTitle: list.game_name,
          gameDescription: list.game_description,
          gameLogoImage: list.game_logo_url,
        }))

        this.setState({
          gameDownloadLists: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 401) {
        const {history} = this.props
        Cookies.remove('jwt_token')
        history.push('/login')
      } else {
        throw new Error('Something went wrong while fetching games.')
      }
    } catch (error) {
      console.error('Error fetching game list:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickDownload = async gameId => {
    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = `http://localhost:3001/download/${gameId}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const blob = await response.blob()
        const contentDisposition = response.headers.get('Content-Disposition')
        let fileName = `game_${gameId}.exe`

        if (contentDisposition && contentDisposition.includes('attachment')) {
          const matches = /filename="(.+)"/.exec(contentDisposition)
          const [, extractedFileName] = matches || []
          if (extractedFileName) {
            fileName = extractedFileName
          }
        }

        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        link.click()
      } else {
        throw new Error('Failed to download game file.')
      }
    } catch (error) {
      console.error('Error during download:', error)
      alert('Error downloading the game. Please try again.')
    }
  }

  handleSearchChange = event => {
    this.setState({searchQuery: event.target.value})
  }

  getFilteredGameList = () => {
    const {gameDownloadLists, searchQuery} = this.state
    return gameDownloadLists.filter(game =>
      game.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  renderGameDownloadListView = () => {
    const filteredGameList = this.getFilteredGameList()
    const {searchQuery} = this.state

    return (
      <>
        <Header />
        <div className="game-download-container">
          {/* Search Input */}

          <div className="game-download-align">
            <h1>Download Games</h1>
            <div className="game-download-search-input-container">
              <input
                type="text"
                className="game-download-search-input"
                placeholder="Search by game..."
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
              <BsSearch className="event-search-icon" />
            </div>
          </div>
          <div className="game-downloads">
            {filteredGameList.length > 0 ? (
              filteredGameList.map(list => (
                <div key={list.gameId} className="event-card">
                  <img
                    className="game-download-logo-img"
                    src={list.gameLogoImage}
                    alt={list.gameTitle}
                  />
                  <h2>{list.gameTitle}</h2>
                  <p>{list.gameDescription}</p>
                  <button
                    type="button"
                    onClick={() => this.onClickDownload(list.gameId)} // Pass the gameId here
                  >
                    Download
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-list-msg">No Games For Download</p>
            )}
          </div>
        </div>
      </>
    )
  }

  renderGameDownloadFailureView = () => (
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
        return this.renderGameDownloadListView()
      case apiStatusConstants.failure:
        return this.renderGameDownloadFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Downloads
