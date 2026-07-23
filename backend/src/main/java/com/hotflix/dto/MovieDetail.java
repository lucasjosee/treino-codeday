package com.hotflix.dto;

public record MovieDetail(
        Long id,
        String title,
        Integer year,
        String genre,
        String posterUrl,
        Double avgRating,
        Boolean favorite,
        String synopsis,
        Integer durationMin,
        String director,
        Long reviewCount
) {
    public MovieDetail {
        avgRating = Math.round(avgRating * 10.0) / 10.0;
    }
}
