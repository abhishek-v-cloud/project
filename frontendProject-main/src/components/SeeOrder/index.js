import {Component} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

class SeeOrder extends Component {
  state = {
    orders: [],
    editStates: {},
    searchTerm: '',
  }

  componentDidMount() {
    this.fetchOrders()
  }

  fetchOrders = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('http://localhost:3001/admin/orders', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    this.setState({orders: data})
  }

  handleInputChange = (orderId, field, value) => {
    this.setState(prevState => ({
      editStates: {
        ...prevState.editStates,
        [orderId]: {
          ...prevState.editStates[orderId],
          [field]: value,
        },
      },
    }))
  }

  handleUpdate = async orderId => {
    const jwtToken = Cookies.get('jwt_token')
    const {orders, editStates} = this.state
    const order = orders.find(o => o.id === orderId)
    const edit = editStates[orderId] || {}

    const updatedFields = {
      name: edit.name ?? order.name,
      address: edit.address ?? order.address,
      status: edit.status ?? order.status,
    }

    const response = await fetch(
      `http://localhost:3001/admin/orders/${orderId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      },
    )

    if (response.ok) {
      alert('Order updated')
      this.fetchOrders()
    } else {
      alert('Update failed')
    }
  }

  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  render() {
    const {orders, editStates, searchTerm} = this.state
    const filteredOrders = orders.filter(order => {
      const term = searchTerm.toLowerCase()
      return (
        order.name.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.user_name.toLowerCase().includes(term) ||
        order.id.toString().includes(term)
      )
    })

    return (
      <>
        <AdminHeader />
        <div className="admin-orders">
          <div className="admin-orders-card-align">
            <h2>Orders Management</h2>
            <div className="admin-orders-upload-input-card">
              <input
                type="text"
                placeholder="Search by name, email, ID, or user"
                className="admin-orders-upload-input-item"
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
            </div>
          </div>

          <table className="admin-orders-orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const edit = editStates[order.id] || {}
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_name}</td>
                    <td>
                      <input
                        value={edit.name ?? order.name}
                        onChange={e =>
                          this.handleInputChange(
                            order.id,
                            'name',
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={edit.address ?? order.address}
                        onChange={e =>
                          this.handleInputChange(
                            order.id,
                            'address',
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>{order.phone}</td>
                    <td>{order.email}</td>
                    <td>₹{order.total_amount}</td>
                    <td>
                      <select
                        value={edit.status ?? order.status}
                        onChange={e =>
                          this.handleInputChange(
                            order.id,
                            'status',
                            e.target.value,
                          )
                        }
                      >
                        <option value="Order">Order</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <ul>
                        {JSON.parse(order.order_items).map(item => (
                          <li key={item.id || item.productId}>
                            {item.title} - {item.quantity} x ₹{item.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => this.handleUpdate(order.id)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>
    )
  }
}

export default SeeOrder
