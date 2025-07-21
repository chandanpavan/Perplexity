import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default function SquadChat({ squadId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('join-squad', squadId);

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive-message'); // clean up
    };
  }, [squadId]);

  const send = () => {
    if (input.trim()) {
      socket.emit('send-squad-message', { squadId, message: input });
      setMessages((prev) => [...prev, {
        senderId: 'you',
        message: input,
        timestamp: Date.now(),
      }]);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '1rem', background: '#2a1e3c', borderRadius: '8px' }}>
      <h3>🗨 Squad Chat</h3>
      <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '0.5rem', color: msg.senderId === 'you' ? '#afffff' : '#eee' }}>
            <strong>{msg.senderId === 'you' ? 'You' : msg.senderId}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        style={{ width: '80%', marginRight: '1rem', padding: '0.5rem' }}
      />
      <button onClick={send} style={{ padding: '0.5rem 1.2rem', background: '#9355f5', border: 'none', color: 'white', borderRadius: '6px' }}>
        Send
      </button>
    </div>
  );
}
