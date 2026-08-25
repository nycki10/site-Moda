const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de Inicialização Lazy do Banco de Dados (Essencial para Vercel Serverless)
let dbInitialized = false;
let dbInitPromise = null;

app.use(async (req, res, next) => {
    if (!dbInitialized) {
        if (!dbInitPromise) {
            dbInitPromise = initDatabase()
                .then(() => {
                    dbInitialized = true;
                })
                .catch((err) => {
                    console.error('⚠️ Erro ao inicializar DB (usando fallback em memória):', err.message);
                });
        }
        await dbInitPromise;
    }
    next();
});

// Rotas da API
app.use('/api', authRoutes);
app.use('/api', produtoRoutes);

// Rota de Healthcheck / Status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        aplicacao: 'Ateliê & Linha API',
        ambiente: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Local',
        timestamp: new Date().toISOString()
    });
});

// Inicialização para ambiente local (fora da Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
======================================================
🧵 ATELIÊ & LINHA - API EXPRESS RODANDO NA PORTA ${PORT}
======================================================
📍 Base URL: http://localhost:${PORT}/api
📍 Status: http://localhost:${PORT}/api/status
📍 Produtos (Público): http://localhost:${PORT}/api/produtos
======================================================
        `);
    });
}

// Export para Vercel Serverless Function
module.exports = app;
