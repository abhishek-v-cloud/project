import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedAdminRoute = props => {
  const token = Cookies.get('jwt_token')

  // If there is no token or if the role is not admin, redirect to login
  if (token === undefined) {
    return <Redirect to="/login" />
  }

  // Decode the token to get the user's role
  const decodedToken = JSON.parse(atob(token.split('.')[1]))

  // Check if the user is an admin
  if (decodedToken.role !== 'admin') {
    return <Redirect to="/" /> // If not an admin, redirect to home
  }

  return <Route {...props} />
}

export default ProtectedAdminRoute
