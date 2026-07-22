# HotFlix — contexto do projeto

Catálogo de filmes estilo Netflix. Monorepo:
- `frontend/` — React 18 + Vite + TypeScript. Porta 5173. Agente responsável: Claude Code.
- `backend/`  — Java 17 + Spring Boot 3 + Maven + PostgreSQL. Porta 8080. Agente responsável: Codex.

## Regras invioláveis
1. `api-contract.md` é IMUTÁVEL. Se achar que precisa mudar, PARE e pergunte ao usuário.
2. Cada agente edita SOMENTE sua pasta. Codex não toca em `frontend/`; Claude não toca em `backend/`.
3. Banco: `docker compose up -d` na raiz sobe o Postgres (db/user/senha: hotflix, porta 5432).
4. Commits pequenos e frequentes, mensagens em inglês, imperativo ("add movie list page").
5. Não commitar `node_modules/`, `target/`, `.env`.
