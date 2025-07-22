import React, { useEffect, useState } from 'react';

export default function MatchXPHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/xp/history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then(setHistory);
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', color: '#fff' }}>
      <h2 style={{ color: '#ddb6ff', marginBottom: '1rem' }}>📈 XP History</h2>
      {history.length === 0 ? (
        <p>No match XP history found.</p>
      ) : (
        history.map((entry, i) => (
          <div key={i} style={{
            background: '#2c1f43',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '10px'
          }}>
            <p><strong>{entry.tournamentName}</strong></p>
            <p>Kills: {entry.kills} 🔫</p>
            <p>Placement: {entry.placement} 🏁</p>
            <p>XP Earned: {entry.earnedXP} 🧠</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
              {new Date(entry.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
