package com.hotflix.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateReviewRequest(
        @NotBlank(message = "must not be blank")
        @Size(max = 60, message = "must have at most 60 characters")
        String author,

        @NotNull(message = "must not be null")
        @Min(value = 1, message = "must be at least 1")
        @Max(value = 10, message = "must be at most 10")
        Integer rating,

        @NotNull(message = "must not be null")
        @Size(max = 500, message = "must have at most 500 characters")
        String comment
) {
}
