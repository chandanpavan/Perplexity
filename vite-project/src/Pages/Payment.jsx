import React, { useState, useEffect } from 'react';

export default function Payments() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch balance and history from backend
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', color: '#fff' }}>
      <h1>Wallet & Payments</h1>
      <h2>Balance: ₹{balance}</h2>
      <button>Add Funds</button>
      <button>Withdraw</button>
      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Type</th><th>Amount</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>₹{tx.amount}</td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
