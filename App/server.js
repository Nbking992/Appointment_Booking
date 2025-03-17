const express = require("express");
const pool = require("./db");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Rutas básicas
app.get("/", (req, res) => {
  res.send("API de Turnos funcionando 🚀");
});

// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios;");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE telefono = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

 
// Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
  try {
    console.log("📌 Datos recibidos:", req.body); // ⬅️ Verifica lo que llega

    const { telefono, nombre, apellido, email } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ error: "El nombre y apellido son obligatorios" });
    }

    const query = `INSERT INTO usuarios (telefono, nombre, apellido, email) 
                   VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [telefono || "", nombre, apellido, email || ""];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Actualizar un usuario
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  const { telefono, nombre, apellido, email } = req.body;  // Obtener los datos enviados en el cuerpo

  try {
    // Consulta SQL para actualizar el usuario
    const query = `
      UPDATE usuarios
      SET telefono = $1, nombre = $2, apellido = $3, email = $4
      WHERE codigousuario = $5
      RETURNING *;
    `;
    const values = [telefono, nombre, apellido, email, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      // Si no se encuentra el usuario con ese ID
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);  // Devolver el usuario actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Actualizar parcialmente un usuario (PATCH)
app.patch("/usuarios/:id", async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  const { telefono, nombre, apellido, email } = req.body;  // Obtener los datos enviados en el cuerpo

  try {
    // Crear un array de campos que serán actualizados
    const fieldsToUpdate = [];
    const values = [];

    if (telefono) {
      fieldsToUpdate.push(`telefono = $${fieldsToUpdate.length + 1}`);
      values.push(telefono);
    }

    if (nombre) {
      fieldsToUpdate.push(`nombre = $${fieldsToUpdate.length + 1}`);
      values.push(nombre);
    }

    if (apellido) {
      fieldsToUpdate.push(`apellido = $${fieldsToUpdate.length + 1}`);
      values.push(apellido);
    }

    if (email) {
      fieldsToUpdate.push(`email = $${fieldsToUpdate.length + 1}`);
      values.push(email);
    }

    // Si no se envió ningún campo a actualizar
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    // Agregar el ID al final de los valores
    values.push(id);

    // Construir la consulta dinámica con los campos a actualizar
    const query = `
      UPDATE Sistema_Turnos.Usuarios
      SET ${fieldsToUpdate.join(", ")}
      WHERE codigousuario = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);  // Devolver el usuario actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Eliminar un usuario
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL

  try {
    // Consulta SQL para eliminar el usuario
    const query = "DELETE FROM usuarios WHERE codigousuario = $1 RETURNING *;";
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      // Si no se encuentra el usuario con ese ID
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente", usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
