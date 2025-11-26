import {Component} from 'react'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import './index.css'

class ProductManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      brand: '',
      style: '',
      availability: '',
      rating: '',
      totalReviews: '',
      category: '',
      products: [],
      editing: false,
      currentProductId: null,
      searchTerm: '',
    }
  }

  componentDidMount() {
    this.fetchProducts()
  }

  fetchProducts = async () => {
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      console.log(data.products)
      this.setState({products: data.products.reverse()})
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    const {
      title,
      description,
      price,
      imageUrl,
      brand,
      style,
      availability,
      rating,
      totalReviews,
      category,
      editing,
      currentProductId,
    } = this.state

    if (
      !title ||
      !description ||
      !price ||
      !imageUrl ||
      !brand ||
      !style ||
      !availability ||
      !rating ||
      !category
    ) {
      alert('All fields are required')
      return
    }

    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      imageUrl,
      brand,
      style,
      availability,
      rating: parseFloat(rating),
      totalReviews: parseInt(totalReviews, 10),
      category: parseInt(category, 10),
    }

    if (editing) {
      try {
        const response = await fetch(
          `http://localhost:3001/products/${currentProductId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(productData),
          },
        )

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Product updated successfully')
          this.setState({editing: false})
          this.fetchProducts()
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error updating product')
        }
      } catch (error) {
        console.error('Error updating product:', error)
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(productData),
        })

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Product uploaded successfully')
          this.fetchProducts()
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error uploading product')
        }
      } catch (error) {
        console.error('Error inserting product:', error)
      }
    }

    this.resetForm()
  }

  handleEdit = product => {
    this.setState({
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.image_url,
      brand: product.brand,
      style: product.style,
      availability: product.availability,
      rating: product.rating,
      totalReviews: product.total_reviews,
      category: product.category,
      editing: true,
      currentProductId: product.id,
    })
  }

  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Product deleted successfully')
        this.fetchProducts()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  getFilteredProducts = () => {
    const {products, searchTerm} = this.state
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  resetForm = () => {
    this.setState({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      brand: '',
      style: '',
      availability: '',
      rating: '',
      totalReviews: '',
      category: '',
    })
  }

  render() {
    const {
      title,
      description,
      price,
      imageUrl,
      brand,
      style,
      availability,
      rating,
      totalReviews,
      category,
      editing,
      searchTerm,
    } = this.state
    const filteredProducts = this.getFilteredProducts()

    return (
      <>
        <AdminHeader />
        <div className="product-management-container">
          <h2>Product Management</h2>
          <form onSubmit={this.handleSubmit} className="product-form1">
            <div>
              <label htmlFor="title">Title:</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => this.setState({title: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={e => this.setState({description: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="price">Price:</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={e => this.setState({price: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="imageUrl">Image URL:</label>
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={e => this.setState({imageUrl: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="brand">Brand:</label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={e => this.setState({brand: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="style">Style:</label>
              <input
                id="style"
                type="text"
                value={style}
                onChange={e => this.setState({style: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="availability">Availability:</label>
              <input
                id="availability"
                type="text"
                value={availability}
                onChange={e => this.setState({availability: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="rating">Rating:</label>
              <input
                id="rating"
                type="number"
                value={rating}
                onChange={e => this.setState({rating: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="totalReviews">Total Reviews:</label>
              <input
                id="totalReviews"
                type="number"
                value={totalReviews}
                onChange={e => this.setState({totalReviews: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="category">Category ID:</label>
              <input
                id="category"
                type="number"
                value={category}
                onChange={e => this.setState({category: e.target.value})}
                required
              />
            </div>
            <button type="submit">
              {editing ? 'Update Product' : 'Add Product'}
            </button>
          </form>

          <div className="upload-card-align">
            <h2>Products</h2>
            <div className="upload-input-card">
              <input
                type="text"
                placeholder="Search by title"
                className="upload-input-item"
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
            </div>
          </div>

          <ul className="product-list1">
            {filteredProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              filteredProducts.map(product => (
                <li key={product.id} className="product-item1">
                  <h3>{product.id}</h3>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <img
                    src={decodeURIComponent(product.image_url)}
                    alt={product.title}
                    width="100"
                  />
                  <p>Rs {product.price}</p>
                  <p>{product.brand}</p>
                  <p>{product.rating}</p>
                  <p>{product.style}</p>
                  <p>{product.total_reviews}</p>
                  <p>{product.availability}</p>
                  <p>{product.category}</p>
                  <button
                    type="button"
                    onClick={() => this.handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => this.handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    )
  }
}

export default ProductManagement
