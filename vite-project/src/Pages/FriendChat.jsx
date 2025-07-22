import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// Socket.IO setup
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
  autoConnect: false,
});

export default function FriendChat({ friend }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentUserId = localStorage.getItem('user_id');

  // 🔽 Ref to auto-scroll to latest message
  const bottomRef = useRef(null);

  // 🔁 Scroll to bottom every time messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 🔁 Fetch history & set up socket
  useEffect(() => {
    if (!friend) return;

    socket.connect();

    // Step 1: Load chat history
    fetch(`http://localhost:5000/api/messages/dm/${friend._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data || []));

    // Step 2: Socket listener
    const listener = (msg) => {
      const isRelevant =
        (msg.senderId === friend._id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === friend._id);

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive-dm', listener);

    // Cleanup
    return () => {
      socket.off('receive-dm', listener);
      socket.disconnect();
    };
  }, [friend, currentUserId]);

  // 🧾 Send message
  const send = () => {
    if (!input.trim()) return;

    const message = {
      toUserId: friend._id,
      message: input,
    };

    socket.emit('send-dm', message);

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
    <div style={{ padding: '1rem', background: '#2e1c3e', borderRadius: '12px' }}>
      <h2>💬 Chat with {friend.email}</h2>

      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          marginBottom: '1rem',
          background: '#301f45',
          padding: '1rem',
          borderRadius: '10px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.5rem',
              textAlign: msg.senderId === currentUserId ? 'right' : 'left',
            }}
          >
            <span
              style={{
                background: msg.senderId === currentUserId ? '#9256f0' : '#444',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                display: 'inline-block',
                color: '#fff',
                maxWidth: '80%',
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
        {/* 👇 Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{
            width: '75%',
            padding: '0.6rem',
            border: 'none',
            borderRadius: '6px',
            marginRight: '0.5rem',
          }}
        />
        <button
          onClick={send}
          style={{
            padding: '0.6rem 1rem',
            background: '#9355f5',
            border: 'none',
            color: '#fff',
            borderRadius: '6px',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
