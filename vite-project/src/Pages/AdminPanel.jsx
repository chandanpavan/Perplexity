import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const token = localStorage.getItem('token');
  const [tournaments, setTournaments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all tournaments on load
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/tournaments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTournaments(data.reverse())); // Show latest first
  }, []);

  const startEdit = (t) => {
    setEditingId(t._id);
    setFormData({ ...t });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const confirmed = window.confirm('Are you sure you want to delete this tournament?');
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/api/admin/tournaments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      setTournaments((prev) => prev.filter((t) => t._id !== id));
      alert('🗑 Deleted successfully');
    } else {
      alert(data.message || 'Could not delete');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        color: '#fff',
        background: '#150022',
        minHeight: '100vh',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#ddb6ff' }}>🏆 Admin Tournament Manager</h1>

      {tournaments.length === 0 && <p>Loading tournaments...</p>}

      {tournaments.map((tourney) => (
        <div
          key={tourney._id}
          style={{
            background: '#29163f',
            padding: '1rem',
            borderRadius: '12px',
            margin: '1rem 0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          }}
        >
          {editingId === tourney._id ? (
            <>
              <input
                name="game"
                value={formData.game}
                onChange={handleChange}
                placeholder="Game"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              />
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              />
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              />
              <input
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="Reward"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={saveTournament}
                style={{
                  background: '#2ecc71',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  marginRight: '1rem',
                }}
              >
                💾 Save
              </button>
              <button
                onClick={cancelEdit}
                style={{
                  background: '#999',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3 style={{ color: '#c38fff' }}>{tourney.game}</h3>
              <p>{tourney.date} at {tourney.time}</p>
              <p>Reward: {tourney.reward} | Status: {tourney.status}</p>
              <button
                onClick={() => startEdit(tourney)}
                style={{
                  background: '#6a5acd',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  marginRight: '1rem',
                }}
              >
                ✏ Edit
              </button>
              <button
                onClick={() => deleteTournament(tourney._id)}
                style={{
                  background: '#ff5e7e',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              >
                ❌ Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
