// import React, {Component} from 'react'
// import {Redirect} from 'react-router-dom'
// import Cookies from 'js-cookie'

// class AdminHome extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       isAdmin: null, // null means it's still checking for token
//     }
//   }

//   componentDidMount() {
//     const token = Cookies.get('jwt_token')
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split('.')[1])) // Decode JWT token
//         console.log(decodedToken) // Check if the decoded token has the correct role
//         if (decodedToken.role === 'admin') {
//           this.setState({isAdmin: true}) // Set isAdmin to true if the user is admin
//         } else {
//           this.setState({isAdmin: false}) // Set isAdmin to false if the user is not an admin
//         }
//       } catch (error) {
//         console.error('Error decoding token', error)
//         this.setState({isAdmin: false}) // In case of an error, assume not an admin
//       }
//     } else {
//       // No token, user is not logged in
//       this.setState({isAdmin: false})
//     }
//   }

//   handleLogout = () => {
//     // Remove JWT token from cookies
//     Cookies.remove('jwt_token')

//     // Redirect to login page after logout
//     this.setState({isAdmin: false})
//   }

//   render() {
//     const {isAdmin} = this.state

//     // Wait until the token status (isAdmin) is determined before rendering
//     if (isAdmin === null) {
//       return <div>Loading...</div> // You can show a loading spinner or any indicator
//     }

//     if (!isAdmin) {
//       return <Redirect to="/login" /> // Redirect to login if the user is not admin
//     }

//     return (
//       <div>
//         <h1>Welcome to Admin Home</h1>
//         {/* Admin-specific content */}
//         <button onClick={this.handleLogout}>Logout</button>
//       </div>
//     )
//   }
// }

// export default AdminHome
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class AdminHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAdmin: null, // null means it's still checking for token
      file: null, // File to be uploaded
      gameName: '', // Game name
      gameDescription: '', // Game description
      gameLogoUrl: '', // Game logo URL
      loading: false, // For loading state
    }
  }

  // Check the token and user role (admin check)
  componentDidMount() {
    const token = Cookies.get('jwt_token')
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])) // Decode JWT token
        if (decodedToken.role === 'admin') {
          this.setState({isAdmin: true}) // Set isAdmin to true if the user is admin
        } else {
          this.setState({isAdmin: false}) // Set isAdmin to false if the user is not an admin
        }
      } catch (error) {
        console.error('Error decoding token', error)
        this.setState({isAdmin: false}) // Assume not admin if error
      }
    } else {
      this.setState({isAdmin: false}) // No token, not logged in
    }
  }

  // Handle file selection
  handleFileChange = e => {
    this.setState({file: e.target.files[0]})
  }

  // Handle form input changes (game name, description, and logo URL)
  handleInputChange = e => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  // Handle file upload
  handleUpload = async () => {
    const {file, gameName, gameDescription, gameLogoUrl} = this.state

    if (!file || !gameName || !gameDescription || !gameLogoUrl) {
      alert(
        'Please provide game name, description, logo URL, and select a file',
      )
      return
    }

    const token = Cookies.get('jwt_token') // Get JWT token from cookies
    const formData = new FormData()
    formData.append('file', file)
    formData.append('game_name', gameName)
    formData.append('game_description', gameDescription)
    formData.append('game_logo_url', gameLogoUrl)

    try {
      this.setState({loading: true})

      // Send POST request to upload the file
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Add JWT token to Authorization header
        },
        body: formData, // Attach the file and additional form data
      })

      if (response.ok) {
        alert('File uploaded and game details saved successfully')
        this.setState({
          file: null,
          gameName: '',
          gameDescription: '',
          gameLogoUrl: '',
        }) // Reset form fields
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error uploading file. Please try again.')
    } finally {
      this.setState({loading: false})
    }
  }

  // Handle logout action
  handleLogout = () => {
    // Remove JWT token from cookies
    Cookies.remove('jwt_token')
    // Redirect to login page after logout
    this.setState({isAdmin: false})
  }

  render() {
    const {isAdmin, loading, gameName, gameDescription, gameLogoUrl} =
      this.state

    // Wait until the token status (isAdmin) is determined before rendering
    if (isAdmin === null) {
      return <div>Loading...</div>
    }

    if (!isAdmin) {
      return <Redirect to="/login" /> // Redirect to login if the user is not admin
    }

    return (
      <div>
        <h1>Welcome to Admin Home</h1>

        {/* Upload Form */}
        <div>
          <input
            type="text"
            name="gameName"
            value={gameName}
            onChange={this.handleInputChange}
            placeholder="Game Name"
          />
          <input
            type="text"
            name="gameDescription"
            value={gameDescription}
            onChange={this.handleInputChange}
            placeholder="Game Description"
          />
          <input
            type="text"
            name="gameLogoUrl"
            value={gameLogoUrl}
            onChange={this.handleInputChange}
            placeholder="Game Logo URL"
          />
          <input type="file" onChange={this.handleFileChange} />
          <button onClick={this.handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Logout Button */}
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    )
  }
}

export default AdminHome
