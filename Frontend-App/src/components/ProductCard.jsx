import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product, onContact }) {
  const [liked, setLiked] = useState(false)
  if (!product) return null
  const productLink = `/products/${encodeURIComponent(String(product.id))}`
  const hasImage = Boolean(product.imageUrl)

  return (
    <div className="product-card">
      <Link to={productLink} className="card-image-link">
        <div className={`card-image ${hasImage ? 'has-photo' : ''}`}>
          {hasImage ? (
            <img src={product.imageUrl} alt={product.name} className="card-photo" />
          ) : (
            <span className="card-emoji">{product.emoji}</span>
          )}
          {product.badge && <span className="card-badge">{product.badge}</span>}
          
        </div>
      </Link>
      <div className="card-body">
        <div className="card-header">
          <Link to={productLink} className="card-title-link">
            <h3 className="card-title">{product.name}</h3>
          </Link>
          <span className="card-price">{product.price.toFixed(2)} €/{product.unit}</span>
        </div>
        <p className="card-meta">👨‍🌾 {product.farmer} · 📍 {product.village}</p>
        <div className="card-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span className="rating-num">{product.rating} ({product.reviews} отзива)</span>
        </div>
        <div className="card-actions">
          <Link to={productLink} className="btn-details">Виж детайли</Link>
          
        </div>
      </div>
    </div>
  )
}