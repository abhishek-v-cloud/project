import {useState} from 'react'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

import './index.css'

const AdminHeader = props => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/adminhome">
          <img
            className="website-logo"
            src="https://i.postimg.cc/SQ2yqbn1/1726222924531-1-1-removebg-preview.png"
            alt="website logo"
          />
        </Link>
        <h1 className="heaven-games">Heaven Games</h1>
      </div>

      {/* Navbar center */}
      <div className={`navbar-center ${isMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-items">
          <li>
            <Link to="/adminhome">Home</Link>
          </li>
          <li>
            <Link to="/adminorder">Orders</Link>
          </li>
          <li>
            <Link to="/adminproduct">Product Upload</Link>
          </li>
          <li>
            <Link to="/adminvideo">Video Upload</Link>
          </li>
          <li>
            <Link to="/admintrailer">Trailer Upload</Link>
          </li>
          <li>
            <Link to="/admindownload">Games Upload</Link>
          </li>
          <li>
            <Link to="/adminevents">Event Upload</Link>
          </li>
          <li>
            <Link to="/livegame/host">Live</Link>
          </li>

          {/* Move Logout button into the mobile menu */}
          <li>
            <button
              type="button"
              onClick={onClickLogout}
              className="logout-btn hide"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Hamburger Menu */}
      <div
        className="menu-toggle"
        onClick={toggleMenu}
        role="button"
        tabIndex="0"
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </div>

      {/* Navbar Right (Logout button on large screens) */}
      <div className="navbar-right">
        <button type="button" onClick={onClickLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(AdminHeader)
