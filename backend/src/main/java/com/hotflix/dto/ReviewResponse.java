package com.hotflix.dto;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        String author,
        Integer rating,
        String comment,
        Instant createdAt
) {
}
