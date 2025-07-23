import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

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
        setError(data.message || data.errors?.[0]?.msg || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('user_id', data.userId);

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
            autoComplete="email"
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
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

        <p style={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login
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
    color: '#fff',
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
    background: 'linear-gradient(90deg, #9f51ff, #7b24c7)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease-in-out',
    boxShadow: '0 4px 14px rgba(147, 85, 255, 0.3)',
  },
  buttonHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 6px 20px #a770ff',
  },
  error: {
    color: '#ff6b6b',
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
