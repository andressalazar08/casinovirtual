import React, { useState, useEffect } from 'react';
import './SlotMachine.css';

interface ReelProps {
  symbols: string[];
  spinning: boolean;
  delay: number;
  reelIndex: number;
}

const Reel: React.FC<ReelProps> = ({ symbols, spinning, delay, reelIndex }) => {
  const [currentSymbols, setCurrentSymbols] = useState(symbols);
  const [stopAnimation, setStopAnimation] = useState(false);

  useEffect(() => {
    if (spinning) {
      setStopAnimation(false);
      const timer = setTimeout(() => {
        setCurrentSymbols(symbols);
        setStopAnimation(true);
      }, 2000 + delay);
      return () => clearTimeout(timer);
    }
  }, [spinning, delay, symbols]);

  return (
    <div className="reel-machine">
      <div 
        className={`reel-wheel ${spinning ? 'reel-spinning' : ''} ${stopAnimation ? 'reel-stopping' : ''}`}
        style={{ 
          animationDuration: spinning ? '0.3s' : '0s',
          animationDelay: `${delay}ms`
        }}
      >
        {currentSymbols.map((symbol, index) => (
          <div
            key={index}
            className={`reel-item ${!spinning && index === 2 ? 'reel-win-position' : ''}`}
          >
            {symbol}
          </div>
        ))}
      </div>
      <div className="reel-border"></div>
    </div>
  );
};

interface SlotMachineProps {
  reels: string[][];
  spinning: boolean;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ reels, spinning }) => {
  return (
    <div className="reels-panel">
      <div className="reels-window">
        <div className="reels-grid">
          {reels.map((reel, index) => (
            <Reel
              key={index}
              symbols={reel}
              spinning={spinning}
              delay={index * 200}
              reelIndex={index}
            />
          ))}
        </div>
        {/* Líneas ganadoras */}
        <div className="win-lines-overlay">
          <div className="win-line middle-line"></div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;