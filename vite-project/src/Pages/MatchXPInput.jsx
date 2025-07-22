import React, { useState } from 'react';

export default function MatchXPInput() {
  const [email, setEmail] = useState('');
  const [kills, setKills] = useState(0);
  const [placement, setPlacement] = useState(0);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/match-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, kills, placement }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setEmail('');
        setKills(0);
        setPlacement(0);
      } else {
        setMessage(`❌ ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Server error');
    }
  };

  return (
    <div
      style={{
        padding: '3rem',
        maxWidth: '600px',
        margin: '3rem auto',
        background: '#2a0b3c',
        borderRadius: '14px',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
        boxShadow: '0 0 24px rgba(140, 70, 210, 0.25)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '1.9rem',
          marginBottom: '2rem',
          color: '#dcb2ff',
        }}
      >
        🎯 Assign XP for Match
      </h2>

      {message && (
        <div
          style={{
            background: '#3d2b56',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            color: message.startsWith('✅') ? '#7fff87' : '#ff9393',
            fontWeight: 500,
            fontSize: '0.95rem',
            borderLeft: `5px solid ${message.startsWith('✅') ? '#3ac97a' : '#ff5e5e'}`,
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Player Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="player@email.com"
          style={inputStyle}
        />

        <label style={labelStyle}>Kills</label>
        <input
          type="number"
          required
          value={kills}
          onChange={(e) => setKills(Number(e.target.value))}
          placeholder="e.g. 5"
          style={inputStyle}
        />

        <label style={labelStyle}>Placement (e.g. 1, 2, 5...)</label>
        <input
          type="number"
          required
          value={placement}
          onChange={(e) => setPlacement(Number(e.target.value))}
          placeholder="e.g. 3"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>🚀 Submit XP</button>
      </form>
    </div>
  );
}

// ✅ Updated Form UI
const labelStyle = {
  display: 'block',
  marginBottom: '0.3rem',
  fontWeight: 500,
  fontSize: '1rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  marginBottom: '1.5rem',
  borderRadius: '8px',
  border: 'none',
  background: '#3c245a',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
};

const buttonStyle = {
  width: '100%',
  padding: '1rem',
  background: '#9256f0',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '1.05rem',
  letterSpacing: '0.5px',
  transition: 'all 0.2s',
};

