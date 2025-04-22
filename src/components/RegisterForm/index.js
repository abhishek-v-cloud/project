import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, Redirect} from 'react-router-dom'

import './index.css'

class RegisterForm extends Component {
  state = {
    username: '',
    fullname: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangeFullname = event => {
    this.setState({fullname: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onRegisterSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onRegisterFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  registerForm = async event => {
    event.preventDefault()
    const {fullname, username, password} = this.state
    const userDetails = {fullname, username, password}
    const url = 'http://localhost:3001/register'
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
        this.onRegisterSuccess(data.jwt_token)
      } else {
        this.onRegisterFailure(data.message)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      this.onRegisterFailure('Network error, please try again later.')
    }
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

  renderFullnameField = () => {
    const {fullname} = this.state
    return (
      <>
        <label className="input-label" htmlFor="fullname">
          FULL NAME
        </label>
        <input
          type="text"
          id="fullname"
          className="username-input-field"
          value={fullname}
          onChange={this.onChangeFullname}
          placeholder="Fullname"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://i.postimg.cc/SQ2yqbn1/1726222924531-1-1-removebg-preview.png"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <img
          src="https://img.freepik.com/free-vector/gamers-play-video-game-different-hardware-platforms-cross-platform-play-cross-play-cross-platform-gaming-concept_335657-1819.jpg?semt=ais_hybrid"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.registerForm}>
          <img
            src="https://i.postimg.cc/SQ2yqbn1/1726222924531-1-1-removebg-preview.png"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <h1 className="heaven-games">Heaven Games</h1>
          <div className="input-container">{this.renderFullnameField()}</div>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Create Account
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <p>
            Already have Account? <Link to="/login">Login Here</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default RegisterForm
