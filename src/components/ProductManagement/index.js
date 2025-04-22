import React, {Component} from 'react'
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

  // Fetching the products from the backend
  fetchProducts = async () => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

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
      this.setState({products: data.products.reverse()}) // Reversing the order to show the newest product first
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Handling the product submit (either add or update)
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

    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

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
      // Update existing product
      try {
        const response = await fetch(
          `http://localhost:3001/products/${currentProductId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`, // Include the token in the header
            },
            body: JSON.stringify(productData),
          },
        )

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Product updated successfully')
          this.setState({editing: false})
          this.fetchProducts() // Re-fetch products after update
        } else {
          const errorData = await response.json()
          console.error('Error Response:', errorData)
          alert(errorData.message || 'Error updating product')
        }
      } catch (error) {
        console.error('Error updating product:', error)
      }
    } else {
      // Insert new product
      try {
        const response = await fetch('http://localhost:3001/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`, // Include the token in the header
          },
          body: JSON.stringify(productData),
        })

        if (response.ok) {
          const data = await response.json()
          alert(data.message || 'Product uploaded successfully')
          this.fetchProducts() // Re-fetch products after adding new one
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

  // Handling the editing of an existing product
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

  // Handling the deletion of a product
  handleDelete = async id => {
    const jwtToken = Cookies.get('jwt_token') // Retrieve the JWT token from cookies

    if (!jwtToken) {
      console.error('JWT token is missing')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Include the token in the header
        },
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Product deleted successfully')
        this.fetchProducts() // Re-fetch products after delete
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error deleting product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Handling the search input change
  handleSearchChange = e => {
    this.setState({searchTerm: e.target.value})
  }

  // Filtering the products based on the search term
  getFilteredProducts = () => {
    const {products, searchTerm} = this.state
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Resetting the form after adding or updating a product
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
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={e => this.setState({title: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={e => this.setState({description: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={e => this.setState({price: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={imageUrl}
                onChange={e => this.setState({imageUrl: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Brand:</label>
              <input
                type="text"
                value={brand}
                onChange={e => this.setState({brand: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Style:</label>
              <input
                type="text"
                value={style}
                onChange={e => this.setState({style: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Availability:</label>
              <input
                type="text"
                value={availability}
                onChange={e => this.setState({availability: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Rating:</label>
              <input
                type="number"
                value={rating}
                onChange={e => this.setState({rating: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Total Reviews:</label>
              <input
                type="number"
                value={totalReviews}
                onChange={e => this.setState({totalReviews: e.target.value})}
              />
            </div>
            <div>
              <label>Category ID:</label>
              <input
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
                  <button onClick={() => this.handleEdit(product)}>Edit</button>
                  <button onClick={() => this.handleDelete(product.id)}>
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
