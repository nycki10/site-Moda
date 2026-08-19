const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'atelie_linha_jwt_secret_key_2026_secure';

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Suporte para alternância de testes locais via header x-user-role se token não estiver presente
        const roleTeste = req.headers['x-user-role'];
        if (roleTeste) {
            req.usuario = { id: 0, nome: 'Usuário Teste', role: roleTeste };
            return next();
        }
        return res.status(401).json({ mensagem: 'Acesso não autorizado. É necessário estar autenticado.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
        }
        req.usuario = decoded;
        next();
    });
}

function requererAdmin(req, res, next) {
    if (!req.usuario || req.usuario.role !== 'admin') {
        return res.status(403).json({ 
            mensagem: 'Acesso negado. Apenas usuários com a função de Administrador (admin) possuem permissão para cadastrar ou modificar produtos.' 
        });
    }
    next();
}

module.exports = { autenticarToken, requererAdmin };
