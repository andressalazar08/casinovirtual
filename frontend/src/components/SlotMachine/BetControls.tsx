import React from 'react';
import './BetControls.css';

interface BetControlsProps {
  bet: number;
  spinning: boolean;
  onBetChange: (amount: number) => void;
}

const BetControls: React.FC<BetControlsProps> = ({ bet, spinning, onBetChange }) => {
  const betOptions = [0.05, 0.25, 0.50, 1.00, 5.00];

  return (
    <div className="bet-controls">
      <div className="bet-title">SELECT BET</div>
      <div className="bet-options">
        {betOptions.map(amount => (
          <button
            key={amount}
            className={`bet-option ${bet === amount ? 'bet-selected' : ''}`}
            onClick={() => onBetChange(amount)}
            disabled={spinning}
          >
            ${amount.toFixed(2)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetControls;