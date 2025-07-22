import React, { useEffect, useState } from 'react';

export default function Settings() {
  const token = localStorage.getItem('token');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [theme, setTheme] = useState('dark');
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setEmail(data.email || '');
        setName(data.name || '');
      });
  }, [token]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      setMessage(res.ok ? '✅ Profile updated successfully' : data.message || 'Update failed');
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('🔒 Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(data.message || 'Password change failed');
      }
    } catch {
      setMessage('Server error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Account deleted 💥');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        setMessage(data.message || 'Failed to delete account.');
      }
    } catch {
      setMessage('Server error.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 760,
        margin: '3rem auto',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
        padding: '2rem',
        background: '#1a0e2d',
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(120,80,200,0.2)',
      }}
    >
      <h1 style={{ color: '#dcb2ff', fontSize: '2rem', marginBottom: '1.5rem' }}>
        ⚙️ Player Settings
      </h1>

      {message && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#341e50',
            borderRadius: '10px',
            color: '#c3ffea',
          }}
        >
          {message}
        </div>
      )}

      {/* Avatar */}
      <section style={{ marginBottom: '2rem' }}>
        <label>🖼 Profile Avatar</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          {preview && <img src={preview} width={64} height={64} alt="Preview" style={{ borderRadius: '50%' }} />}
        </div>
      </section>

      {/* Profile Info */}
      <form onSubmit={handleUpdate} style={{ marginBottom: '2rem' }}>
        <label>Display Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <label>Email Address</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <button type="submit" style={primaryBtn}>💾 Save Changes</button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#c6a1f9' }}>🔒 Change Password</h3>
        <label>Current Password</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} />
        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
        <button type="submit" style={{ ...primaryBtn, background: '#ff567c' }}>
          Update Password
        </button>
      </form>

      {/* Theme */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>🌗 Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ ...inputStyle, paddingRight: '1rem' }}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      {/* Danger Zone */}
      <div style={{ borderTop: '1px solid #444', paddingTop: '2rem' }}>
        <h3 style={{ color: '#ff7e7e' }}>🚨 Danger Zone</h3>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} style={dangerBtn}>Delete My Account</button>
        ) : (
          <>
            <p style={{ marginBottom: '1rem', color: '#f8caca' }}>
              This will permanently delete your account. This action is irreversible.
            </p>
            <label>Confirm with Password</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
            />
            <button onClick={handleDeleteAccount} style={dangerBtn}>Yes, delete</button>
            <button onClick={() => setConfirmDelete(false)} style={cancelBtn}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  background: '#2f1e4b',
  color: '#fff',
  border: 'none',
  fontSize: '1rem',
};

const primaryBtn = {
  width: '100%',
  padding: '0.85rem',
  background: 'linear-gradient(90deg, #9256f0, #7032d8)',
  color: '#fff',
  fontWeight: '600',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const dangerBtn = {
  width: '100%',
  padding: '0.85rem',
  background: '#e03b4d',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '8px',
  border: 'none',
  marginBottom: '1rem',
  cursor: 'pointer',
};

const cancelBtn = {
  width: '100%',
  padding: '0.7rem',
  background: '#777',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
