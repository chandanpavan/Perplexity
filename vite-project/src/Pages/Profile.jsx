import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    padding: '3rem',
    background: 'linear-gradient(to bottom, #1f0029, #2a004a)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    color: '#dcb2ff',
    textAlign: 'center',
    marginBottom: '2.5rem',
    textShadow: '0 2px 12px rgba(208,128,255,0.3)',
  },
  infoBox: {
    background: '#2e1c3e',
    padding: '2rem',
    borderRadius: '14px',
    boxShadow: '0 6px 24px rgba(100,100,255,0.15)',
    marginBottom: '2rem',
  },
  label: {
    color: '#bbb',
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.3rem',
  },
  value: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '1.2rem',
  },
  badge: {
    fontSize: '1.6rem',
    textAlign: 'center',
    marginTop: '1rem',
    color: '#ffe97f',
  },
  achievementsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.2rem',
  },
  achievementCard: unlocked => ({
    flex: '1 1 150px',
    minWidth: '120px',
    background: unlocked ? '#5e3a9f' : '#513962',
    borderRadius: '10px',
    textAlign: 'center',
    padding: '1rem',
    color: unlocked ? '#ffffff' : '#999999',
    opacity: unlocked ? 1 : 0.5,
    transition: 'transform 0.2s',
  }),
};

export default function Profile() {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const userId = localStorage.getItem('user_id');

  const [userInfo, setUserInfo] = useState({ xp: 0, email: '' });
  const [winCount, setWinCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [squad, setSquad] = useState(null);
  const [history, setHistory] = useState([]);

  const level = Math.floor(userInfo.xp / 100);

  const getBadge = lvl => {
    if (lvl >= 10) return '🏅 Pro Legend';
    if (lvl >= 5) return '🥈 Battle Master';
    if (lvl >= 2) return '🥉 Rising Star';
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
      .then(res => res.json())
      .then(data => data?.email && setUserInfo(data));

    fetch('http://localhost:5000/api/match/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setMatchCount(data.length || 0);
        setWinCount(data.filter(m => m.winner === email).length);
      });

    fetch('http://localhost:5000/api/squads/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => !data.message && setSquad(data));

    fetch('http://localhost:5000/api/profile/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setHistory(data?.slice(0, 5)));
  }, [token, email]);

  const isLeader = squad?.leader?._id === userId;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧑 Your Player Profile</h1>

      {/* 📌 Profile Data */}
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

      {/* 📊 Match Stats */}
      <div style={styles.infoBox}>
        <div style={styles.label}>Matches Played</div>
        <div style={styles.value}>{matchCount}</div>

        <div style={styles.label}>Matches Won</div>
        <div style={styles.value}>{winCount}</div>

        <div style={styles.label}>Win Rate</div>
        <div style={styles.value}>
          {matchCount > 0 ? `${Math.round((winCount / matchCount) * 100)}%` : '0%'}
        </div>

        <div style={styles.label}>Kills</div>
        <div style={styles.value}>{userInfo.totalKills || 0}</div>

        <div style={styles.label}>Placement Points</div>
        <div style={styles.value}>{userInfo.placementPoints || 0}</div>
      </div>

      {/* 🛡️ Squad */}
      {squad && (
        <div style={styles.infoBox}>
          <div style={styles.label}>Squad Name</div>
          <div style={styles.value}>🛡 {squad.name}</div>

          <div style={styles.label}>Your Role</div>
          <div style={styles.value}>{isLeader ? '👑 Leader' : '🎖 Member'}</div>

          <div style={styles.label}>Total Members</div>
          <div style={styles.value}>{squad.members.length}</div>
        </div>
      )}

      {/* 🏅 Achievements */}
      <div style={styles.infoBox}>
        <div style={{ ...styles.label, fontSize: '1.1rem', marginBottom: '1rem' }}>
          🏅 Achievements
        </div>
        <div style={styles.achievementsGrid}>
          {achievements.map((ach, i) => (
            <div key={i} style={styles.achievementCard(ach.unlocked)}>
              <div style={{ fontSize: '2rem' }}>{ach.icon}</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>{ach.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 📈 XP Logs */}
      <div style={styles.infoBox}>
        <div style={{ ...styles.label, marginBottom: '1rem' }}>📈 Recent XP Matches</div>
        {history.length === 0 ? (
          <div style={{ color: '#ccc' }}>No recent XP activities.</div>
        ) : (
          history.map((entry, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>{entry.tournamentName || 'Match'}</strong>
              <div style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>
                🔫 {entry.kills} Kills | 🧩 {entry.placement} Place | 🧠 {entry.earnedXP} XP
              </div>
              <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
