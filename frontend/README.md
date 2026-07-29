# LABIC Frontend - Portal Institucional e Gestão de Pesquisa (MVP)

Bem-vindo(a) ao repositório oficial do Front-end do Laboratório de Inovação e Criatividade (LABIC).

## Sobre o Projeto

O objetivo desta plataforma é criar uma vitrine digital centralizada para organizar e divulgar o corpo técnico, os projetos e a produção acadêmica do LABIC.

O sistema é composto por duas grandes áreas:

- **Portal Público:** Páginas institucionais (Home, Sobre, Linhas de Pesquisa e Contato) para divulgar a inovação do laboratório.
- **Dashboard de Gestão (Privado):** Painel administrativo protegido por login para gerenciar membros, projetos e artigos. Toda comunicação com o banco de dados passa pela API (ver [backend/README.md](../backend/README.md)).

## Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- [React Router DOM v7](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- CSS Vanilla com sistema de design tokens (`src/styles/variables.css`)

## Pré-requisitos

- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **npm** (incluído com o Node.js)
- **Backend do LABIC rodando** — siga as instruções em [backend/README.md](../backend/README.md) antes de iniciar o frontend

## Como rodar o projeto

### 1. Clone o repositório e acesse a pasta

```bash
git clone <url-do-repositorio>
cd frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz da pasta `frontend/` com o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:8000
```

> O arquivo `.env.example` já contém esse modelo — você pode copiá-lo diretamente:
> ```bash
> cp .env.example .env
> ```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 5. Acesse no navegador

```
http://localhost:5173
```

O servidor recarrega automaticamente a cada alteração nos arquivos (HMR).

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o bundle de produção otimizado na pasta `dist/` |
| `npm run preview` | Serve localmente o build de produção gerado em `dist/` para validação |
| `npm run lint` | Executa o ESLint para verificar erros e padrões de código |

> **Fluxo de produção:** rode `npm run build` e depois `npm run preview` para conferir o comportamento real do bundle antes de fazer o deploy.

---

🚧 **Status do Projeto: Em Desenvolvimento** 🚧

*Projeto desenvolvido para o Desafio Prático do Programa de Formação Acelerada FUTURO Cepedi.*
