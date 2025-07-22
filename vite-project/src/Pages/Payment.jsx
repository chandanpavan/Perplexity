import React, { useState, useEffect } from 'react';

export default function Payments() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/payments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance || 0);
        setHistory(data.history || []);
      });
  }, []);

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '3rem auto',
        background: '#1f0d2e',
        padding: '2rem',
        borderRadius: '12px',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
        boxShadow: '0 0 20px rgba(147, 85, 220, 0.3)',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ddb6ff' }}>
        💳 Wallet & Payments
      </h1>

      <h2
        style={{
          fontSize: '1.7rem',
          marginBottom: '1.5rem',
          color: '#7fff9e',
        }}
      >
        🪙 Balance: ₹{balance}
      </h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button style={buttonStyle}>➕ Add Funds</button>
        <button style={{ ...buttonStyle, background: '#ff4f81' }}>💸 Withdraw</button>
      </div>

      <h3 style={{ marginBottom: '1rem', color: '#caa2ff' }}>📜 Transaction History</h3>

      {history.length === 0 ? (
        <p style={{ color: '#bbb' }}>No transactions yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Date</th>
              <th style={thTdStyle}>Type</th>
              <th style={thTdStyle}>Amount</th>
              <th style={thTdStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx) => (
              <tr key={tx.id}>
                <td style={thTdStyle}>
                  {new Date(tx.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td style={thTdStyle}>{tx.type}</td>
                <td style={thTdStyle}>₹{tx.amount.toFixed(2)}</td>
                <td style={{ ...thTdStyle, color: tx.status === 'Success' ? '#7fff87' : '#ff9595' }}>
                  {tx.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '0.7rem 1.5rem',
  background: '#6e42c1',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#2a1b44',
  boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
  borderRadius: '10px',
  overflow: 'hidden',
};

const thTdStyle = {
  padding: '1rem',
  borderBottom: '1px solid #432b68',
  fontSize: '0.95rem',
  textAlign: 'left',
};
