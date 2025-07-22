import React, { useEffect, useState } from 'react';

export default function Settings() {
  const token = localStorage.getItem('token');

  // Basic profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Avatar Upload
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Theme and state messages
  const [theme, setTheme] = useState('dark');
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch current user info on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEmail(data.email || '');
        setName(data.name || '');
      });
  }, [token]);

  // Avatar preview
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  // Update Name & Email
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
        body: JSON.stringify({ name, email }), // Avatar can be handled separately
      });
      const data = await res.json();
      setMessage(res.ok ? '✅ Profile updated successfully' : data.message || 'Update failed');
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  // Change password
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
    } catch (err) {
      setMessage('Server error');
    }
  };

  // Delete My Account (with password)
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
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
      }}
    >
      <h1 style={{ color: '#dcb2ff' }}>⚙️ Player Settings</h1>

      {message && (
        <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#341e50', borderRadius: '8px' }}>
          {message}
        </div>
      )}

      {/* Avatar Upload */}
      <div style={{ margin: '1.5rem 0' }}>
        <label>Profile Avatar</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          {preview && <img src={preview} width={64} height={64} style={{ borderRadius: '50%' }} alt="Avatar Preview" />}
        </div>
      </div>

      {/* Profile Update */}
      <form onSubmit={handleUpdate} style={{ marginBottom: '2rem' }}>
        <label>Display Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

        <label>Email Address</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

        <button type="submit" style={primaryBtn}>Save Changes</button>
      </form>

      {/* Password Update */}
      <form onSubmit={handlePasswordChange} style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#c6a1f9' }}>🔐 Change Password</h3>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={{ ...primaryBtn, background: '#ff5e7e' }}>
          Change Password
        </button>
      </form>

      {/* Theme Select */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>🌗 Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={inputStyle}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      {/* Danger Zone – Secure Account Deletion */}
      <div style={{ borderTop: '1px solid #555', paddingTop: '2rem' }}>
        <h3 style={{ color: '#ff7e7e' }}>🚨 Danger Zone</h3>

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} style={dangerBtn}>Delete My Account</button>
        ) : (
          <div>
            <p>This will permanently delete your account. This action is irreversible.</p>

            <label>Confirm Password</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password to confirm"
              style={inputStyle}
            />

            <button onClick={handleDeleteAccount} style={dangerBtn}>Yes, delete</button>
            <button onClick={() => setConfirmDelete(false)} style={cancelBtn}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable styles

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  background: '#372657',
  color: '#fff',
  border: 'none',
  fontSize: '1rem',
};

const primaryBtn = {
  width: '100%',
  padding: '0.8rem',
  background: 'linear-gradient(90deg, #9656f0, #7032d8)',
  color: '#fff',
  border: 'none',
  fontWeight: '600',
  borderRadius: '8px',
  marginTop: '0.5rem',
};

const dangerBtn = {
  width: '100%',
  padding: '0.8rem',
  background: '#cc2f4a',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  marginBottom: '1rem',
};

const cancelBtn = {
  width: '100%',
  padding: '0.6rem',
  background: '#666',
  color: '#fff',
  borderRadius: '6px',
  border: 'none',
};
