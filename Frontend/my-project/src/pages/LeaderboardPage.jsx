import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LeaderboardPage() {
  const [tab, setTab] = useState('leaderboard')
  const [leaderboard, setLeaderboard] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/leaderboard').then(r => r.json()),
      fetch('http://localhost:8000/api/users').then(r => r.json())
    ]).then(([lb, u]) => {
      setLeaderboard(lb)
      setUsers(u)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="leaderboard-page">
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
    </div>
  )

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="leaderboard-page">
      <div className="lb-header">
        <Link to="/" className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>← Back to Home</Link>
        <h1>📊 Scoreboard</h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>
          🏆 Leaderboard
        </button>
        <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          👥 All Users
        </button>
      </div>

      {tab === 'leaderboard' && (
        <div className="lb-content">
          {leaderboard.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No quiz attempts yet! Be the first to take a quiz.
            </div>
          ) : (
            <div className="lb-table glass-card">
              <div className="lb-row lb-row-header">
                <span className="lb-rank">Rank</span>
                <span className="lb-name">Player</span>
                <span className="lb-stat">Quizzes</span>
                <span className="lb-stat">Avg Score</span>
                <span className="lb-stat">Best</span>
              </div>
              {leaderboard.map((entry, idx) => (
                <div key={entry.username} className={`lb-row ${idx < 3 ? 'lb-top' : ''}`}>
                  <span className="lb-rank">
                    {idx < 3 ? medals[idx] : idx + 1}
                  </span>
                  <span className="lb-name">
                    <div className="lb-avatar" style={{
                      background: idx === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                                  idx === 1 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' :
                                  idx === 2 ? 'linear-gradient(135deg, #CD7F32, #A0522D)' :
                                  'linear-gradient(135deg, var(--primary), var(--accent))'
                    }}>
                      {entry.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="lb-player-name">{entry.name}</div>
                      <div className="lb-player-username">@{entry.username}</div>
                    </div>
                  </span>
                  <span className="lb-stat">{entry.quizzes_taken}</span>
                  <span className="lb-stat lb-score">{entry.avg_percentage}%</span>
                  <span className="lb-stat">{entry.best_score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="lb-content">
          {users.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No users registered yet.
            </div>
          ) : (
            <div className="lb-table glass-card">
              <div className="lb-row lb-row-header">
                <span className="lb-rank">#</span>
                <span className="lb-name">User</span>
                <span className="lb-stat">Quizzes</span>
                <span className="lb-stat">Avg Score</span>
                <span className="lb-stat">Joined</span>
              </div>
              {users.map((u, idx) => (
                <div key={u.username} className="lb-row">
                  <span className="lb-rank">{idx + 1}</span>
                  <span className="lb-name">
                    <div className="lb-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="lb-player-name">{u.name}</div>
                      <div className="lb-player-username">@{u.username}</div>
                    </div>
                  </span>
                  <span className="lb-stat">{u.quizzes_taken}</span>
                  <span className="lb-stat">{u.avg_score}%</span>
                  <span className="lb-stat lb-date">{new Date(u.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
