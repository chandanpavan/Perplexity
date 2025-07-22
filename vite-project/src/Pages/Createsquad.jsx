import React, { useEffect, useState } from 'react';

export default function CreateSquad() {
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [squad, setSquad] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetch('http://localhost:5000/api/squads/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) setSquad(data);
      });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <div
      style={{
        maxWidth: 700,
        margin: '2rem auto',
        padding: isMobile ? '1rem' : '2rem',
        backgroundColor: '#1a1230',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 0 12px rgba(0,0,0,0.4)',
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1.5rem' }}>🛡️ Squad Setup</h1>

      {squad ? (
        <div
          style={{
            background: '#2a1e3d',
            padding: '1.5rem',
            borderRadius: '10px',
            lineHeight: '1.6',
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>{squad.name}</h2>
          <p style={{ fontStyle: 'italic', color: '#bbb' }}>{squad.description}</p>
          <h3 style={{ marginTop: '1rem' }}>Leader: {squad.leader.email}</h3>
          <h4 style={{ marginTop: '1rem' }}>Members:</h4>
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
            style={{
              width: '100%',
              marginBottom: '1rem',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #444',
              background: '#2a1e3d',
              color: '#fff',
            }}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '1rem',
              height: '100px',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #444',
              background: '#2a1e3d',
              color: '#fff',
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#9355f5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              width: isMobile ? '100%' : 'auto',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Create Squad
          </button>
        </>
      )}
    </div>
  );
}
