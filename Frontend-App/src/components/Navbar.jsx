import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const sessionId = localStorage.getItem('sessionId')
    
    // Only set user if BOTH user and sessionId exist
    if (savedUser && sessionId) {
      setUser(JSON.parse(savedUser))
    } else {
      // Clear any partial/invalid data
      localStorage.removeItem('user')
      localStorage.removeItem('sessionId')
      setUser(null)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('sessionId')
    setUser(null)
    navigate('/home')
  }

  return (
    <header className="header">
      <div className="header-top">
        <span className="header-top-left">🌾 AgroHub — Твоето фермерско пазарче</span>
        <div className="header-top-right">
          {user ? (
            <>
              <span className="user-greeting">👋 Добре дошъл, {user.username}!</span>
              <Link to="/my-listings" className="header-top-link">👤 Моят Профил</Link>
              <button onClick={handleLogout} className="btn-logout-top">Изход</button>
            </>
          ) : (
            <Link to="/login" className="btn-login-top">Вход/Регистрация</Link>
          )}
        </div>
      </div>
      <nav className="navbar">
        <Link to="/home" className="navbar-brand">
          <span className="brand-icon">🌿</span>
          <span className="brand-name">AgroHub</span>
        </Link>
        <div className="navbar-links">
          <Link to="/home" className={`nav-link ${path === '/home' ? 'active' : ''}`}>Начало</Link>
          <Link to="/community" className={`nav-link ${path === '/community' ? 'active' : ''}`}>Форум</Link>
          <Link to="/home" className="nav-link">За Нас</Link>
        </div>
        <Link to="/add-product" className="btn-sell">Публикувай Обява</Link>
      </nav>
    </header>
  )
}