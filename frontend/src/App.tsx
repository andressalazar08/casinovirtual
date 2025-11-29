import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

<<<<<<< HEAD
function App() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        🎰 Cargando...
=======
const SYMBOLS = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];

interface ReelProps {
  symbols: string[];
  spinning: boolean;
  delay: number;
  reelIndex: number;
}

const Reel: React.FC<ReelProps> = ({ symbols, spinning, delay }) => {
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

  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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

  const handleIngresarClick = () => navigate('/Ingreso');

  return (
    <div className="app-container">

      {showRecharge && (
        <div className="recharge-modal">
          <div className="recharge-content">
            <h2>Recargar Créditos</h2>

            <input
              type="text"
              className="recharge-input"
              placeholder="Número de tarjeta"
              maxLength={16}
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/\D/g, ""))}
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
              onChange={e => setCardCvv(e.target.value.replace(/\D/g, ""))}
            />

            <input
              type="number"
              className="recharge-input"
              placeholder="Monto"
              value={rechargeAmount}
              onChange={e => setRechargeAmount(Number(e.target.value))}
            />

            <button
              className="recharge-confirm"
              onClick={() => {
                if (cardNumber.length !== 16) return alert("Tarjeta inválida");
                if (!/^\d{2}\/\d{2}$/.test(cardExp)) return alert("Exp inválida");
                if (cardCvv.length !== 3) return alert("CVV inválido");
                if (rechargeAmount <= 0) return alert("Monto inválido");

                setCredits(prev => prev + rechargeAmount);

                setCardNumber("");
                setCardExp("");
                setCardCvv("");
                setRechargeAmount(0);
                setShowRecharge(false);
              }}
            >
              Confirmar
            </button>

            <button
              className="recharge-cancel"
              onClick={() => setShowRecharge(false)}
            >
              Cancelar
            </button>
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

      {winEffect && <div className="win-effect-overlay"></div>}

      <div className={`main-interface ${machineAnimation ? 'machine-starting' : 'machine-ready'}`}>

        <button className="login-button" onClick={handleIngresarClick}>
          INGRESAR
        </button>

        <div className="credit-panel">
          <div className="credit-display">
            <span className="credit-amount">{credits.toFixed(2)}</span>
          </div>
        </div>

        <button
          className="recharge-button"
          onClick={() => setShowRecharge(true)}
        >
          RECARGAR
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
                    delay={index * 200}
                    reelIndex={index}
                  />
                ))}
              </div>
              <div className="win-lines-overlay">
                <div className="win-line middle-line"></div>
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

>>>>>>> c3f0798513124a765e82dcc2d323b2509eb6bf1b
      </div>
    );
  }

  // Página de bienvenida
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '64px', marginBottom: '20px', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
        🎰 Casino Virtual 🎰
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '40px', color: '#ffd700' }}>
        ¡Bienvenido al mejor casino online!
      </p>
      
      {isAuthenticated ? (
        <button 
          onClick={() => navigate('/casino')}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(145deg, #d4af37, #b8941f)',
            border: '3px solid #ffd700',
            borderRadius: '12px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,215,0,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
          }}
        >
          🎮 JUGAR AHORA
        </button>
      ) : (
        <button 
          onClick={() => navigate('/Ingreso')}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(145deg, #d4af37, #b8941f)',
            border: '3px solid #ffd700',
            borderRadius: '12px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,215,0,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
          }}
        >
          🔐 INICIAR SESIÓN
        </button>
      )}
    </div>
  );
}

export default App;
