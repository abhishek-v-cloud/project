import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

const AdminHome = () => {
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsersAndAdmins = async () => {
      const jwtToken = Cookies.get('jwt_token')

      if (!jwtToken) {
        setError('JWT token is missing')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:3001/admin/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch data')
        }

        const data = await response.json()
        setUsers(data.users)
        setAdmins(data.admins)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsersAndAdmins()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(
        `http://localhost:3001/admin/users/${userId}/role`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({newRole}),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update role')
      }

      alert('Role updated successfully')
      window.location.reload()
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleSearch = e => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredAdmins = admins.filter(admin =>
    admin.user_name.toLowerCase().includes(searchQuery),
  )

  const filteredUsers = users.filter(user =>
    user.user_name.toLowerCase().includes(searchQuery),
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <AdminHeader />
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-header">
          Welcome to the Admin Dashboard
        </h1>

        <div className="admin-upload-input-card">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={handleSearch}
            className="admin-upload-input-item"
          />
        </div>

        <div className="admin-dashboard-table-container">
          <h3>Admins</h3>
          <table className="admin-dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map(admin => (
                <tr key={admin.user_id}>
                  <td>{admin.user_id}</td>
                  <td>{admin.user_name}</td>
                  <td>{admin.role}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRoleChange(admin.user_id, 'user')}
                    >
                      Make User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-dashboard-table-container">
          <h3>Users</h3>
          <table className="admin-dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.user_name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRoleChange(user.user_id, 'admin')}
                    >
                      Make Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AdminHome
