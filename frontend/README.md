# HotFlix — Frontend

Catálogo de filmes estilo streaming. React 18 + Vite + TypeScript, estilizado
com CSS puro. Consome a API descrita em [`../api-contract.md`](../api-contract.md).

## Rodando

```bash
npm install
cp .env.example .env   # configure as variáveis (veja abaixo)
npm run dev            # http://localhost:5173
```

Por padrão o app funciona **em modo mock** (`.env.example` já traz
`VITE_USE_MOCK=true`), com ~15 filmes em memória e todos os endpoints do
contrato implementados. Assim dá para validar toda a UI sem o backend no ar.
Para consumir a API real, defina `VITE_USE_MOCK=false` (ou deixe vazio) e suba
o backend em `http://localhost:8080`.

## Variáveis de ambiente

| Variável        | Padrão                      | Descrição                                                                   |
| --------------- | --------------------------- | --------------------------------------------------------------------------- |
| `VITE_API_URL`  | `http://localhost:8080/api` | URL base da API real (usada quando o mock está desligado).                  |
| `VITE_USE_MOCK` | —                           | `true` usa o backend mock em memória; qualquer outro valor usa a API real. |

## Scripts

| Script               | O que faz                                             |
| -------------------- | ----------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento (Vite) na porta 5173.     |
| `npm run build`      | Type-check (`tsc -b`) + build de produção em `dist/`. |
| `npm run preview`    | Serve o build de produção localmente.                 |
| `npm run test`       | Testes (Vitest) uma única vez.                        |
| `npm run test:watch` | Testes em modo watch.                                 |
| `npm run lint`       | Lint com oxlint.                                       |

## Estrutura

```
src/
  api/          Cliente axios, mock em memória, tipos do contrato e normalização de erros
    client.ts   Implementação real (axios) de todos os endpoints
    mock.ts     Backend fake em memória (paginação, filtros, favoritos, reviews)
    types.ts    Tipos do contrato (MovieSummary, MovieDetail, Review, Page…)
    errors.ts   Normaliza erros de axios e do mock num formato único
    index.ts    Seleciona mock ou API real via VITE_USE_MOCK
  components/    MovieCard, MovieGrid, Pagination, SearchBar, FavoriteButton,
                 ReviewForm, ReviewList, NavBar, Spinner, StateMessage, RatingBadge
  hooks/         useDebounce
  pages/         HomePage, MovieDetailPage, FavoritesPage, NotFoundPage
  lib/           posterFallback (imagem de fallback para pôsteres)
```

## Páginas

- **`/`** — grid paginado (12/página) com busca por título (debounce ~400ms) e
  filtro por gênero, combináveis. Favoritar direto no card.
- **`/movies/:id`** — detalhe do filme, lista de reviews e formulário de review
  com validação no cliente + exibição dos erros 400 da API.
- **`/favorites`** — grid de favoritos com remoção e estado vazio amigável.
- **`*`** — página "não encontrado".

Todas as páginas tratam loading (skeleton/spinner), erro de rede (mensagem com
"tentar novamente") e 404.

## Testes

Vitest + Testing Library. Cobrem lógica de paginação, validação/submit do
formulário de review, o backend mock (paginação/filtros/validação) e a
renderização da Home.
