const express = require("express");
const session = require("express-session");
const sequelize = require("./sequelize");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(session({
    secret: "casino_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

app.use("/api/auth", authRoutes);

const port = 3000;

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`servidor corriendo en ${port}`);
    });
});