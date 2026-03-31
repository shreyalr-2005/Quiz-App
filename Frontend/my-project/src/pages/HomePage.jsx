import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function HomePage({ user, onLogout }) {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err))
  }, [])

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>🏆 QuizMaster</h1>
        <div className="user-info">
          <Link to="/leaderboard" className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>📊 Scoreboard</Link>
          {user ? (
            <>
              <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span>{user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/signup" className="btn-outline" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <div className="welcome-text">
        <h2>Explore Our Courses</h2>
        <p>
          {user 
            ? `Welcome back, ${user.name}! Pick a course, choose your difficulty, and test your knowledge.`
            : 'Browse our courses below. Login to start a quiz!'}
        </p>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <Link
            to={`/course/${cat.id}`}
            key={cat.id}
            className="category-card glass-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="category-icon">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <div className="card-bottom-row">
              <span className="category-badge" style={{
                background: `${cat.color}22`,
                color: cat.color,
                border: `1px solid ${cat.color}44`
              }}>
                {cat.questionCount} Questions
              </span>
              <span className="difficulty-dots">
                <span className="dot dot-easy" title="Easy">🟢 {cat.easyCt}</span>
                <span className="dot dot-med" title="Medium">🟡 {cat.mediumCt}</span>
                <span className="dot dot-hard" title="Hard">🔴 {cat.hardCt}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
