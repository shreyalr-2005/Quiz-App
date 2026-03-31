import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function CourseInfoPage({ user }) {
  const { category } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:8000/api/course/${category}`)
      .then(res => res.json())
      .then(data => { setCourse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  // Fetch user progress for this course
  useEffect(() => {
    if (user?.username) {
      fetch(`http://localhost:8000/api/progress/${user.username}/${category}`)
        .then(res => res.json())
        .then(data => setProgress(data))
        .catch(() => {})
    }
  }, [user, category])

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
    
    // Check if level is unlocked
    if (progress) {
      const levelProgress = progress[level]
      if (!levelProgress?.unlocked) {
        const prevLevel = level === 'medium' ? 'Easy' : 'Medium'
        alert(`🔒 Score at least 60% on ${prevLevel} to unlock this level!`)
        return
      }
    }
    navigate(`/quiz/${category}/${level}`)
  }

  const getLevelStatus = (level) => {
    if (!progress || !user) return { unlocked: level === 'easy', passed: false, best_score: 0 }
    return progress[level] || { unlocked: level === 'easy', passed: false, best_score: 0 }
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
            <Link to={`/learn/${category}`} className="course-badge course-badge-link" style={{ background: 'rgba(108, 99, 255, 0.15)', color: 'var(--accent)', border: '1px solid rgba(0, 210, 255, 0.3)', cursor: 'pointer', textDecoration: 'none' }}>
              📖 Start Learning ({info.estimated_time})
            </Link>
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

      {/* Start Learning CTA */}
      <div className="course-section glass-card" style={{ textAlign: 'center' }}>
        <h2>📖 Ready to Learn?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Go through the interactive lessons before attempting the quiz
        </p>
        <Link to={`/learn/${category}`} className="btn-primary" style={{ fontSize: '1.05rem', padding: '14px 40px' }}>
          Start Learning →
        </Link>
      </div>

      {/* Difficulty Selection */}
      <div className="course-section">
        <h2 style={{ marginBottom: '8px', fontSize: '1.5rem' }}>🎯 Choose Difficulty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
          {user 
            ? 'Score at least 60% to unlock the next level. Complete them in order!' 
            : '🔒 Login to start taking quizzes'}
        </p>
        <div className="difficulty-grid">
          {difficultyCards.map(d => {
            const status = getLevelStatus(d.level)
            const isLocked = user && !status.unlocked
            return (
              <button
                key={d.level}
                className={`difficulty-card glass-card diff-${d.level} ${isLocked ? 'diff-locked' : ''} ${status.passed ? 'diff-passed' : ''}`}
                onClick={() => handleStart(d.level)}
                disabled={isLocked && user}
              >
                {isLocked && <span className="lock-overlay">🔒</span>}
                {status.passed && <span className="pass-badge">✅ Passed</span>}
                <span className="diff-emoji">{d.emoji}</span>
                <h3>{d.label}</h3>
                <p className="diff-desc">{d.desc}</p>
                <span className="diff-count" style={{ color: isLocked ? 'var(--text-secondary)' : d.color }}>{d.count} Questions</span>
                {status.best_score > 0 && (
                  <span className="diff-best-score">Best: {Math.round(status.best_score)}%</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
