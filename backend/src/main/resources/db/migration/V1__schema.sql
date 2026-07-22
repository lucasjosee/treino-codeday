CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    release_year INTEGER NOT NULL CHECK (release_year >= 1888),
    genre VARCHAR(80) NOT NULL,
    poster_url VARCHAR(500) NOT NULL,
    synopsis TEXT NOT NULL,
    duration_min INTEGER NOT NULL CHECK (duration_min > 0),
    director VARCHAR(160) NOT NULL
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    author VARCHAR(60) NOT NULL CHECK (char_length(author) BETWEEN 1 AND 60),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
    comment VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL UNIQUE REFERENCES movies(id) ON DELETE CASCADE
);

CREATE INDEX idx_movies_lower_title ON movies (LOWER(title));
CREATE INDEX idx_movies_genre ON movies (genre);
CREATE INDEX idx_reviews_movie_created_at ON reviews (movie_id, created_at DESC);
