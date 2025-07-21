import React, { useEffect, useState } from 'react';
import SquadChat from './SquadChat'; // 🔥 Import the SquadChat component

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
      <div style={{ color: '#fff', padding: '2rem', textAlign: 'center' }}>
        <h1>🛡 Squad</h1>
        <p>You are not in a squad yet.</p>
      </div>
    );
  }

  return (
    <div style={{ color: '#fff', padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1>🛡 {squad.name}</h1>
      <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>{squad.description}</p>

      <div style={{ background: '#2f1c42', padding: '1.2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <p><strong>Leader:</strong> {squad.leader.email}</p>
        <h3>👥 Members:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {squad.members.map((m) => (
            <li key={m._id} style={{ marginBottom: '0.5rem' }}>
              🔹 {m.email}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Embed Squad Chat */}
      <SquadChat squadId={squad._id} />
    </div>
  );
}
