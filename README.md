# 🧵 Ateliê & Linha • Catálogo & Estúdio de IA

Plataforma digital desenvolvida para costureiras, modelistas, estilistas e entusiastas da moda. O sistema combina catálogo de moldes com fichas técnicas, um estúdio de modelagem vetorial (croqui 2D em tempo real), geração de ilustrações por IA (OpenAI) e uma API RESTful em Node.js com MySQL e controle de permissões (RBAC).

---

## 📌 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* **Node.js** (versão 18 ou superior)
* **MySQL Server** (versão 8.0+, XAMPP, WampServer, Laragon ou Docker) na porta `3306`

---

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório e Instalar Dependências

No seu terminal, navegue até a pasta da API e instale as dependências:

```bash
cd server
npm install
```

---

### 2. Configurar o Banco de Dados MySQL e Credenciais

Verifique se o arquivo `server/.env` está configurado com as credenciais do seu MySQL local:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=atelie_moda
JWT_SECRET=atelie_linha_jwt_secret_key_2026_secure
```

> **Nota**: Ajuste `DB_USER` e `DB_PASS` caso seu MySQL utilize outras credenciais.

---

### 3. Rodar o Banco de Dados e a Carga Inicial (Seed)

Para criar o banco `atelie_moda`, gerar as tabelas e cadastrar os **6 produtos/moldes iniciais** (incluindo a Saia Longa Jeans) e os usuários padrão, execute na pasta `server`:

```bash
npm run db:init
```

*(Opcional: Você também pode importar os arquivos [`server/database/schema.sql`](file:///c:/Users/eduar/projetos/site-Moda/server/database/schema.sql) e [`server/database/seed.sql`](file:///c:/Users/eduar/projetos/site-Moda/server/database/seed.sql) diretamente no MySQL Workbench).*

---

### 4. Executar o Backend (Servidor API)

Ainda na pasta `server`, inicie o servidor:

```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000/api`

---

### 5. Abrir o Front-end

Abra o arquivo `index.html` no seu navegador favorito ou utilizando uma extensão como *Live Server* no VS Code.

---

## 🔑 Credenciais Padrão para Teste

| Perfil | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@atelie.com` | `admin123` | Visualizar catálogo + **Cadastrar novos moldes** |
| **Usuário Padrão** | `usuario@atelie.com` | `user123` | **Apenas visualização do catálogo** |

---

## 📍 Principais Endpoints da API

* `GET /api/status` - Verifica se o servidor e o banco estão online.
* `POST /api/login` - Realiza autenticação e retorna Token JWT.
* `POST /api/cadastrar` - Cadastro de novos usuários.
* `GET /api/produtos` - Lista pública de todos os moldes do catálogo.
* `POST /api/produtos` - Rota protegida por JWT (Apenas Admin pode cadastrar novos moldes).
