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
        <h1>QuizMaster</h1>
        <div className="user-info">
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <span>{user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="welcome-text">
        <h2>Choose a Category</h2>
        <p>Select a topic below and test your knowledge with 5 challenging questions</p>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <Link to={`/quiz/${cat.id}`} key={cat.id} className="category-card glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="category-icon">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <span className="category-badge" style={{
              background: `${cat.color}22`,
              color: cat.color,
              border: `1px solid ${cat.color}44`
            }}>
              {cat.questionCount} Questions
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
