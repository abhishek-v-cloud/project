import {Component} from 'react'
import Cookies from 'js-cookie'
import CartContext from '../../context/CartContext'
import './index.css'

class OrderPage extends Component {
  state = {
    name: '',
    address: '',
    phone: '',
    email: '',
    orderSuccess: null,
    showModal: false,
  }

  handleInputChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = async e => {
    e.preventDefault()

    const {name, address, phone, email} = this.state
    const {cartList} = this.context

    if (!cartList || cartList.length === 0) {
      this.setState({
        orderSuccess: 'Your cart is empty. Please add items to the cart.',
        showModal: true,
      })
      return
    }

    let totalAmount = 0
    cartList.forEach(item => {
      totalAmount += item.price * item.quantity
    })

    const orderDetails = {
      name,
      address,
      phone,
      email,
      cartItems: cartList,
      totalAmount,
    }

    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      this.setState({orderSuccess: 'Error: Unauthorized. Please log in.'})
      return
    }

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      })

      if (response.ok) {
        const data = await response.json()
        this.setState({
          orderSuccess: `Your order has been placed successfully! Order ID: ${data.orderId}`,
          showModal: true,
        })
      } else {
        this.setState({
          orderSuccess: 'Failed to place the order. Please try again.',
          showModal: true,
        })
      }
    } catch (error) {
      console.error(error)
      this.setState({
        orderSuccess: 'Error: Unable to connect to the server.',
        showModal: true,
      })
    }
  }

  closeModal = () => {
    const {history} = this.props
    this.setState({showModal: false})
    history.push('/products')
  }

  render() {
    const {name, address, phone, email, orderSuccess, showModal} = this.state
    const {cartList} = this.context

    let totalAmount = 0
    cartList.forEach(item => {
      totalAmount += item.price * item.quantity
    })

    return (
      <div className="order-page-main-container">
        <div className="order-page-container">
          <h2>Checkout</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={address}
                onChange={this.handleInputChange}
                required
                rows="2"
                placeholder="Building No/Room No, Building Name, Street Name, Area, Pin Code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <h3>Order Summary</h3>
            <div className="cart-items-list">
              {cartList.map(cartItemDetails => {
                const {id, title, quantity, price, imageUrl} = cartItemDetails
                return (
                  <div key={id} className="cart-item">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3>{title}</h3>
                      <p>Quantity: {quantity}</p>
                      <p>Price: Rs {price}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="total-amount">
              <span>Total Amount: Rs {totalAmount}</span>
              <h5>Payment Method: COD</h5>
            </div>

            <button type="submit" className="submit-button">
              Place Order
            </button>
          </form>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{orderSuccess}</h3>
                <button
                  type="button"
                  className="close-button"
                  onClick={this.closeModal}
                >
                  Close & Go to Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

OrderPage.contextType = CartContext

export default OrderPage
