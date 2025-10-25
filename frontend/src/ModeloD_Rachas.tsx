import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeloD_Rachas.css';

// Símbolos base (serán ajustados dinámicamente)
const SIMBOLOS_BASE = [
  { emoji: '🍒', nombre: 'Cereza', multiplicador: 2, probabilidadBase: 0.30, tipo: 'Común' },
  { emoji: '🍋', nombre: 'Limón', multiplicador: 3, probabilidadBase: 0.25, tipo: 'Común' },
  { emoji: '🍊', nombre: 'Naranja', multiplicador: 5, probabilidadBase: 0.20, tipo: 'Medio' },
  { emoji: '🍉', nombre: 'Sandía', multiplicador: 8, probabilidadBase: 0.12, tipo: 'Medio' },
  { emoji: '⭐', nombre: 'Estrella', multiplicador: 15, probabilidadBase: 0.08, tipo: 'Raro' },
  { emoji: '💎', nombre: 'Diamante', multiplicador: 50, probabilidadBase: 0.04, tipo: 'Muy Raro' },
  { emoji: '7️⃣', nombre: 'Siete', multiplicador: 100, probabilidadBase: 0.01, tipo: 'Jackpot' }
];

interface SimulacionResultado {
  jugadas: number;
  totalApostado: number;
  totalPagado: number;
  rtpReal: number;
  margenCasa: number;
  gananciaCasino: number;
  hitFrequency: number;
  rachasDetectadas: number;
  ajustesRealizados: number;
  distribuccionPremios: { [key: string]: number };
  historialRachas: { jugada: number; tipo: string; ajuste: string }[];
}

