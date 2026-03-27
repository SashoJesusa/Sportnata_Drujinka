import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const ACTION_BUTTONS = {
  '/home': { to: '/add-product', label: '+ Публикувай обява' },
  '/add-product': { to: '/add-product', label: '+ Публикувай обява' },
  '/community': { to: '/community', label: '+ Нов въпрос', action: 'new-post' },
  '/coalitions': { to: '/coalitions', label: '+ Нова кампания', action: 'new-coalition' },
}

export default function Navbar({ onAction }) {
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

  const btn = ACTION_BUTTONS[path] || ACTION_BUTTONS['/home']

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
          <Link to="/coalitions" className={`nav-link ${path === '/coalitions' ? 'active' : ''}`}>Кампании</Link>
          <Link to="/home#site-footer" className={`nav-link ${isAboutActive ? 'active' : ''}`} onClick={handleAboutClick}>За Нас</Link>
        </div>
        {btn.action ? (
          <button className="btn-sell" onClick={() => onAction && onAction(btn.action)}>
            {btn.label}
          </button>
        ) : (
          <Link to={btn.to} className="btn-sell">{btn.label}</Link>
        )}
      </nav>
    </header>
  )
}