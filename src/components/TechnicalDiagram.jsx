import React, { useState } from 'react';
import { Target, Box, RotateCw } from 'lucide-react';

/**
 * Dicionário de descrições e símbolos de cotas para todas as geometrias (incluindo Bobina e Perfil I/H)
 */
const FIELD_DESCRIPTIONS = {
  diametro_externo: { symbol: 'Dext', label: 'Diâmetro Externo (Dext)', desc: 'Cota Dext: Diâmetro externo total da seção circular em 3D' },
  diametro_interno: { symbol: 'Dint', label: 'Diâmetro Interno (Dint)', desc: 'Cota Dint: Diâmetro do furo interno do tubo/bucha 3D' },
  parede: { symbol: 'e', label: 'Espessura da Parede (e)', desc: 'Cota e: Espessura da parede do perfil em 3D' },
  diametro: { symbol: 'D', label: 'Diâmetro (D)', desc: 'Cota D: Diâmetro total da seção transversal 3D' },
  largura: { symbol: 'L', label: 'Largura (L)', desc: 'Cota L: Largura da fita/chapa/peça no espaço 3D' },
  espessura: { symbol: 'e', label: 'Espessura (e)', desc: 'Cota e: Espessura da fita/chapa/perfil em 3D' },
  comprimento: { symbol: 'C', label: 'Comprimento (C)', desc: 'Cota C: Comprimento total de extrusão/desenrolamento ao longo do eixo Z 3D' },
  lado: { symbol: 'A', label: 'Lado / Bitola (A)', desc: 'Cota A: Dimensão do lado do quadrado em 3D' },
  lado_maior: { symbol: 'A', label: 'Lado Maior (A)', desc: 'Cota A: Lado maior da seção retangular 3D' },
  lado_menor: { symbol: 'B', label: 'Lado Menor (B)', desc: 'Cota B: Lado menor da seção retangular 3D' },
  bitola: { symbol: 'S', label: 'Bitola Entre Faces (S)', desc: 'Cota S: Medida entre faces hexagonais paralelas' },
  aba: { symbol: 'A / B', label: 'Largura da Aba (A / B)', desc: 'Cota A/B: Largura da aba da cantoneira L ou perfil U em 3D' },
  largura_aba: { symbol: 'B', label: 'Largura da Aba (B)', desc: 'Cota B: Largura da aba superior/inferior da viga I/H em 3D' },
  mesa: { symbol: 'A', label: 'Largura da Mesa (A)', desc: 'Cota A: Largura da mesa superior do perfil T em 3D' },
  altura: { symbol: 'H', label: 'Altura / Alma (H)', desc: 'Cota H: Altura total do perfil I/H/T/U em 3D' },
  espessura_alma: { symbol: 'tw', label: 'Espessura da Alma (tw)', desc: 'Cota tw: Espessura da alma vertical central da viga I/H' },
  espessura_aba: { symbol: 'tf', label: 'Espessura da Aba (tf)', desc: 'Cota tf: Espessura das abas superiores/inferiores da viga I/H' }
};

