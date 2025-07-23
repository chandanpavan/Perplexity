import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main style={styles.main}>
      <h1 style={styles.header}>
        Level Up <span style={styles.highlight}>Your Gaming Career</span>
      </h1>

      <p style={styles.tagline}>
        Play. Win. Get Discovered. <br />
        <span style={styles.subHighlight}>
          #1 Pro Platform for Free Fire & PUBG Players
        </span>
      </p>

      <nav style={styles.nav}>
        <Link to="/tournaments" style={styles.link}>🏆 Tournaments</Link>
        <Link to="/login" style={styles.link}>🔑 Login / Register</Link>
        <Link to="/dashboard" style={styles.link}>📊 My Dashboard</Link>
        <Link to="/tournaments" style={styles.link}>🎮 Browse Tournaments</Link>
      </nav>

      <section style={styles.featuresWrap}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🔥 Play Ranked Tournaments</div>
          Compete with the best, climb leaderboards, and earn epic rewards every week.
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>📈 Track Your Progress</div>
          Advanced stats, match history, and personalized analytics to showcase your growth.
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🔎 Get Discovered</div>
          Top talent gets scouted by esports teams and coaches from across the region!
        </div>
      </section>

      <button
        style={styles.joinButton}
        onClick={() => (window.location.href = '/tournaments')}>
        Join Your First Tournament
      </button>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    padding: '4rem 2rem',
    margin: '0 auto',
    background: 'linear-gradient(120deg, #1a0024 0%, #32004a 70%, #120026 100%)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '1400px',
  },
  header: {
    fontSize: '3rem',
    fontWeight: 800,
    letterSpacing: '1px',
    color: '#fff',
    marginBottom: '1rem',
    textAlign: 'center',
    textShadow: '0 6px 24px #9e5be7, 0 1.5px 5px #4B2067',
  },
  highlight: {
    color: '#b364f9',
    fontWeight: 900,
  },
  subHighlight: {
    color: '#ffffff',
    fontWeight: 500,
  },
  tagline: {
    fontSize: '1.5rem',
    marginBottom: '3rem',
    color: '#e0c0fb',
    letterSpacing: '0.05em',
    maxWidth: '800px',
    textAlign: 'center',
    textShadow: '0 2px 8px #53187b',
    lineHeight: '1.6',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '4rem',
  },
  link: {
    background: 'linear-gradient(90deg,#b364f9,#7927b2)',
    color: '#fff',
    padding: '0.9rem 2rem',
    borderRadius: '2rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    textDecoration: 'none',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
    boxShadow: '0 3px 14px rgba(179,100,249,0.3)',
  },
  featuresWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    maxWidth: '1200px',
    padding: '1rem 0',
  },
  card: {
    background: 'rgba(39,17,64,0.95)',
    borderRadius: '1.4rem',
    padding: '2rem',
    flex: '1 1 300px',
    maxWidth: '360px',
    color: '#e9dbfa',
    boxShadow: '0 4px 24px rgba(126,70,214,0.5)',
    border: '1.5px solid #6327ae85',
    textAlign: 'center',
    fontSize: '1.05rem',
    lineHeight: '1.6',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#b364f9',
    marginBottom: '0.7rem',
    textShadow: '0 1px 5px #4B2067',
  },
  joinButton: {
    marginTop: '3rem',
    padding: '1.2rem 3rem',
    fontSize: '1.4rem',
    fontWeight: 700,
    borderRadius: '3rem',
    background: 'linear-gradient(90deg, #d14fff, #8b31d1)',
    color: '#fff',
    letterSpacing: '1px',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 4px 16px #b364f9a0',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease',
    textTransform: 'uppercase',
  },
};
<p style={{ textAlign: 'center', marginTop: '1.2rem' }}>
  Don't have an account? <Link to="/register" style={{ color: '#b364f9' }}>Register</Link>
</p>
