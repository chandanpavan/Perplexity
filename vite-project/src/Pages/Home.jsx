import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #1a0024 0%, #32004a 70%, #120026 100%)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0',
    fontFamily: 'Poppins, sans-serif',
  },
  header: {
    marginTop: '3rem',
    fontSize: '2.8rem',
    fontWeight: 700,
    letterSpacing: '1px',
    textShadow: '0 6px 24px #9e5be7, 0 1.5px 5px #4B2067',
  },
  highlight: {
    color: '#b364f9',
    fontWeight: 800,
  },
  tagline: {
    fontSize: '1.5rem',
    marginTop: '0.5rem',
    marginBottom: '2.5rem',
    color: '#e0c0fb',
    letterSpacing: '0.08em',
    textShadow: '0 2px 8px #53187b',
    textAlign: 'center',
  },
  nav: {
    display: 'flex',
    gap: '1.2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '3rem',
  },
  link: {
    background: 'linear-gradient(90deg,#b364f9,#7927b2)',
    color: '#fff',
    padding: '0.7rem 1.6rem',
    borderRadius: '2rem',
    fontWeight: 600,
    textDecoration: 'none',
    fontSize: '1rem',
    boxShadow: '0 2px 16px #6f42c1a6',
    transition: 'transform 0.1s, box-shadow 0.1s, background 0.2s',
  },
  featuresWrap: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '2.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  card: {
    background: 'rgba(39,17,64,0.98)',
    borderRadius: '1.3rem',
    padding: '2rem 1.6rem',
    minWidth: '250px',
    maxWidth: '340px',
    margin: '1rem 0',
    boxShadow: '0 4px 36px #7e46d6c0',
    border: '1.5px solid #6327ae70',
    textAlign: 'center',
    color: '#e9dbfa',
  },
  cardTitle: {
    color: '#b364f9',
    fontWeight: 700,
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    textShadow: '0 1px 6px #4B2067',
  },
  joinButton: {
    marginTop: '3rem',
    background: 'linear-gradient(90deg,#d14fff 0%, #8b31d1 100%)',
    color: '#fff',
    padding: '1rem 2.5rem',
    borderRadius: '2.5rem',
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '0.14em',
    boxShadow: '0 2px 16px #b364f9b5',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    transition: 'background 0.15s, box-shadow 0.18s, transform 0.12s',
  },
};

export default function Home() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        Level Up <span style={styles.highlight}>Your Gaming Career</span>
      </header>
      <div style={styles.tagline}>
        Play. Win. Get Discovered. <br />
        <span style={{ color: '#fff', fontWeight: 500 }}>
          #1 Pro Platform for Free Fire & PUBG Players
        </span>
      </div>

      <nav style={styles.nav}>
        <Link to="/tournaments" style={styles.link}>
          🏆 Tournaments
        </Link>
        <Link to="/login" style={styles.link}>
          🔑 Login / Register
        </Link>
        <Link to="/dashboard" style={styles.link}>
          📊 My Dashboard
        </Link>
        <Link to="/tournaments" style={styles.link}>
          🎮 View Tournaments
        </Link>
      </nav>

      <section style={styles.featuresWrap}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🔥 Play Ranked Tournaments</div>
          Compete with the best, climb leaderboards, and earn epic rewards every week.
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>📈 Track Your Progress</div>
          Advanced stats, match history, & personalized analytics to showcase your growth.
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🔎 Get Discovered</div>
          Top talent gets scouted by esports teams and coaches from all over the region!
        </div>
      </section>

      <button
        style={styles.joinButton}
        onClick={() => (window.location.href = '/tournaments')}
      >
        Join Your First Tournament
      </button>
    </main>
  );
}
