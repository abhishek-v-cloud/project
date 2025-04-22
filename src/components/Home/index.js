import {Link} from 'react-router-dom'
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
  </>
)

export default Home
