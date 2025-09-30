const express = require("express");
const session = require("express-session");
const cors = require("cors");
const sequelize = require("./sequelize");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const slotRoutes = require("./routes/slot");

const app = express();

// Configurar CORS para permitir comunicación con el frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Puertos donde puede correr el frontend
    credentials: true, // Permitir cookies/sesiones
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(session({
    secret: "casino_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambia a true si usas HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);

const port = 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`servidor corriendo en ${port}`);
        });
    })
    .catch((err) => {
        console.error('No se pudo conectar a la base de datos:', err);
    });