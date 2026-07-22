package com.hotflix.exception;

public class MovieNotFoundException extends RuntimeException {

    public MovieNotFoundException() {
        super("Movie not found");
    }
}
