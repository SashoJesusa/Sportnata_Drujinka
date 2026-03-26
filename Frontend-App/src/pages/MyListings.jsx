import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import mockProducts from '../data/mockProducts'
import '../styles/MyListings.css'

export default function MyListings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const myProducts = mockProducts.slice(0, 3)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const sessionId = localStorage.getItem('sessionId')
    
    // If no user or sessionId, redirect to login
    if (!savedUser || !sessionId) {
      navigate('/login')
      return
    }
    
    setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [navigate])

  if (loading) return <div>Loading...</div>
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
        <ul className="listings-list">
          {myProducts.map(p => (
            <li key={p.id} className="listing-item">
              <div className="listing-emoji">{p.emoji}</div>
              <div className="listing-content">
                <div className="listing-name">{p.name}</div>
                <div className="listing-meta">📍 {p.village} · ⭐ {p.rating} ({p.reviews} отзива)</div>
              </div>
              <div className="listing-price">{p.price.toFixed(2)} лв/{p.unit}</div>
              <button onClick={() => alert('Изтриването идва скоро!')} className="btn-delete">Изтрий</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}