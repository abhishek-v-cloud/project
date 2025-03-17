import {Component} from 'react'
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
          gameTitle: list.game_name, // Ensure the field matches your API response
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

  // On Click handler for download
  onClickDownload = async gameId => {
    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('Token not found. Please log in.')
      }

      const apiUrl = `http://localhost:3001/download/${gameId}` // API endpoint to download file
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
        let fileName = `game_${gameId}.exe` // Default filename with .exe extension

        // Check if the response contains a filename in the Content-Disposition header
        // if (contentDisposition && contentDisposition.includes('attachment')) {
        //   const matches = /filename="(.+)"/.exec(contentDisposition)
        //   if (matches && matches[1]) {
        //     fileName = matches[1] // Use the filename provided by the server
        //   }
        // }

        if (contentDisposition && contentDisposition.includes('attachment')) {
          const matches = /filename="(.+)"/.exec(contentDisposition)
          const [, extractedFileName] = matches || [] // Destructure the array, extracting the filename
          if (extractedFileName) {
            fileName = extractedFileName // Use the filename provided by the server
          }
        }

        // Create a link and trigger the download
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName // Ensure the downloaded file name ends with .exe
        link.click() // Trigger the download
      } else {
        throw new Error('Failed to download game file.')
      }
    } catch (error) {
      console.error('Error during download:', error)
      alert('Error downloading the game. Please try again.')
    }
  }

  renderGameDownloadListView = () => {
    const {gameDownloadLists} = this.state
    return (
      <>
        <Header />
        <div className="event-list">
          <h1>Download Games</h1>
          <div className="events">
            {gameDownloadLists.map(list => (
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
            ))}
          </div>
        </div>
      </>
    )
  }

  renderGameDownloadFailureView = () => (
    <div>
      <h2>Failed to fetch games. Please try again later.</h2>
    </div>
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
