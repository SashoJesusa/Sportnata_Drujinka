import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Coalitions.css'

const mockCoalitions = [
  {
    id: 1,
    title: 'Пресни домати за Kaufland',
    organizer: 'Иван Петров',
    organizerAvatar: '👨‍🌾',
    village: 'с. Розово',
    product: 'Домати',
    category: 'Зеленчуци',
    targetQty: 5000,
    currentQty: 3200,
    unit: 'кг',
    pricePerUnit: 1.80,
    retailPrice: 0.60,
    deadline: '2024-08-15',
    buyer: 'Kaufland България',
    buyerLogo: '🏪',
    farmers: [
      { name: 'Иван Петров', qty: 1500, avatar: '👨‍🌾' },
      { name: 'Мария Колева', qty: 900, avatar: '👩‍🌾' },
      { name: 'Стоян Димов', qty: 800, avatar: '🧑‍🌾' },
    ],
    description: 'Обединяваме производители на домати за да доставим 5 тона пресни домати на Kaufland. Цената е 3 пъти по-висока от тази на посредниците.',
    phone: '+359 888 111 222',
  },
  {
    id: 2,
    title: 'Пчелен мед — експорт Германия',
    organizer: 'Мария Георгиева',
    organizerAvatar: '👩‍🌾',
    village: 'с. Брезово',
    product: 'Мед',
    category: 'Пчелни продукти',
    targetQty: 2000,
    currentQty: 1100,
    unit: 'кг',
    pricePerUnit: 14.00,
    retailPrice: 5.00,
    deadline: '2024-09-01',
    buyer: 'BioMarkt GmbH',
    buyerLogo: '🇩🇪',
    farmers: [
      { name: 'Мария Георгиева', qty: 600, avatar: '👩‍🌾' },
      { name: 'Тодор Ангелов', qty: 500, avatar: '👨‍🌾' },
    ],
    description: 'Германски биомагазин търси 2 тона натурален български мед. Обединяваме пчелари от Розовата долина за директен износ.',
    phone: '+359 888 333 444',
  },
  {
    id: 3,
    title: 'Ябълки Голдън — Метро',
    organizer: 'Георги Николов',
    organizerAvatar: '🧑‍🌾',
    village: 'с. Клисура',
    product: 'Ябълки',
    category: 'Плодове',
    targetQty: 8000,
    currentQty: 7600,
    unit: 'кг',
    pricePerUnit: 1.40,
    retailPrice: 0.45,
    deadline: '2024-08-20',
    buyer: 'Метро България',
    buyerLogo: '🏬',
    farmers: [
      { name: 'Георги Николов', qty: 3000, avatar: '🧑‍🌾' },
      { name: 'Елена Стоянова', qty: 2500, avatar: '👩‍🌾' },
      { name: 'Петър Василев', qty: 2100, avatar: '👨‍🌾' },
    ],
    description: 'Почти сме готови! Нужни са само още 400 кг за да финализираме договора с Метро. Присъедини се сега.',
    phone: '+359 888 999 000',
  },
  {
    id: 4,
    title: 'Козе сирене — ресторанти София',
    organizer: 'Надя Христова',
    organizerAvatar: '👩‍🌾',
    village: 'с. Баня',
    product: 'Козе сирене',
    category: 'Млечни',
    targetQty: 500,
    currentQty: 120,
    unit: 'кг',
    pricePerUnit: 18.00,
    retailPrice: 7.00,
    deadline: '2024-09-15',
    buyer: 'Ресторантска верига',
    buyerLogo: '🍽️',
    farmers: [
      { name: 'Надя Христова', qty: 120, avatar: '👩‍🌾' },
    ],
    description: 'Верига ресторанти в София търси редовен доставчик на козе сирене. Нужни са повече производители за да покрием месечните нужди.',
    phone: '+359 877 111 222',
  },
]

const CATEGORIES = ['Всички', 'Зеленчуци', 'Плодове', 'Млечни', 'Пчелни продукти', 'Птицевъдство']

