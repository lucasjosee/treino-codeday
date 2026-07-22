package com.hotflix.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false, length = 60)
    private String author;

    @Column(nullable = false)
    private Short rating;

    @Column(nullable = false, length = 500)
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Review() {
    }

    public Review(Movie movie, String author, Integer rating, String comment, Instant createdAt) {
        this.movie = movie;
        this.author = author;
        this.rating = rating.shortValue();
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Movie getMovie() {
        return movie;
    }

    public String getAuthor() {
        return author;
    }

    public Integer getRating() {
        return rating.intValue();
    }

    public String getComment() {
        return comment;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
