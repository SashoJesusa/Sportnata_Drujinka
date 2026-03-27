import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import '../styles/MyListings.css'

export default function MyListings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [myProducts, setMyProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const sessionId = localStorage.getItem('sessionId')
    
    // If no user or sessionId, redirect to login
    if (!savedUser || !sessionId) {
      navigate('/login')
      return
    }

    const loadMyListings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/my-listings', {
          headers: {
            'X-Session-Id': sessionId,
          },
        })
        console.log('My Listings API Response:', response.data)
        setMyProducts(response.data?.products || [])
      } catch (err) {
        const message = err?.response?.data?.error || 'Не успяхме да заредим обявите.'
        if (err?.response?.status === 401) {
          localStorage.removeItem('user')
          localStorage.removeItem('sessionId')
          navigate('/login')
          return
        }
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadMyListings()
  }, [navigate])

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
          <Link to="/add-product" className="btn-new-listing">+ Нова обява</Link>
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
            <li key={p.id} className="listing-item">
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
              <div className="listing-price">{Number(p.price).toFixed(2)} лв</div>
              <button onClick={() => alert('Изтриването идва скоро!')} className="btn-delete">Изтрий</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}