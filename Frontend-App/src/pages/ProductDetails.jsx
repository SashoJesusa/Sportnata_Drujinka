import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import mockProducts from '../data/mockProducts'
import '../styles/ProductDetails.css'

export default function ProductDetails() {
  const { id } = useParams()
  const product = mockProducts.find(p => p.id === Number(id))
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!product) return (
    <div className="product-not-found">
      <Navbar />
      <div className="product-not-found-icon">🌾</div>
      <p className="product-not-found-text">Продуктът не е намерен.</p>
      <Link to="/home" className="back-link">← Обратно</Link>
    </div>
  )

  return (
    <div className="product-details-container">
      <Navbar />
      <div className="product-details-wrapper">
        <Link to="/home" className="back-link">← Обратно към продуктите</Link>

        <div className="product-card">
          <div className="product-image-section">{product.emoji}</div>
          <div className="product-info-section">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price">{product.price.toFixed(2)} лв / {product.unit}</div>
            <p className="product-meta">👨‍🌾 <strong>{product.farmer}</strong></p>
            <p className="product-meta">📍 {product.village}</p>
            <p className="product-meta">🏷️ {product.category}</p>
            <p className="product-meta">⭐ {product.rating} ({product.reviews} отзива)</p>
            <p className="product-description">{product.description}</p>
            <div className="product-contact-box">
              <p className="product-contact-label">📞 Телефон за контакт</p>
              <p className="product-contact-phone">{product.phone}</p>
            </div>
            <button onClick={() => alert(`Обаждаш се на ${product.farmer}: ${product.phone}`)} className="btn-contact">
              💬 Свържи се с фермера
            </button>
          </div>
        </div>

        <div className="reviews-section">
          <h3 className="reviews-title">⭐ Остави отзив</h3>
          {submitted ? (
            <p className="review-success">✅ Благодарим за твоя отзив!</p>
          ) : (
            <>
              <div className="review-stars">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)} className={`star-button ${n <= rating ? 'active' : ''}`}>★</button>
                ))}
              </div>
              <textarea rows={3} placeholder="Напиши своя отзив..." value={review} onChange={e => setReview(e.target.value)} className="review-textarea" />
              <button onClick={() => { if (rating > 0) setSubmitted(true) }} className="btn-submit-review">
                Изпрати отзива
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}