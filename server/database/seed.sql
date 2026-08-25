-- ==========================================================
-- SCRIPT DE CARGA INICIAL DE DADOS (SEEDING)
-- PROJETO: ATELIÊ & LINHA
-- ==========================================================

USE `atelie_moda`;

-- 1. Inserir Usuários Padrão (Senhas com Hash bcryptjs)
-- admin@atelie.com (senha: admin123) | usuario@atelie.com (senha: user123)
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `role`) VALUES
(1, 'Administrador Ateliê', 'admin@atelie.com', '$2a$10$tJqQy8eJ1fA00r6vM7zQ..J0m7a.WfA8R6z6M7zQ..J0m7a.WfA8R', 'admin'),
(2, 'Maria Costura', 'usuario@atelie.com', '$2a$10$e7Qy8eJ1fA00r6vM7zQ..J0m7a.WfA8R6z6M7zQ..J0m7a.WfA8R', 'user')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 2. Inserir Catálogo de Produtos e Moldes Fixos (6 Peças)
INSERT INTO `produtos` (`id`, `nome`, `categoria`, `imagem`, `imagens`, `tecido`, `dificuldade`, `acabamento`, `detalhesTecido`, `detalhesAcabamento`, `descricao`, `medidas`) VALUES

(1, 'Vestido Evasê Floral', 'Vestidos', NULL, NULL,
'Algodão', 'Média', 'Zíper Invisível', 'Veludo + Tule transparente', 'Vivo/viés dourado e forro',
'Este vestido possui modelagem sofisticada, saia longa com formas de folhas, drapeados na cintura e acabamento em forro. Ideal para festas, passarelas e eventos formais.',
'[{"tamanho": "P", "busto": "88 cm", "cintura": "68 cm", "quadril": "94 cm"}, {"tamanho": "M", "busto": "92 cm", "cintura": "72 cm", "quadril": "98 cm"}, {"tamanho": "G", "busto": "98 cm", "cintura": "78 cm", "quadril": "104 cm"}]'),

(2, 'Vestido de Festa Longo', 'Vestidos', NULL, NULL,
'Cetim / Seda', 'Alta', 'Com Forro', 'Cetim / Seda pura', 'Forro interno e zíper embutido',
'Este vestido possui modelagem sofisticada, saia longa com fenda, drapeados na cintura e acabamento em forro. Ideal para festas, casamentos e eventos formais.',
'[{"tamanho": "P", "busto": "88 cm", "cintura": "68 cm", "quadril": "94 cm"}, {"tamanho": "M", "busto": "92 cm", "cintura": "72 cm", "quadril": "98 cm"}, {"tamanho": "G", "busto": "98 cm", "cintura": "78 cm", "quadril": "104 cm"}]'),

(3, 'Vestido Casual Midi', 'Vestidos', NULL, NULL,
'Viscose', 'Fácil', 'Lastex nas Costas', 'Linha / Algodão leve', 'Com Forro e Lastex flexível',
'Esse vestido tem um estilo clássico, elegante e romântico, com uma inspiração bem forte em vestidos de verão.',
'[{"tamanho": "P", "busto": "88 cm", "cintura": "68 cm", "quadril": "94 cm"}, {"tamanho": "M", "busto": "92 cm", "cintura": "72 cm", "quadril": "98 cm"}, {"tamanho": "G", "busto": "98 cm", "cintura": "78 cm", "quadril": "104 cm"}]'),

(4, 'Blusa Gola Alta', 'Outras Peças', NULL, NULL,
'Malha', 'Fácil', 'Manga Longa', 'Malha de Algodão / Elastano', 'Gola alta ajustada e punhos',
'A blusa transmite elegância e sofisticação principalmente pela combinação do tecido brilhante, da gola alta e das mangas volumosas.',
'[{"tamanho": "P", "busto": "88 cm", "cintura": "68 cm", "quadril": "94 cm"}, {"tamanho": "M", "busto": "92 cm", "cintura": "72 cm", "quadril": "98 cm"}, {"tamanho": "G", "busto": "98 cm", "cintura": "78 cm", "quadril": "104 cm"}]'),

(5, 'Calça Alfaiataria', 'Outras Peças', NULL, NULL,
'Linho', 'Alta', 'Com Bolsos', 'Linho Rústico Nobre', 'Cós estruturado com Bolsos faca',
'Calça de alfaiataria com corte elegante, vinco frontal bem marcado e bolsos funcionais. Perfeita para composições sofisticadas.',
'[{"tamanho": "P", "busto": "88 cm", "cintura": "68 cm", "quadril": "94 cm"}, {"tamanho": "M", "busto": "92 cm", "cintura": "72 cm", "quadril": "98 cm"}, {"tamanho": "G", "busto": "98 cm", "cintura": "78 cm", "quadril": "104 cm"}]'),

(6, 'Saia Longa Jeans', 'Outras Peças', NULL, NULL,
'Tricoline', 'Fácil', 'Cós Anatômico', 'Jeans / Denim leve', 'Cós Anatômico com fenda frontal',
'Saia longa jeans com modelagem fluida, botões frontais decorativos e cós anatômico que se adapta com perfeição à cintura.',
'[{"tamanho": "P", "busto": "88 cm", "cintura": "68 cm", "quadril": "94 cm"}, {"tamanho": "M", "busto": "92 cm", "cintura": "72 cm", "quadril": "98 cm"}, {"tamanho": "G", "busto": "98 cm", "cintura": "78 cm", "quadril": "104 cm"}]')

ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);
