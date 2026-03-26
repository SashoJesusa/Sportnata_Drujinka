import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const path = location.pathname

  return (
    <header className="header">
      <div className="header-top">
        <span className="header-top-left">🌾 AgroHub — Твоето фермерско пазарче</span>
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
          <Link to="/home" className="nav-link">За Нас</Link>
        </div>
        <Link to="/add-product" className="btn-sell">Публикувай Обява</Link>
      </nav>
    </header>
  )
}