import React, { useEffect, useState } from 'react';

export default function FriendRequests() {
  const token = localStorage.getItem('token');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/friends/requests', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRequests);
  }, [token]);

  const respond = async (id, action) => {
    await fetch('http://localhost:5000/api/friends/respond', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId: id, action }),
    });

    setRequests((prev) => prev.filter((req) => req._id !== id));
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '3rem auto',
        padding: '2rem',
        background: '#1e0f30',
        borderRadius: '12px',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
        boxShadow: '0 0 12px rgba(128, 90, 213, 0.3)',
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#ddb6ff',
          textAlign: 'center',
        }}
      >
        🤝 Friend Requests
      </h2>

      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#bbb' }}>No pending requests.</p>
      ) : (
        requests.map((req, i) => (
          <div
            key={i}
            style={{
              background: '#2d1e44',
              padding: '1.2rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '1.1rem', flex: 1 }}>
              👤 From: <strong>{req.from.email}</strong>
            </p>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={() => respond(req._id, 'accepted')}
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                ✅ Accept
              </button>

              <button
                onClick={() => respond(req._id, 'rejected')}
                style={{
                  background: '#e53935',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
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
