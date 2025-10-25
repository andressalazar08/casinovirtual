import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

import spinSound from '/Spin-Sound.wav';
import winSound from '/Winner-Sound.mp3';
import jackpotSound from '/Jackpot-Sound.mp3';
import clickSound from '/Click-Start.mp3';
import reelStopSound from '/Reel-Stop-Sound.wav';

import cherryImg from '/Cherry.png';
import lemonImg from '/Lemon.png';
import orangeImg from '/Orange.png';
import watermelonImg from '/Watermelon.png';
import starImg from '/Star.png';
import diamondImg from '/Diamond.png';
import sevenImg from '/Seven.png';

const SYMBOLS = [
  { id: 'cherry', image: cherryImg, alt: 'Cereza' },
  { id: 'lemon', image: lemonImg, alt: 'Limón' },
  { id: 'orange', image: orangeImg, alt: 'Naranja' },
  { id: 'watermelon', image: watermelonImg, alt: 'Sandía' },
  { id: 'star', image: starImg, alt: 'Estrella' },
  { id: 'diamond', image: diamondImg, alt: 'Diamante' },
  { id: 'seven', image: sevenImg, alt: 'Siete' }
];

// ==================================================
// PUNTO 1: INTERFACE PARA LA RESPUESTA DEL BACKEND
// ==================================================
interface SpinResult {
  reels: string[][]; // Array de símbolos IDs para cada reel
  winAmount: number;
  winType?: string;
  newBalance: number;
}

interface ReelProps {
  symbols: { id: string, image: string, alt: string }[];
  spinning: boolean;
  reelIndex: number;
  startDelay: number;
}

