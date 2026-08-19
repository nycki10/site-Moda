const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');
const { autenticarToken } = require('../middlewares/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'atelie_linha_jwt_secret_key_2026_secure';

// CADASTRO DE NOVO USUÁRIO
router.post('/cadastrar', async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
        }

        const pool = getPool();
        const [existente] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) {
            return res.status(400).json({ mensagem: 'E-mail já cadastrado na plataforma.' });
        }

        const userRole = (role === 'admin' || role === 'premium') ? role : 'user';
        const senhaHash = await bcrypt.hash(senha, 10);
        const nomeUsuario = nome || email.split('@')[0];

        const [result] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
            [nomeUsuario, email, senhaHash, userRole]
        );

        const usuarioObj = { id: result.insertId, nome: nomeUsuario, email, role: userRole };
        const token = jwt.sign(usuarioObj, JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({
            ok: true,
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: usuarioObj,
            token
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao realizar cadastro.' });
    }
});

// LOGIN DE USUÁRIO
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
        }

        const pool = getPool();
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (usuarios.length === 0) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas. E-mail não encontrado.' });
        }

        const user = usuarios[0];
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas. Senha incorreta.' });
        }

        const usuarioObj = { id: user.id, nome: user.nome, email: user.email, role: user.role };
        const token = jwt.sign(usuarioObj, JWT_SECRET, { expiresIn: '7d' });

        return res.json({
            ok: true,
            mensagem: 'Login realizado com sucesso!',
            usuario: usuarioObj,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao realizar login.' });
    }
});

// OBTER PERFIL DO USUÁRIO LOGADO
router.get('/me', autenticarToken, async (req, res) => {
    return res.json({ usuario: req.usuario });
});

module.exports = router;
