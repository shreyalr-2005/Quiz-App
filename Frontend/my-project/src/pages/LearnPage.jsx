import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function LearnPage() {
  const { category } = useParams()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    fetch(`http://localhost:8000/api/learn/${category}`)
      .then(res => res.json())
      .then(data => { setContent(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  if (loading) return <div className="learn-page"><div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>Loading learning content...</div></div>
  if (!content) return <div className="learn-page"><div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>Content not found.</div></div>

  const section = content.sections[activeSection]
  const progress = ((activeSection + 1) / content.sections.length) * 100

  return (
    <div className="learn-page">
      <div className="learn-top-bar">
        <Link to={`/course/${category}`} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>← Back to Course</Link>
        <span className="learn-title-badge">{content.title}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>⏱ {content.duration}</span>
      </div>

      {/* Progress */}
      <div className="learn-progress-row">
        <span className="learn-progress-label">Lesson {activeSection + 1} of {content.sections.length}</span>
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="learn-progress-label">{Math.round(progress)}%</span>
      </div>

      {/* Sidebar + Content */}
      <div className="learn-layout">
        <div className="learn-sidebar glass-card">
          <h3>📖 Lessons</h3>
          {content.sections.map((s, i) => (
            <button
              key={i}
              className={`learn-nav-btn ${i === activeSection ? 'active' : ''} ${i < activeSection ? 'completed' : ''}`}
              onClick={() => setActiveSection(i)}
            >
              <span className="learn-nav-num">{i < activeSection ? '✓' : i + 1}</span>
              <span className="learn-nav-text">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="learn-content glass-card">
          <h2 className="learn-section-title">{section.title}</h2>
          <p className="learn-section-text">{section.content}</p>
          
          {section.code && (
            <div className="learn-code-block">
              <div className="code-header">
                <span>💻 Example Code</span>
              </div>
              <pre><code>{section.code}</code></pre>
            </div>
          )}

          <div className="learn-nav-buttons">
            <button
              className="btn-outline"
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              style={{ opacity: activeSection === 0 ? 0.4 : 1 }}
            >
              ← Previous Lesson
            </button>
            {activeSection < content.sections.length - 1 ? (
              <button className="btn-primary" onClick={() => setActiveSection(activeSection + 1)}>
                Next Lesson →
              </button>
            ) : (
              <Link to={`/course/${category}`} className="btn-primary">
                🎯 Take the Quiz →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
