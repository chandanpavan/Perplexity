import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            required
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
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

        <p style={styles.linkText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    background: 'linear-gradient(120deg, #1a0024, #29033c, #120026)',
    fontFamily: 'Poppins, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: 'rgba(37, 17, 51, 0.95)',
    padding: '3rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 12px 48px rgba(148, 85, 220, 0.4)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    color: '#c89bff',
    marginBottom: '2rem',
    textShadow: '0 2px 8px #894bdd',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    marginBottom: '1.2rem',
    fontSize: '1rem',
    background: '#2e1c3b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
    transition: '0.2s ease',
  },
  button: {
    width: '100%',
    padding: '0.9rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #c364ff, #a03de2)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease-in-out',
    boxShadow: '0 4px 14px rgba(148, 85, 220, 0.3)',
  },
  buttonHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 6px 20px rgba(148, 85, 220, 0.5)',
  },
  error: {
    color: '#ff5959',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '1.2rem',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '1.4rem',
    fontSize: '0.95rem',
    color: '#ccc',
  },
  link: {
    color: '#b364f9',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
