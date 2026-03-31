import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function CourseInfoPage({ user }) {
  const { category } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:8000/api/course/${category}`)
      .then(res => res.json())
      .then(data => { setCourse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  if (loading) return <div className="course-page"><div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>Loading course info...</div></div>
  if (!course) return <div className="course-page"><div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>Course not found.</div></div>

  const info = course.course_info

  const difficultyCards = [
    { level: 'easy', label: 'Easy', emoji: '🟢', count: course.easyCt, color: '#00E676', desc: 'Great for beginners' },
    { level: 'medium', label: 'Medium', emoji: '🟡', count: course.mediumCt, color: '#FFD740', desc: 'Test your knowledge' },
    { level: 'hard', label: 'Hard', emoji: '🔴', count: course.hardCt, color: '#FF5252', desc: 'Challenge yourself' },
  ]

  const handleStart = (level) => {
    if (!user) { navigate('/login'); return }
    navigate(`/quiz/${category}/${level}`)
  }

  return (
    <div className="course-page">
      <div className="course-back-row">
        <Link to="/" className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>← Back to Courses</Link>
      </div>

      {/* Hero */}
      <div className="course-hero glass-card">
        <div className="course-hero-icon" style={{ background: `${course.color}22` }}>{course.icon}</div>
        <div className="course-hero-text">
          <h1>{course.name}</h1>
          <p className="course-desc">{info.overview}</p>
          <div className="course-meta">
            <span className="course-badge" style={{ background: `${course.color}22`, color: course.color, border: `1px solid ${course.color}44` }}>{info.skill_level}</span>
            <span className="course-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>⏱ {info.estimated_time}</span>
            <span className="course-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>📝 {course.questionCount} Questions</span>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="course-section glass-card">
        <h2>📚 What You'll Learn</h2>
        <ul className="learn-list">
          {info.what_you_learn.map((item, i) => (
            <li key={i}><span className="learn-check">✓</span> {item}</li>
          ))}
        </ul>
      </div>

      {/* Prerequisites */}
      <div className="course-section glass-card">
        <h2>📋 Prerequisites</h2>
        <ul className="prereq-list">
          {info.prerequisites.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Difficulty Selection */}
      <div className="course-section">
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>🎯 Choose Difficulty</h2>
        {!user && <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic' }}>🔒 <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link> to start a quiz</p>}
        <div className="difficulty-grid">
          {difficultyCards.map(d => (
            <button key={d.level} className={`difficulty-card glass-card diff-${d.level}`} onClick={() => handleStart(d.level)}>
              <span className="diff-emoji">{d.emoji}</span>
              <h3>{d.label}</h3>
              <p className="diff-desc">{d.desc}</p>
              <span className="diff-count" style={{ color: d.color }}>{d.count} Questions</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
