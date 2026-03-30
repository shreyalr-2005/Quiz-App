import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <h1 className="landing-title">QuizMaster</h1>
      <p className="landing-subtitle">
        Challenge yourself with interactive quizzes on HTML, CSS & JavaScript.<br />
        Track your progress and become a web dev pro!
      </p>
      <div className="landing-buttons">
        <Link to="/login" className="btn-primary">Get Started</Link>
        <Link to="/signup" className="btn-outline">Create Account</Link>
      </div>
    </div>
  )
}
