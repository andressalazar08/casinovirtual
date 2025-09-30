import React from 'react';
import './GameControls.css';

interface GameControlsProps {
  spinning: boolean;
  credits: number;
  totalBet: number;
  lines: number;
  onSpin: () => void;
  onDecreaseLine: () => void;
  onIncreaseLine: () => void;
  onMaxLines: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  spinning,
  credits,
  totalBet,
  lines,
  onSpin,
  onDecreaseLine,
  onIncreaseLine,
  onMaxLines
}) => {
  return (
    <div className="main-controls">
      {/* Controles de líneas */}
      <div className="lines-controls">
        <div className="lines-title">MAX LINE:</div>
        <div className="lines-buttons">
          <button 
            className="line-btn decrease-line"
            onClick={onDecreaseLine}
            disabled={spinning || lines <= 1}
          >
            -
          </button>
          <button 
            className="line-btn max-line"
            onClick={onMaxLines}
            disabled={spinning}
          >
            MAX
          </button>
          <button 
            className="line-btn increase-line"
            onClick={onIncreaseLine}
            disabled={spinning || lines >= 20}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Botón SPIN */}
      <button 
        className={`spin-button ${spinning ? 'spin-active' : ''}`}
        onClick={onSpin}
        disabled={spinning || credits < totalBet}
      >
        <span className="spin-text">{spinning ? 'SPINNING...' : 'SPIN'}</span>
      </button>
    </div>
  );
};

export default GameControls;