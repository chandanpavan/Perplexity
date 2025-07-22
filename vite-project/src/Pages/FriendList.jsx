import React, { useEffect, useState } from 'react';
import FriendChat from './FriendChat'; // ✅ Import component

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
    <div
      style={{
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '1rem',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
      }}
    >
      <h2
        style={{
          fontSize: '2.4rem',
          marginBottom: '2rem',
          color: '#ddb6ff',
          textAlign: 'center',
        }}
      >
        👥 Your Friends
      </h2>

      {friends.length === 0 ? (
        <p style={{ textAlign: 'center' }}>
          You don’t have any friends yet 😢
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {friends.map((user, i) => {
            const isActive = activeChat && activeChat._id === user._id;

            return (
              <div
                key={i}
                style={{
                  background: isActive ? '#4a2f66' : '#3c235a',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: isActive
                    ? '0 0 12px rgba(198,97,255,0.3)'
                    : '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.6rem',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    {user.email}
                  </span>
                  <button
                    onClick={() => toggleChat(user)}
                    style={{
                      background: isActive ? '#8e3bff' : '#9355f5',
                      color: '#fff',
                      padding: '0.5rem 1.2rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    {isActive ? '🛑 Close' : '💬 Chat'}
                  </button>
                </div>

                {isActive && (
                  <div style={{ marginTop: '1rem' }}>
                    <FriendChat friend={user} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
