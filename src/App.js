// import {Component} from 'react'
// import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

// import LoginForm from './components/LoginForm'
// import Home from './components/Home'
// import Products from './components/Products'
// import ProductItemDetails from './components/ProductItemDetails'
// import AdminHome from './components/AdminHome'
// import Cart from './components/Cart'
// import NotFound from './components/NotFound'
// import ProtectedRoute from './components/ProtectedRoute'
// import CartContext from './context/CartContext'
// import RegisterForm from './components/RegisterForm'
// import Video from './components/Video'
// import Event from './components/Event'
// import EventFormPage from './components/EventFormPage'
// import WatchTrailer from './components/WatchTrailer'
// import WatchVideo from './components/WatchVideo'

// import './App.css'

// class App extends Component {
//   state = {
//     cartList: [],
//   }

//   addCartItem = product => {
//     this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
//   }

//   deleteCartItem = () => {}

//   render() {
//     const {cartList} = this.state

//     return (
//       <BrowserRouter>
//         <CartContext.Provider
//           value={{
//             cartList,
//             addCartItem: this.addCartItem,
//             deleteCartItem: this.deleteCartItem,
//           }}
//         >
//           <Switch>
//             <Route exact path="/login" component={LoginForm} />
//             <Route exact path="/register" component={RegisterForm} />
//             <ProtectedRoute exact path="/" component={Home} />
//             <ProtectedRoute exact path="/products" component={Products} />
//             <ProtectedRoute exact path="/adminhome" component={AdminHome} />
//             <ProtectedRoute
//               exact
//               path="/products/:id"
//               component={ProductItemDetails}
//             />

//             <ProtectedRoute exact path="/video" component={Video} />
//             <ProtectedRoute
//               exact
//               path="/trailer/:trailerId"
//               component={WatchTrailer}
//             />
//             <ProtectedRoute
//               exact
//               path="/video/:videoId"
//               component={WatchVideo}
//             />
//             <ProtectedRoute exact path="/event" component={Event} />
//             <ProtectedRoute
//               exact
//               path="/eventform/:eventId"
//               component={EventFormPage}
//             />
//             <ProtectedRoute exact path="/cart" component={Cart} />
//             <Route path="/not-found" component={NotFound} />
//             <Redirect to="not-found" />
//           </Switch>
//         </CartContext.Provider>
//       </BrowserRouter>
//     )
//   }
// }

// export default App
import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import AdminHome from './components/AdminHome'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import RegisterForm from './components/RegisterForm'
import Video from './components/Video'
import Event from './components/Event'
import EventFormPage from './components/EventFormPage'
import WatchTrailer from './components/WatchTrailer'
import WatchVideo from './components/WatchVideo'
import Downloads from './components/Downloads'

import './App.css'

class App extends Component {
  state = {
    cartList: [], // Initial state is an empty array
  }

  // Load cart items from localStorage when the component is mounted
  componentDidMount() {
    const storedCartList = localStorage.getItem('cartList')
    if (storedCartList) {
      this.setState({cartList: JSON.parse(storedCartList)})
    }
  }

  // Save cart items to localStorage whenever cartList is updated
  saveCartToLocalStorage = cartList => {
    localStorage.setItem('cartList', JSON.stringify(cartList))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []}, () => {
      this.saveCartToLocalStorage([]) // Save the empty cart to localStorage
    })
  }

  incrementCartItemQuantity = id => {
    const {cartList} = this.state
    this.setState(
      prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity + 1
            return {...eachCartItem, quantity: updatedQuantity}
          }
          return eachCartItem
        }),
      }),
      () => {
        this.saveCartToLocalStorage(cartList) // Save updated cart to localStorage
      },
    )
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const productObject = cartList.find(eachCartItem => eachCartItem.id === id)
    if (productObject.quantity > 1) {
      this.setState(
        prevState => ({
          cartList: prevState.cartList.map(eachCartItem => {
            if (id === eachCartItem.id) {
              const updatedQuantity = eachCartItem.quantity - 1
              return {...eachCartItem, quantity: updatedQuantity}
            }
            return eachCartItem
          }),
        }),
        () => {
          this.saveCartToLocalStorage(cartList) // Save updated cart to localStorage
        },
      )
    } else {
      this.removeCartItem(id)
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedCartList = cartList.filter(
      eachCartItem => eachCartItem.id !== id,
    )

    this.setState({cartList: updatedCartList}, () => {
      this.saveCartToLocalStorage(updatedCartList) // Save updated cart to localStorage
    })
  }

  addCartItem = product => {
    const {cartList} = this.state
    const productObject = cartList.find(
      eachCartItem => eachCartItem.id === product.id,
    )

    if (productObject) {
      this.setState(
        prevState => ({
          cartList: prevState.cartList.map(eachCartItem => {
            if (productObject.id === eachCartItem.id) {
              const updatedQuantity = eachCartItem.quantity + product.quantity
              return {...eachCartItem, quantity: updatedQuantity}
            }
            return eachCartItem
          }),
        }),
        () => {
          this.saveCartToLocalStorage(cartList) // Save updated cart to localStorage
        },
      )
    } else {
      const updatedCartList = [...cartList, product]
      this.setState({cartList: updatedCartList}, () => {
        this.saveCartToLocalStorage(updatedCartList) // Save updated cart to localStorage
      })
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <div className="app-conatiner">
        <BrowserRouter>
          <CartContext.Provider
            value={{
              cartList,
              addCartItem: this.addCartItem,
              removeCartItem: this.removeCartItem,
              incrementCartItemQuantity: this.incrementCartItemQuantity,
              decrementCartItemQuantity: this.decrementCartItemQuantity,
              removeAllCartItems: this.removeAllCartItems,
            }}
          >
            <Switch>
              {/* Protected Routes */}
              <ProtectedRoute exact path="/" component={Home} />
              <ProtectedRoute exact path="/products" component={Products} />
              <ProtectedRoute exact path="/adminhome" component={AdminHome} />
              <ProtectedRoute
                exact
                path="/products/:id"
                component={ProductItemDetails}
              />
              <ProtectedRoute exact path="/video" component={Video} />
              <ProtectedRoute
                exact
                path="/trailer/:trailerId"
                component={WatchTrailer}
              />
              <ProtectedRoute
                exact
                path="/video/:videoId"
                component={WatchVideo}
              />
              <ProtectedRoute exact path="/event" component={Event} />
              <ProtectedRoute
                exact
                path="/eventform/:eventId"
                component={EventFormPage}
              />
              <ProtectedRoute exact path="/downloads" component={Downloads} />
              <ProtectedRoute exact path="/cart" component={Cart} />

              {/* Auth Routes */}
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/register" component={RegisterForm} />

              {/* 404 Route */}
              <Route path="/not-found" component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </CartContext.Provider>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
