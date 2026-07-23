# Gabarito privado — HotFlix Backend / FASE 3

Este arquivo fica fora do repositório. A branch contém cinco alterações deliberadas, uma por commit.

## Issue #1 — Criar uma review retorna 200 em vez de 201

- Dificuldade/escopo: `backend`, `easy`
- Commit: `18e6ce6 adjust review response handling`
- Arquivo: `backend/src/main/java/com/hotflix/controller/ReviewController.java`
- Trecho alterado:

```java
@PostMapping
@ResponseStatus(HttpStatus.OK)
public ReviewResponse createReview(...)
```

- Por que causa o sintoma: a criação e o corpo continuam corretos, mas a anotação força HTTP 200, contrariando o HTTP 201 do contrato.
- Correção esperada: restaurar `@ResponseStatus(HttpStatus.CREATED)` e, idealmente, cobrir o POST no web layer verificando status e corpo.

## Issue #2 — Busca combinada com gênero retorna filmes de outros gêneros

- Dificuldade/escopo: `backend`, `medium`
- Commit: `eb250fb refine movie filter parameters`
- Arquivo: `backend/src/main/java/com/hotflix/service/MovieService.java`
- Trecho alterado:

```java
String normalizedSearch = normalize(search);
String normalizedGenre = normalizedSearch.isBlank() ? normalize(genre) : "";
return movieRepository.findSummaries(normalizedSearch, normalizedGenre, pageable);
```

- Por que causa o sintoma: quando `search` tem conteúdo, o gênero enviado ao repositório é sempre vazio. A query interpreta gênero vazio como ausência do filtro, portanto a busca por título retorna itens de qualquer gênero.
- Correção esperada: normalizar os parâmetros de forma independente:

```java
return movieRepository.findSummaries(normalize(search), normalize(genre), pageable);
```

Adicionar cobertura para `search` e `genre` usados simultaneamente.

## Issue #3 — Detalhe de filme sem avaliações retorna erro 500

- Dificuldade/escopo: `backend`, `hard`
- Commit: `965b9b9 normalize movie detail ratings`
- Arquivo: `backend/src/main/java/com/hotflix/dto/MovieDetail.java`
- Trecho alterado:

```java
public MovieDetail {
    avgRating = Math.round(avgRating * 10.0) / 10.0;
}
```

- Por que causa o sintoma: `AVG` retorna `null` para um filme sem reviews. A expressão aritmética faz unboxing de `Double`; com `null`, a construção do DTO lança `NullPointerException`, que chega ao cliente como 500.
- Correção esperada: preservar `null` e arredondar somente quando houver média, ou remover a normalização:

```java
public MovieDetail {
    if (avgRating != null) {
        avgRating = Math.round(avgRating * 10.0) / 10.0;
    }
}
```

Adicionar um teste com `avgRating == null` e `reviewCount == 0`.

## Issue #4 — Favoritar um filme parece funcionar, mas some após recarregar

- Dificuldade/escopo: `fullstack`, `medium`
- Commit backend: `d4ae5a9 consolidate favorite updates`
- Arquivo backend: `backend/src/main/java/com/hotflix/service/FavoriteService.java`
- Trecho alterado:

```java
if (favoriteRepository.deleteByMovieId(movieId) == 0) {
    favoriteRepository.insertIfAbsent(movieId);
}
```

- Por que causa o sintoma: o POST deixou de ser idempotente e virou alternância. A primeira chamada inclui o favorito; a segunda remove. Com uma chamada, a metade backend parece normal.
- Metade frontend esperada: em `frontend/src/components/FavoriteButton.tsx` (ou no cliente real), fazer uma única ação do usuário disparar duas chamadas `POST /api/favorites/{movieId}` — por exemplo, uma chamada no handler e outra no callback compartilhado. Com o backend correto, a duplicidade seria absorvida pela idempotência; combinada com esta metade backend, a segunda chamada desfaz a primeira enquanto o estado otimista mantém o coração preenchido até o reload.
- Correção esperada: backend deve chamar somente `insertIfAbsent(movieId)` no POST; frontend deve emitir uma única requisição por clique.

## Issue #5 — Catálogo avança páginas sozinho após o carregamento

- Dificuldade/escopo: `fullstack`, `hard`
- Commit backend: `9282bc8 align page response numbering`
- Arquivo backend: `backend/src/main/java/com/hotflix/dto/PageResponse.java`
- Trecho alterado:

```java
page.getTotalPages() > 1 ? page.getNumber() + 1 : page.getNumber()
```

- Por que causa o sintoma: em resultados multipágina, o campo `number` passa a ser baseado em 1 embora o contrato e a requisição sejam baseados em 0. O frontend atual não usa esse campo para atualizar o estado, então a metade backend isolada não produz o avanço automático.
- Metade frontend esperada: em `frontend/src/pages/HomePage.tsx`, sincronizar o estado após cada resposta com `setPage(result.number)`. Com o backend correto isso apenas mantém o mesmo índice; combinado com a resposta incrementada, cada carregamento agenda a página seguinte e provoca novas buscas até o fim.
- Correção esperada: backend deve sempre serializar `page.getNumber()`; no frontend, manter a página controlada pela ação do usuário ou sincronizar apenas com um valor zero-based válido sem disparar avanço recursivo.
