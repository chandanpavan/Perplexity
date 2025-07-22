import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const token = localStorage.getItem('token');
  const [tournaments, setTournaments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/tournaments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTournaments(data.reverse()));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const startEdit = (t) => {
    setEditingId(t._id);
    setFormData({ ...t });
    setCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    setFormData({});
  };

  const saveTournament = async () => {
    try {
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
        setTournaments((prev) =>
          prev.map((t) => (t._id === editingId ? data.updated : t))
        );
        setEditingId(null);
        alert('✅ Tournament updated!');
      } else {
        alert(data.message || 'Error saving tournament');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTournament = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this tournament?');
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/admin/tournaments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setTournaments((prev) => prev.filter((t) => t._id !== id));
      alert('🗑 Deleted successfully');
    } else {
      alert(data.message || 'Error deleting tournament');
    }
  };

  const createTournament = async () => {
    const { game, date, time, reward, status } = formData;
    if (!game || !date || !time || !reward || !status) {
      alert('⚠ All fields are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/tournaments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setTournaments([data.tournament, ...tournaments]);
        setFormData({});
        setCreating(false);
        alert('✅ Tournament created!');
      } else {
        alert(data.message || 'Create failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: '3rem',
        background: '#150022',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#ddb6ff', fontSize: '2.5rem', marginBottom: '2rem' }}>
        🛠 Tournament Manager Panel
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          style={mainButton}
          onClick={() => {
            setCreating(true);
            setFormData({ game: '', date: '', time: '', reward: '', status: 'Upcoming' });
            setEditingId(null);
          }}
        >
          ➕ Create New Tournament
        </button>
      </div>

      {(creating || editingId) && (
        <div style={formCard}>
          <h2>{creating ? '🆕 Create New Tournament' : '✏ Edit Tournament'}</h2>
          <input name="game" value={formData.game} onChange={handleChange} placeholder="Game" style={inputStyle} />
          <input name="date" type="date" value={formData.date} onChange={handleChange} style={inputStyle} />
          <input name="time" type="time" value={formData.time} onChange={handleChange} style={inputStyle} />
          <input name="reward" value={formData.reward} onChange={handleChange} placeholder="Reward" style={inputStyle} />
          <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button onClick={creating ? createTournament : saveTournament} style={greenBtn}>
              💾 {creating ? 'Create' : 'Save'}
            </button>
            <button onClick={cancelEdit} style={grayBtn}>Cancel</button>
          </div>
        </div>
      )}

      {tournaments.map((t) => (
        <div key={t._id} style={cardStyle}>
          <h3 style={{ color: '#ddb6ff', fontSize: '1.3rem' }}>{t.game}</h3>
          <p style={pStyle}>📅 {t.date} @ 🕒 {t.time}</p>
          <p style={pStyle}>🏆 Reward: {t.reward}</p>
          <p style={pStyle}>📌 Status: {t.status}</p>
          <p style={pStyle}>👥 Players: {t.participants?.length || 0}</p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button onClick={() => startEdit(t)} style={purpleBtn}>✏ Edit</button>
            <button onClick={() => deleteTournament(t._id)} style={redBtn}>❌ Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// === Styles ===
const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  borderRadius: '8px',
  border: 'none',
  marginBottom: '1rem',
  background: '#402a63',
  color: '#fff',
};

const formCard = {
  background: '#270b3f',
  padding: '2rem',
  borderRadius: '12px',
  marginBottom: '2rem',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
};

const cardStyle = {
  background: '#29163f',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
};

const pStyle = {
  margin: '0.4rem 0',
  color: '#e2d4f7',
};

const mainButton = {
  background: '#9f51ff',
  color: '#fff',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '10px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
};

const greenBtn = {
  background: '#2ecc71',
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer',
};

const grayBtn = {
  background: '#888',
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: '500',
  cursor: 'pointer',
};

const purpleBtn = {
  background: '#6a5acd',
  color: '#fff',
  padding: '0.5rem 1.2rem',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '500',
  cursor: 'pointer',
};

const redBtn = {
  background: '#ff5e7e',
  color: '#fff',
  padding: '0.5rem 1.2rem',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '500',
  cursor: 'pointer',
};
