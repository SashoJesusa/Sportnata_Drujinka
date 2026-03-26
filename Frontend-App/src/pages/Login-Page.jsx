import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData({ ...loginData, [name]: value })
    if (errors.login) setErrors({ ...errors, login: '' })
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData({ ...registerData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!loginData.email.trim()) {
      newErrors.email = 'Имейлът е задължителен'
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Моля, въведи валиден имейл'
    }

    if (!loginData.password.trim()) {
      newErrors.password = 'Паролата е задължителна'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSuccessMsg('✅ Успешен вход! Пренасочване...')
    setTimeout(() => navigate('/home'), 1500)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!registerData.name.trim()) {
      newErrors.name = 'Пълното име е задължително'
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'Имейлът е задължителен'
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Моля, въведи валиден имейл'
    }

    if (!registerData.password.trim()) {
      newErrors.password = 'Паролата е задължителна'
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Паролата трябва да е минимум 8 символа'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSuccessMsg('✅ Регистрацията е успешна! Пренасочване...')
    setTimeout(() => navigate('/home'), 1500)
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌾</div>
          <div className="login-title">AgroHub</div>
        </div>
        <div className="login-tabs">
          {['login','register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErrors({}); setSuccessMsg('') }} className={`tab-button ${tab === t ? 'active' : ''}`}>
              {t === 'login' ? 'Вход' : 'Регистрация'}
            </button>
          ))}
        </div>

        {successMsg && <div className="success-message">{successMsg}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Имейл <span className="required">*</span></label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                placeholder="ivan@example.com"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Парола <span className="required">*</span></label>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit" className="btn-submit">Влез в акаунта</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Пълно име <span className="required">*</span></label>
              <input
                className={`form-input ${errors.name ? 'error' : ''}`}
                type="text"
                name="name"
                placeholder="Иван Петров"
                value={registerData.name}
                onChange={handleRegisterChange}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Имейл <span className="required">*</span></label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                placeholder="ivan@example.com"
                value={registerData.email}
                onChange={handleRegisterChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Парола <span className="required">*</span></label>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                type="password"
                name="password"
                placeholder="Мин. 8 символа"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit" className="btn-submit">Създай акаунт</button>
          </form>
        )}

        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home') }} className="back-to-site-link">← Обратно към сайта</a>
      </div>
    </div>
  )
}