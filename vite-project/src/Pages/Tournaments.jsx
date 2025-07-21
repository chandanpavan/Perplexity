import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1f0029, #32004a)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    padding: '2rem',
  },
  heading: {
    fontSize: '2.2rem',
    marginBottom: '1rem',
    color: '#dcb2ff',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  search: {
    flex: 1,
    padding: '0.6rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    textAlign: 'center',
  },
  card: {
    background: '#2d1e44',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(128, 90, 213, 0.3)',
  },
  title: {
    fontSize: '1.3rem',
    color: '#c364ff',
    marginBottom: '0.5rem',
  },
  button: {
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    background: '#9f51ff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  buttonDisabled: {
    background: '#555',
    cursor: 'not-allowed',
  },
  countdown: {
    fontSize: '0.9rem',
    color: '#a8a1ff',
    marginTop: '0.3rem',
  }
};

export default function Tournaments() {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const [tournaments, setTournaments] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // ⏳ Fetch Tournaments + Refresh
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
        .then((data) => setJoinedIds(data.map(t => t._id)));
    };

    fetchTournaments();
    fetchJoined();

    const refresh = setInterval(() => {
      fetchTournaments();
    }, 60000);

    return () => clearInterval(refresh);
  }, [token, email]);

  const handleJoin = async (tournamentId) => {
    if (!token) {
      alert('Please login to join.');
      return;
    }

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
        alert(`✅ ${data.message}`);
        setJoinedIds((prev) => [...prev, tournamentId]);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error joining tournament.');
    }
  };

  const getCountdown = (dateStr, timeStr) => {
    const target = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return '🕹️ Already Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;

    return `⏳ Starts in ${days}d ${hours}h ${minutes}m`;
  };

  const filtered = tournaments.filter((t) => {
    const matchSearch = t.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏆 Tournaments</h1>

      <div style={styles.filters}>
        <input
          type="text"
          style={styles.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search by game"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.search}
        >
          <option value="All">All</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Live">Live</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No matching tournaments found.</p>
      ) : (
        filtered.map((tourney) => (
          <div key={tourney._id} style={styles.card}>
            <h2 style={styles.title}>{tourney.game}</h2>
            <p>Date: {tourney.date}</p>
            <p>Time: {tourney.time}</p>
            <p>Reward: {tourney.reward}</p>
            <p>Status: <strong>{tourney.status}</strong></p>
            <p style={styles.countdown}>
              {getCountdown(tourney.date, tourney.time)}
            </p>
            <button
              style={{
                ...styles.button,
                ...(joinedIds.includes(tourney._id) && styles.buttonDisabled),
              }}
              disabled={joinedIds.includes(tourney._id)}
              onClick={() => handleJoin(tourney._id)}
            >
              {joinedIds.includes(tourney._id) ? '✅ Joined' : 'Join Tournament'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
