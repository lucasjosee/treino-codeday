package com.hotflix.repository;

import com.hotflix.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Modifying
    @Query(value = "INSERT INTO favorites (movie_id) VALUES (:movieId) ON CONFLICT (movie_id) DO NOTHING", nativeQuery = true)
    int insertIfAbsent(@Param("movieId") Long movieId);

    long deleteByMovieId(Long movieId);
}
