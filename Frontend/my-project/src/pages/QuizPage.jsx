import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const diffColors = { easy: '#00E676', medium: '#FFD740', hard: '#FF5252' }
const diffLabels = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }

export default function QuizPage({ user }) {
  const { category, difficulty } = useParams()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8000/api/questions?category=${category}&difficulty=${difficulty}`)
      .then(res => res.json())
      .then(data => { setQuestions(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, difficulty])

  if (loading) return <div className="quiz-page"><div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>Loading Questions...</div></div>
  if (questions.length === 0) return <div className="quiz-page"><div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>No questions found.</div></div>

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const hasAnswered = answers[currentQuestion?.id] !== undefined
  const isLast = currentIndex === questions.length - 1

  const handleSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion.id]: option })
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          category,
          difficulty,
          username: user?.username || null
        })
      })
      const data = await res.json()
      setResults(data)
    } catch (err) {
      alert('Failed to submit quiz')
    }
  }

  // ── Results Screen ──
  if (results) {
    const pct = Math.round((results.score / results.total) * 100)
    let message = 'Keep practicing! 📚'
    if (pct === 100) message = 'Perfect score! You\'re a genius! 🏆'
    else if (pct >= 80) message = 'Excellent work! 🎉'
    else if (pct >= 60) message = 'Good job! Keep it up! 👍'
    else if (pct >= 40) message = 'Not bad, room for improvement!'

    return (
      <div className="results-page">
        <div className="results-card glass-card">
          <div className="results-header-row">
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Quiz Complete!</h2>
            <span className={`diff-badge diff-badge-${difficulty}`}>{diffLabels[difficulty] || difficulty}</span>
          </div>
          <div className="score-circle" style={{ borderColor: diffColors[difficulty] || 'var(--primary)' }}>
            <span className="score-num">{results.score}/{results.total}</span>
            <span className="score-label">{pct}%</span>
          </div>
          <p className="results-message">{message}</p>

          <h3 style={{ textAlign: 'left', marginBottom: '15px', fontSize: '1.1rem' }}>📝 Detailed Review</h3>
          <div className="review-list">
            {results.results.map((r, idx) => {
              const q = questions.find(q => q.id === r.id)
              return (
                <div key={r.id} className={`review-item ${r.is_correct ? 'correct' : 'incorrect'}`}>
                  <p className="q-text">Q{idx + 1}: {q?.text}</p>
                  <p className="answer-text">Your answer: <strong>{r.user_answer || 'Not answered'}</strong></p>
                  {!r.is_correct && <p className="answer-text correct-ans">✅ Correct: <strong>{r.correct_answer}</strong></p>}
                  {r.explanation && (
                    <div className="explanation-block">
                      <span className="explanation-icon">💡</span>
                      <p>{r.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="results-buttons">
            <Link to={`/course/${category}`} className="btn-primary">Back to Course</Link>
            <Link to="/" className="btn-outline">Home</Link>
            <button className="btn-outline" onClick={() => {
              setAnswers({})
              setCurrentIndex(0)
              setResults(null)
            }}>Retry Quiz</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz Screen ──
  return (
    <div className="quiz-page">
      <div className="quiz-card glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Link to={`/course/${category}`} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>← Back</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`diff-badge diff-badge-${difficulty}`}>{diffLabels[difficulty] || difficulty}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</span>
          </div>
        </div>

        <div className="quiz-progress">
          <span>Q{currentIndex + 1}</span>
          <div className="progress-bar">
            <div className={`progress-fill progress-${difficulty}`} style={{ width: `${progress}%` }}></div>
          </div>
          <span>{questions.length}</span>
        </div>

        <div className="question-text" key={currentIndex}>
          {currentQuestion.text}
        </div>

        <div className="options-list" key={`opts-${currentIndex}`}>
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-btn ${answers[currentQuestion.id] === opt ? 'selected' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="quiz-nav">
          <button
            className="btn-outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          {!isLast ? (
            <button className="btn-primary" onClick={() => setCurrentIndex(currentIndex + 1)} disabled={!hasAnswered}>
              Next →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={!hasAnswered}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
