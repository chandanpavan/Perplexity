import React, { useEffect, useState } from 'react';

export default function CreateSquad() {
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
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

  const handleCreate = async () => {
    const res = await fetch('http://localhost:5000/api/squads/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description: desc }),
    });

    const data = await res.json();
    alert(data.message);
    setSquad(data.squad || null);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', color: '#fff' }}>
      <h1>🛡️ Squad Setup</h1>

      {squad ? (
        <div style={{ background: '#2a1e3d', padding: '1rem', borderRadius: '10px' }}>
          <h2>{squad.name}</h2>
          <p>{squad.description}</p>
          <h3>Leader: {squad.leader.email}</h3>
          <h4>Members:</h4>
          <ul>
            {squad.members.map((m) => (
              <li key={m._id}>{m.email}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <input
            placeholder="Squad Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem', padding: '0.6rem' }}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem', padding: '0.6rem' }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#9355f5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            Create Squad
          </button>
        </>
      )}
    </div>
  );
}
