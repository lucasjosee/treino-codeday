package com.hotflix.controller;

import com.hotflix.dto.CreateReviewRequest;
import com.hotflix.dto.ReviewResponse;
import com.hotflix.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<ReviewResponse> findReviews(@PathVariable Long movieId) {
        return reviewService.findReviews(movieId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(
            @PathVariable Long movieId,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return reviewService.createReview(movieId, request);
    }
}
