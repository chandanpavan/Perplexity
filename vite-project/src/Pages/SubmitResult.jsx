import React, { useState, useEffect } from 'react';

export default function SubmitResult() {
  const token = localStorage.getItem('token');
  const [tournaments, setTournaments] = useState([]);
  const [tournamentId, setTournamentId] = useState('');
  const [winnerEmail, setWinnerEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/tournaments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    const res = await fetch('http://localhost:5000/api/match/submit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tournamentId, winnerEmail }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Results submitted and XP awarded');
      setWinnerEmail('');
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', background: '#1a0024', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '1rem', color: '#c89bff' }}>📝 Submit Match Results</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
          required
          style={{
            display: 'block',
            marginBottom: '1rem',
            padding: '0.6rem',
            fontSize: '1rem',
            width: '100%',
            borderRadius: '6px',
          }}
        >
          <option value="">Select Tournament</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.game} - {t.date}
            </option>
          ))}
        </select>

        <input
          placeholder="Winner's Email"
          value={winnerEmail}
          onChange={(e) => setWinnerEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.6rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        />

        <button type="submit" style={{
          background: '#a93ff5',
          color: 'white',
          padding: '0.7rem 2rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
        }}>
          ✅ Submit Result
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
