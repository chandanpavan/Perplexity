import React, { useEffect, useState } from 'react';
import FriendChat from './FriendChat';
 // ✅ Import component

export default function FriendList() {
  const token = localStorage.getItem('token');
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/friends/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFriends);
  }, [token]);

  const toggleChat = (friend) => {
    if (activeChat && activeChat._id === friend._id) {
      setActiveChat(null); // Toggle off
    } else {
      setActiveChat(friend); // Set selected friend
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#ddb6ff', textAlign: 'center' }}>👥 Your Friends</h2>

      {friends.length === 0 ? (
        <p style={{ textAlign: 'center' }}>You don’t have any friends yet 😢</p>
      ) : (
        friends.map((user, i) => {
          const isActive = activeChat && activeChat._id === user._id;

          return (
            <div
              key={i}
              style={{
                background: isActive ? '#4a2f66' : '#3c235a',
                borderRadius: '10px',
                marginBottom: '1rem',
                padding: '1rem',
                boxShadow: isActive ? '0 0 12px rgba(198,97,255,0.3)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500' }}>{user.email}</span>
                <button
                  onClick={() => toggleChat(user)}
                  style={{
                    padding: '0.5rem 1.2rem',
                    background: isActive ? '#8e3bff' : '#9f51ff',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease-in-out',
                  }}
                >
                  {isActive ? '🛑 Close' : '💬 Chat'}
                </button>
              </div>

              {/* Inline FriendChat when selected */}
              {isActive && (
                <div style={{ marginTop: '1rem' }}>
                  <FriendChat friend={user} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
