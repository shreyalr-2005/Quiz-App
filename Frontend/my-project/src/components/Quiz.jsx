import { useState } from 'react'

export default function Quiz({ questions, onRestart }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  
  const currentQuestion = questions[currentIndex]
  
  const handleSelectOption = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option
    })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      })
      const data = await res.json()
      setResults(data)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert("Failed to submit quiz.")
    }
  }

  if (submitted && results) {
    return (
      <div className="results-container">
        <h2>Quiz Completed!</h2>
        <div className="score-text">
          Your Score: {results.score} / {results.total}
        </div>
        
        <div className="answer-review">
          <h3>Review Your Answers:</h3>
          {results.results.map((result, idx) => {
            const q = questions.find(q => q.id === result.id)
            return (
              <div key={result.id} className={`review-item ${result.is_correct ? 'correct' : 'incorrect'}`}>
                <p><strong>Q{idx + 1}: {q?.text}</strong></p>
                <p>Your answer: {result.user_answer || "Not answered"}</p>
                {!result.is_correct && (
                  <p>Correct answer: {result.correct_answer}</p>
                )}
              </div>
            )
          })}
        </div>
        
        <button className="btn" onClick={() => {
          setAnswers({})
          setCurrentIndex(0)
          setSubmitted(false)
          setResults(null)
          onRestart()
        }}>Take Another Quiz</button>
      </div>
    )
  }

  const isLastQuestion = currentIndex === questions.length - 1
  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined

  return (
    <div>
      <div className="quiz-header">
        Question {currentIndex + 1} of {questions.length}
      </div>
      
      <div className="quiz-question">
        {currentQuestion.text}
      </div>
      
      <div className="quiz-options">
        {currentQuestion.options.map((option, idx) => (
          <div 
            key={idx}
            className={`quiz-option ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          className="btn" 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          style={{ backgroundColor: currentIndex === 0 ? '#ccc' : '#616161' }}
        >
          Previous
        </button>
        
        {!isLastQuestion ? (
          <button 
            className="btn" 
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
          >
            Next ❯
          </button>
        ) : (
          <button 
            className="btn" 
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  )
}
