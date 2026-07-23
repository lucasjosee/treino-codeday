# Gabarito — Defeitos do Frontend (HotFlix Code Day)

> Arquivo fora do repositório. Não deve ser visto pelos participantes antes do treino.
> Branch: `worktree-frontend`. Todos os caminhos são relativos a `frontend/`.
> O app **compila** (`npm run build`) e **sobe** (`npm run dev`); a suíte de testes
> continua **verde** (15/15) — nenhum defeito é denunciado por teste existente.
> Os defeitos fullstack (#4 e #5) só se manifestam contra o **backend real**
> (`VITE_USE_MOCK` ausente/`false`); no modo mock eles ficam inertes.

Total: 5 defeitos = 3 próprios do frontend (#6 easy, #7 medium, #8 hard) +
2 metades frontend de issues fullstack (#4 medium, #5 hard).

---

## Issue #6 — easy — "Contador de filmes na Home mostra número menor que o total"

- **Commit:** `7a27d0e` "simplify home movie counter"
- **Arquivo/linha:** `src/pages/HomePage.tsx:98` (e remoção do estado `totalElements`
  nas linhas onde antes ficava `const [totalElements, setTotalElements] = useState(0)`
  e `setTotalElements(result.totalElements)`).
- **O que mudou:** o cabeçalho passou a exibir `movies.length` no lugar de
  `totalElements`. O estado `totalElements` (que guardava o total do `Page` do
  backend) foi removido junto.
  - Antes: `{totalElements} {totalElements === 1 ? 'filme' : 'filmes'}`
  - Depois: `{movies.length} {movies.length === 1 ? 'filme' : 'filmes'}`
- **Por que causa o sintoma:** `movies` contém apenas a página atual (no máximo
  `PAGE_SIZE = 12` itens). Logo o contador nunca ultrapassa o tamanho de uma
  página, mesmo com dezenas de filmes no catálogo. `totalElements` vinha do
  `Page.totalElements` do backend e refletia o total real.
- **Correção esperada:** voltar a exibir o total vindo do backend. Restaurar o
  estado `totalElements`, atribuí-lo no `.then` (`setTotalElements(result.totalElements)`)
  e usá-lo no contador. (Alternativa: derivar de `result.totalElements` guardado.)

---

## Issue #7 — medium — "Não é possível enviar review com nota 10"

- **Commit:** `aeeba54` "tighten review rating validation"
- **Arquivo/linha:** `src/components/ReviewForm.tsx:36` (função `validate`).
- **O que mudou:** o limite superior da nota foi de `> 10` para `>= 10`.
  - Antes: `numericRating > 10`
  - Depois: `numericRating >= 10`
- **Por que causa o sintoma:** com `>= 10`, a nota exatamente igual a 10 cai na
  condição de erro e a validação de cliente bloqueia o envio, exibindo
  "A nota deve ser um inteiro de 1 a 10." (mensagem que contradiz o próprio bug).
  Notas de 1 a 9 passam; só o valor máximo (10) é recusado. O contrato aceita
  1..10 inclusive, então o backend aceitaria 10 — o bloqueio é puramente no cliente.
- **Correção esperada:** trocar `numericRating >= 10` de volta por `numericRating > 10`
  (faixa válida 1..10 inclusive).

---

## Issue #8 — hard — "Busca por título não filtra os filmes"

- **Commit:** `30f857b` "streamline debounce effect"
- **Arquivo/linha:** `src/hooks/useDebounce.ts:10` (array de dependências do `useEffect`).
- **O que mudou:** removida a dependência `value` do efeito.
  - Antes: `}, [value, delayMs])`
  - Depois: `}, [delayMs])`
- **Por que causa o sintoma:** o efeito roda uma vez na montagem, captura o
  `value` inicial (string vazia) num closure e agenda `setDebounced('')`. Como
  `delayMs` é constante, o efeito **nunca re-executa** quando `value` muda — o
  closure fica preso ao valor inicial e `debounced` nunca é atualizado. O
  `HomePage` sempre consulta a API com `search=''`, então digitar no campo não
  filtra nada. O filtro de gênero funciona porque usa o estado `genre`
  diretamente (não passa pelo debounce). É um clássico de dependência de
  `useEffect` faltando / stale closure — o código "parece" correto.
- **Correção esperada:** incluir `value` de volta nas dependências:
  `}, [value, delayMs])`.

---

## Issue #4 — medium (FULLSTACK) — "Favoritar um filme parece funcionar, mas some após recarregar"

Defeito nas duas camadas. **Só reproduz contra o backend real.**

### Metade FRONTEND (minha)
- **Commit:** `83277f1` "confirm favorite writes to the server"
- **Arquivo/linha:** `src/components/FavoriteButton.tsx:34-35` (função `toggle`).
- **O que mudou:** ao favoritar, o POST é enviado **duas vezes**.
  - Antes: um único `await api.addFavorite(movieId)`
  - Depois:
    ```
    await api.addFavorite(movieId)
    await api.addFavorite(movieId)   // "confirmação"
    ```
  (Desfavoritar continua com um único `DELETE`.)
- **Por que era invisível antes:** o backend original fazia `insertIfAbsent`
  (idempotente) — dois POSTs favoritavam do mesmo jeito. O defeito ficou latente.

### Metade BACKEND (do agente Codex, para referência)
- **Commit:** `d4ae5a9` "consolidate favorite updates"
- **Arquivo:** `backend/.../service/FavoriteService.java` — `addFavorite` virou um
  **toggle**: `if (deleteByMovieId(movieId) == 0) insertIfAbsent(movieId);`
  (se já era favorito, remove; senão, insere).

### Por que causa o sintoma (as duas juntas)
Com o backend agora em modo toggle, os **dois** POSTs de um único clique se
cancelam: 1º POST insere (favorita) → 2º POST remove (desfavorita). O resultado
final no banco é **não favoritado**, mas a UI já fez o update otimista
(`onChange(next)`) e mostra o coração cheio na sessão. Ao recarregar,
`GET /movies` e `GET /favorites` não trazem o filme → coração vazio, some de
"Meus favoritos". Nenhum erro aparece porque ambos os POSTs retornam 201.
(Cada camada isolada é "inofensiva": só o POST duplicado + só o toggle já
funcionariam; é a combinação que quebra.)

### Correção esperada
- Frontend: remover o POST duplicado (um único `api.addFavorite`).
- Backend: `addFavorite` deve ser idempotente (apenas `insertIfAbsent`), não um toggle.
- Corrigir **qualquer um** dos lados já resolve o sintoma; o certo é corrigir os dois.

---

## Issue #5 — hard (FULLSTACK) — "Catálogo avança páginas sozinho após o carregamento"

Defeito nas duas camadas. **Só reproduz contra o backend real com mais de uma página.**

### Metade FRONTEND (minha)
- **Commit:** `704374f` "follow server pagination metadata"
- **Arquivo/linha:** `src/pages/HomePage.tsx:62-64` (handler `.then` do fetch de filmes).
- **O que mudou:** o `page` local passou a ser sincronizado com o campo `number`
  reportado pelo servidor:
  ```
  if (result.number !== page && result.number < result.totalPages) {
    setPage(result.number)
  }
  ```
- **Por que era invisível antes / com mock:** quando o servidor devolve o
  `number` correto (igual à página pedida), `result.number === page` e o `setPage`
  nunca dispara. No modo mock o `number` é sempre igual ao pedido → inerte.

### Metade BACKEND (do agente Codex, para referência)
- **Commit:** `9282bc8` "align page response numbering"
- **Arquivo:** `backend/.../dto/PageResponse.java` — `number` passou a ser
  `page.getTotalPages() > 1 ? page.getNumber() + 1 : page.getNumber()`
  (off-by-one: reporta `página + 1` quando há mais de uma página).

### Por que causa o sintoma (as duas juntas)
No load da página 0 (com 30 filmes → 3 páginas), o backend responde `number = 1`.
O frontend confia nesse número e faz `setPage(1)` → refetch → backend responde
`number = 2` → `setPage(2)` → refetch → `number = 3`; aí `3 < totalPages(3)` é
falso e o loop para, deixando o catálogo na **última página** sem o usuário ter
tocado em nada. O indicador e os filmes "avançam sozinhos". Quando o resultado
cabe em uma única página (`totalPages <= 1`), o backend não soma 1 e nada avança
— por isso o problema some com poucos resultados.

### Correção esperada
- Frontend: não sobrescrever a página escolhida pelo usuário com o `number` do
  servidor — remover o bloco `setPage(result.number)` do `.then`.
- Backend: `PageResponse.from` deve devolver `page.getNumber()` (sem o `+ 1`).
- Corrigir qualquer um dos lados interrompe o auto-avanço; o correto é os dois.

---

## Resumo dos commits (branch `worktree-frontend`)

| Issue | Nível | Commit | Arquivo | Linha(s) |
|-------|-------|--------|---------|----------|
| #6 | easy | `7a27d0e` | `src/pages/HomePage.tsx` | 98 (+ remoção de `totalElements`) |
| #7 | medium | `aeeba54` | `src/components/ReviewForm.tsx` | 36 |
| #8 | hard | `30f857b` | `src/hooks/useDebounce.ts` | 10 |
| #4 | medium (fullstack) | `83277f1` | `src/components/FavoriteButton.tsx` | 34-35 |
| #5 | hard (fullstack) | `704374f` | `src/pages/HomePage.tsx` | 62-64 |

Backend (referência): #4 → `d4ae5a9` (`FavoriteService.java`), #5 → `9282bc8` (`PageResponse.java`).
