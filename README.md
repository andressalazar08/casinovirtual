# casinovirtual

Proyecto integrador I
Universidad de Antioquia
# Casino Virtual - Proyecto Fullstack

Este proyecto es una aplicación fullstack para un casino virtual, desarrollada como parte del Proyecto Integrador I. El objetivo principal es ofrecer una experiencia de juego en línea, centrada en el clásico juego de tragamonedas.

## Características principales

- **Frontend:** Interfaz moderna y responsiva desarrollada con Next.js, permitiendo a los usuarios interactuar fácilmente con el juego de tragamonedas y otras funcionalidades del casino.
- **Backend:** API robusta construida con Node.js y Express, encargada de la lógica del juego, gestión de usuarios, autenticación y almacenamiento de datos.
- **Juego de tragamonedas:** Implementación de la mecánica tradicional de tragamonedas, con generación aleatoria de resultados, sistema de premios y registro de partidas.
- **Gestión de usuarios:** Registro, inicio de sesión y seguimiento de estadísticas de cada jugador.
- **Escalabilidad:** Estructura pensada para agregar más juegos y funcionalidades en el futuro.

## Estructura del proyecto

- `/frontend/casinofrontend`: Código fuente del frontend (Next.js).
- `/backend`: Código fuente del backend (Node.js, Express).
- `/public`: Recursos estáticos y archivos multimedia.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/andressalazar08/casinovirtual.git
```

### 2. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend/casinofrontend
npm install
```

### 3. Ejecutar la aplicación

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend/casinofrontend
npm run dev
```

## Lógica del Juego Tragamonedas (Backend)

El backend implementa la lógica principal del juego tragamonedas, asegurando resultados justos y registro de cada jugada. Las funciones clave son:

### 1. Generador de Números Aleatorios (RNG)

- La función `generateRandomReels` simula los rodillos de la máquina tragamonedas, seleccionando símbolos aleatorios para cada rodillo a partir de los símbolos definidos en la base de datos.
- El número de rodillos y símbolos por rodillo es configurable.
- El resultado es una matriz que representa los símbolos visibles tras cada giro.

### 2. Verificación de Líneas de Pago

- La función `checkWinningLine` evalúa la línea central de los rodillos para determinar si hay una combinación ganadora.
- Si todos los símbolos de la línea central son iguales, se considera un giro ganador.
- El pago se calcula multiplicando la apuesta por el multiplicador del símbolo ganador.


### 3. Flujo de una Jugada

1. El usuario se registra y hace login en la plataforma.
2. Realiza una apuesta y solicita un giro (`POST /api/slots/spin`).
3. El backend genera los símbolos aleatorios usando el RNG.
4. Se verifica si la combinación es ganadora y se calcula el premio.
5. Se actualiza el saldo del usuario y se registra la jugada en la base de datos (`SlotSpin`).
6. El backend responde con el resultado del giro, los símbolos y el monto ganado (si aplica).
7. El usuario puede consultar su historial de jugadas (`GET /api/slots/history`) y su saldo (`GET /api/slots/balance`).

## Ejemplo de flujo completo usando la API

1. **Registro de usuario**
	- `POST /api/auth/register` con body `{ "username": "usuario", "email": "correo@ejemplo.com", "password": "clave" }`
2. **Login**
	- `POST /api/auth/login` con body `{ "email": "correo@ejemplo.com", "password": "clave" }`
3. **Consultar símbolos y pagos**
	- `GET /api/slots/symbols`
4. **Realizar un giro**
	- `POST /api/slots/spin` con body `{ "betAmount": 100 }`
5. **Consultar historial de jugadas**
	- `GET /api/slots/history`
6. **Consultar saldo**
	- `GET /api/slots/balance`

> Nota: Para probar el flujo completo, puedes usar Postman o una herramienta similar. Recuerda que las rutas de tragamonedas requieren autenticación por sesión.
```

La aplicación frontend estará disponible en `http://localhost:3000` y el backend en el puerto configurado (por defecto `http://localhost:5000`).

