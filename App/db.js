const { Pool } = require('pg');
require('dotenv').config();  // Si el archivo está en App/

console.log("Conectando con el usuario:", process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE, // Asegúrate de que esta variable tenga el nombre correcto de la base de datos
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const setSchema = async () => {
  const schema = process.env.DB_SCHEMA;
  if (schema) {
    try {
      // Establecer el search_path en la base de datos para usar el esquema deseado
      await pool.query('SET search_path TO $1', [schema]);
      console.log(`Esquema configurado a: ${schema}`);
    } catch (error) {
      console.error("Error al configurar el esquema:", error);
    }
  } else {
    console.log("No se ha definido un esquema en .env");
  }
};

module.exports = pool;
