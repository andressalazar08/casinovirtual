# Panel de Administración - Modelo A

## 🎯 Objetivo

Proporcionar al gerente del casino una interfaz visual para personalizar las probabilidades y multiplicadores del **Modelo A (Distribución Ponderada)**.

## 🚀 Acceso

**URL**: `/admin-modelo-a`

**Desde la pantalla principal**: Click en el botón morado **⚙️ ADMIN MODELO A** (esquina superior derecha)

## 📊 Funcionalidades

### 1. Resumen de RTP en Tiempo Real

El panel muestra 4 métricas clave:

- **RTP Base**: Calculado con las probabilidades actuales (sin factor de ajuste)
- **Factor de Ajuste**: Multiplicador que se aplica a todos los pagos
- **RTP Objetivo**: Configurable de 1% a 99% mediante slider o input
- **Margen de la Casa**: Calculado automáticamente (100 - RTP)

### 2. Configuración de Símbolos

Tabla interactiva que permite modificar:

| Columna | Descripción | Editable |
|---------|-------------|----------|
| Símbolo | Emoji visual | ❌ No |
| Nombre | Identificador | ❌ No |
| Tipo | Clasificación (Común, Raro, etc.) | ❌ No |
| Probabilidad | Frecuencia de aparición (0.0 - 1.0) | ✅ Sí |
| % Individual | Porcentaje visual | ❌ Auto-calculado |
| Prob. 5 Símbolos | P^5 para línea completa | ❌ Auto-calculado |
| Multiplicador | Pago base (1 - 1000) | ✅ Sí |
| Contribución RTP | Impacto en RTP total | ❌ Auto-calculado |

### 3. Validación Automática

El sistema valida en tiempo real:

- ✅ **Suma de Probabilidades = 1.0**: Indicador verde
- ❌ **Suma de Probabilidades ≠ 1.0**: Indicador rojo + advertencia
- 🔒 **Botón "Guardar" deshabilitado** si la configuración es inválida

### 4. Acciones Disponibles

#### 🔵 Normalizar Probabilidades
- **Función**: Ajusta proporcionalmente todas las probabilidades para que sumen exactamente 1.0
- **Habilitado**: Solo si la suma actual ≠ 1.0
- **Ejemplo**: Si la suma es 0.95, multiplica cada probabilidad por (1.0 / 0.95)

#### 🟠 Restablecer por Defecto
- **Función**: Restaura la configuración inicial del Modelo A
- **Valores por defecto**:
  - Cereza: 30% prob, 2x mult
  - Limón: 25% prob, 3x mult
  - Naranja: 20% prob, 5x mult
  - Sandía: 12% prob, 8x mult
  - Estrella: 8% prob, 15x mult
  - Diamante: 4% prob, 50x mult
  - Siete: 1% prob, 100x mult
  - RTP Objetivo: 95%

#### 🟢 Guardar Configuración
- **Función**: Almacena la configuración actual (simulado)
- **Habilitado**: Solo si las probabilidades suman 1.0
- **Estado actual**: ⚠️ **No afecta el juego real** (implementación futura)

## 🧮 Cálculos del Sistema

### RTP Base

```javascript
RTP_Base = Σ (P(símbolo)^5 × Multiplicador) × 100

Ejemplo:
RTP_Base = (0.30^5 × 2) + (0.25^5 × 3) + ... 
         ≈ 0.96%
```

### Factor de Ajuste

```javascript
Factor_Ajuste = RTP_Objetivo / RTP_Base

Ejemplo con RTP_Objetivo = 95%:
Factor = 95 / 0.96 ≈ 98.96x
```

### Pago Final (en el juego)

```javascript
Pago = Apuesta × Multiplicador × Factor_Ajuste

Ejemplo:
- Apuesta: $10
- 5 Cerezas: Multiplicador base = 2x
- Pago sin ajuste: $10 × 2 = $20
- Pago ajustado: $10 × 2 × 98.96 ≈ $1,979
```

## 📈 Casos de Uso

### Caso 1: Aumentar RTP para Promoción

**Objetivo**: Aumentar RTP de 95% a 97% temporalmente

1. Acceder al panel
2. Ajustar slider de RTP Objetivo a 97%
3. Observar que Factor de Ajuste aumenta a ~101.04x
4. Guardar configuración
5. **Resultado**: Los jugadores reciben ~2% más en premios

