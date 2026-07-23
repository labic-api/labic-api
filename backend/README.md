# LABIC API - Portal Institucional e Gestão de Pesquisa (MVP)

Bem-vindo(a) ao repositório oficial do Back-end do Laboratório de Inovação e Criatividade (LABIC).

## Sobre o Projeto

O objetivo desta plataforma é criar uma vitrine digital centralizada para organizar e divulgar o corpo técnico, os projetos e a produção acadêmica do LABIC.

Quando o sistema End-to-End estiver concluído, ele contará com:

- **Portal Público:** Páginas institucionais (Home, Sobre, Linhas de Pesquisa e Contato) para divulgar a inovação do laboratório.
- **Dashboard de Gestão (Privado):** Um painel administrativo com sistema de login para gerenciar o cadastro de membros, projetos e submissão de artigos.
- **API RESTful:** O coração do sistema (este repositório!), construído para fornecer o CRUD completo e proteger todos os dados consumidos pelo Front-end.

## Tecnologias Utilizadas

- Python 3.10+
- Django 5+
- Django REST Framework
- djangorestframework-simplejwt
- PostgreSQL
- django-cors-headers
- python-dotenv

## Pré-requisitos

- Python 3.10+
- PostgreSQL 13+
- Git
- pip

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Crie e ative o ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra o `.env` e preencha com os dados do seu banco local.

### 5. Crie o banco de dados no PostgreSQL

```sql
CREATE DATABASE labic_db;
CREATE USER postgres WITH PASSWORD 'suasenha';
GRANT ALL PRIVILEGES ON DATABASE labic_db TO postgres;
```

### 6. Rode as migrations

```bash
python manage.py migrate
```

### 7. Crie o usuário administrador

```bash
python manage.py createsuperuser
```

Use um e-mail e senha fortes pois esse usuário será usado para autenticar na API.

### 8. Inicie o servidor

```bash
python manage.py runserver
```

A API estará disponível em `http://localhost:8000`

## Autenticação

A API usa JWT (JSON Web Token). Para acessar rotas protegidas:

**1. Faça login:**

```
POST /auth/login/
```

```json
{
    "email": "seu@email.com",
    "password": "suasenha"
}
```

**2. Use o token retornado no header das requisições:**

```
Authorization: Bearer seu_access_token_aqui
```

O access token tem validade de 8 horas. Quando expirar, renove sem precisar logar novamente:

```
POST /auth/refresh/
```

```json
{
    "refresh": "seu_refresh_token_aqui"
}
```

## Rotas disponíveis

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/` | Não | Mensagem de boas-vindas |
| POST | `/auth/login/` | Não | Login e geração do token JWT |
| POST | `/auth/refresh/` | Não | Renovação do access token |
| GET | `/pesquisadores/` | Não | Listar pesquisadores |
| POST | `/pesquisadores/` | Sim (admin) | Criar pesquisador |
| GET | `/pesquisadores/<id>/` | Não | Buscar pesquisador por ID |
| PUT | `/pesquisadores/<id>/` | Sim (admin) | Editar pesquisador |
| DELETE | `/pesquisadores/<id>/` | Sim (admin) | Deletar pesquisador |
| GET | `/projetos/` | Não | Listar projetos |
| POST | `/projetos/` | Sim (admin) | Criar projeto |
| GET | `/projetos/<id>/` | Não | Buscar projeto por ID |
| PUT | `/projetos/<id>/` | Sim (admin) | Editar projeto |
| DELETE | `/projetos/<id>/` | Sim (admin) | Deletar projeto |
| GET | `/artigos/` | Não | Listar artigos |
| POST | `/artigos/` | Sim (admin) | Criar artigo |
| GET | `/artigos/<id>/` | Não | Buscar artigo por ID |
| PUT | `/artigos/<id>/` | Sim (admin) | Editar artigo |
| DELETE | `/artigos/<id>/` | Sim (admin) | Deletar artigo |

## Formato dos Dados (JSON) para criação e edição (POST / PUT)

Para facilitar a integração do Front-end, abaixo estão os formatos esperados no corpo (`body`) das requisições. 

> **Atenção sobre as rotas PUT:** A API está configurada para atualização parcial (`partial=True`). Isso significa que, na edição, você não precisa enviar o objeto inteiro, basta enviar **apenas** os campos que deseja alterar.

### 1. Pesquisadores (`/pesquisadores/`)
**POST (Criação):**
```json
{
  "name": "João da Silva",        // Obrigatório
  "email": "joao@email.com",      // Obrigatório e único
  "password": "senha123",         // Opcional (Padrão: "Labic@2026!")
  "area": "Inteligência Artificial", // Opcional
  "link": "http://lattes.cnpq.br/12345", // Opcional (URL do lattes)
  "bio": "Pesquisador sênior...", // Opcional
  "nivel_acesso": "membro"        // Opcional ("membro", "coordenador", "admin")
}
```
**PUT (Edição):** 
```json
{
  "name": "João da Silva Atualizado",
  "email": "joao_novo@email.com",
  "area": "Nova Área",
  "link": "http://lattes.cnpq.br/00000",
  "bio": "Nova bio atualizada..."
}
```

### 2. Projetos (`/projetos/`)
**POST / PUT:**
```json
{
  "title": "Nome do Projeto",    // Obrigatório no POST
  "status": "Em Planejamento",   // Opcional ("Em Planejamento", "Ativo", "Em Execução", "Concluído", "Pausado")
  "startDate": "2026-07-23",     // Opcional (AAAA-MM-DD ou "")
  "endDate": "2027-07-23"        // Opcional (AAAA-MM-DD ou "")
}
```

### 3. Artigos (`/artigos/`)
**POST / PUT:**
```json
{
  "title": "Título do Artigo",   // Obrigatório no POST
  "authors": "A. Silva, B. Costa", // Opcional
  "status": "Ativo",             // Opcional ("Ativo", "Em Execução", "Concluído")
  "relatedArea": "Redes Neurais" // Opcional
}
```

---

🚧 **Status do Projeto: Em Desenvolvimento** 🚧

*Projeto desenvolvido para o Desafio Prático do Programa de Formação Acelerada FUTURO Cepedi.*
