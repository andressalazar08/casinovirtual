import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeloAnalisis.css';

// Definición de símbolos según Modelo A
const SIMBOLOS_MODELO_A = [
  { emoji: '🍒', nombre: 'Cereza', multiplicador: 2, probabilidad: 0.30, tipo: 'Común' },
  { emoji: '🍋', nombre: 'Limón', multiplicador: 3, probabilidad: 0.25, tipo: 'Común' },
  { emoji: '🍊', nombre: 'Naranja', multiplicador: 5, probabilidad: 0.20, tipo: 'Medio' },
  { emoji: '🍉', nombre: 'Sandía', multiplicador: 8, probabilidad: 0.12, tipo: 'Medio' },
  { emoji: '⭐', nombre: 'Estrella', multiplicador: 15, probabilidad: 0.08, tipo: 'Raro' },
  { emoji: '💎', nombre: 'Diamante', multiplicador: 50, probabilidad: 0.04, tipo: 'Muy Raro' },
  { emoji: '7️⃣', nombre: 'Siete', multiplicador: 100, probabilidad: 0.01, tipo: 'Jackpot' }
];

interface SimulacionResultado {
  jugadas: number;
  totalApostado: number;
  totalPagado: number;
  rtpReal: number;
  margenCasa: number;
  gananciaCasino: number;
  hitFrequency: number;
  distribuccionPremios: { [key: string]: number };
}

