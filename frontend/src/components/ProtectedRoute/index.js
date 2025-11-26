import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({component: Component, ...rest}) => {
  const token = Cookies.get('jwt_token')

  if (!token) {
    return <Redirect to="/login" />
  }

  const jwtPayload = JSON.parse(atob(token.split('.')[1]))
  const {role} = jwtPayload

  if (role === 'admin' && rest.path !== '/adminhome') {
    return <Redirect to="/adminhome" />
  }

  if (role === 'user' && rest.path === '/adminhome') {
    return <Redirect to="/" />
  }

  return <Route {...rest} render={props => <Component {...props} />} />
}

export default ProtectedRoute
