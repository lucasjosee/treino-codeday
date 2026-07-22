package com.hotflix.controller;

import com.hotflix.dto.MovieDetail;
import com.hotflix.dto.MovieSummary;
import com.hotflix.dto.PageResponse;
import com.hotflix.service.MovieService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.data.domain.Sort.Direction.ASC;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public PageResponse<MovieSummary> findMovies(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @PageableDefault(size = 12, sort = "id", direction = ASC) Pageable pageable
    ) {
        return PageResponse.from(movieService.findMovies(search, genre, pageable));
    }

    @GetMapping("/{id}")
    public MovieDetail findMovie(@PathVariable Long id) {
        return movieService.findMovie(id);
    }
}
