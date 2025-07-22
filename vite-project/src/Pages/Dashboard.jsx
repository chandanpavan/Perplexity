import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseColor = '#2d1e42';
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1f0029, #29003f)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    padding: '2rem',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#ddb6ff',
    textAlign: 'center',
  },
  xpBox: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  progressBarWrapper: {
    width: '80%',
    margin: '0.5rem auto',
    background: '#3c245a',
    height: '18px',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  badge: {
    fontSize: '1rem',
    color: '#ffdd57',
    marginTop: '0.5rem',
  },
  xpText: {
    color: '#b48edb',
    fontSize: '1rem',
    marginTop: 8,
  },
  section: {
    background: baseColor,
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(128, 90, 213, 0.3)',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'all 0.3s ease',
  },
  tournamentList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  tournamentItem: {
    marginBottom: '1.2rem',
    padding: '1rem',
    background: '#301f45',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tournamentText: {
    fontSize: '1rem',
    color: '#f4e6ff',
    flex: 1,
  },
  leaveButton: {
    background: 'transparent',
    border: '1px solid #ff89b5',
    color: '#ff89b5',
    borderRadius: '6px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    transition: 'all 0.2s ease-in-out',
  },
  logoutButton: {
    display: 'block',
    margin: '2rem auto 0',
    background: '#c364ff',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.2s',
  },
};

// Responsive adjustments (you can move this to CSS if needed)
const responsiveContainer = {
  ...styles.container,
  padding: window.innerWidth < 768 ? '1rem' : '2rem',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [joinedTournaments, setJoinedTournaments] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [xp, setXp] = useState(0);
  const [squad, setSquad] = useState(null);

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  const level = Math.floor(xp / 100);
  const progress = xp % 100;

  const getBadge = (level) => {
    if (level >= 10) return '🏅 Pro Legend';
    if (level >= 5) return '🥈 Battle Master';
    if (level >= 2) return '🥉 Rising Star';
    return '🎮 Rookie';
  };

  const isLeader = squad?.leader?._id === userId;

  useEffect(() => {
    if (!token || !email) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5000/api/users/${email}/joined`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setJoinedTournaments(data || []))
      .catch((err) => console.error('Joined tournaments error:', err));

    fetch(`http://localhost:5000/api/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.xp !== undefined) setXp(data.xp);
      })
      .catch((err) => console.error('XP error:', err));

    fetch(`http://localhost:5000/api/match/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMatchHistory(data || []))
      .catch((err) => console.error('Match history error:', err));

    fetch(`http://localhost:5000/api/squads/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) setSquad(data);
      });
  }, [email, token, navigate, userId]);

  const handleLeave = async (tournamentId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${email}/leave/${tournamentId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setJoinedTournaments((prev) =>
          prev.filter((t) => t._id !== tournamentId)
        );
        setXp((prev) => Math.max(0, prev - 10));
      } else {
        alert(data.message || 'Could not leave the tournament.');
      }
    } catch (err) {
      console.error('Leave error:', err);
      alert('Something went wrong.');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={responsiveContainer}>
      <h1 style={styles.heading}>Welcome, {email}</h1>

      {/* XP + Badge */}
      <div style={styles.xpBox}>
        <div style={styles.progressBarWrapper}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #b364f9, #8b31d1)',
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </div>
        <p style={styles.xpText}>Level {level} — {progress} / 100 XP</p>
        <p style={styles.badge}>🏅 Badge: {getBadge(level)}</p>
      </div>

      {/* Squad */}
      {squad && (
        <div style={styles.section}>
          <h2 style={{ color: '#c6a1f9', marginBottom: '1rem' }}>🛡 Squad Info</h2>
          <p><strong>Name:</strong> {squad.name}</p>
          <p><strong>Role:</strong> {isLeader ? '👑 Leader' : '🎖 Member'}</p>
          <p><strong>Members:</strong> {squad.members?.length || 1}</p>
        </div>
      )}

      {/* Joined Tournaments */}
      <div style={styles.section}>
        <h2 style={{ color: '#c6a1f9', marginBottom: '1rem' }}>🎮 Joined Tournaments</h2>
        {joinedTournaments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb' }}>
            You haven't joined any tournaments yet.
          </p>
        ) : (
          <ul style={styles.tournamentList}>
            {joinedTournaments.map((t) => (
              <li key={t._id} style={styles.tournamentItem}>
                <span style={styles.tournamentText}>
                  {t.game} — {t.date} at {t.time} <br />
                  🏆 Reward: {t.reward}
                </span>
                <button style={styles.leaveButton} onClick={() => handleLeave(t._id)}>
                  Leave
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Match History */}
      <div style={styles.section}>
        <h2 style={{ color: '#c6a1f9', marginBottom: '1rem' }}>📜 Match History</h2>
        {matchHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb' }}>No matches recorded yet.</p>
        ) : (
          <ul style={styles.tournamentList}>
            {matchHistory.map((match, index) => (
              <li key={index} style={styles.tournamentItem}>
                <span style={styles.tournamentText}>
                  {match.tournament?.game} — {new Date(match.date).toLocaleDateString()} <br />
                  🏆 Winner: {match.winner === email ? (
                    <strong style={{ color: '#89fb87' }}>You</strong>
                  ) : (
                    <span>{match.winner}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout */}
      <button style={styles.logoutButton} onClick={logout}>
        🚪 Logout
      </button>
    </div>
  );
}
