import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1a0024, #2a005a)',
    color: 'white',
    padding: '3rem',
    fontFamily: 'Poppins, sans-serif',
  },
  title: {
    fontSize: '2.5rem',
    color: '#e6c6ff',
    textAlign: 'center',
    marginBottom: '3rem',
    textShadow: '0 2px 10px #8a2be2',
  },
  table: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    borderCollapse: 'collapse',
    fontSize: '1rem',
    backgroundColor: '#240a3f',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(155, 85, 255, 0.25)',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: '#2e1a4d',
    color: '#c889f5',
    borderBottom: '2px solid #a355f5',
    fontSize: '1.05rem',
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #3a234d',
    color: '#f2e6ff',
    fontWeight: 400,
  },
  row: {
    transition: 'background 0.2s',
  },
  rowHover: {
    backgroundColor: '#3b2059',
  },
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const formatDate = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString("en-IN", {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏆 Live Esports Leaderboard</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Player</th>
            <th style={styles.th}>XP</th>
            <th style={styles.th}>Kills</th>
            <th style={styles.th}>Placement</th>
            <th style={styles.th}>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.email}
              style={{
                ...styles.row,
                backgroundColor: hoveredIndex === i ? styles.rowHover.backgroundColor : 'transparent',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <td style={styles.td}>#{i + 1}</td>
              <td style={styles.td}>{u.name || u.email}</td>
              <td style={styles.td}>{u.xp} 🧠</td>
              <td style={styles.td}>{u.totalKills || 0} 🔫</td>
              <td style={styles.td}>{u.placementPoints || 0} 🧩</td>
              <td style={styles.td}>{formatDate(u.lastUpdated)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
