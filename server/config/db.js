const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root'
};

let pool = null;
let isDbOnline = false;

// Base em memória para fallback caso o serviço MySQL esteja temporariamente offline
const memoriaUsuarios = [];
const memoriaProdutos = [
    {
        id: 1,
        nome: "Vestido Evasê Floral",
        categoria: "Vestidos",
        imagem: "https://i.pinimg.com/736x/bc/61/ff/bc61ff7ecf46c82d25eab5fcf1369aa2.jpg",
        imagens: JSON.stringify([
            "https://i.pinimg.com/736x/bc/61/ff/bc61ff7ecf46c82d25eab5fcf1369aa2.jpg",
            "assets/molde_01.png"
        ]),
        tecido: "Algodão",
        dificuldade: "Média",
        acabamento: "Zíper Invisível",
        detalhesTecido: "Veludo + Tule transparente",
        detalhesAcabamento: "Vivo/viés dourado e forro",
        descricao: "Este vestido possui modelagem sofisticada, saia longa com formas de folhas, drapeados na cintura e acabamento em forro. Ideal para festas, passarelas e eventos formais.",
        medidas: JSON.stringify([
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ])
    },
    {
        id: 2,
        nome: "Vestido de Festa Longo",
        categoria: "Vestidos",
        imagem: "https://i.pinimg.com/1200x/18/fa/55/18fa55ae01b7ea8a26e3580142100361.jpg",
        imagens: JSON.stringify([
            "https://i.pinimg.com/1200x/18/fa/55/18fa55ae01b7ea8a26e3580142100361.jpg",
            "assets/molde_02.png"
        ]),
        tecido: "Cetim / Seda",
        dificuldade: "Alta",
        acabamento: "Com Forro",
        detalhesTecido: "Cetim / Seda pura",
        detalhesAcabamento: "Forro interno e zíper embutido",
        descricao: "Este vestido possui modelagem sofisticada, saia longa com fenda, drapeados na cintura e acabamento em forro. Ideal para festas, casamentos e eventos formais.",
        medidas: JSON.stringify([
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ])
    },
    {
        id: 3,
        nome: "Vestido Casual Midi",
        categoria: "Vestidos",
        imagem: "https://i.pinimg.com/736x/2f/76/ab/2f76ab356407430b0e4c78ad18c03345.jpg",
        imagens: JSON.stringify([
            "https://i.pinimg.com/736x/2f/76/ab/2f76ab356407430b0e4c78ad18c03345.jpg",
            "assets/molde_03.png"
        ]),
        tecido: "Viscose",
        dificuldade: "Fácil",
        acabamento: "Lastex nas Costas",
        detalhesTecido: "Linha / Algodão leve",
        detalhesAcabamento: "Com Forro e Lastex flexível",
        descricao: "Esse vestido tem um estilo clássico, elegante e romântico, com uma inspiração bem forte em vestidos de verão.",
        medidas: JSON.stringify([
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ])
    },
    {
        id: 4,
        nome: "Blusa Gola Alta",
        categoria: "Outras Peças",
        imagem: "https://i.pinimg.com/1200x/e3/f7/b1/e3f7b178ac74846002982e3bfb8bd6e0.jpg",
        imagens: JSON.stringify([
            "https://i.pinimg.com/1200x/e3/f7/b1/e3f7b178ac74846002982e3bfb8bd6e0.jpg",
            "assets/molde_04.png"
        ]),
        tecido: "Malha",
        dificuldade: "Fácil",
        acabamento: "Manga Longa",
        detalhesTecido: "Malha de Algodão / Elastano",
        detalhesAcabamento: "Gola alta ajustada e punhos",
        descricao: "A blusa transmite elegância e sofisticação principalmente pela combinação do tecido brilhante, da gola alta e das mangas volumosas.",
        medidas: JSON.stringify([
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ])
    },
    {
        id: 5,
        nome: "Calça Alfaiataria",
        categoria: "Outras Peças",
        imagem: "https://i.pinimg.com/736x/4a/91/cb/4a91cbb24acd4619fb7edf6c7b3ec20a.jpg",
        imagens: JSON.stringify([
            "https://i.pinimg.com/736x/4a/91/cb/4a91cbb24acd4619fb7edf6c7b3ec20a.jpg",
            "assets/molde_05.png"
        ]),
        tecido: "Linho",
        dificuldade: "Alta",
        acabamento: "Com Bolsos",
        detalhesTecido: "Linho Rústico Nobre",
        detalhesAcabamento: "Cós estruturado com Bolsos faca",
        descricao: "Calça de alfaiataria com corte elegante, vinco frontal bem marcado e bolsos funcionais. Perfeita para composições sofisticadas.",
        medidas: JSON.stringify([
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ])
    },
    {
        id: 6,
        nome: "Saia Longa Jeans",
        categoria: "Outras Peças",
        imagem: "https://i.pinimg.com/736x/3e/9d/a3/3e9da360e240bd4b73a890004c1271f8.jpg",
        imagens: JSON.stringify([
            "https://i.pinimg.com/736x/3e/9d/a3/3e9da360e240bd4b73a890004c1271f8.jpg",
            "assets/molde_06.png"
        ]),
        tecido: "Tricoline",
        dificuldade: "Fácil",
        acabamento: "Cós Anatômico",
        detalhesTecido: "Jeans / Denim leve",
        detalhesAcabamento: "Cós Anatômico com fenda frontal",
        descricao: "Saia longa jeans com modelagem fluida, botões frontais decorativos e cós anatômico que se adapta com perfeição à cintura.",
        medidas: JSON.stringify([
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ])
    }
];

