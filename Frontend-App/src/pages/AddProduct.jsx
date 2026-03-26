import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'
import '../styles/AddProduct.css'

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', category: '', price: '', unit: 'кг', village: '', description: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    const user = localStorage.getItem('user')
    const sessionId = localStorage.getItem('sessionId')
    
    if (!user || !sessionId) {
      navigate('/login')
    } else {
      setLoading(false)
    }
  }, [navigate])
  
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const submit = async e => { 
    e.preventDefault()
    setSubmitting(true)
    try {
      const sessionId = localStorage.getItem('sessionId')
      await axios.post('http://localhost:4000/add-product', {
        ...form,
        sessionId: sessionId
      })
      alert('Обявата е публикувана! 🎉')
      navigate('/home')
    } catch (err) {
      alert('Грешка при публикуване на обявата')
    }
    setSubmitting(false)
  }

  if (loading) return <div><Navbar /></div>

  return (
    <div className="add-product-container">
      <Navbar />
      <div className="add-product-wrapper">
        <div className="add-product-header">
          <h1>📦 Добави продукт</h1>
          <p>Публикувай своята обява и намери купувачи директно</p>
        </div>
        <div className="add-product-form-container">
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Наименование</label>
              <input className="form-input" name="name" placeholder="напр. Пресни домати" value={form.name} onChange={handle} required />
            </div>

            <div className="form-group">
              <label>Категория</label>
              <select className="form-select" name="category" value={form.category} onChange={handle} required>
                <option value="">-- Избери категория --</option>
                {['Зеленчуци','Плодове','Млечни','Пчелни продукти','Птицевъдство','Напитки','Друго'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Цена (лв)</label>
                <input className="form-input" name="price" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>Единица</label>
                <select className="form-select" name="unit" value={form.unit} onChange={handle}>
                  {['кг','бр','л','г'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Село / Град</label>
              <input className="form-input" name="village" placeholder="напр. с. Розово" value={form.village} onChange={handle} required />
            </div>

            <div className="form-group">
              <label>Телефон</label>
              <input className="form-input" name="phone" placeholder="+359 88 XXX XXXX" value={form.phone} onChange={handle} />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea className="form-textarea" name="description" rows={4} placeholder="Опиши своя продукт..." value={form.description} onChange={handle} />
            </div>

            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? '⏳ Публикуване...' : '🌱 Публикувай обявата'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}