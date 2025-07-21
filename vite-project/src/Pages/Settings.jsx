import React, { useState } from 'react';

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // ...other state variables

  const handleUpdate = (e) => {
    e.preventDefault();
    // Send PATCH/PUT to backend, update info
    // Show success feedback
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', color: '#fff' }}>
      <h1>Player Settings</h1>
      <form onSubmit={handleUpdate}>
        <label>Display Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        {/* Add password fields, avatar pickers, toggles, etc */}
        <button type="submit">Update</button>
      </form>
      {/* Add Delete Account button, Privacy options, etc */}
    </div>
  );
}
