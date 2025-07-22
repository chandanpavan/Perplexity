import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default function SquadChat({ squadId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Auto scroll to bottom on message update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (squadId) socket.emit('join-squad', squadId);

    const onChat = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive-message', onChat);

    return () => {
      socket.off('receive-message', onChat);
    };
  }, [squadId]);

  const send = () => {
    if (!input.trim()) return;
    const message = {
      squadId,
      message: input,
    };
    socket.emit('send-squad-message', message);
    setMessages((prev) => [
      ...prev,
      {
        senderId: 'you',
        message: input,
        timestamp: Date.now(),
      },
    ]);
    setInput('');
  };

  return (
    <div
      style={{
        background: '#261a36',
        padding: '1.5rem',
        borderRadius: '12px',
        maxWidth: '700px',
        margin: '0 auto',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h3 style={{ color: '#ddb6ff', marginBottom: '1rem', fontSize: '1.5rem' }}>🗨 Squad Chat</h3>

      {/* Chat box */}
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          background: '#2f1f47',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          scrollBehavior: 'smooth',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.7rem',
              textAlign: msg.senderId === 'you' ? 'right' : 'left',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: msg.senderId === 'you' ? '#9355f5' : '#3d2a54',
                padding: '0.6rem 1rem',
                color: '#fff',
                borderRadius: '10px',
                maxWidth: '70%',
                fontSize: '0.95rem',
              }}
            >
              <strong style={{ fontSize: '0.8rem', display: 'block', color: '#bbb' }}>
                {msg.senderId === 'you' ? 'You' : msg.senderId}
              </strong>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Row */}
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            background: '#3b2a52',
            color: '#fff',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={send}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#9256f0',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
