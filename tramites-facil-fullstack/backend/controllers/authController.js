const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

exports.register = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, dni, password } = req.body;
        
        // Validaciones básicas
        if (!nombre || !apellido || !email || !dni || !password) {
            return res.status(400).json({ 
                error: 'Todos los campos obligatorios deben ser completados' 
            });
        }
        
        // Verificar si el usuario ya existe
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                error: 'Ya existe un usuario registrado con este email' 
            });
        }
        
        // Crear usuario
        const userId = await User.createUser({
            nombre, apellido, email, telefono, dni, password
        });
        
        // Generar token
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId,
            token
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email y contraseña son requeridos' 
            });
        }
        
        // Buscar usuario
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }
        
        // Verificar contraseña
        const isValidPassword = await User.validatePassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }
        
        // Generar token
        const token = jwt.sign({ userId: user.usuario_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.usuario_id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.getUserById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ error: error.message });
    }
};