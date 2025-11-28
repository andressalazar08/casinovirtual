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
// INTERFACE PARA LA RESPUESTA DEL BACKEND
// ==================================================
interface SpinResult {
  reels: string[][];
  winAmount: number;
  winType?: string;
  newBalance: number;
}

// ==================================================
// INTERFACE PARA DATOS DEL USUARIO DESDE BD
// ==================================================
interface UserData {
  id: string;
  username: string;
  credits: number;
  // AQUÍ SE PUEDEN AÑADIR MÁS CAMPOS DE LA BD COMO:
  // email: string;
  // level: number;
  // experience: number;
  // avatar: string;
  // etc...
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

function Casino() {
  const navigate = useNavigate();
  
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const jackpotAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const reelStopAudioRef = useRef<HTMLAudioElement | null>(null);

  // ==================================================
  // ESTADOS PARA USUARIO Y MENÚ DESPLEGABLE
  // ==================================================
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // ==================================================
  // ESTADO INICIAL - LOS CRÉDITOS INICIAN EN 0 Y SE CARGARÁN DESDE BD
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
  // LOS CRÉDITOS SE OBTENDRÁN DEL userData.credits
  const [machineAnimation, setMachineAnimation] = useState(true);
  const [winEffect, setWinEffect] = useState(false);
  const [jackpotEffect, setJackpotEffect] = useState(false);

  // ==================================================
  // EFFECT PARA CARGAR DATOS DEL USUARIO DESDE BD
  // ==================================================
  useEffect(() => {
    // AQUÍ SE DEBE HACER LA LLAMADA A LA API PARA OBTENER LOS DATOS DEL USUARIO
    // EJEMPLO:
    
    // DATOS DE EJEMPLO - REEMPLAZAR CON LLAMADA REAL A BD
    const mockUserData: UserData = {
      id: '1',
      username: 'Jugador123', // ESTE NOMBRE VENDRÁ DE LA BD
      credits: 1500.00 // ESTE VALOR VENDRÁ DE LA BD
    };
    setUserData(mockUserData);
    
    // Cargar sonidos
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
  // FUNCIÓN PARA LLAMAR AL BACKEND - ACTUALIZADA PARA BD
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
          userId: userData?.id, // ENVIAR ID DEL USUARIO PARA ACTUALIZAR BD
          currentCredits: userData?.credits || 0
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result: SpinResult = await response.json();
      
      // ACTUALIZAR LOS CRÉDITOS DEL USUARIO LOCALMENTE CON LA RESPUESTA
      if (userData) {
        setUserData({
          ...userData,
          credits: result.newBalance
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      return generateLocalResult();
    }
  };

  // ==================================================
  // GENERACIÓN LOCAL (FALLBACK) - ACTUALIZADA PARA BD
  // ==================================================
  const generateLocalResult = (): SpinResult => {
    const newReels = reels.map(() => {
      const newReel = [];
      for (let i = 0; i < 5; i++) {
        newReel.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id);
      }
      return newReel;
    });

    const middleLine = newReels.map(reel => reel[2]);
    const allSame = middleLine.every(symbol => symbol === middleLine[0]);
    const winAmount = allSame ? totalBet * 10 : 0;
    
    const currentCredits = userData?.credits || 0;
    const newBalance = currentCredits - totalBet + winAmount;

    // ACTUALIZAR CRÉDITOS LOCALMENTE EN MODO FALLBACK
    if (userData) {
      setUserData({
        ...userData,
        credits: newBalance
      });
    }

    return {
      reels: newReels,
      winAmount: winAmount,
      newBalance: newBalance
    };
  };

  const mapSymbolIdsToObjects = (symbolIds: string[][]) => {
    return symbolIds.map(reelSymbols => 
      reelSymbols.map(symbolId => {
        const symbol = SYMBOLS.find(s => s.id === symbolId);
        return symbol || SYMBOLS[0];
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
  // FUNCIÓN SPIN PRINCIPAL - VERIFICAR CRÉDITOS DESDE BD
  // ==================================================
  const spinReels = async () => {
    const currentCredits = userData?.credits || 0;
    if (spinning || currentCredits < totalBet) return;

    playSound(clickAudioRef, 'click');
    setSpinning(true);
    setPaid(0);
    setWinEffect(false);
    setJackpotEffect(false);

    playSound(spinAudioRef, 'spin');

    try {
      const result = await spinWithBackend();
      
      const newReels = mapSymbolIdsToObjects(result.reels);
      setReels(newReels);
      
      setTimeout(() => {
        playSound(reelStopAudioRef, 'reelStop');
        setSpinning(false);
        checkWin(result.winAmount);
      }, 2500);

    } catch (error) {
      console.error('Error en spin:', error);
      const localResult = generateLocalResult();
      const newReels = mapSymbolIdsToObjects(localResult.reels);
      setReels(newReels);
      
      setTimeout(() => {
        playSound(reelStopAudioRef, 'reelStop');
        setSpinning(false);
        checkWin(localResult.winAmount);
      }, 2500);
    }
  };

  // ==================================================
  // FUNCIONES PARA EL MENÚ DE USUARIO
  // ==================================================
  const handleConfiguracion = () => {
    // AQUÍ SE DEBE NAVEGAR A LA PÁGINA DE CONFIGURACIÓN
    // navigate('/configuracion');
    console.log('Abrir configuración');
    setShowUserMenu(false);
  };

  const handleCerrarSesion = () => {
    // AQUÍ SE DEBE HACER LOGOUT Y LIMPIAR DATOS DE USUARIO
    // fetch('/api/logout', { method: 'POST' })
    //   .then(() => {
    //     setUserData(null);
    //     navigate('/login');
    //   });
    console.log('Cerrar sesión');
    setUserData(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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
            {/* MOSTRAR CRÉDITOS DESDE BD */}
            <span className="credit-amount">{(userData?.credits || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* BOTÓN DE USUARIO CON MENÚ DESPLEGABLE */}
        <div className="user-menu-container">
          <button className="user-menu-button" onClick={toggleUserMenu}>
            {/* MOSTRAR NOMBRE DE USUARIO DESDE BD */}
            <span className="username">{userData?.username || 'USUARIO'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown-menu">
              <button className="dropdown-item" onClick={handleConfiguracion}>
                ⚙️ Configuración
              </button>
              <button className="dropdown-item" onClick={handleCerrarSesion}>
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>

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
                // VERIFICAR CRÉDITOS DESDE BD
                disabled={spinning || (userData?.credits || 0) < totalBet}
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

export default Casino;