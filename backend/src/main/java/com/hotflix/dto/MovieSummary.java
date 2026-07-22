package com.hotflix.dto;

public record MovieSummary(
        Long id,
        String title,
        Integer year,
        String genre,
        String posterUrl,
        Double avgRating,
        Boolean favorite
) {
}
