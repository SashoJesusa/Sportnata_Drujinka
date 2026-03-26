import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌾</div>
          <div className="login-title">AgroHub</div>
        </div>
        <div className="login-tabs">
          {['login','register'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-button ${tab === t ? 'active' : ''}`}>
              {t === 'login' ? 'Вход' : 'Регистрация'}
            </button>
          ))}
        </div>
        {tab === 'login' ? (
          <>
            <div className="form-group">
              <label className="form-label">Имейл</label>
              <input className="form-input" type="email" placeholder="ivan@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Парола</label>
              <input className="form-input" type="password" placeholder="••••••••" />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Пълно име</label>
              <input className="form-input" type="text" placeholder="Иван Петров" />
            </div>
            <div className="form-group">
              <label className="form-label">Имейл</label>
              <input className="form-input" type="email" placeholder="ivan@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Парола</label>
              <input className="form-input" type="password" placeholder="Мин. 8 символа" />
            </div>
            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input className="form-input" type="text" placeholder="+359 88..." />
            </div>
          </>
        )}
        <button onClick={() => navigate('/home')} className="btn-submit">
          {tab === 'login' ? 'Влез в акаунта' : 'Създай акаунт'}
        </button>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home') }} className="back-to-site-link">← Обратно към сайта</a>
      </div>
    </div>
  )
}