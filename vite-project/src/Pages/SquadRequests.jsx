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
          setRequests(data.pendingRequests || []);
          setSquadId(data._id);
        }
      });
  }, [token]);

  const respond = async (userId, action) => {
    try {
      const res = await fetch('http://localhost:5000/api/squads/manage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ squadId, userId, action }),
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== userId));
      }
    } catch (err) {
      console.error('Request response error:', err);
    }
  };

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '3rem auto',
        padding: '2rem',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', color: '#ddb6ff', marginBottom: '2rem' }}>
        📩 Pending Join Requests
      </h1>

      {requests.length === 0 ? (
        <p style={{ color: '#aaa' }}>No pending requests at this time.</p>
      ) : (
        requests.map((r) => (
          <div
            key={r._id}
            style={{
              background: '#301f45',
              padding: '1.2rem',
              borderRadius: '12px',
              marginBottom: '1.2rem',
              boxShadow: '0 4px 12px rgba(147, 85, 220, 0.2)',
            }}
          >
            <p style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
              👤 <strong>{r.email}</strong>
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => respond(r._id, 'accept')}
                style={{
                  background: '#28a745',
                  padding: '0.5rem 1.2rem',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                ✅ Accept
              </button>

              <button
                onClick={() => respond(r._id, 'reject')}
                style={{
                  background: '#dc3545',
                  padding: '0.5rem 1.2rem',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
