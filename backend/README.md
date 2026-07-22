# HotFlix API

Backend do catálogo HotFlix, desenvolvido com Java 17, Spring Boot, Maven, PostgreSQL e Flyway.

## Pré-requisitos

- Java 17
- Maven 3.9+
- Docker com Docker Compose

## Executar

Na raiz do monorepo, suba o PostgreSQL:

```bash
docker compose up -d
```

Depois, na pasta `backend/`, execute a API:

```bash
mvn spring-boot:run
```

A API fica disponível em `http://localhost:8080/api`. A conexão usa por padrão o banco `hotflix` em `localhost:5432`, com usuário e senha `hotflix`. Os valores podem ser sobrescritos pelas variáveis `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `SERVER_PORT`.

## Testar

Na pasta `backend/`:

```bash
mvn verify
```
