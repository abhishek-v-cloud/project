import React, {useState} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserCircle} from '@fortawesome/free-solid-svg-icons'
import CartContext from '../../context/CartContext'

import './index.css'

const Header = props => {
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for toggling mobile menu

  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderCartItemsCount = () => (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const cartItemsCount = cartList.length

        return (
          <>
            {cartItemsCount > 0 ? (
              <span className="cart-count-badge">{cartItemsCount}</span>
            ) : null}
          </>
        )
      }}
    </CartContext.Consumer>
  )

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
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/products">Products</Link>
          </li>

          <li>
            <Link to="/cart">
              Cart
              {renderCartItemsCount()}
            </Link>
          </li>
          <li>
            <Link to="/video">Videos</Link>
          </li>
          <li>
            <Link to="/event">Events</Link>
          </li>
          <li>
            <Link to="/downloads">Downloads</Link>
          </li>
          <li>
            <Link to="/playerstats">Player Stats</Link>
          </li>
          <li className="hide">
            <Link to="/profilepage">Profile</Link>
          </li>

          {/* Logout button moved into the mobile menu */}
          <li>
            <button onClick={onClickLogout} className="logout-btn hide">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Hamburger Menu */}
      <Link to="/profilepage" className="header-profile-link">
        <FontAwesomeIcon
          icon={faUserCircle}
          size="xl"
          className="profile-icon" // Apply margin-right here
        />
      </Link>
      <div className="menu-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navbar Right (Logout button on large screens) */}
      <div className="navbar-right">
        <button onClick={onClickLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
