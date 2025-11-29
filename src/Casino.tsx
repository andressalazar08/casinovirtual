import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { rechargeBalance } from './services/authService';
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
    console.log(`🎰 [Reel ${reelIndex}] Actualizando símbolos:`, symbols.map(s => s.id));
    setCurrentSymbols(symbols);
  }, [symbols, reelIndex]);

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
  const { isAdmin, user, logout, refreshUser } = useAuth();
  
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const jackpotAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const reelStopAudioRef = useRef<HTMLAudioElement | null>(null);

  // ==================================================
  // ESTADOS PARA MENÚ DESPLEGABLE
  // ==================================================
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
  // ESTADOS PARA RECARGA DE SALDO
  // ==================================================
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // ==================================================
  // EFFECT PARA CARGAR SONIDOS
  // ==================================================
  useEffect(() => {
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
      const response = await fetch('http://localhost:3000/api/slots/spin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          betAmount: totalBet
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      console.log('📡 [spinWithBackend] Respuesta del backend:', data);
      console.log('📡 [spinWithBackend] Reels del backend:', data.reels);
      
      // El backend devuelve: { reels, win, payout, saldo }
      // Convertir al formato que espera el frontend
      const result: SpinResult = {
        reels: data.reels,
        winAmount: data.payout,
        newBalance: data.saldo,
        winType: data.win ? 'line' : undefined
      };
      
      console.log('📡 [spinWithBackend] Objeto result creado:', result);
      
      // NO actualizar el saldo aquí, se actualizará después de la animación
      
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
    
    const currentCredits = user?.saldo || 0;
    const newBalance = currentCredits - totalBet + winAmount;

    return {
      reels: newReels,
      winAmount: winAmount,
      newBalance: newBalance
    };
  };

  const mapSymbolIdsToObjects = (symbolIds: string[][]) => {
    console.log('🔍 [mapSymbolIdsToObjects] IDs recibidos del backend:', symbolIds);
    const mapped = symbolIds.map(reelSymbols => 
      reelSymbols.map(symbolId => {
        const symbol = SYMBOLS.find(s => s.id === symbolId);
        if (!symbol) {
          console.warn('⚠️ Símbolo no encontrado:', symbolId);
        }
        return symbol || SYMBOLS[0];
      })
    );
    console.log('✅ [mapSymbolIdsToObjects] Símbolos mapeados:', mapped.map(reel => reel.map(s => s.id)));
    return mapped;
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
    const currentCredits = user?.saldo || 0;
    if (spinning || currentCredits < totalBet) return;

    playSound(clickAudioRef, 'click');
    setSpinning(true);
    setPaid(0);
    setWinEffect(false);
    setJackpotEffect(false);

    playSound(spinAudioRef, 'spin');

    try {
      const result = await spinWithBackend();
      console.log('🎰 [spinReels] Resultado del backend:', result);
      
      const newReels = mapSymbolIdsToObjects(result.reels);
      console.log('🎰 [spinReels] Llamando setReels con:', newReels.map(reel => reel.map(s => s.id)));
      setReels(newReels);
      console.log('🎰 [spinReels] setReels ejecutado');
      
      setTimeout(async () => {
        playSound(reelStopAudioRef, 'reelStop');
        setSpinning(false);
        
        // Actualizar el saldo DESPUÉS de que terminen de girar las ruletas
        await refreshUser();
        
        checkWin(result.winAmount);
      }, 2500);

    } catch (error) {
      console.error('❌ ERROR en spin:', error);
      console.warn('⚠️ USANDO GENERACIÓN LOCAL (FALLBACK) - El backend no respondió correctamente');
      const localResult = generateLocalResult();
      const newReels = mapSymbolIdsToObjects(localResult.reels);
      setReels(newReels);
      
      setTimeout(async () => {
        playSound(reelStopAudioRef, 'reelStop');
        setSpinning(false);
        
        // Intentar actualizar el saldo incluso en modo fallback
        await refreshUser();
        
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

  const handleCerrarSesion = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/Ingreso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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
      {/* MODAL DE RECARGA DE SALDO */}
      {showRecharge && (
        <div className="recharge-modal">
          <div className="recharge-content">
            <h2>Recargar Saldo</h2>

            <input 
              type="text" 
              className="recharge-input" 
              placeholder="Número de tarjeta" 
              maxLength={16} 
              value={cardNumber} 
              onChange={e => setCardNumber(e.target.value.replace(/\D/g,''))} 
            />
            <input 
              type="text" 
              className="recharge-input" 
              placeholder="Exp (MM/YY)" 
              maxLength={5} 
              value={cardExp} 
              onChange={e => setCardExp(e.target.value)} 
            />
            <input 
              type="text" 
              className="recharge-input" 
              placeholder="CVV" 
              maxLength={3} 
              value={cardCvv} 
              onChange={e => setCardCvv(e.target.value.replace(/\D/g,''))} 
            />
            <input 
              type="number" 
              className="recharge-input" 
              placeholder="Monto" 
              value={rechargeAmount || ''} 
              onChange={e => setRechargeAmount(Number(e.target.value))} 
            />

            <button className="recharge-confirm" onClick={async () => {
              if(cardNumber.length!==16){alert("Número de tarjeta inválido");return;}
              if(!/^\d{2}\/\d{2}$/.test(cardExp)){alert("Fecha de expiración inválida (MM/YY)");return;}
              if(cardCvv.length!==3){alert("CVV inválido");return;}
              if(rechargeAmount<=0){alert("Monto inválido");return;}
              
              try {
                // Llamar al endpoint del backend para recargar saldo
                const response = await rechargeBalance({
                  amount: rechargeAmount,
                  cardNumber: cardNumber,
                  cardExp: cardExp,
                  cardCvv: cardCvv
                });
                
                // Actualizar el usuario en el contexto
                await refreshUser();
                
                alert(`¡Recarga exitosa! Se han agregado $${response.rechargedAmount} a tu saldo.\nSaldo anterior: $${response.previousBalance}\nSaldo actual: $${response.newBalance}`);
                
                // Limpiar formulario
                setCardNumber(""); 
                setCardExp(""); 
                setCardCvv(""); 
                setRechargeAmount(0); 
                setShowRecharge(false);
              } catch (error) {
                console.error('Error al recargar saldo:', error);
                alert(error instanceof Error ? error.message : 'Error al procesar la recarga. Por favor intenta nuevamente.');
              }
            }}>Confirmar</button>

            <button className="recharge-cancel" onClick={()=>setShowRecharge(false)}>Cancelar</button>
          </div>
        </div>
      )}

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
            <span className="credit-amount">{Number(user?.saldo || 0).toFixed(2)}</span>
          </div>
          <button className="recharge-button" onClick={()=>setShowRecharge(true)}>💳 RECARGAR</button>
        </div>

        {/* PANEL DE USUARIO CON LOGOUT VISIBLE */}
        <div className="user-panel-casino">
          <div className="user-info-casino">
            <span className="user-icon">👤</span>
            <div className="user-details">
              <span className="user-name-casino">{user?.username || 'USUARIO'}</span>
              <span className="user-role-casino">({user?.role || 'cliente'})</span>
            </div>
          </div>
          <button className="logout-button-casino" onClick={handleCerrarSesion}>
            🚪 SALIR
          </button>
        </div>

        {/* Botones visibles solo para administradores */}
        {isAdmin && (
          <>
            <button className="analisis-button" onClick={handleModeloAnalisisClick}>
              📊 ANÁLISIS MODELO A
            </button>

            <button className="modelo-d-button" onClick={handleModeloDClick}>
              🔄 ANÁLISIS MODELO D
            </button>

            <button className="admin-modelo-a-button" onClick={handleAdminModeloAClick}>
              ⚙️ ADMIN MODELO A
            </button>
          </>
        )}

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
                disabled={spinning || (user?.saldo || 0) < totalBet}
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