package com.hotflix.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "release_year", nullable = false)
    private Integer year;

    @Column(nullable = false, length = 80)
    private String genre;

    @Column(name = "poster_url", nullable = false, length = 500)
    private String posterUrl;

    @Column(nullable = false, columnDefinition = "text")
    private String synopsis;

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin;

    @Column(nullable = false, length = 160)
    private String director;

    protected Movie() {
    }

    public Movie(
            String title,
            Integer year,
            String genre,
            String posterUrl,
            String synopsis,
            Integer durationMin,
            String director
    ) {
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.posterUrl = posterUrl;
        this.synopsis = synopsis;
        this.durationMin = durationMin;
        this.director = director;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getYear() {
        return year;
    }

    public String getGenre() {
        return genre;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public Integer getDurationMin() {
        return durationMin;
    }

    public String getDirector() {
        return director;
    }
}
