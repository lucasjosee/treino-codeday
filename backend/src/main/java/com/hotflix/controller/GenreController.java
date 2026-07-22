package com.hotflix.controller;

import com.hotflix.service.MovieService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final MovieService movieService;

    public GenreController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<String> findGenres() {
        return movieService.findGenres();
    }
}
