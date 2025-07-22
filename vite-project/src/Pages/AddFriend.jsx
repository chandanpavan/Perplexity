import React, { useState } from 'react';

export default function AddFriend() {
  const token = localStorage.getItem('token');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const searchUsers = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/friends/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResults(data);
      if (data.length === 0) setMessage('No users found.');
      else setMessage('');
    } catch (error) {
      setMessage('Something went wrong.');
    }
  };

  const sendRequest = async (email) => {
    try {
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
    } catch (err) {
      setMessage("Couldn't send request.");
    }
  };

  return (
    <div
      style={{
        padding: '3rem',
        maxWidth: '900px',
        margin: '0 auto',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🔎 Search Players</h2>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter email..."
          style={{
            flex: 1,
            padding: '0.8rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: '#1e1e2f',
            color: '#fff',
          }}
        />
        <button
          onClick={searchUsers}
          style={{
            padding: '0.8rem 1.5rem',
            background: '#9f51ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {message && (
        <p
          style={{
            backgroundColor: '#38244d',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {message}
        </p>
      )}

      <div style={{ display: 'grid', gap: '1.2rem' }}>
        {results.map((user, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#2e1c3e',
              borderRadius: '10px',
            }}
          >
            <div style={{ fontSize: '1rem' }}>{user.email}</div>
            <button
              onClick={() => sendRequest(user.email)}
              style={{
                padding: '0.5rem 1rem',
                background: '#6a5acd',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ➕ Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
