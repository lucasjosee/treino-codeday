package com.hotflix.service;

import com.hotflix.exception.MovieNotFoundException;
import com.hotflix.repository.FavoriteRepository;
import com.hotflix.repository.MovieRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    void addFavoriteIdempotentlyWhenMovieExists() {
        when(movieRepository.existsById(3L)).thenReturn(true);

        favoriteService.addFavorite(3L);

        verify(favoriteRepository).insertIfAbsent(3L);
    }

    @Test
    void rejectFavoriteForUnknownMovie() {
        when(movieRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> favoriteService.addFavorite(99L))
                .isInstanceOf(MovieNotFoundException.class)
                .hasMessage("Movie not found");

        verify(favoriteRepository, never()).insertIfAbsent(99L);
    }

    @Test
    void removeFavoriteWithoutRequiringMovieOrFavoriteToExist() {
        favoriteService.removeFavorite(42L);

        verify(favoriteRepository).deleteByMovieId(42L);
        verify(movieRepository, never()).existsById(42L);
    }
}
