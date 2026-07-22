package com.hotflix.controller;

import com.hotflix.dto.MovieSummary;
import com.hotflix.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<MovieSummary> findFavorites() {
        return favoriteService.findFavorites();
    }

    @PostMapping("/{movieId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addFavorite(@PathVariable Long movieId) {
        favoriteService.addFavorite(movieId);
    }

    @DeleteMapping("/{movieId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(@PathVariable Long movieId) {
        favoriteService.removeFavorite(movieId);
    }
}
