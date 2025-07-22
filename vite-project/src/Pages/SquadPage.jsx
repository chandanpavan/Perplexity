import React, { useEffect, useState } from 'react';
import SquadChat from './SquadChat';

export default function SquadPage() {
  const token = localStorage.getItem('token');
  const [squad, setSquad] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/squads/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) setSquad(data);
      });
  }, [token]);

  if (!squad) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>🛡 Squad</h1>
        <p style={styles.subtext}>You are not in a squad yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛡 {squad.name}</h1>
      <p style={styles.description}>{squad.description}</p>

      <div style={styles.infoBox}>
        <p><strong>👑 Leader:</strong> {squad.leader.email}</p>
        <h3 style={{ marginTop: '1rem', color: '#c99eff' }}>👥 Members</h3>
        <ul style={styles.memberList}>
          {squad.members.map((m) => (
            <li key={m._id} style={styles.memberItem}>
              🔹 {m.email}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.chatBox}>
        <SquadChat squadId={squad._id} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    color: '#fff',
    padding: '3rem 2rem',
    maxWidth: '780px',
    margin: '0 auto',
    fontFamily: 'Poppins, sans-serif',
  },
  heading: {
    fontSize: '2.2rem',
    color: '#ddb6ff',
    marginBottom: '0.8rem',
  },
  subtext: {
    color: '#bbb',
    fontSize: '1rem',
  },
  description: {
    fontStyle: 'italic',
    marginBottom: '1.5rem',
    color: '#d9c4ff',
  },
  infoBox: {
    background: '#2f1c42',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2.5rem',
    boxShadow: '0 0 16px rgba(147, 85, 220, 0.3)',
  },
  memberList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '0.5rem',
  },
  memberItem: {
    marginBottom: '0.6rem',
    fontSize: '0.95rem',
    color: '#e3e3e3',
  },
  chatBox: {
    background: '#241631',
    padding: '1rem 1.2rem',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 8px rgba(120, 60, 170, 0.2)',
  },
};
