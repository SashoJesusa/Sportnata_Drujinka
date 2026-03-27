import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import '../styles/MyListings.css'
import { buildApiUrl } from '../config/api'

export default function MyListings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [myProducts, setMyProducts] = useState([])
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const sessionId = localStorage.getItem('sessionId')
    
    if (!savedUser || !sessionId) {
      navigate('/login')
      return
    }

    const loadMyListings = async () => {
      try {
        const response = await axios.get(buildApiUrl('/my-products'), {
          headers: {
            'X-Session-Id': sessionId,
          },
        })
        console.log('My Listings API Response:', response.data)
        setMyProducts(response.data?.products || [])
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem('user')
          localStorage.removeItem('sessionId')
          navigate('/login')
          return
        }
        const message = err?.response?.data?.error || 'Не успяхме да заредим твоите обяви.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadMyListings()
  }, [navigate])

  const handleDeleteListing = async (listingId) => {
    const sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      navigate('/login')
      return
    }

    const confirmed = window.confirm('Сигурен ли си, че искаш да изтриеш тази обява?')
    if (!confirmed) return

    try {
      setDeletingId(listingId)
      await axios.delete(buildApiUrl(`/products/${listingId}`), {
        headers: {
          'X-Session-Id': sessionId,
        },
      })

      setMyProducts((prev) => prev.filter((p) => {
        const productId = p.offer_id ?? p.id ?? p.product_id ?? p.productId ?? null
        return Number(productId) !== Number(listingId)
      }))
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('user')
        localStorage.removeItem('sessionId')
        navigate('/login')
        return
      }

      if (err?.response?.status === 404) {
        alert('Delete endpoint не е намерен (404). Рестартирай backend сървъра и пробвай пак.')
        return
      }

      const message = err?.response?.data?.error || 'Не успяхме да изтрием обявата.'
      alert(message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="my-listings-state">Зареждане на обявите...</div>
  return (
    <div className="my-listings-container">
      <Navbar />
      <div className="my-listings-wrapper">
        <div className="my-listings-header">
          <div>
            <h1>📋 Мои обяви</h1>
            <p>Управлявай своите публикувани продукти</p>
          </div>
        </div>
        {error && <div className="my-listings-error">{error}</div>}
        <ul className="listings-list">
          {!error && myProducts.length === 0 && (
            <li className="listing-item listing-item-empty">
              <div className="listing-content">
                <div className="listing-name">Все още нямаш публикувани обяви.</div>
                <div className="listing-meta">Натисни „+ Нова обява“, за да добавиш първия си продукт.</div>
              </div>
            </li>
          )}
          {myProducts.map(p => (
            <li key={p.offer_id ?? p.id} className="listing-item">
              <div className="listing-emoji">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.product} className="listing-image" />
                ) : (
                  '🌾'
                )}
              </div>
              <div className="listing-content">
                <div className="listing-name">{p.product}</div>
                <div className="listing-meta">📍 {p.region} · {p.category}</div>
                {p.description && <div className="listing-meta">{p.description}</div>}
              </div>
              <div className="listing-price">{Number(p.price).toFixed(2)} €</div>
              <button
                onClick={() => handleDeleteListing(p.offer_id ?? p.id)}
                className="btn-delete"
                disabled={deletingId === (p.offer_id ?? p.id)}
              >
                {deletingId === (p.offer_id ?? p.id) ? 'Изтриване...' : 'Изтрий'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}