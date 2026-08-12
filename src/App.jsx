import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ShapeSelector from './components/ShapeSelector';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import FooterERP from './components/FooterERP';
import { METALS } from './data/metals';
import { SHAPES } from './data/shapes';
import { calculateMetalWeight } from './utils/calculations';

export default function App() {
  const [selectedFamily, setSelectedFamily] = useState('Aço Inox');
  const [selectedMetal, setSelectedMetal] = useState(() => METALS.find(m => m.id === 'aco_inox_304') || METALS[0]);
  const [selectedShape, setSelectedShape] = useState(() => SHAPES.find(s => s.id === 'tubo_redondo') || SHAPES[0]);
  const [activeField, setActiveField] = useState(null);

  // Inputs start completely EMPTY so the user types from scratch
  const [inputs, setInputs] = useState({
    diametro_externo: '',
    parede: '',
    comprimento: ''
  });

  const [quantity, setQuantity] = useState(1);
  const [lossMarginPct, setLossMarginPct] = useState('');

  // Handle shape change (reset inputs to empty strings)
  const handleSelectShape = (shape) => {
    setSelectedShape(shape);
    const newInputs = {};
    shape.inputs.forEach(f => {
      newInputs[f.id] = '';
    });
    setInputs(newInputs);
  };

  // Handle dimension input change
  const handleInputChange = (fieldId, value) => {
    setInputs(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Calculation computation
  const results = useMemo(() => {
    return calculateMetalWeight({
      shape: selectedShape,
      inputs,
      densityGcm3: selectedMetal.density,
      quantity,
      lossMarginPct
    });
  }, [selectedShape, inputs, selectedMetal, quantity, lossMarginPct]);

  // ERP Injection Action
  const handleInjectOrder = () => {
    if (!results.isValid) return;
    alert(`Item injetado no Pedido/Cotação!\nPeso Total: ${results.totalWeightKg.toFixed(2)} kg`);
  };

  // Cancel Action
  const handleCancel = () => {
    handleSelectShape(selectedShape);
  };

  // Keyboard Shortcuts (Enter, Esc, Alt+P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        handleInjectOrder();
      }
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleInjectOrder();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b0f19' }}>
      <Header
        selectedFamily={selectedFamily}
        onSelectFamily={setSelectedFamily}
        selectedMetal={selectedMetal}
        onSelectMetal={setSelectedMetal}
      />

      <main style={{
        flex: 1,
        maxWidth: '1360px',
        width: '100%',
        margin: '0 auto',
        padding: '1.75rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Geometry Grid & Dynamic Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ShapeSelector
            selectedShape={selectedShape}
            onSelectShape={handleSelectShape}
          />

          <CalculatorForm
            shape={selectedShape}
            inputs={inputs}
            onInputChange={handleInputChange}
            quantity={quantity}
            onQuantityChange={setQuantity}
            lossMarginPct={lossMarginPct}
            onLossMarginChange={setLossMarginPct}
            activeField={activeField}
            setActiveField={setActiveField}
            errors={results.errors}
          />
        </div>

        {/* Right Column: High-Impact Results Display & Technical Diagram */}
        <div>
          <ResultCard
            results={results}
            selectedMetal={selectedMetal}
            selectedShape={selectedShape}
            inputs={inputs}
            activeField={activeField}
          />
        </div>
      </main>

      <FooterERP
        onCancel={handleCancel}
        onInject={handleInjectOrder}
        isValid={results.isValid}
      />
    </div>
  );
}
