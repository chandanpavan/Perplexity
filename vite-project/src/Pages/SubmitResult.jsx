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
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
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
        setTournamentId('');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>📝 Submit Match Results</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>🎮 Select Tournament</label>
        <select
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">-- Select --</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.game} — {t.date}
            </option>
          ))}
        </select>

        <label style={styles.label}>🏆 Winning Player Email</label>
        <input
          type="email"
          placeholder="e.g. player@email.com"
          value={winnerEmail}
          onChange={(e) => setWinnerEmail(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>✅ Submit Result</button>
      </form>

      {message && (
        <div
          style={{
            marginTop: '1.2rem',
            padding: '0.9rem 1rem',
            borderRadius: '8px',
            background: message.startsWith('✅') ? '#293f2a' : '#402331',
            color: message.startsWith('✅') ? '#7aff9b' : '#ffcdd2',
            borderLeft: message.startsWith('✅') ? '5px solid #4caf50' : '5px solid #e53935',
            fontSize: '0.95rem',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '3rem',
    maxWidth: '700px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#1a0024',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
  },
  heading: {
    marginBottom: '2rem',
    color: '#c89bff',
    fontSize: '1.8rem',
    textAlign: 'center',
  },
  form: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.3rem',
    color: '#ccc',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '1rem',
    background: '#2e1c4a',
    color: '#fff',
    border: 'none',
    marginBottom: '1.2rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1.2rem',
    borderRadius: '6px',
    fontSize: '1rem',
    background: '#2e1c4a',
    color: '#fff',
    border: 'none',
  },
  button: {
    background: 'linear-gradient(90deg, #a448f5, #7b36d1)',
    color: '#fff',
    padding: '0.85rem 2rem',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
};
