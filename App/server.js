const express = require("express");
const pool = require("./db");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rutas básicas
app.get("/", (req, res) => {
  res.send("API de Turnos funcionando 🚀");
});

// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ${schema}.usuarios;");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});
 
// Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { telefono, nombre, apellido, email } = req.body;
    const query = "INSERT INTO sistema_turnos.Usuarios (telefono, nombre, apellido, email) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [telefono, nombre, apellido, email];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
