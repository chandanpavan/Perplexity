// src/pages/AdminPanel.jsx

import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1f0029, #32004a)',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
    padding: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: '#2f1d40',
    padding: '2rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #4a2f62',
    background: '#301d41',
    color: '#fff',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.7rem 1.6rem',
    fontWeight: '600',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background 0.2s',
  },
  edit: {
    background: '#6d5de4',
  },
  delete: {
    background: '#ff5e7e',
  },
  save: {
    background: '#2ecc71',
  },
  cancel: {
    background: '#999',
  },
  title: {
    textAlign: 'center',
    color: '#ddb6ff',
    fontSize: '2.4rem',
    marginBottom: '2.5rem',
  },
  header: {
    fontSize: '1.6rem',
    marginBottom: '0.5rem',
    color: '#f1d4ff',
  },
  detailText: {
    fontSize: '1.1rem',
    lineHeight: 1.5,
    color: '#d5c5e5',
  },
};

export default function AdminPanel() {
  const token = localStorage.getItem('token');
  const [tournaments, setTournaments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all tournaments
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/tournaments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  const deleteTournament = async (id) => {
    if (!window.confirm('Delete this tournament?')) return;

    const res = await fetch(`http://localhost:5000/api/admin/tournaments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setTournaments(tournaments.filter((t) => t._id !== id));
      alert('Tournament deleted');
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setFormData(t);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveTournament = async () => {
    const res = await fetch(`http://localhost:5000/api/admin/tournaments/${editingId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setTournaments(tournaments.map((t) => (t._id === editingId ? data.updated : t)));
      setEditingId(null);
      alert('Tournament updated!');
    } else {
      alert(data.message || 'Error updating');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏆 Admin Tournament Manager</h1>

      {tournaments.map((t) => (
        <div key={t._id} style={styles.card}>
          {editingId === t._id ? (
            <>
              <input name="game" style={styles.input} value={formData.game} onChange={handleChange} />
              <input name="date" style={styles.input} value={formData.date} type="date" onChange={handleChange} />
              <input name="time" style={styles.input} value={formData.time} type="time" onChange={handleChange} />
              <input name="reward" style={styles.input} value={formData.reward} onChange={handleChange} />
              <select name="status" style={styles.input} value={formData.status} onChange={handleChange}>
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
              <div style={styles.buttonGroup}>
                <button
                  style={{ ...styles.button, ...styles.save }}
                  onClick={saveTournament}
                >
                  💾 Save
                </button>
                <button
                  style={{ ...styles.button, ...styles.cancel }}
                  onClick={cancelEdit}
                >
                  ❌ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 style={styles.header}>{t.game}</h3>
              <p style={styles.detailText}>
                📅 {t.date} &nbsp; 🕑 {t.time} &nbsp; | &nbsp;
                <strong>Status:</strong> {t.status} &nbsp; | &nbsp;
                🏆 <strong>Reward:</strong> {t.reward}
              </p>
              <div style={styles.buttonGroup}>
                <button
                  style={{ ...styles.button, ...styles.edit }}
                  onClick={() => startEdit(t)}
                >
                  ✏ Edit
                </button>
                <button
                  style={{ ...styles.button, ...styles.delete }}
                  onClick={() => deleteTournament(t._id)}
                >
                  ❌ Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
