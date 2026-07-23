package com.hotflix.service;

import com.hotflix.dto.MovieDetail;
import com.hotflix.dto.MovieSummary;
import com.hotflix.exception.MovieNotFoundException;
import com.hotflix.repository.MovieRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Page<MovieSummary> findMovies(String search, String genre, Pageable pageable) {
        String normalizedSearch = normalize(search);
        String normalizedGenre = normalizedSearch.isBlank() ? normalize(genre) : "";
        return movieRepository.findSummaries(normalizedSearch, normalizedGenre, pageable);
    }

    public MovieDetail findMovie(Long id) {
        return movieRepository.findDetailById(id).orElseThrow(MovieNotFoundException::new);
    }

    public List<String> findGenres() {
        return movieRepository.findDistinctGenres();
    }

    private String normalize(String value) {
        return value == null ? "" : value;
    }
}
