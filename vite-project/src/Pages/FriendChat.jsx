import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// Initialize socket once, but connect only when needed
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
  autoConnect: false,
});

export default function FriendChat({ friend }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentUserId = localStorage.getItem('user_id');
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to socket and load chat history
  useEffect(() => {
    if (!friend) return;

    socket.connect();

    // Fetch chat history
    fetch(`http://localhost:5000/api/messages/dm/${friend._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data || []));

    // Listen for incoming messages
    const listener = (msg) => {
      const isRelevant =
        (msg.senderId === friend._id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === friend._id);

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive-dm', listener);

    return () => {
      socket.off('receive-dm', listener);
      socket.disconnect();
    };
  }, [friend, currentUserId]);

  // Send message
  const send = () => {
    if (!input.trim()) return;

    const message = {
      toUserId: friend._id,
      message: input,
    };

    socket.emit('send-dm', message);

    // Local bubble (optimistic UI)
    setMessages((prev) => [
      ...prev,
      {
        message: input,
        senderId: currentUserId,
        receiverId: friend._id,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '1rem auto',
        padding: '1rem',
        background: '#2e1c3e',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
      }}
    >
      <h2 style={{ marginBottom: '1rem', textAlign: 'center', color: '#ddb6ff' }}>
        💬 Chat with {friend.email}
      </h2>

      {/* Chat Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          background: '#301f45',
          borderRadius: '10px',
          marginBottom: '1rem',
          scrollBehavior: 'smooth',
        }}
      >
        {messages.map((msg, i) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={i}
              style={{
                marginBottom: '0.6rem',
                textAlign: isMine ? 'right' : 'left',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.65rem 1rem',
                  background: isMine ? '#9355f5' : '#444',
                  color: '#fff',
                  borderRadius: '12px',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.message}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: window.innerWidth < 650 ? 'column' : 'row',
          gap: '0.6rem',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
          }}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          style={{
            background: '#9355f5',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            color: '#fff',
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
