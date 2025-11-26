import {Component} from 'react'
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

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})

    history.replace('/')
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
        this.onSubmitSuccess(data.jwt_token)
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

    if (jwtToken !== undefined) {
      const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]))
      if (decodedToken.role === 'admin') {
        return <Redirect to="/adminhome" />
      }
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="https://i.postimg.cc/SQ2yqbn1/1726222924531-1-1-removebg-preview.png"
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
            src="https://i.postimg.cc/SQ2yqbn1/1726222924531-1-1-removebg-preview.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <h1 className="heaven-games">Heaven Games</h1>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && <p className="error-message">*{errorMsg}</p>}

          <p>
            Don't have Account? <Link to="/register">Register Here</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default LoginForm
