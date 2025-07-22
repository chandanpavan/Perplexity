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
    padding: '3rem',
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
    textShadow: '0 1px 6px #481877',
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
    outline: 'none',
    transition: 'all 0.2s',
  },
  button: {
    width: '100%',
    padding: '0.9rem',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #9f51ff, #7b24c7)',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 4px 16px rgba(147, 85, 255, 0.3)',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
  },
  buttonHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 24px #a770ff',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '1.2rem',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.errors?.[0]?.msg || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError('⚠ Server error. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Player Signup</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
