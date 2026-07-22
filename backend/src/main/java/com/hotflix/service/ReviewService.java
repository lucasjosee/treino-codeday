package com.hotflix.service;

import com.hotflix.dto.CreateReviewRequest;
import com.hotflix.dto.ReviewResponse;
import com.hotflix.exception.MovieNotFoundException;
import com.hotflix.model.Movie;
import com.hotflix.model.Review;
import com.hotflix.repository.MovieRepository;
import com.hotflix.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewService {

    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public ReviewService(MovieRepository movieRepository, ReviewRepository reviewRepository) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> findReviews(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new MovieNotFoundException();
        }

        return reviewRepository.findAllByMovieIdOrderByCreatedAtDesc(movieId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse createReview(Long movieId, CreateReviewRequest request) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(MovieNotFoundException::new);
        Review review = new Review(
                movie,
                request.author(),
                request.rating(),
                request.comment(),
                Instant.now()
        );

        return toResponse(reviewRepository.save(review));
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getAuthor(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
