const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runScript() {
    console.log('⏳ Executando scripts SQL de inicialização...');
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'root',
        multipleStatements: true
    };

    try {
        const conn = await mysql.createConnection(config);

        const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');

        console.log('1. Executando schema.sql (Criando database e tabelas)...');
        await conn.query(schemaSql);

        console.log('2. Executando seed.sql (Inserindo usuários e 6 produtos fixos)...');
        await conn.query(seedSql);

        console.log('✅ Banco de dados e tabelas populados com sucesso!');
        await conn.end();
    } catch (err) {
        console.error('❌ Erro ao executar scripts SQL:', err.message);
    }
}

runScript();
