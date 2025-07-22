import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(120deg, #1a0024, #29033c, #120026)',
    fontFamily: 'Poppins, sans-serif',
    color: '#fff',
  },
  card: {
    background: 'rgba(37, 17, 51, 0.95)',
    padding: '2.5rem 2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(148, 85, 220, 0.4)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '1.9rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#c89bff',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
    background: '#2e1c3b',
    color: '#fff',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #c364ff, #a03de2)',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.2s',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.errors?.[0]?.msg || 'Login failed');
        return;
      }

      // ✅ Store token, email, AND userId
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('user_id', data.userId); // ✅ added user_id for Socket.IO & chat support

      navigate('/dashboard');
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Server error. Please try again.');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Player Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