async function inicializarMemoria() {
    if (memoriaUsuarios.length === 0) {
        const senhaAdminHash = await bcrypt.hash('admin123', 10);
        const senhaUserHash = await bcrypt.hash('user123', 10);
        memoriaUsuarios.push(
            { id: 1, nome: 'Administrador Ateliê', email: 'admin@atelie.com', senha: senhaAdminHash, role: 'admin' },
            { id: 2, nome: 'Maria Costura', email: 'usuario@atelie.com', senha: senhaUserHash, role: 'user' }
        );
    }
}

async function initDatabase() {
    await inicializarMemoria();

    try {
        const tempConn = await mysql.createConnection(dbConfig);
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'atelie_moda'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await tempConn.end();

        pool = mysql.createPool({
            ...dbConfig,
            database: process.env.DB_NAME || 'atelie_moda',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                role ENUM('user', 'premium', 'admin') DEFAULT 'user',
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                categoria VARCHAR(100) NOT NULL,
                imagem TEXT NOT NULL,
                imagens JSON NOT NULL,
                tecido VARCHAR(100) NOT NULL,
                dificuldade VARCHAR(50) NOT NULL,
                acabamento VARCHAR(100) NOT NULL,
                detalhesTecido TEXT,
                detalhesAcabamento TEXT,
                descricao TEXT NOT NULL,
                medidas JSON NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        const [usuariosExistentes] = await pool.query('SELECT COUNT(*) as total FROM usuarios');
        if (usuariosExistentes[0].total === 0) {
            for (const u of memoriaUsuarios) {
                await pool.query(
                    'INSERT INTO usuarios (id, nome, email, senha, role) VALUES (?, ?, ?, ?, ?)',
                    [u.id, u.nome, u.email, u.senha, u.role]
                );
            }
        }

        const [produtosExistentes] = await pool.query('SELECT COUNT(*) as total FROM produtos');
        if (produtosExistentes[0].total === 0) {
            for (const p of memoriaProdutos) {
                await pool.query(`
                    INSERT INTO produtos (id, nome, categoria, imagem, imagens, tecido, dificuldade, acabamento, detalhesTecido, detalhesAcabamento, descricao, medidas)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [p.id, p.nome, p.categoria, p.imagem, p.imagens, p.tecido, p.dificuldade, p.acabamento, p.detalhesTecido, p.detalhesAcabamento, p.descricao, p.medidas]);
            }
        }

        isDbOnline = true;
        console.log('🚀 Conectado com sucesso ao banco MySQL local (porta 3306)!');
    } catch (error) {
        isDbOnline = false;
        console.warn('⚠️ Não foi possível conectar ao MySQL local na porta 3306 (serviço parado ou incorreto):', error.message);
        console.log('ℹ️ A API Express continuará rodando com o banco de dados Em-Memória / Fallback para testes instantâneos!');
    }
}

// Interface de Query com suporte a Fallback em Memória se o MySQL estiver desconectado
const poolProxy = {
    async query(sql, params = []) {
        if (isDbOnline && pool) {
            try {
                return await pool.query(sql, params);
            } catch (err) {
                console.warn('Erro na query MySQL, alternando para fallback em memória:', err.message);
            }
        }

        // --- FALLBACK EM MEMÓRIA ---
        const sqlUpper = sql.trim().toUpperCase();

        if (sqlUpper.includes('FROM USUARIOS')) {
            if (sqlUpper.includes('COUNT(*)')) {
                return [[{ total: memoriaUsuarios.length }]];
            }
            if (sqlUpper.includes('WHERE EMAIL =')) {
                const emailBusca = params[0];
                const res = memoriaUsuarios.filter(u => u.email === emailBusca);
                return [res];
            }
            return [memoriaUsuarios];
        }

        if (sqlUpper.includes('INSERT INTO USUARIOS')) {
            const [nome, email, senha, role] = params;
            const novo = { id: memoriaUsuarios.length + 1, nome, email, senha, role };
            memoriaUsuarios.push(novo);
            return [{ insertId: novo.id }];
        }

        if (sqlUpper.includes('FROM PRODUTOS')) {
            if (sqlUpper.includes('COUNT(*)')) {
                return [[{ total: memoriaProdutos.length }]];
            }
            if (sqlUpper.includes('WHERE ID =')) {
                const idBusca = parseInt(params[0]);
                const res = memoriaProdutos.filter(p => p.id === idBusca);
                return [res];
            }
            return [memoriaProdutos];
        }

        if (sqlUpper.includes('INSERT INTO PRODUTOS')) {
            const [nome, categoria, imagem, imagens, tecido, dificuldade, acabamento, detalhesTecido, detalhesAcabamento, descricao, medidas] = params;
            const novoId = memoriaProdutos.length ? Math.max(...memoriaProdutos.map(p => p.id)) + 1 : 1;
            const novoProd = {
                id: novoId, nome, categoria, imagem, imagens, tecido, dificuldade, acabamento, detalhesTecido, detalhesAcabamento, descricao, medidas
            };
            memoriaProdutos.push(novoProd);
            return [{ insertId: novoId }];
        }

        if (sqlUpper.includes('DELETE FROM PRODUTOS')) {
            const idRemove = parseInt(params[0]);
            const idx = memoriaProdutos.findIndex(p => p.id === idRemove);
            if (idx !== -1) {
                memoriaProdutos.splice(idx, 1);
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        return [[]];
    }
};

function getPool() {
    return poolProxy;
}

module.exports = { initDatabase, getPool };
