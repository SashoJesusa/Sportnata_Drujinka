import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const hash = location.hash
  const savedUser = localStorage.getItem('user')
  const sessionId = localStorage.getItem('sessionId')
  let user = null

  if (savedUser && sessionId) {
    try {
      user = JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('user')
      localStorage.removeItem('sessionId')
    }
  } else if (savedUser || sessionId) {
    localStorage.removeItem('user')
    localStorage.removeItem('sessionId')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('sessionId')
    navigate('/home')
  }

  const handleAboutClick = (e) => {
    e.preventDefault()

    if (path !== '/home') {
      navigate('/home#site-footer')
      return
    }

    const footer = document.getElementById('site-footer')
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHomeClick = (e) => {
    if (path === '/home') {
      e.preventDefault()
      if (hash) {
        navigate('/home', { replace: true })
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isHomeActive = path === '/home' && hash !== '#site-footer'
  const isAboutActive = path === '/home' && hash === '#site-footer'

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
          <Link to="/home" onClick={handleHomeClick} className={`nav-link ${isHomeActive ? 'active' : ''}`}>Начало</Link>
          <Link to="/community" className={`nav-link ${path === '/community' ? 'active' : ''}`}>Форум</Link>
          <Link to="/home#site-footer" className={`nav-link ${isAboutActive ? 'active' : ''}`} onClick={handleAboutClick}>За Нас</Link>
        </div>
        <Link to="/add-product" className="btn-sell">Публикувай Обява</Link>
      </nav>
    </header>
  )
}