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
import PlayerStats from './components/PlayerStats'
import OrderPage from './components/OrderPage'
import ProfilePage from './components/ProfilePage'

// admin
import VideoUpload from './components/VideoUpload'
import TrailerUpload from './components/TrailerUpload'
import GamesUpload from './components/GamesUpload'
import ProductManagement from './components/ProductManagement'
import EventManager from './components/EventManager'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import HostPage from './components/HostPage'
import AudiencePage from './components/AudiencePage'
import SeeOrder from './components/SeeOrder'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  componentDidMount() {
    const storedCartList = localStorage.getItem('cartList')
    if (storedCartList) {
      this.setState({cartList: JSON.parse(storedCartList)})
    }
  }

  saveCartToLocalStorage = cartList => {
    localStorage.setItem('cartList', JSON.stringify(cartList))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []}, () => {
      this.saveCartToLocalStorage([])
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
        this.saveCartToLocalStorage(cartList)
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
          this.saveCartToLocalStorage(cartList)
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
      this.saveCartToLocalStorage(updatedCartList)
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
          this.saveCartToLocalStorage(cartList)
        },
      )
    } else {
      const updatedCartList = [...cartList, product]
      this.setState({cartList: updatedCartList}, () => {
        this.saveCartToLocalStorage(updatedCartList)
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
              <ProtectedRoute exact path="/" component={Home} />
              <ProtectedRoute exact path="/products" component={Products} />

              <ProtectedAdminRoute
                exact
                path="/adminhome"
                component={AdminHome}
              />
              <ProtectedAdminRoute
                exact
                path="/adminvideo"
                component={VideoUpload}
              />
              <ProtectedAdminRoute
                exact
                path="/admintrailer"
                component={TrailerUpload}
              />
              <ProtectedAdminRoute
                exact
                path="/admindownload"
                component={GamesUpload}
              />
              <ProtectedAdminRoute
                exact
                path="/adminevents"
                component={EventManager}
              />
              <ProtectedAdminRoute
                exact
                path="/livegame/host"
                component={HostPage}
              />
              <ProtectedAdminRoute
                exact
                path="/adminproduct"
                component={ProductManagement}
              />
              <ProtectedAdminRoute
                exact
                path="/adminorder"
                component={SeeOrder}
              />

              <ProtectedRoute
                exact
                path="/livegame/audience"
                component={AudiencePage}
              />

              <ProtectedRoute exact path="/order" component={OrderPage} />

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
              <ProtectedRoute
                exact
                path="/playerstats"
                component={PlayerStats}
              />
              <ProtectedRoute
                exact
                path="/profilepage"
                component={ProfilePage}
              />

              <ProtectedRoute exact path="/cart" component={Cart} />

              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/register" component={RegisterForm} />

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
