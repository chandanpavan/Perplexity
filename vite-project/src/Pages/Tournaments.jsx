import React, { useState, useEffect } from 'react';

export default function Tournaments() {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const [tournaments, setTournaments] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchTournaments = () => {
      fetch('http://localhost:5000/api/admin/tournaments', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
          setTournaments(sorted);
        });
    };

    const fetchJoined = () => {
      fetch(`http://localhost:5000/api/users/${email}/joined`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setJoinedIds(data.map((t) => t._id)));
    };

    fetchTournaments();
    fetchJoined();

    const interval = setInterval(fetchTournaments, 60000);
    return () => clearInterval(interval);
  }, [email, token]);

  const handleJoin = async (tournamentId) => {
    if (!token) return showToast('Please login to join.', 'error');

    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`✅ ${data.message}`, 'success');
        setJoinedIds((prev) => [...prev, tournamentId]);
      } else {
        showToast(`❌ ${data.message}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error joining tournament.', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const getCountdown = (dateStr, timeStr) => {
    const target = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return '🕹️ Started';

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);

    const countdownStr = `⏳ Starts in ${d}d ${h}h ${m}m`;

    // Highlight if within 15 minutes
    if (diff < 15 * 60 * 1000) {
      return `${countdownStr} ⚠️ Closing Soon!`;
    }

    return countdownStr;
  };

  const filtered = tournaments.filter((t) => {
    const matchSearch = t.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏆 Esports Tournaments</h1>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search by game"
            style={styles.search}
          />
        </div>
        <div style={styles.tabRow}>
          {['All', 'Upcoming', 'Live', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={styles.tab(status === statusFilter)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No matching tournaments found.</p>
      ) : (
        filtered.map((t) => (
          <div key={t._id} style={styles.card}>
            <h2 style={styles.title}>{t.game}</h2>
            <p>📅 Date: {t.date}</p>
            <p>⏰ Time: {t.time}</p>
            <p>💰 Reward: {t.reward}</p>
            <p>Status: <strong>{t.status}</strong></p>
            <p style={styles.countdown}>{getCountdown(t.date, t.time)}</p>

            {joinedIds.includes(t._id) && (
              <p style={{ color: '#7fff87', fontWeight: '500' }}>🎮 You joined</p>
            )}

            <button
              style={{
                ...styles.button,
                ...(joinedIds.includes(t._id) && styles.buttonDisabled),
              }}
              disabled={joinedIds.includes(t._id)}
              onClick={() => handleJoin(t._id)}
            >
              {joinedIds.includes(t._id) ? '🎯 Joined' : '🎮 Join Tournament'}
            </button>
          </div>
        ))
      )}

      {/* ✅ Toast */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'error' ? '#ff5e7e' : '#26d07c',
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}


const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1f0029, #32004a)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    padding: '2rem',
    paddingBottom: '6rem', // For toast spacing
    maxWidth: '1000px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2.4rem',
    marginBottom: '1.5rem',
    color: '#dcb2ff',
    textAlign: 'center',
  },
  filters: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchBox: {
    width: '100%',
    maxWidth: '500px',
    marginBottom: '1rem',
  },
  search: {
    width: '100%',
    padding: '0.7rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    textAlign: 'center',
    background: '#2d1e44',
    color: '#fff',
  },
  tabRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tab: (active) => ({
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    background: active ? '#a755ff' : '#38214a',
    color: '#fff',
    fontWeight: active ? 'bold' : 'normal',
    cursor: 'pointer',
    border: 'none',
  }),
  card: {
    background: '#2d1e44',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(128, 90, 213, 0.3)',
  },
  title: {
    fontSize: '1.5rem',
    color: '#c364ff',
    marginBottom: '0.6rem',
  },
  button: {
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    border: 'none',
    fontSize: '1rem',
    borderRadius: '6px',
    background: '#9f51ff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out',
  },
  buttonDisabled: {
    background: '#444',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  countdown: {
    fontSize: '0.9rem',
    color: '#a8a1ff',
    marginTop: '0.5rem',
  },
};
