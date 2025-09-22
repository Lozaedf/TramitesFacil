const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (userData) => {
    const { nombre, apellido, email, telefono, dni, password } = userData;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, apellido, email, telefono, dni, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, telefono, dni, passwordHash]
    );
    return result.insertId;
};

exports.getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND activo = TRUE', [email]);
    return rows[0];
};

exports.getUserById = async (id) => {
    const [rows] = await db.query('SELECT usuario_id, nombre, apellido, email, telefono, dni, fecha_registro FROM usuarios WHERE usuario_id = ? AND activo = TRUE', [id]);
    return rows[0];
};

exports.validatePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

exports.updateUser = async (id, userData) => {
    const { nombre, apellido, telefono } = userData;
    const [result] = await db.query(
        'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE usuario_id = ?',
        [nombre, apellido, telefono, id]
    );
    return result.changedRows;
};