import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product, onContact }) {
  if (!product) return null
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="card-image-link">
        <div className="card-image">
          <span className="card-emoji">{product.emoji}</span>
          {product.badge && <span className="card-badge">{product.badge}</span>}
        </div>
      </Link>
      <div className="card-body">
        <div className="card-header">
          <Link to={`/products/${product.id}`} className="card-title-link">
            <h3 className="card-title">{product.name}</h3>
          </Link>
          <span className="card-price">{product.price.toFixed(2)} лв/{product.unit}</span>
        </div>
        <p className="card-meta">👨‍🌾 {product.farmer} · 📍 {product.village}</p>
        <div className="card-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span className="rating-num">{product.rating}</span>
          <span className="rating-count">({product.reviews} отзива)</span>
        </div>
        <div className="card-actions">
          <Link to={`/products/${product.id}`} className="btn-details">Виж детайли</Link>
          <button className="btn-contact" onClick={() => onContact && onContact(product)}>💬</button>
        </div>
      </div>
    </div>
  )
}