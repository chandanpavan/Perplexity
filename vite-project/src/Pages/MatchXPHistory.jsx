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
    <div
      style={{
        padding: '3rem',
        maxWidth: '800px',
        margin: '0 auto',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          color: '#ddb6ff',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        📈 XP Match History
      </h2>

      {history.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#bbb' }}>No match XP history found.</p>
      ) : (
        history.map((entry, i) => (
          <div
            key={i}
            style={{
              background: '#2d1c44',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 20px rgba(128, 90, 213, 0.2)',
            }}
          >
            <h3 style={{ margin: 0, color: '#caa2ff', fontSize: '1.15rem' }}>
              🏆 {entry.tournamentName}
            </h3>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.8rem',
                marginBottom: '0.6rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <span>🔫 Kills: <strong>{entry.kills}</strong></span>
              <span>🏁 Placement: <strong>{entry.placement}</strong></span>
              <span>🧠 XP Earned: <strong style={{ color: '#9f78ff' }}>{entry.earnedXP}</strong></span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.8rem' }}>
              {new Date(entry.timestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
