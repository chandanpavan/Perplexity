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
    padding: '2rem',
  },
  card: {
    background: 'rgba(37, 17, 51, 0.95)',
    padding: '2.8rem 2.4rem',
    borderRadius: '16px',
    boxShadow: '0 12px 48px rgba(148, 85, 220, 0.4)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#c89bff',
    textShadow: '0 2px 8px #894bdd',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '1.2rem',
    border: 'none',
    borderRadius: '8px',
    background: '#2e1c3b',
    color: '#fff',
    fontSize: '1rem',
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  inputFocus: {
    background: '#39244f',
    boxShadow: '0 0 6px rgba(179, 100, 249, 0.6)',
  },
  button: {
    width: '100%',
    padding: '0.9rem',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #c364ff, #a03de2)',
    color: '#fff',
    fontSize: '1.15rem',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'transform 0.14s ease, box-shadow 0.15s ease',
    boxShadow: '0 4px 14px rgba(148, 85, 220, 0.3)',
  },
  buttonHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 24px rgba(148, 85, 220, 0.5)',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginTop: '0.8rem',
    marginBottom: '1.2rem',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnHover, setBtnHover] = useState(false);

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

      // ✅ Store credentials
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('user_id', data.userId);

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
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
            type="email"
            placeholder="Email"
            required
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            style={btnHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
