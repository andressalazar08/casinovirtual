# 🎰 Casino Virtual - Slot Machine

Aplicación web de casino virtual con slot machine interactiva, análisis probabilístico avanzado y panel de administración para gerentes.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Modelos Probabilísticos](#modelos-probabilísticos)
- [Panel de Administración](#panel-de-administración)
- [Documentación](#documentación)

## 🎯 Descripción

Sistema completo de casino virtual que incluye:
- **Juego de Slot Machine** funcional con 7 símbolos y efectos audiovisuales
- **Sistema de autenticación** de usuarios
- **Análisis probabilístico** con simulación Monte Carlo
- **Panel de administración** para personalizar modelos de probabilidad
- **Documentación técnica** sobre RTP y modelos matemáticos

## ✨ Características

### Para Jugadores
- 🎮 Slot machine de 5x5 con animaciones fluidas
- 🔊 Efectos de sonido inmersivos
- 💰 Sistema de créditos y apuestas
- 🎯 Múltiples líneas de apuesta
- 📊 Historial de jugadas

### Para Gerentes
- 📈 Análisis del Modelo A (Distribución Ponderada)
- 🔄 Análisis del Modelo D (Detección de Rachas)
- ⚙️ Panel de administración para personalizar probabilidades
- 🎲 Simulación Monte Carlo de 100,000 jugadas
- 📉 Cálculo de RTP en tiempo real
- 💹 Proyecciones financieras y análisis de margen

## 🛠️ Tecnologías

### Frontend
- **React 18.2.0** - Framework UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite 7.1.7** - Build tool
- **React Router DOM 6.30.1** - Navegación
- **CSS3** - Estilos y animaciones

### Backend
- **Node.js 20.16.0** - Runtime
- **Express 5.1.0** - Framework web
- **Sequelize 6.37.7** - ORM
- **MySQL** - Base de datos
- **JWT** - Autenticación

## 📁 Estructura del Proyecto

```
casinovirtual/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Autenticación
│   │   ├── slotController.js      # Lógica del slot
│   │   ├── slotLogic.js           # Cálculos probabilísticos
│   │   ├── symbolController.js    # Gestión de símbolos
│   │   └── userController.js      # Gestión de usuarios
│   ├── models/
│   │   ├── user.js                # Modelo de usuario
│   │   ├── symbol.js              # Modelo de símbolo
│   │   └── slotspin.js            # Modelo de jugada
│   ├── routes/
│   │   ├── auth.js                # Rutas de autenticación
│   │   ├── slot.js                # Rutas del juego
│   │   └── user.js                # Rutas de usuario
│   ├── middlewares/
│   │   └── isAuthenticated.js    # Middleware JWT
│   ├── index.js                   # Servidor principal
│   ├── sequelize.js               # Configuración DB
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/              # Componentes de autenticación
│   │   │   └── SlotMachine/       # Componentes del slot
│   │   ├── pages/
│   │   │   ├── Auth/              # Página de login/registro
│   │   │   └── Home/              # Página principal
│   │   ├── services/
│   │   │   ├── api.ts             # Cliente HTTP
│   │   │   ├── authService.ts     # Servicios de auth
│   │   │   ├── slotService.ts     # Servicios del slot
│   │   │   └── userService.ts     # Servicios de usuario
│   │   ├── App.tsx                # Componente principal (slot machine)
│   │   ├── Casino.tsx             # Vista del casino
│   │   ├── Second_page.tsx        # Página de ingreso
│   │   ├── ModeloAnalisis.tsx     # Análisis Modelo A
│   │   ├── ModeloD_Rachas.tsx     # Análisis Modelo D
│   │   ├── AdminModeloA.tsx       # Panel de administración
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Assets estáticos
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── MODELOS_PROBABILISTICOS.md     # Documentación técnica completa
├── ADMIN_MODELO_A_README.md       # Guía del panel de administración
└── README.md                       # Este archivo
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 20.19+ o 22.12+ (recomendado)
- MySQL 8.0+
- npm o yarn

### Backend

```bash
cd backend
npm install

# Configurar variables de entorno (crear archivo .env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=casino_db
JWT_SECRET=tu_secret_key

# Iniciar servidor
npm start
```

### Frontend

```bash
cd frontend
npm install

# Desarrollo
npm run dev

# Producción
npm run build
```

## 🗺️ Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `App.tsx` | Slot machine principal |
| `/Ingreso` | `Second_Page.tsx` | Login/Registro |
| `/casino` | `Casino.tsx` | Vista del casino |
| `/modelo-analisis` | `ModeloAnalisis.tsx` | Análisis del Modelo A |
| `/modelo-d-rachas` | `ModeloD_Rachas.tsx` | Análisis del Modelo D |
| `/admin-modelo-a` | `AdminModeloA.tsx` | Panel de administración |

## 📊 Modelos Probabilísticos

### Modelo A: Distribución Ponderada

Sistema de probabilidades diferenciadas por símbolo:

| Símbolo | Probabilidad | Multiplicador | Tipo |
|---------|-------------|---------------|------|
| 🍒 Cereza | 30% | 2x | Común |
| 🍋 Limón | 25% | 3x | Común |
| 🍊 Naranja | 20% | 5x | Medio |
| 🍉 Sandía | 12% | 8x | Medio |
| ⭐ Estrella | 8% | 15x | Raro |
| 💎 Diamante | 4% | 50x | Muy Raro |
| 7️⃣ Siete | 1% | 100x | Jackpot |

**RTP Configurable**: 1% - 99% (recomendado: 94%-96%)

**Fórmula del Factor de Ajuste**:
```
RTP_Base = Σ(P(símbolo)^5 × Multiplicador) × 100
Factor_Ajuste = RTP_Objetivo / RTP_Base
Pago_Final = Apuesta × Multiplicador × Factor_Ajuste
```

### Modelo D: Rachas con Ajuste Dinámico

Sistema que detecta rachas y ajusta dinámicamente las probabilidades:

**Detección de Rachas de Pérdida** (5 giros consecutivos sin premio):
- ✅ Aumenta +5% símbolos comunes
- ❌ Reduce -3% símbolos raros

**Detección de Rachas de Victoria** (3 giros consecutivos con premio):
- ❌ Reduce -5% símbolos raros
- ⚖️ Mantiene símbolos comunes

**Objetivo**: Mantener engagement sin comprometer RTP objetivo.

## ⚙️ Panel de Administración

### Acceso
- **Botón**: ⚙️ ADMIN MODELO A (esquina superior derecha, color morado)
- **Ruta**: `/admin-modelo-a`

### Funcionalidades

#### 1. Configuración de Probabilidades
- Ajuste individual por símbolo (0.0 - 1.0)
- Validación automática (suma debe ser 1.0)
- Normalización automática disponible

#### 2. Configuración de Multiplicadores
- Rango: 1 - 1000
- Impacto en RTP calculado en tiempo real

#### 3. RTP Objetivo
- Slider interactivo: 1% - 99%
- Cálculo automático del Factor de Ajuste
- Visualización del margen de la casa

#### 4. Tabla de Análisis
- Contribución individual al RTP
- Probabilidad de línea completa (P^5)
- Vista consolidada del modelo

#### 5. Acciones
- **Normalizar**: Ajusta probabilidades para sumar 1.0
- **Restablecer**: Restaura valores por defecto
- **Guardar**: Almacena configuración (simulado)

### Estado Actual
⚠️ **Simulado**: Los cambios no afectan el juego real actualmente.

📅 **Implementación Futura**: Requiere integración con backend y base de datos.

Para más detalles, consultar [ADMIN_MODELO_A_README.md](./ADMIN_MODELO_A_README.md)

## 📚 Documentación

### MODELOS_PROBABILISTICOS.md

Documento técnico completo (1055 líneas) que incluye:

- ✅ Explicación detallada del RTP
- ✅ Sistema de Factor de Ajuste
- ✅ 5 modelos probabilísticos propuestos (A, B, C, D, E)
- ✅ Análisis de volatilidad
- ✅ Métricas para gerentes (GGR, ARPU, LTV)
- ✅ Consideraciones legales y éticas
- ✅ Código de simulación Monte Carlo
- ✅ Glosario de términos
- ✅ Referencias académicas

**Anexos incluidos**:
- Anexo A: Cálculos matemáticos detallados
- Anexo B: Comparativa internacional de RTPs
- Anexo C: Código de simulación
- Anexo D: Panel de administración
- Anexo E: Glosario de términos

### ADMIN_MODELO_A_README.md

Guía específica del panel de administración:

- 🎯 Objetivo y funcionalidades
- 📊 Descripción de cada métrica
- 🧮 Fórmulas de cálculo
- 📈 Casos de uso prácticos
- ⚠️ Restricciones y validaciones
- 🚦 Roadmap de implementación

## 🎮 Uso del Sistema

### Para Jugadores

1. Acceder a `/Ingreso`
2. Registrarse o iniciar sesión
3. Configurar apuesta y líneas
4. Hacer clic en "SPIN"
5. Observar resultados y premios

### Para Gerentes - Análisis

1. Desde la pantalla principal, click en:
   - **📊 ANÁLISIS MODELO A**: Ver análisis del Modelo A
   - **🔄 ANÁLISIS MODELO D**: Ver análisis del Modelo D

2. En cada vista:
   - Configurar RTP objetivo (slider 1%-99%)
   - Ejecutar simulación Monte Carlo (100,000 jugadas)
   - Analizar métricas: RTP real, frecuencia de aciertos, GGR
   - Comparar con estándares de la industria

### Para Gerentes - Administración

1. Click en **⚙️ ADMIN MODELO A**
2. Ajustar probabilidades de símbolos
3. Modificar multiplicadores
4. Configurar RTP objetivo
5. Normalizar si es necesario
6. Guardar configuración

## 🧪 Simulación Monte Carlo

Ambas vistas de análisis incluyen simulador que ejecuta 100,000 jugadas virtuales:

**Métricas calculadas**:
- RTP Real alcanzado
- Frecuencia de aciertos (Hit Frequency)
- GGR (Gross Gaming Revenue)
- Distribución de premios por símbolo
- Convergencia del RTP al objetivo

**Visualización**:
- Gráfico de convergencia
- Tabla de resultados
- Estadísticas descriptivas
- Comparativa con industria

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Middleware de verificación de tokens
- ✅ Encriptación de contraseñas (bcrypt)
- ✅ Validación de inputs en backend
- ✅ Protección contra inyección SQL (Sequelize)

## 📈 Métricas de Negocio

**GGR (Gross Gaming Revenue)**:
```
GGR = Total Apostado - Total Pagado
```

**Margen de la Casa**:
```
Margen = 100% - RTP%
```

**ARPU (Average Revenue Per User)**:
```
ARPU = GGR / Número de Jugadores
```

## 🎨 Características Visuales

- 🌈 Animaciones CSS fluidas
- 🎵 Sistema de audio inmersivo (spin, win, jackpot)
- 💫 Efectos visuales de victoria
- 📱 Diseño responsive
- 🎨 Paleta de colores profesional
- ⚡ Transiciones suaves

## 🐛 Troubleshooting

**Error de Node.js version**:
```
Requiere Node.js 20.19+ o 22.12+
Solución: Actualizar Node.js o ignorar warning (funciona con 20.16.0)
```

**Error de conexión a base de datos**:
```
Verificar credenciales en .env
Asegurar que MySQL esté corriendo
```

**Build exitoso pero warning**:
```
El warning de Node.js no es crítico
El build se completa correctamente
```

## 🚦 Estado del Proyecto

### ✅ Completado

- Frontend completo con React + TypeScript
- Backend funcional con Express + Sequelize
- Sistema de autenticación
- Slot machine operativa
- 2 vistas de análisis probabilístico (Modelo A y D)
- Panel de administración (UI completa)
- Documentación técnica exhaustiva
- Sistema de Factor de Ajuste RTP

### ⏳ Pendiente (Roadmap)

- Integración del panel de administración con backend
- Guardado de configuraciones en base de datos
- Aplicación dinámica de parámetros en el juego
- Sistema de permisos de administrador
- Historial de configuraciones
- A/B testing de modelos
- Dashboard de métricas en tiempo real
- Implementación de Modelo B, C y E

## 👥 Créditos

**Proyecto**: Casino Virtual  
**Contexto**: Proyecto Integrador I - UDEA 2025-2  
**Fecha**: Octubre 2025

## 📄 Licencia

Este es un proyecto académico desarrollado con fines educativos.

---

## 📞 Contacto y Soporte

Para más información sobre el proyecto, consultar:
- **MODELOS_PROBABILISTICOS.md**: Documentación técnica completa
- **ADMIN_MODELO_A_README.md**: Guía del panel de administración
- **Código fuente**: Comentarios inline en los archivos

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0  
**Build Status**: ✅ Exitoso (52 módulos, 213.76 KB JS, 40.71 KB CSS)
