import { useState, useEffect } from 'react'
import Quiz from './components/Quiz'
import './index.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [started, setStarted] = useState(false)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:8000/api/questions')
      if (!res.ok) throw new Error('Failed to fetch questions')
      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  if (loading) return <div className="quiz-container">Loading... Ensure the FastAPI backend is running on port 8000!</div>
  if (error) return <div className="quiz-container">Error: {error}</div>

  return (
    <div className="quiz-container">
      {!started ? (
        <div style={{ textAlign: 'center' }}>
          <h1>W3Schools Style Quiz</h1>
          <p>Test your web development skills!</p>
          <button className="btn" onClick={() => setStarted(true)}>Start Quiz</button>
        </div>
      ) : (
        <Quiz questions={questions} onRestart={() => setStarted(false)} />
      )}
    </div>
  )
}

export default App
