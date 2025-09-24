const express = require("express");
const session = require("express-session");
const sequelize = require("./sequelize");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(session({
    secret: "casino_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

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