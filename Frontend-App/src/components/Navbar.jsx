import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        <span className="brand-icon">🌾</span>
        <span className="brand-name">AgroHub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>Продукти</Link>
        <Link to="/my-listings" className={`nav-link ${location.pathname === '/my-listings' ? 'active' : ''}`}>Мои обяви</Link>
      </div>
      <div className="navbar-actions">
        <Link to="/login" className="btn-login">Вход</Link>
        <Link to="/add-product" className="btn-sell">+ Продай продукт</Link>
      </div>
    </nav>
  )
}