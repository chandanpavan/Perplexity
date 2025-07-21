import React, { useEffect, useState } from 'react';

export default function FriendList() {
  const token = localStorage.getItem('token');
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/friends/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFriends);
  }, [token]);

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', color: 'white' }}>
      <h2>👥 Your Friends</h2>
      {friends.length === 0 ? (
        <p>You don’t have any friends yet 😢</p>
      ) : (
        friends.map((user, i) => (
          <div key={i} style={{ marginBottom: '1rem', background: '#3c235a', borderRadius: '6px', padding: '0.8rem 1rem' }}>
            <span>{user.email}</span>
          </div>
        ))
      )}
    </div>
  );
}
