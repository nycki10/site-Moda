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

// Rotas da API
app.use('/api', authRoutes);
app.use('/api', produtoRoutes);

// Rota de Healthcheck / Status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        aplicacao: 'Ateliê & Linha API',
        banco: 'MySQL',
        timestamp: new Date().toISOString()
    });
});

// Inicialização do Banco de Dados e Servidor
async function startServer() {
    console.log('⏳ Inicializando conexão com o banco de dados MySQL...');
    await initDatabase();

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

startServer();
