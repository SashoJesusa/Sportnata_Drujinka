import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/AddProduct.css'

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', category: '', price: '', unit: 'кг', village: '', description: '', phone: '' })
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = e => { e.preventDefault(); alert('Обявата е публикувана! 🎉'); navigate('/home') }

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
              <label>Село / Град</label>
              <input className="form-input" name="village" placeholder="напр. с. Розово" value={form.village} onChange={handle} required />
            </div>

            
            <div className="form-group">
              <label>Описание</label>
              <textarea className="form-textarea" name="description" rows={4} placeholder="Напр. телефона ми е...; цената е...; " value={form.description} onChange={handle} />
              
            </div>

            <button type="submit" className="btn-submit">
              🌱 Публикувай обявата
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}