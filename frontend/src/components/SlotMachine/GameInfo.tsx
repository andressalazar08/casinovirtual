import React from 'react';
import './GameInfo.css';

interface GameInfoProps {
  lines: number;
  bet: number;
  totalBet: number;
  paid: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ lines, bet, totalBet, paid }) => {
  return (
    <div className="game-info">
      <div className="info-display">
        <div className="info-line">
          <span className="info-label">LINES</span>
          <span className="info-value">{lines}</span>
        </div>
        <div className="info-line">
          <span className="info-label">BET</span>
          <span className="info-value">{bet.toFixed(2)}</span>
        </div>
      </div>
      <div className="info-display">
        <div className="info-line">
          <span className="info-label">TOTAL BET</span>
          <span className="info-value">{totalBet.toFixed(2)}</span>
        </div>
        <div className="info-line">
          <span className="info-label">PAID</span>
          <span className="info-value">{paid.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;