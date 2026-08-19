const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { autenticarToken, requererAdmin } = require('../middlewares/authMiddleware');

// Função utilitária para tratar o objeto de produto retornado do MySQL
function formatarProduto(p) {
    if (!p) return null;
    return {
        id: p.id,
        nome: p.nome,
        categoria: p.categoria,
        imagem: p.imagem,
        imagens: typeof p.imagens === 'string' ? JSON.parse(p.imagens) : p.imagens,
        tecido: p.tecido,
        dificuldade: p.dificuldade,
        acabamento: p.acabamento,
        detalhesTecido: p.detalhesTecido || p.detalhes_tecido,
        detalhesAcabamento: p.detalhesAcabamento || p.detalhes_acabamento,
        descricao: p.descricao,
        medidas: typeof p.medidas === 'string' ? JSON.parse(p.medidas) : p.medidas
    };
}

// 1. LISTAR TODOS OS PRODUTOS (Público - Usuários Padrão e Visitantes)
router.get('/produtos', async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM produtos ORDER BY id ASC');
        const listaFormatada = rows.map(formatarProduto);
        return res.json(listaFormatada);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao consultar o catálogo de produtos.' });
    }
});

// 2. OBTER PRODUTO POR ID (Público)
router.get('/produtos/:id', async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }
        return res.json(formatarProduto(rows[0]));
    } catch (error) {
        console.error('Erro ao buscar produto por id:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao consultar o produto.' });
    }
});

// 3. CADASTRAR NOVO PRODUTO (Protegido - Exclusivo para Administrador)
router.post('/produtos', autenticarToken, requererAdmin, async (req, res) => {
    try {
        const {
            nome,
            categoria,
            imagem,
            imagens,
            tecido,
            dificuldade,
            acabamento,
            detalhesTecido,
            detalhesAcabamento,
            descricao,
            medidas
        } = req.body;

        if (!nome || !imagem || !tecido) {
            return res.status(400).json({ mensagem: 'Os campos nome, imagem e tecido são obrigatórios.' });
        }

        const listaImagens = (Array.isArray(imagens) && imagens.length > 0) ? imagens : [imagem];
        const tabelaMedidas = (Array.isArray(medidas) && medidas.length > 0) ? medidas : [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ];

        const pool = getPool();
        const [result] = await pool.query(`
            INSERT INTO produtos (nome, categoria, imagem, imagens, tecido, dificuldade, acabamento, detalhesTecido, detalhesAcabamento, descricao, medidas)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            nome,
            categoria || 'Outras Peças',
            imagem,
            JSON.stringify(listaImagens),
            tecido,
            dificuldade || 'Média',
            acabamento || 'Padrão',
            detalhesTecido || tecido,
            detalhesAcabamento || acabamento,
            descricao || '',
            JSON.stringify(tabelaMedidas)
        ]);

        const novoProduto = {
            id: result.insertId,
            nome,
            categoria: categoria || 'Outras Peças',
            imagem,
            imagens: listaImagens,
            tecido,
            dificuldade: dificuldade || 'Média',
            acabamento: acabamento || 'Padrão',
            detalhesTecido: detalhesTecido || tecido,
            detalhesAcabamento: detalhesAcabamento || acabamento,
            descricao: descricao || '',
            medidas: tabelaMedidas
        };

        console.log(`🛡️ Admin "${req.usuario.nome || req.usuario.email}" cadastrou um novo molde: "${nome}" (ID: ${result.insertId})`);

        return res.status(201).json({
            ok: true,
            mensagem: 'Novo molde cadastrado com sucesso!',
            produto: novoProduto
        });
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao cadastrar produto no banco MySQL.' });
    }
});

// 4. ATUALIZAR PRODUTO (Protegido - Exclusivo para Admin)
router.put('/produtos/:id', autenticarToken, requererAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, categoria, imagem, imagens, tecido, dificuldade, acabamento, detalhesTecido, detalhesAcabamento, descricao, medidas } = req.body;

        const pool = getPool();
        const [existente] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
        if (existente.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        await pool.query(`
            UPDATE produtos SET 
                nome = COALESCE(?, nome),
                categoria = COALESCE(?, categoria),
                imagem = COALESCE(?, imagem),
                imagens = COALESCE(?, imagens),
                tecido = COALESCE(?, tecido),
                dificuldade = COALESCE(?, dificuldade),
                acabamento = COALESCE(?, acabamento),
                detalhesTecido = COALESCE(?, detalhesTecido),
                detalhesAcabamento = COALESCE(?, detalhesAcabamento),
                descricao = COALESCE(?, descricao),
                medidas = COALESCE(?, medidas)
            WHERE id = ?
        `, [
            nome,
            categoria,
            imagem,
            imagens ? JSON.stringify(imagens) : null,
            tecido,
            dificuldade,
            acabamento,
            detalhesTecido,
            detalhesAcabamento,
            descricao,
            medidas ? JSON.stringify(medidas) : null,
            id
        ]);

        return res.json({ ok: true, mensagem: `Produto ID ${id} atualizado com sucesso!` });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao atualizar produto.' });
    }
});

// 5. REMOVER PRODUTO (Protegido - Exclusivo para Admin)
router.delete('/produtos/:id', autenticarToken, requererAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getPool();
        const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }
        return res.json({ ok: true, mensagem: `Produto ID ${id} removido com sucesso.` });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao remover produto.' });
    }
});

module.exports = router;
