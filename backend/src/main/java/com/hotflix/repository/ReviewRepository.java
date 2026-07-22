package com.hotflix.repository;

import com.hotflix.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findAllByMovieIdOrderByCreatedAtDesc(Long movieId);
}
