import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const ACTION_BUTTONS = {
  '/home': { to: '/add-product', label: '+ Публикувай обява' },
  '/add-product': { to: '/add-product', label: '+ Публикувай обява' },
  '/community': { to: '/community', label: '+ Нов въпрос', action: 'new-post' },
  '/coalitions': { to: '/coalitions', label: '+ Нова коалиция', action: 'new-coalition' },
}

export default function Navbar({ onAction }) {
  const location = useLocation()
  const path = location.pathname

  const btn = ACTION_BUTTONS[path] || ACTION_BUTTONS['/home']

  return (
    <header className="header">
      <div className="header-top">
        <span className="header-top-left"></span>
        <div className="header-top-right">
          <Link to="/my-listings" className="header-top-link">👤 Моят Профил</Link>
          <Link to="/login" className="btn-login-top">Вход/Регистрация</Link>
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
          <Link to="/coalitions" className={`nav-link ${path === '/coalitions' ? 'active' : ''}`}>Коалиции</Link>
          <Link to="/home" className="nav-link">За Нас</Link>
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