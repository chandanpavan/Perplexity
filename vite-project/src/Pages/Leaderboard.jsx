import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1a0024, #2a005a)',
    color: 'white',
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
  },
  title: {
    fontSize: '2rem',
    color: '#e6c6ff',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  table: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #a355f5',
    padding: '0.8rem',
    textAlign: 'left',
    color: '#b58aff',
  },
  td: {
    padding: '0.7rem',
    borderBottom: '1px solid #444',
  },
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏆 Top Players</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>XP</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.email}>
              <td style={styles.td}>#{index + 1}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
