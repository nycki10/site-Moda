// HELPER DE AUTENTICAÇÃO, API & ROLES (USER, PREMIUM, ADMIN)

const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) ? CONFIG.API_BASE_URL : "http://localhost:3000/api";

function obterUsuarioLogado() {
    try {
        const data = localStorage.getItem('usuario_logado');
        return data ? JSON.parse(data) : null;
    } catch(e) {
        return null;
    }
}

function obterTokenLogado() {
    return localStorage.getItem('auth_token') || '';
}

function salvarUsuarioLogado(usuario, token = null) {
    if (!usuario.role) {
        usuario.role = 'user';
    }
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));
    if (token) {
        localStorage.setItem('auth_token', token);
    }
}

function fazerLogout() {
    localStorage.removeItem('usuario_logado');
    localStorage.removeItem('auth_token');
    window.location.reload();
}

// Obter cabeçalhos HTTP com token de autenticação JWT e fallback para testes de role
function obterHeadersAuth() {
    const headers = { 'Content-Type': 'application/json' };
    const token = obterTokenLogado();
    const usuario = obterUsuarioLogado();

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (usuario && usuario.role) {
        headers['x-user-role'] = usuario.role;
    }
    return headers;
}

// Alternar role para testes locais no navegador
function alternarRoleParaTestes(novaRole) {
    const u = obterUsuarioLogado() || { nome: novaRole === 'admin' ? 'Administrador' : 'Usuário Teste', email: `${novaRole}@atelie.com` };
    u.role = novaRole;
    salvarUsuarioLogado(u);
    window.location.reload();
}

// LOGIN VIA API EXPRESS/MYSQL COM FALLBACK LOCAL
async function realizarLoginAPI(email, senha) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        if (response.ok) {
            const data = await response.json();
            const usuarioObj = data.usuario || { nome: email.split('@')[0], email, role: data.role || 'user' };
            salvarUsuarioLogado(usuarioObj, data.token);
            return { ok: true, user: usuarioObj };
        } else {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.mensagem || 'Falha no login');
        }
    } catch (error) {
        console.warn('Servidor API não alcançado ou erro no login. Usando modo local:', error.message);
        // Fallback local caso o servidor Express ainda esteja sendo iniciado
        const roleDefinida = email.includes('admin') ? 'admin' : 'user';
        const nome = email.split('@')[0];
        const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1);
        const usuarioLocal = { nome: nomeFormatado, email: email, role: roleDefinida };
        salvarUsuarioLogado(usuarioLocal);
        return { ok: true, user: usuarioLocal, fallback: true };
    }
}

// CADASTRO VIA API EXPRESS/MYSQL COM FALLBACK LOCAL
async function realizarCadastroAPI(nome, email, senha) {
    try {
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, role: 'user' })
        });
        
        if (response.ok) {
            const data = await response.json();
            const usuarioObj = data.usuario || { nome, email, role: 'user' };
            salvarUsuarioLogado(usuarioObj, data.token);
            return { ok: true, user: usuarioObj };
        } else {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.mensagem || 'Falha no cadastro');
        }
    } catch (error) {
        console.warn('Servidor API não alcançado. Usando modo de cadastro local:', error.message);
        const usuarioLocal = { nome: nome || 'Costureira', email: email, role: 'user' };
        salvarUsuarioLogado(usuarioLocal);
        return { ok: true, user: usuarioLocal, fallback: true };
    }
}

// RENDERIZA A BARRA DE NAVEGAÇÃO GLOBAL
function renderizarNavGlobal(pathPrefix = '') {
    const navEl = document.getElementById('nav-global');
    if (!navEl) return;

    const usuario = obterUsuarioLogado();

    let areaUsuarioHTML = '';
    if (usuario) {
        const role = (usuario.role || 'user').toLowerCase();
        let badgeHTML = '';
        let acoesAdminHTML = '';

        if (role === 'admin') {
            badgeHTML = `<span class="badge-role role-admin" title="Administrador">🛡️ ADMIN</span>`;
            acoesAdminHTML = `<button onclick="abrirModalNovoProduto()" class="btn-novo-molde-nav">➕ Novo Molde</button>`;
        } else if (role === 'premium') {
            badgeHTML = `<span class="badge-role role-premium" title="Usuário Premium">👑 PREMIUM</span>`;
        } else {
            badgeHTML = `<span class="badge-role role-user" title="Usuário Padrão">USER</span>`;
        }

        areaUsuarioHTML = `
            <div class="user-menu">
                <span class="user-name">👤 ${usuario.nome} ${badgeHTML}</span>
                ${acoesAdminHTML}
                <div class="dropdown-roles" title="Clique para testar roles">
                    <select onchange="alternarRoleParaTestes(this.value)" class="select-role-teste">
                        <option value="user" ${role === 'user' ? 'selected' : ''}>Role: User</option>
                        <option value="premium" ${role === 'premium' ? 'selected' : ''}>Role: Premium</option>
                        <option value="admin" ${role === 'admin' ? 'selected' : ''}>Role: Admin</option>
                    </select>
                </div>
                <button onclick="fazerLogout()" class="btn-logout" title="Sair da Conta">Sair</button>
            </div>
        `;
    } else {
        areaUsuarioHTML = `
            <a href="${pathPrefix}pages/login.html" class="btn-nav-login">
                👤 Entrar / Cadastrar
            </a>
        `;
    }

    navEl.innerHTML = `
        <div class="nav-container">
            <a href="${pathPrefix}index.html" class="nav-logo">
                🧵 <span>Ateliê & Linha</span>
            </a>
            
            <div class="nav-links">
                <a href="${pathPrefix}index.html" class="nav-link">🏠 Catálogo</a>
                <a href="${pathPrefix}pages/molde.html" class="nav-link">✂️ Estúdio de IA</a>
                ${areaUsuarioHTML}
            </div>
        </div>
    `;
}

