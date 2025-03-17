// import {Component} from 'react'
// import Cookies from 'js-cookie'
// import {Link, Redirect} from 'react-router-dom'
// // import {Link, withRouter} from 'react-router-dom'

// import './index.css'

// class LoginForm extends Component {
//   state = {
//     username: '',
//     password: '',
//     showSubmitError: false,
//     errorMsg: '',
//   }

//   onChangeUsername = event => {
//     this.setState({username: event.target.value})
//   }

//   onChangePassword = event => {
//     this.setState({password: event.target.value})
//   }

//   onSubmitSuccess = jwtToken => {
//     const {history} = this.props

//     Cookies.set('jwt_token', jwtToken, {
//       expires: 30,
//       path: '/',
//     })
//     history.replace('/')
//   }

//   onSubmitFailure = errorMsg => {
//     this.setState({showSubmitError: true, errorMsg})
//   }

//   submitForm = async event => {
//     event.preventDefault()
//     const {username, password} = this.state
//     const userDetails = {username, password}
//     const url = 'http://localhost:3001/login'
//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userDetails),
//     }

//     try {
//       const response = await fetch(url, options)
//       const data = await response.json()
//       if (response.ok) {
//         this.onSubmitSuccess(data.jwt_token)
//       } else {
//         this.onSubmitFailure(data.message)
//       }
//     } catch (error) {
//       console.error('Fetch error:', error)
//       this.onSubmitFailure('Network error, please try again later.')
//     }
//   }

//   renderPasswordField = () => {
//     const {password} = this.state
//     return (
//       <>
//         <label className="input-label" htmlFor="password">
//           PASSWORD
//         </label>
//         <input
//           type="password"
//           id="password"
//           className="password-input-field"
//           value={password}
//           onChange={this.onChangePassword}
//           placeholder="Password"
//         />
//       </>
//     )
//   }

//   renderUsernameField = () => {
//     const {username} = this.state
//     return (
//       <>
//         <label className="input-label" htmlFor="username">
//           USERNAME
//         </label>
//         <input
//           type="text"
//           id="username"
//           className="username-input-field"
//           value={username}
//           onChange={this.onChangeUsername}
//           placeholder="Username"
//         />
//       </>
//     )
//   }

//   render() {
//     const {showSubmitError, errorMsg} = this.state
//     const jwtToken = Cookies.get('jwt_token')
//     if (jwtToken !== undefined) {
//       return <Redirect to="/" />
//     }
//     return (
//       <div className="login-form-container">
//         <img
//           src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
//           className="login-website-logo-mobile-image"
//           alt="website logo"
//         />
//         <img
//           src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
//           className="login-image"
//           alt="website login"
//         />
//         <form className="form-container" onSubmit={this.submitForm}>
//           <img
//             src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
//             className="login-website-logo-desktop-image"
//             alt="website logo"
//           />
//           <div className="input-container">{this.renderUsernameField()}</div>
//           <div className="input-container">{this.renderPasswordField()}</div>
//           <button type="submit" className="login-button">
//             Login
//           </button>
//           {showSubmitError && <p className="error-message">*{errorMsg}</p>}
//           <Link to="/register" className="">
//             Create New Account
//           </Link>
//         </form>
//       </div>
//     )
//   }
// }

// export default LoginForm
import React, {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    // Save the token to cookies
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})

    // Decode the token to check user role
    const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]))

    // Prevent redundant redirects if already on the right page
    // if (decodedToken.role === 'admin') {
    //   if (window.location.pathname !== '/adminhome') {
    //     // Only redirect if not already on admin home
    //     history.replace('/adminhome')
    //   }
    // } else {
    //   if (window.location.pathname !== '/') {
    //     // Only redirect if not already on regular home
    //     history.replace('/')
    //   }
    // }

    const {role} = decodedToken
    const currentPath = window.location.pathname

    if (role === 'admin' && currentPath !== '/adminhome') {
      history.replace('/adminhome')
    } else if (role !== 'admin' && currentPath !== '/') {
      history.replace('/')
    }
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'http://localhost:3001/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token) // No need to update state here
      } else {
        this.onSubmitFailure(data.message)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      this.onSubmitFailure('Network error, please try again later.')
    }
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    // If already logged in, redirect to the appropriate page
    if (jwtToken !== undefined) {
      // Decode the token to check if it's admin
      const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]))
      if (decodedToken.role === 'admin') {
        return <Redirect to="/adminhome" /> // Redirect to Admin Home if logged in as admin
      }
      return <Redirect to="/" /> // Redirect to home if logged in as regular user
    }

    return (
      <div className="login-form-container">
        <img
          src="https://i.ibb.co/RGGdLKMX/1726222924531-1.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://img.freepik.com/free-vector/flat-game-streamer-elements-collection_23-2148918486.jpg?semt=ais_hybrid"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://i.ibb.co/RGGdLKMX/1726222924531-1.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <h1>Heaven Games</h1>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <Link to="/register" className="">
            <p>Create New Accout</p>
          </Link>
        </form>
      </div>
    )
  }
}

export default LoginForm
