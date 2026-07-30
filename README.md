# Projeto LABIC - Sistema de Gestão de Pesquisadores e Projetos

Este repositório contém o código-fonte do sistema LABIC, dividido em duas partes principais:
- **Backend**: API REST desenvolvida em Python com Django REST Framework e banco de dados PostgreSQL.
- **Frontend**: Interface de usuário (Dashboard) desenvolvida em React, Vite e Tailwind CSS.

## 🚀 Como executar o projeto localmente

Siga o passo a passo abaixo para rodar o projeto do zero na sua máquina.

### 1. Clonar o repositório
```bash
git clone https://github.com/labic-api/labic-api.git
cd labic-api
```

---

### 2. Configurar o Backend (API)

```bash
# Entre na pasta do backend
cd backend

# Crie o ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No Linux/macOS:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Copie o arquivo .env.example para um novo arquivo chamado .env
cp .env.example .env
```

**ATENÇÃO:** Edite o arquivo `.env` recém-criado com as credenciais reais do seu banco de dados PostgreSQL:
- `SECRET_KEY=sua-chave-secreta`
- `DEBUG=True`
- `DB_NAME=seu_banco`
- `DB_USER=seu_usuario`
- `DB_PASS=sua_senha`
- `DB_HOST=localhost` (ou o link do Supabase)
- `DB_PORT=5432`

```bash
# Crie as tabelas no banco de dados
python manage.py migrate

# Crie um usuário administrador
python manage.py createsuperuser

# Inicie o servidor do backend
python manage.py runserver
```
O backend estará rodando em: `http://localhost:8000`

---

### 3. Configurar o Frontend (Dashboard)

Abra **um novo terminal** (mantenha o terminal do backend rodando) e execute:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências do Node.js
npm install

# Inicie o servidor do frontend
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

---

### 4. Acessar o Sistema
1. Abra o navegador e acesse `http://localhost:5173`.
2. Navegue pelo site institucional.
3. Para acessar o Dashboard restrito, clique em "Entrar" e faça o login com o e-mail e senha do usuário administrador que você criou no passo 2.

## ☁️ Informações de Produção
O projeto está pronto para a nuvem!
- **Frontend:** Preparado para deploy na Vercel (incluindo o arquivo `vercel.json` para roteamento de SPA). Variável necessária: `VITE_API_URL`.
- **Backend:** Preparado para deploy no Render (incluindo `Procfile`, `gunicorn` e `whitenoise`).
- **Banco de Dados:** Preparado para PostgreSQL remoto (ex: Supabase).
