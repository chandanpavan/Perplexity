import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1f0029, #2a004a)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    padding: '2rem',
    maxWidth: '700px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    color: '#dcb2ff',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  infoBox: {
    background: '#2e1c3e',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(100,100,255,0.2)',
    marginBottom: '2rem',
  },
  label: {
    color: '#aaa',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  value: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '1rem',
  },
  badge: {
    fontSize: '1.4rem',
    color: '#ffe97f',
    textAlign: 'center',
    marginTop: '1rem',
  },
  achievementsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  achievementCard: (unlocked) => ({
    flex: '1 1 120px',
    minWidth: '100px',
    background: unlocked ? '#5e3a9f' : '#444',
    borderRadius: '8px',
    textAlign: 'center',
    padding: '0.8rem 1rem',
    color: unlocked ? '#fff' : '#999',
    opacity: unlocked ? 1 : 0.5,
  }),
};

export default function Profile() {
  const [userInfo, setUserInfo] = useState({ xp: 0, email: '' });
  const [winCount, setWinCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const level = Math.floor(userInfo.xp / 100);

  const getBadge = (level) => {
    if (level >= 10) return '🏅 Pro Legend';
    if (level >= 5) return '🥈 Battle Master';
    if (level >= 2) return '🥉 Rising Star';
    return '🎮 Rookie';
  };

  const achievements = [
    { name: 'First Match', icon: '🎉', unlocked: matchCount >= 1 },
    { name: 'First Win', icon: '🏆', unlocked: winCount >= 1 },
    { name: '5 Wins', icon: '🔥', unlocked: winCount >= 5 },
    { name: '500 XP Club', icon: '💎', unlocked: userInfo.xp >= 500 },
    { name: 'Pro Level 10', icon: '👑', unlocked: level >= 10 },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) setUserInfo(data);
      });

    fetch('http://localhost:5000/api/match/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMatchCount(data.length || 0);
        const wins = data.filter((match) => match.winner === email);
        setWinCount(wins.length);
      });
  }, [token, email]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧑 Your Player Profile</h1>

      <div style={styles.infoBox}>
        <div style={styles.label}>Email</div>
        <div style={styles.value}>{userInfo.email}</div>

        <div style={styles.label}>Level</div>
        <div style={styles.value}>{level}</div>

        <div style={styles.label}>XP</div>
        <div style={styles.value}>{userInfo.xp || 0} XP</div>

        <div style={styles.label}>Badge</div>
        <div style={styles.badge}>{getBadge(level)}</div>
      </div>

      <div style={styles.infoBox}>
        <div style={styles.label}>Matches Played</div>
        <div style={styles.value}>{matchCount}</div>

        <div style={styles.label}>Matches Won</div>
        <div style={styles.value}>{winCount}</div>

        <div style={styles.label}>Win Rate</div>
        <div style={styles.value}>
          {matchCount > 0 ? `${Math.round((winCount / matchCount) * 100)}%` : '0%'}
        </div>
      </div>

      {/* Achievements Section */}
      <div style={styles.infoBox}>
        <div style={{ ...styles.label, fontSize: '1.05rem', marginBottom: '1rem' }}>🏅 Achievements</div>
        <div style={styles.achievementsGrid}>
          {achievements.map((ach, index) => (
            <div key={index} style={styles.achievementCard(ach.unlocked)}>
              <div style={{ fontSize: '1.8rem' }}>{ach.icon}</div>
              <div style={{ marginTop: 8 }}>{ach.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
