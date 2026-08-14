// BASE DE DADOS CENTRAL DE PRODUTOS E MOLDES
const PRODUTOS = [
    {
        id: 1,
        nome: "Vestido Evasê Floral",
        categoria: "Vestidos",
        imagem: "https://i.pinimg.com/736x/bc/61/ff/bc61ff7ecf46c82d25eab5fcf1369aa2.jpg",
        tecido: "Algodão",
        dificuldade: "Média",
        acabamento: "Zíper Invisível",
        detalhesTecido: "Veludo + Tule transparente",
        detalhesAcabamento: "Vivo/viés dourado e forro",
        descricao: "Este vestido possui modelagem sofisticada, saia longa com formas de folhas, drapeados na cintura e acabamento em forro. Ideal para festas, passarelas e eventos formais.",
        medidas: [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ]
    },
    {
        id: 2,
        nome: "Vestido de Festa Longo",
        categoria: "Vestidos",
        imagem: "https://i.pinimg.com/1200x/18/fa/55/18fa55ae01b7ea8a26e3580142100361.jpg",
        tecido: "Cetim / Seda",
        dificuldade: "Alta",
        acabamento: "Com Forro",
        detalhesTecido: "Cetim / Seda pura",
        detalhesAcabamento: "Forro interno e zíper embutido",
        descricao: "Este vestido possui modelagem sofisticada, saia longa com fenda, drapeados na cintura e acabamento em forro. Ideal para festas, casamentos e eventos formais.",
        medidas: [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ]
    },
    {
        id: 3,
        nome: "Vestido Casual Midi",
        categoria: "Vestidos",
        imagem: "https://i.pinimg.com/736x/2f/76/ab/2f76ab356407430b0e4c78ad18c03345.jpg",
        tecido: "Viscose",
        dificuldade: "Fácil",
        acabamento: "Lastex nas Costas",
        detalhesTecido: "Linha / Algodão leve",
        detalhesAcabamento: "Com Forro e Lastex flexível",
        descricao: "Esse vestido tem um estilo clássico, elegante e romântico, com uma inspiração bem forte em vestidos de verão.",
        medidas: [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ]
    },
    {
        id: 4,
        nome: "Blusa Gola Alta",
        categoria: "Outras Peças",
        imagem: "https://i.pinimg.com/1200x/e3/f7/b1/e3f7b178ac74846002982e3bfb8bd6e0.jpg",
        tecido: "Malha",
        dificuldade: "Fácil",
        acabamento: "Manga Longa",
        detalhesTecido: "Malha de Algodão / Elastano",
        detalhesAcabamento: "Gola alta ajustada e punhos",
        descricao: "A blusa transmite elegância e sofisticação principalmente pela combinação do tecido brilhante, da gola alta e das mangas volumosas. O visual lembra a moda clássica e vintage, mas com um toque moderno.",
        medidas: [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ]
    },
    {
        id: 5,
        nome: "Calça Alfaiataria",
        categoria: "Outras Peças",
        imagem: "https://i.pinimg.com/736x/4a/91/cb/4a91cbb24acd4619fb7edf6c7b3ec20a.jpg",
        tecido: "Linho",
        dificuldade: "Alta",
        acabamento: "Com Bolsos",
        detalhesTecido: "Linho Rústico Nobre",
        detalhesAcabamento: "Cós estruturado com Bolsos faca",
        descricao: "Calça de alfaiataria com corte elegante, vinco frontal bem marcado e bolsos funcionais. Perfeita para composições sofisticadas e versáteis de ateliê.",
        medidas: [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ]
    },
    {
        id: 6,
        nome: "Saia Longa Jeans",
        categoria: "Outras Peças",
        imagem: "https://i.pinimg.com/736x/3e/9d/a3/3e9da360e240bd4b73a890004c1271f8.jpg",
        tecido: "Tricoline",
        dificuldade: "Fácil",
        acabamento: "Cós Anatômico",
        detalhesTecido: "Jeans / Denim leve",
        detalhesAcabamento: "Cós Anatômico com fenda frontal",
        descricao: "Saia longa jeans com modelagem fluida, botões frontais decorativos e cós anatômico que se adapta com perfeição à cintura.",
        medidas: [
            { tamanho: "P", busto: "88 cm", cintura: "68 cm", quadril: "94 cm" },
            { tamanho: "M", busto: "92 cm", cintura: "72 cm", quadril: "98 cm" },
            { tamanho: "G", busto: "98 cm", cintura: "78 cm", quadril: "104 cm" }
        ]
    }
];

// CARREGAR PRODUTOS DA API EXPRESS/MYSQL COM FALLBACK
async function carregarProdutosAPI() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) ? CONFIG.API_BASE_URL : "http://localhost:3000/api";
    try {
        const res = await fetch(`${apiUrl}/produtos`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch(e) {
        console.warn('API MySQL de produtos indisponível. Utilizando catálogo local.', e.message);
    }
    return PRODUTOS;
}

// CADASTRAR NOVO PRODUTO VIA API (ADMIN)
async function cadastrarProdutoAPI(novoProduto) {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) ? CONFIG.API_BASE_URL : "http://localhost:3000/api";
    
    // Atribuir ID único local
    novoProduto.id = novoProduto.id || (PRODUTOS.length ? Math.max(...PRODUTOS.map(p => p.id)) + 1 : 1);
    
    try {
        const res = await fetch(`${apiUrl}/produtos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });
        if (res.ok) {
            const itemCriado = await res.json();
            const prodFinal = itemCriado.produto || novoProduto;
            PRODUTOS.push(prodFinal);
            return prodFinal;
        }
    } catch(e) {
        console.warn('Salvando novo produto localmente no catálogo:', e.message);
    }

    PRODUTOS.push(novoProduto);
    return novoProduto;
}
