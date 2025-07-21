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

    setRequests(prev => prev.filter(req => req._id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', color: 'white' }}>
      <h2>🤝 Friend Requests</h2>
      {requests.length === 0 ? <p>No pending requests</p> : requests.map((req, i) => (
        <div key={i} style={{ background: '#2d1e44', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <p>From: {req.from.email}</p>
          <button onClick={() => respond(req._id, 'accepted')} style={{ marginRight: '1rem', background: 'green', color: '#fff', borderRadius: '6px', padding: '0.4rem 1rem', border: 'none' }}>Accept</button>
          <button onClick={() => respond(req._id, 'rejected')} style={{ background: 'red', color: '#fff', borderRadius: '6px', padding: '0.4rem 1rem', border: 'none' }}>Reject</button>
        </div>
      ))}
    </div>
  );
}
