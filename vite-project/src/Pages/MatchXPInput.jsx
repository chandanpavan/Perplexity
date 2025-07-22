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
          Authorization: `Bearer ${token}`, // Auth protected
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
    <div style={{
      padding: '2rem',
      maxWidth: '500px',
      margin: '0 auto',
      background: '#2a0b3c',
      borderRadius: '12px',
      fontFamily: 'Poppins, sans-serif',
      color: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#dcb2ff' }}>🎯 Assign XP for Match</h2>

      {message && (
        <div style={{
          marginBottom: '1rem',
          background: '#413258',
          padding: '1rem',
          borderRadius: '8px',
          color: message.startsWith('✅') ? '#7fff87' : '#ff9393',
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Player Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          style={inputStyle}
        />

        <label>Kills</label>
        <input
          type="number"
          required
          value={kills}
          onChange={(e) => setKills(Number(e.target.value))}
          placeholder="Number of kills"
          style={inputStyle}
        />

        <label>Placement (e.g. 1, 2, 5...)</label>
        <input
          type="number"
          required
          value={placement}
          onChange={(e) => setPlacement(Number(e.target.value))}
          placeholder="Match position"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>🚀 Submit XP</button>
      </form>
    </div>
  );
}

// ✅ Input & Button styles
const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: 'none',
  background: '#3c245a',
  color: '#fff',
  fontSize: '1rem',
};

const buttonStyle = {
  width: '100%',
  padding: '0.8rem',
  background: '#9256f0',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '8px',
  cursor: 'pointer',
};