const ModeloD_Rachas: React.FC = () => {
  const navigate = useNavigate();
  const [simulando, setSimulando] = useState(false);
  const [resultado, setResultado] = useState<SimulacionResultado | null>(null);
  const [numeroJugadas, setNumeroJugadas] = useState(10000);
  const [apuestaPorJugada, setApuestaPorJugada] = useState(10);
  const [rtpDeseado, setRtpDeseado] = useState(95);
  const [progreso, setProgreso] = useState(0);

  // Habilitar scroll cuando el componente se monta
  useEffect(() => {
    const htmlOriginal = document.documentElement.style.overflow;
    const bodyOriginal = document.body.style.overflow;
    const rootOriginal = document.getElementById('root')?.style.overflow || '';

    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'auto';
      root.style.height = 'auto';
    }

    return () => {
      document.documentElement.style.overflow = htmlOriginal;
      document.body.style.overflow = bodyOriginal;
      if (root) {
        root.style.overflow = rootOriginal;
        root.style.height = '100%';
      }
    };
  }, []);

  // Calcular factor de ajuste para alcanzar RTP deseado
  const calcularFactorAjuste = (rtpDeseado: number): number => {
    // Este factor multiplica los pagos para alcanzar el RTP objetivo
    // Si queremos 95% y actualmente tenemos ~1%, necesitamos multiplicar por ~95
    const rtpActual = 0.96; // RTP base del modelo simple
    return rtpDeseado / rtpActual;
  };

  // Seleccionar símbolo ponderado con ajuste dinámico
  const seleccionarSimboloPonderado = (
    ajusteComunes: number,
    ajusteRaros: number
  ): typeof SIMBOLOS_BASE[0] => {
    const random = Math.random();
    let acumulado = 0;
    
    const simbolosAjustados = SIMBOLOS_BASE.map(s => {
      let probAjustada = s.probabilidadBase;
      
      // Ajustar probabilidades según rachas
      if (s.tipo === 'Común') {
        probAjustada *= (1 + ajusteComunes);
      } else if (s.tipo === 'Raro' || s.tipo === 'Muy Raro' || s.tipo === 'Jackpot') {
        probAjustada *= (1 + ajusteRaros);
      }
      
      return { ...s, probabilidadAjustada: probAjustada };
    });

    // Normalizar probabilidades
    const sumaTotal = simbolosAjustados.reduce((sum, s) => sum + s.probabilidadAjustada, 0);
    const simbolosNormalizados = simbolosAjustados.map(s => ({
      ...s,
      probabilidadAjustada: s.probabilidadAjustada / sumaTotal
    }));

    for (const simbolo of simbolosNormalizados) {
      acumulado += simbolo.probabilidadAjustada;
      if (random <= acumulado) {
        return simbolo;
      }
    }
    return simbolosNormalizados[0];
  };

  // Detectar racha
  const detectarRacha = (historial: boolean[]): { tipo: string; ajuste: string } | null => {
    if (historial.length < 5) return null;

    const ultimas5 = historial.slice(-5);
    const ultimas3 = historial.slice(-3);

    // Racha perdedora: últimas 5 jugadas perdidas
    if (ultimas5.every(v => !v)) {
      return {
        tipo: 'perdedora',
        ajuste: 'Aumentar prob. comunes +5%, reducir raros -3%'
      };
    }

    // Racha ganadora: últimas 3 jugadas ganadas
    if (ultimas3.every(v => v)) {
      return {
        tipo: 'ganadora',
        ajuste: 'Reducir prob. raros -5%'
      };
    }

    return null;
  };

  // Simular jugadas con sistema de rachas
  const simularJugadas = async () => {
    setSimulando(true);
    setProgreso(0);

    await new Promise(resolve => setTimeout(resolve, 100));

    let totalApostado = 0;
    let totalPagado = 0;
    let victoriasCount = 0;
    let rachasDetectadas = 0;
    let ajustesRealizados = 0;
    const distribuccion: { [key: string]: number } = {
      'Sin premio': 0,
      'Pequeño (2x-3x)': 0,
      'Medio (5x-8x)': 0,
      'Alto (15x)': 0,
      'Muy alto (50x)': 0,
      'Jackpot (100x)': 0
    };
    const historialRachas: { jugada: number; tipo: string; ajuste: string }[] = [];
    const historialVictorias: boolean[] = [];
    const factorAjuste = calcularFactorAjuste(rtpDeseado);

    // Ajustes dinámicos actuales
    let ajusteComunes = 0;
    let ajusteRaros = 0;

    for (let i = 0; i < numeroJugadas; i++) {
      if (i % 1000 === 0) {
        setProgreso((i / numeroJugadas) * 100);
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      totalApostado += apuestaPorJugada;

      // Generar 5 símbolos para la línea con probabilidades ajustadas
      const linea = Array(5).fill(null).map(() => 
        seleccionarSimboloPonderado(ajusteComunes, ajusteRaros)
      );

      const primerSimbolo = linea[0];
      const todosIguales = linea.every(s => s.emoji === primerSimbolo.emoji);
      let ganoEstaJugada = false;

      if (todosIguales) {
        // Aplicar factor de ajuste al pago para alcanzar RTP deseado
        const pagoBase = apuestaPorJugada * primerSimbolo.multiplicador;
        const pagoAjustado = pagoBase * factorAjuste;
        totalPagado += pagoAjustado;
        victoriasCount++;
        ganoEstaJugada = true;

        if (primerSimbolo.multiplicador <= 3) {
          distribuccion['Pequeño (2x-3x)']++;
        } else if (primerSimbolo.multiplicador <= 8) {
          distribuccion['Medio (5x-8x)']++;
        } else if (primerSimbolo.multiplicador === 15) {
          distribuccion['Alto (15x)']++;
        } else if (primerSimbolo.multiplicador === 50) {
          distribuccion['Muy alto (50x)']++;
        } else {
          distribuccion['Jackpot (100x)']++;
        }
      } else {
        distribuccion['Sin premio']++;
      }

      historialVictorias.push(ganoEstaJugada);

      // Detectar racha y ajustar probabilidades
      const racha = detectarRacha(historialVictorias);
      if (racha) {
        rachasDetectadas++;
        ajustesRealizados++;
        historialRachas.push({
          jugada: i + 1,
          tipo: racha.tipo,
          ajuste: racha.ajuste
        });

        // Aplicar ajustes (máximo ±5%)
        if (racha.tipo === 'perdedora') {
          ajusteComunes = Math.min(0.05, ajusteComunes + 0.05);
          ajusteRaros = Math.max(-0.03, ajusteRaros - 0.03);
        } else if (racha.tipo === 'ganadora') {
          ajusteRaros = Math.max(-0.05, ajusteRaros - 0.05);
        }
      } else {
        // Resetear ajustes gradualmente
        ajusteComunes *= 0.9;
        ajusteRaros *= 0.9;
      }
    }

    const rtpReal = (totalPagado / totalApostado) * 100;
    const margenCasa = 100 - rtpReal;
    const gananciaCasino = totalApostado - totalPagado;
    const hitFrequency = (victoriasCount / numeroJugadas) * 100;

    setResultado({
      jugadas: numeroJugadas,
      totalApostado,
      totalPagado,
      rtpReal,
      margenCasa,
      gananciaCasino,
      hitFrequency,
      rachasDetectadas,
      ajustesRealizados,
      distribuccionPremios: distribuccion,
      historialRachas: historialRachas.slice(-10) // Últimas 10 rachas
    });

    setProgreso(100);
    setSimulando(false);
  };

  return (
    <div className="modelo-rachas-container">
      <header className="rachas-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <div className="header-content">
          <h1>Modelo D: Sistema de Rachas con Ajuste Dinámico</h1>
          <p className="subtitle">Análisis de Retención y Balance Automático</p>
        </div>
      </header>

      {/* Resumen Ejecutivo */}
      <section className="seccion-card resumen-ejecutivo">
        <h2>Concepto del Modelo</h2>
        <div className="concepto-descripcion">
          <p>
            El <strong>Modelo D</strong> implementa un sistema inteligente que detecta rachas de victorias/derrotas
            y ajusta automáticamente las probabilidades para mantener el balance del juego.
          </p>
          <div className="caracteristicas-grid">
            <div className="caracteristica-box">
              <h3>Ajuste Dinámico</h3>
              <p>Las probabilidades se modifican en tiempo real según el comportamiento del jugador</p>
            </div>
            <div className="caracteristica-box">
              <h3>Retención Mejorada</h3>
              <p>Premios de consolación después de rachas perdedoras mantienen al jugador activo</p>
            </div>
            <div className="caracteristica-box">
              <h3>Protección del Margen</h3>
              <p>Reduce probabilidades de premios altos en rachas ganadoras</p>
            </div>
            <div className="caracteristica-box">
              <h3>Balance Automático</h3>
              <p>El sistema converge automáticamente al RTP objetivo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Algoritmo de Rachas */}
      <section className="seccion-card">
        <h2>Algoritmo de Detección de Rachas</h2>
        <div className="algoritmo-container">
          <div className="algoritmo-box perdedora">
            <h3>Racha Perdedora</h3>
            <div className="condicion">
              <strong>Condición:</strong> Últimas 5 jugadas sin premio
            </div>
            <div className="accion">
              <strong>Acción:</strong>
              <ul>
                <li>Aumentar probabilidad símbolos comunes (🍒🍋) en <span className="highlight">+5%</span></li>
                <li>Reducir probabilidad símbolos raros (💎7️⃣) en <span className="highlight">-3%</span></li>
              </ul>
            </div>
            <div className="objetivo">
              <strong>Objetivo:</strong> "Premio de consolación" para retener al jugador
            </div>
          </div>

          <div className="algoritmo-box ganadora">
            <h3>Racha Ganadora</h3>
            <div className="condicion">
              <strong>Condición:</strong> Últimas 3 jugadas con premio
            </div>
            <div className="accion">
              <strong>Acción:</strong>
              <ul>
                <li>Reducir probabilidad símbolos raros en <span className="highlight">-5%</span></li>
                <li>Mantener probabilidad símbolos comunes</li>
              </ul>
            </div>
            <div className="objetivo">
              <strong>Objetivo:</strong> Proteger el margen de la casa
            </div>
          </div>

          <div className="algoritmo-box neutral">
            <h3>Estado Normal</h3>
            <div className="condicion">
              <strong>Condición:</strong> Victoria y derrotas alternadas
            </div>
            <div className="accion">
              <strong>Acción:</strong>
              <ul>
                <li>Mantener probabilidades base</li>
                <li>Resetear ajustes gradualmente</li>
              </ul>
            </div>
            <div className="objetivo">
              <strong>Objetivo:</strong> Jugador satisfecho, no intervenir
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Monte Carlo con RTP Ajustable */}
      <section className="seccion-card simulador">
        <h2>Simulador con RTP Ajustable</h2>
        <p className="seccion-desc">
          Configure el RTP deseado y valide cómo el sistema de rachas ayuda a mantenerlo
        </p>

        <div className="simulador-controles">
          <div className="control-group">
            <label>Número de Jugadas</label>
            <select 
              value={numeroJugadas} 
              onChange={(e) => setNumeroJugadas(Number(e.target.value))}
              disabled={simulando}
            >
              <option value={1000}>1,000 jugadas</option>
              <option value={10000}>10,000 jugadas</option>
              <option value={50000}>50,000 jugadas</option>
              <option value={100000}>100,000 jugadas</option>
            </select>
          </div>

          <div className="control-group">
            <label>Apuesta por Jugada</label>
            <select 
              value={apuestaPorJugada} 
              onChange={(e) => setApuestaPorJugada(Number(e.target.value))}
              disabled={simulando}
            >
              <option value={1}>$1</option>
              <option value={5}>$5</option>
              <option value={10}>$10</option>
              <option value={50}>$50</option>
              <option value={100}>$100</option>
            </select>
          </div>

          <div className="control-group rtp-control">
            <label>RTP Deseado (%)</label>
            <input 
              type="number" 
              value={rtpDeseado}
              onChange={(e) => setRtpDeseado(Math.min(99, Math.max(1, Number(e.target.value))))}
              disabled={simulando}
              min="1"
              max="99"
              step="0.5"
              className="rtp-input"
            />
            <div className="rtp-slider-container">
              <input 
                type="range" 
                value={rtpDeseado}
                onChange={(e) => setRtpDeseado(Number(e.target.value))}
                disabled={simulando}
                min="1"
                max="99"
                step="0.5"
                className="rtp-slider"
              />
              <div className="rtp-labels">
                <span>1%</span>
                <span>50%</span>
                <span>99%</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-simular"
            onClick={simularJugadas}
            disabled={simulando}
          >
            {simulando ? 'Simulando...' : 'Iniciar Simulación'}
          </button>
        </div>

        {simulando && (
          <div className="progreso-container">
            <div className="progreso-barra">
              <div className="progreso-relleno" style={{ width: `${progreso}%` }}></div>
            </div>
            <div className="progreso-texto">{progreso.toFixed(0)}% completado</div>
          </div>
        )}

        {resultado && (
          <div className="resultados-simulacion">
            <h3>Resultados de la Simulación</h3>
            
            <div className="resultados-grid">
              <div className="resultado-box">
                <div className="resultado-label">Jugadas Simuladas</div>
                <div className="resultado-valor">{resultado.jugadas.toLocaleString()}</div>
              </div>
              <div className="resultado-box">
                <div className="resultado-label">Total Apostado</div>
                <div className="resultado-valor">${resultado.totalApostado.toLocaleString()}</div>
              </div>
              <div className="resultado-box">
                <div className="resultado-label">Total Pagado</div>
                <div className="resultado-valor">${resultado.totalPagado.toLocaleString()}</div>
              </div>
              <div className="resultado-box success">
                <div className="resultado-label">Ganancia Casino</div>
                <div className="resultado-valor">${resultado.gananciaCasino.toLocaleString()}</div>
              </div>
            </div>

            <div className="comparativa-rtp">
              <div className="comparativa-item">
                <span className="comparativa-label">RTP Deseado:</span>
                <span className="comparativa-valor teorico">{rtpDeseado.toFixed(2)}%</span>
              </div>
              <div className="comparativa-item">
                <span className="comparativa-label">RTP Real (simulado):</span>
                <span className="comparativa-valor real">{resultado.rtpReal.toFixed(2)}%</span>
              </div>
              <div className="comparativa-item">
                <span className="comparativa-label">Diferencia:</span>
                <span className={`comparativa-valor ${Math.abs(resultado.rtpReal - rtpDeseado) < 2 ? 'excelente' : 'aceptable'}`}>
                  {Math.abs(resultado.rtpReal - rtpDeseado).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="estadisticas-rachas">
              <h4>Estadísticas de Rachas</h4>
              <div className="rachas-stats-grid">
                <div className="racha-stat">
                  <div className="racha-stat-valor">{resultado.rachasDetectadas}</div>
                  <div className="racha-stat-label">Rachas Detectadas</div>
                </div>
                <div className="racha-stat">
                  <div className="racha-stat-valor">{resultado.ajustesRealizados}</div>
                  <div className="racha-stat-label">Ajustes Realizados</div>
                </div>
                <div className="racha-stat">
                  <div className="racha-stat-valor">{resultado.hitFrequency.toFixed(2)}%</div>
                  <div className="racha-stat-label">Hit Frequency</div>
                </div>
              </div>
            </div>

            {resultado.historialRachas.length > 0 && (
              <div className="historial-rachas">
                <h4>Últimas Rachas Detectadas</h4>
                <div className="rachas-lista">
                  {resultado.historialRachas.map((racha, idx) => (
                    <div key={idx} className={`racha-item racha-${racha.tipo}`}>
                      <div className="racha-jugada">Jugada #{racha.jugada}</div>
                      <div className="racha-tipo">
                        {racha.tipo === 'perdedora' ? 'Racha Perdedora' : 'Racha Ganadora'}
                      </div>
                      <div className="racha-ajuste">{racha.ajuste}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="distribucion-premios">
              <h4>Distribución de Premios</h4>
              <div className="distribucion-lista">
                {Object.entries(resultado.distribuccionPremios).map(([tipo, cantidad]) => (
                  <div key={tipo} className="distribucion-item">
                    <span className="distribucion-tipo">{tipo}</span>
                    <div className="distribucion-barra-container">
                      <div 
                        className="distribucion-barra"
                        style={{ width: `${(cantidad / resultado.jugadas) * 100}%` }}
                      ></div>
                    </div>
                    <span className="distribucion-cantidad">
                      {cantidad} ({((cantidad / resultado.jugadas) * 100).toFixed(2)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ModeloD_Rachas;