### Caso 2: Hacer el Jackpot más Frecuente

**Objetivo**: Aumentar emoción haciendo más probable el símbolo Siete

1. Localizar fila del símbolo "Siete"
2. Cambiar probabilidad de 0.01 a 0.03 (3%)
3. Reducir otras probabilidades para compensar
4. Click en "Normalizar Probabilidades"
5. Verificar que suma = 1.0
6. Guardar configuración
7. **Resultado**: Jackpot aparece 3x más seguido

### Caso 3: RTP Agresivo para Maximizar Ganancias

**Objetivo**: Simular escenario con margen de casa alto (20%)

1. Ajustar RTP Objetivo a 80%
2. Observar que Margen de la Casa = 20%
3. Ver Factor de Ajuste reducido (~83.33x)
4. Analizar impacto en contribuciones RTP
5. **Resultado**: Casino retiene 20% de apuestas

## ⚠️ Nota Importante: Estado Actual vs. Futuro

### 🔴 Estado Actual (Simulado)

```
❌ Los cambios NO afectan el juego real
❌ La configuración NO se guarda en base de datos
✅ Permite visualizar y planificar configuraciones
✅ Útil para análisis de negocio y proyecciones
```

### 🟢 Implementación Futura

Para que la configuración afecte el juego real, se requiere:

1. **Backend - Endpoint de guardado**:
```javascript
POST /api/admin/slot-config
Body: {
  modelo: "A",
  rtpObjetivo: 95,
  simbolos: [{nombre, probabilidad, multiplicador}, ...]
}
```

2. **Base de Datos - Tabla de configuración**:
```sql
CREATE TABLE slot_configurations (
    id INT PRIMARY KEY,
    modelo VARCHAR(50),
    rtp_objetivo DECIMAL(5,2),
    simbolos JSON,
    activo BOOLEAN,
    fecha_creacion TIMESTAMP
);
```

3. **Backend - Lectura en slotController.js**:
```javascript
// En lugar de probabilidades hardcodeadas:
const config = await SlotConfiguration.findOne({
  where: { modelo: 'A', activo: true }
});
const probabilidades = config.simbolos;
```

4. **Aplicación del Factor de Ajuste**:
```javascript
// En slotLogic.js
const rtpObjetivo = config.rtp_objetivo;
const factorAjuste = rtpObjetivo / calcularRTPBase(simbolos);
const pagoFinal = pagoBase * factorAjuste;
```

## 🎨 Características de UI

- **Diseño Responsive**: Adaptable a diferentes tamaños de pantalla
- **Indicadores Visuales**: Colores para validaciones (verde/rojo/naranja)
- **Badges de Tipo**: Identificación visual de símbolos comunes/raros
- **Inputs Numéricos**: Controles precisos con min/max/step
- **Explicación Técnica**: Sección educativa sobre cómo funciona el RTP

## 🔐 Restricciones y Validaciones

| Restricción | Valor | Mensaje |
|-------------|-------|---------|
| Suma probabilidades | Exactamente 1.0 | "Debe sumar 1.0 para ser válido" |
| Probabilidad individual | 0.0 - 1.0 | Limitado por input |
| Multiplicador | 1 - 1000 | Limitado por input |
| RTP Objetivo | 1% - 99% | Slider con marcas visuales |

## 📚 Documentación Relacionada

- **MODELOS_PROBABILISTICOS.md**: Documentación completa sobre el Modelo A
- **Anexo D**: Detalles técnicos del Panel de Administración
- **ModeloAnalisis.tsx**: Vista de análisis del Modelo A (solo lectura)

## 🛠️ Archivos del Componente

```
frontend/src/
├── AdminModeloA.tsx      # Componente React principal
├── AdminModeloA.css      # Estilos del panel
└── main.tsx              # Ruta: /admin-modelo-a
```

## 🚦 Estado del Desarrollo

✅ **Completado**:
- Interfaz visual completa
- Cálculos de RTP en tiempo real
- Validaciones de probabilidades
- Normalización automática
- Sistema de Factor de Ajuste
- Documentación técnica

⏳ **Pendiente** (Implementación Futura):
- Integración con backend
- Guardado en base de datos
- Aplicación real en el motor del juego
- Sistema de permisos/autenticación
- Historial de configuraciones
- A/B testing de configuraciones

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0 (Simulado)  
**Desarrollador**: Proyecto Casino Virtual
