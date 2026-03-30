import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <h2>Create Account</h2>
        <p>Join QuizMaster and start learning today</p>
        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div style={{
            background: 'rgba(0, 230, 118, 0.15)',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            color: '#00E676',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Account created! Redirecting to login...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
          </div>
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  )
}
