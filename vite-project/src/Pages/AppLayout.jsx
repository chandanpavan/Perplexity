import React from 'react';

const layoutStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '2rem',
  width: '100%',
};

export default function AppLayout({ children }) {
  return <div style={layoutStyle}>{children}</div>;
}
