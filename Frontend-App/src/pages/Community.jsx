import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { buildApiUrl } from '../config/api'
import '../styles/Community.css'

const CATEGORIES = ['Всички', 'Въпроси', 'Съвети', 'Опит', 'Рецепти', 'Друго']

export default function Community() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('Всички')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [replyingPostId, setReplyingPostId] = useState(null)
  const [openPost, setOpenPost] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'Въпроси' })

  const getSessionId = () => localStorage.getItem('sessionId')

  const loadPosts = async () => {
    try {
      setError('')
      const response = await axios.get(buildApiUrl('/posts'))
      setPosts(response.data?.posts || [])
    } catch (err) {
      setError(err?.response?.data?.error || 'Не успяхме да заредим постовете.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const filtered = posts.filter(p => category === 'Всички' || p.category === category)

  const submitReply = async (postId) => {
    if (!replyText.trim()) return

    const sessionId = getSessionId()
    if (!sessionId) {
      navigate('/login')
      return
    }

    try {
      setActionError('')
      setReplyingPostId(postId)
      await axios.post(
        buildApiUrl(`/posts/${postId}/replies`),
        { text: replyText.trim() },
        { headers: { 'X-Session-Id': sessionId } }
      )

      setReplyText('')
      await loadPosts()
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('user')
        localStorage.removeItem('sessionId')
        navigate('/login')
        return
      }

      setActionError(err?.response?.data?.error || 'Грешка при добавяне на отговор.')
    } finally {
      setReplyingPostId(null)
    }
  }

  const submitNewPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return

    const sessionId = getSessionId()
    if (!sessionId) {
      navigate('/login')
      return
    }

    try {
      setActionError('')
      setIsSubmittingPost(true)
      await axios.post(
        buildApiUrl('/posts'),
        {
          title: newPost.title.trim(),
          text: newPost.body.trim(),
          category: newPost.category,
        },
        { headers: { 'X-Session-Id': sessionId } }
      )

      setNewPost({ title: '', body: '', category: 'Въпроси' })
      setShowNewPost(false)
      await loadPosts()
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('user')
        localStorage.removeItem('sessionId')
        navigate('/login')
        return
      }

      setActionError(err?.response?.data?.error || 'Грешка при създаване на пост.')
    } finally {
      setIsSubmittingPost(false)
    }
  }

  const activePost = posts.find(p => p.id === openPost)

  return (
    <div className="community-container">
      <Navbar onAction={(a) => a === 'new-post' && setShowNewPost(true)} />
      <div className="community-wrapper">

        {/* HEADER */}
        <div className="community-header">
          <div>
            <h1>🌿 Общност</h1>
            <p>Споделяй опит, задавай въпроси и помагай на другите фермери</p>
          </div>
          <button className="btn-new-post" onClick={() => setShowNewPost(true)}>+ Нов пост</button>
        </div>

        {actionError && <div className="community-error">{actionError}</div>}
        {error && <div className="community-error">{error}</div>}

        {/* CATEGORIES */}
        <div className="community-categories">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* POSTS LIST */}
        <div className="posts-list">
          {!error && loading && (
            <div className="empty-community">
              <p>Зареждане на постовете...</p>
            </div>
          )}

          {filtered.map(post => (
            <div key={post.id} className="post-card" onClick={() => setOpenPost(post.id)}>
              <div className="post-top">
                <span className="post-avatar">🌾</span>
                <div className="post-meta">
                  <span className="post-author">{post.username || 'Анонимен потребител'}</span>
                  <span className="post-time">Пост #{post.id}</span>
                </div>
                <span className="post-category-badge">{post.category}</span>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.text}</p>
              <div className="post-actions" onClick={e => e.stopPropagation()}>
                <button className="action-btn" onClick={() => setOpenPost(post.id)}>
                  💬 {post.replies?.length || 0} отговора
                </button>
              </div>
            </div>
          ))}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty-community">
              <div style={{ fontSize: '48px' }}>🌱</div>
              <p>Няма постове в тази категория</p>
            </div>
          )}
        </div>
      </div>

      {/* POST DETAIL MODAL */}
      {activePost && (
        <div className="modal-overlay" onClick={() => setOpenPost(null)}>
          <div className="modal-community" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenPost(null)}>✕</button>
            <div className="modal-post-top">
              <span className="post-avatar">🌾</span>
              <div>
                <span className="post-author">{activePost.username || 'Анонимен потребител'}</span>
                <span className="post-time"> · Пост #{activePost.id}</span>
              </div>
              <span className="post-category-badge">{activePost.category}</span>
            </div>
            <h2 className="modal-post-title">{activePost.title}</h2>
            <p className="modal-post-body">{activePost.text}</p>

            {/* REPLIES */}
            <div className="replies-section">
              <h4>💬 Отговори ({activePost.replies.length})</h4>
              {activePost.replies.map((r, i) => (
                <div key={i} className="reply-card">
                  <span className="post-avatar" style={{ fontSize: '20px' }}>🌱</span>
                  <div className="reply-content">
                    <span className="reply-author">{r.username || 'Анонимен потребител'}</span>
                    <p className="reply-text">{r.text}</p>
                  </div>
                </div>
              ))}
              {activePost.replies.length === 0 && <p className="no-replies">Бъди първият, който отговаря!</p>}
            </div>

            {/* REPLY INPUT */}
            <div className="reply-input-section">
              <textarea
                rows={3}
                placeholder="Напиши своя отговор..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="reply-textarea"
              />
              <button
                className="btn-reply"
                onClick={() => submitReply(activePost.id)}
                disabled={replyingPostId === activePost.id}
              >
                {replyingPostId === activePost.id ? 'Изпращане...' : 'Изпрати отговора'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW POST MODAL */}
      {showNewPost && (
        <div className="modal-overlay" onClick={() => setShowNewPost(false)}>
          <div className="modal-community" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNewPost(false)}>✕</button>
            <h2 className="modal-post-title">✍️ Нов пост</h2>
            <div className="form-group">
              <label>Категория</label>
              <select className="form-select" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
                {CATEGORIES.filter(c => c !== 'Всички').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Заглавие</label>
              <input className="form-input" placeholder="Накратко за какво е постът..." value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Съдържание</label>
              <textarea className="reply-textarea" rows={5} placeholder="Опиши въпроса или опита си подробно..." value={newPost.body} onChange={e => setNewPost({ ...newPost, body: e.target.value })} />
            </div>
            <button className="btn-reply" onClick={submitNewPost} disabled={isSubmittingPost}>
              {isSubmittingPost ? 'Публикуване...' : 'Публикувай'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}