const mysql = require("mysql2");
require('dotenv').config();

const credenciales = {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '', // XAMPP por defecto no tiene password
    database: process.env.DATABASE || 'sistema_citas',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4',
    timezone: '+00:00',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    connectionLimit: 10
};

console.log('Configuración de BD:', {
    host: credenciales.host,
    user: credenciales.user,
    database: credenciales.database,
    port: credenciales.port
});

const db = mysql.createPool(credenciales);

// Probar la conexión
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 La base de datos "sistema_citas" no existe. Por favor créala ejecutando el script SQL proporcionado.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('💡 No se puede conectar a MySQL. Asegúrate de que XAMPP esté ejecutándose.');
        }
    } else {
        console.log('✅ Conectado a la base de datos MySQL');
        connection.release();
    }
});

module.exports = db.promise();