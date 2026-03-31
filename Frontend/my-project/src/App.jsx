import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CourseInfoPage from './pages/CourseInfoPage'

function AnimatedBg() {
  return (
    <div className="animated-bg">
      <div className="orb"></div>
      <div className="orb"></div>
      <div className="orb"></div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <>
      <AnimatedBg />
      <Routes>
        <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/course/:category" element={<CourseInfoPage user={user} />} />
        <Route 
          path="/quiz/:category/:difficulty"
          element={user ? <QuizPage user={user} /> : <Navigate to="/login" />}
        />
        {/* Legacy route redirect */}
        <Route path="/quiz/:category" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
