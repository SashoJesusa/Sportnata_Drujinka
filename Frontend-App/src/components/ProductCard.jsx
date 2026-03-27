import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product, onContact }) {
  const [liked, setLiked] = useState(false)
  if (!product) return null

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="card-image-link">
        <div className="card-image">
          <img src={product.image} alt={product.name} className="card-img" />
          {product.badge && <span className="card-badge">{product.badge}</span>}
          <button
            className={`card-like ${liked ? 'liked' : ''}`}
            onClick={e => { e.preventDefault(); setLiked(!liked) }}
          >♥</button>
        </div>
      </Link>
      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="card-title-link">
          <h3 className="card-title">{product.name}</h3>
        </Link>
        <p className="card-price">{product.price.toFixed(2)} лв/<span>{product.unit}</span></p>
        <p className="card-meta">📍 {product.village} · 👨‍🌾 {product.farmer}</p>
        <div className="card-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span className="rating-num">{product.rating} ({product.reviews} отзива)</span>
        </div>
        <div className="card-actions">
          <Link to={`/products/${product.id}`} className="btn-details">Виж детайли</Link>
          <button className="btn-contact-card" onClick={() => onContact && onContact(product)}>💬</button>
        </div>
      </div>
    </div>
  )
}