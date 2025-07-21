import React, { useState } from 'react';

export default function AddFriend() {
  const token = localStorage.getItem('token');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const searchUsers = async () => {
    const res = await fetch(`http://localhost:5000/api/friends/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResults(data);
  };

  const sendRequest = async (email) => {
    const res = await fetch('http://localhost:5000/api/friends/request', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toEmail: email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', color: 'white' }}>
      <h2>🔎 Search Players</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter email..."
        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem' }}
      />
      <button onClick={searchUsers} style={{ padding: '0.5rem 1rem', background: '#9f51ff', color: '#fff', border: 'none', borderRadius: '6px' }}>
        Search
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}

      {results.map((user, i) => (
        <div key={i} style={{ marginTop: '1rem', background: '#2e1c3e', padding: '1rem', borderRadius: '8px' }}>
          <div>{user.email}</div>
          <button
            onClick={() => sendRequest(user.email)}
            style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', background: '#6a5acd', color: 'white', border: 'none', borderRadius: '6px' }}
          >
            ➕ Send Friend Request
          </button>
        </div>
      ))}
    </div>
  );
}
