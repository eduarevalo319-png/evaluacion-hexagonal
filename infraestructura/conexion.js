const mysql = require('mysql2/promise');

// Creamos el pool de conexiones a tu nueva base de datos
const pool = mysql.createPool({
    host: '127.0.0.1', // Cambiamos 'localhost' por la IP directa para evitar latencia
    user: 'root', // Cambia si tu usuario de XAMPP/MySQL es distinto
    password: '', // Pon tu contraseña si tienes una
    database: 'aee_academico'
});

module.exports = pool;