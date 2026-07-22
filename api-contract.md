# Contrato da API — HotFlix

Base URL: `http://localhost:8080/api`
Frontend dev server: `http://localhost:5173` (CORS deve permitir esta origem)
Todos os corpos em JSON. Sem autenticação (single-user).

## Modelos

MovieSummary:
{ "id": 1, "title": "...", "year": 2010, "genre": "Sci-Fi",
  "posterUrl": "https://...", "avgRating": 8.4, "favorite": false }

MovieDetail = MovieSummary +
{ "synopsis": "...", "durationMin": 148, "director": "...", "reviewCount": 3 }

Review:
{ "id": 1, "author": "Lucas", "rating": 9, "comment": "...", "createdAt": "2026-07-22T10:00:00Z" }

## Endpoints

GET  /movies?page=0&size=12&search=&genre=
  → 200, formato Page do Spring: { "content": [MovieSummary], "totalPages": n,
    "totalElements": n, "number": 0, "size": 12 }
  `search` filtra por título (case-insensitive, contém).
  `genre` filtra por gênero exato. Ambos opcionais e combináveis.

GET  /movies/{id}            → 200 MovieDetail | 404
GET  /genres                 → 200 ["Action", "Drama", ...] (distintos, ordenados)

GET  /favorites              → 200 [MovieSummary]
POST /favorites/{movieId}    → 201 (idempotente: repetir não duplica) | 404 se filme não existe
DELETE /favorites/{movieId}  → 204 (idempotente)

GET  /movies/{id}/reviews    → 200 [Review] (mais recente primeiro) | 404
POST /movies/{id}/reviews    → 201 Review | 404 | 400 se inválido
  body: { "author": string 1..60, "rating": int 1..10, "comment": string 0..500 }

## Erros

Formato padrão: { "timestamp": "...", "status": 404, "message": "Movie not found" }
400 de validação: { "timestamp": "...", "status": 400, "message": "...", "errors": { "campo": "motivo" } }
