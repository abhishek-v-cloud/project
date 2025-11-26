import {Link} from 'react-router-dom'
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaDiscord,
} from 'react-icons/fa'
import Header from '../Header'
import Carousel from '../Carousel'

import './index.css'

const Home = () => (
  <>
    <Header />
    <Carousel />
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Clothes That Get YOU Noticed</h1>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-img.png"
          alt="clothes that get you noticed"
          className="home-mobile-img"
        />
        <p className="home-description">
          Fashion is more than just clothing; it's a statement. And at Heaven
          Game Brand, we know that fashion constantly evolves, just like you.
          Clothes have always been a reflection of the times, and we are at the
          forefront of a revolution. With Heaven Game Brand, your fashion speaks
          volumes, it's your way of being seen and heard.
        </p>
        <Link to="/products">
          <button type="button" className="shop-now-button">
            Shop Now
          </button>
        </Link>
      </div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-img.png"
        alt="clothes that get you noticed"
        className="home-desktop-img"
      />
    </div>
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Watch Gaming Videos and Live Streams</h1>
        <img
          src="https://www.geekextreme.com/wp-content/uploads/2024/03/Should-Video-Games-Be-Considered-A-Sport-3.jpg"
          alt="Watch Gaming Videos and Live Streams"
          className="home-mobile-img"
        />
        <p className="home-description">
          Dive into exciting gaming videos and live streams. Stay updated with
          top gameplay, pro tips, and exclusive live events from your favorite
          games. Whether you're looking to improve your skills or just enjoy
          thrilling moments, we’ve got you covered. Watch now, interact with the
          gaming community, and never miss the latest action!
        </p>
        <Link to="/video">
          <button type="button" className="shop-now-button">
            Watch Now
          </button>
        </Link>
      </div>
      <img
        src="https://www.geekextreme.com/wp-content/uploads/2024/03/Should-Video-Games-Be-Considered-A-Sport-3.jpg"
        alt="Watch Gaming Videos and Live Streams"
        className="home-desktop-img order-img"
      />
    </div>
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Book Your Spot for Live Game Events</h1>
        <img
          src="https://sm.ign.com/ign_in/screenshot/default/valorant-igs-photo_xs7y.jpg"
          alt="Event Booking"
          className="home-mobile-img"
        />
        <p className="home-description">
          Experience the thrill of live gaming events, tournaments, and
          community meetups. Reserve your seat, meet your favorite players, and
          be part of the excitement. Don’t miss out on epic moments—book now and
          be game-ready!
        </p>
        <Link to="/event">
          <button type="button" className="shop-now-button">
            Book Now
          </button>
        </Link>
      </div>
      <img
        src="https://sm.ign.com/ign_in/screenshot/default/valorant-igs-photo_xs7y.jpg"
        alt="Event Booking"
        className="home-desktop-img"
      />
    </div>
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Download Top Trending Games</h1>
        <img
          src="https://indipost-img.s3.amazonaws.com/indipost-img-600x400-922261.jpg"
          alt="Download Game"
          className="home-mobile-img"
        />
        <p className="home-description">
          Discover and download the hottest games in the gaming world. Whether
          you're into action, strategy, or multiplayer madness, we've got the
          perfect game for you. Start your adventure now!
        </p>
        <Link to="/downloads">
          <button type="button" className="shop-now-button">
            Download Now
          </button>
        </Link>
      </div>
      <img
        src="https://indipost-img.s3.amazonaws.com/indipost-img-600x400-922261.jpg"
        alt="Download Game"
        className="home-desktop-img order-img"
      />
    </div>
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Track Player Stats</h1>
        <img
          src="https://staticg.sportskeeda.com/editor/2023/08/564d5-16926207722894-1920.jpg"
          alt="Player Stats"
          className="home-mobile-img"
        />
        <p className="home-description">
          Dive deep into detailed player statistics, match histories. Whether
          you're chasing rank or scouting competitors, this is your ultimate
          tool for tracking performance.
        </p>
        <Link to="/playerstats">
          <button type="button" className="shop-now-button">
            View Stats
          </button>
        </Link>
      </div>
      <img
        src="https://staticg.sportskeeda.com/editor/2023/08/564d5-16926207722894-1920.jpg"
        alt="Player Stats"
        className="home-desktop-img"
      />
    </div>
    <footer className="homepage-footer">
      <div className="homepage-footer-content">
        <div className="homepage-footer-logo">
          <h1>Heaven Games</h1>
          <p>Level up your gaming life. Play. Watch. Conquer.</p>
        </div>
        <div className="homepage-footer-links">
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/event">Event Booking</a>
              </li>
              <li>
                <a href="/downloads">Download Games</a>
              </li>
              <li>
                <a href="/playerstats">Player Stats</a>
              </li>
              <li>
                <a href="/products">Store</a>
              </li>
              <li>
                <a href="/video">Gaming Videos</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Follow Us</h3>
            <div className="homepage-footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
              <a href="https://twitch.tv" target="_blank" rel="noreferrer">
                <FaTwitch />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer">
                <FaDiscord />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="homepage-footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Heaven Games. All rights reserved.
        </p>
      </div>
    </footer>
  </>
)

export default Home