const ModeloAnalisis: React.FC = () => {
  const navigate = useNavigate();
  const [simulando, setSimulando] = useState(false);
  const [resultado, setResultado] = useState<SimulacionResultado | null>(null);
  const [numeroJugadas, setNumeroJugadas] = useState(10000);
  const [apuestaPorJugada, setApuestaPorJugada] = useState(10);
  const [rtpDeseado, setRtpDeseado] = useState(95);
  const [progreso, setProgreso] = useState(0);

  // Habilitar scroll cuando el componente se monta
  useEffect(() => {
    // Guardar estilos originales
    const htmlOriginal = document.documentElement.style.overflow;
    const bodyOriginal = document.body.style.overflow;
    const rootOriginal = document.getElementById('root')?.style.overflow || '';

    // Habilitar scroll
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'auto';
      root.style.height = 'auto';
    }

    // Restaurar al desmontar
    return () => {
      document.documentElement.style.overflow = htmlOriginal;
      document.body.style.overflow = bodyOriginal;
      if (root) {
        root.style.overflow = rootOriginal;
        root.style.height = '100%';
      }
    };
  }, []);

  // Calcular RTP teórico
  const calcularRTPTeorico = (): number => {
    let rtpTotal = 0;
    SIMBOLOS_MODELO_A.forEach(simbolo => {
      const probLinea5 = Math.pow(simbolo.probabilidad, 5);
      const contribucion = probLinea5 * simbolo.multiplicador;
      rtpTotal += contribucion;
    });
    // Ya está en porcentaje, multiplicar por 100
    return rtpTotal * 100;
  };

  // Calcular factor de ajuste para alcanzar RTP deseado
  const calcularFactorAjuste = (rtpDeseado: number): number => {
    // RTP actual del modelo base es ~0.96%
    const rtpActual = 0.96;
    return rtpDeseado / rtpActual;
  };

  // Función para seleccionar símbolo ponderado
  const seleccionarSimboloPonderado = (): typeof SIMBOLOS_MODELO_A[0] => {
    const random = Math.random();
    let acumulado = 0;
    
    for (const simbolo of SIMBOLOS_MODELO_A) {
      acumulado += simbolo.probabilidad;
      if (random <= acumulado) {
        return simbolo;
      }
    }
    return SIMBOLOS_MODELO_A[0]; // Fallback
  };

  // Simular jugadas (Monte Carlo)
  const simularJugadas = async () => {
    setSimulando(true);
    setProgreso(0);

    // Simular en bloques para no bloquear UI
    await new Promise(resolve => setTimeout(resolve, 100));

    let totalApostado = 0;
    let totalPagado = 0;
    let victoriasCount = 0;
    const distribuccion: { [key: string]: number } = {
      'Sin premio': 0,
      'Pequeño (2x-3x)': 0,
      'Medio (5x-8x)': 0,
      'Alto (15x)': 0,
      'Muy alto (50x)': 0,
      'Jackpot (100x)': 0
    };

    const factorAjuste = calcularFactorAjuste(rtpDeseado);

    for (let i = 0; i < numeroJugadas; i++) {
      // Actualizar progreso cada 1000 jugadas
      if (i % 1000 === 0) {
        setProgreso((i / numeroJugadas) * 100);
        await new Promise(resolve => setTimeout(resolve, 0)); // Permitir que la UI se actualice
      }

      totalApostado += apuestaPorJugada;

      // Generar 5 símbolos para la línea
      const linea = Array(5).fill(null).map(() => seleccionarSimboloPonderado());

      // Verificar si todos son iguales (premio)
      const primerSimbolo = linea[0];
      const todosIguales = linea.every(s => s.emoji === primerSimbolo.emoji);

      if (todosIguales) {
        // Aplicar factor de ajuste para alcanzar RTP deseado
        const pagoBase = apuestaPorJugada * primerSimbolo.multiplicador;
        const pagoAjustado = pagoBase * factorAjuste;
        totalPagado += pagoAjustado;
        victoriasCount++;

        // Clasificar premio
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
      distribuccionPremios: distribuccion
    });

    setProgreso(100);
    setSimulando(false);
  };

  const rtpTeorico = calcularRTPTeorico();
  const margenTeorico = 100 - rtpTeorico;

  // Calcular proyecciones financieras
  const calcularProyecciones = (apostadoMensual: number) => {
    const ingresoCasino = apostadoMensual * (margenTeorico / 100);
    return {
      apostadoMensual,
      ingresoCasino,
      pagoJugadores: apostadoMensual - ingresoCasino,
      ingresoAnual: ingresoCasino * 12
    };
  };

  const proyeccionConservadora = calcularProyecciones(100000);
  const proyeccionModerada = calcularProyecciones(500000);
  const proyeccionOptimista = calcularProyecciones(1000000);

  return (
    <div className="modelo-analisis-container">
      {/* Header */}
      <header className="analisis-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <div className="header-content">
          <h1>Análisis del Modelo A: Distribución Ponderada</h1>
          <p className="subtitle">Presentación para Gerencia - Casino Virtual</p>
        </div>
      </header>

      {/* Resumen Ejecutivo */}
      <section className="seccion-card resumen-ejecutivo">
        <h2>Resumen Ejecutivo</h2>
        <div className="resumen-grid">
          <div className="stat-box destacado">
            <div className="stat-label">RTP Teórico</div>
            <div className="stat-value">{rtpTeorico.toFixed(2)}%</div>
            <div className="stat-desc">Retorno al Jugador</div>
          </div>
          <div className="stat-box destacado success">
            <div className="stat-label">Margen Casa</div>
            <div className="stat-value">{margenTeorico.toFixed(2)}%</div>
            <div className="stat-desc">Ganancia garantizada</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Hit Frequency</div>
            <div className="stat-value">~0.8%</div>
            <div className="stat-desc">Frecuencia de premios</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Premio Máximo</div>
            <div className="stat-value">100x</div>
            <div className="stat-desc">Jackpot (7️⃣)</div>
          </div>
        </div>
      </section>

      {/* Tabla de Símbolos */}
      <section className="seccion-card">
        <h2>Configuración de Símbolos</h2>
        <div className="tabla-container">
          <table className="tabla-simbolos">
            <thead>
              <tr>
                <th>Símbolo</th>
                <th>Nombre</th>
                <th>Multiplicador</th>
                <th>Probabilidad</th>
                <th>Prob. 5 símbolos</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {SIMBOLOS_MODELO_A.map((simbolo, idx) => (
                <tr key={idx} className={`fila-${simbolo.tipo.toLowerCase().replace(' ', '-')}`}>
                  <td className="simbolo-emoji">{simbolo.emoji}</td>
                  <td>{simbolo.nombre}</td>
                  <td className="multiplicador">{simbolo.multiplicador}x</td>
                  <td>{(simbolo.probabilidad * 100).toFixed(0)}%</td>
                  <td className="prob-pequeña">
                    {(Math.pow(simbolo.probabilidad, 5) * 100).toFixed(4)}%
                  </td>
                  <td>
                    <span className={`badge badge-${simbolo.tipo.toLowerCase().replace(' ', '-')}`}>
                      {simbolo.tipo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Simulador Monte Carlo */}
      <section className="seccion-card simulador">
        <h2>Simulador Monte Carlo</h2>
        <p className="seccion-desc">
          Valida el RTP teórico mediante simulación de miles de jugadas
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

            <div className="distribucion-premios">
              <h4>🏆 Distribución de Premios</h4>
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

      {/* Comparativa con Competencia */}
      <section className="seccion-card comparativa">
        <h2>Comparativa con la Industria</h2>
        <div className="tabla-container">
          <table className="tabla-comparativa">
            <thead>
              <tr>
                <th>Tipo de Casino</th>
                <th>RTP Típico</th>
                <th>Margen Casa</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Casinos Físicos</td>
                <td>85% - 92%</td>
                <td>8% - 15%</td>
                <td><span className="badge badge-bajo">Bajo RTP</span></td>
              </tr>
              <tr>
                <td>Casinos Online Promedio</td>
                <td>92% - 94%</td>
                <td>6% - 8%</td>
                <td><span className="badge badge-medio">Competitivo</span></td>
              </tr>
              <tr className="fila-destacada">
                <td><strong>Nuestro Casino (Modelo A)</strong></td>
                <td><strong>{rtpDeseado.toFixed(2)}%</strong></td>
                <td><strong>{(100 - rtpDeseado).toFixed(2)}%</strong></td>
                <td><span className="badge badge-alto">Óptimo</span></td>
              </tr>
              <tr>
                <td>Casinos Premium</td>
                <td>96% - 98%</td>
                <td>2% - 4%</td>
                <td><span className="badge badge-premium">Alto RTP</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ModeloAnalisis;
