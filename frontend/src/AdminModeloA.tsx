import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminModeloA.css';

// Símbolos base del Modelo A
const SIMBOLOS_INICIALES = [
  { emoji: '🍒', nombre: 'Cereza', multiplicador: 2, probabilidad: 0.30, tipo: 'Común' },
  { emoji: '🍋', nombre: 'Limón', multiplicador: 3, probabilidad: 0.25, tipo: 'Común' },
  { emoji: '🍊', nombre: 'Naranja', multiplicador: 5, probabilidad: 0.20, tipo: 'Medio' },
  { emoji: '🍉', nombre: 'Sandía', multiplicador: 8, probabilidad: 0.12, tipo: 'Medio' },
  { emoji: '⭐', nombre: 'Estrella', multiplicador: 15, probabilidad: 0.08, tipo: 'Raro' },
  { emoji: '💎', nombre: 'Diamante', multiplicador: 50, probabilidad: 0.04, tipo: 'Muy Raro' },
  { emoji: '7️⃣', nombre: 'Siete', multiplicador: 100, probabilidad: 0.01, tipo: 'Jackpot' }
];

interface Simbolo {
  emoji: string;
  nombre: string;
  multiplicador: number;
  probabilidad: number;
  tipo: string;
}

const AdminModeloA: React.FC = () => {
  const navigate = useNavigate();
  const [simbolos, setSimbolos] = useState<Simbolo[]>(SIMBOLOS_INICIALES);
  const [mensaje, setMensaje] = useState('');
  const [rtpObjetivo, setRtpObjetivo] = useState(95);

  // Habilitar scroll
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

  // Calcular suma de probabilidades
  const sumaProbabilidades = simbolos.reduce((sum, s) => sum + s.probabilidad, 0);

  // Calcular RTP teórico base (sin factor de ajuste)
  const calcularRTPBase = (): number => {
    let rtpTotal = 0;
    simbolos.forEach(simbolo => {
      const probLinea5 = Math.pow(simbolo.probabilidad, 5);
      const contribucion = probLinea5 * simbolo.multiplicador;
      rtpTotal += contribucion;
    });
    return rtpTotal * 100;
  };

  // Calcular RTP ajustado con el factor
  const rtpBase = calcularRTPBase();
  const factorAjuste = rtpObjetivo / rtpBase;
  const rtpFinal = rtpBase * factorAjuste;

  // Actualizar probabilidad de un símbolo
  const actualizarProbabilidad = (index: number, nuevaProb: number) => {
    const nuevosSimbolos = [...simbolos];
    nuevosSimbolos[index].probabilidad = Math.max(0, Math.min(1, nuevaProb));
    setSimbolos(nuevosSimbolos);
  };

  // Actualizar multiplicador de un símbolo
  const actualizarMultiplicador = (index: number, nuevoMult: number) => {
    const nuevosSimbolos = [...simbolos];
    nuevosSimbolos[index].multiplicador = Math.max(1, Math.min(1000, nuevoMult));
    setSimbolos(nuevosSimbolos);
  };

  // Normalizar probabilidades para que sumen 1.0
  const normalizarProbabilidades = () => {
    const suma = sumaProbabilidades;
    if (suma === 0) {
      setMensaje('Error: La suma de probabilidades no puede ser 0');
      return;
    }

    const nuevosSimbolos = simbolos.map(s => ({
      ...s,
      probabilidad: parseFloat((s.probabilidad / suma).toFixed(4))
    }));

    setSimbolos(nuevosSimbolos);
    setMensaje('Probabilidades normalizadas correctamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  // Restablecer valores por defecto
  const restablecerDefecto = () => {
    setSimbolos(SIMBOLOS_INICIALES);
    setRtpObjetivo(95);
    setMensaje('Configuración restablecida a valores por defecto');
    setTimeout(() => setMensaje(''), 3000);
  };

  // Guardar configuración (simulado - a futuro se conectaría con backend)
  const guardarConfiguracion = () => {
    // TODO: Aquí se enviaría la configuración al backend
    console.log('Configuración guardada:', {
      simbolos,
      rtpObjetivo,
      rtpBase,
      factorAjuste
    });
    
    setMensaje('Configuración guardada correctamente (simulado)');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <div className="header-content">
          <h1>Administración: Modelo A</h1>
          <p className="subtitle">Panel de Configuración de Probabilidades y Multiplicadores</p>
        </div>
      </header>

      {mensaje && (
        <div className="mensaje-notificacion">
          {mensaje}
        </div>
      )}

      {/* Resumen RTP */}
      <section className="seccion-card resumen-rtp">
        <h2>Resumen del RTP</h2>
        <div className="rtp-grid">
          <div className="rtp-box">
            <div className="rtp-label">RTP Base (sin ajuste)</div>
            <div className="rtp-valor">{rtpBase.toFixed(4)}%</div>
            <div className="rtp-descripcion">Calculado con las probabilidades actuales</div>
          </div>
          <div className="rtp-box">
            <div className="rtp-label">Factor de Ajuste</div>
            <div className="rtp-valor">{factorAjuste.toFixed(2)}x</div>
            <div className="rtp-descripcion">Multiplicador aplicado a los pagos</div>
          </div>
          <div className="rtp-box destacado">
            <div className="rtp-label">RTP Objetivo</div>
            <div className="rtp-valor-grande">{rtpObjetivo.toFixed(2)}%</div>
            <div className="rtp-input-container">
              <input 
                type="number" 
                value={rtpObjetivo}
                onChange={(e) => setRtpObjetivo(Math.min(99, Math.max(1, Number(e.target.value))))}
                min="1"
                max="99"
                step="0.5"
                className="rtp-input-small"
              />
            </div>
          </div>
          <div className="rtp-box">
            <div className="rtp-label">Margen de la Casa</div>
            <div className="rtp-valor">{(100 - rtpObjetivo).toFixed(2)}%</div>
            <div className="rtp-descripcion">Ganancia esperada del casino</div>
          </div>
        </div>

        <div className="validacion-probabilidades">
          <span className="validacion-label">Suma de Probabilidades:</span>
          <span className={`validacion-valor ${Math.abs(sumaProbabilidades - 1.0) < 0.001 ? 'valido' : 'invalido'}`}>
            {sumaProbabilidades.toFixed(4)}
          </span>
          {Math.abs(sumaProbabilidades - 1.0) >= 0.001 && (
            <span className="validacion-advertencia">
              (Debe sumar 1.0 para ser válido)
            </span>
          )}
        </div>
      </section>

      {/* Tabla de Configuración */}
      <section className="seccion-card">
        <h2>Configuración de Símbolos</h2>
        <p className="seccion-desc">
          Ajuste las probabilidades y multiplicadores de cada símbolo. 
          Las probabilidades deben sumar 1.0 (100%).
        </p>

        <div className="tabla-container">
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Símbolo</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Probabilidad</th>
                <th>% Individual</th>
                <th>Prob. 5 Símbolos</th>
                <th>Multiplicador</th>
                <th>Contribución RTP</th>
              </tr>
            </thead>
            <tbody>
              {simbolos.map((simbolo, index) => {
                const probLinea5 = Math.pow(simbolo.probabilidad, 5);
                const contribucionRTP = probLinea5 * simbolo.multiplicador * 100;
                
                return (
                  <tr key={index}>
                    <td className="simbolo-emoji">{simbolo.emoji}</td>
                    <td>{simbolo.nombre}</td>
                    <td>
                      <span className={`badge badge-${simbolo.tipo.toLowerCase().replace(' ', '-')}`}>
                        {simbolo.tipo}
                      </span>
                    </td>
                    <td>
                      <input 
                        type="number"
                        value={simbolo.probabilidad}
                        onChange={(e) => actualizarProbabilidad(index, Number(e.target.value))}
                        min="0"
                        max="1"
                        step="0.01"
                        className="input-probabilidad"
                      />
                    </td>
                    <td className="porcentaje-individual">
                      {(simbolo.probabilidad * 100).toFixed(2)}%
                    </td>
                    <td className="prob-pequeña">
                      {(probLinea5 * 100).toFixed(6)}%
                    </td>
                    <td>
                      <input 
                        type="number"
                        value={simbolo.multiplicador}
                        onChange={(e) => actualizarMultiplicador(index, Number(e.target.value))}
                        min="1"
                        max="1000"
                        step="1"
                        className="input-multiplicador"
                      />
                    </td>
                    <td className="contribucion-rtp">
                      {contribucionRTP.toFixed(6)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="fila-total">
                <td colSpan={3}><strong>TOTAL</strong></td>
                <td><strong>{sumaProbabilidades.toFixed(4)}</strong></td>
                <td><strong>{(sumaProbabilidades * 100).toFixed(2)}%</strong></td>
                <td colSpan={2}></td>
                <td><strong>{rtpBase.toFixed(4)}%</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Acciones */}
      <section className="seccion-card acciones">
        <h2>Acciones</h2>
        <div className="botones-acciones">
          <button 
            className="btn-accion btn-normalizar"
            onClick={normalizarProbabilidades}
            disabled={Math.abs(sumaProbabilidades - 1.0) < 0.001}
          >
            Normalizar Probabilidades
          </button>
          <button 
            className="btn-accion btn-restablecer"
            onClick={restablecerDefecto}
          >
            Restablecer por Defecto
          </button>
          <button 
            className="btn-accion btn-guardar"
            onClick={guardarConfiguracion}
            disabled={Math.abs(sumaProbabilidades - 1.0) >= 0.001}
          >
            Guardar Configuración
          </button>
        </div>

      </section>

      {/* Explicación Técnica */}
      <section className="seccion-card explicacion">
        <h2>Cómo Funciona el Sistema de RTP</h2>
        <div className="explicacion-content">
          <div className="explicacion-item">
            <h3>1. RTP Base</h3>
            <p>
              Se calcula sumando la contribución de cada símbolo: 
              <code>RTP = Σ(P(5 símbolos) × Multiplicador) × 100</code>
            </p>
            <p>Donde <code>P(5 símbolos) = probabilidad^5</code></p>
          </div>

          <div className="explicacion-item">
            <h3>2. Factor de Ajuste</h3>
            <p>
              Para alcanzar el RTP objetivo, se calcula un factor de ajuste:
              <code>Factor = RTP_Objetivo / RTP_Base</code>
            </p>
            <p>Este factor multiplica todos los pagos para alcanzar el RTP deseado.</p>
          </div>

          <div className="explicacion-item">
            <h3>3. Pago Final</h3>
            <p>
              En cada premio: <code>Pago_Final = Apuesta × Multiplicador × Factor_Ajuste</code>
            </p>
            <p>Esto garantiza que el RTP real converja al objetivo configurado.</p>
          </div>

          <div className="explicacion-item">
            <h3>4. Restricciones</h3>
            <ul>
              <li>Las probabilidades deben sumar exactamente 1.0 (100%)</li>
              <li>Cada probabilidad debe estar entre 0 y 1</li>
              <li>Los multiplicadores deben ser enteros positivos</li>
              <li>El RTP objetivo puede estar entre 1% y 99%</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminModeloA;
