package com.hotflix.controller;

import com.hotflix.dto.MovieDetail;
import com.hotflix.exception.MovieNotFoundException;
import com.hotflix.service.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MovieController.class)
@Import(MovieControllerWebTest.StubConfig.class)
class MovieControllerWebTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StubMovieService movieService;

    @BeforeEach
    void resetService() {
        movieService.reset();
    }

    @Test
    void returnMovieDetail() throws Exception {
        movieService.returnDetail(new MovieDetail(
                1L,
                "Inception",
                2010,
                "Sci-Fi",
                "https://picsum.photos/seed/movie1/300/450",
                9.5,
                true,
                "A thief enters dreams.",
                148,
                "Christopher Nolan",
                2L
        ));

        mockMvc.perform(get("/api/movies/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Inception"))
                .andExpect(jsonPath("$.year").value(2010))
                .andExpect(jsonPath("$.genre").value("Sci-Fi"))
                .andExpect(jsonPath("$.avgRating").value(9.5))
                .andExpect(jsonPath("$.favorite").value(true))
                .andExpect(jsonPath("$.durationMin").value(148))
                .andExpect(jsonPath("$.director").value("Christopher Nolan"))
                .andExpect(jsonPath("$.reviewCount").value(2));
    }

    @Test
    void returnContractErrorWhenMovieDoesNotExist() throws Exception {
        movieService.failWith(new MovieNotFoundException());

        mockMvc.perform(get("/api/movies/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.timestamp").isString())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Movie not found"))
                .andExpect(jsonPath("$.path").doesNotExist())
                .andExpect(jsonPath("$.error").doesNotExist());
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class StubConfig {

        @Bean
        StubMovieService movieService() {
            return new StubMovieService();
        }
    }

    static class StubMovieService extends MovieService {

        private MovieDetail detail;
        private RuntimeException failure;

        StubMovieService() {
            super(null);
        }

        void returnDetail(MovieDetail detail) {
            this.detail = detail;
        }

        void failWith(RuntimeException failure) {
            this.failure = failure;
        }

        void reset() {
            detail = null;
            failure = null;
        }

        @Override
        public MovieDetail findMovie(Long id) {
            if (failure != null) {
                throw failure;
            }
            return detail;
        }
    }
}