const Reel: React.FC<ReelProps> = ({ symbols, spinning, reelIndex, startDelay }) => {
  const [currentSymbols, setCurrentSymbols] = useState(symbols);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (spinning) {
      const startTimer = setTimeout(() => {
        setIsSpinning(true);
      }, startDelay);
      
      return () => clearTimeout(startTimer);
    } else {
      setIsSpinning(false);
    }
  }, [spinning, startDelay]);

  useEffect(() => {
    setCurrentSymbols(symbols);
  }, [symbols]);

  return (
    <div className="reel-machine">
      <div className={`reel-wheel ${isSpinning ? 'reel-spinning' : ''}`}>
        {currentSymbols.map((symbol, index) => (
          <div key={index} className="reel-item">
            <img 
              src={symbol.image} 
              alt={symbol.alt}
              className="symbol-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.textContent = symbol.alt.charAt(0);
                fallback.style.cssText = `
                  font-size: 18px;
                  color: #333;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  height: 100%;
                  background: white;
                  border-radius: 4px;
                `;
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
            />
          </div>
        ))}
      </div>
      <div className="reel-border"></div>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const jackpotAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const reelStopAudioRef = useRef<HTMLAudioElement | null>(null);

  // ==================================================
  // PUNTO 2: ESTADO INICIAL - PODRÍA VENIR DEL BACKEND
  // ==================================================
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
  const [credits, setCredits] = useState(1000.00);
  const [machineAnimation, setMachineAnimation] = useState(true);
  const [winEffect, setWinEffect] = useState(false);
  const [jackpotEffect, setJackpotEffect] = useState(false);

  useEffect(() => {
    spinAudioRef.current = new Audio(spinSound);
    winAudioRef.current = new Audio(winSound);
    jackpotAudioRef.current = new Audio(jackpotSound);
    clickAudioRef.current = new Audio(clickSound);
    reelStopAudioRef.current = new Audio(reelStopSound);

    return () => {
      [spinAudioRef.current, winAudioRef.current, jackpotAudioRef.current, 
       clickAudioRef.current, reelStopAudioRef.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMachineAnimation(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTotalBet(lines * bet);
  }, [lines, bet]);

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>, soundType: string) => {
    if (soundRef.current) {
      const audio = new Audio(soundRef.current.src);
      audio.volume = 0.7;
      
      const maxDuration = {
        'click': 800,
        'spin': 2500,
        'jackpot': 5000,
        'win': 4000,
        'reelStop': 1200
      }[soundType] || 1000;
      
      audio.play().catch(error => {
        console.log('Error reproduciendo sonido:', error);
      });
      
      setTimeout(() => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, maxDuration);
    }
  };

  // ==================================================
  // PUNTO 3: FUNCIÓN PARA LLAMAR AL BACKEND
  // ==================================================
  const spinWithBackend = async (): Promise<SpinResult> => {
    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bet: totalBet,
          lines: lines,
          credits: credits
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result: SpinResult = await response.json();
      return result;
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      // Fallback local si el backend falla
      return generateLocalResult();
    }
  };

  // ==================================================
  // PUNTO 4: GENERACIÓN LOCAL (FALLBACK)
  // ==================================================
  const generateLocalResult = (): SpinResult => {
    const newReels = reels.map(() => {
      const newReel = [];
      for (let i = 0; i < 5; i++) {
        newReel.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id);
      }
      return newReel;
    });

    // Lógica local temporal para calcular ganancias
    const middleLine = newReels.map(reel => reel[2]);
    const allSame = middleLine.every(symbol => symbol === middleLine[0]);
    const winAmount = allSame ? totalBet * 10 : 0;

    return {
      reels: newReels,
      winAmount: winAmount,
      newBalance: credits - totalBet + winAmount
    };
  };

  // ==================================================
  // PUNTO 5: CONVERTIR RESULTADO DEL BACKEND A SÍMBOLOS
  // ==================================================
  const mapSymbolIdsToObjects = (symbolIds: string[][]) => {
    return symbolIds.map(reelSymbols => 
      reelSymbols.map(symbolId => {
        const symbol = SYMBOLS.find(s => s.id === symbolId);
        return symbol || SYMBOLS[0]; // Fallback si no encuentra el símbolo
      })
    );
  };

  const checkWin = (winAmount: number) => {
    if (winAmount > 0) {
      setPaid(winAmount);
      setWinEffect(true);
      
      if (winAmount >= totalBet * 100) {
        setJackpotEffect(true);
        playSound(jackpotAudioRef, 'jackpot');
      } else {
        playSound(winAudioRef, 'win');
      }
      
      setTimeout(() => {
        setWinEffect(false);
        setJackpotEffect(false);
      }, 4000);
    }
  };

  // ==================================================
  // PUNTO 6: FUNCIÓN SPIN PRINCIPAL ACTUALIZADA
  // ==================================================
  const spinReels = async () => {
    if (spinning || credits < totalBet) return;

    playSound(clickAudioRef, 'click');
    setSpinning(true);
    setPaid(0);
    setWinEffect(false);
    setJackpotEffect(false);

    playSound(spinAudioRef, 'spin');

    try {
      // ==================================================
      // PUNTO 7: LLAMADA AL BACKEND AQUÍ
      // ==================================================
      const result = await spinWithBackend();
      
      // Actualizar reels con el resultado del backend
      const newReels = mapSymbolIdsToObjects(result.reels);
      setReels(newReels);

      // Actualizar créditos y mostrar ganancias
      setCredits(result.newBalance);
      
      setTimeout(() => {
        playSound(reelStopAudioRef, 'reelStop');
        setSpinning(false);
        checkWin(result.winAmount);
      }, 2500);

    } catch (error) {
      console.error('Error en spin:', error);
      // Fallback local si hay error
      const localResult = generateLocalResult();
      const newReels = mapSymbolIdsToObjects(localResult.reels);
      setReels(newReels);
      setCredits(localResult.newBalance);
      
      setTimeout(() => {
        playSound(reelStopAudioRef, 'reelStop');
        setSpinning(false);
        checkWin(localResult.winAmount);
      }, 2500);
    }
  };

  const setMaxLines = () => {
    playSound(clickAudioRef, 'click');
    setLines(20);
  };

  const increaseLines = () => {
    if (lines < 20) {
      playSound(clickAudioRef, 'click');
      setLines(lines + 1);
    }
  };

  const decreaseLines = () => {
    if (lines > 1) {
      playSound(clickAudioRef, 'click');
      setLines(lines - 1);
    }
  };

  const handleBetChange = (amount: number) => {
    playSound(clickAudioRef, 'click');
    setBet(amount);
  };

  const handleIngresarClick = () => {
    navigate('/Ingreso');
  };

  const handleModeloAnalisisClick = () => {
    navigate('/modelo-analisis');
  };

  const handleModeloDClick = () => {
    navigate('/modelo-d-rachas');
  };

  const handleAdminModeloAClick = () => {
    navigate('/admin-modelo-a');
  };

  const getStartDelay = (reelIndex: number) => {
    return reelIndex * 100;
  };

  return (
    <div className="app-container">
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

      {winEffect && (
        <div className={`win-effect-overlay ${jackpotEffect ? 'jackpot-effect' : ''}`}>
          <div className="win-text">
            {jackpotEffect ? 'JACKPOT!' : 'WINNER!'}
          </div>
          <div className="win-amount">+${paid.toFixed(2)}</div>
        </div>
      )}

      <div className={`main-interface ${machineAnimation ? 'machine-starting' : 'machine-ready'}`}>
        
        <div className="credit-panel-top-left">
          <div className="credit-display">
            <span className="credit-amount">{credits.toFixed(2)}</span>
          </div>
        </div>

        <button className="login-button" onClick={handleIngresarClick}>
          INGRESAR
        </button>

        <button className="analisis-button" onClick={handleModeloAnalisisClick}>
          📊 ANÁLISIS MODELO A
        </button>

        <button className="modelo-d-button" onClick={handleModeloDClick}>
          🔄 ANÁLISIS MODELO D
        </button>

        <button className="admin-modelo-a-button" onClick={handleAdminModeloAClick}>
          ⚙️ ADMIN MODELO A
        </button>

        <div className="slot-machine-body">
          
          <div className="reels-panel">
            <div className="reels-window">
              <div className="reels-grid">
                {reels.map((reel, index) => (
                  <Reel
                    key={index}
                    symbols={reel}
                    spinning={spinning}
                    reelIndex={index}
                    startDelay={getStartDelay(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="control-panel">
            
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

            <div className="main-controls">
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
              
              <button 
                className={`spin-button ${spinning ? 'spin-active' : ''}`}
                onClick={spinReels}
                disabled={spinning || credits < totalBet}
              >
                <span className="spin-text">{spinning ? 'SPINNING...' : 'SPIN'}</span>
              </button>
            </div>

            <div className="bet-controls">
              <div className="bet-title">SELECT BET</div>
              <div className="bet-options">
                {[0.05, 0.25, 0.50, 1.00, 5.00].map(amount => (
                  <button
                    key={amount}
                    className={`bet-option ${bet === amount ? 'bet-selected' : ''}`}
                    onClick={() => handleBetChange(amount)}
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