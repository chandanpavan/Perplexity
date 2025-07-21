// src/pages/Register.jsx

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
    background: 'linear-gradient(90deg, #9f51ff, #7b24c7)',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginTop: '1rem',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
        setError(data.message || data.errors?.[0]?.msg || 'Register failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      navigate('/dashboard');
    } catch (err) {
      setError('Server error. Try again later.');
      console.error('Registration error:', err);
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
          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}
