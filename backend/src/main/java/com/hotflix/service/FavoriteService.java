package com.hotflix.service;

import com.hotflix.dto.MovieSummary;
import com.hotflix.exception.MovieNotFoundException;
import com.hotflix.repository.FavoriteRepository;
import com.hotflix.repository.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final MovieRepository movieRepository;
    private final FavoriteRepository favoriteRepository;

    public FavoriteService(MovieRepository movieRepository, FavoriteRepository favoriteRepository) {
        this.movieRepository = movieRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Transactional(readOnly = true)
    public List<MovieSummary> findFavorites() {
        return movieRepository.findFavoriteSummaries();
    }

    @Transactional
    public void addFavorite(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new MovieNotFoundException();
        }
        if (favoriteRepository.deleteByMovieId(movieId) == 0) {
            favoriteRepository.insertIfAbsent(movieId);
        }
    }

    @Transactional
    public void removeFavorite(Long movieId) {
        favoriteRepository.deleteByMovieId(movieId);
    }
}
