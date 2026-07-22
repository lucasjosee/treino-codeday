package com.hotflix.service;

import com.hotflix.dto.CreateReviewRequest;
import com.hotflix.dto.ReviewResponse;
import com.hotflix.exception.MovieNotFoundException;
import com.hotflix.model.Movie;
import com.hotflix.model.Review;
import com.hotflix.repository.MovieRepository;
import com.hotflix.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void returnReviewsInRepositoryOrder() {
        Instant newestTime = Instant.parse("2026-07-22T12:00:00Z");
        Review newest = review("Bia", 9, "Excellent", newestTime);
        Review older = review("Leo", 7, "Good", Instant.parse("2026-07-20T12:00:00Z"));
        when(movieRepository.existsById(1L)).thenReturn(true);
        when(reviewRepository.findAllByMovieIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(newest, older));

        List<ReviewResponse> result = reviewService.findReviews(1L);

        assertThat(result).extracting(ReviewResponse::author).containsExactly("Bia", "Leo");
        assertThat(result.get(0).createdAt()).isEqualTo(newestTime);
    }

    @Test
    void rejectReviewForUnknownMovie() {
        when(movieRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.createReview(
                99L,
                new CreateReviewRequest("Ana", 8, "Good")
        )).isInstanceOf(MovieNotFoundException.class);

        verify(reviewRepository, never()).save(any());
    }

    @Test
    void createAndMapReview() {
        Movie movie = new Movie(
                "Inception",
                2010,
                "Sci-Fi",
                "https://example.com/poster.jpg",
                "A thief enters dreams.",
                148,
                "Christopher Nolan"
        );
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReviewResponse result = reviewService.createReview(
                1L,
                new CreateReviewRequest("Ana", 8, "Worth watching")
        );

        assertThat(result.author()).isEqualTo("Ana");
        assertThat(result.rating()).isEqualTo(8);
        assertThat(result.comment()).isEqualTo("Worth watching");
        assertThat(result.createdAt()).isNotNull();
    }

    private Review review(String author, int rating, String comment, Instant createdAt) {
        return new Review(null, author, rating, comment, createdAt);
    }
}
