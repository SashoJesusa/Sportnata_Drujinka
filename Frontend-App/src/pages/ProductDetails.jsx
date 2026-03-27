import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/ProductDetails.css'
import { buildApiUrl } from '../config/api'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError('')
        if (!id || id === 'undefined' || id === 'null') {
          throw new Error('Невалиден линк към продукт.')
        }

        const response = await fetch(buildApiUrl(`/products/${encodeURIComponent(id)}`))
        const contentType = response.headers.get('content-type') || ''
        const rawBody = await response.text()

        if (!contentType.includes('application/json')) {
          throw new Error('Сървърът не върна JSON. Провери backend сървъра.')
        }

        const result = JSON.parse(rawBody)
        if (response.status === 404) {
          setProduct(null)
          return
        }

        if (!response.ok || !result?.success) {
          throw new Error(result?.error || 'Неуспешно зареждане на продукта.')
        }

        setProduct(result.product || null)
      } catch (err) {
        setError(err.message || 'Възникна грешка при зареждане на продукта.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="product-not-found">
        <Navbar />
        <p className="product-not-found-text">Зареждане на продукта...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-not-found">
        <Navbar />
        <div className="product-not-found-icon">⚠️</div>
        <p className="product-not-found-text">{error}</p>
        <Link to="/home" className="back-link">← Обратно</Link>
      </div>
    )
  }

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
          <div className="product-image-section">
            {product.image_url ? (
              <img src={product.image_url} alt={product.product || product.name} className="product-image-photo" />
            ) : (
              '🌾'
            )}
          </div>
          <div className="product-info-section">
            <h1 className="product-title">{product.product || product.name}</h1>
            <div className="product-price">{Number(product.price).toFixed(2)} € / кг</div>
            <p className="product-meta">👨‍🌾 <strong>{product.username || (product.user_id ? `Потребител #${product.user_id}` : 'Локален производител')}</strong></p>
            <p className="product-meta">📍 {product.region || 'България'}</p>
            <p className="product-meta">🏷️ {product.category}</p>
            <p className="product-description">{product.description || 'Няма добавено описание.'}</p>
            <div className="product-contact-box">
              <p className="product-contact-label">📞 Телефон за контакт</p>
              <p className="product-contact-phone">Контакт чрез платформата</p>
            </div>
           
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