import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import '../styles/Home.css'

const CATEGORIES = [
  'Всички',
  'Зеленчуци',
  'Плодове',
  'Зърнени храни',
  'Животновъдство',
  'Млечни продукти',
  'Билки и подправки',
  'Друго'
]

const CATEGORY_EMOJI = {
  'Зеленчуци': '🥕',
  'Плодове': '🍎',
  'Зърнени храни': '🌾',
  'Животновъдство': '🐄',
  'Млечни продукти': '🧀',
  'Билки и подправки': '🌿',
  'Друго': '📦',
}

export default function Home() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Всички')
  const [contactProduct, setContactProduct] = useState(null)
  const [toast, setToast] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    if (location.hash === '#site-footer') {
      const footer = document.getElementById('site-footer')
      if (footer) {
        setTimeout(() => footer.scrollIntoView({ behavior: 'smooth' }), 0)
      }
    }
  }, [location.hash])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsError('')
        const response = await fetch('http://localhost:4000/all-products')
        const contentType = response.headers.get('content-type') || ''
        const rawBody = await response.text()

        if (!contentType.includes('application/json')) {
          throw new Error('Сървърът не върна JSON. Провери дали backend е стартиран на порт 4000.')
        }

        let result
        try {
          result = JSON.parse(rawBody)
        } catch {
          throw new Error('Невалиден JSON от сървъра. Провери backend логовете.')
        }

        if (!response.ok || !result?.success) {
          throw new Error(result?.error || 'Неуспешно зареждане на обявите.')
        }

        setProducts(Array.isArray(result.products) ? result.products : [])
      } catch (err) {
        setProductsError(err.message || 'Неуспешно зареждане на обявите.')
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const normalizedProducts = products.map((p) => {
    const resolvedId =
      p.id ??
      p.offer_id ??
      p.product_id ??
      p.productId ??
      p.listing_id ??
      p.ad_id ??
      null

    const normalizedCategory = p.category || 'Друго'
    const fallbackName = p.product || p.name || 'Непознат продукт'
    const fallbackFarmer = p.username || (p.user_id ? `Потребител #${p.user_id}` : 'Локален производител')

    return {
      id: resolvedId,
      name: fallbackName,
      farmer: fallbackFarmer,
      village: p.region || 'България',
      price: Number(p.price) || 0,
      unit: 'кг',
      rating: 5,
      reviews: 0,
      emoji: CATEGORY_EMOJI[normalizedCategory] || '🌾',
      category: normalizedCategory,
      badge: 'Нова обява',
      description: p.description || 'Свежа фермерска продукция.',
      phone: p.phone || 'Свържете се чрез платформата',
      imageUrl: p.image_url || null,
    }
  }).filter((p) => p.id !== null && p.id !== undefined)

  const filtered = normalizedProducts.filter(p => {
    const query = search.toLowerCase()
    const matchSearch =
      p.name.toLowerCase().includes(query) ||
      p.farmer.toLowerCase().includes(query) ||
      p.village.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    const matchCategory = category === 'Всички' || p.category === category
    return matchSearch && matchCategory
  })


  return (
    <div className="page">
      {toast && <div className="toast">✅ {toast}</div>}
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Свежи продукти<br /><span className="hero-accent">директно от фермата</span></h1>
          <p className="hero-subtitle">Намери местни земеделци и купи директно — без посредници.</p>
          <div className="hero-search">
            <input className="hero-search-input" placeholder="Търси фермерски продукти" value={search} onChange={e => setSearch(e.target.value)} />
            <button className="hero-search-btn">🔍 Търси</button>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="cat-cards-section">
        {[
          { label: 'Местна Продукция', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80', cat: 'Пчелни продукти' },
          { label: 'Млечни продукти', img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=300&q=80', cat: 'Млечни' },
          { label: 'Плодове', img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=80', cat: 'Плодове' },
          { label: 'Зеленчуци', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&q=80', cat: 'Зеленчуци' },
        ].map(c => (
          <div key={c.label} className="cat-card" onClick={() => setCategory(c.cat)}>
            <img src={c.img} alt={c.label} className="cat-card-img" />
            <div className="cat-card-label">{c.label}</div>
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
        </div>
        <div className="filters">
          <div className="categories">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        {productsError && <div className="products-state products-error">⚠️ {productsError}</div>}

        {!productsError && isLoadingProducts && (
          <div className="products-state">Зареждане на обявите от базата...</div>
        )}

        {!productsError && !isLoadingProducts && (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onContact={p => setContactProduct(p)} />
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>🌾</div>
                <p>Няма намерени продукти по тези филтри</p>
                <button onClick={() => { setSearch(''); setCategory('Всички') }} className="btn-reset">Изчисти филтрите</button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer" id="site-footer">
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
            <p className="footer-contact">📧 info@agrohub.bg<br />📞 +359 87 456 7898<br /></p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 AgroHub · Всички права запазени 🌾</div>
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