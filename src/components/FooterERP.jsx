import React from 'react';
import softcompHorizontal from '../assets/SOFTCOMP-Logo-horizontal.png';

export default function FooterERP() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(16px)',
      padding: '0.85rem 2rem',
      position: 'sticky',
      bottom: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justify: 'center'
    }}>
      <img
        src={softcompHorizontal}
        alt="SOFTCOMP"
        style={{ height: '22px', width: 'auto', opacity: 0.85 }}
      />
    </footer>
  );
}
