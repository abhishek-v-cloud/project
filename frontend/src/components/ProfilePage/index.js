import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class ProfilePage extends Component {
  state = {
    activeTab: 'orders',
    orders: [],
    events: [],
    fullName: '',
    userName: '',
  }

  componentDidMount() {
    this.fetchProfile()
    this.fetchOrders()
    this.fetchEvents()
  }

  fetchProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'http://localhost:3001/myprofile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    this.setState({
      userName: data.user_name,
      fullName: data.full_name,
    })
  }

  fetchOrders = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'http://localhost:3001/myorders'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    this.setState({orders: data.reverse()})
  }

  fetchEvents = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'http://localhost:3001/myevent'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    this.setState({events: data.reverse()})
  }

  handleTabChange = tab => {
    this.setState({activeTab: tab})
  }

  renderContent = () => {
    const {activeTab, orders, events} = this.state

    if (activeTab === 'orders') {
      return (
        <div className="user-profile-product-grid">
          {orders.map(order => (
            <div key={order.id} className="user-profile-order-block">
              <h3>Order #{order.id}</h3>
              <p>
                <strong>Shipping To:</strong> {order.address}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
              <p>
                <strong>E-mail:</strong> {order.email}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.total_amount}
              </p>

              <div className="user-profile-order-items">
                {order.order_items.map(item => (
                  <div
                    key={item.id}
                    className="user-profile-product-card space-margin"
                  >
                    <img src={item.imageUrl} alt={item.title} />
                    <div className="user-profile-card-info">
                      <strong>{item.title}</strong>
                      <p>Quantity: {item.quantity}</p>
                      <p>Total: Rs{item.price * item.quantity}</p>
                      <span className="user-profile-stock-status in">
                        Ordered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'events') {
      return (
        <div className="user-profile-product-grid">
          {events.map(event => (
            <div key={event.event_id} className="user-profile-product-card">
              <img
                src={decodeURIComponent(event.event_image)}
                alt={event.event_name}
              />
              <div className="user-profile-card-info">
                <strong>{event.event_name}</strong>
                <p>Game: {event.event_game_name}</p>
                <p>Date: {event.event_date}</p>
                <span className="user-profile-stock-status in">Booked</span>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <p className="user-profile-support-text">
        For support, please contact{' '}
        <a href="mailto:help@heavengame.com">help@heavengame.com</a>
        <br />
        or call us at <a href="tel:+919930588902">+91 99305 88902</a>
      </p>
    )
  }

  render() {
    const {activeTab, userName, fullName} = this.state
    const userInitial = fullName ? fullName.charAt(0).toUpperCase() : 'U'
    let tabTitle = ''
    if (activeTab === 'orders') {
      tabTitle = 'My Orders'
    } else if (activeTab === 'events') {
      tabTitle = 'My Events'
    } else {
      tabTitle = 'Support'
    }

    return (
      <div className="user-profile-dashboard-container">
        <aside className="user-profile-sidebar">
          <div className="user-profile-circle-avatar">{userInitial}</div>
          <h2>{fullName || 'Full Name'}</h2>
          <p className="user-profile-username">{userName}</p>

          <div className="user-profile-menu">
            <button
              type="button"
              className={activeTab === 'orders' ? 'user-profile-active' : ''}
              onClick={() => this.handleTabChange('orders')}
            >
              My Orders
            </button>
            <button
              type="button"
              className={activeTab === 'events' ? 'user-profile-active' : ''}
              onClick={() => this.handleTabChange('events')}
            >
              My Events
            </button>
            <button
              type="button"
              className={activeTab === 'support' ? 'user-profile-active' : ''}
              onClick={() => this.handleTabChange('support')}
            >
              Support
            </button>
          </div>
        </aside>

        <main className="user-profile-main-content">
          <h2>{tabTitle}</h2>
          {this.renderContent()}
        </main>
      </div>
    )
  }
}

export default ProfilePage
