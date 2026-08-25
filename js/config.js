// CONFIGURAÇÃO DO ESTÚDIO DE MODA, OPENAI E BACKEND API
const CONFIG = {
    // URL Base da API Express/MySQL (Dinâmica para Localhost e Vercel)
    API_BASE_URL: (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
        ? "http://localhost:3000/api"
        : "/api",

    // Sua chave de API da OpenAI
    OPENAI_API_KEY: "",

    // Modelo padrão ativado para geração de imagem
    DEFAULT_MODEL: "gpt-image-1.5"
};