export default function Coalitions() {
  const navigate = useNavigate()
  const [showLoginNotice, setShowLoginNotice] = useState(false)
  const [category, setCategory] = useState('Всички')
  const [coalitions, setCoalitions] = useState(mockCoalitions)
  const [joinedMap, setJoinedMap] = useState({})
  const [openDetail, setOpenDetail] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [joinForm, setJoinForm] = useState({ qty: '', name: '' })
  const [newCoalition, setNewCoalition] = useState({
    title: '', product: '', category: 'Зеленчуци',
    targetQty: '', unit: 'кг', pricePerUnit: '',
    buyer: '', deadline: '', description: ''
  })

  const filtered = coalitions.filter(c => category === 'Всички' || c.category === category)
  const getProgress = (c) => Math.min(100, Math.round((c.currentQty / c.targetQty) * 100))
  const handleFooterLoginClick = (e) => {
    const savedUser = localStorage.getItem('user')
    const sessionId = localStorage.getItem('sessionId')

    if (savedUser && sessionId) {
      e.preventDefault()
      setShowLoginNotice(true)
    }
  }

  const handleJoin = (coalitionId) => {
    const qty = Number(joinForm.qty)
    if (!qty || qty <= 0 || !joinForm.name.trim()) return
    setCoalitions(prev => prev.map(c => c.id !== coalitionId ? c : {
      ...c,
      currentQty: c.currentQty + qty,
      farmers: [...c.farmers, { name: joinForm.name, qty, avatar: '🙂' }]
    }))
    setJoinedMap(prev => ({ ...prev, [coalitionId]: true }))
    setJoinForm({ qty: '', name: '' })
  }

  const handleCreate = () => {
    if (!newCoalition.title.trim() || !newCoalition.targetQty) return
    const c = {
      id: Date.now(),
      ...newCoalition,
      targetQty: Number(newCoalition.targetQty),
      pricePerUnit: Number(newCoalition.pricePerUnit),
      retailPrice: 0,
      currentQty: 0,
      organizer: 'Ти',
      organizerAvatar: '🙂',
      village: 'Твоето село',
      buyerLogo: '🏪',
      farmers: [],
      phone: '',
    }
    setCoalitions(prev => [c, ...prev])
    setShowCreate(false)
    setNewCoalition({ title: '', product: '', category: 'Зеленчуци', targetQty: '', unit: 'кг', pricePerUnit: '', buyer: '', deadline: '', description: '' })
  }

  const activeCoalition = coalitions.find(c => c.id === openDetail)

  return (
    <div className="coalitions-container">
      <Navbar onAction={(a) => a === 'new-coalition' && setShowCreate(true)} />
      <div className="coalitions-wrapper">

        {/* HEADER */}
        <div className="coalitions-hero">
          <div className="coalitions-hero-text">
            <span className="coalitions-tag">🤝 Сила в единството</span>
            <h1>Кампани</h1>
            <p>Обединете се с други фермери, достигнете нужното количество и продавайте директно на големи вериги — на <strong>справедливи цени</strong>.</p>
            <div className="hero-stats-row">
              <div className="hero-stat"><span>3×</span><small>по-висока цена</small></div>
              <div className="hero-stat"><span>120+</span><small>фермери в мрежата</small></div>
              <div className="hero-stat"><span>4</span><small>активни кампании</small></div>
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="coalitions-categories">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* LIST */}
        <div className="coalitions-list">
          {filtered.map(coal => {
            const pct = getProgress(coal)
            return (
              <div key={coal.id} className="coalition-row">
                <div className="coalition-row-main">
                  <div className="coalition-row-left">
                    <div className="coalition-row-top">
                      <span className="coalition-category-badge">{coal.category}</span>
                      {pct >= 90 && <span className="coalition-hot">🔥 Почти готово</span>}
                      {joinedMap[coal.id] && <span className="coalition-joined-tag">✅ Присъединен</span>}
                    </div>
                    <h3 className="coalition-row-title">{coal.title}</h3>
                    <div className="coalition-row-meta">
                      <span>{coal.organizerAvatar} {coal.organizer}</span>
                      <span>📍 {coal.village}</span>
                      <span>{coal.buyerLogo} {coal.buyer}</span>
                      <span>📅 {coal.deadline}</span>
                    </div>
                    <p className="coalition-row-desc">{coal.description}</p>
                  </div>

                  <div className="coalition-row-right">
                    <div className="coalition-prices">
                      <div className="price-block">
                        <span className="price-lbl">Коалиционна цена</span>
                        <span className="price-big green">{coal.pricePerUnit.toFixed(2)} €/{coal.unit}</span>
                      </div>
                      <div className="price-divider">vs</div>
                      <div className="price-block">
                        <span className="price-lbl">Цена на посредник</span>
                        <span className="price-big red">{coal.retailPrice.toFixed(2)} €/{coal.unit}</span>
                      </div>
                    </div>
                    <div className="coalition-farmers-count">
                      👥 {coal.farmers.length} фермери
                    </div>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="coalition-progress-wrap">
                  <div className="progress-labels">
                    <span>{coal.currentQty.toLocaleString()} {coal.unit} събрани</span>
                    <span className="progress-pct" style={{ color: pct >= 90 ? '#f59e0b' : '#15803d' }}>{pct}%</span>
                    <span>Цел: {coal.targetQty.toLocaleString()} {coal.unit}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? '#f59e0b' : '#15803d' }} />
                  </div>
                </div>

                <div className="coalition-row-actions">
                  <button className="btn-details-coal" onClick={() => setOpenDetail(coal.id)}>Виж детайли</button>
                  <button
                    className={`btn-join ${joinedMap[coal.id] ? 'joined' : ''}`}
                    onClick={() => setOpenDetail(coal.id)}
                    disabled={joinedMap[coal.id]}
                  >
                    {joinedMap[coal.id] ? '✅ Присъединен' : '🤝 Присъедини се'}
                  </button>
                  <a href={`tel:${coal.phone}`} className="btn-call">📞 Контакт</a>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="empty-coalitions">
              <div style={{ fontSize: '48px' }}>🌾</div>
              <p>Няма активни коалиции в тази категория</p>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {activeCoalition && (
        <div className="modal-overlay" onClick={() => setOpenDetail(null)}>
          <div className="modal-coalition" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenDetail(null)}>✕</button>
            <div className="modal-coalition-body">
              <span className="coalition-category-badge">{activeCoalition.category}</span>
              <h2>{activeCoalition.title}</h2>
              <p className="coalition-organizer-line">{activeCoalition.organizerAvatar} {activeCoalition.organizer} · 📍 {activeCoalition.village} · {activeCoalition.buyerLogo} {activeCoalition.buyer}</p>
              <p className="modal-description">{activeCoalition.description}</p>

              <div className="modal-prices">
                <div className="price-block">
                  <span className="price-lbl">Коалиционна цена</span>
                  <span className="price-big green">{activeCoalition.pricePerUnit.toFixed(2)} €/{activeCoalition.unit}</span>
                </div>
                <div className="price-divider">vs</div>
                <div className="price-block">
                  <span className="price-lbl">Цена на посредник</span>
                  <span className="price-big red">{activeCoalition.retailPrice.toFixed(2)} €/{activeCoalition.unit}</span>
                </div>
              </div>

              <div className="coalition-progress-wrap">
                <div className="progress-labels">
                  <span>{activeCoalition.currentQty.toLocaleString()} {activeCoalition.unit}</span>
                  <span className="progress-pct">{getProgress(activeCoalition)}%</span>
                  <span>{activeCoalition.targetQty.toLocaleString()} {activeCoalition.unit}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${getProgress(activeCoalition)}%` }} />
                </div>
              </div>

              <div className="farmers-list">
                <h4>🌾 Присъединени фермери ({activeCoalition.farmers.length})</h4>
                {activeCoalition.farmers.map((f, i) => (
                  <div key={i} className="farmer-row">
                    <span>{f.avatar} {f.name}</span>
                    <span className="farmer-qty">{f.qty.toLocaleString()} {activeCoalition.unit}</span>
                  </div>
                ))}
                {activeCoalition.farmers.length === 0 && <p className="no-farmers">Бъди първият фермер!</p>}
              </div>

              <div className="modal-contact-box">📞 Организатор: <strong>{activeCoalition.phone}</strong></div>

              {!joinedMap[activeCoalition.id] ? (
                <div className="join-form">
                  <h4>🤝 Присъедини се към коалицията</h4>
                  <input className="form-input" placeholder="Твоето име" value={joinForm.name} onChange={e => setJoinForm({ ...joinForm, name: e.target.value })} />
                  <div className="join-qty-row">
                    <input className="form-input" type="number" min="1" placeholder={`Количество (${activeCoalition.unit})`} value={joinForm.qty} onChange={e => setJoinForm({ ...joinForm, qty: e.target.value })} />
                    <button className="btn-join-confirm" onClick={() => handleJoin(activeCoalition.id)}>Потвърди</button>
                  </div>
                </div>
              ) : (
                <div className="joined-success">✅ Вече си част от тази коалиция!</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-coalition" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            <div className="modal-coalition-body">
              <h2>🤝 Създай коалиция</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Обяви нужда от партньори и привлечи купувач заедно.</p>
              <div className="form-group"><label>Заглавие</label><input className="form-input" placeholder="напр. Домати за Kaufland" value={newCoalition.title} onChange={e => setNewCoalition({ ...newCoalition, title: e.target.value })} /></div>
              <div className="form-row-two">
                <div className="form-group"><label>Продукт</label><input className="form-input" placeholder="напр. Домати" value={newCoalition.product} onChange={e => setNewCoalition({ ...newCoalition, product: e.target.value })} /></div>
                <div className="form-group"><label>Категория</label>
                  <select className="form-select" value={newCoalition.category} onChange={e => setNewCoalition({ ...newCoalition, category: e.target.value })}>
                    {['Зеленчуци','Плодове','Млечни','Пчелни продукти','Птицевъдство','Напитки'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row-two">
                <div className="form-group"><label>Целево количество</label><input className="form-input" type="number" placeholder="5000" value={newCoalition.targetQty} onChange={e => setNewCoalition({ ...newCoalition, targetQty: e.target.value })} /></div>
                <div className="form-group"><label>Единица</label>
                  <select className="form-select" value={newCoalition.unit} onChange={e => setNewCoalition({ ...newCoalition, unit: e.target.value })}>
                    {['кг','бр','л','г','т'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row-two">
                <div className="form-group"><label>Очаквана цена (€)</label><input className="form-input" type="number" step="0.01" placeholder="1.80" value={newCoalition.pricePerUnit} onChange={e => setNewCoalition({ ...newCoalition, pricePerUnit: e.target.value })} /></div>
                <div className="form-group"><label>Краен срок</label><input className="form-input" type="date" value={newCoalition.deadline} onChange={e => setNewCoalition({ ...newCoalition, deadline: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Купувач</label><input className="form-input" placeholder="напр. Kaufland, Метро..." value={newCoalition.buyer} onChange={e => setNewCoalition({ ...newCoalition, buyer: e.target.value })} /></div>
              <div className="form-group"><label>Описание</label><textarea className="form-textarea" rows={3} placeholder="Опиши коалицията..." value={newCoalition.description} onChange={e => setNewCoalition({ ...newCoalition, description: e.target.value })} /></div>
              <button className="btn-create-submit" onClick={handleCreate}>🤝 Публикувай коалицията</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer" id="site-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🌾 AgroHub</div>
            <p className="footer-desc">Платформа за директна продажба от малки фермери в България.</p>
          </div>
          <div>
            <h4 className="footer-heading">Навигация</h4>
            <div className="footer-links">
              <Link to="/add-product">Продай продукт</Link>
              <Link to="/my-listings">Мои обяви</Link>
              <Link to="/login" onClick={handleFooterLoginClick}>Вход</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Контакт</h4>
            <p className="footer-contact">📧 info@agrohub.bg<br />📞 +359 87 456 7898<br /></p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 AgroHub · Всички права запазени 🌾</div>
      </footer>

      {showLoginNotice && (
        <div className="login-notice-overlay" onClick={() => setShowLoginNotice(false)}>
          <div className="login-notice-modal" onClick={e => e.stopPropagation()}>
            <h3>✅ Вече си логнат</h3>
            <p>Нямаш нужда да влизаш отново.</p>
            <button className="login-notice-btn" onClick={() => setShowLoginNotice(false)}>Разбрах</button>
          </div>
        </div>
      )}
    </div>
  )
}