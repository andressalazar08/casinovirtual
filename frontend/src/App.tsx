import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';


const SYMBOLS = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];

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

function App() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2], SYMBOLS[3], SYMBOLS[4]],
    [SYMBOLS[1], SYMBOLS[2], SYMBOLS[3], SYMBOLS[4], SYMBOLS[5]],
    [SYMBOLS[2], SYMBOLS[3], SYMBOLS[4], SYMBOLS[5], SYMBOLS[6]],
    [SYMBOLS[3], SYMBOLS[4], SYMBOLS[5], SYMBOLS[6], SYMBOLS[0]],
    [SYMBOLS[4], SYMBOLS[5], SYMBOLS[6], SYMBOLS[0], SYMBOLS[1]]
  ]);
  
  const [spinning, setSpinning] = useState(false);
  const [lines, setLines] = useState(20);
  const [bet, setBet] = useState(0.50);
  const [totalBet, setTotalBet] = useState(10.00);
  const [paid, setPaid] = useState(0.00);
  const [credits, setCredits] = useState(2101.00);
  const [machineAnimation, setMachineAnimation] = useState(true);
  const [winEffect, setWinEffect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMachineAnimation(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTotalBet(lines * bet);
  }, [lines, bet]);

  const spinReels = () => {
    if (spinning || credits < totalBet) return;

    setSpinning(true);
    setCredits(prev => prev - totalBet);
    setPaid(0);
    setWinEffect(false);

    setTimeout(() => {
      const newReels = reels.map(() => {
        const newReel = [];
        for (let i = 0; i < 5; i++) {
          newReel.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
        }
        return newReel;
      });

      setReels(newReels);
      setSpinning(false);

      setTimeout(() => {
        const middleLine = newReels.map(reel => reel[2]);
        const allSame = middleLine.every(symbol => symbol === middleLine[0]);
        
        if (allSame) {
          const winAmount = totalBet * 10;
          setPaid(winAmount);
          setCredits(prev => prev + winAmount);
          setWinEffect(true);
          setTimeout(() => setWinEffect(false), 2000);
        }
      }, 500);
    }, 2000);
  };

  const setMaxLines = () => setLines(20);
  const increaseLines = () => lines < 20 && setLines(lines + 1);
  const decreaseLines = () => lines > 1 && setLines(lines - 1);

  const handleIngresarClick = () => {
    // Navegar a Second_Page.tsx
    navigate('/Ingreso');
  };

  return (
    <div className="app-container">
      {/* Animación de máquina encendida */}
      {machineAnimation && (
        <div className="machine-boot-animation">
          <div className="boot-screen">
            <div className="boot-logo">🎰</div>
            <div className="boot-progress">
              <div className="boot-loading-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Efecto de ganancia */}
      {winEffect && <div className="win-effect-overlay"></div>}

      {/* Interfaz principal */}
      <div className={`main-interface ${machineAnimation ? 'machine-starting' : 'machine-ready'}`}>
        
        {/* Botón Ingresar - Ahora navega a Second_Page */}
        <button className="login-button" onClick={handleIngresarClick}>
          INGRESAR
        </button>

        {/* Display de créditos superior */}
        <div className="credit-panel">
          <div className="credit-display">
            <span className="credit-amount">{credits.toFixed(2)}</span>
          </div>
        </div>

        {/* Cuerpo principal de la máquina */}
        <div className="slot-machine-body">
          
          {/* Panel de rodillos */}
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

          {/* Panel de control inferior */}
          <div className="control-panel">
            
            {/* Información de juego */}
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

            {/* Controles principales */}
            <div className="main-controls">
              {/* Controles de líneas */}
              <div className="lines-controls">
                <div className="lines-title">MAX LINE:</div>
                <div className="lines-buttons">
                  <button 
                    className="line-btn decrease-line"
                    onClick={decreaseLines}
                    disabled={spinning || lines <= 1}
                  >
                    -
                  </button>
                  <button 
                    className="line-btn max-line"
                    onClick={setMaxLines}
                    disabled={spinning}
                  >
                    MAX
                  </button>
                  <button 
                    className="line-btn increase-line"
                    onClick={increaseLines}
                    disabled={spinning || lines >= 20}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Botón SPIN */}
              <button 
                className={`spin-button ${spinning ? 'spin-active' : ''}`}
                onClick={spinReels}
                disabled={spinning || credits < totalBet}
              >
                <span className="spin-text">{spinning ? 'SPINNING...' : 'SPIN'}</span>
              </button>
            </div>

            {/* Selector de apuesta */}
            <div className="bet-controls">
              <div className="bet-title">SELECT BET</div>
              <div className="bet-options">
                {[0.05, 0.25, 0.50, 1.00, 5.00].map(amount => (
                  <button
                    key={amount}
                    className={`bet-option ${bet === amount ? 'bet-selected' : ''}`}
                    onClick={() => setBet(amount)}
                    disabled={spinning}
                  >
                    ${amount.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;