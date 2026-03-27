import { useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/Community.css'

const CATEGORIES = ['Всички', 'Въпроси', 'Съвети', 'Опит', 'Рецепти', 'Друго']

const mockPosts = [
  {
    id: 1, author: 'Мария Колева', avatar: '👩‍🌾', category: 'Въпроси',
    title: 'Как да се справя с доматена мана?',
    body: 'Тази година доматите ми страдат от мана. Някой има ли опит с биологични методи за борба?',
    likes: 14, answers: 3, time: 'преди 2 часа',
    replies: [
      { author: 'Георги Петров', avatar: '👨‍🌾', text: 'Опитай с меден сулфат — работи страхотно!', likes: 5 },
      { author: 'Елена Иванова', avatar: '🧑‍🌾', text: 'Бакърен оксихлорид е много ефективен при мана.', likes: 3 },
    ]
  },
  {
    id: 2, author: 'Иван Стоянов', avatar: '👨‍🌾', category: 'Съвети',
    title: 'Кога е най-добре да се бере лавандула?',
    body: 'Имам голяма лавандулова градина и искам да знам в кой момент е най-ароматна при берачето.',
    likes: 22, answers: 5, time: 'преди 5 часа',
    replies: [
      { author: 'Петя Димова', avatar: '👩‍🌾', text: 'Бери рано сутринта, когато цветовете са наполовина отворени!', likes: 8 },
    ]
  },
  {
    id: 3, author: 'Стефка Димова', avatar: '👩‍🌾', category: 'Рецепти',
    title: 'Рецепта за домашно сирене от козе мляко',
    body: 'Споделям своята рецепта за вкусно козе сирене, което правя от 20 години. Резултатът е невероятен!',
    likes: 37, answers: 8, time: 'преди 1 ден',
    replies: [
      { author: 'Николай Тодоров', avatar: '👨‍🌾', text: 'Опитах рецептата — перфектно сирене, благодаря!', likes: 6 },
    ]
  },
  {
    id: 4, author: 'Тодор Ангелов', avatar: '🧑‍🌾', category: 'Опит',
    title: 'Моят опит с биологично земеделие',
    body: 'След 5 години биологично земеделие искам да споделя какво работи и какво не работи при нас.',
    likes: 45, answers: 12, time: 'преди 2 дни',
    replies: []
  },
]

export default function Community() {
  const [category, setCategory] = useState('Всички')
  const [posts, setPosts] = useState(mockPosts)
  const [likedPosts, setLikedPosts] = useState({})
  const [likedReplies, setLikedReplies] = useState({})
  const [openPost, setOpenPost] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'Въпроси' })

  const filtered = posts.filter(p => category === 'Всички' || p.category === category)

  const toggleLikePost = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }))
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, likes: likedPosts[id] ? p.likes - 1 : p.likes + 1 }
      : p
    ))
  }

  const toggleLikeReply = (postId, replyIdx) => {
    const key = `${postId}-${replyIdx}`
    setLikedReplies(prev => ({ ...prev, [key]: !prev[key] }))
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const replies = p.replies.map((r, i) => i === replyIdx
        ? { ...r, likes: likedReplies[key] ? r.likes - 1 : r.likes + 1 }
        : r
      )
      return { ...p, replies }
    }))
  }

  const submitReply = (postId) => {
    if (!replyText.trim()) return
    setPosts(prev => prev.map(p => p.id !== postId ? p : {
      ...p,
      answers: p.answers + 1,
      replies: [...p.replies, { author: 'Ти', avatar: '🙂', text: replyText, likes: 0 }]
    }))
    setReplyText('')
  }

  const submitNewPost = () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return
    const post = {
      id: Date.now(), author: 'Ти', avatar: '🙂',
      category: newPost.category, title: newPost.title,
      body: newPost.body, likes: 0, answers: 0,
      time: 'току що', replies: []
    }
    setPosts(prev => [post, ...prev])
    setNewPost({ title: '', body: '', category: 'Въпроси' })
    setShowNewPost(false)
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
        </div>

        {/* CATEGORIES */}
        <div className="community-categories">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* POSTS LIST */}
        <div className="posts-list">
          {filtered.map(post => (
            <div key={post.id} className="post-card" onClick={() => setOpenPost(post.id)}>
              <div className="post-top">
                <span className="post-avatar">{post.avatar}</span>
                <div className="post-meta">
                  <span className="post-author">{post.author}</span>
                  <span className="post-time">{post.time}</span>
                </div>
                <span className="post-category-badge">{post.category}</span>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.body}</p>
              <div className="post-actions" onClick={e => e.stopPropagation()}>
                <button className={`action-btn ${likedPosts[post.id] ? 'liked' : ''}`} onClick={() => toggleLikePost(post.id)}>
                  ❤️ {post.likes}
                </button>
                <button className="action-btn" onClick={() => setOpenPost(post.id)}>
                  💬 {post.answers} отговора
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
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
              <span className="post-avatar">{activePost.avatar}</span>
              <div>
                <span className="post-author">{activePost.author}</span>
                <span className="post-time"> · {activePost.time}</span>
              </div>
              <span className="post-category-badge">{activePost.category}</span>
            </div>
            <h2 className="modal-post-title">{activePost.title}</h2>
            <p className="modal-post-body">{activePost.body}</p>
            <div className="modal-like-row">
              <button className={`action-btn ${likedPosts[activePost.id] ? 'liked' : ''}`} onClick={() => toggleLikePost(activePost.id)}>
                ❤️ {activePost.likes}
              </button>
            </div>

            {/* REPLIES */}
            <div className="replies-section">
              <h4>💬 Отговори ({activePost.replies.length})</h4>
              {activePost.replies.map((r, i) => (
                <div key={i} className="reply-card">
                  <span className="post-avatar" style={{ fontSize: '20px' }}>{r.avatar}</span>
                  <div className="reply-content">
                    <span className="reply-author">{r.author}</span>
                    <p className="reply-text">{r.text}</p>
                    <button
                      className={`action-btn small ${likedReplies[`${activePost.id}-${i}`] ? 'liked' : ''}`}
                      onClick={() => toggleLikeReply(activePost.id, i)}
                    >❤️ {r.likes}</button>
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
              <button className="btn-reply" onClick={() => submitReply(activePost.id)}>Изпрати отговора</button>
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
            <button className="btn-reply" onClick={submitNewPost}>Публикувай</button>
          </div>
        </div>
      )}
    </div>
  )
}