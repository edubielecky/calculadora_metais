import React, { useState } from 'react';
import { formatNumber, generateCommercialDescription } from '../utils/calculations';
import { Copy, Check } from 'lucide-react';

export default function ResultCard({
  results,
  selectedMetal,
  selectedShape,
  inputs,
  activeField
}) {
  const [copied, setCopied] = useState(false);

  const { weightKg, totalWeightKg, isValid } = results;

  // Commercial description text
  const commercialDesc = generateCommercialDescription({
    shape: selectedShape,
    metal: selectedMetal,
    inputs,
    results
  });

  const handleCopyDesc = () => {
    if (!commercialDesc) return;
    navigator.clipboard.writeText(commercialDesc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Primary Weight Display Card */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PESO UNITÁRIO
          </span>
        </div>

        {/* Unit Weight */}
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
          {isValid ? formatNumber(weightKg, 2) : '--.--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>kg/pç</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', margin: '1.25rem 0 1rem 0' }} />

        {/* Total Weight */}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          PESO TOTAL BRUTO
        </span>
        <div style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--accent-copper)', fontFamily: 'var(--font-display)', lineHeight: 1.1, marginTop: '0.2rem' }}>
          {isValid ? formatNumber(totalWeightKg, 2) : '--.--'} <span style={{ fontSize: '1.3rem', color: 'var(--text-muted)', fontWeight: 600 }}>kg</span>
        </div>
      </div>

      {/* Commercial Summary Box */}
      <div style={{
        background: 'var(--bg-dark)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: 'monospace', lineHeight: 1.4 }}>
          {commercialDesc}
        </div>

        <button
          type="button"
          onClick={handleCopyDesc}
          title="Copiar Nomenclatura Comercial"
          style={{
            background: copied ? 'rgba(61, 139, 110, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${copied ? 'var(--accent-emerald)' : 'var(--border-color)'}`,
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: copied ? 'var(--accent-emerald)' : 'var(--text-primary)',
            transition: 'all 0.15s ease',
            flexShrink: 0
          }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
