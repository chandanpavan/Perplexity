import React, { useEffect, useState } from 'react';

export default function SquadRequests() {
  const token = localStorage.getItem('token');
  const [requests, setRequests] = useState([]);
  const [squadId, setSquadId] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/squads/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) {
          setRequests(data.pendingRequests);
          setSquadId(data._id);
        }
      });
  }, [token]);

  const respond = async (userId, action) => {
    await fetch('http://localhost:5000/api/squads/manage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ squadId, userId, action }),
    });
    setRequests(requests.filter((r) => r._id !== userId));
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', color: '#fff' }}>
      <h1>📩 Join Requests</h1>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((r) => (
          <div
            key={r._id}
            style={{
              background: '#2a1e3d',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1rem',
            }}
          >
            <p>{r.email}</p>
            <button
              onClick={() => respond(r._id, 'accept')}
              style={{ marginRight: '1rem', background: 'green', padding: '0.5rem 1rem', border: 'none', color: '#fff', borderRadius: '6px' }}
            >
              Accept
            </button>
            <button
              onClick={() => respond(r._id, 'reject')}
              style={{ background: 'red', padding: '0.5rem 1rem', border: 'none', color: '#fff', borderRadius: '6px' }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
