import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import mockProducts from '../data/mockProducts'
import '../styles/Home.css'

const CATEGORIES = ['Всички', 'Зеленчуци', 'Плодове', 'Млечни', 'Пчелни продукти', 'Птицевъдство', 'Напитки']

export default function Home() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Всички')
  const [contactProduct, setContactProduct] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const filtered = mockProducts.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'Всички' || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="page">
      {toast && <div className="toast">✅ {toast}</div>}
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-tag">🌱 Директно от фермата до вашата маса</div>
          <h1 className="hero-title">
            Малки фермери,<br />
            <span className="hero-accent">голяма разлика</span>
          </h1>
          <p className="hero-subtitle">
            Свежи продукти от малки български села — директно от производителя. Без посредници, без комисионни.
          </p>
          <div className="hero-buttons">
            <Link to="/add-product" className="btn-primary-large">🚜 Стани продавач</Link>
            <a href="#products" className="btn-outline-large">Разгледай продуктите ↓</a>
          </div>
          <div className="hero-stats">
            {[['120+', 'Фермери'], ['800+', 'Продукта'], ['50+', 'Села'], ['4.9★', 'Оценка']].map(([n, l]) => (
              <div className="stat" key={l}>
                <span className="stat-num">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-cards-stack">
            {mockProducts.slice(0, 3).map((p, i) => (
              <div className="mini-card" key={p.id} style={{ '--i': i }}>
                <span style={{ fontSize: '28px' }}>{p.emoji}</span>
                <div>
                  <div className="mini-card-name">{p.name}</div>
                  <div className="mini-card-village">{p.village}</div>
                </div>
                <div className="mini-card-price">{p.price.toFixed(2)} лв</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        {[
          { icon: '💰', title: 'Без комисионни', desc: '100% от приходите остават при фермера' },
          { icon: '⚡', title: 'Бързо публикуване', desc: 'Обявата е онлайн за под 2 минути' },
          { icon: '💬', title: 'Директен контакт', desc: 'Свържи се директно с купувача' },
          { icon: '⭐', title: 'Рейтинг система', desc: 'Изгради доверие с честни отзиви' },
        ].map(b => (
          <div className="benefit-card" key={b.title}>
            <div className="benefit-icon">{b.icon}</div>
            <h3 className="benefit-title">{b.title}</h3>
            <p className="benefit-desc">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <div className="section-header">
          <div>
            <h2 className="section-title">Продукти на нашите фермери</h2>
            <p className="section-sub">Открийте свежи продукти от местни земеделци</p>
          </div>
          <Link to="/add-product" className="btn-add">+ Добави обява</Link>
        </div>
        <div className="filters">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Търси продукт, фермер или село..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="categories">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div className="products-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onContact={p => setContactProduct(p)} />
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>🌾</div>
              <p>Няма намерени продукти</p>
              <button onClick={() => { setSearch(''); setCategory('Всички') }} className="btn-reset">Изчисти филтрите</button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Ти си малък фермер?<br /><span style={{ color: '#86efac' }}>Ние сме за теб.</span></h2>
        <p className="cta-sub">Присъедини се към стотици фермери от малки села, които вече продават директно.</p>
        <Link to="/add-product" className="btn-cta">🌱 Публикувай своя първи продукт — безплатно</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🌾 AgroHub</div>
            <p className="footer-desc">Платформа за директна продажба от малки фермери в България.</p>
          </div>
          <div>
            <h4 className="footer-heading">Навигация</h4>
            <div className="footer-links">
              <Link to="/home">Продукти</Link>
              <Link to="/add-product">Продай продукт</Link>
              <Link to="/my-listings">Мои обяви</Link>
              <Link to="/login">Вход</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Контакт</h4>
            <p className="footer-contact">📧 info@agrohub.bg<br />📞 +359 XX XXX XXXX<br />🕐 Пон–Пет: 9:00–18:00</p>
          </div>
        </div>
        <div className="footer-bottom">© 2024 AgroHub · Всички права запазени 🌾</div>
      </footer>

      {/* CONTACT MODAL */}
      {contactProduct && (
        <div className="modal-overlay" onClick={() => setContactProduct(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">💬 Свържи се с фермера</h2>
            <p className="modal-sub">Относно: <strong>{contactProduct.name}</strong> от {contactProduct.farmer}</p>
            <div className="modal-phone">📞 {contactProduct.phone}</div>
            <div className="form-group"><label>Твоето име</label><input type="text" placeholder="Иван Иванов" /></div>
            <div className="form-group"><label>Имейл или телефон</label><input type="text" placeholder="ivan@example.com" /></div>
            <div className="form-group"><label>Съобщение</label><textarea rows={3} placeholder="Здравейте, интересувам се..." /></div>
            <div className="modal-actions">
              <button className="btn-send" onClick={() => { setContactProduct(null); showToast('Съобщението е изпратено!') }}>Изпрати</button>
              <button className="btn-cancel" onClick={() => setContactProduct(null)}>Затвори</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}