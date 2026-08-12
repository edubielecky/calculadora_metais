import React from 'react';
import { Sliders, HelpCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { parseDimensionValue } from '../utils/calculations';

export default function CalculatorForm({
  shape,
  inputs,
  onInputChange,
  quantity,
  onQuantityChange,
  lossMarginPct,
  onLossMarginChange,
  activeField,
  setActiveField,
  errors = {}
}) {
  if (!shape) return null;

  const titleShapeName = shape.name.toUpperCase();

  // Helper for input blur conversion & feedback
  const handleBlur = (fieldId, val) => {
    setActiveField(null);
    if (!val || typeof val !== 'string') return;

    // Se digitou fração em polegadas (ex: 1/2 ou 1 1/2) ou com aspas (ex: 2"), auto-converte para mm ao sair do campo
    if (val.includes('/') || val.includes('"') || val.toLowerCase().includes('in')) {
      const convertedMm = parseDimensionValue(val);
      if (convertedMm > 0) {
        onInputChange(fieldId, Number(convertedMm.toFixed(2)).toString());
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sliders size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            DIMENSÕES ({titleShapeName})
          </h3>
        </div>
      </div>

      {/* Grid of Dynamic Dimension Inputs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        {shape.inputs.map((field) => {
          const hasError = !!errors[field.id];
          const rawVal = inputs[field.id] !== undefined ? inputs[field.id] : '';
          const isFraction = typeof rawVal === 'string' && (rawVal.includes('/') || rawVal.includes('"'));
          const liveMm = isFraction ? parseDimensionValue(rawVal) : null;

          return (
            <div key={field.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {field.label}
                </label>
                {isFraction && liveMm > 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    = {liveMm.toFixed(2)} mm
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="0.00 ou 1/2&quot;"
                  value={rawVal}
                  onChange={(e) => onInputChange(field.id, e.target.value)}
                  onFocus={() => setActiveField(field.id)}
                  onBlur={(e) => handleBlur(field.id, e.target.value)}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderColor: hasError ? '#ef4444' : (activeField === field.id ? '#38bdf8' : 'var(--border-color)'),
                    boxShadow: hasError ? '0 0 0 2px rgba(239, 68, 68, 0.3)' : undefined
                  }}
                />
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${hasError ? '#ef4444' : 'var(--border-color)'}`,
                  borderLeft: 'none',
                  borderTopRightRadius: '12px',
                  borderBottomRightRadius: '12px',
                  padding: '0.75rem 0.85rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  minWidth: '55px',
                  textAlign: 'center'
                }}>
                  mm
                </div>
              </div>

              {/* Inline Guardrail Error Message */}
              {hasError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.35rem',
                  fontWeight: 600
                }}>
                  <AlertTriangle size={14} />
                  <span>{errors[field.id]}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Quantidade */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.83rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem'
          }}>
            Quantidade
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
            />
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderLeft: 'none',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              padding: '0.75rem 0.85rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              minWidth: '65px',
              textAlign: 'center'
            }}>
              peças
            </div>
          </div>
        </div>

        {/* Margem de Perda (%) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.83rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem'
          }}>
            Margem Perda (%)
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              step="any"
              value={lossMarginPct}
              onChange={(e) => onLossMarginChange(e.target.value)}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
            />
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderLeft: 'none',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              padding: '0.75rem 0.85rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              minWidth: '55px',
              textAlign: 'center'
            }}>
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
