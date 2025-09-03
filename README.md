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

La aplicación frontend estará disponible en `http://localhost:3000` y el backend en el puerto configurado (por defecto `http://localhost:5000`).

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerencias y mejoras.
