import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlotMachine from '../../components/SlotMachine/SlotMachine';
import GameInfo from '../../components/SlotMachine/GameInfo';
import GameControls from '../../components/SlotMachine/GameControls';
import BetControls from '../../components/SlotMachine/BetControls';
import './Home.css';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados del juego
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

  // Efectos
  useEffect(() => {
    const timer = setTimeout(() => {
      setMachineAnimation(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTotalBet(lines * bet);
  }, [lines, bet]);

  // Funciones del juego
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

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return (
    <div className="home-container">
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
        
        {/* Botón Ingresar */}
        <button className="login-button" onClick={handleLoginClick}>
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
          <SlotMachine 
            reels={reels}
            spinning={spinning}
          />

          {/* Panel de control inferior */}
          <div className="control-panel">
            
            {/* Información de juego */}
            <GameInfo 
              lines={lines}
              bet={bet}
              totalBet={totalBet}
              paid={paid}
            />

            {/* Controles principales */}
            <GameControls 
              spinning={spinning}
              credits={credits}
              totalBet={totalBet}
              lines={lines}
              onSpin={spinReels}
              onDecreaseLine={decreaseLines}
              onIncreaseLine={increaseLines}
              onMaxLines={setMaxLines}
            />

            {/* Selector de apuesta */}
            <BetControls 
              bet={bet}
              spinning={spinning}
              onBetChange={setBet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;