export default function TechnicalDiagram({ shapeId, activeField, inputs }) {
  const [viewMode, setViewMode] = useState('3d');
  const [userRotationAngle, setUserRotationAngle] = useState(0);

  const isFocused = (fieldKey) => activeField === fieldKey;
  const activeInfo = activeField ? FIELD_DESCRIPTIONS[activeField] : null;

  const getCameraTransform = () => {
    if (activeField === 'comprimento') {
      return {
        scale: 0.9,
        extLength: 130,
        angleOffset: 25 + userRotationAngle,
        focusType: 'comprimento'
      };
    } else if (activeField === 'espessura' || activeField === 'parede' || activeField === 'espessura_alma' || activeField === 'espessura_aba') {
      return {
        scale: 1.1,
        extLength: 80,
        angleOffset: 45 + userRotationAngle,
        focusType: 'espessura'
      };
    } else {
      return {
        scale: 1.0,
        extLength: 100,
        angleOffset: 35 + userRotationAngle,
        focusType: 'secao'
      };
    }
  };

  const camera = getCameraTransform();

  const render3DModelSvg = () => {
    const isLengthFocused = isFocused('comprimento');
    const isThicknessFocused = isFocused('espessura') || isFocused('parede') || isFocused('espessura_alma') || isFocused('espessura_aba');
    const isWidthFocused = isFocused('largura') || isFocused('lado') || isFocused('lado_maior') || isFocused('aba') || isFocused('mesa') || isFocused('largura_aba');
    const isHeightFocused = isFocused('altura') || isFocused('lado_menor');

    const extX = camera.extLength * Math.cos((camera.angleOffset * Math.PI) / 180);
    const extY = -camera.extLength * Math.sin((camera.angleOffset * Math.PI) / 180) * 0.5;

    switch (shapeId) {
      case 'bobina': {
        const thickFocused = isFocused('espessura');
        const widthFocused = isFocused('largura');

        return (
          <g transform={`translate(${110 - extX * 0.2}, ${110 - extY * 0.2}) scale(${camera.scale})`}>
            {/* Unrolled Strip (Fita desenrolando da bobina ao longo do Comprimento C) */}
            <path
              d={`M -20,25 L ${-20 + extX},${25 + extY} L ${40 + extX},${25 + extY} L 40,25 Z`}
              fill="rgba(56, 189, 248, 0.15)"
              stroke={isLengthFocused ? '#38bdf8' : '#3b82f6'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            {/* Strip Front Edge (Espessura e) */}
            <path
              d={`M ${-20 + extX},${25 + extY} L ${-20 + extX},${28 + extY} L ${40 + extX},${28 + extY} L ${40 + extX},${25 + extY} Z`}
              fill="rgba(239, 68, 68, 0.4)"
              stroke={thickFocused ? '#ef4444' : '#3b82f6'}
              strokeWidth={thickFocused ? '2.5' : '1'}
            />

            {/* 3D Rolled Coil Cylinder Body (Corpo Cilíndrico da Bobina) */}
            <path
              d={`M -30,-40 L 20,-40 A 35,40 0 0,1 20,40 L -30,40 A 35,40 0 0,0 -30,-40 Z`}
              fill="rgba(56, 189, 248, 0.12)"
              stroke={widthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth={widthFocused ? '2.5' : '1.5'}
            />

            {/* Front Coil Ellipse Face (Face Frontal da Bobina) */}
            <ellipse
              cx="-30"
              cy="0"
              rx="35"
              ry="40"
              fill="rgba(18, 24, 38, 0.9)"
              stroke={thickFocused || widthFocused ? '#38bdf8' : '#3b82f6'}
              strokeWidth={thickFocused || widthFocused ? '3' : '2'}
            />

            {/* Concentric Winding Rings (Espirais de Enrolamento da Fita) */}
            <ellipse cx="-30" cy="0" rx="27" ry="31" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            <ellipse cx="-30" cy="0" rx="20" ry="23" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

            {/* Inner Core Hole / Mandrel (Furo Central do Carretel) */}
            <ellipse
              cx="-30"
              cy="0"
              rx="13"
              ry="15"
              fill="#0d1322"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Rear Coil Ellipse Outline */}
            <ellipse cx="20" cy="0" rx="35" ry="40" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="2 2" />

            {/* Cota Z (Comprimento Linear C da Fita) */}
            <line x1="40" y1="25" x2={40 + extX} y2={25 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={40 + extX / 2 + 10} y={25 + extY / 2 - 5} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento Linear)
            </text>

            {/* Cota X (Largura da Fita L) */}
            <line x1="-30" y1="-48" x2="20" y2="-48" stroke={widthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={widthFocused ? '2.5' : '1.5'} />
            <text x="-5" y="-53" fill={widthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={widthFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              L (Largura da Fita)
            </text>

            {/* Cota Y (Espessura e da Fita) */}
            <line x1={40 + extX + 8} y1={25 + extY} x2={40 + extX + 8} y2={28 + extY} stroke={thickFocused ? '#ef4444' : '#94a3b8'} strokeWidth={thickFocused ? '2.5' : '1.5'} />
            <text x={40 + extX + 14} y={28 + extY} fill={thickFocused ? '#ef4444' : '#cbd5e1'} fontSize={thickFocused ? '12' : '10'} fontWeight="700">
              e
            </text>
          </g>
        );
      }

      case 'perfil_i_h': {
        const altFocused = isFocused('altura');
        const abaFocused = isFocused('largura_aba');
        const twFocused = isFocused('espessura_alma');
        const tfFocused = isFocused('espessura_aba');

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${115 - extY * 0.3}) scale(${camera.scale})`}>
            {/* Top Flange Extrusion */}
            <polygon
              points={`-45,-50 ${-45 + extX},${-50 + extY} ${45 + extX},${-50 + extY} 45,-50`}
              fill="rgba(56, 189, 248, 0.12)"
              stroke={abaFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth="1.5"
            />

            {/* Front 3D I/H Beam Cross-Section Face */}
            <path
              d="M -45,-50 L 45,-50 L 45,-36 L 8,-36 L 8,36 L 45,36 L 45,50 L -45,50 L -45,36 L -8,36 L -8,-36 L -45,-36 Z"
              fill="rgba(56, 189, 248, 0.18)"
              stroke={altFocused || abaFocused || twFocused || tfFocused ? '#38bdf8' : '#3b82f6'}
              strokeWidth={altFocused || abaFocused || twFocused || tfFocused ? '3.5' : '2.5'}
            />

            {/* Side Web Extrusion */}
            <polygon
              points={`45,50 ${45 + extX},${50 + extY} ${-45 + extX},${50 + extY} -45,50`}
              fill="rgba(56, 189, 248, 0.05)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />

            {/* Cota Z (Comprimento C) */}
            <line x1="45" y1="-50" x2={45 + extX} y2={-50 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 10} y={-50 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>

            {/* Altura H */}
            <line x1="-57" y1="-50" x2="-57" y2="50" stroke={altFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={altFocused ? '2.5' : '1.5'} />
            <text x="-65" y="4" fill={altFocused ? '#38bdf8' : '#cbd5e1'} fontSize={altFocused ? '12' : '10'} fontWeight="700" textAnchor="end">
              H (Altura)
            </text>

            {/* Largura da Aba B */}
            <line x1="-45" y1="-62" x2="45" y2="-62" stroke={abaFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={abaFocused ? '2.5' : '1.5'} />
            <text x="0" y="-67" fill={abaFocused ? '#38bdf8' : '#cbd5e1'} fontSize={abaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              B (Aba)
            </text>

            {/* Espessura tf & tw */}
            {tfFocused && (
              <text x="25" y="-40" fill="#ef4444" fontSize="10" fontWeight="700">tf</text>
            )}
            {twFocused && (
              <text x="12" y="0" fill="#ef4444" fontSize="10" fontWeight="700">tw</text>
            )}
          </g>
        );
      }

      case 'perfil_l_cantoneira': {
        const abaFocused = isWidthFocused;
        const thickFocused = isThicknessFocused;

        return (
          <g transform={`translate(${110 - extX * 0.3}, ${120 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -40,30 L ${-40 + extX},${30 + extY} L ${-40 + extX},${-50 + extY} L -40,-50 Z`}
              fill="rgba(56, 189, 248, 0.04)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth="1.5"
            />
            <path
              d={`M -40,30 L ${-40 + extX},${30 + extY} L ${40 + extX},${30 + extY} L 40,30 Z`}
              fill="rgba(56, 189, 248, 0.06)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth="1.5"
            />
            <path
              d="M -40,30 L -40,-50 L -22,-50 L -22,12 L 40,12 L 40,30 Z"
              fill="rgba(56, 189, 248, 0.15)"
              stroke={abaFocused || thickFocused ? '#38bdf8' : '#3b82f6'}
              strokeWidth={abaFocused || thickFocused ? '3.5' : '2.5'}
            />
            <line x1="40" y1="30" x2={40 + extX} y2={30 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={40 + extX / 2 + 10} y={30 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-40" y1="42" x2="40" y2="42" stroke={abaFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={abaFocused ? '2.5' : '1.5'} />
            <text x="0" y="55" fill={abaFocused ? '#38bdf8' : '#cbd5e1'} fontSize={abaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              A (Largura da Aba)
            </text>
            <line x1="-50" y1="30" x2="-50" y2="12" stroke={thickFocused ? '#ef4444' : '#94a3b8'} strokeWidth={thickFocused ? '2.5' : '1.5'} />
            <text x="-58" y="24" fill={thickFocused ? '#ef4444' : '#cbd5e1'} fontSize={thickFocused ? '12' : '10'} fontWeight="700" textAnchor="end">
              e
            </text>
          </g>
        );
      }

      case 'perfil_t': {
        const mesaFocused = isWidthFocused;
        const altFocused = isHeightFocused;
        const thickFocused = isThicknessFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${115 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon
              points={`-50,-40 ${-50 + extX},${-40 + extY} ${50 + extX},${-40 + extY} 50,-40`}
              fill="rgba(56, 189, 248, 0.12)"
              stroke={mesaFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth="1.5"
            />
            <path
              d="M -50,-40 L 50,-40 L 50,-22 L 10,-22 L 10,40 L -10,40 L -10,-22 L -50,-22 Z"
              fill="rgba(56, 189, 248, 0.15)"
              stroke={mesaFocused || altFocused || thickFocused ? '#38bdf8' : '#3b82f6'}
              strokeWidth={mesaFocused || altFocused || thickFocused ? '3.5' : '2.5'}
            />
            <polygon
              points={`10,40 ${10 + extX},${40 + extY} ${-10 + extX},${40 + extY} -10,40`}
              fill="rgba(56, 189, 248, 0.06)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            <line x1="50" y1="-40" x2={50 + extX} y2={-40 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={50 + extX / 2 + 10} y={-40 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-50" y1="-52" x2="50" y2="-52" stroke={mesaFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={mesaFocused ? '2.5' : '1.5'} />
            <text x="0" y="-57" fill={mesaFocused ? '#38bdf8' : '#cbd5e1'} fontSize={mesaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              A (Largura da Mesa)
            </text>
            <line x1="62" y1="-40" x2="62" y2="40" stroke={altFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={altFocused ? '2.5' : '1.5'} />
            <text x="70" y="4" fill={altFocused ? '#38bdf8' : '#cbd5e1'} fontSize={altFocused ? '12' : '10'} fontWeight="700">
              B (Altura)
            </text>
          </g>
        );
      }

      case 'perfil_u': {
        const altFocused = isHeightFocused;
        const abaFocused = isWidthFocused;
        const thickFocused = isThicknessFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${115 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -45,-45 L ${-45 + extX},${-45 + extY} L ${-45 + extX},${45 + extY} -45,45 Z`}
              fill="rgba(56, 189, 248, 0.06)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth="1.5"
            />
            <path
              d="M -45,-45 L -45,45 L 35,45 L 35,27 L -27,27 L -27,-27 L 35,-27 L 35,-45 Z"
              fill="rgba(56, 189, 248, 0.15)"
              stroke={altFocused || abaFocused || thickFocused ? '#38bdf8' : '#3b82f6'}
              strokeWidth={altFocused || abaFocused || thickFocused ? '3.5' : '2.5'}
            />
            <line x1="35" y1="45" x2={35 + extX} y2={45 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={35 + extX / 2 + 10} y={45 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-57" y1="-45" x2="-57" y2="45" stroke={altFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={altFocused ? '2.5' : '1.5'} />
            <text x="-65" y="4" fill={altFocused ? '#38bdf8' : '#cbd5e1'} fontSize={altFocused ? '12' : '10'} fontWeight="700" textAnchor="end">
              H (Alma)
            </text>
            <line x1="-45" y1="57" x2="35" y2="57" stroke={abaFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={abaFocused ? '2.5' : '1.5'} />
            <text x="-5" y="70" fill={abaFocused ? '#38bdf8' : '#cbd5e1'} fontSize={abaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              B (Aba)
            </text>
          </g>
        );
      }

      case 'tubo_redondo':
      case 'bucha_tubo_mecanico': {
        const extFocused = isFocused('diametro') || isFocused('diametro_externo');
        const wallFocused = isThicknessFocused || isFocused('diametro_interno');

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -40,-40 L ${-40 + extX},${-40 + extY} A 45,25 0 0,0 ${40 + extX},${40 + extY} L 40,40 A 45,25 0 0,1 -40,-40 Z`}
              fill="rgba(56, 189, 248, 0.08)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            <ellipse cx={extX} cy={extY} rx="45" ry="25" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
            <ellipse cx="0" cy="0" rx="45" ry="25" fill="rgba(18, 24, 38, 0.85)" stroke={extFocused ? '#38bdf8' : '#3b82f6'} strokeWidth={extFocused ? '4' : '3'} />
            <ellipse cx="0" cy="0" rx="28" ry="15" fill="#0d1322" stroke={wallFocused ? '#ef4444' : '#64748b'} strokeWidth={wallFocused ? '3.5' : '2'} strokeDasharray={wallFocused ? 'none' : '3 2'} />
            <line x1="45" y1="25" x2={45 + extX} y2={25 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 12} y={25 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-45" y1="0" x2="45" y2="0" stroke={extFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={extFocused ? '2.5' : '1.5'} strokeDasharray="2 2" />
            <text x="0" y="-8" fill={extFocused ? '#38bdf8' : '#cbd5e1'} fontSize={extFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              Dext (Diâmetro)
            </text>
          </g>
        );
      }

      case 'barra_redonda_tarugo': {
        const isDiameterFocused = isFocused('diametro');
        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -45,0 L ${-45 + extX},${extY} A 45,25 0 0,0 ${45 + extX},${extY} L 45,0 A 45,25 0 0,1 -45,0 Z`}
              fill="rgba(56, 189, 248, 0.12)"
              stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            <ellipse cx="0" cy="0" rx="45" ry="25" fill="rgba(56, 189, 248, 0.2)" stroke={isDiameterFocused ? '#38bdf8' : '#3b82f6'} strokeWidth={isDiameterFocused ? '4' : '3'} />
            <line x1="45" y1="0" x2={45 + extX} y2={extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 10} y={extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-45" y1="0" x2="45" y2="0" stroke={isDiameterFocused ? '#38bdf8' : '#94a3b8'} strokeWidth="2" strokeDasharray="3 3" />
            <text x="0" y="-8" fill={isDiameterFocused ? '#38bdf8' : '#fff'} fontSize={isDiameterFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              D (Diâmetro)
            </text>
          </g>
        );
      }

      case 'chapa_bloco_retalho':
      case 'barra_retangular_chata': {
        const thickFocused = isThicknessFocused;
        const widthFocused = isWidthFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon points={`-60,-20 ${-60 + extX},${-20 + extY} ${60 + extX},${-20 + extY} 60,-20`} fill="rgba(245, 158, 11, 0.15)" stroke={widthFocused ? '#f59e0b' : '#3b82f6'} strokeWidth={widthFocused ? '3' : '1.5'} />
            <polygon points="-60,-20 60,-20 60,20 -60,20" fill="rgba(245, 158, 11, 0.08)" stroke={thickFocused || widthFocused ? '#f59e0b' : '#3b82f6'} strokeWidth={thickFocused || widthFocused ? '3.5' : '2.5'} />
            <polygon points={`60,-20 ${60 + extX},${-20 + extY} ${60 + extX},${20 + extY} 60,20`} fill="rgba(245, 158, 11, 0.05)" stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <line x1="60" y1="-20" x2={60 + extX} y2={-20 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={60 + extX / 2 + 8} y={-20 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-60" y1="-28" x2="60" y2="-28" stroke={widthFocused ? '#f59e0b' : '#94a3b8'} strokeWidth={widthFocused ? '2.5' : '1.5'} />
            <text x="0" y="-34" fill={widthFocused ? '#f59e0b' : '#cbd5e1'} fontSize={widthFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              L (Largura)
            </text>
            <line x1="68" y1="-20" x2="68" y2="20" stroke={thickFocused ? '#ef4444' : '#94a3b8'} strokeWidth={thickFocused ? '2.5' : '1.5'} />
            <text x="75" y="4" fill={thickFocused ? '#ef4444' : '#cbd5e1'} fontSize={thickFocused ? '12' : '10'} fontWeight="700">
              e
            </text>
          </g>
        );
      }

      case 'barra_quadrada':
      case 'tubo_quadrado': {
        const sideFocused = isWidthFocused;
        const wallFocused = isThicknessFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon points={`-45,-45 ${-45 + extX},${-45 + extY} ${45 + extX},${-45 + extY} 45,-45`} fill="rgba(56, 189, 248, 0.1)" stroke={sideFocused ? '#38bdf8' : '#1e3a8a'} strokeWidth="1.5" />
            <rect x="-45" y="-45" width="90" height="90" fill="rgba(18, 24, 38, 0.85)" stroke={sideFocused ? '#38bdf8' : '#3b82f6'} strokeWidth={sideFocused ? '3.5' : '2.5'} />
            {shapeId === 'tubo_quadrado' && (
              <rect x="-28" y="-28" width="56" height="56" fill="#0d1322" stroke={wallFocused ? '#ef4444' : '#64748b'} strokeWidth={wallFocused ? '3' : '2'} strokeDasharray={wallFocused ? 'none' : '3 2'} />
            )}
            <polygon points={`45,-45 ${45 + extX},${-45 + extY} ${45 + extX},${45 + extY} 45,45`} fill="rgba(56, 189, 248, 0.05)" stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <line x1="45" y1="-45" x2={45 + extX} y2={-45 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 10} y={-45 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-45" y1="-55" x2="45" y2="-55" stroke={sideFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={sideFocused ? '2.5' : '1.5'} />
            <text x="0" y="-60" fill={sideFocused ? '#38bdf8' : '#cbd5e1'} fontSize={sideFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              A (Lado)
            </text>
          </g>
        );
      }

      default: {
        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon points={`-50,-30 ${-50 + extX},${-30 + extY} ${50 + extX},${-30 + extY} 50,-30`} fill="rgba(56, 189, 248, 0.15)" stroke="#3b82f6" strokeWidth="2" />
            <rect x="-50" y="-30" width="100" height="60" fill="rgba(18, 24, 38, 0.85)" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points={`50,-30 ${50 + extX},${-30 + extY} ${50 + extX},${30 + extY} 50,30`} fill="rgba(56, 189, 248, 0.08)" stroke={isLengthFocused ? '#38bdf8' : '#1e3a8a'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <line x1="50" y1="-30" x2={50 + extX} y2={-30 + extY} stroke={isLengthFocused ? '#38bdf8' : '#94a3b8'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={50 + extX / 2 + 8} y={-30 + extY / 2} fill={isLengthFocused ? '#38bdf8' : '#cbd5e1'} fontSize="11" fontWeight="700">
              C (Comprimento)
            </text>
          </g>
        );
      }
    }
  };

  const render2DSvg = () => {
    return (
      <g transform="translate(140, 105)">
        <circle cx="0" cy="0" r="60" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="3" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="0" y="-8" fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">Seção 2D (Corte)</text>
      </g>
    );
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Box size={16} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            ESQUEMA TÉCNICO 3D
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setUserRotationAngle(prev => (prev + 30) % 360)}
            title="Rotacionar Modelo 3D"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <RotateCw size={12} />
            <span>Girar 3D</span>
          </button>

          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '2px'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              style={{
                background: viewMode === '3d' ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === '3d' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              style={{
                background: viewMode === '2d' ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === '2d' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              2D
            </button>
          </div>
        </div>
      </div>

      <div style={{
        background: activeInfo ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${activeInfo ? '#38bdf8' : 'var(--border-color)'}`,
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        transition: 'all 0.2s ease'
      }}>
        <Target size={16} color={activeInfo ? '#38bdf8' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: activeInfo ? '#fff' : 'var(--text-muted)', fontWeight: activeInfo ? 700 : 400 }}>
          {activeInfo ? activeInfo.desc : 'Selecione ou edite um campo para ver a descrição e perspectiva 3D da cota'}
        </span>
      </div>

      <div style={{
        width: '100%',
        height: '220px',
        background: '#0d1322',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justify: 'center'
      }}>
        <svg width="280" height="220" viewBox="0 0 280 220" style={{ width: '100%', height: '100%' }}>
          <defs>
            <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

          {viewMode === '3d' ? render3DModelSvg() : render2DSvg()}
        </svg>
      </div>
    </div>
  );
}
