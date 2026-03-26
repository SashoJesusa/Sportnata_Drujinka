import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // Добавено
import '../styles/LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData({ ...loginData, [name]: value })
    if (errors.general) setErrors({ ...errors, general: '' })
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData({ ...registerData, [name]: value })
    if (errors[name] || errors.general) setErrors({ ...errors, [name]: '', general: '' })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!validateEmail(loginData.email)) newErrors.email = 'Невалиден имейл'
    if (!loginData.password) newErrors.password = 'Паролата е задължителна'

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)

    try {
      const res = await axios.post('http://localhost:4000/login', loginData)
      if (res.data.success) {
        setSuccessMsg('✅ Успешен вход! Пренасочване...')
        setTimeout(() => navigate('/home'), 500)
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Грешка при вход' })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!registerData.name.trim()) newErrors.name = 'Името е задължително'
    if (!validateEmail(registerData.email)) newErrors.email = 'Невалиден имейл'
    if (registerData.password.length < 8) newErrors.password = 'Минимум 8 символа'

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)

    try {
      const res = await axios.post('http://localhost:4000/register', {
        username: registerData.name,
        email: registerData.email,
        password: registerData.password
      })
      if (res.data.success) {
        setSuccessMsg('✅ Регистрацията е успешна! Пренасочване...')
        setTimeout(() => navigate('/home'), 1500)
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Грешка при регистрация' })
    }
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
        {errors.general && <div className="error-message" style={{textAlign:'center', marginBottom: '10px'}}>{errors.general}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Имейл <span className="required">*</span></label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" value={loginData.email} onChange={handleLoginChange} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Парола <span className="required">*</span></label>
              <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" name="password" value={loginData.password} onChange={handleLoginChange} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit" className="btn-submit">Влез в акаунта</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Пълно име <span className="required">*</span></label>
              <input className={`form-input ${errors.name ? 'error' : ''}`} type="text" name="name" value={registerData.name} onChange={handleRegisterChange} />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Имейл <span className="required">*</span></label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" value={registerData.email} onChange={handleRegisterChange} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Парола <span className="required">*</span></label>
              <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" name="password" value={registerData.password} onChange={handleRegisterChange} />
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