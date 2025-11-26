import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedAdminRoute = props => {
  const token = Cookies.get('jwt_token')

  if (token === undefined) {
    return <Redirect to="/login" />
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1]))

  if (decodedToken.role !== 'admin') {
    return <Redirect to="/" />
  }

  return <Route {...props} />
}

export default ProtectedAdminRoute
