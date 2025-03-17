// import {Redirect, Route} from 'react-router-dom'
// import Cookie from 'js-cookie'

// const ProtectedRoute = props => {
//   const token = Cookie.get('jwt_token')
//   if (token === undefined) {
//     return <Redirect to="/login" />
//   }
//   return <Route {...props} />
// }

// export default ProtectedRoute
import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({component: Component, ...rest}) => {
  const token = Cookies.get('jwt_token')

  // If no token, redirect to login page
  if (!token) {
    return <Redirect to="/login" />
  }

  // Decode JWT token to get the user details (username or role)
  const jwtPayload = JSON.parse(atob(token.split('.')[1]))
  const {role} = jwtPayload

  // If the user is admin and trying to access non-admin pages, redirect to admin page
  if (role === 'admin' && rest.path !== '/adminhome') {
    return <Redirect to="/adminhome" />
  }

  // If the user is a regular user and trying to access admin page, redirect to home
  if (role === 'user' && rest.path === '/adminhome') {
    return <Redirect to="/" />
  }

  // If none of the above conditions are met, allow the route to render the component
  return <Route {...rest} render={props => <Component {...props} />} />
}

export default ProtectedRoute
