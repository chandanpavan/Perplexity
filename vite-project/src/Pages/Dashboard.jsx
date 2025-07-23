import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseColor = '#2d1e42';

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem 2rem',
    background: 'linear-gradient(to bottom, #1f0029, #29003f)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#ddb6ff',
    textAlign: 'center',
  },
  section: {
    background: baseColor,
    borderRadius: '12px',
    padding: '1.8rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(128, 90, 213, 0.3)',
  },
  xpBarWrapper: {
    height: '18px',
    width: '100%',
    maxWidth: '500px',
    margin: '0.5rem auto',
    background: '#3c245a',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    background: 'linear-gradient(90deg, #b364f9, #8b31d1)',
    transition: 'width 0.3s ease-in-out',
  },
  badge: {
    fontSize: '1rem',
    marginTop: '0.5rem',
    color: '#ffdd57',
  },
  xpText: {
    color: '#b48edb',
    fontSize: '1rem',
    textAlign: 'center',
  },
  tournamentList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  tournamentItem: {
    background: '#301f45',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tournamentText: {
    color: '#f4e6ff',
    fontSize: '1rem',
    flex: '1 1 70%',
  },
  leaveButton: {
    background: 'transparent',
    border: '1px solid #ff89b5',
    color: '#ff89b5',
    borderRadius: '6px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    height: 'fit-content',
  },
  logoutButton: {
    display: 'block',
    margin: '3rem auto 1rem',
    background: '#c364ff',
    color: '#fff',
    border: 'none',
    padding: '0.9rem 2rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
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
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, {email}</h1>

      {/* XP Progress */}
      <div style={styles.section}>
        <div style={styles.xpBarWrapper}>
          <div style={{ ...styles.progress, width: `${progress}%` }} />
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

      {/* Tournaments */}
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
      <button style={styles.logoutButton} onClick={logout}>🚪 Logout</button>
    </div>
  );
}
