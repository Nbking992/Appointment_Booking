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

pool.query('SET search_path TO sistema_turnos');

module.exports = pool;
